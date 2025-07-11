import axios from 'axios';
import Anthropic from '@anthropic-ai/sdk';
import { AppointmentBookingService } from './appointmentBooking.js';

export class InstagramDMHandler {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
    this.claude = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
    this.appointmentService = new AppointmentBookingService(supabaseClient);
    this.facebookApiUrl = 'https://graph.facebook.com/v18.0';
    this.pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  }

  // Main handler for incoming Instagram messages
  async handleIncomingMessage(messagingEvent) {
    try {
      console.log('📱 Processing Instagram DM:', messagingEvent);

      const senderId = messagingEvent.sender.id;
      const recipientId = messagingEvent.recipient.id;
      const messageData = messagingEvent.message;

      if (!messageData) {
        console.log('⚠️ No message data found, skipping...');
        return;
      }

      // Get or create conversation
      const conversation = await this.getOrCreateConversation(senderId, recipientId);
      
      // Save incoming message
      await this.saveMessage(conversation.id, {
        instagram_message_id: messageData.mid,
        sender_type: 'patient',
        sender_id: senderId,
        message_text: messageData.text,
        message_type: this.getMessageType(messageData),
        attachments: this.extractAttachments(messageData)
      });

      // Check for appointment booking intent
      const appointmentIntent = await this.appointmentService.extractAppointmentIntent(messageData.text);
      
      if (appointmentIntent?.isAppointmentRequest) {
        // Create appointment request
        const bookingResult = await this.appointmentService.createAppointmentRequest(
          conversation.id,
          appointmentIntent,
          messageData.text
        );
        
        // Send appointment booking response
        await this.sendMessage(senderId, bookingResult.suggestedResponse, true);
        
        // Save the appointment-specific response
        await this.saveMessage(conversation.id, {
          instagram_message_id: `ai_appointment_${Date.now()}`,
          sender_type: 'ai',
          sender_id: 'appointment_bot',
          message_text: bookingResult.suggestedResponse,
          is_ai_generated: true,
          ai_confidence_score: appointmentIntent.confidence,
          requires_human_review: appointmentIntent.urgency === 'emergency'
        });
        
        // Update analytics for appointment booking
        await this.updateAppointmentAnalytics(conversation.practice_id);
        
      } else {
        // Determine if we should auto-respond with general AI
        const shouldAutoRespond = await this.shouldAutoRespond(conversation, messageData);
        
        if (shouldAutoRespond) {
          // Generate AI response
          const aiResponse = await this.generateAIResponse(conversation, messageData);
          
          if (aiResponse) {
            // Send response via Instagram API
            await this.sendMessage(senderId, aiResponse.text, true);
            
            // Save AI response to database
            await this.saveMessage(conversation.id, {
              instagram_message_id: `ai_${Date.now()}`,
              sender_type: 'ai',
              sender_id: 'claude_ai',
              message_text: aiResponse.text,
              is_ai_generated: true,
              ai_confidence_score: aiResponse.confidence,
              requires_human_review: aiResponse.requiresReview
            });
          }
        }
      }

      // Update conversation analytics
      await this.updateAnalytics(conversation.practice_id);

    } catch (error) {
      console.error('❌ Error handling Instagram message:', error);
      throw error;
    }
  }

  // Get or create conversation record
  async getOrCreateConversation(senderId, recipientId) {
    try {
      // First, try to find existing conversation
      const { data: existingConversation } = await this.supabase
        .from('instagram_conversations')
        .select('*')
        .eq('patient_instagram_id', senderId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (existingConversation) {
        return existingConversation;
      }

      // Get patient info from Instagram API
      const patientInfo = await this.getInstagramUserInfo(senderId);
      
      // Get practice info
      const { data: practice } = await this.supabase
        .from('practices')
        .select('*')
        .eq('name', process.env.PRACTICE_NAME || 'Default Practice')
        .single();

      if (!practice) {
        throw new Error('Practice not found');
      }

      // Create new conversation
      const { data: newConversation, error } = await this.supabase
        .from('instagram_conversations')
        .insert({
          practice_id: practice.id,
          instagram_thread_id: `thread_${senderId}_${Date.now()}`,
          patient_instagram_id: senderId,
          patient_name: patientInfo.name,
          patient_username: patientInfo.username
        })
        .select()
        .single();

      if (error) throw error;

      return newConversation;
    } catch (error) {
      console.error('❌ Error managing conversation:', error);
      throw error;
    }
  }

  // Save message to database
  async saveMessage(conversationId, messageData) {
    try {
      const { error } = await this.supabase
        .from('instagram_messages')
        .insert({
          conversation_id: conversationId,
          ...messageData
        });

      if (error) throw error;
    } catch (error) {
      console.error('❌ Error saving message:', error);
      throw error;
    }
  }

  // Generate AI response using Claude
  async generateAIResponse(conversation, messageData) {
    try {
      // Get practice settings
      const { data: practice } = await this.supabase
        .from('practices')
        .select('*')
        .eq('id', conversation.practice_id)
        .single();

      // Get conversation history
      const { data: messages } = await this.supabase
        .from('instagram_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })
        .limit(10);

      // Build conversation context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender_type === 'patient' ? 'user' : 'assistant',
        content: msg.message_text
      }));

      // Current business hours check
      const isBusinessHours = this.isBusinessHours(practice.settings?.business_hours);
      
      // Generate system prompt for Claude
      const systemPrompt = this.buildDentalSystemPrompt(practice, isBusinessHours);

      // Call Claude API
      const response = await this.claude.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [
          ...conversationHistory,
          {
            role: 'user',
            content: messageData.text
          }
        ]
      });

      const aiText = response.content[0].text;
      
      // Analyze response confidence and determine if human review is needed
      const analysis = await this.analyzeResponse(messageData.text, aiText);

      return {
        text: aiText,
        confidence: analysis.confidence,
        requiresReview: analysis.requiresReview,
        intent: analysis.intent
      };

    } catch (error) {
      console.error('❌ Error generating AI response:', error);
      
      // Fallback response
      return {
        text: `Thank you for your message! I'll make sure ${process.env.PRACTICE_NAME || 'our team'} gets back to you as soon as possible. For urgent matters, please call our office at ${process.env.PRACTICE_PHONE || '(xxx) xxx-xxxx'}.`,
        confidence: 0.8,
        requiresReview: true,
        intent: 'fallback'
      };
    }
  }

  // Build dental-specific system prompt for Claude
  buildDentalSystemPrompt(practice, isBusinessHours) {
    const businessHoursText = isBusinessHours 
      ? "We are currently open and available to help."
      : "We are currently closed. Our business hours are Monday-Friday 9AM-5PM, Saturday 9AM-2PM.";

    return `You are Sophie, the AI assistant for ${practice.name}, a cutting-edge dental practice specializing in advanced procedures. Dr. Pedro is a prosthodontist and the only Yomi-certified surgeon on Staten Island.

PRACTICE INFORMATION:
- Services: ${practice.settings?.services?.join(', ') || 'General Dentistry, Yomi Robotic Surgery, TMJ Treatment, EMFACE Procedures'}
- Location: ${process.env.PRACTICE_ADDRESS || 'Our Office'}
- Phone: ${practice.phone || process.env.PRACTICE_PHONE || '(xxx) xxx-xxxx'}
- Email: ${practice.email}
- Current Status: ${businessHoursText}

PERSONALITY & TONE:
- Professional yet warm and approachable
- Empathetic to dental anxiety and concerns
- Knowledgeable about advanced dental procedures
- HIPAA-compliant (never request or discuss specific medical information)
- Enthusiastic about Dr. Pedro's expertise and advanced technology

KEY RESPONSIBILITIES:
1. Answer general questions about services and procedures
2. Help schedule consultations (never diagnostic appointments)
3. Provide office information (hours, location, contact)
4. Address common dental concerns with empathy
5. Highlight Dr. Pedro's unique qualifications (Yomi certification, prosthodontics)

STRICT GUIDELINES:
- NEVER provide medical advice or diagnoses
- NEVER discuss specific treatment plans without consultation
- ALWAYS recommend in-person consultation for clinical questions
- NEVER quote specific prices (mention consultations include cost discussions)
- For emergencies, direct to call the office immediately
- Keep responses under 3 sentences when possible
- Always end with a helpful next step

COMMON SCENARIOS:
- Appointment booking: Offer to help schedule consultation, ask for preferred timing
- Procedure questions: Provide general info, emphasize Dr. Pedro's expertise, suggest consultation
- Pricing: Mention consultations include detailed cost discussions and financing options
- Emergencies: Direct to call office immediately at ${practice.phone || process.env.PRACTICE_PHONE || '(xxx) xxx-xxxx'}
- After hours: Acknowledge they're contacting outside business hours, provide callback info

Remember: You're representing a premium practice with cutting-edge technology. Be confident in Dr. Pedro's abilities while remaining humble and patient-focused.`;
  }

  // Analyze AI response quality and determine if human review needed
  async analyzeResponse(userMessage, aiResponse) {
    try {
      // Define patterns that require human review
      const highRiskPatterns = [
        /emergency|urgent|pain|swollen|bleeding|infection/i,
        /lawsuit|complaint|unsatisfied|angry|terrible/i,
        /insurance|billing|payment|cost|price|expensive/i,
        /mistake|error|wrong|malpractice/i
      ];

      const medicalQuestionPatterns = [
        /diagnosis|treatment|medicine|drug|prescription/i,
        /x-ray|surgery|procedure|operation/i,
        /hurt|ache|pain|sore|tender/i
      ];

      let requiresReview = false;
      let confidence = 0.9;
      let intent = 'general_inquiry';

      // Check for high-risk patterns
      if (highRiskPatterns.some(pattern => pattern.test(userMessage))) {
        requiresReview = true;
        confidence = 0.6;
        intent = 'high_risk';
      }

      // Check for complex medical questions
      if (medicalQuestionPatterns.some(pattern => pattern.test(userMessage))) {
        confidence = 0.7;
        intent = 'medical_question';
      }

      // Check for appointment booking intent
      if (/appointment|schedule|book|visit|consultation/i.test(userMessage)) {
        intent = 'appointment_booking';
        confidence = 0.9;
      }

      // Check AI response for potential issues
      if (/i don't know|i'm not sure|i can't help/i.test(aiResponse)) {
        requiresReview = true;
        confidence = 0.5;
      }

      return {
        confidence,
        requiresReview,
        intent
      };

    } catch (error) {
      console.error('❌ Error analyzing response:', error);
      return {
        confidence: 0.5,
        requiresReview: true,
        intent: 'unknown'
      };
    }
  }

  // Send message via Instagram API
  async sendMessage(recipientId, messageText, isAiGenerated = false) {
    try {
      const messageData = {
        recipient: { id: recipientId },
        message: { text: messageText }
      };

      const response = await axios.post(
        `${this.facebookApiUrl}/me/messages`,
        messageData,
        {
          params: { access_token: this.pageAccessToken },
          headers: { 'Content-Type': 'application/json' }
        }
      );

      console.log(`📤 Message sent ${isAiGenerated ? '(AI)' : '(Human)'}:`, messageText);
      
      return {
        success: true,
        message_id: response.data.message_id
      };

    } catch (error) {
      console.error('❌ Error sending Instagram message:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get Instagram user information
  async getInstagramUserInfo(userId) {
    try {
      const response = await axios.get(
        `${this.facebookApiUrl}/${userId}`,
        {
          params: {
            fields: 'name,username,profile_pic',
            access_token: this.pageAccessToken
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching Instagram user info:', error);
      return {
        name: 'Instagram User',
        username: 'unknown'
      };
    }
  }

  // Check if message should trigger auto-response
  async shouldAutoRespond(conversation, messageData) {
    // Get practice settings
    const { data: practice } = await this.supabase
      .from('practices')
      .select('settings')
      .eq('id', conversation.practice_id)
      .single();

    if (!practice?.settings?.auto_respond) {
      return false;
    }

    // Don't auto-respond to media-only messages
    if (!messageData.text && messageData.attachments?.length > 0) {
      return false;
    }

    // Check if recent AI response exists (avoid spam)
    const { data: recentAIMessage } = await this.supabase
      .from('instagram_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .eq('is_ai_generated', true)
      .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
      .limit(1);

    return !recentAIMessage?.length;
  }

  // Utility functions
  getMessageType(messageData) {
    if (messageData.attachments?.length > 0) {
      const attachment = messageData.attachments[0];
      return attachment.type || 'file';
    }
    return 'text';
  }

  extractAttachments(messageData) {
    return messageData.attachments || [];
  }

  isBusinessHours(businessHours) {
    if (!businessHours) return false;

    const now = new Date();
    const day = now.toLocaleLowerCase().substr(0, 3); // mon, tue, etc.
    const currentTime = now.toTimeString().substr(0, 5); // HH:MM

    const daySchedule = businessHours[day];
    if (!daySchedule || daySchedule.closed) return false;

    return currentTime >= daySchedule.open && currentTime <= daySchedule.close;
  }

  // Update daily analytics
  async updateAnalytics(practiceId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get or create today's analytics record
      const { data: existing } = await this.supabase
        .from('dm_analytics')
        .select('*')
        .eq('practice_id', practiceId)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing record
        await this.supabase
          .from('dm_analytics')
          .update({
            total_messages_received: existing.total_messages_received + 1
          })
          .eq('id', existing.id);
      } else {
        // Create new record
        await this.supabase
          .from('dm_analytics')
          .insert({
            practice_id: practiceId,
            date: today,
            total_messages_received: 1
          });
      }
    } catch (error) {
      console.error('❌ Error updating analytics:', error);
    }
  }

  // Update appointment booking analytics
  async updateAppointmentAnalytics(practiceId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get or create today's analytics record
      const { data: existing } = await this.supabase
        .from('dm_analytics')
        .select('*')
        .eq('practice_id', practiceId)
        .eq('date', today)
        .single();

      if (existing) {
        // Update existing record
        await this.supabase
          .from('dm_analytics')
          .update({
            appointments_booked: existing.appointments_booked + 1
          })
          .eq('id', existing.id);
      } else {
        // Create new record with appointment booking
        await this.supabase
          .from('dm_analytics')
          .insert({
            practice_id: practiceId,
            date: today,
            appointments_booked: 1
          });
      }
    } catch (error) {
      console.error('❌ Error updating appointment analytics:', error);
    }
  }
}