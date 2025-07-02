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
  Grid
} from '@mui/material'
import { motion } from 'framer-motion'
import { Phone, CalendarToday, LocationOn, Star, Psychology, AttachMoney } from '@mui/icons-material'
import implantContent from '../data/implantContent.json'

const ImplantHero: React.FC = () => {
  const { hero, doctor } = implantContent

  const handlePrimaryAction = () => {
    if (hero.primaryButton.action === 'schedule') {
      window.open('tel:+19292424535', '_blank')
    }
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
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        color: 'white',
        py: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

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
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'white'
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

              {/* Statistics */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {hero.statistics.map((stat, index) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    >
                      <Box textAlign="center">
                        <Typography
                          variant="h3"
                          sx={{
                            fontSize: '2rem',
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
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.875rem'
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
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePrimaryAction}
                  startIcon={<Phone />}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
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
                  startIcon={<CalendarToday />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 3,
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
                  onClick={handleFinancingAction}
                  startIcon={<AttachMoney />}
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
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  p: 3
                }}
              >
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 2
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
                      bgcolor: 'primary.light',
                      borderRadius: 2,
                      textAlign: 'center'
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
    </Box>
  )
}

export default ImplantHero
