import axios from 'axios'

const API_BASE_URL = 'https://pedrobackend.onrender.com'

// Create axios instance with default config
const implantApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
implantApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('implant_auth_token')
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
implantApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('implant_auth_token')
      console.warn('Unauthorized access - token removed')
    }
    return Promise.reject(error)
  }
)

// Types for API requests and responses
export interface ImplantConsultationData {
  patientInfo: {
    name: string
    email: string
    phone: string
  }
  implantNeeds: {
    type: 'single' | 'multiple' | 'full_mouth'
    location: string[]
    timeframe: string
  }
  qualificationScore: number
  creditScore?: number
}

export interface FinancingApplication {
  patientName: string
  email: string
  phone: string
  creditScore?: number
  income: number
  treatmentCost: number
  provider: 'Cherry' | 'Sunbit' | 'CareCredit' | 'Affirm'
  softCreditCheck: boolean
}

export interface ImplantCostCalculation {
  implantType: 'single' | 'multiple' | 'full_mouth'
  quantity: number
  includeCrown: boolean
  bonusServices: string[]
  estimatedCost: {
    min: number
    max: number
  }
  financingOptions: Array<{
    provider: string
    monthlyPayment: number
    term: number
  }>
}

export interface AppointmentRequest {
  patientName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  reasonForVisit: string
  insuranceProvider?: string
  implantNeeds: string[]
  consultationType: 'initial' | 'follow_up' | 'surgical'
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  source: 'implant_website' | 'chatbot' | 'cost_calculator' | 'financing_wizard'
}

// API Functions
export const implantApiService = {
  // Submit implant consultation data
  submitConsultation: async (consultationData: ImplantConsultationData) => {
    try {
      const response = await implantApi.post('/api/implants/consultation', consultationData)
      return response.data
    } catch (error) {
      console.error('Error submitting implant consultation:', error)
      throw error
    }
  },

  // Calculate implant costs with financing options
  calculateImplantCost: async (calculationData: {
    implantType: 'single' | 'multiple' | 'full_mouth'
    quantity: number
    includeCrown: boolean
    bonusServices: string[]
  }) => {
    try {
      const response = await implantApi.post('/api/implants/cost-calculator', calculationData)
      return response.data
    } catch (error) {
      console.error('Error calculating implant cost:', error)
      throw error
    }
  },

  // Submit financing pre-qualification
  submitFinancingApplication: async (financingData: FinancingApplication) => {
    try {
      const response = await implantApi.post('/api/financing/pre-qualify', {
        ...financingData,
        specialty: 'implants',
        source: 'implant_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error submitting financing application:', error)
      throw error
    }
  },

  // Perform soft credit check
  performSoftCreditCheck: async (creditData: {
    patientName: string
    email: string
    phone: string
    ssn?: string
    dateOfBirth: string
  }) => {
    try {
      const response = await implantApi.post('/api/financing/soft-credit-check', {
        ...creditData,
        specialty: 'implants'
      })
      return response.data
    } catch (error) {
      console.error('Error performing soft credit check:', error)
      throw error
    }
  },

  // Schedule implant appointment
  scheduleAppointment: async (appointmentData: AppointmentRequest) => {
    try {
      const response = await implantApi.post('/api/appointments/schedule', {
        ...appointmentData,
        specialty: 'implants',
        source: 'implant_subdomain'
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
      const response = await implantApi.post('/api/contact/submit', contactData)
      return response.data
    } catch (error) {
      console.error('Error submitting contact form:', error)
      throw error
    }
  },

  // Get available appointment slots for implant procedures
  getAvailableSlots: async (date: string, procedureType?: string) => {
    try {
      const params = new URLSearchParams({
        date,
        specialty: 'implants'
      })
      if (procedureType) {
        params.append('procedure_type', procedureType)
      }
      const response = await implantApi.get(`/api/appointments/available-slots?${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching available slots:', error)
      throw error
    }
  },

  // Submit Instagram DM request for implant inquiry
  submitInstagramInquiry: async (inquiry: {
    patientName: string
    phone: string
    implantNeeds: string[]
    urgency: 'low' | 'medium' | 'high'
    budgetRange?: string
  }) => {
    try {
      const response = await implantApi.post('/api/instagram/implant-inquiry', {
        ...inquiry,
        source: 'implant_subdomain',
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error submitting Instagram inquiry:', error)
      throw error
    }
  },

  // Get implant treatment information
  getImplantInfo: async (implantType?: string) => {
    try {
      const url = implantType 
        ? `/api/implants/treatments?type=${implantType}`
        : '/api/implants/treatments'
      const response = await implantApi.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching implant info:', error)
      throw error
    }
  },

  // Verify insurance coverage for implant procedures
  verifyInsurance: async (insuranceData: {
    provider: string
    memberNumber: string
    patientName: string
    dateOfBirth: string
    procedureType: string
  }) => {
    try {
      const response = await implantApi.post('/api/insurance/verify', {
        ...insuranceData,
        specialty: 'implants'
      })
      return response.data
    } catch (error) {
      console.error('Error verifying insurance:', error)
      throw error
    }
  },

  // Analytics tracking for implant subdomain
  trackEvent: async (eventData: {
    event: string
    page: string
    component?: string
    data?: Record<string, any>
  }) => {
    try {
      const response = await implantApi.post('/api/analytics/track', {
        ...eventData,
        source: 'implant_subdomain',
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
    outcome: 'appointment_scheduled' | 'financing_started' | 'cost_calculated' | 'information_provided' | 'no_action'
    patientInterest: string[]
    qualificationScore?: number
  }) => {
    try {
      const response = await implantApi.post('/api/chatbot/implant-conversation', {
        ...conversationData,
        source: 'implant_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error submitting chatbot conversation:', error)
      throw error
    }
  },

  // Get financing options from multiple providers
  getFinancingOptions: async (treatmentCost: number) => {
    try {
      const response = await implantApi.get(`/api/financing/options?cost=${treatmentCost}&specialty=implants`)
      return response.data
    } catch (error) {
      console.error('Error fetching financing options:', error)
      throw error
    }
  }
}

// Utility functions for common API operations
export const implantApiUtils = {
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

  // Calculate qualification score based on implant needs and financial data
  calculateQualificationScore: (data: {
    creditScore?: number
    income?: number
    treatmentCost: number
    hasInsurance: boolean
  }): number => {
    let score = 0
    
    // Credit score factor (40%)
    if (data.creditScore) {
      if (data.creditScore >= 750) score += 40
      else if (data.creditScore >= 700) score += 35
      else if (data.creditScore >= 650) score += 25
      else if (data.creditScore >= 600) score += 15
      else score += 5
    }
    
    // Income to cost ratio (30%)
    if (data.income && data.treatmentCost) {
      const ratio = data.income / data.treatmentCost
      if (ratio >= 10) score += 30
      else if (ratio >= 5) score += 25
      else if (ratio >= 3) score += 15
      else score += 5
    }
    
    // Insurance coverage (20%)
    if (data.hasInsurance) score += 20
    
    // Base qualification (10%)
    score += 10
    
    return Math.min(100, score)
  },

  // Format currency for display
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },

  // Calculate monthly payment
  calculateMonthlyPayment: (principal: number, rate: number, termMonths: number): number => {
    if (rate === 0) return principal / termMonths
    const monthlyRate = rate / 100 / 12
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
           (Math.pow(1 + monthlyRate, termMonths) - 1)
  },

  // Format date for API requests
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0]
  }
}

export default implantApi