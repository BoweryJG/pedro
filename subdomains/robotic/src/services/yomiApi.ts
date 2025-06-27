import axios from 'axios'

const API_BASE_URL = 'https://pedrobackend.onrender.com'

// Create axios instance with default config
const yomiApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens if needed
yomiApi.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('yomi_auth_token')
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
yomiApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('yomi_auth_token')
      console.warn('Unauthorized access - token removed')
    }
    return Promise.reject(error)
  }
)

// Types for API requests and responses
export interface YomiFeature {
  id: string
  title: string
  description: string
  category: 'precision' | 'planning' | 'navigation' | 'safety'
  benefits: string[]
  technicalSpecs?: Record<string, string>
  videoUrl?: string
  imageUrl?: string
}

export interface RoboticConsultationData {
  patientInfo: {
    name: string
    email: string
    phone: string
  }
  implantNeeds: {
    type: 'single' | 'multiple' | 'full_mouth'
    location: string[]
    complexity: 'simple' | 'moderate' | 'complex'
    timeframe: string
  }
  roboticInterest: {
    primaryConcerns: string[]
    technologyQuestions: string[]
    costConcerns: boolean
  }
  qualificationScore: number
}

export interface YomiProcedureRequest {
  patientName: string
  email: string
  phone: string
  procedureType: 'consultation' | 'planning' | 'surgery' | 'follow_up'
  implantDetails: {
    quantity: number
    locations: string[]
    complexity: string
  }
  preferredDate: string
  preferredTime: string
  specialRequests?: string
}

export interface RoboticVsTraditionalComparison {
  feature: string
  robotic: string
  traditional: string
  advantage: 'robotic' | 'traditional' | 'equal'
  description: string
}

export interface YomiTechnologyShowcase {
  stage: string
  title: string
  description: string
  duration: string
  keyFeatures: string[]
  patientBenefits: string[]
}

// API Functions
export const yomiApiService = {
  // Get Yomi features from database
  getYomiFeatures: async (category?: string) => {
    try {
      const url = category 
        ? `/api/yomi/features?category=${category}`
        : '/api/yomi/features'
      const response = await yomiApi.get(url)
      return response.data
    } catch (error) {
      console.error('Error fetching Yomi features:', error)
      throw error
    }
  },

  // Submit robotic implant consultation
  submitRoboticConsultation: async (consultationData: RoboticConsultationData) => {
    try {
      const response = await yomiApi.post('/api/yomi/consultation', consultationData)
      return response.data
    } catch (error) {
      console.error('Error submitting robotic consultation:', error)
      throw error
    }
  },

  // Schedule Yomi procedure appointment
  scheduleYomiProcedure: async (procedureData: YomiProcedureRequest) => {
    try {
      const response = await yomiApi.post('/api/appointments/yomi-schedule', {
        ...procedureData,
        specialty: 'yomi_robotic',
        source: 'robotic_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error scheduling Yomi procedure:', error)
      throw error
    }
  },

  // Get robotic vs traditional comparison data
  getRoboticComparison: async () => {
    try {
      const response = await yomiApi.get('/api/yomi/comparison')
      return response.data
    } catch (error) {
      console.error('Error fetching robotic comparison:', error)
      throw error
    }
  },

  // Get Yomi technology showcase data
  getTechnologyShowcase: async () => {
    try {
      const response = await yomiApi.get('/api/yomi/technology-showcase')
      return response.data
    } catch (error) {
      console.error('Error fetching technology showcase:', error)
      throw error
    }
  },

  // Calculate robotic implant costs
  calculateRoboticCost: async (calculationData: {
    implantType: 'single' | 'multiple' | 'full_mouth'
    quantity: number
    complexity: 'simple' | 'moderate' | 'complex'
    includeCrown: boolean
    additionalServices: string[]
  }) => {
    try {
      const response = await yomiApi.post('/api/yomi/cost-calculator', {
        ...calculationData,
        roboticTechnology: true
      })
      return response.data
    } catch (error) {
      console.error('Error calculating robotic cost:', error)
      throw error
    }
  },

  // Submit contact form with Yomi-specific inquiries
  submitYomiContactForm: async (contactData: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
    source: 'robotic_website' | 'yomi_chatbot' | 'technology_showcase' | 'comparison_tool'
    technologyQuestions?: string[]
  }) => {
    try {
      const response = await yomiApi.post('/api/contact/yomi-submit', contactData)
      return response.data
    } catch (error) {
      console.error('Error submitting Yomi contact form:', error)
      throw error
    }
  },

  // Get available slots for Yomi procedures
  getYomiAvailableSlots: async (date: string, procedureType?: string) => {
    try {
      const params = new URLSearchParams({
        date,
        specialty: 'yomi_robotic'
      })
      if (procedureType) {
        params.append('procedure_type', procedureType)
      }
      const response = await yomiApi.get(`/api/appointments/yomi-available-slots?${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching Yomi available slots:', error)
      throw error
    }
  },

  // Submit Instagram DM request for Yomi inquiry
  submitYomiInstagramInquiry: async (inquiry: {
    patientName: string
    phone: string
    roboticInterest: string[]
    technologyQuestions: string[]
    urgency: 'low' | 'medium' | 'high'
    budgetRange?: string
  }) => {
    try {
      const response = await yomiApi.post('/api/instagram/yomi-inquiry', {
        ...inquiry,
        source: 'robotic_subdomain',
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error submitting Yomi Instagram inquiry:', error)
      throw error
    }
  },

  // Get Yomi certification and training info
  getYomiCertification: async () => {
    try {
      const response = await yomiApi.get('/api/yomi/certification')
      return response.data
    } catch (error) {
      console.error('Error fetching Yomi certification:', error)
      throw error
    }
  },

  // Analytics tracking for robotic subdomain
  trackYomiEvent: async (eventData: {
    event: string
    page: string
    component?: string
    data?: Record<string, any>
  }) => {
    try {
      const response = await yomiApi.post('/api/analytics/track', {
        ...eventData,
        source: 'robotic_subdomain',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
      return response.data
    } catch (error) {
      // Don't throw analytics errors to avoid disrupting user experience
      console.warn('Yomi analytics tracking failed:', error)
    }
  },

  // Submit Yomi chatbot conversation data
  submitYomiChatbotConversation: async (conversationData: {
    messages: Array<{
      text: string
      sender: 'user' | 'bot'
      timestamp: Date
    }>
    outcome: 'yomi_appointment_scheduled' | 'technology_demo_requested' | 'cost_calculated' | 'information_provided' | 'no_action'
    patientInterest: string[]
    technologyQuestions: string[]
    roboticReadiness?: number
  }) => {
    try {
      const response = await yomiApi.post('/api/chatbot/yomi-conversation', {
        ...conversationData,
        source: 'robotic_subdomain'
      })
      return response.data
    } catch (error) {
      console.error('Error submitting Yomi chatbot conversation:', error)
      throw error
    }
  },

  // Get Yomi procedure timeline and planning
  getYomiProcedureTimeline: async (procedureType: string) => {
    try {
      const response = await yomiApi.get(`/api/yomi/procedure-timeline?type=${procedureType}`)
      return response.data
    } catch (error) {
      console.error('Error fetching Yomi procedure timeline:', error)
      throw error
    }
  },

  // Verify insurance coverage for robotic procedures
  verifyRoboticInsurance: async (insuranceData: {
    provider: string
    memberNumber: string
    patientName: string
    dateOfBirth: string
    procedureType: string
    roboticTechnology: boolean
  }) => {
    try {
      const response = await yomiApi.post('/api/insurance/verify', {
        ...insuranceData,
        specialty: 'yomi_robotic'
      })
      return response.data
    } catch (error) {
      console.error('Error verifying robotic insurance:', error)
      throw error
    }
  }
}

// Utility functions for Yomi-specific operations
export const yomiApiUtils = {
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

  // Calculate robotic readiness score
  calculateRoboticReadiness: (data: {
    technologyComfort: number // 1-10
    budgetFlexibility: number // 1-10
    healingPriority: number // 1-10
    precisionImportance: number // 1-10
  }): number => {
    const weights = {
      technologyComfort: 0.2,
      budgetFlexibility: 0.3,
      healingPriority: 0.25,
      precisionImportance: 0.25
    }
    
    return Math.round(
      (data.technologyComfort * weights.technologyComfort +
       data.budgetFlexibility * weights.budgetFlexibility +
       data.healingPriority * weights.healingPriority +
       data.precisionImportance * weights.precisionImportance) * 10
    )
  },

  // Format currency for robotic procedures
  formatRoboticCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },

  // Calculate technology premium percentage
  calculateTechnologyPremium: (roboticCost: number, traditionalCost: number): number => {
    if (traditionalCost === 0) return 0
    return Math.round(((roboticCost - traditionalCost) / traditionalCost) * 100)
  },

  // Determine complexity level based on implant details
  determineComplexity: (implantDetails: {
    quantity: number
    locations: string[]
    boneQuality?: 'excellent' | 'good' | 'fair' | 'poor'
    previousSurgery?: boolean
  }): 'simple' | 'moderate' | 'complex' => {
    let complexityScore = 0
    
    // Quantity factor
    if (implantDetails.quantity > 6) complexityScore += 3
    else if (implantDetails.quantity > 3) complexityScore += 2
    else if (implantDetails.quantity > 1) complexityScore += 1
    
    // Location factor
    const posteriorLocations = implantDetails.locations.filter(loc => 
      loc.includes('molar') || loc.includes('posterior')
    ).length
    complexityScore += posteriorLocations
    
    // Bone quality factor
    if (implantDetails.boneQuality === 'poor') complexityScore += 3
    else if (implantDetails.boneQuality === 'fair') complexityScore += 2
    
    // Previous surgery factor
    if (implantDetails.previousSurgery) complexityScore += 2
    
    if (complexityScore >= 6) return 'complex'
    if (complexityScore >= 3) return 'moderate'
    return 'simple'
  },

  // Format date for API requests
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0]
  }
}

export default yomiApi