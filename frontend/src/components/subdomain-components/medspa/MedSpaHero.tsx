import React from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Chip,
  Card,
  CardContent,
  Avatar
} from '@mui/material'
import { motion } from 'framer-motion'
import { Spa, Star, Schedule, CreditCard, AutoAwesome } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface HeroContent {
  title: string
  subtitle: string
  description: string
  cta: string
  backgroundImage: string
  features: string[]
}

interface Doctor {
  name: string
  title: string
  description: string
  credentials: string[]
  image: string
}

interface MedSpaHeroProps {
  content: HeroContent
  doctor: Doctor
}

const MedSpaHero: React.FC<MedSpaHeroProps> = ({ content, doctor }) => {
  const { toggleChat, sendMessage } = useChatStore()
  
  const iconMap: { [key: string]: React.ReactElement } = {
    'FDA-Approved Treatments': <Star />,
    'Board-Certified Provider': <Spa />,
    'Personalized Treatment Plans': <Schedule />,
    'Financing Available': <CreditCard />
  }

  const handleChatOpen = () => {
    trackChatOpen('medspa_hero')
    trackEvent({
      action: 'cta_click',
      category: 'medspa',
      label: 'hero_julie_chat'
    })
    toggleChat()
    // Add context message about aesthetic treatments
    setTimeout(() => {
      sendMessage("I'm interested in aesthetic treatments at the MedSpa. Can you help me learn about your services and schedule a consultation?")
    }, 500)
  }

  return (
    <Box
      className="hero-medspa"
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FF4081 0%, #F8BBD0 50%, #FAFAFA 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(255, 64, 129, 0.1) 0%, transparent 70%)',
          animation: 'shimmer 8s ease-in-out infinite'
        },
        '@keyframes shimmer': {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: 0.3
          },
          '50%': {
            transform: 'scale(1.2) rotate(180deg)',
            opacity: 0.6
          }
        }
      }}
    >
      {/* Liquid Metal SVG Effects */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <filter id="liquidMetal">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="turbulence"
            />
            <feColorMatrix
              in="turbulence"
              type="saturate"
              values="0"
            />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues=".5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 .5 1 1" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="1" />
            <feComposite operator="over" in2="SourceGraphic" />
          </filter>
          
          <linearGradient id="pearlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FF4081" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F8BBD0" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="roseGoldGradient">
            <stop offset="0%" stopColor="#E8B4B8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FF4081" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F8BBD0" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Flowing Infinity Patterns */}
        <motion.path
          d="M100,200 Q200,100 300,200 T500,200 Q600,100 700,200 T900,200"
          fill="none"
          stroke="url(#pearlGradient)"
          strokeWidth="3"
          filter="url(#liquidMetal)"
          initial={{ pathLength: 0 }}
          animate={{ 
            pathLength: 1,
            pathOffset: [0, -1]
          }}
          transition={{
            pathLength: { duration: 3, ease: "easeInOut" },
            pathOffset: { duration: 20, repeat: Infinity, ease: "linear" }
          }}
        />
        
        <motion.circle
          cx="200"
          cy="300"
          r="100"
          fill="url(#roseGoldGradient)"
          filter="url(#liquidMetal)"
          animate={{
            cx: [200, 600, 200],
            cy: [300, 400, 300],
            r: [100, 150, 100]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>

      {/* Color Echo Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: i % 3 === 0 ? '#FF4081' : i % 3 === 1 ? '#F8BBD0' : '#FAFAFA',
            borderRadius: '50%',
            boxShadow: '0 0 10px currentColor',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Main Content */}
          <Grid xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  color: '#FAFAFA',
                  fontWeight: 400,
                  mb: 2,
                  letterSpacing: '0.05em',
                  textShadow: '2px 2px 8px rgba(255, 64, 129, 0.3)',
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  background: 'linear-gradient(45deg, #FAFAFA 30%, #FF4081 50%, #F8BBD0 70%, #FAFAFA 90%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 8s ease infinite',
                  '@keyframes gradientShift': {
                    '0%': { backgroundPosition: '0% center' },
                    '100%': { backgroundPosition: '200% center' }
                  }
                }}
              >
                {content.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  color: '#FAFAFA',
                  mb: 3,
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  textShadow: '1px 1px 4px rgba(255, 64, 129, 0.2)',
                  fontSize: { xs: '1.25rem', md: '1.75rem' },
                  fontStyle: 'italic'
                }}
              >
                {content.subtitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Bodoni Moda", serif',
                  color: 'rgba(250, 250, 250, 0.95)',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  letterSpacing: '0.02em',
                  textShadow: '1px 1px 2px rgba(255, 64, 129, 0.1)'
                }}
              >
                {content.description}
              </Typography>

              {/* Feature Chips */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={1}>
                  {content.features.map((feature, index) => (
                    <Grid key={index}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      >
                        <Chip
                          icon={iconMap[feature] || <AutoAwesome />}
                          label={feature}
                          sx={{
                            bgcolor: 'rgba(250, 250, 250, 0.15)',
                            color: '#FAFAFA',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 64, 129, 0.3)',
                            borderRadius: '20px',
                            px: 1,
                            py: 0.5,
                            fontFamily: '"Bodoni Moda", serif',
                            letterSpacing: '0.03em',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            '& .MuiChip-icon': {
                              color: '#FF4081',
                              filter: 'drop-shadow(0 0 3px rgba(255, 64, 129, 0.5))'
                            },
                            '&:hover': {
                              bgcolor: 'rgba(255, 64, 129, 0.2)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 20px rgba(255, 64, 129, 0.3)'
                            }
                          }}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontFamily: '"Bodoni Moda", serif',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #FF4081 0%, #F8BBD0 100%)',
                    color: '#FAFAFA',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(255, 64, 129, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      transition: 'left 0.6s ease'
                    },
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 12px 48px rgba(255, 64, 129, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
                      background: 'linear-gradient(135deg, #F8BBD0 0%, #FF4081 100%)',
                      '&::before': {
                        left: '100%'
                      }
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(1.01)'
                    }
                  }}
                  onClick={handleChatOpen}
                >
                  Chat with Julie about Aesthetic Treatments
                </Button>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Doctor Card */}
          <Grid xs={12} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card
                sx={{
                  bgcolor: 'rgba(250, 250, 250, 0.95)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 64, 129, 0.2)',
                  boxShadow: '0 20px 60px rgba(255, 64, 129, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: 'linear-gradient(180deg, rgba(255, 64, 129, 0.1) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={doctor.image}
                      alt={doctor.name}
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mr: 2,
                        border: '2px solid rgba(255, 64, 129, 0.3)',
                        boxShadow: '0 4px 20px rgba(255, 64, 129, 0.2)'
                      }}
                    />
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontFamily: '"Bodoni Moda", serif',
                          fontWeight: 500, 
                          color: '#FF4081',
                          letterSpacing: '0.03em',
                          mb: 0.5
                        }}
                      >
                        {doctor.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontFamily: '"Bodoni Moda", serif',
                          color: 'rgba(0, 0, 0, 0.7)',
                          letterSpacing: '0.02em',
                          fontStyle: 'italic'
                        }}
                      >
                        {doctor.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 3, 
                      color: 'rgba(0, 0, 0, 0.8)',
                      fontFamily: '"Bodoni Moda", serif',
                      lineHeight: 1.7,
                      letterSpacing: '0.01em'
                    }}
                  >
                    {doctor.description}
                  </Typography>

                  <Box>
                    {doctor.credentials.map((credential, index) => (
                      <Chip
                        key={index}
                        label={credential}
                        size="small"
                        sx={{
                          mr: 1,
                          mb: 1,
                          bgcolor: 'rgba(255, 64, 129, 0.1)',
                          color: '#FF4081',
                          border: '1px solid rgba(255, 64, 129, 0.3)',
                          fontFamily: '"Bodoni Moda", serif',
                          fontSize: '0.75rem',
                          letterSpacing: '0.02em',
                          '&:hover': {
                            bgcolor: 'rgba(255, 64, 129, 0.2)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Luxury Floating Elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360]
        }}
        transition={{
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          zIndex: 1
        }}
      >
        <AutoAwesome 
          sx={{ 
            fontSize: 50, 
            color: 'rgba(255, 64, 129, 0.2)',
            filter: 'drop-shadow(0 0 20px rgba(255, 64, 129, 0.4))'
          }} 
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '8%',
          zIndex: 1
        }}
      >
        <Spa 
          sx={{ 
            fontSize: 45, 
            color: 'rgba(248, 187, 208, 0.3)',
            filter: 'drop-shadow(0 0 15px rgba(248, 187, 208, 0.5))'
          }} 
        />
      </motion.div>

      {/* Iridescent Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '20%',
          width: '120px',
          height: '120px',
          background: 'radial-gradient(circle, rgba(255, 64, 129, 0.2) 0%, rgba(248, 187, 208, 0.1) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
    </Box>
  )
}

export default MedSpaHero