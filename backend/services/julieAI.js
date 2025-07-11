import WebSocket from 'ws';
import axios from 'axios';
import { Buffer } from 'buffer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import calendarService from './calendarService.js';
import { ElevenLabsTTS } from './elevenLabsTTS.js';
import voiceService from '../voiceService.js';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
);

// Initialize TTS service
let ttsService;
try {
  ttsService = new ElevenLabsTTS({
    voiceId: 'nicole', // Friendly female voice for Julie
    modelId: 'eleven_turbo_v2',
    optimizeLatency: 4
  });
  console.log('ElevenLabs TTS initialized successfully');
} catch (error) {
  console.warn('ElevenLabs TTS not configured, voice features will be limited');
}

// Conversation Context Manager
class ConversationContext {
  constructor() {
    this.messages = [];
    this.patientInfo = {};
    this.appointmentDetails = null;
    this.conversationStage = 'greeting';
    this.emergencyDetected = false;
  }

  addMessage(role, content) {
    this.messages.push({ 
      role, 
      content, 
      timestamp: new Date().toISOString() 
    });
    
    // Keep conversation context manageable
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(-15);
    }
  }

  detectIntent(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Emergency detection
    if (lowerTranscript.match(/\b(emergency|severe pain|bleeding|swelling|urgent|unbearable)\b/)) {
      this.emergencyDetected = true;
      this.conversationStage = 'emergency';
      return 'emergency';
    }
    
    // Appointment booking intent
    if (lowerTranscript.match(/\b(appointment|book|schedule|available|opening)\b/)) {
      this.conversationStage = 'appointment_booking';
      return 'appointment';
    }
    
    // Question about services
    if (lowerTranscript.match(/\b(cost|price|insurance|payment|service|treatment|procedure)\b/)) {
      return 'inquiry';
    }
    
    // Request for human
    if (lowerTranscript.match(/\b(speak to|talk to|human|person|doctor|dr pedro|someone|staff)\b/)) {
      return 'human_request';
    }
    
    return 'general';
  }

  extractPatientInfo(transcript) {
    const info = {};
    
    // Extract name
    const namePatterns = [
      /(?:my name is|i'm|i am|this is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:calling|speaking)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = transcript.match(pattern);
      if (match) {
        info.name = match[1].trim();
        break;
      }
    }
    
    // Extract phone number
    const phonePattern = /\b(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})\b/;
    const phoneMatch = transcript.match(phonePattern);
    if (phoneMatch) {
      info.phone = `${phoneMatch[1]}${phoneMatch[2]}${phoneMatch[3]}`;
    }
    
    // Extract email
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const emailMatch = transcript.match(emailPattern);
    if (emailMatch) {
      info.email = emailMatch[0];
    }
    
    // Extract appointment time preferences
    const timePatterns = {
      'morning': /\b(morning|am|before noon)\b/i,
      'afternoon': /\b(afternoon|pm|after lunch)\b/i,
      'evening': /\b(evening|late|after work|after 5)\b/i
    };
    
    for (const [time, pattern] of Object.entries(timePatterns)) {
      if (pattern.test(transcript)) {
        info.timePreference = time;
        break;
      }
    }
    
    // Extract day preferences
    const dayPatterns = {
      'tomorrow': /\b(tomorrow)\b/i,
      'today': /\b(today|as soon as possible|asap)\b/i,
      'monday': /\b(monday)\b/i,
      'tuesday': /\b(tuesday)\b/i,
      'wednesday': /\b(wednesday)\b/i,
      'thursday': /\b(thursday)\b/i,
      'friday': /\b(friday)\b/i
    };
    
    for (const [day, pattern] of Object.entries(dayPatterns)) {
      if (pattern.test(transcript)) {
        info.dayPreference = day;
        break;
      }
    }
    
    // Extract concern/reason for visit
    const concernPatterns = [
      /(?:i have|i'm having|experiencing|problem with|issue with|pain in)\s+(.+?)(?:\.|,|$)/i,
      /(?:calling about|need|want|looking for)\s+(.+?)(?:\.|,|$)/i
    ];
    
    for (const pattern of concernPatterns) {
      const match = transcript.match(pattern);
      if (match) {
        info.concern = match[1].trim();
        break;
      }
    }
    
    // Update patient info
    if (Object.keys(info).length > 0) {
      this.patientInfo = { ...this.patientInfo, ...info };
    }
    
    return info;
  }

  getMissingInfo() {
    const required = ['name', 'phone', 'concern'];
    const missing = [];
    
    for (const field of required) {
      if (!this.patientInfo[field]) {
        missing.push(field === 'phone' ? 'phone number' : field === 'concern' ? 'reason for visit' : field);
      }
    }
    
    return missing;
  }

  isAppointmentReady() {
    return this.patientInfo.name && this.patientInfo.phone && this.patientInfo.concern;
  }
}

// Julie AI Service Manager
class JulieAIService {
  constructor() {
    this.activeSessions = new Map();
    this.tts = ttsService;
    this.voiceService = voiceService;
  }

  async startSession(callSid, phoneNumber) {
    try {
      console.log(`Starting Julie AI session for call ${callSid}`);
      
      // Create session with context
      const session = {
        callSid,
        phoneNumber,
        context: new ConversationContext(),
        startTime: new Date(),
        audioBuffer: Buffer.alloc(0),
        isProcessing: false
      };
      
      this.activeSessions.set(callSid, session);
      
      // Log call start
      await this.logCallStart(callSid, phoneNumber);
      
      return session;
    } catch (error) {
      console.error('Error starting Julie AI session:', error);
      throw error;
    }
  }

  async handleIncomingAudio(callSid, audioChunk) {
    const session = this.activeSessions.get(callSid);
    if (!session) return;

    // Buffer audio for processing
    session.audioBuffer = Buffer.concat([session.audioBuffer, audioChunk]);
    
    // Process in chunks (e.g., every 500ms of audio)
    if (session.audioBuffer.length >= 8000 && !session.isProcessing) {
      session.isProcessing = true;
      
      try {
        // Use voice service for transcription
        const transcript = await this.voiceService.transcribeAudio(session.audioBuffer);
        
        if (transcript) {
          await this.processTranscript(session, transcript);
        }
        
        // Clear processed audio
        session.audioBuffer = Buffer.alloc(0);
      } catch (error) {
        console.error('Error processing audio:', error);
      } finally {
        session.isProcessing = false;
      }
    }
  }

  async processTranscript(session, transcript) {
    console.log(`Patient: ${transcript}`);
    
    // Extract patient information
    session.context.extractPatientInfo(transcript);
    
    // Detect intent
    const intent = session.context.detectIntent(transcript);
    
    // Add to conversation history
    session.context.addMessage('user', transcript);
    
    // Generate response based on intent
    let response;
    
    switch (intent) {
      case 'emergency':
        response = await this.handleEmergency(session);
        break;
        
      case 'appointment':
        response = await this.handleAppointmentBooking(session);
        break;
        
      case 'human_request':
        response = await this.handleHumanRequest(session);
        break;
        
      case 'inquiry':
        response = await this.handleInquiry(session, transcript);
        break;
        
      default:
        response = await this.generateAIResponse(session, transcript);
    }
    
    // Send response
    await this.sendResponse(session, response);
  }

  async handleEmergency(session) {
    // Log emergency call
    await this.logEmergencyCall(session);
    
    return "I understand you're experiencing a dental emergency. Are you in severe pain right now? " +
           "If this is life-threatening, please call 911 immediately. Otherwise, I can connect you " +
           "with Dr. Pedro's emergency line right away.";
  }

  async handleAppointmentBooking(session) {
    const missingInfo = session.context.getMissingInfo();
    
    if (missingInfo.length > 0) {
      // Ask for the first missing piece of information
      const questions = {
        'name': "I'd be happy to book an appointment. May I have your name please?",
        'phone number': "Great! And what's the best phone number to reach you?",
        'reason for visit': "What brings you in to see Dr. Pedro?",
        'preferred time': "When works best for you? We have openings tomorrow afternoon or Thursday morning."
      };
      
      return questions[missingInfo[0]] || "Let me get a few details for your appointment.";
    }
    
    // Check if we need to reschedule due to unavailable slot
    if (session.context.needsReschedule) {
      const slots = session.context.alternativeSlots;
      const slotsMessage = calendarService.formatSlotsForConversation(slots);
      session.context.needsReschedule = false;
      return `I'm sorry, that time isn't available. ${slotsMessage} Would any of these work instead?`;
    }
    
    // All info collected, confirm appointment
    if (session.context.isAppointmentReady()) {
      // If we have a specific time preference, try to book it
      if (session.context.patientInfo.dayPreference && session.context.patientInfo.timePreference) {
        try {
          const appointment = await this.bookAppointment(session);
          const appointmentDate = new Date(appointment.appointment_date);
          const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            timeZone: 'America/Chicago'
          });
          return `Perfect! I've booked your appointment for ${formattedDate}. ` +
                 `You'll receive a confirmation text shortly at ${session.context.patientInfo.phone}.`;
        } catch (error) {
          if (error.message === 'Slot not available' && session.context.needsReschedule) {
            return await this.handleAppointmentBooking(session);
          }
          return "I'm sorry, I encountered an issue booking your appointment. Let me connect you with our staff.";
        }
      } else {
        // Get available slots
        const slots = await calendarService.getAvailableSlots({
          serviceType: this.mapConcernToService(session.context.patientInfo.concern),
          duration: 60,
          days: 7
        });
        
        const slotsMessage = calendarService.formatSlotsForConversation(slots);
        return `Let me check our availability. ${slotsMessage} Which time works best for you?`;
      }
    }
  }

  async handleHumanRequest(session) {
    // Log human handoff request
    await supabase.from('callback_requests').insert({
      phone_number: session.phoneNumber,
      reason: 'Patient requested to speak with human',
      created_at: new Date().toISOString()
    });
    
    return "Of course! I'll connect you with one of our staff members right away. Please hold for just a moment.";
  }

  async handleInquiry(session, transcript) {
    // Generate AI response for inquiries using OpenRouter
    const response = await this.generateAIResponse(session, transcript);
    return response;
  }

  async generateAIResponse(session, transcript) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are Julie, Dr. Pedro's warm and professional dental office AI assistant.
          You're handling a phone call from a patient. Be conversational, empathetic, and helpful.
          Keep responses brief and natural for phone conversations. Never make up information about 
          services, prices, or availability. If unsure, offer to have someone call them back.`
        },
        ...session.context.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ];

      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'anthropic/claude-3-haiku',
        messages,
        temperature: 0.7,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const aiResponse = response.data.choices[0].message.content;
      session.context.addMessage('assistant', aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I apologize, I'm having trouble understanding. Could you please repeat that?";
    }
  }

  async sendResponse(session, text) {
    try {
      // Use TTS to convert text to speech
      if (this.tts) {
        const audioStream = await this.tts.textToSpeechStream(text, {
          optimizeLatency: 4
        });
        
        // Send audio through the session's WebSocket connection
        // This will be handled by the calling service
        session.responseAudio = audioStream;
        session.responseText = text;
      }
      
      // Log the response
      session.context.addMessage('assistant', text);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  }

  async bookAppointment(session) {
    try {
      const appointmentDate = await this.parseAppointmentTime(
        session.context.patientInfo.dayPreference,
        session.context.patientInfo.timePreference
      );
      
      // Check availability
      const isAvailable = await calendarService.checkSlotAvailability(
        appointmentDate,
        60, // Duration in minutes
        'default_provider_id'
      );
      
      if (!isAvailable) {
        // Get alternative slots
        const alternativeSlots = await calendarService.getAvailableSlots({
          startDate: appointmentDate,
          serviceType: this.mapConcernToService(session.context.patientInfo.concern),
          duration: 60,
          days: 3
        });
        
        session.context.alternativeSlots = alternativeSlots.slice(0, 3);
        session.context.needsReschedule = true;
        throw new Error('Slot not available');
      }
      
      // Create appointment in Supabase
      const { data, error } = await supabase.from('appointments').insert({
        patient_name: session.context.patientInfo.name,
        phone_number: session.context.patientInfo.phone,
        email: session.context.patientInfo.email || null,
        appointment_date: appointmentDate.toISOString(),
        service_type: this.mapConcernToService(session.context.patientInfo.concern),
        notes: session.context.patientInfo.concern,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        source: 'julie_ai_phone'
      }).select().single();
      
      if (error) {
        throw error;
      }
      
      // Book in calendar system
      const bookingResult = await calendarService.bookAppointment({
        appointmentId: data.id,
        providerId: process.env.DEFAULT_PROVIDER_ID || 'default_provider_id',
        date: appointmentDate,
        duration: 60,
        patientInfo: session.context.patientInfo
      });
      
      if (!bookingResult.success) {
        // Rollback Supabase appointment
        await supabase.from('appointments').delete().eq('id', data.id);
        throw new Error(bookingResult.error);
      }
      
      // Send confirmation SMS
      await this.sendAppointmentConfirmation(data);
      
      return data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  mapConcernToService(concern) {
    const concernLower = concern.toLowerCase();
    
    if (concernLower.includes('cleaning') || concernLower.includes('checkup')) {
      return 'cleaning';
    } else if (concernLower.includes('implant')) {
      return 'implant';
    } else if (concernLower.includes('tmj') || concernLower.includes('jaw')) {
      return 'tmj';
    } else if (concernLower.includes('botox') || concernLower.includes('filler')) {
      return 'cosmetic';
    } else if (concernLower.includes('whitening')) {
      return 'whitening';
    } else if (concernLower.includes('emergency') || concernLower.includes('pain')) {
      return 'emergency';
    }
    
    return 'consultation';
  }

  async parseAppointmentTime(dayPreference, timePreference) {
    // Use calendar service to parse natural language
    const timeRef = `${dayPreference} ${timePreference || ''}`;
    const parsed = calendarService.parseTimeReference(timeRef);
    
    let appointmentDate = parsed.date;
    
    // Set time based on preference or parsed time
    if (parsed.hour !== null) {
      appointmentDate.setHours(parsed.hour, parsed.minute, 0, 0);
    } else {
      // Default times based on preference
      if (timePreference === 'morning') {
        appointmentDate.setHours(10, 0, 0, 0);
      } else if (timePreference === 'afternoon') {
        appointmentDate.setHours(14, 0, 0, 0);
      } else if (timePreference === 'evening') {
        appointmentDate.setHours(17, 0, 0, 0);
      } else {
        appointmentDate.setHours(14, 0, 0, 0); // Default to 2 PM
      }
    }
    
    return appointmentDate;
  }

  async sendAppointmentConfirmation(appointment) {
    // This would integrate with the SMS service
    console.log('Sending appointment confirmation:', appointment);
  }

  async logCallStart(callSid, phoneNumber) {
    try {
      await supabase.from('call_logs').insert({
        call_sid: callSid,
        phone_number: phoneNumber,
        start_time: new Date().toISOString(),
        type: 'julie_ai',
        status: 'in_progress'
      });
    } catch (error) {
      console.error('Error logging call start:', error);
    }
  }

  async logEmergencyCall(session) {
    try {
      await supabase.from('emergency_calls').insert({
        phone_number: session.phoneNumber,
        call_sid: session.callSid,
        patient_info: session.context.patientInfo,
        transcript: session.context.messages,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging emergency call:', error);
    }
  }

  async endSession(callSid) {
    const session = this.activeSessions.get(callSid);
    if (!session) return;

    try {
      // Update call log
      await supabase.from('call_logs')
        .update({
          end_time: new Date().toISOString(),
          status: 'completed',
          duration: Math.floor((Date.now() - session.startTime) / 1000),
          transcript: session.context.messages
        })
        .eq('call_sid', callSid);
    } catch (error) {
      console.error('Error updating call log:', error);
    }

    this.activeSessions.delete(callSid);
  }

  // Get status for monitoring
  getStatus() {
    return {
      activeSessions: this.activeSessions.size,
      ttsConfigured: !!this.tts,
      voiceServiceAvailable: !!this.voiceService
    };
  }
}

// Export singleton instance
const julieAI = new JulieAIService();
export default julieAI;