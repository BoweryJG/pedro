export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    procedure?: 'yomi' | 'tmj' | 'emface';
    stage?: ConversationStage;
  };
}

export type ConversationStage = 
  | 'greeting'
  | 'discovery'
  | 'education'
  | 'objection-handling'
  | 'social-proof'
  | 'commitment'
  | 'booking';

export interface ConversationState {
  messages: Message[];
  currentStage: ConversationStage;
  userProfile: UserProfile;
  procedureInterest: ProcedureInterest;
  bookingIntent: number; // 0-100 score
  lastStageChange?: number; // timestamp
}

export interface UserProfile {
  concerns: string[];
  objections: string[];
  location?: string;
  previousTreatments?: string[];
  painPoints: string[];
}

export interface ProcedureInterest {
  yomi: number;
  tmj: number;
  emface: number;
}

export interface ChatbotConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  personality: PersonalityTraits;
}

export interface PersonalityTraits {
  name: string;
  role: string;
  tone: string[];
  localReferences: boolean;
  socraticLevel: 'light' | 'moderate' | 'intensive';
}

export interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
  procedure: string;
}

export interface Analytics {
  conversationId: string;
  startTime: Date;
  endTime?: Date;
  messagesCount: number;
  bookingAttempted: boolean;
  bookingCompleted: boolean;
  procedureDiscussed: string[];
  objectionCount: number;
  conversionStage: ConversationStage;
}