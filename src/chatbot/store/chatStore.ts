import { create } from 'zustand';
import type { Message, ConversationState, ConversationStage, Analytics } from '../types';
import { OpenAIService } from '../core/openaiService';

interface ChatStore {
  // State
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
  currentStage: ConversationStage;
  bookingIntent: number;
  userProfile: {
    concerns: string[];
    objections: string[];
    location?: string;
    painPoints: string[];
  };
  procedureInterest: {
    yomi: number;
    tmj: number;
    emface: number;
  };
  analytics: Analytics | null;
  suggestedResponses: string[];
  
  // Actions
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateStage: (stage: ConversationStage) => void;
  updateBookingIntent: (score: number) => void;
  trackAnalytics: (event: string, data?: any) => void;
  reset: () => void;
}

// Initialize OpenAI service (API key should come from environment variable)
const chatbotConfig = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 500,
  personality: {
    name: 'Sophie',
    role: 'Virtual Smile Consultant',
    tone: ['warm', 'professional', 'empathetic'],
    localReferences: true,
    socraticLevel: 'moderate' as const
  }
};

const initialState = {
  isOpen: false,
  isLoading: false,
  messages: [
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm Sophie, Dr. Pedro's virtual smile consultant. 😊 Whether you're curious about our robotic dental implants, dealing with jaw pain, or interested in facial rejuvenation, I'm here to help. What brings you to our Staten Island practice today?",
      timestamp: new Date()
    }
  ],
  currentStage: 'greeting' as ConversationStage,
  bookingIntent: 0,
  userProfile: {
    concerns: [],
    objections: [],
    painPoints: []
  },
  procedureInterest: {
    yomi: 0,
    tmj: 0,
    emface: 0
  },
  analytics: null,
  suggestedResponses: [
    "I'm missing a tooth",
    "My jaw clicks and hurts", 
    "Tell me about facial rejuvenation"
  ]
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  sendMessage: async (content: string) => {
    const state = get();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true
    }));
    
    try {
      // Create conversation state for OpenAI service
      const conversationState: ConversationState = {
        messages: state.messages,
        currentStage: state.currentStage,
        userProfile: state.userProfile,
        procedureInterest: state.procedureInterest,
        bookingIntent: state.bookingIntent
      };
      
      // Initialize service and generate response
      const openAIService = new OpenAIService(chatbotConfig, conversationState);
      const response = await openAIService.generateResponse(content, state.messages);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      // Detect procedure interest
      const detectedProcedure = detectProcedureFromMessage(content);
      
      // Update suggested responses based on stage
      const newStage = determineStage([...state.messages, userMessage, assistantMessage]);
      const suggestedResponses = openAIService.generateSuggestedResponses(newStage);
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        currentStage: newStage,
        bookingIntent: calculateBookingIntent([...state.messages, assistantMessage]),
        procedureInterest: detectedProcedure ? {
          ...state.procedureInterest,
          [detectedProcedure]: state.procedureInterest[detectedProcedure] + 20
        } : state.procedureInterest,
        suggestedResponses
      }));
      
      // Track analytics
      get().trackAnalytics('message_sent', {
        stage: newStage,
        procedure: detectedProcedure,
        bookingIntent: get().bookingIntent
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, I'm having a moment. Could you please rephrase your question about our dental services?",
        timestamp: new Date()
      };
      
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false
      }));
    }
  },
  
  updateStage: (stage) => set({ currentStage: stage }),
  
  updateBookingIntent: (score) => set({ bookingIntent: score }),
  
  trackAnalytics: (event, data) => {
    const state = get();
    
    // In production, send to analytics service
    console.log('Analytics Event:', event, data);
    
    // Update local analytics
    if (!state.analytics) {
      set({
        analytics: {
          conversationId: Date.now().toString(),
          startTime: new Date(),
          messagesCount: state.messages.length,
          bookingAttempted: false,
          bookingCompleted: false,
          procedureDiscussed: [],
          objectionCount: 0,
          conversionStage: state.currentStage
        }
      });
    }
  },
  
  reset: () => set(initialState)
}));

// Helper functions
function detectProcedureFromMessage(message: string): 'yomi' | 'tmj' | 'emface' | null {
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

function determineStage(messages: Message[]): ConversationStage {
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMessage = userMessages[userMessages.length - 1];
  const keywords = lastUserMessage?.content.toLowerCase() || '';
  
  if (keywords.match(/book|appointment|schedule|available|consultation/)) {
    return 'booking';
  }
  
  if (keywords.match(/cost|expensive|insurance|afford|pain|hurt|time|busy/)) {
    return 'objection-handling';
  }
  
  const messageCount = userMessages.length;
  
  if (messageCount <= 2) return 'greeting';
  if (messageCount <= 4) return 'discovery';
  if (messageCount <= 7) return 'education';
  if (messageCount <= 10) return 'social-proof';
  
  return 'commitment';
}

function calculateBookingIntent(messages: Message[]): number {
  let score = 0;
  
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
  
  return Math.min(100, score);
}