import { Transform } from 'stream';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { procedureKnowledge } from '../config/procedureKnowledge.js';

export class MedicalLLM extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    this.options = {
      model: options.model || 'gpt-4-turbo-preview',
      systemPrompt: options.systemPrompt,
      temperature: options.temperature || 0.7,
      maxTokens: options.maxTokens || 150
    };
    
    this.conversationHistory = [];
    this.processingQueue = [];
    this.isProcessing = false;
    this.stopped = false;
  }

  _transform(chunk, encoding, callback) {
    if (chunk.type === 'transcription' && chunk.text) {
      this.processingQueue.push(chunk.text);
      this.processQueue();
    }
    callback();
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0 || this.stopped) {
      return;
    }
    
    this.isProcessing = true;
    const userMessage = this.processingQueue.shift();
    
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });
      
      // Check for appointment booking intent
      const intent = await this.detectIntent(userMessage);
      
      let response;
      if (intent.type === 'appointment_booking') {
        response = await this.handleAppointmentBooking(intent, userMessage);
      } else if (intent.type === 'directions') {
        response = this.provideDirections();
      } else if (intent.type === 'procedure_info') {
        response = await this.provideProcedureInfo(intent.procedure);
      } else if (intent.type === 'financing') {
        response = this.provideFinancingInfo();
      } else {
        response = await this.generateGeneralResponse(userMessage);
      }
      
      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response
      });
      
      // Emit response
      this.push({
        type: 'llm_response',
        text: response,
        intent: intent.type,
        timestamp: Date.now()
      });
      
    } catch (error) {
      console.error('LLM processing error:', error);
      this.emit('error', error);
    } finally {
      this.isProcessing = false;
      setImmediate(() => this.processQueue());
    }
  }

  async detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple intent detection - in production, use more sophisticated NLU
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return { type: 'appointment_booking' };
    } else if (lowerMessage.includes('direction') || lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('address')) {
      return { type: 'directions' };
    } else if (lowerMessage.includes('financing') || lowerMessage.includes('payment') || lowerMessage.includes('insurance') || lowerMessage.includes('cost')) {
      return { type: 'financing' };
    } else if (this.detectProcedureKeywords(lowerMessage)) {
      return { 
        type: 'procedure_info',
        procedure: this.detectProcedureKeywords(lowerMessage)
      };
    }
    
    return { type: 'general' };
  }

  detectProcedureKeywords(message) {
    const procedures = {
      'yomi': 'yomi_robotic_implants',
      'robotic implant': 'yomi_robotic_implants',
      'robot': 'yomi_robotic_implants',
      'emface': 'emface_treatment',
      'em face': 'emface_treatment',
      'btl': 'emface_treatment',
      'facial toning': 'emface_treatment',
      'tmj': 'tmj_treatment',
      'jaw pain': 'tmj_treatment',
      'jaw clicking': 'tmj_treatment',
      'headache': 'tmj_treatment',
      'bruxism': 'tmj_treatment',
      'grinding': 'tmj_treatment',
      'implant': 'dental implants',
      'crown': 'dental crowns',
      'veneer': 'veneers',
      'whitening': 'teeth whitening',
      'invisalign': 'Invisalign',
      'cleaning': 'dental cleaning',
      'filling': 'dental fillings',
      'root canal': 'root canal therapy',
      'extraction': 'tooth extraction',
      'botox': 'Botox treatments',
      'filler': 'dermal fillers'
    };
    
    for (const [keyword, procedure] of Object.entries(procedures)) {
      if (message.includes(keyword)) {
        return procedure;
      }
    }
    
    return null;
  }

  async handleAppointmentBooking(intent, message) {
    // Extract date/time if mentioned
    const dateTime = this.extractDateTime(message);
    
    if (dateTime) {
      // Check availability
      const isAvailable = await this.checkAvailability(dateTime);
      
      if (isAvailable) {
        return `I can schedule an appointment for you on ${dateTime}. May I have your name and phone number to confirm the booking?`;
      } else {
        return `I'm sorry, but ${dateTime} is not available. Would you like me to check for other available times that day or suggest alternative dates?`;
      }
    } else {
      return `I'd be happy to help you schedule an appointment. What day works best for you? We're open Monday through Friday from 9 AM to 6 PM, and Saturdays from 9 AM to 2 PM.`;
    }
  }

  provideDirections() {
    return `We're located at 4300 Hylan Boulevard in Staten Island, New York, 10312. We're near the intersection of Hylan Boulevard and Richmond Avenue. If you're coming by car, there's free parking available. Would you like me to provide specific directions from your location?`;
  }

  async provideProcedureInfo(procedure) {
    // Check if it's one of our specialized procedures
    if (procedureKnowledge[procedure]) {
      const specializedInfo = procedureKnowledge[procedure];
      let response = `${specializedInfo.description}\n\n`;
      
      if (specializedInfo.key_benefits) {
        response += `Key benefits include: ${specializedInfo.key_benefits.slice(0, 3).join(', ')}.\n\n`;
      }
      
      if (specializedInfo.pricing) {
        const pricing = specializedInfo.pricing;
        if (pricing.single_implant) {
          response += `Pricing starts at $${pricing.single_implant.min.toLocaleString()}. `;
        } else if (pricing.single_session) {
          response += `Single sessions start at $${pricing.single_session.min}. `;
        } else if (pricing.consultation) {
          response += `Consultations start at $${pricing.consultation.min}. `;
        }
      }
      
      response += `Would you like to schedule a consultation with Dr. Pedro to discuss this treatment?`;
      return response;
    }
    
    // Standard procedures
    const procedureInfo = {
      'dental implants': 'Dental implants are a permanent solution for missing teeth. The procedure involves placing a titanium post in the jawbone, which acts as a tooth root. After healing, a crown is attached. The process typically takes 3-6 months.',
      'veneers': 'Veneers are thin shells of porcelain that cover the front of your teeth. They can fix chips, gaps, and discoloration. The procedure usually takes 2-3 visits.',
      'teeth whitening': 'We offer professional teeth whitening that can brighten your smile by several shades. We have both in-office treatments that take about an hour and take-home kits.',
      'Invisalign': 'Invisalign uses clear, removable aligners to straighten teeth. Treatment typically takes 12-18 months. We offer free consultations to determine if you\'re a good candidate.'
    };
    
    const info = procedureInfo[procedure] || 'I can provide general information about that procedure.';
    return `${info} Would you like to schedule a consultation to discuss this treatment in detail?`;
  }

  provideFinancingInfo() {
    return `We offer several payment options to make your dental care affordable. We accept most major insurance plans and offer CareCredit financing with flexible payment plans. We also have in-house payment plans available. Would you like me to check if we accept your specific insurance?`;
  }

  async generateGeneralResponse(message) {
    const messages = [
      { role: 'system', content: this.options.systemPrompt },
      ...this.conversationHistory.slice(-6) // Keep last 6 messages for context
    ];
    
    const completion = await this.openai.chat.completions.create({
      model: this.options.model,
      messages,
      temperature: this.options.temperature,
      max_tokens: this.options.maxTokens
    });
    
    return completion.choices[0].message.content;
  }

  async checkAvailability(dateTime) {
    // Check appointment availability in database
    try {
      const { data, error } = await this.supabase
        .from('appointments')
        .select('id')
        .eq('appointment_date', dateTime)
        .eq('status', 'scheduled');
      
      // Simple availability check - in production, implement proper scheduling logic
      return !data || data.length < 10; // Assume max 10 appointments per slot
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  extractDateTime(message) {
    // Simple date/time extraction - in production, use proper NLP
    const patterns = [
      /tomorrow at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
      /next (\w+) at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i,
      /(\w+) at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0]; // Return the matched date/time string
      }
    }
    
    return null;
  }

  stop() {
    this.stopped = true;
    this.processingQueue = [];
  }

  resume() {
    this.stopped = false;
    this.processQueue();
  }
}