import axios from 'axios';

// Get the backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';

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
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  signup: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/signup', data),
  
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),
  
  signout: () =>
    api.post('/auth/signout'),
  
  resetPassword: (email: string) =>
    api.post('/auth/reset', { email }),
  
  updateUser: (data: any) =>
    api.post('/auth/update', data),
  
  getCurrentUser: () =>
    api.get('/auth/user'),
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
  
  update: (id: string, data: any) =>
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
  sendMessage: async (messages: any[]) => {
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