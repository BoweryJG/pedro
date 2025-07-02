import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar
} from '@mui/material'
import { motion } from 'framer-motion'
import { Phone, CalendarToday, LocationOn, Star, Engineering, SmartToy } from '@mui/icons-material'
import roboticContent from '../data/roboticContent.json'

const YomiHero: React.FC = () => {
  const { hero, doctor } = roboticContent

  const handlePrimaryAction = () => {
    if (hero.primaryButton.action === 'learn_more') {
      const element = document.getElementById('yomi-technology-showcase')
      element?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSecondaryAction = () => {
    if (hero.secondaryButton.action === 'book_consultation') {
      window.open('tel:+19292424535', '_blank')
    }
  }

  const handleComparisonAction = () => {
    const element = document.getElementById('robotic-vs-traditional')
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 50%, #3F51B5 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern with Robotic Theme */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M40 40l20-20v40l-20-20zm0 0l-20-20v40l20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      {/* Floating Elements for Tech Feel */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          opacity: 0.1,
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        <SmartToy sx={{ fontSize: '4rem', color: 'white' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          opacity: 0.1,
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      >
        <Engineering sx={{ fontSize: '3rem', color: 'white' }} />
      </Box>

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
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 800,
                  mb: 2,
                  color: 'white',
                  background: 'linear-gradient(45deg, #FFFFFF 30%, #E1BEE7 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {hero.title}
              </Typography>

              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 400,
                  mb: 3,
                  color: 'rgba(255, 255, 255, 0.9)'
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

              {/* Statistics with Robotic Theme */}
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
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: 'white',
                            mb: 0.5
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
                  </Box>
                ))}
              </Box>

              {/* Action Buttons */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePrimaryAction}
                  startIcon={<SmartToy />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)'
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
                  startIcon={<Phone />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {hero.secondaryButton.text}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleComparisonAction}
                  startIcon={<Engineering />}
                  sx={{
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1rem',
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white',
                      color: 'white',
                      transform: 'translateY(-2px)',
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
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  p: 3,
                  border: '1px solid rgba(156, 39, 176, 0.2)'
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      <SmartToy sx={{ fontSize: '2rem' }} />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: 'primary.main',
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        {doctor.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: 'text.secondary',
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
                          bgcolor: 'primary.light',
                          color: 'white'
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
                      5/5 (300+ robotic procedures)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Staten Island, NY • Manhattan, NY
                    </Typography>
                  </Box>

                  {/* Yomi Certification Highlight */}
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <SmartToy sx={{ color: 'white', fontSize: '2rem', mb: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      Certified Yomi Robotic Surgeon
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.75rem'
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

      {/* Add floating animation keyframes */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  )
}

export default YomiHero
