import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Fade,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Psychology,
  Phone,
  Close,
  SmartToy,
  CheckCircle,
  Schedule
} from '@mui/icons-material'
import { implantApiService } from '../../../services/implantApi'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'qualification' | 'financing'
  data?: any
}

interface FinancingQualification {
  income: number
  creditScore: number
  hasInsurance: boolean
  treatmentCost: number
}

const ImplantChatbot: React.FC = () => {
  const { toggleChat, sendMessage: sendJulieMessage } = useChatStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your Dental Implant Financial Assistant. I can help you understand costs, check financing options, and even get you pre-qualified. What would you like to know about dental implants?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQualificationDialog, setShowQualificationDialog] = useState(false)
  const [qualificationData, setQualificationData] = useState<FinancingQualification>({
    income: 50000,
    creditScore: 650,
    hasInsurance: false,
    treatmentCost: 3500
  })
  const [conversationStage, setConversationStage] = useState<'greeting' | 'exploring' | 'qualifying' | 'scheduling'>('greeting')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { text: 'Check financing options', action: 'financing' },
    { text: 'Get cost estimate', action: 'cost' },
    { text: 'Pre-qualify now', action: 'qualify' },
    { text: 'Schedule consultation', action: 'schedule' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'qualification' | 'financing' = 'text', data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      data
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    addMessage(inputMessage, 'user')
    const userMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      generateBotResponse(userMessage)
      setIsTyping(false)
    }, 1000)
  }

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('expensive')) {
      addMessage(
        "Great question! Dental implant costs vary based on your specific needs. A single implant typically ranges from $3,500-$5,500, including the crown. Would you like me to calculate a personalized estimate for you?",
        'bot'
      )
      setConversationStage('exploring')
    } else if (lowerMessage.includes('financing') || lowerMessage.includes('payment') || lowerMessage.includes('afford')) {
      addMessage(
        "We offer excellent financing options! Most patients qualify for monthly payments as low as $89/month with 0% APR through Cherry, Sunbit, and other providers. Would you like to check your pre-qualification status?",
        'bot'
      )
      setConversationStage('exploring')
    } else if (lowerMessage.includes('qualify') || lowerMessage.includes('credit') || lowerMessage.includes('approval')) {
      addMessage(
        "I can help you get pre-qualified in just 60 seconds with a soft credit check - no impact on your credit score! This will show you exactly what financing options you qualify for. Ready to start?",
        'bot'
      )
      setConversationStage('qualifying')
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || lowerMessage.includes('consultation')) {
      addMessage(
        "Perfect! Dr. Pedro offers complimentary consultations. I can connect you with Julie, our main assistant, who can help you schedule your appointment and answer any additional questions. Would you like me to open Julie's chat?",
        'bot'
      )
      setConversationStage('scheduling')
    } else if (lowerMessage.includes('insurance')) {
      addMessage(
        "Many dental insurance plans cover a portion of implant costs. Even if you have insurance, financing can help cover your remaining balance. Do you currently have dental insurance?",
        'bot'
      )
    } else if (lowerMessage.includes('time') || lowerMessage.includes('heal') || lowerMessage.includes('recovery')) {
      addMessage(
        "The implant process typically takes 3-6 months total. Most patients return to work the next day! The implant integrates with your bone during healing, creating a strong foundation. Would you like to know about our financing options to get started?",
        'bot'
      )
    } else {
      // Default response with helpful suggestions
      addMessage(
        "I'm here to help with your implant questions! I can assist with costs, financing options, insurance coverage, or scheduling. What's most important to you right now?",
        'bot'
      )
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'financing':
        addMessage("Tell me about financing options", 'user')
        setTimeout(() => {
          generateBotResponse("financing options")
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
      case 'cost':
        addMessage("What do implants cost?", 'user')
        setTimeout(() => {
          addMessage(
            "I'd be happy to help with cost estimates! To give you the most accurate pricing, let me ask a few questions:",
            'bot'
          )
          addMessage(
            "• How many implants do you need?\n• Do you need bone grafting?\n• Do you have dental insurance?\n\nOr I can connect you with our cost calculator for an instant estimate!",
            'bot'
          )
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
      case 'qualify':
        setShowQualificationDialog(true)
        break
      case 'schedule':
        addMessage("I'd like to schedule a consultation", 'user')
        setTimeout(() => {
          addMessage(
            "I'd be happy to help you schedule! Let me connect you with Julie, our main assistant, who can check availability and book your consultation with Dr. Pedro.",
            'bot'
          )
          // Auto-open Julie chat after a brief delay
          setTimeout(() => {
            trackChatOpen('implant_chatbot_schedule')
            trackEvent({
              action: 'julie_handoff',
              category: 'engagement',
              label: 'implant_scheduling'
            })
            toggleChat()
            setTimeout(() => {
              sendJulieMessage("I'm interested in scheduling a dental implant consultation")
            }, 500)
          }, 2000)
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
    }
  }

  const handleQualificationSubmit = async () => {
    setShowQualificationDialog(false)
    addMessage("I'd like to check my pre-qualification", 'user')
    setIsTyping(true)

    try {
      // Simulate qualification process
      setTimeout(async () => {
        const qualificationScore = Math.round(
          (qualificationData.creditScore / 850) * 40 +
          (qualificationData.income / 100000) * 30 +
          (qualificationData.hasInsurance ? 20 : 10) +
          10
        )

        if (qualificationScore >= 60) {
          addMessage(
            `Excellent news! Based on your information, you pre-qualify for financing up to $${qualificationData.treatmentCost.toLocaleString()}!`,
            'bot',
            'qualification',
            {
              approved: true,
              amount: qualificationData.treatmentCost,
              monthlyPayment: Math.round(qualificationData.treatmentCost / 24),
              score: qualificationScore
            }
          )
          
          setTimeout(() => {
            addMessage(
              "Your estimated monthly payment would be around $" + Math.round(qualificationData.treatmentCost / 24) + 
              " for 24 months. Ready to schedule your consultation to finalize everything?",
              'bot'
            )
          }, 2000)
        } else {
          addMessage(
            "Thanks for the information! While you may need additional documentation for full approval, we have several financing options available. Let's schedule a consultation to discuss the best path forward.",
            'bot'
          )
        }

        // Track the conversation
        await implantApiService.submitChatbotConversation({
          messages: messages.slice(-10), // Last 10 messages
          outcome: qualificationScore >= 60 ? 'financing_started' : 'information_provided',
          patientInterest: ['financing', 'cost_estimate'],
          qualificationScore
        })

        setIsTyping(false)
      }, 2000)
    } catch (error) {
      console.error('Qualification error:', error)
      setIsTyping(false)
    }
  }

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <Psychology sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                color: 'primary.main'
              }}
            >
              Implant Financial Assistant
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Get instant answers about costs, financing, and pre-qualification
            </Typography>
          </Box>

          <Card sx={{ maxHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Messages Area */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  mb: 2,
                  pr: 1
                }}
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Box
                          sx={{
                            maxWidth: '80%',
                            display: 'flex',
                            alignItems: 'flex-start',
                            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                              mx: 1,
                              width: 32,
                              height: 32
                            }}
                          >
                            {message.sender === 'user' ? '👤' : <SmartToy />}
                          </Avatar>
                          <Box
                            sx={{
                              bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                              color: message.sender === 'user' ? 'white' : 'text.primary',
                              p: 2,
                              borderRadius: 2,
                              maxWidth: '100%'
                            }}
                          >
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                              {message.text}
                            </Typography>
                            
                            {message.type === 'qualification' && message.data?.approved && (
                              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Pre-Qualification Approved!
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  Approved Amount: ${message.data.amount.toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                  Est. Monthly Payment: ${message.data.monthlyPayment}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <Fade in={isTyping}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', mx: 1, width: 32, height: 32 }}>
                        <SmartToy />
                      </Avatar>
                      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Typing...
                        </Typography>
                      </Box>
                    </Box>
                  </Fade>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Quick Actions */}
              {conversationStage === 'greeting' && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Quick actions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {quickActions.map((action, index) => (
                      <Chip
                        key={index}
                        label={action.text}
                        onClick={() => handleQuickAction(action.action)}
                        sx={{ cursor: 'pointer' }}
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Input Area */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Ask about costs, financing, or scheduling..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isTyping}
                />
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  color="primary"
                >
                  <Send />
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Psychology />}
                onClick={() => {
                  trackChatOpen('implant_chatbot_cta')
                  trackEvent({
                    action: 'chat_with_julie',
                    category: 'engagement',
                    label: 'implant_specialist_chat'
                  })
                  toggleChat()
                  setTimeout(() => {
                    sendJulieMessage("I'm interested in dental implants and have questions about the process")
                  }, 500)
                }}
                sx={{ px: 3 }}
              >
                Chat with Julie about Implants
              </Button>
              <Button
                variant="outlined"
                startIcon={<Schedule />}
                onClick={() => {
                  const element = document.getElementById('implant-financing-wizard')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                sx={{ px: 3 }}
              >
                Get Pre-Qualified
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Qualification Dialog */}
      <Dialog 
        open={showQualificationDialog} 
        onClose={() => setShowQualificationDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Quick Pre-Qualification
            <IconButton onClick={() => setShowQualificationDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            This is a soft credit check and won't affect your credit score.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography gutterBottom>
                Annual Income: ${qualificationData.income.toLocaleString()}
              </Typography>
              <Slider
                value={qualificationData.income}
                onChange={(_, value) => setQualificationData(prev => ({ ...prev, income: value as number }))}
                min={20000}
                max={150000}
                step={5000}
              />
            </Box>
            
            <Box>
              <Typography gutterBottom>
                Estimated Credit Score: {qualificationData.creditScore}
              </Typography>
              <Slider
                value={qualificationData.creditScore}
                onChange={(_, value) => setQualificationData(prev => ({ ...prev, creditScore: value as number }))}
                min={300}
                max={850}
                step={10}
              />
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel>Treatment Cost Estimate</InputLabel>
                <Select
                  value={qualificationData.treatmentCost}
                  onChange={(e) => setQualificationData(prev => ({ ...prev, treatmentCost: e.target.value as number }))}
                >
                  <MenuItem value={3500}>Single Implant ($3,500)</MenuItem>
                  <MenuItem value={7000}>2-3 Implants ($7,000)</MenuItem>
                  <MenuItem value={12000}>4-6 Implants ($12,000)</MenuItem>
                  <MenuItem value={25000}>Full Mouth ($25,000+)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQualificationDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleQualificationSubmit} variant="contained">
            Check Pre-Qualification
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ImplantChatbot
