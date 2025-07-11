import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

class PhoneNumberManager {
  constructor() {
    // Initialize Twilio
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Initialize Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Search for available phone numbers
  async searchAvailableNumbers(areaCode, contains = null) {
    try {
      const searchParams = {
        areaCode,
        capabilities: {
          voice: true,
          sms: true
        },
        limit: 20
      };
      
      if (contains) {
        searchParams.contains = contains;
      }
      
      const numbers = await this.twilioClient
        .availablePhoneNumbers('US')
        .local
        .list(searchParams);
      
      return numbers.map(num => ({
        phoneNumber: num.phoneNumber,
        friendlyName: num.friendlyName,
        locality: num.locality,
        region: num.region,
        postalCode: num.postalCode,
        capabilities: num.capabilities,
        monthlyFee: '$1.15' // Twilio local number cost
      }));
    } catch (error) {
      console.error('Error searching numbers:', error);
      throw error;
    }
  }

  // Purchase a phone number for a client
  async purchaseNumber(phoneNumber, clientId, clientName) {
    try {
      // Create subaccount for client (optional but recommended)
      const subaccount = await this.twilioClient.api.accounts.create({
        friendlyName: clientName
      });
      
      // Purchase the number under subaccount
      const purchasedNumber = await this.twilioClient(subaccount.sid)
        .incomingPhoneNumbers
        .create({
          phoneNumber,
          friendlyName: clientName,
          voiceUrl: `${process.env.BACKEND_URL}/voice/incoming`,
          voiceMethod: 'POST',
          statusCallback: `${process.env.BACKEND_URL}/voice/status`,
          statusCallbackMethod: 'POST',
          smsUrl: `${process.env.BACKEND_URL}/sms/incoming`,
          smsMethod: 'POST'
        });
      
      // Store in database
      const { data, error } = await this.supabase
        .from('phone_numbers')
        .insert({
          phone_number: phoneNumber,
          phone_sid: purchasedNumber.sid,
          account_sid: subaccount.sid,
          client_id: clientId,
          client_name: clientName,
          friendly_name: clientName,
          capabilities: purchasedNumber.capabilities,
          status: 'active',
          monthly_fee: 1.15,
          voice_settings: {
            enabled: true,
            voiceModel: 'aura-2-thalia-en',
            greetingMessage: `Thank you for calling ${clientName}. How can I help you today?`,
            personality: 'professional'
          }
        });
      
      if (error) throw error;
      
      return {
        success: true,
        phoneNumber,
        phoneSid: purchasedNumber.sid,
        subaccountSid: subaccount.sid,
        data
      };
    } catch (error) {
      console.error('Error purchasing number:', error);
      throw error;
    }
  }

  // Get all managed phone numbers
  async getManagedNumbers(clientId = null) {
    try {
      let query = this.supabase
        .from('phone_numbers')
        .select('*')
        .eq('status', 'active');
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting managed numbers:', error);
      throw error;
    }
  }

  // Update phone number settings
  async updateNumberSettings(phoneNumber, settings) {
    try {
      const { data, error } = await this.supabase
        .from('phone_numbers')
        .update({
          voice_settings: settings,
          updated_at: new Date().toISOString()
        })
        .eq('phone_number', phoneNumber);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Release a phone number
  async releaseNumber(phoneNumber) {
    try {
      // Get number details from database
      const { data: numberData } = await this.supabase
        .from('phone_numbers')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();
      
      if (!numberData) {
        throw new Error('Phone number not found in database');
      }
      
      // Delete from Twilio
      await this.twilioClient(numberData.account_sid)
        .incomingPhoneNumbers(numberData.phone_sid)
        .remove();
      
      // Mark as inactive in database
      await this.supabase
        .from('phone_numbers')
        .update({ 
          status: 'released',
          released_at: new Date().toISOString()
        })
        .eq('phone_number', phoneNumber);
      
      return { success: true, message: 'Number released successfully' };
    } catch (error) {
      console.error('Error releasing number:', error);
      throw error;
    }
  }

  // Get usage statistics for billing
  async getUsageStats(phoneNumber, startDate, endDate) {
    try {
      const { data, error } = await this.supabase
        .from('call_logs')
        .select('*')
        .eq('to_number', phoneNumber)
        .gte('created_at', startDate)
        .lte('created_at', endDate);
      
      if (error) throw error;
      
      const stats = {
        totalCalls: data.length,
        totalMinutes: data.reduce((sum, call) => sum + (call.duration || 0), 0),
        avgCallDuration: data.length > 0 ? 
          data.reduce((sum, call) => sum + (call.duration || 0), 0) / data.length : 0,
        uniqueCallers: new Set(data.map(call => call.from_number)).size
      };
      
      return stats;
    } catch (error) {
      console.error('Error getting usage stats:', error);
      throw error;
    }
  }
}

export default PhoneNumberManager;