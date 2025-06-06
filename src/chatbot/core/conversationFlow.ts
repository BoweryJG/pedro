import type { ConversationState, ConversationStage, Message } from '../types';
import { socraticQuestions, personalizeQuestion } from './socraticQuestions';

export class ConversationFlowManager {
  private state: ConversationState;
  
  constructor(initialState: ConversationState) {
    this.state = initialState;
  }
  
  determineStage(messages: Message[]): ConversationStage {
    const messageCount = messages.filter(m => m.role === 'user').length;
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    const keywords = lastUserMessage?.content.toLowerCase() || '';
    
    // Booking intent keywords
    if (keywords.match(/book|appointment|schedule|available|consultation/)) {
      return 'booking';
    }
    
    // Objection keywords
    if (keywords.match(/cost|expensive|insurance|afford|pain|hurt|time|busy/)) {
      return 'objection-handling';
    }
    
    // Stage progression based on conversation depth
    if (messageCount <= 2) return 'greeting';
    if (messageCount <= 4) return 'discovery';
    if (messageCount <= 7) return 'education';
    if (messageCount <= 10) return 'social-proof';
    
    return 'commitment';
  }
  
  detectProcedureInterest(message: string): 'yomi' | 'tmj' | 'emface' | null {
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
  
  calculateBookingIntent(): number {
    let score = 0;
    const messages = this.state.messages;
    
    // Positive indicators
    messages.forEach(msg => {
      if (msg.role === 'user') {
        const content = msg.content.toLowerCase();
        if (content.match(/how much|cost|price/)) score += 10;
        if (content.match(/how long|timeline|soon/)) score += 15;
        if (content.match(/insurance|payment|finance/)) score += 20;
        if (content.match(/appointment|book|schedule/)) score += 30;
        if (content.match(/available|opening|slot/)) score += 25;
      }
    });
    
    // Stage multiplier
    const stageMultipliers: Record<ConversationStage, number> = {
      greeting: 0.5,
      discovery: 0.7,
      education: 1.0,
      'objection-handling': 1.2,
      'social-proof': 1.3,
      commitment: 1.5,
      booking: 2.0
    };
    
    score *= stageMultipliers[this.state.currentStage];
    
    return Math.min(100, Math.round(score));
  }
  
  getNextQuestion(stage: ConversationStage, context: any): string {
    const questionSets = {
      greeting: socraticQuestions.discovery.opening,
      discovery: socraticQuestions.discovery.pain,
      education: socraticQuestions.impact.practical,
      'objection-handling': socraticQuestions.objectionHandling.cost,
      'social-proof': socraticQuestions.vision.lifestyle,
      commitment: socraticQuestions.commitment.readiness,
      booking: socraticQuestions.conversion.strong
    };
    
    const questions = questionSets[stage];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    return personalizeQuestion(randomQuestion, context);
  }
  
  generateProactiveContent(procedure: 'yomi' | 'tmj' | 'emface'): string {
    const content = {
      yomi: `Did you know? Our Yomi robotic system provides 0.5mm precision - that's 10x more accurate than traditional implants. Most patients are amazed at how comfortable the procedure is!`,
      tmj: `Interesting fact: 87% of our TMJ patients report significant improvement within 3 months. We don't just mask symptoms - we address the root cause.`,
      emface: `Here's what patients love: Emface requires zero downtime. You could literally get treatment during lunch and return to work looking refreshed!`
    };
    
    return content[procedure];
  }
  
  shouldOfferBooking(): boolean {
    return this.calculateBookingIntent() > 60 || 
           this.state.currentStage === 'commitment' ||
           this.state.currentStage === 'booking';
  }
  
  generateBookingOffer(): string {
    const offers = [
      "I can see Dr. Pedro has some availability this week. Would you like me to check specific times?",
      "Based on what you've shared, I think you'd really benefit from a consultation. Should I look at our schedule?",
      "Many patients tell us they wish they'd come in sooner. Can I help you take that first step?",
      "Dr. Pedro offers free smile assessments. Would Tuesday or Thursday work better for you?"
    ];
    
    return offers[Math.floor(Math.random() * offers.length)];
  }
  
  handleObjection(objectionType: string): string {
    const handlers = {
      cost: "I understand cost is a concern. Let me share our financing options - many patients are surprised to find it's less than their monthly coffee budget!",
      time: "I hear you're busy. The great news is that our Yomi procedures are typically completed in just one visit, and most patients return to normal activities within 48 hours.",
      fear: "Your comfort is our top priority. Dr. Pedro uses the latest comfort techniques, and our robotic system actually makes the procedure less invasive than traditional methods.",
      trust: "That's a great question about our experience. Dr. Pedro has performed over 500 successful implant procedures right here in Staten Island. Would you like to see some patient stories?"
    };
    
    return handlers[objectionType as keyof typeof handlers] || "I understand your concern. Let me address that for you...";
  }
  
  updateState(newMessage: Message): ConversationState {
    this.state.messages.push(newMessage);
    this.state.currentStage = this.determineStage(this.state.messages);
    this.state.bookingIntent = this.calculateBookingIntent();
    
    // Update procedure interest
    const detectedProcedure = this.detectProcedureInterest(newMessage.content);
    if (detectedProcedure) {
      this.state.procedureInterest[detectedProcedure] += 20;
    }
    
    return this.state;
  }
}