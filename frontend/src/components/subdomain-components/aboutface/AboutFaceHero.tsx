import React from 'react'
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack
} from '@mui/material'
import { motion } from 'framer-motion'
import { Spa, Star, Schedule, Phone } from '@mui/icons-material'
import aboutFaceContent from '../data/aboutFaceContent.json'

const AboutFaceHero: React.FC = () => {
  const { hero, doctor } = aboutFaceContent

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #F9F7F4 0%, #FEFEFE 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 3 }}>
                <Chip
                  icon={<Spa />}
                  label="Premium Facial Aesthetics"
                  color="primary"
                  variant="filled"
                  sx={{ mb: 2 }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  color="primary"
                  gutterBottom
                  sx={{
                    background: 'linear-gradient(135deg, #C8A882 0%, #8B6F8B 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  {hero.title}
                </Typography>
                <Typography
                  variant="h3"
                  component="h2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontWeight: 400, mb: 3 }}
                >
                  {hero.subtitle}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ mb: 4, fontSize: '1.2rem', lineHeight: 1.6 }}
                >
                  {hero.description}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Schedule />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  {hero.cta}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Phone />}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Call Now
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Grid container spacing={3}>
                <Grid xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      15+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Years Experience
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      5,000+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Facial Treatments
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      4.9★
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Patient Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>

          {/* Right Content - Doctor Card & Images */}
          <Grid xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Grid container spacing={3}>
                {/* Doctor Card */}
                <Grid xs={12}>
                  <Card
                    elevation={0}
                    sx={{
                      background: 'linear-gradient(135deg, #C8A882 0%, #8B6F8B 100%)',
                      color: 'white',
                      borderRadius: 3
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar
                          src={doctor.image}
                          sx={{ width: 80, height: 80, mr: 3, border: '3px solid white' }}
                        />
                        <Box>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {doctor.name}
                          </Typography>
                          <Typography variant="body1" sx={{ opacity: 0.9 }}>
                            {doctor.title}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Stack spacing={1}>
                        {doctor.credentials.map((credential, index) => (
                          <Box key={index} display="flex" alignItems="center">
                            <Star sx={{ fontSize: 16, mr: 1, opacity: 0.8 }} />
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              {credential}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Treatment Gallery Preview */}
                <Grid xs={12}>
                  <Grid container spacing={2}>
                    {hero.images.map((image, index) => (
                      <Grid xs={4} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            component="img"
                            src={image}
                            alt={`Facial treatment result ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: 200,
                              objectFit: 'cover',
                              borderRadius: 2,
                              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                          />
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AboutFaceHero
