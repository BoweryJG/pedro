export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  quickReplies?: string[]
}

export interface ChatServiceConfig {
  specialty: string
  systemPrompt: string
  contact: {
    phone: string
    email: string
    address: string
    hours: {
      weekdays: string
      saturday: string
      sunday: string
    }
  }
}

class ChatService {
  private config: ChatServiceConfig
  private apiEndpoint: string

  constructor(config: ChatServiceConfig) {
    this.config = config
    // Use the main domain's chat endpoint for all subdomains
    this.apiEndpoint = 'https://drpedro.com/.netlify/functions/chat'
  }

  async sendMessage(messages: ChatMessage[]): Promise<ChatMessage> {
    try {
      // Convert messages to API format
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }))

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt: this.config.systemPrompt
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Generate quick replies based on the response
      const quickReplies = this.generateQuickReplies(data.response)

      return {
        id: Date.now().toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies
      }
    } catch (error) {
      console.error('Chat service error:', error)
      
      // Fallback response
      return {
        id: Date.now().toString(),
        text: `I apologize, I'm having trouble connecting right now. Please call us at ${this.config.contact.phone} or visit our office at ${this.config.contact.address} for immediate assistance.`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Call now", "Schedule consultation", "More questions"]
      }
    }
  }

  private generateQuickReplies(response: string): string[] {
    const text = response.toLowerCase()
    const replies: string[] = []

    // Common quick replies based on response content
    if (text.includes('schedule') || text.includes('appointment')) {
      replies.push("Schedule consultation")
    }
    
    if (text.includes('treatment') || text.includes('therapy')) {
      replies.push("Treatment options")
    }
    
    if (text.includes('insurance') || text.includes('coverage')) {
      replies.push("Insurance questions")
    }
    
    if (text.includes('cost') || text.includes('price') || text.includes('financing')) {
      replies.push("Cost information")
    }

    // Specialty-specific quick replies
    if (this.config.specialty === 'tmj') {
      if (text.includes('botox') || text.includes('injection')) {
        replies.push("BOTOX details")
      }
      if (text.includes('assessment') || text.includes('symptoms')) {
        replies.push("Take assessment")
      }
    } else if (this.config.specialty === 'implants') {
      if (text.includes('financing') || text.includes('payment')) {
        replies.push("Financing options")
      }
      if (text.includes('procedure') || text.includes('surgery')) {
        replies.push("Procedure details")
      }
    } else if (this.config.specialty === 'medspa') {
      if (text.includes('botox') || text.includes('filler')) {
        replies.push("Aesthetic treatments")
      }
      if (text.includes('combination') || text.includes('package')) {
        replies.push("Treatment packages")
      }
    } else if (this.config.specialty === 'robotic') {
      if (text.includes('yomi') || text.includes('robotic')) {
        replies.push("Yomi technology")
      }
      if (text.includes('precision') || text.includes('accuracy')) {
        replies.push("Benefits of robotics")
      }
    } else if (this.config.specialty === 'aboutface') {
      if (text.includes('facial') || text.includes('skin')) {
        replies.push("Facial treatments")
      }
      if (text.includes('rejuvenation') || text.includes('anti-aging')) {
        replies.push("Anti-aging options")
      }
    }

    // Always include these as fallbacks
    if (replies.length < 3) {
      if (!replies.includes("Schedule consultation")) {
        replies.push("Schedule consultation")
      }
      if (!replies.includes("More questions")) {
        replies.push("More questions")
      }
      replies.push("Call now")
    }

    return replies.slice(0, 4) // Limit to 4 quick replies
  }

  // Handle quick reply actions
  handleQuickReply(reply: string): boolean {
    if (reply === "Call now") {
      window.open(`tel:${this.config.contact.phone}`, '_blank')
      return true
    }
    
    if (reply === "Take assessment" && this.config.specialty === 'tmj') {
      const element = document.getElementById('tmj-assessment')
      element?.scrollIntoView({ behavior: 'smooth' })
      return true
    }

    return false // Return false if the quick reply should be sent as a message
  }

  // Get initial greeting message
  getInitialMessage(): ChatMessage {
    const greetings = {
      tmj: "Hi! I'm Dr. Pedro's TMJ specialist assistant. I can help you understand TMJ symptoms, treatment options, and schedule consultations. How can I assist you today?",
      implants: "Hello! I'm Dr. Pedro's dental implant specialist. I can help you learn about implant procedures, financing options, and schedule consultations. What would you like to know?",
      medspa: "Hi there! I'm Dr. Pedro's aesthetic specialist assistant. I can help you explore our med spa treatments, combination packages, and schedule consultations. How can I help you today?",
      robotic: "Welcome! I'm Dr. Pedro's robotic dentistry assistant. I can tell you about our advanced Yomi robot-assisted procedures and precision treatments. What interests you most?",
      aboutface: "Hello! I'm Dr. Pedro's facial aesthetic specialist. I can help you learn about our facial treatments, anti-aging procedures, and aesthetic options. How can I assist you?"
    }

    const quickReplies = {
      tmj: ["I have jaw pain", "Treatment options", "Schedule consultation", "Insurance questions"],
      implants: ["Implant process", "Financing options", "Schedule consultation", "Recovery time"],
      medspa: ["Aesthetic treatments", "Treatment packages", "Schedule consultation", "Cost information"],
      robotic: ["Yomi technology", "Benefits of robotics", "Schedule consultation", "Procedure details"],
      aboutface: ["Facial treatments", "Anti-aging options", "Schedule consultation", "Treatment gallery"]
    }

    return {
      id: '1',
      text: greetings[this.config.specialty as keyof typeof greetings] || greetings.tmj,
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: quickReplies[this.config.specialty as keyof typeof quickReplies] || quickReplies.tmj
    }
  }
}

export default ChatService
