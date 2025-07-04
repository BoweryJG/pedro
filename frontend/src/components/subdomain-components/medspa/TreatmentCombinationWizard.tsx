import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
  Alert
} from '@mui/material'
import { motion } from 'framer-motion'
import { AutoAwesome, Schedule, CheckCircle } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Treatment {
  id: string
  name: string
  description: string
  duration: string
  priceRange: string
  benefits: string[]
  image: string
}

interface Package {
  name: string
  treatments: string[]
  originalPrice: number
  packagePrice: number
  savings: number
  description: string
}

interface TreatmentCombinationWizardProps {
  treatments: Treatment[]
  packages: Package[]
}

const TreatmentCombinationWizard: React.FC<TreatmentCombinationWizardProps> = ({
  treatments,
  packages
}) => {
  const { toggleChat, sendMessage } = useChatStore()
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [recommendedPackage, setRecommendedPackage] = useState<Package | null>(null)

  const handleBookConsultation = () => {
    const selectedTreatmentNames = selectedTreatments
      .map(treatmentId => treatments.find(t => t.id === treatmentId)?.name)
      .filter(Boolean)
      .join(', ')

    const totalCost = calculateIndividualTotal()
    const packageSavings = recommendedPackage?.savings || 0

    trackChatOpen('medspa_treatment_wizard')
    trackEvent({
      action: 'consultation_request',
      category: 'medspa',
      label: 'treatment_wizard',
      value: totalCost
    })

    toggleChat()
    setTimeout(() => {
      if (recommendedPackage) {
        sendMessage(`I'm interested in the ${recommendedPackage.name} package that includes ${selectedTreatmentNames}. I understand this saves me $${packageSavings} compared to individual treatments. Can you help me schedule a consultation to discuss this package?`)
      } else if (selectedTreatmentNames) {
        sendMessage(`I'm interested in these aesthetic treatments: ${selectedTreatmentNames}. Can you help me understand the best way to combine these treatments and schedule a consultation?`)
      } else {
        sendMessage("I'm interested in combination aesthetic treatments and would like to schedule a consultation to discuss the best package for my goals.")
      }
    }, 500)
  }

  const steps = ['Select Treatments', 'Review Combination', 'Book Consultation']

  const handleTreatmentToggle = (treatmentId: string) => {
    setSelectedTreatments(prev => 
      prev.includes(treatmentId)
        ? prev.filter(id => id !== treatmentId)
        : [...prev, treatmentId]
    )
  }

  const findBestPackage = () => {
    const bestMatch = packages.find(pkg => 
      pkg.treatments.length === selectedTreatments.length &&
      pkg.treatments.every(treatment => 
        selectedTreatments.some(selected => 
          treatments.find(t => t.id === selected)?.name.includes(treatment)
        )
      )
    )
    setRecommendedPackage(bestMatch || null)
    setCurrentStep(1)
  }

  const calculateIndividualTotal = () => {
    return selectedTreatments.reduce((total, treatmentId) => {
      const treatment = treatments.find(t => t.id === treatmentId)
      if (treatment) {
        const priceMatch = treatment.priceRange.match(/\$(\d+)-(\d+)/)
        return total + (priceMatch ? parseInt(priceMatch[2]) : 0)
      }
      return total
    }, 0)
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}
          >
            <AutoAwesome sx={{ mr: 2, fontSize: 'inherit' }} />
            Treatment Combination Wizard
          </Typography>
          
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
          >
            Discover the perfect combination of treatments for your aesthetic goals and save with our exclusive packages
          </Typography>
        </motion.div>

        <Stepper activeStep={currentStep} sx={{ mb: 6 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
              Select Your Desired Treatments
            </Typography>
            
            <Grid container spacing={3}>
              {treatments.map((treatment, index) => (
                <Grid item key={treatment.id} xs={12} md={6} lg={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        border: selectedTreatments.includes(treatment.id) 
                          ? '2px solid' 
                          : '2px solid transparent',
                        borderColor: selectedTreatments.includes(treatment.id) 
                          ? 'primary.main' 
                          : 'transparent',
                        transform: selectedTreatments.includes(treatment.id) 
                          ? 'scale(1.02)' 
                          : 'scale(1)',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 4
                        }
                      }}
                      onClick={() => handleTreatmentToggle(treatment.id)}
                    >
                      <Box
                        sx={{
                          height: 200,
                          background: `url(${treatment.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        {selectedTreatments.includes(treatment.id) && (
                          <CheckCircle
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              color: 'primary.main',
                              fontSize: 32,
                              bgcolor: 'white',
                              borderRadius: '50%'
                            }}
                          />
                        )}
                      </Box>
                      
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {treatment.name}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          {treatment.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip
                            icon={<Schedule />}
                            label={treatment.duration}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={treatment.priceRange}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        
                        <Box>
                          {treatment.benefits.slice(0, 2).map((benefit, idx) => (
                            <Chip
                              key={idx}
                              label={benefit}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {selectedTreatments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Paper sx={{ mt: 4, p: 3, bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Selected Treatments ({selectedTreatments.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {selectedTreatments.map(treatmentId => {
                      const treatment = treatments.find(t => t.id === treatmentId)
                      return treatment ? (
                        <Chip
                          key={treatmentId}
                          label={treatment.name}
                          onDelete={() => handleTreatmentToggle(treatmentId)}
                          sx={{ bgcolor: 'white', color: 'primary.main' }}
                        />
                      ) : null
                    })}
                  </Box>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={findBestPackage}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    Find Best Package Deal
                  </Button>
                </Paper>
              </motion.div>
            )}
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, color: 'text.primary' }}>
              Your Treatment Plan
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Selected Treatments
                  </Typography>
                  
                  {selectedTreatments.map(treatmentId => {
                    const treatment = treatments.find(t => t.id === treatmentId)
                    return treatment ? (
                      <Box key={treatmentId} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {treatment.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {treatment.description}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip label={treatment.duration} size="small" sx={{ mr: 1 }} />
                          <Chip label={treatment.priceRange} size="small" color="primary" />
                        </Box>
                      </Box>
                    ) : null
                  })}
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    Pricing Summary
                  </Typography>

                  {recommendedPackage ? (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Package Deal Found!
                      </Typography>
                      <Typography variant="body2">
                        {recommendedPackage.name}: Save ${recommendedPackage.savings}
                      </Typography>
                    </Alert>
                  ) : null}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Individual Total:</span>
                      <span>${calculateIndividualTotal()}</span>
                    </Typography>
                    {recommendedPackage && (
                      <>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                          <span>Package Price:</span>
                          <span>${recommendedPackage.packagePrice}</span>
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between', color: 'success.main' }}>
                          <span>You Save:</span>
                          <span>${recommendedPackage.savings}</span>
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleBookConsultation}
                    startIcon={<Schedule />}
                  >
                    Chat with Julie about This Plan
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ p: 4, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
                Ready to Book!
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Your personalized treatment plan is ready. Book your consultation to discuss your aesthetic goals and finalize your treatment schedule.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => setCurrentStep(0)}
                >
                  Start Over
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleBookConsultation}
                  startIcon={<Schedule />}
                >
                  Chat with Julie to Book
                </Button>
              </Box>
            </Card>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}

export default TreatmentCombinationWizard
