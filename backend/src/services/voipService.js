import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import dotenv from 'dotenv';
import TranscriptionService from './transcriptionService.js';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Twilio client for SMS
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class VoIPService {
  constructor() {
    this.apiUrl = 'https://voip.ms/api/v1/rest.php';
    this.username = process.env.VOIPMS_USERNAME;
    this.password = process.env.VOIPMS_PASSWORD;
    this.did = process.env.VOIPMS_DID; // VoIP.ms phone number
    this.transcriptionService = new TranscriptionService();
    
    // Auto-response configurations
    this.autoResponses = {
      appointment: {
        keywords: ['appointment', 'schedule', 'book', 'available', 'availability'],
        response: 'Thank you for your interest in scheduling an appointment! Please visit our website at gregpedromd.com or call us at (XXX) XXX-XXXX during business hours. Our team will be happy to assist you.'
      },
      emergency: {
        keywords: ['emergency', 'urgent', 'pain', 'bleeding', 'swelling'],
        response: 'For dental emergencies, please call our emergency line at (XXX) XXX-XXXX. If this is a life-threatening emergency, please call 911 immediately.'
      },
      hours: {
        keywords: ['hours', 'open', 'closed', 'time', 'when'],
        response: 'Our office hours are Monday-Friday 8:00 AM - 5:00 PM. We are closed on weekends. For appointments, please call (XXX) XXX-XXXX.'
      },
      location: {
        keywords: ['location', 'address', 'where', 'directions'],
        response: 'We are located at [Your Address]. Visit gregpedromd.com for detailed directions and parking information.'
      },
      insurance: {
        keywords: ['insurance', 'coverage', 'accept', 'plan'],
        response: 'We accept most major dental insurance plans. Please call our office at (XXX) XXX-XXXX to verify your specific coverage.'
      }
    };
  }

  // Make API request to VoIP.ms
  async makeRequest(method, params = {}) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          api_username: this.username,
          api_password: this.password,
          method,
          ...params
        }
      });

      if (response.data.status !== 'success') {
        throw new Error(`VoIP.ms API error: ${response.data.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('VoIP.ms API request failed:', error);
      throw error;
    }
  }

  // Get SMS messages
  async getSMSMessages(from = null, to = null, limit = 100) {
    try {
      const params = {
        did: this.did,
        limit
      };

      if (from) params.from = from;
      if (to) params.to = to;

      const response = await this.makeRequest('getSMS', params);
      return response.sms || [];
    } catch (error) {
      console.error('Error getting SMS messages:', error);
      return [];
    }
  }

  // Send SMS message
  async sendSMS(destination, message) {
    try {
      const response = await this.makeRequest('sendSMS', {
        did: this.did,
        dst: destination,
        message
      });

      // Store sent message in database
      await this.storeSMSMessage({
        from: this.did,
        to: destination,
        message,
        direction: 'outbound',
        status: 'sent',
        sid: response.sms_id
      });

      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  // Process incoming SMS with auto-response
  async processIncomingSMS(from, message, smsId) {
    try {
      // Store incoming message
      await this.storeSMSMessage({
        from,
        to: this.did,
        message,
        direction: 'inbound',
        status: 'received',
        sid: smsId
      });

      // Check for auto-response triggers
      const autoResponse = this.getAutoResponse(message);
      
      if (autoResponse) {
        // Send auto-response
        await this.sendSMS(from, autoResponse);
      } else {
        // Store for manual review if no auto-response
        await this.flagForReview(from, message);
      }

    } catch (error) {
      console.error('Error processing incoming SMS:', error);
    }
  }

  // Get appropriate auto-response based on message content
  getAutoResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [category, config] of Object.entries(this.autoResponses)) {
      for (const keyword of config.keywords) {
        if (lowerMessage.includes(keyword)) {
          return config.response;
        }
      }
    }
    
    // Default response if no keywords match
    return 'Thank you for contacting Dr. Pedro\'s office. A team member will respond to your message during business hours. For immediate assistance, please call (XXX) XXX-XXXX.';
  }

  // Store SMS message in Supabase
  async storeSMSMessage(messageData) {
    try {
      // Find or create conversation
      const { data: conversation, error: convError } = await supabase
        .rpc('find_or_create_conversation', {
          p_user_id: null, // System user for VoIP.ms messages
          p_from_number: messageData.from,
          p_to_number: messageData.to
        });

      if (convError) throw convError;

      // Insert message
      const { data, error } = await supabase
        .from('sms_messages')
        .insert({
          conversation_id: conversation,
          message_sid: messageData.sid || `voipms_${Date.now()}`,
          account_sid: 'voipms',
          from_number: messageData.from,
          to_number: messageData.to,
          direction: messageData.direction,
          status: messageData.status,
          body: messageData.message,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing SMS message:', error);
      throw error;
    }
  }

  // Flag message for manual review
  async flagForReview(from, message) {
    try {
      const { data, error } = await supabase
        .from('sms_conversations')
        .update({
          tags: supabase.sql`array_append(tags, 'needs_review')`,
          metadata: {
            flagged_at: new Date().toISOString(),
            flagged_reason: 'No auto-response match'
          }
        })
        .match({ from_number: from });

      if (error) throw error;
    } catch (error) {
      console.error('Error flagging message for review:', error);
    }
  }

  // Get call recordings
  async getCallRecordings(callId = null) {
    try {
      const params = { did: this.did };
      if (callId) params.callid = callId;

      const response = await this.makeRequest('getRecordings', params);
      return response.recordings || [];
    } catch (error) {
      console.error('Error getting call recordings:', error);
      return [];
    }
  }

  // Download and store call recording
  async downloadRecording(recordingId, callSid) {
    try {
      // Get recording file from VoIP.ms
      const response = await this.makeRequest('getRecordingFile', {
        recording: recordingId
      });

      if (!response.file) {
        throw new Error('No recording file returned');
      }

      // Store recording URL in database
      await this.updateCallRecording(callSid, response.file);

      // Optionally transcribe the recording
      if (process.env.ENABLE_TRANSCRIPTION === 'true') {
        await this.transcribeRecording(response.file, callSid);
      }

      return response.file;
    } catch (error) {
      console.error('Error downloading recording:', error);
      throw error;
    }
  }

  // Update call record with recording info
  async updateCallRecording(callSid, recordingUrl) {
    try {
      const { data, error } = await supabase
        .from('phone_calls')
        .update({
          recording_url: recordingUrl,
          updated_at: new Date().toISOString()
        })
        .eq('call_sid', callSid);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating call recording:', error);
      throw error;
    }
  }

  // Transcribe recording using transcription service
  async transcribeRecording(recordingUrl, callSid) {
    try {
      // Transcribe the audio
      const transcription = await this.transcriptionService.transcribeFromUrl(recordingUrl, {
        preferredService: 'auto'
      });
      
      // Extract key information from transcription
      const keyInfo = await this.transcriptionService.extractKeyInfo(transcription.text);
      
      // Generate summary
      const summary = await this.transcriptionService.generateSummary(transcription.text);
      
      // Format transcription data
      const formattedTranscription = this.transcriptionService.formatTranscription(transcription);
      
      // Update call record with transcription
      const { data, error } = await supabase
        .from('phone_calls')
        .update({
          transcription_text: transcription.text,
          transcription_sid: `transcript_${Date.now()}`,
          metadata: {
            transcription: formattedTranscription,
            key_info: keyInfo,
            summary: summary
          },
          updated_at: new Date().toISOString()
        })
        .eq('call_sid', callSid);
      
      if (error) throw error;
      
      console.log('Transcription completed for call:', callSid);
      return {
        transcription: transcription.text,
        keyInfo,
        summary
      };
      
    } catch (error) {
      console.error('Error transcribing recording:', error);
      throw error;
    }
  }

  // Set up SMS webhook for VoIP.ms
  async setupSMSWebhook(webhookUrl) {
    try {
      const response = await this.makeRequest('setSMS', {
        did: this.did,
        enable: 1,
        url_callback_enable: 1,
        url_callback: webhookUrl,
        url_callback_retry: 1
      });

      console.log('SMS webhook configured:', response);
      return response;
    } catch (error) {
      console.error('Error setting up SMS webhook:', error);
      throw error;
    }
  }

  // Get CDR (Call Detail Records)
  async getCallRecords(dateFrom, dateTo) {
    try {
      const response = await this.makeRequest('getCDR', {
        date_from: dateFrom,
        date_to: dateTo,
        timezone: 'America/New_York',
        calltype: 'all'
      });

      return response.cdr || [];
    } catch (error) {
      console.error('Error getting call records:', error);
      return [];
    }
  }

  // Store call record in database
  async storeCallRecord(callData) {
    try {
      const { data, error } = await supabase
        .from('phone_calls')
        .insert({
          call_sid: callData.uniqueid || `voipms_${Date.now()}`,
          account_sid: 'voipms',
          from_number: callData.callerid,
          to_number: callData.destination,
          direction: callData.disposition === 'inbound' ? 'inbound' : 'outbound',
          status: this.mapCallStatus(callData.disposition),
          duration: parseInt(callData.seconds) || 0,
          price: parseFloat(callData.total) || 0,
          price_unit: 'USD',
          started_at: callData.date,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing call record:', error);
      throw error;
    }
  }

  // Map VoIP.ms call status to our schema
  mapCallStatus(disposition) {
    const statusMap = {
      'answered': 'completed',
      'busy': 'busy',
      'noanswer': 'no-answer',
      'failed': 'failed',
      'cancel': 'canceled'
    };

    return statusMap[disposition.toLowerCase()] || 'completed';
  }

  // Send SMS via Twilio (as backup or for specific use cases)
  async sendSMSViaTwilio(to, body) {
    try {
      const message = await twilioClient.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });

      // Store in database
      await this.storeSMSMessage({
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
        message: body,
        direction: 'outbound',
        status: 'sent',
        sid: message.sid
      });

      return message;
    } catch (error) {
      console.error('Error sending SMS via Twilio:', error);
      throw error;
    }
  }

  // Sync call history periodically
  async syncCallHistory() {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const dateFrom = yesterday.toISOString().split('T')[0];
      const dateTo = new Date().toISOString().split('T')[0];

      const calls = await this.getCallRecords(dateFrom, dateTo);
      
      for (const call of calls) {
        await this.storeCallRecord(call);
        
        // Check if call has recording
        if (call.recording === '1') {
          await this.downloadRecording(call.uniqueid, call.uniqueid);
        }
      }

      console.log(`Synced ${calls.length} call records`);
    } catch (error) {
      console.error('Error syncing call history:', error);
    }
  }

  // Get analytics data
  async getAnalytics(startDate, endDate) {
    try {
      // Get call statistics
      const { data: callStats, error: callError } = await supabase
        .from('phone_calls')
        .select('direction, status, duration')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (callError) throw callError;

      // Get SMS statistics
      const { data: smsStats, error: smsError } = await supabase
        .from('sms_messages')
        .select('direction, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (smsError) throw smsError;

      // Calculate analytics
      const analytics = {
        calls: {
          total: callStats.length,
          inbound: callStats.filter(c => c.direction === 'inbound').length,
          outbound: callStats.filter(c => c.direction === 'outbound').length,
          averageDuration: callStats.reduce((sum, c) => sum + c.duration, 0) / callStats.length || 0,
          completionRate: callStats.filter(c => c.status === 'completed').length / callStats.length || 0
        },
        sms: {
          total: smsStats.length,
          sent: smsStats.filter(s => s.direction === 'outbound').length,
          received: smsStats.filter(s => s.direction === 'inbound').length,
          deliveryRate: smsStats.filter(s => s.status === 'delivered' || s.status === 'sent').length / 
                       smsStats.filter(s => s.direction === 'outbound').length || 0
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
}

export default VoIPService;