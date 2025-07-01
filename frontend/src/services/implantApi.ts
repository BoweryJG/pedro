import api from './api';

interface FinancingApplication {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  treatmentInfo: {
    totalCost: number;
    downPayment: number;
    financingAmount: number;
  };
  financingDetails: {
    term: number;
    creditScore: string;
  };
}

interface ChatbotConversation {
  messages: Array<{
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  }>;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface TrackingEvent {
  eventType: string;
  data: any;
  timestamp?: Date;
}

export const implantApiService = {
  // Submit financing application
  submitFinancingApplication: async (application: FinancingApplication) => {
    try {
      const response = await api.post('/implants/financing/apply', application);
      return response.data;
    } catch (error) {
      console.error('Financing application error:', error);
      throw error;
    }
  },

  // Submit chatbot conversation for lead generation
  submitChatbotConversation: async (conversation: ChatbotConversation) => {
    try {
      const response = await api.post('/implants/chatbot/conversation', conversation);
      return response.data;
    } catch (error) {
      console.error('Chatbot submission error:', error);
      throw error;
    }
  },

  // Track user events for analytics
  trackEvent: async (event: TrackingEvent) => {
    try {
      const response = await api.post('/implants/analytics/track', {
        ...event,
        timestamp: event.timestamp || new Date()
      });
      return response.data;
    } catch (error) {
      console.error('Event tracking error:', error);
      // Don't throw errors for analytics to avoid disrupting user experience
      return null;
    }
  },

  // Get implant pricing information
  getImplantPricing: async () => {
    try {
      const response = await api.get('/implants/pricing');
      return response.data;
    } catch (error) {
      console.error('Pricing fetch error:', error);
      throw error;
    }
  },

  // Calculate financing options
  calculateFinancing: async (amount: number, term: number, creditScore: string) => {
    try {
      const response = await api.post('/implants/financing/calculate', {
        amount,
        term,
        creditScore
      });
      return response.data;
    } catch (error) {
      console.error('Financing calculation error:', error);
      throw error;
    }
  }
};

export const implantApiUtils = {
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  calculateMonthlyPayment: (principal: number, rate: number, months: number): number => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / months;
    
    const payment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    return Math.round(payment);
  },

  getFinancingTerms: (creditScore: string): { rate: number; maxTerm: number } => {
    switch (creditScore) {
      case 'excellent':
        return { rate: 9.99, maxTerm: 60 };
      case 'good':
        return { rate: 14.99, maxTerm: 48 };
      case 'fair':
        return { rate: 19.99, maxTerm: 36 };
      default:
        return { rate: 24.99, maxTerm: 24 };
    }
  }
};