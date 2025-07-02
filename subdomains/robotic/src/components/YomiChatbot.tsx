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
  Grid,
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
  Slider,
  Rating,
  Alert
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  SmartToy,
  Science,
  Phone,
  Close,
  Memory,
  Speed,
  CheckCircle,
  Schedule,
  Psychology,
  CompareArrows
} from '@mui/icons-material'
import { yomiApiService, yomiApiUtils } from '../services/yomiApi'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  type?: 'text' | 'robotic_assessment' | 'technology_demo'
  data?: any
}

interface RoboticReadinessData {
  technologyComfort: number
  budgetFlexibility: number
  healingPriority: number
  precisionImportance: number
  currentConcerns: string[]
  implantType: string
}

const YomiChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Yomi Robotic Surgery Assistant. I can explain how robotic technology revolutionizes dental implants, compare it to traditional methods, and help determine if you're a good candidate for robotic surgery. What interests you most about robotic implants?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReadinessDialog, setShowReadinessDialog] = useState(false)
  const [readinessData, setReadinessData] = useState<RoboticReadinessData>({
    technologyComfort: 7,
    budgetFlexibility: 5,
    healingPriority: 8,
    precisionImportance: 9,
    currentConcerns: [],
    implantType: 'single'
  })
  const [conversationStage, setConversationStage] = useState<'greeting' | 'exploring' | 'comparing' | 'assessing' | 'scheduling'>('greeting')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    { text: 'How does Yomi work?', action: 'technology' },
    { text: 'Robotic vs traditional', action: 'compare' },
    { text: 'Am I a good candidate?', action: 'assess' },
    { text: 'Schedule robotic consultation', action: 'schedule' }
  ]

  const concerns = [
    'Surgery complications',
    'Pain and discomfort',
    'Healing time',
    'Long-term success',
    'Cost and financing',
    'Technology reliability'
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'robotic_assessment' | 'technology_demo' = 'text', data?: any) => {
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
    }, 1500)
  }

  const generateBotResponse = async (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('yomi'))) {
      addMessage(
        "Yomi uses advanced robotics to place implants with incredible precision! Here's how it works:\n\n1. 3D Planning: We create a detailed surgical plan using CT scans\n2. Robotic Guidance: Yomi guides the drill with sub-millimeter accuracy\n3. Real-time Feedback: The system monitors and adjusts during surgery\n4. Perfect Placement: Your implant is positioned exactly as planned\n\nThe result? 99.5% precision vs 85-90% with traditional methods!",
        'bot'
      )
      setConversationStage('exploring')
    } else if (lowerMessage.includes('vs') || lowerMessage.includes('compare') || lowerMessage.includes('traditional') || lowerMessage.includes('difference')) {
      addMessage(
        "Great question! Here are the key differences:\n\n🤖 ROBOTIC ADVANTAGES:\n• 99.5% precision (vs 85-90% traditional)\n• 50% faster healing time\n• Minimally invasive approach\n• Real-time surgical guidance\n• Consistent, predictable results\n\n🔧 TRADITIONAL LIMITATIONS:\n• Human hand variability\n• Larger incisions needed\n• Longer healing time\n• Less precise placement\n\nWould you like me to assess if you're a good candidate for robotic surgery?",
        'bot'
      )
      setConversationStage('comparing')
    } else if (lowerMessage.includes('candidate') || lowerMessage.includes('good for') || lowerMessage.includes('right for me')) {
      addMessage(
        "I can help determine your suitability for robotic surgery! Most patients are excellent candidates, especially those who value:\n\n• Maximum precision and predictability\n• Faster healing and recovery\n• Cutting-edge technology\n• Optimal long-term outcomes\n\nWould you like me to do a quick robotic readiness assessment? It only takes 2 minutes and gives you personalized insights!",
        'bot'
      )
      setConversationStage('assessing')
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('expensive')) {
      addMessage(
        "Robotic implants typically cost $4,500-$6,500 vs $3,500-$5,000 for traditional. Here's why the investment is worth it:\n\n💰 BETTER VALUE:\n• 98.7% success rate (vs 95% traditional)\n• Fewer complications = less additional costs\n• Faster healing = less time off work\n• More predictable outcomes\n\nPlus, we offer the same financing options: Cherry, Sunbit, CareCredit with payments as low as $150/month. Want to explore financing?",
        'bot'
      )
    } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('discomfort')) {
      addMessage(
        "Actually, robotic surgery typically involves LESS pain! Here's why:\n\n🎯 MINIMAL TRAUMA:\n• Smaller, more precise incisions\n• Less tissue disruption\n• Gentle, controlled movements\n• Reduced swelling and bruising\n\nMost patients report:\n• Minimal discomfort during surgery\n• Less post-op pain than expected\n• Faster return to normal activities\n• Earlier resumption of eating\n\nThe precision of robotics means your body experiences less surgical stress!",
        'bot'
      )
    } else if (lowerMessage.includes('schedule') || lowerMessage.includes('appointment') || lowerMessage.includes('consultation')) {
      addMessage(
        "Excellent! Dr. Pedro offers complimentary robotic consultations where you can:\n\n🔬 SEE THE TECHNOLOGY:\n• Live Yomi system demonstration\n• 3D planning visualization\n• Precision placement simulation\n• Q&A with certified robotic surgeon\n\nCall (929) 242-4535 now or would you prefer I help you understand more about the robotic process first?",
        'bot'
      )
      setConversationStage('scheduling')
    } else if (lowerMessage.includes('time') || lowerMessage.includes('heal') || lowerMessage.includes('recovery')) {
      addMessage(
        "Robotic surgery dramatically improves healing time! Here's the timeline:\n\n⚡ ROBOTIC TIMELINE:\n• Surgery: 45 minutes (vs 90 traditional)\n• Initial healing: 1-2 weeks\n• Full integration: 2-3 months (vs 4-6 traditional)\n• Return to work: Usually next day\n\nWhy faster? The precise, minimally invasive approach preserves more tissue and creates optimal conditions for healing. Your body can focus on integration rather than trauma recovery!",
        'bot'
      )
    } else if (lowerMessage.includes('safe') || lowerMessage.includes('risk') || lowerMessage.includes('dangerous')) {
      addMessage(
        "Yomi is actually SAFER than traditional methods! Here's why:\n\n🛡️ SAFETY FEATURES:\n• FDA-approved robotic system\n• Multiple emergency stop mechanisms\n• Real-time collision detection\n• Force-limiting technology\n• Triple backup safety systems\n\n📊 SAFETY STATS:\n• 99.9% safety rating\n• Fewer complications than traditional\n• Reduced risk of nerve damage\n• Lower infection rates\n\nThe computer guidance eliminates human error and provides consistent, safe results every time!",
        'bot'
      )
    } else if (lowerMessage.includes('success') || lowerMessage.includes('failure') || lowerMessage.includes('last')) {
      addMessage(
        "Robotic implants have superior success rates! Here are the facts:\n\n🏆 SUCCESS STATISTICS:\n• Yomi robotic: 98.7% success rate\n• Traditional: 95% success rate\n• 25+ year lifespan expected\n• Lower complication rates\n\nWhy better success? Perfect positioning optimizes:\n• Bone integration (osseointegration)\n• Load distribution\n• Long-term stability\n• Aesthetic outcomes\n\nThe precision placement is the key to lasting success!",
        'bot'
      )
    } else {
      // Default response with helpful suggestions
      addMessage(
        "I'm here to help you understand robotic implant technology! I can explain:\n\n🤖 How Yomi robotics works\n⚖️ Robotic vs traditional comparison\n🎯 Candidacy assessment\n📅 Consultation scheduling\n💰 Costs and financing\n⏰ Healing and recovery\n\nWhat would you like to explore? Or ask me anything specific about robotic dental implants!",
        'bot'
      )
    }

    // Track the interaction
    try {
      await yomiApiService.trackYomiEvent({
        event: 'chatbot_interaction',
        page: 'robotic_chatbot',
        component: 'yomi_assistant',
        data: {
          userMessage,
          conversationStage
        }
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'technology':
        addMessage("How does Yomi robotic surgery work?", 'user')
        setTimeout(() => {
          generateBotResponse("how does yomi work")
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
      case 'compare':
        addMessage("What's the difference between robotic and traditional implants?", 'user')
        setTimeout(() => {
          generateBotResponse("robotic vs traditional")
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
      case 'assess':
        setShowReadinessDialog(true)
        break
      case 'schedule':
        addMessage("I'd like to schedule a robotic consultation", 'user')
        setTimeout(() => {
          generateBotResponse("schedule consultation")
          setIsTyping(false)
        }, 1000)
        setIsTyping(true)
        break
    }
  }

  const handleReadinessSubmit = async () => {
    setShowReadinessDialog(false)
    addMessage("I'd like to know if I'm a good candidate for robotic surgery", 'user')
    setIsTyping(true)

    try {
      setTimeout(async () => {
        const roboticReadiness = yomiApiUtils.calculateRoboticReadiness(readinessData)
        
        let assessmentMessage = ""
        let recommendation = ""

        if (roboticReadiness >= 80) {
          assessmentMessage = "Excellent! You're an ideal candidate for Yomi robotic surgery!"
          recommendation = "Your high scores in precision importance and healing priority, combined with comfort with technology, make you perfect for robotic implants. You'll love the predictable outcomes and faster recovery!"
        } else if (roboticReadiness >= 60) {
          assessmentMessage = "Great! You're a very good candidate for robotic surgery."
          recommendation = "Your profile shows you'll benefit significantly from robotic precision. The technology advantages align well with your priorities."
        } else {
          assessmentMessage = "You could benefit from robotic surgery, though traditional methods might also work well."
          recommendation = "Let's discuss both options during your consultation to find the best approach for your specific needs and preferences."
        }

        addMessage(
          `${assessmentMessage}\n\n🎯 YOUR ROBOTIC READINESS SCORE: ${roboticReadiness}/100\n\n${recommendation}\n\nKey factors in your favor:\n${readinessData.precisionImportance >= 7 ? '• Values precision and predictability\n' : ''}${readinessData.healingPriority >= 7 ? '• Prioritizes faster healing\n' : ''}${readinessData.technologyComfort >= 6 ? '• Comfortable with advanced technology\n' : ''}${readinessData.budgetFlexibility >= 5 ? '• Flexible with investment for better outcomes\n' : ''}`,
          'bot',
          'robotic_assessment',
          {
            readinessScore: roboticReadiness,
            recommendation: roboticReadiness >= 60 ? 'recommended' : 'possible',
            factors: readinessData
          }
        )
        
        setTimeout(() => {
          addMessage(
            "Would you like to schedule a consultation to see the Yomi system in action and get a personalized treatment plan?",
            'bot'
          )
        }, 2000)

        // Submit conversation data
        await yomiApiService.submitYomiChatbotConversation({
          messages: messages.slice(-10),
          outcome: roboticReadiness >= 60 ? 'technology_demo_requested' : 'information_provided',
          patientInterest: ['robotic_surgery', 'technology_assessment'],
          technologyQuestions: readinessData.currentConcerns,
          roboticReadiness
        })

        setIsTyping(false)
      }, 2500)
    } catch (error) {
      console.error('Assessment error:', error)
      setIsTyping(false)
    }
  }

  const handleConcernToggle = (concern: string) => {
    setReadinessData(prev => ({
      ...prev,
      currentConcerns: prev.currentConcerns.includes(concern)
        ? prev.currentConcerns.filter(c => c !== concern)
        : [...prev.currentConcerns, concern]
    }))
  }

  return (
    <Box 
      id="yomi-chatbot"
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'grey.50',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Tech Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(45deg, #9C27B0, #9C27B0 10px, transparent 10px, transparent 20px)',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" sx={{ mb: 4 }}>
            <SmartToy sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
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
              Yomi Robotic Assistant
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
              Your expert guide to robotic dental implant technology and candidacy assessment
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
                            
                            {message.type === 'robotic_assessment' && message.data && (
                              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    Robotic Assessment Complete!
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  Readiness Score: {message.data.readinessScore}/100
                                </Typography>
                                <Typography variant="body2">
                                  Recommendation: {message.data.recommendation === 'recommended' ? 'Highly Recommended' : 'Possible Candidate'}
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Memory sx={{ color: 'primary.main', mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2" color="text.secondary">
                            Analyzing with robotic precision...
                          </Typography>
                        </Box>
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
                    Popular questions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {quickActions.map((action, index) => (
                      <Chip
                        key={index}
                        label={action.text}
                        onClick={() => handleQuickAction(action.action)}
                        sx={{ cursor: 'pointer' }}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Input Area */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Ask about robotic surgery, technology, or candidacy..."
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
                startIcon={<Phone />}
                onClick={() => window.open('tel:+19292424535', '_blank')}
                sx={{ px: 3 }}
              >
                Call: (718) 948-0870
              </Button>
              <Button
                variant="outlined"
                startIcon={<Science />}
                onClick={() => {
                  const element = document.getElementById('yomi-technology-showcase')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                sx={{ px: 3 }}
              >
                Explore Technology
              </Button>
              <Button
                variant="outlined"
                startIcon={<CompareArrows />}
                onClick={() => {
                  const element = document.getElementById('robotic-vs-traditional')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                sx={{ px: 3 }}
              >
                Compare Methods
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Robotic Readiness Dialog */}
      <Dialog 
        open={showReadinessDialog} 
        onClose={() => setShowReadinessDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SmartToy sx={{ color: 'primary.main', mr: 1 }} />
              Robotic Surgery Readiness Assessment
            </Box>
            <IconButton onClick={() => setShowReadinessDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            This quick assessment helps determine your suitability for robotic implant surgery based on your priorities and preferences.
          </Alert>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography gutterBottom>
                How comfortable are you with advanced technology? ({readinessData.technologyComfort}/10)
              </Typography>
              <Slider
                value={readinessData.technologyComfort}
                onChange={(_, value) => setReadinessData(prev => ({ ...prev, technologyComfort: value as number }))}
                min={1}
                max={10}
                step={1}
                marks
              />
            </Box>
            
            <Box>
              <Typography gutterBottom>
                How important is maximum precision to you? ({readinessData.precisionImportance}/10)
              </Typography>
              <Slider
                value={readinessData.precisionImportance}
                onChange={(_, value) => setReadinessData(prev => ({ ...prev, precisionImportance: value as number }))}
                min={1}
                max={10}
                step={1}
                marks
              />
            </Box>
            
            <Box>
              <Typography gutterBottom>
                How important is faster healing to you? ({readinessData.healingPriority}/10)
              </Typography>
              <Slider
                value={readinessData.healingPriority}
                onChange={(_, value) => setReadinessData(prev => ({ ...prev, healingPriority: value as number }))}
                min={1}
                max={10}
                step={1}
                marks
              />
            </Box>
            
            <Box>
              <Typography gutterBottom>
                Budget flexibility for advanced technology? ({readinessData.budgetFlexibility}/10)
              </Typography>
              <Slider
                value={readinessData.budgetFlexibility}
                onChange={(_, value) => setReadinessData(prev => ({ ...prev, budgetFlexibility: value as number }))}
                min={1}
                max={10}
                step={1}
                marks
              />
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel>Implant Type Needed</InputLabel>
                <Select
                  value={readinessData.implantType}
                  onChange={(e) => setReadinessData(prev => ({ ...prev, implantType: e.target.value }))}
                >
                  <MenuItem value="single">Single Implant</MenuItem>
                  <MenuItem value="multiple">Multiple Implants</MenuItem>
                  <MenuItem value="full_mouth">Full Mouth Reconstruction</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Current concerns about implant surgery:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {concerns.map((concern) => (
                  <Chip
                    key={concern}
                    label={concern}
                    onClick={() => handleConcernToggle(concern)}
                    color={readinessData.currentConcerns.includes(concern) ? 'primary' : 'default'}
                    variant={readinessData.currentConcerns.includes(concern) ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReadinessDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleReadinessSubmit} variant="contained" startIcon={<Psychology />}>
            Get My Robotic Readiness Score
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default YomiChatbot
