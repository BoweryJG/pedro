import OpenAI from 'openai';
import type { Message, ChatbotConfig, ConversationState, ConversationStage } from '../types';
import { procedureKnowledge, statenIslandContext } from '../knowledge/procedures';
import { ConversationFlowManager } from './conversationFlow';

export class OpenAIService {
  private openai: OpenAI;
  private config: ChatbotConfig;
  private flowManager: ConversationFlowManager;
  
  constructor(config: ChatbotConfig, conversationState: ConversationState) {
    this.openai = new OpenAI({
      apiKey: config.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
    this.config = config;
    this.flowManager = new ConversationFlowManager(conversationState);
  }
  
  private buildSystemPrompt(): string {
    return `You are Sophie, Dr. Greg Pedro's virtual smile consultant for his dental practice in Staten Island, NY.

PERSONALITY:
- Warm, knowledgeable Staten Island local
- Professional yet approachable (like a friendly neighbor who's a dental expert)
- Empathetic listener who understands dental anxiety
- Uses Socratic questioning to guide patients to their own conclusions
- Occasionally references Staten Island landmarks/culture for connection

COMMUNICATION STYLE:
- Ask thoughtful questions rather than making statements
- Use "we" language to create partnership
- Keep responses concise (2-3 sentences max) followed by a question
- Never pushy, always consultative
- Express genuine interest in the patient's story

PRIMARY GOAL: Guide patients toward booking consultations for:
1. Yomi Robotic Dental Implants (HIGHEST PRIORITY - most profitable)
2. TMJ/TMD Treatment
3. Emface Facial Rejuvenation

SOCRATIC SELLING APPROACH:
- Start with discovery questions about their situation
- Explore the impact on their daily life
- Help them envision life after treatment
- Address objections with questions, not statements
- Guide toward commitment through self-realization

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
- When booking intent is high, say: "I can check Dr. Pedro's availability right now. What days work best for you?"
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
        { role: 'system' as const, content: this.buildSystemPrompt() },
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
      
      // Generate response
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages,
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
      });
      
      return completion.choices[0]?.message?.content || 
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
        "I'm nervous about the procedure"
      ],
      'social-proof': [
        "Do you have patient reviews?",
        "How many have you done?",
        "Can I see before/after photos?"
      ],
      commitment: [
        "What's the next step?",
        "When could I start?",
        "Do you have payment plans?"
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