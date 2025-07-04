import axios from 'axios';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import pQueue from 'p-queue';
import retry from 'async-retry';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Comprehensive VoIP.ms Service Integration Module
 * Handles calls, SMS, voicemail, call forwarding, and advanced features
 */
class VoIPMSService extends EventEmitter {
  constructor() {
    super();
    
    // API Configuration
    this.apiUrl = 'https://voip.ms/api/v1/rest.php';
    this.username = process.env.VOIPMS_USERNAME;
    this.password = process.env.VOIPMS_PASSWORD;
    this.did = process.env.VOIPMS_DID;
    
    // Rate limiting queue (VoIP.ms allows 2 requests per second)
    this.requestQueue = new pQueue({ 
      concurrency: 2, 
      interval: 1000, 
      intervalCap: 2 
    });
    
    // Cache for frequently accessed data
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
    
    // Webhook signatures for security
    this.webhookSecret = process.env.VOIPMS_WEBHOOK_SECRET || crypto.randomBytes(32).toString('hex');
    
    // Initialize sub-services
    this.initializeServices();
  }

  /**
   * Initialize sub-services and configurations
   */
  initializeServices() {
    // Auto-response system
    this.autoResponseSystem = {
      enabled: true,
      businessHours: {
        timezone: 'America/New_York',
        schedule: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: { open: '09:00', close: '13:00' },
          sunday: null // Closed
        }
      },
      responses: {
        appointment: {
          keywords: ['appointment', 'schedule', 'book', 'available', 'availability', 'opening'],
          response: 'Thank you for your interest in scheduling an appointment! 📅 Please visit gregpedromd.com/book or call us at {phone} during business hours. Our team will be happy to assist you.',
          priority: 'high'
        },
        emergency: {
          keywords: ['emergency', 'urgent', 'pain', 'bleeding', 'swelling', 'severe', 'accident'],
          response: '🚨 For dental emergencies, please call our emergency line at {emergency_phone}. If this is a life-threatening emergency, please call 911 immediately.',
          priority: 'urgent'
        },
        hours: {
          keywords: ['hours', 'open', 'closed', 'time', 'when', 'schedule'],
          response: '🕐 Our office hours are:\n{business_hours}\n\nFor appointments, please call {phone}.',
          priority: 'medium'
        },
        location: {
          keywords: ['location', 'address', 'where', 'directions', 'parking', 'find'],
          response: '📍 We are located at:\n{address}\n\nVisit gregpedromd.com/directions for detailed directions and parking information.',
          priority: 'medium'
        },
        insurance: {
          keywords: ['insurance', 'coverage', 'accept', 'plan', 'medicaid', 'medicare', 'dental plan'],
          response: '💳 We accept most major dental insurance plans including:\n{insurance_list}\n\nPlease call {phone} to verify your specific coverage.',
          priority: 'high'
        },
        services: {
          keywords: ['services', 'procedures', 'treatment', 'offer', 'provide', 'cleaning', 'filling'],
          response: '🦷 We offer comprehensive dental services including:\n{services_list}\n\nVisit gregpedromd.com/services for more details.',
          priority: 'medium'
        },
        pricing: {
          keywords: ['price', 'cost', 'payment', 'financing', 'expensive', 'afford'],
          response: '💰 We offer competitive pricing and flexible payment options. For specific pricing information, please call {phone}. We also offer financing through CareCredit.',
          priority: 'high'
        }
      }
    };

    // Call routing configuration
    this.callRouting = {
      businessHours: {
        forward_to: process.env.VOIPMS_FORWARD_NUMBER,
        voicemail_after: 30 // seconds
      },
      afterHours: {
        voicemail_immediately: true,
        emergency_option: true,
        emergency_forward: process.env.VOIPMS_EMERGENCY_NUMBER
      },
      holidays: [] // Array of dates in YYYY-MM-DD format
    };

    // IVR (Interactive Voice Response) menu structure
    this.ivrMenu = {
      main: {
        greeting: 'Thank you for calling Dr. Pedro\'s dental office.',
        options: {
          '1': { 
            action: 'transfer', 
            destination: 'appointments',
            description: 'Schedule an appointment'
          },
          '2': { 
            action: 'transfer', 
            destination: 'billing',
            description: 'Billing and insurance'
          },
          '3': { 
            action: 'info', 
            message: 'office_hours',
            description: 'Office hours and location'
          },
          '9': { 
            action: 'transfer', 
            destination: 'emergency',
            description: 'Dental emergency'
          },
          '0': { 
            action: 'transfer', 
            destination: 'operator',
            description: 'Speak to a team member'
          }
        }
      }
    };
  }

  /**
   * Make authenticated API request to VoIP.ms with retry logic
   */
  async makeRequest(method, params = {}) {
    return this.requestQueue.add(async () => {
      try {
        const response = await retry(
          async (bail) => {
            const result = await axios.get(this.apiUrl, {
              params: {
                api_username: this.username,
                api_password: this.password,
                method,
                ...params
              },
              timeout: 30000
            });

            if (result.data.status === 'invalid_credentials') {
              bail(new Error('Invalid VoIP.ms credentials'));
            }

            if (result.data.status !== 'success') {
              throw new Error(`VoIP.ms API error: ${result.data.status}`);
            }

            return result.data;
          },
          {
            retries: 3,
            factor: 2,
            minTimeout: 1000,
            maxTimeout: 5000
          }
        );

        return response;
      } catch (error) {
        console.error(`VoIP.ms API request failed for method ${method}:`, error);
        this.emit('api_error', { method, error });
        throw error;
      }
    });
  }

  /**
   * Account Management Methods
   */
  async getAccountInfo() {
    const cacheKey = 'account_info';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const response = await this.makeRequest('getBalance');
    const accountInfo = {
      balance: response.balance,
      balance_currency: response.balance_currency,
      spent_total: response.spent_total,
      callsTotal: response.calls_total,
      timeTotal: response.time_total
    };

    this.setCache(cacheKey, accountInfo);
    return accountInfo;
  }

  async getSubAccounts() {
    const response = await this.makeRequest('getSubAccounts');
    return response.accounts || [];
  }

  /**
   * DID (Phone Number) Management
   */
  async getDIDs() {
    const response = await this.makeRequest('getDIDsInfo');
    return response.dids || [];
  }

  async getDIDInfo(did = null) {
    const response = await this.makeRequest('getDIDsInfo', {
      did: did || this.did
    });
    return response.dids?.[0] || null;
  }

  async updateDIDRouting(routing) {
    return await this.makeRequest('setDIDRouting', {
      did: this.did,
      routing: routing.type || 'account',
      failover_enabled: routing.failover_enabled ? '1' : '0',
      failover_destination: routing.failover_destination || '',
      ...routing
    });
  }

  /**
   * SMS Methods
   */
  async sendSMS(destination, message, options = {}) {
    try {
      // Validate phone number
      const cleanDest = this.cleanPhoneNumber(destination);
      
      // Check message length (VoIP.ms limit is 160 characters)
      const messages = this.splitSMSMessage(message);
      const results = [];

      for (const msgPart of messages) {
        const response = await this.makeRequest('sendSMS', {
          did: options.from || this.did,
          dst: cleanDest,
          message: msgPart
        });

        // Store sent message
        await this.storeSMSMessage({
          from: options.from || this.did,
          to: cleanDest,
          message: msgPart,
          direction: 'outbound',
          status: 'sent',
          sid: response.sms_id,
          metadata: {
            campaign: options.campaign,
            tags: options.tags,
            scheduled: options.scheduled
          }
        });

        results.push(response);
      }

      this.emit('sms_sent', { to: cleanDest, messages: messages.length });
      return results;
    } catch (error) {
      console.error('Error sending SMS:', error);
      this.emit('sms_error', { to: destination, error });
      throw error;
    }
  }

  async getSMSMessages(filters = {}) {
    const params = {
      did: filters.did || this.did,
      limit: filters.limit || 100,
      timezone: filters.timezone || 'America/New_York'
    };

    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.date_from) params.date_from = filters.date_from;
    if (filters.date_to) params.date_to = filters.date_to;
    if (filters.type) params.type = filters.type; // 1=received, 0=sent

    const response = await this.makeRequest('getSMS', params);
    return response.sms || [];
  }

  async deleteSMS(smsId) {
    return await this.makeRequest('deleteSMS', { id: smsId });
  }

  /**
   * Process incoming SMS with intelligent routing
   */
  async processIncomingSMS(data) {
    try {
      const { from, to, message, id } = data;
      
      // Store incoming message
      await this.storeSMSMessage({
        from,
        to,
        message,
        direction: 'inbound',
        status: 'received',
        sid: id
      });

      // Check if within business hours
      const isBusinessHours = this.isWithinBusinessHours();
      
      // Analyze message intent
      const intent = await this.analyzeMessageIntent(message);
      
      // Get or create conversation context
      const context = await this.getConversationContext(from);
      
      // Determine response strategy
      let response = null;
      
      if (intent.priority === 'urgent') {
        // Urgent messages get immediate response and notification
        response = this.autoResponseSystem.responses[intent.category].response;
        await this.notifyUrgentMessage(from, message, intent);
      } else if (isBusinessHours && context.hasActiveConversation) {
        // During business hours with active conversation, queue for human response
        await this.queueForHumanResponse(from, message, context);
        response = 'Your message has been received. A team member will respond shortly.';
      } else {
        // Auto-response based on intent
        response = this.getAutoResponse(message, intent, context);
      }

      if (response) {
        // Personalize response
        response = this.personalizeResponse(response, context);
        await this.sendSMS(from, response, { 
          campaign: 'auto_response',
          tags: ['automated', intent.category]
        });
      }

      // Update conversation context
      await this.updateConversationContext(from, {
        lastMessage: message,
        lastIntent: intent,
        lastResponse: response,
        messageCount: (context.messageCount || 0) + 1
      });

    } catch (error) {
      console.error('Error processing incoming SMS:', error);
      this.emit('sms_processing_error', { error, data });
    }
  }

  /**
   * Call Management Methods
   */
  async makeCall(destination, options = {}) {
    const params = {
      from: options.from || this.did,
      to: this.cleanPhoneNumber(destination),
      answermachine_detect: options.detectVoicemail ? 'yes' : 'no',
      record: options.record ? 'yes' : 'no',
      ...options
    };

    const response = await this.makeRequest('createPhoneCall', params);
    
    // Store call initiation
    await this.storeCallRecord({
      uniqueid: response.call_id,
      callerid: params.from,
      destination: params.to,
      direction: 'outbound',
      status: 'initiated',
      metadata: options.metadata
    });

    return response;
  }

  async getCallDetails(callId) {
    const response = await this.makeRequest('getCallDetails', {
      callid: callId
    });
    return response.call || null;
  }

  async getCDR(filters = {}) {
    const params = {
      date_from: filters.date_from || this.getYesterdayDate(),
      date_to: filters.date_to || this.getTodayDate(),
      timezone: filters.timezone || 'America/New_York',
      calltype: filters.calltype || 'all',
      callbilling: filters.callbilling || 'all',
      returned: filters.returned || 'all'
    };

    const response = await this.makeRequest('getCDR', params);
    return response.cdr || [];
  }

  async terminateCall(callId) {
    return await this.makeRequest('terminatePhoneCall', {
      callid: callId
    });
  }

  /**
   * Voicemail Methods
   */
  async getVoicemails(filters = {}) {
    const params = {
      mailbox: filters.mailbox || this.did,
      limit: filters.limit || 100,
      folder: filters.folder || 'INBOX' // INBOX, Old, Urgent, etc.
    };

    const response = await this.makeRequest('getVoicemail', params);
    return response.voicemails || [];
  }

  async getVoicemailFile(voicemailId, format = 'mp3') {
    const response = await this.makeRequest('getVoicemailFile', {
      mailbox: this.did,
      folder: 'INBOX',
      msgnums: voicemailId,
      format: format // mp3, wav, gsm
    });
    
    return response.voicemail_files?.[0] || null;
  }

  async deleteVoicemail(voicemailId, folder = 'INBOX') {
    return await this.makeRequest('delVoicemail', {
      mailbox: this.did,
      folder: folder,
      msgnums: voicemailId
    });
  }

  async moveVoicemail(voicemailId, fromFolder, toFolder) {
    return await this.makeRequest('moveVoicemail', {
      mailbox: this.did,
      folder: fromFolder,
      newfolder: toFolder,
      msgnums: voicemailId
    });
  }

  /**
   * Call Recording Methods
   */
  async getRecordings(filters = {}) {
    const params = {
      date_from: filters.date_from || this.getYesterdayDate(),
      date_to: filters.date_to || this.getTodayDate()
    };

    if (filters.callid) params.callid = filters.callid;

    const response = await this.makeRequest('getRecordings', params);
    return response.recordings || [];
  }

  async getRecordingFile(recordingId) {
    const response = await this.makeRequest('getRecordingFile', {
      recording: recordingId
    });
    
    return response.file || null;
  }

  async deleteRecording(recordingId) {
    return await this.makeRequest('delRecording', {
      recording: recordingId
    });
  }

  /**
   * IVR and Call Flow Methods
   */
  async createIVR(name, options = {}) {
    return await this.makeRequest('createIVR', {
      name,
      recording: options.recording || '',
      timeout: options.timeout || '10',
      language: options.language || 'en',
      voicegender: options.voicegender || 'female',
      ...options
    });
  }

  async updateIVR(ivrId, options = {}) {
    return await this.makeRequest('setIVR', {
      ivr: ivrId,
      ...options
    });
  }

  async getIVRs() {
    const response = await this.makeRequest('getIVRs');
    return response.ivrs || [];
  }

  /**
   * Call Forwarding and Filtering
   */
  async setCallForwarding(rules) {
    const promises = rules.map(rule => {
      return this.makeRequest('setForwarding', {
        did: rule.did || this.did,
        forwarding: rule.enabled ? 'enabled' : 'disabled',
        destination: rule.destination,
        callerid_override: rule.callerid_override || '',
        note: rule.note || ''
      });
    });

    return await Promise.all(promises);
  }

  async setCallFiltering(filters) {
    const promises = filters.map(filter => {
      return this.makeRequest('setCallerIDFiltering', {
        did: filter.did || this.did,
        callerid: filter.callerid,
        routing: filter.routing, // hangup, busy, noservice, disconnected
        note: filter.note || ''
      });
    });

    return await Promise.all(promises);
  }

  /**
   * Webhook Management
   */
  async configureSMSWebhook(webhookUrl) {
    const signedUrl = this.addWebhookSignature(webhookUrl);
    
    return await this.makeRequest('setSMS', {
      did: this.did,
      enable: '1',
      url_callback_enable: '1',
      url_callback: signedUrl,
      url_callback_retry: '1'
    });
  }

  async configureCallWebhook(webhookUrl) {
    const signedUrl = this.addWebhookSignature(webhookUrl);
    
    return await this.makeRequest('setCallback', {
      did: this.did,
      delay: '2', // seconds after call ends
      url_callback: signedUrl,
      url_callback_retry: '1'
    });
  }

  /**
   * Analytics and Reporting
   */
  async getDetailedAnalytics(startDate, endDate, options = {}) {
    try {
      // Fetch all data in parallel
      const [calls, sms, voicemails, accountInfo] = await Promise.all([
        this.getCDR({ date_from: startDate, date_to: endDate }),
        this.getSMSMessages({ date_from: startDate, date_to: endDate }),
        this.getVoicemails(),
        this.getAccountInfo()
      ]);

      // Process call data
      const callAnalytics = this.processCallAnalytics(calls);
      
      // Process SMS data
      const smsAnalytics = this.processSMSAnalytics(sms);
      
      // Process voicemail data
      const voicemailAnalytics = this.processVoicemailAnalytics(voicemails);
      
      // Calculate costs
      const costAnalytics = this.calculateCosts(calls, sms);
      
      // Generate insights
      const insights = this.generateInsights({
        calls: callAnalytics,
        sms: smsAnalytics,
        voicemails: voicemailAnalytics,
        costs: costAnalytics
      });

      return {
        period: { start: startDate, end: endDate },
        account: accountInfo,
        calls: callAnalytics,
        sms: smsAnalytics,
        voicemails: voicemailAnalytics,
        costs: costAnalytics,
        insights,
        generated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw error;
    }
  }

  /**
   * Helper Methods
   */
  cleanPhoneNumber(number) {
    // Remove all non-numeric characters
    let cleaned = number.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.length === 10) {
      cleaned = '1' + cleaned;
    }
    
    return cleaned;
  }

  splitSMSMessage(message) {
    const maxLength = 160;
    const messages = [];
    
    if (message.length <= maxLength) {
      return [message];
    }
    
    // Split message intelligently at word boundaries
    const words = message.split(' ');
    let currentMessage = '';
    
    for (const word of words) {
      if ((currentMessage + ' ' + word).length <= maxLength) {
        currentMessage += (currentMessage ? ' ' : '') + word;
      } else {
        messages.push(currentMessage);
        currentMessage = word;
      }
    }
    
    if (currentMessage) {
      messages.push(currentMessage);
    }
    
    return messages;
  }

  isWithinBusinessHours(date = new Date()) {
    const day = date.toLocaleLowerCase(new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      timeZone: this.autoResponseSystem.businessHours.timezone
    }).format(date)).toLowerCase();
    
    const hours = this.autoResponseSystem.businessHours.schedule[day];
    if (!hours) return false;
    
    const currentTime = date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: this.autoResponseSystem.businessHours.timezone
    });
    
    return currentTime >= hours.open && currentTime <= hours.close;
  }

  async analyzeMessageIntent(message) {
    const lowerMessage = message.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [category, config] of Object.entries(this.autoResponseSystem.responses)) {
      let score = 0;
      for (const keyword of config.keywords) {
        if (lowerMessage.includes(keyword)) {
          score += keyword.length; // Longer matches get higher scores
        }
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { category, priority: config.priority, score };
      }
    }
    
    return bestMatch || { category: 'general', priority: 'low', score: 0 };
  }

  personalizeResponse(response, context) {
    const replacements = {
      '{phone}': process.env.VOIPMS_DISPLAY_NUMBER || this.did,
      '{emergency_phone}': process.env.VOIPMS_EMERGENCY_NUMBER || this.did,
      '{address}': process.env.PRACTICE_ADDRESS || '123 Main St, City, State 12345',
      '{business_hours}': this.formatBusinessHours(),
      '{insurance_list}': this.formatInsuranceList(),
      '{services_list}': this.formatServicesList(),
      '{patient_name}': context.patientName || 'Valued Patient'
    };
    
    let personalizedResponse = response;
    for (const [placeholder, value] of Object.entries(replacements)) {
      personalizedResponse = personalizedResponse.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return personalizedResponse;
  }

  formatBusinessHours() {
    const schedule = this.autoResponseSystem.businessHours.schedule;
    const formatted = [];
    
    for (const [day, hours] of Object.entries(schedule)) {
      if (hours) {
        formatted.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${this.formatTime(hours.open)} - ${this.formatTime(hours.close)}`);
      } else {
        formatted.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: Closed`);
      }
    }
    
    return formatted.join('\n');
  }

  formatTime(time) {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum > 12 ? hourNum - 12 : (hourNum === 0 ? 12 : hourNum);
    return `${hour12}:${minute} ${ampm}`;
  }

  formatInsuranceList() {
    return `• Delta Dental\n• Cigna\n• Aetna\n• Blue Cross Blue Shield\n• MetLife\n• Guardian\n• United Healthcare`;
  }

  formatServicesList() {
    return `• General Dentistry\n• Cosmetic Dentistry\n• Dental Implants\n• Orthodontics\n• Oral Surgery\n• Pediatric Dentistry\n• Emergency Care`;
  }

  addWebhookSignature(url) {
    const timestamp = Date.now();
    const signature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(`${timestamp}:${url}`)
      .digest('hex');
    
    return `${url}?ts=${timestamp}&sig=${signature}`;
  }

  verifyWebhookSignature(url, timestamp, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(`${timestamp}:${url}`)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Cache Management
   */
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearCache() {
    this.cache.clear();
  }

  /**
   * Database Storage Methods
   */
  async storeSMSMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('sms_messages')
        .insert({
          message_sid: messageData.sid || `voipms_${Date.now()}`,
          account_sid: 'voipms',
          from_number: messageData.from,
          to_number: messageData.to,
          direction: messageData.direction,
          status: messageData.status,
          body: messageData.message,
          metadata: messageData.metadata || {},
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing SMS message:', error);
      throw error;
    }
  }

  async storeCallRecord(callData) {
    try {
      const { data, error } = await supabase
        .from('phone_calls')
        .upsert({
          call_sid: callData.uniqueid || `voipms_${Date.now()}`,
          account_sid: 'voipms',
          from_number: callData.callerid,
          to_number: callData.destination,
          direction: callData.direction,
          status: callData.status,
          duration: parseInt(callData.seconds) || 0,
          price: parseFloat(callData.total) || 0,
          price_unit: 'USD',
          metadata: callData.metadata || {},
          started_at: callData.date || new Date().toISOString(),
          created_at: new Date().toISOString()
        }, {
          onConflict: 'call_sid'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error storing call record:', error);
      throw error;
    }
  }

  async getConversationContext(phoneNumber) {
    try {
      const { data, error } = await supabase
        .from('sms_conversations')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      return data || { phone_number: phoneNumber };
    } catch (error) {
      console.error('Error getting conversation context:', error);
      return { phone_number: phoneNumber };
    }
  }

  async updateConversationContext(phoneNumber, updates) {
    try {
      const { data, error } = await supabase
        .from('sms_conversations')
        .upsert({
          phone_number: phoneNumber,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'phone_number'
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating conversation context:', error);
      throw error;
    }
  }

  /**
   * Utility Methods
   */
  getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }

  getTodayDate() {
    return new Date().toISOString().split('T')[0];
  }

  processCallAnalytics(calls) {
    const analytics = {
      total: calls.length,
      inbound: 0,
      outbound: 0,
      answered: 0,
      missed: 0,
      voicemail: 0,
      totalDuration: 0,
      averageDuration: 0,
      peakHours: {},
      uniqueCallers: new Set()
    };

    calls.forEach(call => {
      // Direction
      if (call.direction === 'inbound') analytics.inbound++;
      else analytics.outbound++;
      
      // Disposition
      if (call.disposition === 'answered') analytics.answered++;
      else if (call.disposition === 'noanswer') analytics.missed++;
      else if (call.disposition === 'voicemail') analytics.voicemail++;
      
      // Duration
      analytics.totalDuration += parseInt(call.seconds) || 0;
      
      // Peak hours
      const hour = new Date(call.date).getHours();
      analytics.peakHours[hour] = (analytics.peakHours[hour] || 0) + 1;
      
      // Unique callers
      analytics.uniqueCallers.add(call.callerid);
    });

    analytics.averageDuration = calls.length > 0 ? analytics.totalDuration / calls.length : 0;
    analytics.uniqueCallersCount = analytics.uniqueCallers.size;
    delete analytics.uniqueCallers;

    return analytics;
  }

  processSMSAnalytics(messages) {
    const analytics = {
      total: messages.length,
      sent: 0,
      received: 0,
      autoResponses: 0,
      conversationStarters: 0,
      uniqueNumbers: new Set()
    };

    messages.forEach(msg => {
      if (msg.type === '0') analytics.sent++;
      else analytics.received++;
      
      analytics.uniqueNumbers.add(msg.contact);
    });

    analytics.uniqueNumbersCount = analytics.uniqueNumbers.size;
    delete analytics.uniqueNumbers;

    return analytics;
  }

  processVoicemailAnalytics(voicemails) {
    const analytics = {
      total: voicemails.length,
      new: 0,
      listened: 0,
      urgent: 0,
      averageDuration: 0,
      totalDuration: 0
    };

    voicemails.forEach(vm => {
      if (vm.folder === 'INBOX') analytics.new++;
      else if (vm.folder === 'Old') analytics.listened++;
      else if (vm.folder === 'Urgent') analytics.urgent++;
      
      analytics.totalDuration += parseInt(vm.duration) || 0;
    });

    analytics.averageDuration = voicemails.length > 0 ? analytics.totalDuration / voicemails.length : 0;

    return analytics;
  }

  calculateCosts(calls, sms) {
    let totalCost = 0;
    
    calls.forEach(call => {
      totalCost += parseFloat(call.total) || 0;
    });
    
    // Estimate SMS costs (typically $0.01 per message)
    const smsCost = sms.length * 0.01;
    totalCost += smsCost;
    
    return {
      total: totalCost.toFixed(2),
      calls: calls.reduce((sum, call) => sum + (parseFloat(call.total) || 0), 0).toFixed(2),
      sms: smsCost.toFixed(2)
    };
  }

  generateInsights(analytics) {
    const insights = [];
    
    // Call insights
    if (analytics.calls.missed > analytics.calls.total * 0.2) {
      insights.push({
        type: 'warning',
        category: 'calls',
        message: 'High missed call rate detected. Consider extending business hours or adding staff.'
      });
    }
    
    // SMS insights
    if (analytics.sms.received > analytics.sms.sent) {
      insights.push({
        type: 'info',
        category: 'sms',
        message: 'More incoming messages than outgoing. Consider implementing more auto-responses.'
      });
    }
    
    // Cost insights
    if (parseFloat(analytics.costs.total) > 500) {
      insights.push({
        type: 'warning',
        category: 'costs',
        message: 'High communication costs detected. Review usage patterns for optimization.'
      });
    }
    
    return insights;
  }

  async notifyUrgentMessage(from, message, intent) {
    // Implement notification logic (email, SMS to staff, etc.)
    console.log('Urgent message notification:', { from, message, intent });
    // This could integrate with your notification service
  }

  async queueForHumanResponse(from, message, context) {
    // Implement queuing logic for human response
    await supabase
      .from('sms_queue')
      .insert({
        phone_number: from,
        message,
        context,
        priority: 'normal',
        status: 'pending',
        created_at: new Date().toISOString()
      });
  }

  getAutoResponse(message, intent, context) {
    const response = this.autoResponseSystem.responses[intent.category];
    if (!response) {
      return this.autoResponseSystem.responses.general?.response || 
             'Thank you for your message. We will respond during business hours.';
    }
    return response.response;
  }
}

// Export singleton instance
export default new VoIPMSService();