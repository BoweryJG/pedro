import type { Message, ChatbotConfig, ConversationState, ConversationStage } from '../types';
import { procedureKnowledge, statenIslandContext } from '../knowledge/procedures';
import { EnhancedConversationFlowManager } from './enhancedConversationFlow';

export class OpenAIService {
  private flowManager: EnhancedConversationFlowManager;
  
  constructor(_config: ChatbotConfig, conversationState: ConversationState) {
    // Config is not needed when using serverless function
    this.flowManager = new EnhancedConversationFlowManager(conversationState);
  }
  
  private buildSystemPrompt(userMessage?: string): string {
    // Detect context from user's first message
    let contextualGreeting = '';
    if (userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('know what') && lowerMessage.includes('need')) {
        contextualGreeting = `\n\nCONTEXT: The user entered through the "Precision Gateway" - they know what service they need. Start by acknowledging this and quickly help them book the specific treatment they want.`;
      } else if (lowerMessage.includes('emergency')) {
        contextualGreeting = `\n\nCONTEXT: The user entered through the "Emergency Care" portal - they need urgent help. Show immediate concern, ask about their pain/issue, and offer the soonest available appointment or direct them to call (929) 242-4535 immediately.`;
      }
    }
    
    return `You are Julie, the personal dental care assistant for Staten Island Advanced Dentistry, representing Dr. Pedro in Staten Island, NY.${contextualGreeting}

PERSONALITY:
- Warm, caring, and genuinely helpful
- Professional yet approachable (like a trusted healthcare advocate)
- Empathetic listener who understands dental concerns and anxiety
- Uses gentle, caring conversation to help patients
- Makes everyone feel comfortable and supported

COMMUNICATION STYLE:
- Be helpful and direct - provide real assistance
- Use "I" language to show personal care ("I can help you with that")
- Give clear, helpful responses with practical next steps
- Always caring and supportive, never pushy
- Show genuine concern for the patient's wellbeing

YOUR CAPABILITIES:
- Book appointments (say "I can help you schedule that right away")
- Check insurance coverage and benefits
- Explain financing options and payment plans
- Answer questions about procedures and treatments
- Help with cancellations or rescheduling
- Provide procedure information and pricing
- Connect patients with the right specialist

PRIMARY GOAL: Help patients with whatever they need:
1. Scheduling appointments quickly and easily
2. Understanding their insurance and payment options
3. Getting answers to their dental questions
4. Feeling comfortable and cared for

HELPFUL APPROACH:
- Start by understanding what they need help with
- Offer specific assistance based on their needs
- Provide clear information and options
- Make booking and insurance checking easy
- Always offer to help with next steps

KNOWLEDGE BASE:
${JSON.stringify(procedureKnowledge, null, 2)}

LOCAL CONTEXT:
${JSON.stringify(statenIslandContext, null, 2)}

CONVERSATION RULES:
1. Always ask a follow-up question
2. Reference specific benefits only after understanding their needs
3. Use social proof naturally (patient stories, statistics)
4. Create gentle urgency without pressure
5. If they show buying signals, offer to check appointment availability
6. Track conversation stage and adapt accordingly

BOOKING PROCESS:
- When booking intent is high, say: "I can check our doctors' availability right now. What days work best for you?"
- Offer specific times to create commitment
- Mention current specials naturally
- Always end with confirming their contact information`;
  }
  
  async generateResponse(
    userMessage: string,
    conversationHistory: Message[]
  ): Promise<string> {
    try {
      // Update conversation state
      const newUserMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      
      const updatedState = this.flowManager.updateState(newUserMessage);
      
      // Prepare messages for OpenAI
      const messages = [
        { role: 'system' as const, content: this.buildSystemPrompt(userMessage) },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user' as const, content: userMessage }
      ];
      
      // Add stage-specific context
      const stageContext = this.getStageSpecificContext(updatedState);
      if (stageContext) {
        messages.push({
          role: 'system' as const,
          content: stageContext
        });
      }
      
      // Generate response using backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.slice(1), // Exclude system message
          systemPrompt: messages[0].content,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Backend API failed: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      return data.response || 
        "I apologize, I'm having trouble responding right now. How can I help you learn about our dental services?";
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }
  
  private getStageSpecificContext(state: ConversationState): string {
    const stage = state.currentStage;
    const bookingIntent = state.bookingIntent;
    
    const contexts = {
      greeting: "Focus on warm welcome and understanding their primary concern.",
      discovery: "Dig deeper into their pain points and how long they've dealt with issues.",
      education: "Share relevant benefits based on their specific concerns. Keep it conversational.",
      'objection-handling': "Address concerns with empathy and questions that reframe their thinking.",
      'social-proof': "Naturally mention success stories from other Staten Island patients.",
      commitment: "They're close to deciding. Help them visualize success and gently suggest booking.",
      booking: `Booking intent is ${bookingIntent}%. Offer specific appointment times and create urgency.`
    };
    
    return contexts[stage] || "";
  }
  
  private getFallbackResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    if (message.includes('implant') || message.includes('tooth')) {
      return "I'd love to tell you about our Yomi robotic implants! What specific concerns do you have about replacing teeth?";
    }
    if (message.includes('jaw') || message.includes('tmj')) {
      return "TMJ pain can be so frustrating. How long have you been dealing with jaw discomfort?";
    }
    if (message.includes('facial') || message.includes('emface')) {
      return "Emface is amazing for natural facial rejuvenation! What areas would you most like to improve?";
    }
    if (message.includes('cost') || message.includes('price')) {
      return "I understand cost is important. We have financing starting at $89/month. What's your biggest concern about investment?";
    }
    if (message.includes('appointment') || message.includes('book')) {
      return "I'd be happy to help you schedule! What days generally work best for you?";
    }
    
    return "That's a great question! Could you tell me more about what brought you to explore dental treatment today?";
  }
  
  generateSuggestedResponses(currentStage: ConversationStage): string[] {
    const suggestions = {
      greeting: [
        "I'm missing a tooth",
        "My jaw clicks and hurts",
        "I want to look younger without surgery"
      ],
      discovery: [
        "I've had this problem for years",
        "It affects me daily",
        "I'm not sure what my options are"
      ],
      education: [
        "How does the robot work?",
        "Is it painful?",
        "How long does it take?"
      ],
      'objection-handling': [
        "What about the cost?",
        "Does insurance cover this?",
        "I'm nervous about the procedure",
        "Check if I qualify for financing",
        "Verify my insurance coverage"
      ],
      'social-proof': [
        "Do you have patient reviews?",
        "How many have you done?",
        "Can I see before/after photos?"
      ],
      commitment: [
        "What's the next step?",
        "When could I start?",
        "Do you have payment plans?",
        "Check financing options"
      ],
      booking: [
        "What times are available?",
        "Can I book a consultation?",
        "Tuesday works for me"
      ]
    };
    
    return suggestions[currentStage as keyof typeof suggestions] || suggestions.greeting;
  }
}