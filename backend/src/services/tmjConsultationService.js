import { createClient } from '@supabase/supabase-js';
import CalendarService from '../../services/calendarService.js';
import { AppointmentBookingService } from './appointmentBooking.js';
import ConfirmationService from './confirmationService.js';

class TMJConsultationService {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    this.calendarService = CalendarService;
    this.appointmentService = new AppointmentBookingService(this.supabase);
    this.confirmationService = new ConfirmationService();
    
    // Define consultation stages
    this.stages = {
      GREETING: 'greeting',
      SYMPTOM_DISCOVERY: 'symptom_discovery',
      PAIN_ASSESSMENT: 'pain_assessment',
      TIMELINE: 'timeline',
      IMPACT_ASSESSMENT: 'impact_assessment',
      PREVIOUS_TREATMENTS: 'previous_treatments',
      QUALIFICATION: 'qualification',
      BOOKING_MOTIVATION: 'booking_motivation',
      APPOINTMENT_SCHEDULING: 'appointment_scheduling',
      COMPLETED: 'completed'
    };
    
    // Define stage progression logic
    this.stageFlow = {
      [this.stages.GREETING]: this.stages.SYMPTOM_DISCOVERY,
      [this.stages.SYMPTOM_DISCOVERY]: this.stages.PAIN_ASSESSMENT,
      [this.stages.PAIN_ASSESSMENT]: this.stages.TIMELINE,
      [this.stages.TIMELINE]: this.stages.IMPACT_ASSESSMENT,
      [this.stages.IMPACT_ASSESSMENT]: this.stages.PREVIOUS_TREATMENTS,
      [this.stages.PREVIOUS_TREATMENTS]: this.stages.QUALIFICATION,
      [this.stages.QUALIFICATION]: this.stages.BOOKING_MOTIVATION,
      [this.stages.BOOKING_MOTIVATION]: this.stages.APPOINTMENT_SCHEDULING,
      [this.stages.APPOINTMENT_SCHEDULING]: this.stages.COMPLETED
    };
  }

  // Get or create conversation session
  async getOrCreateSession(conversationId) {
    try {
      // Try to get existing session
      const { data: existingSession, error: fetchError } = await this.supabase
        .from('conversation_sessions')
        .select('*')
        .eq('conversation_id', conversationId)
        .single();

      if (existingSession && !fetchError) {
        // Update last_message_at
        await this.supabase
          .from('conversation_sessions')
          .update({ last_message_at: new Date().toISOString() })
          .eq('conversation_id', conversationId);
        
        return existingSession;
      }

      // Create new session
      const { data: newSession, error: createError } = await this.supabase
        .from('conversation_sessions')
        .insert({
          conversation_id: conversationId,
          current_stage: this.stages.GREETING,
          gathered_info: {},
          conversation_history: [],
          user_info: {},
          frustration_level: 0
        })
        .select()
        .single();

      if (createError) throw createError;
      return newSession;
    } catch (error) {
      console.error('Error managing conversation session:', error);
      // Return default session structure if database fails
      return {
        conversation_id: conversationId,
        current_stage: this.stages.GREETING,
        gathered_info: {},
        conversation_history: [],
        user_info: {},
        frustration_level: 0
      };
    }
  }

  // Update conversation session
  async updateSession(conversationId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('conversation_sessions')
        .update({
          ...updates,
          last_message_at: new Date().toISOString()
        })
        .eq('conversation_id', conversationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating conversation session:', error);
      return null;
    }
  }

  // Add message to conversation history
  async addMessage(conversationId, role, content) {
    try {
      const session = await this.getOrCreateSession(conversationId);
      const history = session.conversation_history || [];
      
      history.push({
        role,
        content,
        timestamp: new Date().toISOString()
      });

      await this.updateSession(conversationId, {
        conversation_history: history
      });
      
      return history;
    } catch (error) {
      console.error('Error adding message to history:', error);
      return [];
    }
  }

  // Extract and store information from user message
  extractInformation(message, currentInfo = {}) {
    const extracted = { ...currentInfo };
    const lowerMessage = message.toLowerCase();

    // Extract timing information
    if (lowerMessage.includes('night') || lowerMessage.includes('evening')) {
      extracted.timing = extracted.timing || [];
      if (!extracted.timing.includes('night')) {
        extracted.timing.push('night');
      }
    }
    if (lowerMessage.includes('morning')) {
      extracted.timing = extracted.timing || [];
      if (!extracted.timing.includes('morning')) {
        extracted.timing.push('morning');
      }
    }
    if (lowerMessage.includes('eating') || lowerMessage.includes('chewing')) {
      extracted.triggers = extracted.triggers || [];
      if (!extracted.triggers.includes('eating')) {
        extracted.triggers.push('eating');
      }
    }

    // Extract pain descriptors
    const painWords = ['sharp', 'dull', 'throbbing', 'aching', 'stabbing', 'burning'];
    painWords.forEach(word => {
      if (lowerMessage.includes(word)) {
        extracted.pain_type = extracted.pain_type || [];
        if (!extracted.pain_type.includes(word)) {
          extracted.pain_type.push(word);
        }
      }
    });

    // Extract symptoms
    const symptoms = ['clicking', 'popping', 'locking', 'headache', 'headaches', 'grinding'];
    symptoms.forEach(symptom => {
      if (lowerMessage.includes(symptom)) {
        extracted.symptoms = extracted.symptoms || [];
        if (!extracted.symptoms.includes(symptom)) {
          extracted.symptoms.push(symptom);
        }
      }
    });

    // Extract severity indicators
    if (lowerMessage.match(/\b(severe|unbearable|terrible|horrible|awful)\b/)) {
      extracted.severity = 'severe';
    } else if (lowerMessage.match(/\b(moderate|bad|painful)\b/)) {
      extracted.severity = 'moderate';
    } else if (lowerMessage.match(/\b(mild|slight|little)\b/)) {
      extracted.severity = 'mild';
    }

    return extracted;
  }

  // Detect if user is expressing pain and needs immediate routing
  detectPainExpression(message) {
    const lowerMessage = message.toLowerCase();
    const painIndicators = [
      'hurt', 'hurts', 'pain', 'painful', 'ache', 'aches', 'aching',
      'uncomfortable', 'throbbing', 'sharp', 'dull', 'burning',
      'stabbing', 'sore', 'tender', 'killing me', 'unbearable',
      'stop', 'relief', 'help'
    ];
    
    return painIndicators.some(indicator => lowerMessage.includes(indicator));
  }

  // Detect if user wants to book an appointment
  detectBookingIntent(message) {
    const lowerMessage = message.toLowerCase();
    const bookingIndicators = [
      'book', 'schedule', 'appointment', 'come in', 'visit',
      'see doctor', 'see dr', 'consultation', 'time to come'
    ];
    
    return bookingIndicators.some(indicator => lowerMessage.includes(indicator));
  }

  // Detect if user wants more information
  detectInfoIntent(message) {
    const lowerMessage = message.toLowerCase();
    const infoIndicators = [
      'info', 'information', 'learn', 'know more', 'tell me',
      'explain', 'what is', 'how does', 'treatment', 'options'
    ];
    
    return infoIndicators.some(indicator => lowerMessage.includes(indicator));
  }

  // Get available appointment slots for TMJ consultation
  async getAvailableSlots(conversationId, count = 3) {
    try {
      // Get Dr. Pedro's provider ID (you'll need to set this up)
      const drPedroProviderId = process.env.DR_PEDRO_PROVIDER_ID || 'default-provider-id';
      
      const slots = await this.calendarService.getNextAvailableSlots(drPedroProviderId, count);
      return slots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  // Create appointment request
  async createAppointmentRequest(conversationId, gatheredInfo) {
    try {
      const { data, error } = await this.supabase
        .from('tmj_appointment_requests')
        .insert({
          conversation_id: conversationId,
          patient_info: gatheredInfo,
          service_type: 'TMJ Consultation',
          urgency: gatheredInfo.severity === 'severe' ? 'urgent' : 'routine',
          status: 'pending',
          notes: `TMJ symptoms: ${gatheredInfo.symptoms?.join(', ') || 'Not specified'}
                 Pain timing: ${gatheredInfo.timing?.join(', ') || 'Not specified'}
                 Severity: ${gatheredInfo.severity || 'Not specified'}`,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating appointment request:', error);
      return null;
    }
  }

  // Confirm appointment booking with automatic email/SMS confirmation
  async confirmAppointmentBooking(appointmentRequestId, selectedSlot, patientContactInfo) {
    try {
      const { patient_name, patient_email, patient_phone } = patientContactInfo;
      
      // Format phone number for SMS
      const formattedPhone = this.confirmationService.formatPhoneNumber(patient_phone);
      
      // Update appointment request with confirmed details
      const { data: updatedAppointment, error } = await this.supabase
        .from('tmj_appointment_requests')
        .update({
          preferred_date: selectedSlot.date,
          preferred_time: selectedSlot.startTime,
          patient_name,
          patient_email,
          patient_phone: formattedPhone,
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentRequestId)
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email and SMS
      const confirmationDetails = {
        patient_name,
        patient_email,
        patient_phone: formattedPhone,
        preferred_date: selectedSlot.date,
        preferred_time: selectedSlot.startTime,
        service_type: 'TMJ Consultation with Dr. Pedro'
      };

      const confirmationResults = await this.confirmationService.sendAppointmentConfirmation(confirmationDetails);

      return {
        success: true,
        appointment: updatedAppointment,
        confirmations: confirmationResults,
        confirmationNumber: `TMJ${Date.now().toString().slice(-6)}`
      };

    } catch (error) {
      console.error('Error confirming appointment booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate appointment booking response with available slots formatted for frontend buttons
  async getBookingOptionsResponse(gatheredInfo, conversationId) {
    try {
      const slots = await this.getAvailableSlots(conversationId, 3);
      
      if (!slots || slots.length === 0) {
        return {
          response: "I don't see any available appointments in the next two weeks. Let me have our scheduling team call you to find a time that works. Can you provide your phone number?",
          slots: [],
          hasSlots: false
        };
      }

      // Format response with clickable options
      const slotText = this.calendarService.formatSlotsForConversation(slots);
      const response = `Perfect! I have these TMJ consultation times available with Dr. Pedro:\n\n${slotText}\n\nJust click on your preferred time below to book your appointment!`;

      return {
        response,
        slots: slots.map(slot => ({
          id: `slot_${slot.date}_${slot.startTime.replace(/[^a-zA-Z0-9]/g, '')}`,
          displayText: `${slot.dayName} ${slot.startTime}`,
          date: slot.date,
          time: slot.startTime,
          timestamp: slot.startTimestamp
        })),
        hasSlots: true
      };

    } catch (error) {
      console.error('Error getting booking options:', error);
      return {
        response: "I'm having trouble accessing our scheduling system right now. Please call us at (929) 242-4535 to book your TMJ consultation.",
        slots: [],
        hasSlots: false
      };
    }
  }

  // Detect user frustration
  detectFrustration(message, history = []) {
    const lowerMessage = message.toLowerCase();
    let frustrationScore = 0;

    // Check for explicit frustration indicators
    if (lowerMessage.includes('told you') || lowerMessage.includes('already said')) {
      frustrationScore += 2;
    }
    if (lowerMessage.includes('!!!!') || (lowerMessage.match(/!/g) || []).length > 2) {
      frustrationScore += 1;
    }
    if (lowerMessage.includes('bitch') || lowerMessage.includes('fuck') || lowerMessage.includes('damn')) {
      frustrationScore += 3;
    }
    if (lowerMessage.includes('stupid') || lowerMessage.includes('idiot') || lowerMessage.includes('dumb')) {
      frustrationScore += 2;
    }
    
    // Check for repetition in recent messages
    const recentUserMessages = history
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content.toLowerCase());
    
    if (recentUserMessages.length >= 2) {
      const similarity = recentUserMessages.filter(msg => 
        msg.includes('night') || msg.includes('told') || msg.includes('said')
      ).length;
      if (similarity >= 2) frustrationScore += 1;
    }

    return Math.min(frustrationScore, 5); // Cap at 5
  }

  // Determine if ready to progress to next stage
  shouldProgressStage(currentStage, gatheredInfo, message) {
    switch (currentStage) {
      case this.stages.GREETING:
        return message.length > 5; // Any substantial response moves past greeting
        
      case this.stages.SYMPTOM_DISCOVERY:
        return gatheredInfo.timing || gatheredInfo.symptoms || gatheredInfo.pain_type;
        
      case this.stages.PAIN_ASSESSMENT:
        return gatheredInfo.severity || (gatheredInfo.pain_type && gatheredInfo.pain_type.length > 0);
        
      case this.stages.TIMELINE:
        return gatheredInfo.duration || message.toLowerCase().includes('month') || 
               message.toLowerCase().includes('year') || message.toLowerCase().includes('week');
        
      case this.stages.IMPACT_ASSESSMENT:
        return gatheredInfo.impact_sleep || gatheredInfo.impact_eating || gatheredInfo.impact_work;
        
      case this.stages.PREVIOUS_TREATMENTS:
        return gatheredInfo.previous_treatments || message.toLowerCase().includes('tried') ||
               message.toLowerCase().includes('dentist') || message.toLowerCase().includes('nothing');
        
      case this.stages.QUALIFICATION:
        return true; // Always progress after qualification assessment
        
      case this.stages.BOOKING_MOTIVATION:
        return message.toLowerCase().includes('yes') || message.toLowerCase().includes('appointment') ||
               message.toLowerCase().includes('schedule') || message.toLowerCase().includes('book');
        
      default:
        return false;
    }
  }

  // Get pain acknowledgment system prompt
  getPainAcknowledgmentPrompt(gatheredInfo) {
    return `
PAIN ACKNOWLEDGMENT RESPONSE:
The patient has expressed they are in pain. Respond with immediate empathy and enthusiasm to help.

REQUIRED RESPONSE FORMAT:
"Ah man!! We've got you covered!!! Are you looking to book a time to come in or are you looking for more info?"

CONVERSATION RULES:
1. Use the EXACT phrase "Ah man!! We've got you covered!!!" 
2. Immediately offer the choice: booking appointment OR more information
3. Be enthusiastic and reassuring
4. Don't ask about symptoms - they've already expressed pain
5. Focus on getting them help quickly

GATHERED INFO SO FAR: ${JSON.stringify(gatheredInfo)}

Respond with excitement and offer immediate help options!`;
  }

  // Get booking system prompt with available slots
  async getBookingPrompt(gatheredInfo, conversationId) {
    const bookingOptions = await this.getBookingOptionsResponse(gatheredInfo, conversationId);
    
    return `
BOOKING ASSISTANCE:
The patient wants to schedule an appointment. Use the prepared booking response.

PREPARED RESPONSE: ${bookingOptions.response}

AVAILABLE SLOTS DATA: ${JSON.stringify(bookingOptions.slots)}

RESPONSE REQUIREMENTS:
1. Use the prepared response text exactly as provided
2. The frontend will automatically display clickable buttons for the slots
3. Be enthusiastic and helpful
4. Don't repeat the slot information - the buttons will handle that

GATHERED INFO: ${JSON.stringify(gatheredInfo)}

Use the prepared response text and let the frontend buttons handle slot selection!`;
  }

  // Get information system prompt
  getInfoPrompt(gatheredInfo) {
    return `
INFORMATION ASSISTANCE:
The patient wants to learn more about TMJ treatment and Dr. Pedro's approach.

INFORMATION TO SHARE:
- Dr. Pedro is Staten Island's leading TMJ specialist
- Advanced diagnostic techniques and treatment options
- Non-surgical and surgical solutions available
- Specialized TMJ joint analysis and bite correction
- Pain relief focused approach
- Insurance and financing options available

RESPONSE REQUIREMENTS:
1. Provide relevant information based on their specific symptoms
2. Explain Dr. Pedro's unique TMJ specialization
3. Mention treatment success with similar cases
4. Always end by offering to schedule a consultation

GATHERED INFO: ${JSON.stringify(gatheredInfo)}

Be informative but not overwhelming, and always guide toward scheduling a consultation.`;
  }

  // Get stage-appropriate system prompt
  async getSystemPrompt(stage, gatheredInfo, frustrationLevel, isPainExpression = false, conversationId = null, isBookingRequest = false, isInfoRequest = false) {
    if (isPainExpression) {
      return this.getPainAcknowledgmentPrompt(gatheredInfo);
    }
    
    if (isBookingRequest) {
      return await this.getBookingPrompt(gatheredInfo, conversationId);
    }
    
    if (isInfoRequest) {
      return this.getInfoPrompt(gatheredInfo);
    }

    const baseContext = `
PRACTICE CONTEXT:
- Dr. Pedro is a certified TMJ specialist in Staten Island with unique treatment modalities
- Located at statenislandtmj.com - established reputation for TMJ/TMD relief  
- Competitors include RSN Dental, Joseph Mormino DDS, Karl Family Dental, but Dr. Pedro specializes specifically in TMJ

CONVERSATION RULES:
1. NEVER repeat questions that have been answered
2. ALWAYS acknowledge and build on previously provided information
3. Use empathy and validation before asking new questions
4. Keep responses to 1-2 sentences maximum
5. Progress logically through consultation stages

GATHERED INFO SO FAR: ${JSON.stringify(gatheredInfo)}
FRUSTRATION LEVEL: ${frustrationLevel}/5
`;

    if (frustrationLevel >= 2) {
      return baseContext + `
FRUSTRATION DETECTED - SPECIAL HANDLING:
- Acknowledge their frustration immediately
- Apologize for any confusion
- Briefly summarize what you understand so far
- Ask ONE simple, different question to move forward
- If frustration is severe (3+), offer phone consultation option

Respond with empathy and redirect the conversation productively.`;
    }

    switch (stage) {
      case this.stages.GREETING:
        return baseContext + `
STAGE: Initial Greeting
- Warm, empathetic greeting acknowledging their TMJ concern
- Ask ONE open-ended question about what brings them here
- Be welcoming and professional`;

      case this.stages.SYMPTOM_DISCOVERY:
        return baseContext + `
STAGE: Symptom Discovery
- Build on any symptoms already mentioned: ${gatheredInfo.symptoms || 'none yet'}
- Timing info already provided: ${gatheredInfo.timing || 'none yet'}
- Ask about specific TMJ symptoms they haven't mentioned yet
- Focus on jaw pain, clicking, popping, locking, grinding
- ONE question only, be specific`;

      case this.stages.PAIN_ASSESSMENT:
        return baseContext + `
STAGE: Pain Assessment  
- Pain type already noted: ${gatheredInfo.pain_type || 'none yet'}
- Severity already noted: ${gatheredInfo.severity || 'none yet'}
- Ask about pain intensity or characteristics not yet covered
- Use pain scale (1-10) or descriptive words
- ONE focused question about pain specifics`;

      case this.stages.TIMELINE:
        return baseContext + `
STAGE: Timeline Assessment
- Timing patterns known: ${gatheredInfo.timing || 'none yet'}
- Ask about duration (how long they've had symptoms)
- Or ask what makes symptoms better/worse
- Focus on understanding the timeline and triggers
- ONE question about when/how symptoms developed`;

      case this.stages.IMPACT_ASSESSMENT:
        return baseContext + `
STAGE: Impact Assessment
- Known impacts: ${JSON.stringify(gatheredInfo)}
- Ask how TMJ affects daily activities (eating, sleeping, work)
- Focus on quality of life impact
- ONE question about how symptoms affect their life`;

      case this.stages.PREVIOUS_TREATMENTS:
        return baseContext + `
STAGE: Previous Treatment History
- Ask what they've tried before for TMJ treatment
- Focus on dentists, doctors, treatments, medications
- ONE question about their treatment history`;

      case this.stages.QUALIFICATION:
        return baseContext + `
STAGE: Qualification Assessment
- Summarize their situation briefly
- Explain how Dr. Pedro's approach differs from general dentistry
- Position the consultation as valuable for their specific situation
- ONE statement about treatment approach + ask if they'd like to learn more`;

      case this.stages.BOOKING_MOTIVATION:
        return baseContext + `
STAGE: Booking Motivation
- Build desire for consultation based on their specific situation
- Emphasize Dr. Pedro's TMJ specialization and success with similar cases
- Ask if they'd like to schedule a consultation
- ONE motivating statement + booking question`;

      case this.stages.APPOINTMENT_SCHEDULING:
        return baseContext + `
STAGE: Appointment Scheduling
- They've expressed interest in scheduling
- Ask about preferred timing or contact method
- Keep it simple and direct
- ONE question about scheduling preferences`;

      default:
        return baseContext + `
Respond empathetically and ask ONE relevant question to understand their TMJ situation better.`;
    }
  }
}

export default TMJConsultationService;