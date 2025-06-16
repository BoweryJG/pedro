import type { ConversationState, ConversationStage, Message } from '../types';
import { CONTACT_INFO } from '../../constants/contact';

interface StageConfig {
  name: string;
  description: string;
  goals: string[];
  triggers: string[];
  responses: string[];
  quickResponses: string[];
}

export class EnhancedConversationFlowManager {
  private state: ConversationState;
  
  private stageConfigs: Record<ConversationStage, StageConfig> = {
    greeting: {
      name: 'Greeting & Intent Discovery',
      description: 'Welcome patient and understand their needs',
      goals: ['Build rapport', 'Identify primary concern', 'Set comfortable tone'],
      triggers: ['hi', 'hello', 'help', 'start', 'hey'],
      responses: [
        "Hi! I'm Sophie, Dr. Pedro's virtual assistant. I'm here to help you 24/7! 😊\n\nWhat brings you to Staten Island Advanced Dentistry today?",
        "Welcome! I'm Sophie, and I'm here to help you achieve your best smile. What can I assist you with today?",
        "Hello! Thanks for reaching out to Dr. Pedro's practice. I'm Sophie, and I'd love to help. What's on your mind?"
      ],
      quickResponses: [
        "🦷 I need a dentist",
        "💰 Check insurance/costs", 
        "🤖 Learn about Yomi surgery",
        "😷 I have tooth pain",
        "📅 Book appointment"
      ]
    },
    
    discovery: {
      name: 'Qualification & Education',
      description: 'Understand patient situation and educate about solutions',
      goals: ['Identify specific needs', 'Build trust', 'Introduce relevant procedures'],
      triggers: ['tell me more', 'what do you', 'how does', 'explain'],
      responses: [
        "I'd love to learn more about your situation. How long have you been dealing with this?",
        "That's a great question! Let me share how Dr. Pedro can help with that specific concern.",
        "Many of our patients come to us with similar needs. Can you tell me what matters most to you?"
      ],
      quickResponses: [
        "Regular checkup needed",
        "Specific problem to fix",
        "Want cosmetic improvement",
        "Need second opinion"
      ]
    },
    
    education: {
      name: 'Value Building',
      description: 'Educate about procedures and build value',
      goals: ['Highlight expertise', 'Share success stories', 'Address concerns'],
      triggers: ['how much', 'does it hurt', 'how long', 'success rate'],
      responses: [
        "Great question! Dr. Pedro has performed over 500 successful procedures. Let me share what makes our approach special...",
        "I understand you want to know more. Here's what our patients love about this treatment...",
        "That's exactly why Dr. Pedro invested in the Yomi robotic system - to give you the best possible outcome."
      ],
      quickResponses: [
        "Tell me more about results",
        "What about recovery time?",
        "Do you take my insurance?",
        "How soon can I be seen?"
      ]
    },
    
    'objection-handling': {
      name: 'Objection Handling',
      description: 'Address concerns with empathy and solutions',
      goals: ['Overcome barriers', 'Provide reassurance', 'Offer alternatives'],
      triggers: ['expensive', 'scared', 'busy', 'not sure', 'worried'],
      responses: [
        "I completely understand your concern. Let me share how we make this work for patients in similar situations...",
        "That's a valid concern. Many patients felt the same way before learning about our approach. Here's what changed their mind...",
        "I hear you. The good news is we have several options that might work better for your situation..."
      ],
      quickResponses: [
        "What financing is available?",
        "Tell me about comfort options",
        "I need to think about it",
        "Can I see patient reviews?"
      ]
    },
    
    'social-proof': {
      name: 'Social Proof & Trust',
      description: 'Share success stories and build confidence',
      goals: ['Share testimonials', 'Highlight credentials', 'Create urgency'],
      triggers: ['reviews', 'other patients', 'experience', 'results'],
      responses: [
        "Just last week, we had a patient who was in a similar situation. After treatment, they told us they wished they'd come in sooner!",
        "Dr. Pedro is the only Yomi-certified dentist in Staten Island. Our patients drive from all five boroughs for his expertise.",
        "We have a 98% patient satisfaction rate. Would you like to hear what patients say about their experience?"
      ],
      quickResponses: [
        "Show me before/after photos",
        "What makes Dr. Pedro special?",
        "How do I get started?",
        "Check availability"
      ]
    },
    
    commitment: {
      name: 'Commitment & Next Steps',
      description: 'Guide toward booking decision',
      goals: ['Create urgency', 'Simplify decision', 'Facilitate booking'],
      triggers: ['ready', 'book', 'appointment', 'schedule', 'available'],
      responses: [
        "Wonderful! I can see that Dr. Pedro has some availability this week. Would you prefer a morning or afternoon appointment?",
        "Based on everything we've discussed, I think you'd be a great candidate. Let me check what times work for you.",
        "Perfect timing! We actually have a cancellation this week. Would you like me to hold that spot for you?"
      ],
      quickResponses: [
        "📅 Yes, book me in!",
        "What times are available?",
        "I need to check my schedule",
        "Call me at " + CONTACT_INFO.phone.display
      ]
    },
    
    booking: {
      name: 'Booking Completion',
      description: 'Finalize appointment details',
      goals: ['Collect information', 'Confirm appointment', 'Set expectations'],
      triggers: ['yes book', 'schedule me', 'want appointment', 'reserve'],
      responses: [
        "Excellent! Let me get you scheduled. I just need a few quick details...",
        "Great decision! Dr. Pedro and the team are excited to meet you. Let's confirm your appointment...",
        "Perfect! You're going to love being a patient here. Let me finalize your booking..."
      ],
      quickResponses: [
        "Morning works best",
        "Afternoon preferred",
        "ASAP please",
        "Next week is better"
      ]
    }
  };
  
  constructor(initialState: ConversationState) {
    this.state = initialState;
  }
  
  determineStage(messages: Message[]): ConversationStage {
    const messageCount = messages.filter(m => m.role === 'user').length;
    const lastMessages = messages.slice(-4);
    const recentContent = lastMessages.map(m => m.content.toLowerCase()).join(' ');
    
    // Check stage triggers
    for (const [stage, config] of Object.entries(this.stageConfigs)) {
      if (config.triggers.some(trigger => recentContent.includes(trigger))) {
        // Special handling for stage progression
        if (stage === 'booking' && this.state.currentStage !== 'commitment') {
          return 'commitment'; // Guide through commitment first
        }
        return stage as ConversationStage;
      }
    }
    
    // Natural progression based on conversation depth
    if (messageCount <= 1) return 'greeting';
    if (messageCount <= 3) return 'discovery';
    if (messageCount <= 5) return 'education';
    if (messageCount <= 7) return 'social-proof';
    if (messageCount <= 9) return 'commitment';
    
    return this.state.currentStage;
  }
  
  getStageResponse(stage: ConversationStage, context?: any): string {
    const config = this.stageConfigs[stage];
    const responses = config.responses;
    
    // Add contextual elements
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Personalize based on detected procedure interest
    if (context?.procedure) {
      const procedureInfo = {
        yomi: "robotic implant surgery",
        tmj: "TMJ treatment", 
        emface: "EMFACE rejuvenation"
      };
      response = response.replace('[procedure]', procedureInfo[context.procedure as keyof typeof procedureInfo]);
    }
    
    return response;
  }
  
  getQuickResponses(stage: ConversationStage): string[] {
    return this.stageConfigs[stage].quickResponses;
  }
  
  detectEmergency(message: string): boolean {
    const emergencyKeywords = [
      'emergency', 'urgent', 'severe pain', 'bleeding', 'swelling',
      'knocked out', 'broken tooth', 'can\'t sleep', 'infection'
    ];
    
    const lower = message.toLowerCase();
    return emergencyKeywords.some(keyword => lower.includes(keyword));
  }
  
  handleEmergency(): string {
    return `This sounds like it might be urgent. For immediate care:\n\n` +
           `🚨 Call Now: ${CONTACT_INFO.phone.display}\n` +
           `📍 Or visit: ${CONTACT_INFO.address.full}\n\n` +
           `I can also help you understand what to do right now. What would you prefer?`;
  }
  
  calculateBookingIntent(): number {
    let score = 0;
    const messages = this.state.messages;
    
    // Stage-based scoring
    const stageScores: Record<ConversationStage, number> = {
      greeting: 10,
      discovery: 20,
      education: 30,
      'objection-handling': 35,
      'social-proof': 50,
      commitment: 70,
      booking: 90
    };
    
    score += stageScores[this.state.currentStage];
    
    // Keyword-based scoring
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        if (content.match(/ready|book|appointment|schedule/)) score += 15;
        if (content.match(/when|available|opening/)) score += 10;
        if (content.match(/cost|price|insurance/)) score += 5;
        if (content.match(/not sure|think about|maybe/)) score -= 10;
      }
    });
    
    return Math.min(100, Math.max(0, score));
  }
  
  shouldTransitionStage(): boolean {
    const messagesSinceStageChange = this.state.messages.filter(
      m => m.timestamp.getTime() > (this.state.lastStageChange || 0)
    ).length;
    
    return messagesSinceStageChange >= 2;
  }
  
  generateSmartResponse(userMessage: string): {
    response: string;
    quickResponses: string[];
    showPhone: boolean;
  } {
    // Check for emergency
    if (this.detectEmergency(userMessage)) {
      return {
        response: this.handleEmergency(),
        quickResponses: ["Call now", "Tell me what to do", "Book urgent appointment"],
        showPhone: true
      };
    }
    
    // Get stage-appropriate response
    const stage = this.determineStage(this.state.messages);
    const response = this.getStageResponse(stage);
    const quickResponses = this.getQuickResponses(stage);
    
    // Determine if we should show phone option
    const showPhone = stage === 'commitment' || 
                     stage === 'booking' || 
                     this.calculateBookingIntent() > 70;
    
    return { response, quickResponses, showPhone };
  }
  
  updateState(newMessage: Message): ConversationState {
    const previousStage = this.state.currentStage;
    
    this.state.messages.push(newMessage);
    this.state.currentStage = this.determineStage(this.state.messages);
    this.state.bookingIntent = this.calculateBookingIntent();
    
    // Track stage changes
    if (previousStage !== this.state.currentStage) {
      this.state.lastStageChange = Date.now();
    }
    
    // Update procedure interest
    const detectedProcedure = this.detectProcedureInterest(newMessage.content);
    if (detectedProcedure) {
      this.state.procedureInterest[detectedProcedure] += 20;
    }
    
    return this.state;
  }
  
  private detectProcedureInterest(message: string): 'yomi' | 'tmj' | 'emface' | null {
    const lower = message.toLowerCase();
    
    if (lower.match(/implant|missing teeth|denture|tooth replacement|robot/)) {
      return 'yomi';
    }
    if (lower.match(/jaw|tmj|headache|clicking|grinding|clench/)) {
      return 'tmj';
    }
    if (lower.match(/facial|rejuvenation|lift|wrinkle|aging|skin/)) {
      return 'emface';
    }
    
    return null;
  }
}