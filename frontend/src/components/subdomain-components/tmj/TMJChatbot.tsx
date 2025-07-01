import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Drawer,
  AppBar,
  Toolbar,
  Button,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material'
import { 
  Send, 
  Chat, 
  Close, 
  SmartToy,
  Phone,
  CalendarToday
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import ChatService, { ChatMessage, ChatServiceConfig } from '../../../../shared/services/chatService'

interface TMJChatbotProps {
  chatbotConfig?: any
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

const TMJChatbot: React.FC<TMJChatbotProps> = ({ contact }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat service with TMJ-specific configuration
  const chatService = useRef(new ChatService({
    specialty: 'tmj',
    systemPrompt: `You are Dr. Pedro's TMJ specialist assistant for his dental practice. You help patients understand TMJ disorders, symptoms, treatments, and scheduling.

Key Information about Dr. Pedro's TMJ Services:
- BOTOX Therapy: Advanced muscle relaxation treatment for TMJ pain, reduces grinding and clenching
- Electrophoresis Treatment: Promotes healing and reduces inflammation
- Acoustic Shockwave Therapy: Stimulates tissue repair and regeneration
- Custom Oral Appliances: Prevents grinding and protects teeth
- Physical Therapy: Improves jaw function and mobility
- Comprehensive TMJ Assessment: 8-point symptom evaluation

Contact Information:
- Phone: ${contact.phone}
- Email: ${contact.email}
- Address: ${contact.address}
- Hours: Weekdays ${contact.hours.weekdays}, Saturday ${contact.hours.saturday}, Sunday ${contact.hours.sunday}

Guidelines:
- Be empathetic and understanding about TMJ pain
- Explain treatments in simple, non-medical terms
- Always encourage proper diagnosis and consultation
- Mention that most insurance plans cover TMJ treatment
- Focus on Dr. Pedro's expertise and advanced treatment options
- Suggest the TMJ assessment for symptom evaluation
- Be conversational but professional
- Keep responses concise but informative`,
    contact
  } as ChatServiceConfig)).current

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([chatService.getInitialMessage()])
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputValue('')
    setIsTyping(true)

    try {
      // Get AI response from chat service
      const botResponse = await chatService.sendMessage(newMessages)
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting bot response:', error)
      // Fallback response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        text: `I apologize, I'm having trouble connecting right now. Please call us at ${contact.phone} or visit our office for immediate assistance with your TMJ concerns.`,
        sender: 'bot',
        timestamp: new Date(),
        quickReplies: ["Call now", "More questions"]
      }
      setMessages(prev => [...prev, fallbackResponse])
    } finally {
      setIsTyping(false)
    }
  }


  const handleQuickReply = (reply: string) => {
    // Check if the chat service can handle this quick reply directly
    if (chatService.handleQuickReply(reply)) {
      return
    }
    
    // Special case for closing chat and scrolling to assessment
    if (reply === "Take assessment") {
      setIsOpen(false)
      const element = document.getElementById('tmj-assessment')
      element?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    
    // Otherwise, send as a regular message
    handleSendMessage(reply)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Fab
              color="primary"
              size="large"
              onClick={() => setIsOpen(true)}
              sx={{
                boxShadow: '0 4px 20px rgba(44, 85, 48, 0.3)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 25px rgba(44, 85, 48, 0.4)',
                }
              }}
            >
              <Chat sx={{ fontSize: '1.5rem' }} />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            maxWidth: '100vw',
            height: '100%'
          }
        }}
      >
        {/* Chat Header */}
        <AppBar position="static" color="primary" elevation={1}>
          <Toolbar>
            <Avatar sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}>
              <SmartToy />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" color="inherit">
                TMJ Assistant
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Dr. Pedro's Office
              </Typography>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => setIsOpen(false)}
            >
              <Close />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2,
            bgcolor: 'grey.50'
          }}
        >
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
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: message.sender === 'user' ? 'primary.main' : 'white',
                    color: message.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: message.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </Typography>
                </Paper>
              </Box>

              {/* Quick Replies */}
              {message.quickReplies && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {message.quickReplies.map((reply, index) => (
                    <Chip
                      key={index}
                      label={reply}
                      onClick={() => handleQuickReply(reply)}
                      size="small"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'primary.light',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, alignItems: 'center' }}>
                <Paper elevation={1} sx={{ p: 2, borderRadius: '16px 16px 16px 4px', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Dr. Pedro's assistant is thinking...
                  </Typography>
                </Paper>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Quick Actions */}
        <Box sx={{ p: 2, bgcolor: 'white' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              startIcon={<Phone />}
              variant="outlined"
              size="small"
              onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
              sx={{ flex: 1 }}
            >
              Call
            </Button>
            <Button
              startIcon={<CalendarToday />}
              variant="outlined"
              size="small"
              onClick={() => handleQuickReply("Schedule consultation")}
              sx={{ flex: 1 }}
            >
              Schedule
            </Button>
          </Box>

          {/* Input Area */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about TMJ symptoms, treatments..."
              variant="outlined"
              size="small"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default TMJChatbot
