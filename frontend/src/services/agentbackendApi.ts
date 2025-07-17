import axios from 'axios';
import { supabase } from '../lib/supabase';

// Agentbackend API URL
const AGENTBACKEND_URL = 'https://agentbackend-2932.onrender.com';

// Create an axios instance for agentbackend
const agentbackendApi = axios.create({
  baseURL: AGENTBACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Supabase JWT token
agentbackendApi.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      // Add the token in the format expected by agentbackend
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
agentbackendApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - sign out from Supabase
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Agent API calls
export const agentAPI = {
  // Get all agents
  getAllAgents: () => 
    agentbackendApi.get('/api/agents'),
  
  // Get agents by category
  getAgentsByCategory: (category: string, subcategory?: string) => {
    let url = `/api/agents?category=${category}`;
    if (subcategory) {
      url += `&subcategory=${subcategory}`;
    }
    return agentbackendApi.get(url);
  },
  
  // Get healthcare/dental agents
  getDentalAgents: () => 
    agentbackendApi.get('/api/agents?category=healthcare&subcategory=dental'),
  
  // Get agent by ID
  getAgentById: (agentId: string) => 
    agentbackendApi.get(`/api/agents/${agentId}`),
  
  // Create new agent
  createAgent: (agentData: Record<string, unknown>) => 
    agentbackendApi.post('/api/agents', agentData),
  
  // Update agent
  updateAgent: (agentId: string, agentData: Record<string, unknown>) => 
    agentbackendApi.put(`/api/agents/${agentId}`, agentData),
  
  // Delete agent
  deleteAgent: (agentId: string) => 
    agentbackendApi.delete(`/api/agents/${agentId}`),
  
  // Deploy agent to Pedro
  deployToPedro: (agent: Record<string, unknown>) => 
    agentbackendApi.post('/api/agents/deploy', {
      agent,
      targetPlatform: 'pedro',
      targetUrl: import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com'
    }),
};

// Chat API calls
export const agentChatAPI = {
  // Send message to agent
  sendMessage: (agentId: string, message: string, conversationId?: string) => 
    agentbackendApi.post('/api/chat', {
      agentId,
      message,
      conversationId: conversationId || `pedro_${Date.now()}`,
      clientId: 'pedro-frontend'
    }),
  
  // Get conversation history
  getConversationHistory: (conversationId: string) => 
    agentbackendApi.get(`/api/conversations/${conversationId}`),
  
  // Clear conversation
  clearConversation: (conversationId: string) => 
    agentbackendApi.delete(`/api/conversations/${conversationId}`),
};

// Health check to verify agentbackend connection
export const agentbackendHealthCheck = async () => {
  try {
    const response = await axios.get(`${AGENTBACKEND_URL}/health`);
    return response.data;
  } catch (error) {
    console.error('Agentbackend health check failed:', error);
    return null;
  }
};

export default agentbackendApi;