import React from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Assessment, 
  Healing, 
  MonitorHeart,
  LocalHospital,
  Science,
  Timeline as TimelineIcon,
  Chat
} from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Treatment {
  name: string
  description: string
  features: string[]
  effectiveness: string
  duration: string
  candidacy: string
}

interface TimelinePhase {
  phase: string
  title: string
  duration: string
  description: string
  steps: string[]
}

interface TMJTreatmentTimelineProps {
  timeline: TimelinePhase[]
  treatments: Treatment[]
}

const TMJTreatmentTimeline: React.FC<TMJTreatmentTimelineProps> = ({ timeline, treatments }) => {
  const { toggleChat, sendMessage } = useChatStore()
  
  const phaseIcons = [
    <Assessment color="primary" />,
    <LocalHospital color="primary" />,
    <Healing color="primary" />,
    <MonitorHeart color="primary" />
  ]

  const handleChatWithJulie = async () => {
    // Track the event
    trackChatOpen('tmj-treatment-timeline')
    trackEvent({
      action: 'julie_chat_open',
      category: 'tmj',
      label: 'treatment_timeline_cta'
    })
    
    // Open Julie and send treatment context
    toggleChat()
    
    setTimeout(async () => {
      await sendMessage("I'm interested in TMJ treatment and want to schedule a comprehensive consultation")
    }, 500)
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ mb: 2, color: 'primary.main' }}
        >
          Your TMJ Treatment Journey
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: '600px', mx: 'auto' }}
        >
          Our comprehensive 4-phase approach ensures personalized treatment with measurable results. 
          Each phase builds upon the previous to provide lasting relief from TMJ symptoms.
        </Typography>

        {/* Treatment Timeline */}
        <Box sx={{ mb: 8 }}>
          <Stepper orientation="vertical" sx={{ mb: 4 }}>
            {timeline.map((phase, index) => (
              <Step key={index} active={true}>
                <StepLabel
                  icon={phaseIcons[index]}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      color: 'primary.main'
                    }
                  }}
                >
                  Phase {phase.phase}: {phase.title}
                </StepLabel>
                <StepContent>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper elevation={2} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={phase.duration} 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 2 }}
                        />
                        <TimelineIcon sx={{ color: 'primary.light', mr: 1 }} />
                      </Box>
                      
                      <Typography
                        variant="body1"
                        sx={{ mb: 2, color: 'text.primary' }}
                      >
                        {phase.description}
                      </Typography>

                      <List dense>
                        {phase.steps.map((step, stepIndex) => (
                          <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle 
                                sx={{ 
                                  fontSize: '1rem', 
                                  color: 'success.main' 
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={step}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.9rem'
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </motion.div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Treatment Options */}
        <Typography
          variant="h4"
          component="h3"
          textAlign="center"
          sx={{ mb: 4, color: 'primary.main' }}
        >
          Advanced Treatment Options
        </Typography>

        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          {treatments.map((treatment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Science sx={{ color: 'primary.main', mr: 1 }} />
                      <Typography
                        variant="h6"
                        sx={{ color: 'primary.main', fontWeight: 600 }}
                      >
                        {treatment.name}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {treatment.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Chip 
                          label={`${treatment.effectiveness} Effective`} 
                          color="success" 
                          size="small" 
                        />
                        <Chip 
                          label={treatment.duration} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="subtitle2"
                      sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}
                    >
                      Key Features:
                    </Typography>

                    <List dense sx={{ mb: 2 }}>
                      {treatment.features.slice(0, 3).map((feature, featureIndex) => (
                        <ListItem key={featureIndex} sx={{ py: 0.25, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <CheckCircle 
                              sx={{ 
                                fontSize: '0.8rem', 
                                color: 'success.main' 
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.85rem',
                                lineHeight: 1.4
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        mt: 2,
                        p: 1,
                        bgcolor: 'grey.50',
                        borderRadius: 1,
                        fontStyle: 'italic'
                      }}
                    >
                      Best for: {treatment.candidacy}
                    </Typography>
                  </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 6, 
            p: 4, 
            bgcolor: 'primary.main',
            borderRadius: 3,
            color: 'white'
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Ready to Start Your TMJ Treatment Journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Schedule your comprehensive consultation to determine the best treatment plan for your specific needs.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'white',
                color: '#2C5530',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={handleChatWithJulie}
            >
              <Chat sx={{ fontSize: '1.2rem' }} />
              Chat with Julie
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => {
                const element = document.getElementById('tmj-assessment')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Take Assessment
            </motion.button>
          </Box>
        </Box>
      </motion.div>
    </Container>
  )
}

export default TMJTreatmentTimeline
