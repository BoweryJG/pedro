import axios from 'axios';

export class AppointmentBookingService {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }

  // Extract appointment details from patient message using NLP
  async extractAppointmentIntent(messageText) {
    try {
      // Common appointment keywords and patterns
      const appointmentKeywords = [
        'appointment', 'schedule', 'book', 'visit', 'consultation',
        'check-up', 'cleaning', 'exam', 'see doctor', 'available'
      ];

      const urgencyKeywords = {
        emergency: ['emergency', 'urgent', 'pain', 'broken', 'bleeding', 'swollen'],
        urgent: ['soon', 'asap', 'quick', 'this week', 'urgent'],
        routine: ['routine', 'regular', 'normal', 'when convenient']
      };

      const serviceKeywords = {
        'General Checkup': ['checkup', 'check-up', 'cleaning', 'exam', 'routine'],
        'Yomi Robotic Surgery': ['yomi', 'robot', 'robotic', 'surgery', 'implant'],
        'TMJ Treatment': ['tmj', 'jaw', 'clicking', 'grinding', 'lock'],
        'EMFACE': ['emface', 'facial', 'aesthetics', 'cosmetic'],
        'Emergency': ['emergency', 'pain', 'broken', 'bleeding', 'urgent']
      };

      const timePreferences = {
        morning: ['morning', 'am', '9', '10', '11'],
        afternoon: ['afternoon', 'pm', '1', '2', '3', '4'],
        evening: ['evening', 'late', '5', '6']
      };

      const text = messageText.toLowerCase();
      
      // Check if this is an appointment request
      const isAppointmentRequest = appointmentKeywords.some(keyword => 
        text.includes(keyword)
      );

      if (!isAppointmentRequest) {
        return null;
      }

      // Determine urgency
      let urgency = 'routine';
      for (const [level, keywords] of Object.entries(urgencyKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          urgency = level;
          break;
        }
      }

      // Determine preferred service
      let preferredService = 'General Consultation';
      for (const [service, keywords] of Object.entries(serviceKeywords)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          preferredService = service;
          break;
        }
      }

      // Determine time preference
      let timePreference = null;
      for (const [time, keywords] of Object.entries(timePreferences)) {
        if (keywords.some(keyword => text.includes(keyword))) {
          timePreference = time;
          break;
        }
      }

      // Extract any mentioned dates (basic pattern matching)
      const datePatterns = [
        /\b(today|tomorrow|this week|next week)\b/,
        /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/,
        /\b(\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2})\b/
      ];

      let datePreference = null;
      for (const pattern of datePatterns) {
        const match = text.match(pattern);
        if (match) {
          datePreference = match[0];
          break;
        }
      }

      return {
        isAppointmentRequest: true,
        urgency,
        preferredService,
        timePreference,
        datePreference,
        confidence: this.calculateConfidence(text, appointmentKeywords)
      };

    } catch (error) {
      console.error('Error extracting appointment intent:', error);
      return null;
    }
  }

  // Calculate confidence score for appointment intent
  calculateConfidence(text, keywords) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    const totalKeywords = keywords.length;
    return Math.min(matches / totalKeywords * 2, 1.0); // Max confidence of 1.0
  }

  // Create appointment request from Instagram conversation
  async createAppointmentRequest(conversationId, intent, patientMessage) {
    try {
      // Get conversation details
      const { data: conversation } = await this.supabase
        .from('instagram_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Create appointment request
      const { data: appointmentRequest, error } = await this.supabase
        .from('appointment_requests')
        .insert({
          conversation_id: conversationId,
          patient_name: conversation.patient_name,
          preferred_service: intent.preferredService,
          urgency: intent.urgency,
          notes: `Original message: "${patientMessage}"\n\nExtracted preferences:\n- Service: ${intent.preferredService}\n- Time: ${intent.timePreference || 'No preference'}\n- Date: ${intent.datePreference || 'No preference'}`,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Generate appropriate response based on urgency
      const response = this.generateBookingResponse(intent, conversation.patient_name);
      
      return {
        appointmentRequest,
        suggestedResponse: response
      };

    } catch (error) {
      console.error('Error creating appointment request:', error);
      throw error;
    }
  }

  // Generate contextual response for appointment booking
  generateBookingResponse(intent, patientName) {
    const baseResponse = `Hi ${patientName}! I'd be happy to help you schedule an appointment with Dr. Pedro.`;
    
    switch (intent.urgency) {
      case 'emergency':
        return `${baseResponse} Since this sounds urgent, please call our office immediately at (718) 555-0123 for emergency care. If it's after hours, our answering service will connect you with Dr. Pedro.`;
      
      case 'urgent':
        return `${baseResponse} I understand you need to be seen soon. I'll prioritize your request and have our scheduling team contact you within the next few hours to find the earliest available appointment.`;
      
      default:
        const serviceInfo = intent.preferredService !== 'General Consultation' 
          ? ` for ${intent.preferredService}` 
          : '';
        
        return `${baseResponse}${serviceInfo} Our team will reach out to you shortly to discuss available times that work with your schedule. You can also call us directly at (718) 555-0123 if you'd prefer to speak with someone right away.`;
    }
  }

  // Get available appointment slots (mock implementation)
  async getAvailableSlots(date, serviceType = 'General Consultation') {
    try {
      // This would integrate with your actual appointment system
      // For now, we'll return mock available slots
      const slots = [];
      const startDate = new Date(date || Date.now());
      
      // Generate available slots for the next 14 days
      for (let i = 0; i < 14; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        // Skip Sundays
        if (currentDate.getDay() === 0) continue;
        
        // Morning slots (9 AM - 12 PM)
        for (let hour = 9; hour < 12; hour++) {
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            time: `${hour}:00`,
            duration: serviceType === 'General Consultation' ? 30 : 60,
            available: Math.random() > 0.3 // 70% chance slot is available
          });
        }
        
        // Afternoon slots (1 PM - 5 PM), Saturday until 2 PM
        const maxAfternoonHour = currentDate.getDay() === 6 ? 2 : 5;
        for (let hour = 13; hour < 13 + maxAfternoonHour; hour++) {
          slots.push({
            date: currentDate.toISOString().split('T')[0],
            time: `${hour}:00`,
            duration: serviceType === 'General Consultation' ? 30 : 60,
            available: Math.random() > 0.3
          });
        }
      }
      
      return slots.filter(slot => slot.available);
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  }

  // Book appointment (mock implementation)
  async bookAppointment(appointmentRequestId, selectedSlot, contactInfo) {
    try {
      // Update appointment request with selected slot and contact info
      const { data, error } = await this.supabase
        .from('appointment_requests')
        .update({
          preferred_date: selectedSlot.date,
          preferred_time: selectedSlot.time,
          patient_phone: contactInfo.phone,
          patient_email: contactInfo.email,
          status: 'confirmed'
        })
        .eq('id', appointmentRequestId)
        .select()
        .single();

      if (error) throw error;

      // In a real implementation, this would:
      // 1. Update your practice management system
      // 2. Send confirmation emails
      // 3. Add to calendar
      // 4. Send SMS reminders

      return {
        success: true,
        appointment: data,
        confirmationNumber: `DR${Date.now().toString().slice(-6)}`
      };

    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  }

  // Get appointment requests for dashboard
  async getAppointmentRequests(practiceId, status = null) {
    try {
      let query = this.supabase
        .from('appointment_requests')
        .select(`
          *,
          instagram_conversations (
            patient_name,
            patient_username,
            patient_instagram_id
          )
        `)
        .eq('instagram_conversations.practice_id', practiceId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching appointment requests:', error);
      return [];
    }
  }
}