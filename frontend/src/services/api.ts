import axios from 'axios';
import ENV from '../config/environment';
import { supabase } from '../lib/supabase';

// Get the backend URL from validated environment configuration
const API_URL = ENV.API_URL;

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for authentication
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  async (config) => {
    // Get the current session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
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

// Authentication API calls - Now handled by Supabase
export const authAPI = {
  // These are kept for backward compatibility but use Supabase under the hood
  signup: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName
        }
      }
    });
    return { data: authData, error };
  },
  
  signin: async (data: { email: string; password: string }) => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    return { data: authData, error };
  },
  
  signout: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
  
  updateUser: async (data: { email?: string; firstName?: string; lastName?: string; phone?: string }) => {
    const updates: any = {};
    if (data.email) updates.email = data.email;
    if (data.firstName || data.lastName || data.phone) {
      updates.data = {
        ...(data.firstName && { first_name: data.firstName }),
        ...(data.lastName && { last_name: data.lastName }),
        ...(data.phone && { phone: data.phone })
      };
    }
    const { data: user, error } = await supabase.auth.updateUser(updates);
    return { data: user, error };
  },
  
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { data: user, error };
  },
};

// Appointments API calls
export const appointmentsAPI = {
  getUpcoming: () =>
    api.get('/appointments/upcoming'),
  
  getHistory: () =>
    api.get('/appointments/history'),
  
  getById: (id: string) =>
    api.get(`/appointments/${id}`),
  
  create: (data: {
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
  }) =>
    api.post('/appointments', data),
  
  update: (id: string, data: {
    serviceId?: string;
    date?: string;
    time?: string;
    notes?: string;
    status?: string;
  }) =>
    api.put(`/appointments/${id}`, data),
  
  cancel: (id: string) =>
    api.delete(`/appointments/${id}`),
};

// Services API calls
export const servicesAPI = {
  getAll: () =>
    api.get('/services/services'),
  
  getYomiFeatures: () =>
    api.get('/services/yomi-features'),
  
  getStaff: () =>
    api.get('/services/staff'),
  
  getTestimonials: () =>
    api.get('/services/testimonials'),
  
  getById: (id: string) =>
    api.get(`/services/${id}`),
};

// Chat API - This will replace the Netlify function
export const chatAPI = {
  sendMessage: async (messages: Array<{ role: string; content: string }>) => {
    try {
      const response = await api.post('/chat', { messages });
      return response.data;
    } catch (error) {
      console.error('Chat API Error:', error);
      throw error;
    }
  },
};

// Health check to verify backend connection
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return null;
  }
};

export default api;