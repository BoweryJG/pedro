import axios from 'axios'

const API_BASE_URL = 'https://pedrobackend.onrender.com'

// Create axios instance with default config
const tmjApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
tmjApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('tmj_auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling common errors
tmjApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('tmj_auth_token')
      console.warn('Unauthorized access - token removed')
    }
    return Promise.reject(error)
  }
)

// Types for API requests and responses
export interface TMJAssessmentData {
  patientInfo: {
    name: string
    email: string
    phone: string
  }
  symptoms: Record<string, string>
  score: number
  riskLevel: string
}

export interface AppointmentRequest {
  patientName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  reasonForVisit: string
  insuranceProvider?: string
  symptoms?: string[]
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  source: 'tmj_website' | 'chatbot' | 'assessment'
}

export interface TMJPatientData {
  id: string
  name: string
  email: string
  phone: string
  symptoms: string[]
  assessmentScore: number
  riskLevel: string
  treatmentPlan?: string
  appointmentHistory: Array<{
    date: string
    type: string
    notes: string
  }>
}

// API Functions
export const tmjApiService = {
  // Submit TMJ assessment results
  submitAssessment: async (assessmentData: TMJAssessmentData) => {
    try {
      const response = await tmjApi.post('/api/tmj/assessment', assessmentData)
      return response.data
    } catch (error) {
      console.error('Error submitting TMJ assessment:', error)
      throw error
    }
  },

  // Schedule appointment
  scheduleAppointment: async (appointmentData: AppointmentRequest) => {
    try {
      const response = await tmjApi.post('/api/appointments/schedule', {
        ...appointmentData,
        specialty: 'tmj',
        source: 'tmj_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      throw error
    }
  },

  // Submit contact form
  submitContactForm: async (contactData: ContactFormData) => {
    try {
      const response = await tmjApi.post('/api/contact/submit', contactData)
      return response.data
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },

  // Get available appointment slots
  getAvailableSlots: async (date: string) => {
    try {
      const response = await tmjApi.get(`/api/appointments/available-slots?date=${date}&specialty=tmj`)
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  // Submit Instagram DM request for TMJ inquiry
  submitInstagramInquiry: async (inquiry: {
    patientName: string
    phone: string
    symptoms: string[]
    urgency: 'low' | 'medium' | 'high'
  }) => {
    try {
      const response = await tmjApi.post('/api/instagram/tmj-inquiry', {
        ...inquiry,
        source: 'tmj_subdomain',
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error submitting Instagram inquiry:', error)
      throw error
    }
  },

  // Get TMJ treatment information
  getTreatmentInfo: async (treatmentType?: string) => {
    try {
      const url = treatmentType 
        ? `/api/tmj/treatments?type=${treatmentType}`
        : '/api/tmj/treatments'
      const response = await tmjApi.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching treatment info:', error)
      throw error
    }
  },

  // Verify insurance coverage for TMJ treatment
  verifyInsurance: async (insuranceData: {
    provider: string
    memberNumber: string
    patientName: string
    dateOfBirth: string
  }) => {
    try {
      const response = await tmjApi.post('/api/insurance/verify', {
        ...insuranceData,
        specialty: 'tmj'
      })
      return response.data
    } catch (error) {
      console.error('Error verifying insurance:', error)
      throw error
    }
  },

  // Analytics tracking for TMJ subdomain
  trackEvent: async (eventData: {
    event: string
    page: string
    component?: string
    data?: Record<string, any>
  }) => {
    try {
      const response = await tmjApi.post('/api/analytics/track', {
        ...eventData,
        source: 'tmj_subdomain',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
      return response.data
    } catch (error) {
      // Don't throw analytics errors to avoid disrupting user experience
      console.warn('Analytics tracking failed:', error)
    }
  },

  // Submit chatbot conversation data
  submitChatbotConversation: async (conversationData: {
    messages: Array<{
      text: string
      sender: 'user' | 'bot'
      timestamp: Date
    }>
    outcome: 'appointment_scheduled' | 'assessment_taken' | 'information_provided' | 'no_action'
    patientInterest: string[]
  }) => {
    try {
      const response = await tmjApi.post('/api/chatbot/tmj-conversation', {
        ...conversationData,
        source: 'tmj_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error submitting chatbot conversation:', error)
      throw error
    }
  }
}

// Utility functions for common API operations
export const tmjApiUtils = {
  // Format phone number for API submission
  formatPhoneNumber: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    return cleaned.startsWith('1') ? `+${cleaned}` : phone
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Calculate assessment risk level
  calculateRiskLevel: (score: number): 'Low Risk' | 'Moderate Risk' | 'High Risk' => {
    if (score <= 8) return 'Low Risk'
    if (score <= 16) return 'Moderate Risk'
    return 'High Risk'
  },

  // Format date for API requests
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0]
  }
}

export default tmjApi