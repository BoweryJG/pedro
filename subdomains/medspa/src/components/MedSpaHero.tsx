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
import { Spa, Star, Schedule, CreditCard } from '@mui/icons-material'

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
  const iconMap: { [key: string]: React.ReactElement } = {
    'FDA-Approved Treatments': <Star />,
    'Board-Certified Provider': <Spa />,
    'Personalized Treatment Plans': <Schedule />,
    'Financing Available': <CreditCard />
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, rgba(184, 134, 11, 0.9) 0%, rgba(139, 74, 139, 0.8) 100%), url(${content.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(184, 134, 11, 0.1) 0%, rgba(139, 74, 139, 0.1) 100%)',
          backdropFilter: 'blur(1px)'
        }}
      />

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
                  color: 'white',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                {content.title}
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontFamily: 'var(--font-secondary)',
                  mb: 3,
                  fontWeight: 400,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                {content.subtitle}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'var(--font-secondary)',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
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
                          icon={iconMap[feature] || <Star />}
                          label={feature}
                          sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            '& .MuiChip-icon': {
                              color: 'white'
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
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 700,
                    borderRadius: 2,
                    background: 'var(--primary-gradient)',
                    color: 'white',
                    textTransform: 'none',
                    letterSpacing: '0.02em',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    border: 'none',
                    '&:hover': {
                      background: 'var(--primary-gradient)',
                      filter: 'brightness(1.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onClick={() => window.open('https://pedrobackend.onrender.com/appointments', '_blank')}
                >
                  {content.cta}
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
                  bgcolor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      src={'/images/gregpedro.jpg'}
                      alt={doctor.name}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h5" sx={{ fontFamily: 'var(--font-primary)', fontWeight: 600, color: 'primary.main' }}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontFamily: 'var(--font-secondary)', color: 'text.secondary' }}>
                        {doctor.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ fontFamily: 'var(--font-secondary)', mb: 3, color: 'text.primary' }}>
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
                          bgcolor: 'primary.light',
                          color: 'white'
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

    </Box>
  )
}

export default MedSpaHero