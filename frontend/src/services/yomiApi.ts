import api from './api';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  preferredTime?: string;
}

export const yomiApiService = {
  // Submit chat conversation for lead generation
  submitChatConversation: async (messages: ChatMessage[], contactInfo?: ContactInfo) => {
    try {
      const response = await api.post('/yomi/chat/conversation', {
        messages,
        contactInfo,
        timestamp: new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Yomi chat submission error:', error);
      throw error;
    }
  },

  // Get Yomi technology information
  getYomiInfo: async () => {
    try {
      const response = await api.get('/yomi/info');
      return response.data;
    } catch (error) {
      console.error('Yomi info fetch error:', error);
      throw error;
    }
  },

  // Schedule Yomi consultation
  scheduleConsultation: async (data: {
    name: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    message?: string;
  }) => {
    try {
      const response = await api.post('/yomi/consultation/schedule', data);
      return response.data;
    } catch (error) {
      console.error('Yomi consultation scheduling error:', error);
      throw error;
    }
  },

  // Track user interactions
  trackInteraction: async (interactionType: string, data?: any) => {
    try {
      const response = await api.post('/yomi/analytics/track', {
        type: interactionType,
        data,
        timestamp: new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Yomi interaction tracking error:', error);
      // Don't throw errors for analytics
      return null;
    }
  }
};

export const yomiApiUtils = {
  formatRoboticScore: (score: number): string => {
    return `${score}/10`;
  },

  calculateRoboticReadiness: (data: {
    technologyComfort: number;
    budgetFlexibility: number;
    healingPriority: number;
    precisionImportance: number;
  }): number => {
    const weights = {
      technologyComfort: 0.2,
      budgetFlexibility: 0.2,
      healingPriority: 0.3,
      precisionImportance: 0.3
    };

    return Math.round(
      data.technologyComfort * weights.technologyComfort +
      data.budgetFlexibility * weights.budgetFlexibility +
      data.healingPriority * weights.healingPriority +
      data.precisionImportance * weights.precisionImportance
    );
  }
};