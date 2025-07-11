import React, { useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material'
import { motion } from 'framer-motion'
import { Chat, CalendarToday, LocationOn, Star } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'
import './TMJHero.css'

interface TMJHeroProps {
  content: {
    title: string
    subtitle: string
    description: string
    statistics: Array<{
      number: string
      label: string
    }>
    primaryButton: {
      text: string
      action: string
    }
    secondaryButton: {
      text: string
      action: string
    }
  }
  doctor: {
    name: string
    title: string
    credentials: string[]
    experience: string
    expertise: string[]
    book_title: string
    book_description: string
  }
}

const TMJHero: React.FC<TMJHeroProps> = ({ content, doctor }) => {
  const { toggleChat, sendMessage } = useChatStore()
  const particlesRef = useRef<HTMLDivElement>(null)

  const handlePrimaryAction = async () => {
    if (content.primaryButton.action === 'schedule') {
      // Track the event
      trackChatOpen('tmj-hero-primary')
      trackEvent({
        action: 'julie_chat_open',
        category: 'tmj',
        label: 'hero_primary_button'
      })
      
      // Open Julie and send TMJ context
      toggleChat()
      
      // Wait a moment for chat to open, then send initial context
      setTimeout(async () => {
        await sendMessage("I'm experiencing TMJ symptoms and need consultation")
      }, 500)
    }
  }

  const handleSecondaryAction = () => {
    if (content.secondaryButton.action === 'consultation') {
      const element = document.getElementById('tmj-assessment')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <Box
      className="hero-tmj"
      sx={{
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Wave Pattern */}
      <Box className="wave-pattern">
        <svg className="wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path 
            fill="rgba(0, 229, 255, 0.1)" 
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,117.3C960,107,1056,149,1152,165.3C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path 
            fill="rgba(0, 102, 255, 0.05)" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,202.7C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </Box>

      {/* Neural Pathways */}
      <Box className="neural-path">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path className="neural-line" d="M0,100 Q200,50 400,100 T800,100" />
          <path className="neural-line" d="M100,200 Q300,150 500,200 T900,200" style={{ animationDelay: '1s' }} />
          <path className="neural-line" d="M50,300 Q250,250 450,300 T850,300" style={{ animationDelay: '2s' }} />
        </svg>
      </Box>

      {/* Color Echo Particles */}
      <Box className="particles-container" ref={particlesRef}>
        {[...Array(10)].map((_, i) => (
          <Box key={i} className="particle" />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4 
          }}
        >
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 58.33%' } }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                className="tmj-headline"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
              >
                {content.title}
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                className="tmj-subheadline"
                sx={{
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 500,
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.95)',
                  textShadow: '0 1px 5px rgba(0,0,0,0.1)'
                }}
              >
                {content.subtitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.8)'
                }}
              >
                {content.description}
              </Typography>

              {/* Statistics */}
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                  gap: 2,
                  mb: 4
                }}
              >
                {content.statistics.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Box textAlign="center">
                      <Typography
                        variant="h3"
                        className="stat-number"
                        sx={{
                          fontSize: '2.5rem',
                          fontWeight: 800,
                          mb: 0.5,
                          transform: 'translateZ(0)', // GPU acceleration
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePrimaryAction}
                  startIcon={<Chat />}
                  className="tmj-primary-button"
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  Chat with Julie about TMJ
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSecondaryAction}
                  startIcon={<CalendarToday />}
                  className="tmj-secondary-button"
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none'
                  }}
                >
                  {content.secondaryButton.text}
                </Button>
              </Stack>
            </motion.div>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 41.67%' } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card
                className="tmj-doctor-card"
                sx={{
                  borderRadius: 3,
                  p: 3,
                  transform: 'translateZ(0)', // GPU acceleration
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    className="tmj-headline"
                    sx={{
                      color: '#0066FF',
                      fontWeight: 600,
                      mb: 2,
                      fontSize: '1.75rem'
                    }}
                  >
                    {doctor.name}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {doctor.credentials.map((credential, index) => (
                      <Chip
                        key={index}
                        label={credential}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          background: 'linear-gradient(45deg, #0066FF, #00E5FF)',
                          color: 'white',
                          fontWeight: 500
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.primary',
                      mb: 2,
                      fontWeight: 500
                    }}
                  >
                    {doctor.experience}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color: i < 5 ? '#FFD700' : 'grey.300',
                            fontSize: '1.2rem'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      5/5 (150+ reviews)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ color: '#0066FF', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Staten Island, NY • Manhattan, NY
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default TMJHero
