import React, { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  keyframes
} from '@mui/material'
import { motion } from 'framer-motion'
import { CalendarToday, LocationOn, Star, Engineering, SmartToy, Chat } from '@mui/icons-material'
import roboticContent from '../../../data/subdomain-content/robotic/roboticContent.json'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

// Animation keyframes
const dataFlow = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
`

const glow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 20px #00E676); }
  50% { filter: drop-shadow(0 0 40px #00E676); }
`

const holographicShimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

// Circuit Board Pattern Component
const CircuitBoardPattern: React.FC = () => {
  const [nodes, setNodes] = useState<Array<{ x: number; y: number; id: string }>>([])

  useEffect(() => {
    // Generate random nodes for circuit intersections
    const generateNodes = () => {
      const newNodes = []
      for (let i = 0; i < 15; i++) {
        newNodes.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          id: `node-${i}`
        })
      }
      setNodes(newNodes)
    }
    generateNodes()
  }, [])

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        opacity: 0.3
      }}
    >
      {/* Circuit paths */}
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <defs>
          <pattern id="circuitGrid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path
              d="M 0 50 L 100 50 M 50 0 L 50 100"
              stroke="#00E676"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
            <path
              d="M 25 25 L 75 25 L 75 75 L 25 75 Z"
              stroke="#7B1FA2"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuitGrid)" />
      </svg>

      {/* Animated data streams */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00E676, transparent)',
          animation: `${dataFlow} 3s linear infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #7B1FA2, transparent)',
          animation: `${dataFlow} 4s linear infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '80%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #FFD600, transparent)',
          animation: `${dataFlow} 5s linear infinite`
        }}
      />

      {/* Pulsing nodes at intersections */}
      {nodes.map((node) => (
        <Box
          key={node.id}
          sx={{
            position: 'absolute',
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#00E676',
            boxShadow: '0 0 20px #00E676',
            animation: `${pulse} 2s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </Box>
  )
}

// Color Echo Particles Component
const ColorEchoParticles: React.FC = () => {
  const spectrumColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
  
  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: spectrumColors[i % spectrumColors.length],
            opacity: 0.6,
            animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </Box>
  )
}

const YomiHero: React.FC = () => {
  const { hero, doctor } = roboticContent
  const { toggleChat, sendMessage } = useChatStore()
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate processing animation for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePrimaryAction = () => {
    if (hero.primaryButton.action === 'learn_more') {
      const element = document.getElementById('yomi-technology-showcase')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSecondaryAction = async () => {
    if (hero.secondaryButton.action === 'book_consultation') {
      trackChatOpen('yomi_hero_cta')
      trackEvent({
        action: 'yomi_consultation_request',
        category: 'robotic_surgery',
        label: 'hero_section'
      })
      
      toggleChat()
      
      // Add slight delay to ensure chat is open before sending message
      setTimeout(() => {
        sendMessage("I'm interested in Yomi robotic dental surgery and would like to schedule a consultation to learn more about the technology and see if I'm a good candidate.")
      }, 500)
    }
  }

  const handleComparisonAction = () => {
    const element = document.getElementById('robotic-vs-traditional')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      className="hero-robotic"
      sx={{
        background: 'linear-gradient(135deg, #7B1FA2 0%, #00E676 50%, #7B1FA2 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 10s ease infinite',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(0, 230, 118, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(123, 31, 162, 0.2) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      {/* Circuit Board Pattern */}
      <CircuitBoardPattern />
      
      {/* Color Echo Particles */}
      <ColorEchoParticles />

      {/* Sacred Geometry Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          opacity: 0.1,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: '2px solid #FFD600',
            borderRadius: '50%',
            animation: 'rotate 20s linear infinite'
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '20%',
            border: '2px solid #00E676',
            transform: 'rotate(45deg)',
            animation: 'rotate 30s linear infinite reverse'
          }
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 58.333333%' } }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 800,
                  fontStretch: 'condensed',
                  letterSpacing: '-0.03em',
                  mb: 2,
                  color: 'white',
                  background: 'linear-gradient(45deg, #00E676 0%, #FFFFFF 50%, #FFD600 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(0, 230, 118, 0.5))',
                  animation: `${glow} 3s ease-in-out infinite`
                }}
              >
                {hero.title}
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  fontSize: { xs: '1.25rem', md: '1.75rem' },
                  fontWeight: 400,
                  fontStretch: 'condensed',
                  letterSpacing: '-0.02em',
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.95)',
                  textShadow: '0 0 20px rgba(0, 230, 118, 0.3)'
                }}
              >
                {hero.subtitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  maxWidth: '600px'
                }}
              >
                {hero.description}
              </Typography>

              {/* Statistics with Processing Animation */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                {hero.statistics.map((stat, index) => (
                  <Box key={index} sx={{ flex: { xs: '1 1 calc(50% - 8px)', sm: '1 1 calc(33.333333% - 11px)' } }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <Box 
                        textAlign="center"
                        sx={{
                          p: 2,
                          background: 'linear-gradient(135deg, rgba(123, 31, 162, 0.2) 0%, rgba(0, 230, 118, 0.2) 100%)',
                          borderRadius: 2,
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(0, 230, 118, 0.3)',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            border: '1px solid #00E676',
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 30px rgba(0, 230, 118, 0.3)'
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 214, 0, 0.3), transparent)',
                            animation: isProcessing && index === 1 ? `${dataFlow} 2s linear infinite` : 'none'
                          }
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontFamily: '"Bodoni Moda", serif',
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            fontStretch: 'condensed',
                            letterSpacing: '-0.02em',
                            color: '#00E676',
                            mb: 0.5,
                            textShadow: '0 0 20px rgba(0, 230, 118, 0.5)',
                            filter: isProcessing && index === 1 ? 'brightness(1.5)' : 'none',
                            transition: 'filter 0.3s ease'
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                ))}
              </Box>

              {/* Action Buttons with Holographic Effects */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePrimaryAction}
                  startIcon={<SmartToy />}
                  sx={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, #00E676 0%, #7B1FA2 100%)',
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    border: 'none',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-200%',
                      width: '200%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                      animation: `${holographicShimmer} 3s linear infinite`
                    },
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: '0 8px 25px rgba(0, 230, 118, 0.4)',
                      filter: 'brightness(1.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {hero.primaryButton.text}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleSecondaryAction}
                  startIcon={<Chat />}
                  sx={{
                    position: 'relative',
                    borderColor: '#00E676',
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    fontWeight: 500,
                    background: 'rgba(0, 230, 118, 0.1)',
                    backdropFilter: 'blur(10px)',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(45deg, transparent 30%, rgba(255, 214, 0, 0.2) 50%, transparent 70%)',
                      animation: `${holographicShimmer} 4s linear infinite`
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 230, 118, 0.2)',
                      borderColor: '#00E676',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 20px rgba(0, 230, 118, 0.5)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Chat with Julie about Yomi
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleComparisonAction}
                  startIcon={<Engineering />}
                  sx={{
                    borderColor: 'rgba(255, 214, 0, 0.5)',
                    color: '#FFD600',
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    background: 'rgba(255, 214, 0, 0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 214, 0, 0.15)',
                      borderColor: '#FFD600',
                      color: '#FFD600',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 0 15px rgba(255, 214, 0, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Compare Technologies
                </Button>
              </Stack>
            </motion.div>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 41.666667%' } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card
                sx={{
                  background: 'linear-gradient(135deg, rgba(123, 31, 162, 0.9) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(0, 230, 118, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(0, 230, 118, 0.5)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 214, 0, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        background: 'linear-gradient(135deg, #00E676 0%, #7B1FA2 100%)',
                        width: 56,
                        height: 56,
                        mr: 2,
                        boxShadow: '0 0 20px rgba(0, 230, 118, 0.5)',
                        animation: `${glow} 3s ease-in-out infinite`
                      }}
                    >
                      <SmartToy sx={{ fontSize: '2rem', color: 'white' }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#00E676',
                          fontWeight: 600,
                          mb: 0.5,
                          fontFamily: '"Bodoni Moda", serif',
                          letterSpacing: '-0.02em',
                          textShadow: '0 0 10px rgba(0, 230, 118, 0.5)'
                        }}
                      >
                        {doctor.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500
                        }}
                      >
                        {doctor.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {doctor.credentials.map((credential, index) => (
                      <Chip
                        key={index}
                        label={credential}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          background: 'rgba(255, 214, 0, 0.2)',
                          color: '#FFD600',
                          border: '1px solid rgba(255, 214, 0, 0.3)',
                          backdropFilter: 'blur(10px)',
                          '&:hover': {
                            background: 'rgba(255, 214, 0, 0.3)',
                            borderColor: '#FFD600'
                          }
                        }}
                      />
                    ))}
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
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
                            color: i < 5 ? '#FFD600' : 'rgba(255, 255, 255, 0.2)',
                            fontSize: '1.2rem',
                            filter: i < 5 ? 'drop-shadow(0 0 5px rgba(255, 214, 0, 0.5))' : 'none'
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      5/5 (300+ robotic procedures)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: '#00E676', mr: 1 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Staten Island, NY • Manhattan, NY
                    </Typography>
                  </Box>

                  {/* Yomi Certification Highlight */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      background: 'linear-gradient(135deg, #00E676 0%, #7B1FA2 100%)',
                      borderRadius: 2,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid rgba(0, 230, 118, 0.5)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: `${holographicShimmer} 3s linear infinite`
                      }
                    }}
                  >
                    <SmartToy sx={{ 
                      color: 'white', 
                      fontSize: '2rem', 
                      mb: 1,
                      filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
                      animation: `${pulse} 2s ease-in-out infinite`
                    }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1,
                        fontFamily: '"Bodoni Moda", serif',
                        letterSpacing: '-0.01em',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      Certified Yomi Robotic Surgeon
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Advanced training in FDA-approved robotic surgery
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Container>

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  )
}

export default YomiHero
