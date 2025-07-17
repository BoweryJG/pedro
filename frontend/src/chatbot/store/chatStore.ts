import { create } from 'zustand';
import type { Message, ConversationStage, Analytics } from '../types';
// import { OpenAIService } from '../core/openaiService';
import { supabase } from '../../lib/supabase';
import { fetchAgents, type AgentPersonality } from '../config/agentPersonalities';

interface ChatStore {
  // State
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
  currentStage: ConversationStage;
  bookingIntent: number;
  conversationId: string | null;
  sessionId: string;
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
  showFinancingWidget: boolean;
  financingProcedure?: 'yomi' | 'tmj' | 'emface';
  
  // Agent-related state
  availableAgents: AgentPersonality[];
  selectedAgent: AgentPersonality | null;
  agentsLoading: boolean;
  
  // Actions
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  updateStage: (stage: ConversationStage) => void;
  updateBookingIntent: (score: number) => void;
  trackAnalytics: (event: string, data?: Record<string, unknown>) => void;
  reset: () => void;
  setShowFinancingWidget: (show: boolean, procedure?: 'yomi' | 'tmj' | 'emface') => void;
  saveConversationToSupabase: () => Promise<void>;
  
  // Agent-related actions
  loadAgents: () => Promise<void>;
  selectAgent: (agent: AgentPersonality) => void;
  sendMessageToAgent: (content: string, agentId?: string) => Promise<void>;
}

// Initialize chatbot configuration (no API key needed - using serverless function)
const _chatbotConfig = {
  apiKey: '', // Not needed when using serverless function
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 500,
  personality: {
    name: 'Julie',
    role: 'Your Personal Dental Care Assistant',
    tone: ['warm', 'caring', 'empathetic', 'helpful'],
    localReferences: true,
    socraticLevel: 'moderate' as const
  }
};

const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState = {
  isOpen: false,
  isLoading: false,
  conversationId: null,
  sessionId: generateSessionId(),
  messages: [
    {
      id: '1',
      role: 'assistant' as const,
      content: "Hi! I'm Julie, your EP3 Certified Care Coordinator! 😊 I understand that dental care can sometimes feel overwhelming, but I'm here to make everything easier for you. Whether you need to book an appointment, have questions about our procedures, want to check insurance coverage, or explore financing options - I'm here to help. What can I assist you with today?",
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
    "Book an appointment",
    "Check insurance coverage",
    "I need help with financing", 
    "Tell me about your services"
  ],
  showFinancingWidget: false,
  financingProcedure: undefined,
  
  // Agent-related initial state
  availableAgents: [],
  selectedAgent: null,
  agentsLoading: false
};

export const useChatStore = create<ChatStore>((set, get) => ({
  ...initialState,
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  openChat: () => set({ isOpen: true }),
  
  closeChat: () => set({ isOpen: false }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  sendMessage: async (content: string) => {
    const state = get();
    
    // If no agent is selected, load agents and select default
    if (!state.selectedAgent && state.availableAgents.length === 0) {
      await get().loadAgents();
    }
    
    const agentId = state.selectedAgent?.id || 'julie';
    await get().sendMessageToAgent(content, agentId);
  },

  sendMessageToAgent: async (content: string, agentId?: string) => {
    const state = get();
    const targetAgentId = agentId || state.selectedAgent?.id || 'julie';
    
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
      // Use agentbackend chat API directly
      const agentbackendUrl = 'https://agentbackend-2932.onrender.com';
      
      const response = await fetch(`${agentbackendUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: targetAgentId,
          message: content,
          conversationId: state.conversationId || `pedro_${state.sessionId}`,
          clientId: 'pedro-frontend'
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Agentbackend API failed: ${response.status}`);
      }
      
      const data = await response.json();
      const assistantResponse = data.response || data.message || "I apologize, I'm having trouble responding right now.";
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      // Update conversation ID if provided
      if (data.conversationId && !state.conversationId) {
        set({ conversationId: data.conversationId });
      }
      
      // Detect procedure interest and other Pedro-specific logic
      const detectedProcedure = detectProcedureFromMessage(content);
      const wantsFinancing = content.toLowerCase().match(/financing|finance|payment|cost|insurance|coverage|afford|qualify/);
      const wantsInsuranceCheck = content.toLowerCase().match(/verify insurance|check insurance|insurance coverage|benefits/);
      const wantsToBook = content.toLowerCase().match(/book|appointment|schedule|available|opening|slot|cancel|reschedule/);
      
      // Update suggested responses based on stage
      const newStage = determineStage([...state.messages, userMessage, assistantMessage]);
      const suggestedResponses = generateSuggestedResponsesForStage(newStage);
      
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
        currentStage: newStage,
        bookingIntent: calculateBookingIntent([...state.messages, assistantMessage]),
        procedureInterest: detectedProcedure ? {
          ...state.procedureInterest,
          [detectedProcedure]: state.procedureInterest[detectedProcedure] + 20
        } : state.procedureInterest,
        suggestedResponses,
        showFinancingWidget: (wantsFinancing || wantsInsuranceCheck) && detectedProcedure ? true : state.showFinancingWidget,
        financingProcedure: (wantsFinancing || wantsInsuranceCheck) && detectedProcedure ? detectedProcedure : state.financingProcedure
      }));
      
      // If user wants to book, open the booking page
      if (wantsToBook && assistantResponse.toLowerCase().includes('booking')) {
        setTimeout(() => {
          window.location.href = '/booking';
        }, 1500);
      }
      
      // Track analytics
      get().trackAnalytics('message_sent', {
        stage: newStage,
        procedure: detectedProcedure,
        bookingIntent: get().bookingIntent,
        agentId: targetAgentId
      });

      // Save to Supabase
      await get().saveConversationToSupabase();
      
    } catch (error) {
      console.error('Error sending message to agent:', error);
      
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
  
  reset: () => set({ ...initialState, sessionId: generateSessionId() }),
  
  setShowFinancingWidget: (show, procedure) => set({ 
    showFinancingWidget: show,
    financingProcedure: procedure 
  }),

  // Agent-related function implementations
  loadAgents: async () => {
    set({ agentsLoading: true });
    try {
      const agents = await fetchAgents();
      const defaultAgent = agents.find(agent => agent.id === 'julie') || agents[0];
      
      set({ 
        availableAgents: agents,
        selectedAgent: defaultAgent,
        agentsLoading: false 
      });
    } catch (error) {
      console.error('Failed to load agents:', error);
      set({ agentsLoading: false });
    }
  },

  selectAgent: (agent: AgentPersonality) => {
    set({ selectedAgent: agent });
    
    // Update the initial greeting message for the new agent
    const greetingMessage: Message = {
      id: '1',
      role: 'assistant' as const,
      content: `Hi! I'm ${agent.name}, ${agent.role}! ${agent.tagline} Whether you need to book an appointment, have questions about our procedures, want to check insurance coverage, or explore financing options - I'm here to help. What can I assist you with today?`,
      timestamp: new Date()
    };
    
    set(() => ({
      messages: [greetingMessage]
    }));
  },

  saveConversationToSupabase: async () => {
    const state = get();
    if (!state.conversationId) {
      // Create new conversation
      const { data: conversation, error: convError } = await supabase
        .from('julie_conversations')
        .insert({
          session_id: state.sessionId,
          conversation_type: 'chat',
          booking_intent: state.bookingIntent,
          procedure_interest: state.procedureInterest,
          user_profile: state.userProfile,
          status: 'active'
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return;
      }

      set({ conversationId: conversation.id });
      
      // Save all messages
      const messagesToSave = state.messages.map(msg => ({
        conversation_id: conversation.id,
        role: msg.role,
        content: msg.content,
        message_type: 'text',
        metadata: { timestamp: msg.timestamp }
      }));

      const { error: msgError } = await supabase
        .from('julie_messages')
        .insert(messagesToSave);

      if (msgError) {
        console.error('Error saving messages:', msgError);
      }
    } else {
      // Update existing conversation
      const { error: updateError } = await supabase
        .from('julie_conversations')
        .update({
          booking_intent: state.bookingIntent,
          procedure_interest: state.procedureInterest,
          user_profile: state.userProfile,
          updated_at: new Date().toISOString()
        })
        .eq('id', state.conversationId);

      if (updateError) {
        console.error('Error updating conversation:', updateError);
      }
    }
  }
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
  if (lower.match(/facial|rejuvenation|lift|wrinkle|aging|skin|botox|filler|dermal|aesthetic|anti-aging|medspa|emface|opus|plasma|beauty|cosmetic|treatment/)) {
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

function generateSuggestedResponsesForStage(currentStage: ConversationStage): string[] {
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