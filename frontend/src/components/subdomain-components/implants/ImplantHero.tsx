import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  styled,
  keyframes
} from '@mui/material'
import { motion } from 'framer-motion'
import { CalendarToday, LocationOn, Star, Psychology, AttachMoney } from '@mui/icons-material'
import implantContent from '../../../data/subdomain-content/implants/implantContent.json'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

// Color scheme constants
const colors = {
  metallicSilver: '#B0BEC5',
  electricCrimson: '#FF1744',
  deepGraphite: '#263238',
  spectrumColors: ['#FF1744', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3']
}

// Keyframe animations
const floatUpward = keyframes`
  0% {
    transform: translate3d(0, 100%, 0) scale(0);
    opacity: 0;
  }
  15% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -800%, 0) scale(0.5);
    opacity: 0;
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`

const crystallineRotate = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
`

// Styled components
const HeroContainer = styled(Box)(() => ({
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${colors.deepGraphite} 0%, ${colors.deepGraphite}ee 25%, ${colors.metallicSilver}22 50%, ${colors.electricCrimson}11 75%, ${colors.deepGraphite} 100%)`,
  '&.hero-implants': {
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 50%, ${colors.electricCrimson}22 0%, transparent 50%),
                   radial-gradient(circle at 80% 80%, ${colors.metallicSilver}33 0%, transparent 50%),
                   radial-gradient(circle at 40% 20%, ${colors.electricCrimson}11 0%, transparent 50%)`,
      pointerEvents: 'none'
    }
  }
}))

const MetallicButton = styled(Button)(() => ({
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(45deg, ${colors.metallicSilver} 30%, #CFD8DC 50%, ${colors.metallicSilver} 70%)`,
  backgroundSize: '200% 100%',
  animation: `${shimmer} 3s ease-in-out infinite`,
  color: colors.deepGraphite,
  fontWeight: 600,
  textTransform: 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.5) 50%, transparent 70%)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    '&::before': {
      transform: 'translateX(100%)'
    }
  }
}))

const CrimsonButton = styled(Button)(() => ({
  background: `linear-gradient(45deg, ${colors.electricCrimson} 30%, #FF5252 90%)`,
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.5)',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.6s, height 0.6s',
  },
  '&:hover': {
    transform: 'translateY(-2px) scale(1.02)',
    boxShadow: `0 10px 40px ${colors.electricCrimson}44`,
    '&::after': {
      width: '300px',
      height: '300px',
    }
  }
}))

// Crystalline lattice SVG component
const CrystallineLattice = () => (
  <svg
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.1,
      pointerEvents: 'none'
    }}
  >
    <defs>
      <pattern id="crystalline-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <g stroke={colors.metallicSilver} strokeWidth="0.5" fill="none">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="30" x2="90" y2="70" />
          <line x1="10" y1="70" x2="90" y2="30" />
        </g>
      </pattern>
      <linearGradient id="crystal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={colors.metallicSilver} stopOpacity="0.3" />
        <stop offset="50%" stopColor={colors.electricCrimson} stopOpacity="0.1" />
        <stop offset="100%" stopColor={colors.deepGraphite} stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#crystalline-pattern)" />
    <rect width="100%" height="100%" fill="url(#crystal-gradient)" />
  </svg>
)

// Color echo particles component
const ColorEchoParticles = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
    }}
  >
    {colors.spectrumColors.map((color, index) => (
      <Box
        key={index}
        sx={{
          position: 'absolute',
          bottom: '-20px',
          left: `${15 + index * 15}%`,
          width: '4px',
          height: '4px',
          backgroundColor: color,
          borderRadius: '50%',
          filter: 'blur(1px)',
          animation: `${floatUpward} ${15 + index * 2}s ease-in-out ${index * 2}s infinite`,
          willChange: 'transform',
          transform: 'translateZ(0)', // GPU acceleration
        }}
      />
    ))}
  </Box>
)

const ImplantHero: React.FC = () => {
  const { hero, doctor } = implantContent
  const { toggleChat, sendMessage } = useChatStore()

  const handlePrimaryAction = () => {
    trackChatOpen('implant_hero_primary')
    trackEvent({
      action: 'chat_open_implant_interest',
      category: 'engagement',
      label: 'hero_primary_button'
    })
    toggleChat()
    // Send initial message with implant context
    setTimeout(() => {
      sendMessage("I'm interested in dental implants and would like to schedule a consultation")
    }, 500)
  }

  const handleSecondaryAction = () => {
    if (hero.secondaryButton.action === 'cost_calculator') {
      const element = document.getElementById('implant-cost-calculator')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleFinancingAction = () => {
    const element = document.getElementById('implant-financing-wizard')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <HeroContainer
      className="hero-implants"
      sx={{
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Crystalline Lattice Pattern */}
      <CrystallineLattice />
      
      {/* Color Echo Particles */}
      <ColorEchoParticles />
      
      {/* Animated Faceted Crystals */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '100px',
          height: '100px',
          opacity: 0.2,
          animation: `${crystallineRotate} 20s linear infinite`,
          willChange: 'transform',
          transform: 'translateZ(0)', // GPU acceleration
        }}
      >
        <svg viewBox="0 0 100 100">
          <polygon
            points="50,5 90,25 90,75 50,95 10,75 10,25"
            fill="none"
            stroke={colors.metallicSilver}
            strokeWidth="2"
          />
          <polygon
            points="50,20 75,35 75,65 50,80 25,65 25,35"
            fill={colors.electricCrimson}
            fillOpacity="0.3"
          />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  fontWeight: 900,
                  mb: 2,
                  color: 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  textShadow: `2px 2px 4px rgba(0,0,0,0.3)`,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '80px',
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.electricCrimson} 0%, transparent 100%)`,
                  }
                }}
              >
                {hero.title}
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: "'Bodoni Moda', serif",
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 500,
                  mb: 3,
                  color: colors.metallicSilver,
                  letterSpacing: '0.01em',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {hero.subtitle}
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
                {hero.description}
              </Typography>

              {/* Statistics */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {hero.statistics.map((stat, index) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <Box 
                        textAlign="center"
                        sx={{
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '40px',
                            height: '40px',
                            background: `linear-gradient(135deg, ${colors.electricCrimson}22 0%, transparent 50%)`,
                            borderRadius: '50%',
                            filter: 'blur(20px)',
                          }
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            color: colors.metallicSilver,
                            mb: 0.5,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            background: `linear-gradient(45deg, ${colors.metallicSilver} 30%, white 50%, ${colors.metallicSilver} 70%)`,
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: `${shimmer} 3s ease-in-out infinite`,
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.metallicSilver,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <MetallicButton
                  variant="contained"
                  size="large"
                  onClick={handlePrimaryAction}
                  startIcon={<Psychology />}
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    willChange: 'transform',
                    transform: 'translateZ(0)', // GPU acceleration
                  }}
                >
                  Chat with Julie about Implants
                </MetallicButton>

                <CrimsonButton
                  variant="contained"
                  size="large"
                  onClick={handleSecondaryAction}
                  startIcon={<CalendarToday />}
                  sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    willChange: 'transform',
                    transform: 'translateZ(0)', // GPU acceleration
                  }}
                >
                  {hero.secondaryButton.text}
                </CrimsonButton>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleFinancingAction}
                  startIcon={<AttachMoney />}
                  sx={{
                    borderColor: colors.metallicSilver,
                    color: colors.metallicSilver,
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${colors.metallicSilver}22, transparent)`,
                      transition: 'left 0.5s',
                    },
                    '&:hover': {
                      borderColor: 'white',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 5px 20px ${colors.metallicSilver}44`,
                      '&::before': {
                        left: '100%',
                      }
                    },
                    transition: 'all 0.3s ease',
                    willChange: 'transform',
                  }}
                >
                  Check Financing Options
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 3,
                  p: 3,
                  border: `1px solid ${colors.metallicSilver}33`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    right: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle, ${colors.electricCrimson}11 0%, transparent 70%)`,
                    pointerEvents: 'none',
                  }
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "'Bodoni Moda', serif",
                      color: colors.deepGraphite,
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.75rem', md: '2.125rem' },
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {doctor.name}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 2
                    }}
                  >
                    {doctor.title}
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
                          background: `linear-gradient(45deg, ${colors.electricCrimson} 30%, ${colors.electricCrimson}dd 90%)`,
                          color: 'white',
                          fontWeight: 500,
                          border: 'none',
                          boxShadow: `0 2px 8px ${colors.electricCrimson}44`,
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
                      5/5 (200+ reviews)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Staten Island, NY • Manhattan, NY
                    </Typography>
                  </Box>

                  {/* Financial Qualification CTA */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      background: `linear-gradient(135deg, ${colors.deepGraphite} 0%, ${colors.deepGraphite}ee 100%)`,
                      borderRadius: 2,
                      textAlign: 'center',
                      position: 'relative',
                      border: `1px solid ${colors.metallicSilver}44`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(45deg, transparent 30%, ${colors.metallicSilver}11 50%, transparent 70%)`,
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 4s ease-in-out infinite`,
                        borderRadius: 2,
                        pointerEvents: 'none',
                      }
                    }}
                  >
                    <Psychology sx={{ color: 'white', fontSize: '2rem', mb: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Get Pre-Qualified in 60 Seconds
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.75rem'
                      }}
                    >
                      No hard credit check • Instant approval
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </HeroContainer>
  )
}

export default ImplantHero
