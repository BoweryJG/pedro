export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface AppointmentRequest {
  patientName: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  treatmentType: string
  message?: string
}

export interface ConsultationRequest {
  name: string
  email: string
  phone: string
  age: number
  skinConcerns: string[]
  previousTreatments: string[]
  goals: string
  budget: string
}

class MedSpaApiService {
  private baseUrl = 'https://pedrobackend.onrender.com'

  async bookAppointment(appointment: AppointmentRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointment,
          source: 'medspa_subdomain',
          type: 'aesthetic_consultation'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to book appointment')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async submitConsultationRequest(consultation: ConsultationRequest): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultation,
          source: 'medspa_subdomain',
          type: 'aesthetic_consultation'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit consultation request')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async getServices(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/services?category=MedSpa`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async requestFinancingInfo(amount: number, term: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/financing/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          term,
          type: 'aesthetic_treatment'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate financing')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async sendContactMessage(message: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...message,
          source: 'medspa_subdomain'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export const medspaApi = new MedSpaApiService()