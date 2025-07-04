import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Avatar,
  Paper
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { Chat, Close, Send, Spa } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Contact {
  phone: string
  email: string
  address: string
  hours: {
    [key: string]: string
  }
  social: {
    instagram: string
    facebook: string
  }
}

interface MedSpaChatbotProps {
  contact: Contact
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  suggestions?: string[]
}

const MedSpaChatbot: React.FC<MedSpaChatbotProps> = ({ contact }) => {
  const { isOpen, toggleChat, sendMessage } = useChatStore()

  const handleChatOpen = () => {
    trackChatOpen('medspa_chatbot')
    trackEvent({
      action: 'chatbot_open',
      category: 'medspa',
      label: 'floating_button'
    })
    toggleChat()
    // Add context about aesthetic treatments
    setTimeout(() => {
      sendMessage("I'm interested in aesthetic treatments and would like to learn more about your MedSpa services.")
    }, 500)
  }

  // Legacy props for backward compatibility (not used with Julie)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const predefinedResponses = {
    "anti-aging": "Excellent choice! Our anti-aging treatments include Botox, dermal fillers, and EMFACE non-invasive lifting. These can reduce wrinkles, restore volume, and tighten skin. Would you like to know about specific treatments or package deals?",
    "facial rejuvenation": "Our facial rejuvenation packages combine multiple treatments for comprehensive results. Popular options include Botox + fillers, EMFACE lifting, and Opus plasma resurfacing. Packages start at $1,400 with financing available. Would you like to schedule a consultation?",
    "teeth whitening": "Professional teeth whitening is a great complement to facial aesthetics! Our treatment takes 90 minutes and costs $400-800. We often combine this with other treatments for package savings. Interested in a combination package?",
    "treatment combinations": "Smart thinking! Treatment combinations give better results and savings. Popular packages: Complete Rejuvenation ($2,400, saves $800), Express Enhancement ($800, saves $200), Volume & Glow ($1,400, saves $300). Which interests you most?",
    "pricing": "Our treatments range from $300-1500 individually, with package deals offering significant savings. We offer 0% financing through CareCredit and flexible payment plans. Would you like a personalized cost estimate?",
    "consultation": "Perfect! Our aesthetic consultations are complimentary and include facial analysis, treatment recommendations, and personalized pricing. Available Monday-Saturday. What day works best for you?",
    "financing": "We make aesthetic treatments affordable! Options include: CareCredit (0% APR 6-24 months), Cherry financing (instant approval), and custom payment plans. Monthly payments as low as $99. Need help calculating payments?"
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text)
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userText: string): Message => {
    const lowerText = userText.toLowerCase()
    
    let responseText = "I understand you're interested in aesthetic treatments. "
    let suggestions: string[] = []

    if (lowerText.includes('botox') || lowerText.includes('anti-aging') || lowerText.includes('wrinkle')) {
      responseText = predefinedResponses["anti-aging"]
      suggestions = ["Botox pricing", "Filler options", "Package deals", "Book consultation"]
    } else if (lowerText.includes('facial') || lowerText.includes('rejuvenation') || lowerText.includes('lift')) {
      responseText = predefinedResponses["facial rejuvenation"]
      suggestions = ["EMFACE treatment", "Package options", "Before & after", "Schedule consultation"]
    } else if (lowerText.includes('teeth') || lowerText.includes('whitening') || lowerText.includes('smile')) {
      responseText = predefinedResponses["teeth whitening"]
      suggestions = ["Whitening + Botox package", "Smile makeover", "Pricing", "Book appointment"]
    } else if (lowerText.includes('package') || lowerText.includes('combination') || lowerText.includes('deal')) {
      responseText = predefinedResponses["treatment combinations"]
      suggestions = ["Complete Rejuvenation", "Express Enhancement", "Custom package", "Financing options"]
    } else if (lowerText.includes('price') || lowerText.includes('cost') || lowerText.includes('payment')) {
      responseText = predefinedResponses["pricing"]
      suggestions = ["Treatment calculator", "Financing options", "Package savings", "Get quote"]
    } else if (lowerText.includes('consultation') || lowerText.includes('appointment') || lowerText.includes('book')) {
      responseText = predefinedResponses["consultation"]
      suggestions = ["Book online", "Call now", "Available times", "What to expect"]
    } else if (lowerText.includes('financing') || lowerText.includes('payment plan') || lowerText.includes('monthly')) {
      responseText = predefinedResponses["financing"]
      suggestions = ["CareCredit info", "Cherry financing", "Payment calculator", "Apply now"]
    } else {
      responseText += "Our most popular treatments include Botox, dermal fillers, EMFACE lifting, Opus plasma, and teeth whitening. We also offer package deals with significant savings. What specific area would you like to enhance?"
      suggestions = ["Anti-aging", "Facial treatments", "Teeth whitening", "Package deals", "Schedule consultation"]
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      suggestions
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleBookConsultation = () => {
    trackEvent({
      action: 'consultation_request',
      category: 'medspa',
      label: 'legacy_dialog'
    })
    toggleChat()
    setTimeout(() => {
      sendMessage("I'd like to book a consultation for aesthetic treatments at the MedSpa. What times are available?")
    }, 500)
  }

  const handleJulieChat = () => {
    trackChatOpen('medspa_legacy_dialog')
    toggleChat()
    setTimeout(() => {
      sendMessage("I'm interested in aesthetic treatments and would like to learn more about pricing and scheduling.")
    }, 500)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000
        }}
      >
        <Fab
          color="primary"
          onClick={handleChatOpen}
          sx={{
            background: 'linear-gradient(45deg, #B8860B 30%, #DAA520 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #9A7C0A 30%, #B8860B 90%)',
              transform: 'scale(1.1)'
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <Chat />
        </Fab>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(45deg, #B8860B 30%, #DAA520 90%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ mr: 2, bgcolor: 'white' }}>
              <Spa sx={{ color: 'primary.main' }} />
            </Avatar>
            <Box>
              <Typography variant="h6">Aesthetic Assistant</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Dr. Pedro's MedSpa
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setIsOpen(false)}
            sx={{ color: 'white' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '80%',
                        bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: message.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px'
                      }}
                    >
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Suggestions */}
                  {message.sender === 'bot' && message.suggestions && (
                    <Box sx={{ mb: 2, ml: 2 }}>
                      {message.suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{
                            mr: 1,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.light',
                              color: 'white'
                            }
                          }}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: '20px 20px 20px 4px' }}>
                    <Typography variant="body2" color="text.secondary">
                      Typing...
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleBookConsultation}
                startIcon={<Chat />}
                sx={{ flex: 1 }}
              >
                Book Consultation
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleJulieChat}
                sx={{ flex: 1 }}
              >
                Chat with Julie
              </Button>
            </Box>
          </Box>

          {/* Input */}
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about treatments, pricing, or book consultation..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(inputText)
                  }
                }}
                size="small"
              />
              <IconButton
                color="primary"
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MedSpaChatbot