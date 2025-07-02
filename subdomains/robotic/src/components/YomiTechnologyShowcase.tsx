import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  LinearProgress,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExpandMore,
  CenterFocusStrong,
  SmartToy,
  Memory,
  Visibility,
  Speed,
  Security,
  Science,
  AutoFixHigh,
  Timeline,
  TouchApp
} from '@mui/icons-material'
import roboticContent from '../data/roboticContent.json'

interface TechnologyFeature {
  icon: React.ReactNode
  title: string
  description: string
  accuracy: number
  benefits: string[]
  techSpecs: string[]
}

const YomiTechnologyShowcase: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const technologyFeatures: TechnologyFeature[] = [
    {
      icon: <CenterFocusStrong sx={{ fontSize: '2rem' }} />,
      title: 'Robotic Precision',
      description: 'Sub-millimeter accuracy ensures perfect implant placement every time',
      accuracy: 99.5,
      benefits: [
        'Eliminates human hand tremor',
        'Consistent depth and angle',
        'Optimal bone engagement',
        'Reduced surgical time'
      ],
      techSpecs: [
        'Accuracy: ±0.1mm',
        'Angular precision: ±1 degree',
        'Real-time tracking: 1000Hz',
        'Force feedback: Yes'
      ]
    },
    {
      icon: <Visibility sx={{ fontSize: '2rem' }} />,
      title: '3D Surgical Navigation',
      description: 'Real-time guidance with advanced imaging technology',
      accuracy: 98.8,
      benefits: [
        'Live surgical feedback',
        'Instant course correction',
        'Nerve avoidance',
        'Optimal positioning'
      ],
      techSpecs: [
        'Resolution: 0.5mm voxels',
        'Update rate: 30fps',
        'Tracking accuracy: ±0.2mm',
        'Multi-planar views: Yes'
      ]
    },
    {
      icon: <Memory sx={{ fontSize: '2rem' }} />,
      title: 'AI-Powered Planning',
      description: 'Intelligent treatment planning with machine learning optimization',
      accuracy: 97.2,
      benefits: [
        'Automated planning',
        'Predictive outcomes',
        'Risk assessment',
        'Personalized protocols'
      ],
      techSpecs: [
        'Planning time: <5 minutes',
        'Outcome prediction: 95%',
        'Risk scoring: Advanced',
        'Database: 10,000+ cases'
      ]
    },
    {
      icon: <Security sx={{ fontSize: '2rem' }} />,
      title: 'Safety Systems',
      description: 'Multiple redundant safety mechanisms protect patients',
      accuracy: 99.9,
      benefits: [
        'Emergency stop systems',
        'Force limiting',
        'Collision detection',
        'Backup protocols'
      ],
      techSpecs: [
        'Safety rating: Class IIa',
        'Response time: <1ms',
        'Force limits: Configurable',
        'Backup systems: Triple'
      ]
    }
  ]

  const procedureSteps = roboticContent.procedure_timeline.map((step, index) => ({
    ...step,
    icon: [<Science />, <SmartToy />, <AutoFixHigh />, <TouchApp />][index] || <Timeline />
  }))

  const handleFeatureSelect = (index: number) => {
    setSelectedFeature(index)
  }

  return (
    <Box 
      id="yomi-technology-showcase"
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: 'linear-gradient(45deg, #9C27B0 25%, transparent 25%), linear-gradient(-45deg, #9C27B0 25%, transparent 25%)',
          backgroundSize: '60px 60px'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" sx={{ mb: 6 }}>
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
              Yomi Technology Deep Dive
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
              Explore the cutting-edge technology that makes Yomi the most advanced 
              robotic dental implant system in the world
            </Typography>
          </Box>

          {/* Technology Features Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, mb: 8 }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Typography variant="h4" gutterBottom color="primary">
                Core Technologies
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {technologyFeatures.map((feature, index) => (
                  <Box key={index} sx={{ width: '100%' }}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: selectedFeature === index ? 2 : 1,
                          borderColor: selectedFeature === index ? 'primary.main' : 'grey.300',
                          bgcolor: selectedFeature === index ? 'primary.light' : 'background.paper',
                          color: selectedFeature === index ? 'white' : 'text.primary',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => handleFeatureSelect(index)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar
                              sx={{
                                bgcolor: selectedFeature === index ? 'white' : 'primary.main',
                                color: selectedFeature === index ? 'primary.main' : 'white',
                                mr: 2,
                                width: 40,
                                height: 40
                              }}
                            >
                              {feature.icon}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {feature.title}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={feature.accuracy}
                                  sx={{
                                    flex: 1,
                                    mr: 1,
                                    height: 6,
                                    borderRadius: 3,
                                    bgcolor: selectedFeature === index ? 'rgba(255,255,255,0.3)' : 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: selectedFeature === index ? 'white' : 'success.main'
                                    }
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {feature.accuracy}%
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFeature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ height: '100%', bgcolor: 'grey.50' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 60,
                            height: 60,
                            mr: 3
                          }}
                        >
                          {technologyFeatures[selectedFeature].icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" color="primary" gutterBottom>
                            {technologyFeatures[selectedFeature].title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {technologyFeatures[selectedFeature].description}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="h6" gutterBottom color="primary">
                        Key Benefits
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {technologyFeatures[selectedFeature].benefits.map((benefit, index) => (
                          <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 4px)' } }}>
                            <Chip
                              label={benefit}
                              size="small"
                              sx={{
                                width: '100%',
                                bgcolor: 'primary.light',
                                color: 'white',
                                justifyContent: 'flex-start'
                              }}
                            />
                          </Box>
                        ))}
                      </Box>

                      <Typography variant="h6" gutterBottom color="primary">
                        Technical Specifications
                      </Typography>
                      {technologyFeatures[selectedFeature].techSpecs.map((spec, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            mb: 1,
                            p: 1,
                            bgcolor: 'white',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300'
                          }}
                        >
                          {spec}
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>

          {/* Procedure Timeline */}
          <Card sx={{ mb: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom color="primary" textAlign="center">
                Yomi Procedure Timeline
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
                Experience the streamlined robotic implant process
              </Typography>

              <Stepper activeStep={activeStep} orientation="vertical">
                {procedureSteps.map((step, index) => (
                  <Step key={step.step}>
                    <StepLabel
                      icon={
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                          {step.icon}
                        </Avatar>
                      }
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {step.duration}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      <Box>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mr: 1 }}
                          disabled={index === procedureSteps.length - 1}
                        >
                          {index === procedureSteps.length - 1 ? 'Complete' : 'Next'}
                        </Button>
                        <Button
                          disabled={index === 0}
                          onClick={() => setActiveStep(index - 1)}
                        >
                          Back
                        </Button>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {activeStep === procedureSteps.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card sx={{ mt: 3, bgcolor: 'success.light', color: 'white' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <TouchApp sx={{ fontSize: '3rem', mb: 2 }} />
                      <Typography variant="h5" gutterBottom>
                        Robotic Procedure Complete!
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        Your new implant has been placed with robotic precision. 
                        Recovery time is typically 50% faster than traditional methods.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(0)}
                        sx={{ bgcolor: 'white', color: 'success.main' }}
                      >
                        Start Over
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Yomi Features from Database */}
          <Typography variant="h4" gutterBottom color="primary" textAlign="center">
            Advanced Yomi Features
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {roboticContent.yomi_features.map((feature, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 12px)' } }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="h6" color="primary">
                        {feature.title}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom>
                        Benefits:
                      </Typography>
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <Chip
                          key={benefitIndex}
                          label={benefit}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                          variant="outlined"
                        />
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </motion.div>
              </Box>
            ))}
          </Box>

          {/* CTA Section */}
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Card sx={{ p: 4, bgcolor: 'primary.main', color: 'white' }}>
              <SmartToy sx={{ fontSize: '3rem', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Ready to Experience Robotic Precision?
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, maxWidth: '600px', mx: 'auto' }}>
                Schedule a consultation to see how Yomi robotic technology can give you 
                the most precise, comfortable, and predictable implant experience possible.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.open('tel:+19292424535', '_blank')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  Schedule Robotic Consultation
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const element = document.getElementById('robotic-vs-traditional')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontSize: '1.1rem',
                    py: 1.5,
                    px: 4,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white'
                    }
                  }}
                >
                  Compare Technologies
                </Button>
              </Box>
            </Card>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default YomiTechnologyShowcase
