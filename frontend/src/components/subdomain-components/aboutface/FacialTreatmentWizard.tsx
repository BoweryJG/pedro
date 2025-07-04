import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Face, 
  AutoAwesome, 
  Schedule, 
  AttachMoney,
  NavigateNext,
  NavigateBefore,
  Chat
} from '@mui/icons-material'
import aboutFaceContent from '../../../data/subdomain-content/aboutface/aboutFaceContent.json'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

const FacialTreatmentWizard: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
  const [budget, setBudget] = useState<number>(1000)
  const [timeframe, setTimeframe] = useState('')
  const [recommendations, setRecommendations] = useState<any[]>([])
  const { toggleChat, sendMessage } = useChatStore()

  const handleChatWithJulie = async (context: string, treatmentName?: string) => {
    trackChatOpen('aboutface_treatment_wizard')
    trackEvent({
      action: 'treatment_wizard_interest',
      category: 'engagement',
      label: context
    })
    toggleChat()
    setTimeout(() => {
      let message = `I've used the facial treatment planner and I'm interested in ${treatmentName || 'EmFace treatments'}.`
      
      if (selectedConcerns.length > 0) {
        message += ` My main concerns are: ${selectedConcerns.join(', ')}.`
      }
      
      if (budget) {
        message += ` My budget range is around $${budget.toLocaleString()}.`
      }
      
      if (timeframe) {
        message += ` I'm looking for results ${timeframe}.`
      }
      
      message += ' Can you help me schedule a consultation at AboutFace Aesthetics?'
      
      sendMessage(message)
    }, 500)
  }

  const steps = ['Facial Concerns', 'Budget & Timeline', 'Treatment Plan']

  const facialConcerns = [
    'Fine Lines & Wrinkles',
    'Volume Loss',
    'Lip Enhancement',
    'Facial Contouring',
    'Skin Texture',
    'Under-eye Hollows',
    'Jawline Definition',
    'Neck Sagging'
  ]

  const handleConcernToggle = (concern: string) => {
    setSelectedConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    )
  }

  const generateRecommendations = () => {
    const { treatments, facialPackages } = aboutFaceContent
    const recs = []

    // Individual treatments based on concerns
    if (selectedConcerns.includes('Fine Lines & Wrinkles')) {
      recs.push(treatments.find(t => t.id === 'botox-facial'))
    }
    if (selectedConcerns.includes('Volume Loss') || selectedConcerns.includes('Facial Contouring')) {
      recs.push(treatments.find(t => t.id === 'dermal-fillers'))
    }
    if (selectedConcerns.includes('Lip Enhancement')) {
      recs.push(treatments.find(t => t.id === 'dermal-fillers'))
    }

    // Package recommendations based on budget
    if (budget >= 2500) {
      recs.push(facialPackages.find(p => p.id === 'complete-rejuvenation'))
    } else if (budget >= 1200) {
      recs.push(facialPackages.find(p => p.id === 'maintenance-plan'))
    } else {
      recs.push(facialPackages.find(p => p.id === 'signature-refresh'))
    }

    setRecommendations(recs.filter(Boolean))
  }

  const handleNext = () => {
    if (activeStep === steps.length - 2) {
      generateRecommendations()
    }
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom textAlign="center" color="primary">
              What facial concerns would you like to address?
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
              Select all that apply to receive personalized treatment recommendations
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              {facialConcerns.map(concern => (
                <Grid item key={concern}>
                  <Chip
                    label={concern}
                    onClick={() => handleConcernToggle(concern)}
                    color={selectedConcerns.includes(concern) ? 'primary' : 'default'}
                    variant={selectedConcerns.includes(concern) ? 'filled' : 'outlined'}
                    sx={{
                      fontSize: '1rem',
                      py: 2,
                      px: 1,
                      height: 'auto',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom textAlign="center" color="primary">
              Investment & Timeline Preferences
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    <AttachMoney /> Investment Range
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    What's your comfortable investment range?
                  </Typography>
                  <Slider
                    value={budget}
                    onChange={(_, value) => setBudget(value as number)}
                    min={500}
                    max={5000}
                    step={250}
                    marks={[
                      { value: 500, label: '$500' },
                      { value: 1500, label: '$1.5K' },
                      { value: 3000, label: '$3K' },
                      { value: 5000, label: '$5K+' }
                    ]}
                    valueLabelDisplay="on"
                    valueLabelFormat={(value) => `$${value}`}
                  />
                  <Typography variant="h5" textAlign="center" color="primary" sx={{ mt: 2 }}>
                    ${budget.toLocaleString()}
                  </Typography>
                </Card>
              </Grid>

              <Grid xs={12} md={6}>
                <Card sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    <Schedule /> Timeline Preference
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    When would you like to see results?
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Timeline</InputLabel>
                    <Select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      label="Timeline"
                    >
                      <MenuItem value="immediate">Immediate (same day results)</MenuItem>
                      <MenuItem value="1week">Within 1 week</MenuItem>
                      <MenuItem value="1month">Within 1 month</MenuItem>
                      <MenuItem value="3months">3-6 months (progressive)</MenuItem>
                      <MenuItem value="flexible">I'm flexible</MenuItem>
                    </Select>
                  </FormControl>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Typography variant="h4" gutterBottom textAlign="center" color="primary">
              Your Personalized Treatment Plan
            </Typography>
            <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
              Based on your concerns and preferences, here are our recommendations
            </Typography>

            <Grid container spacing={3}>
              {recommendations.map((rec, index) => (
                <Grid xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(200, 168, 130, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Face color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {rec.name}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {rec.description}
                      </Typography>

                      {rec.treatments && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Includes:
                          </Typography>
                          {rec.treatments.map((treatment: string, i: number) => (
                            <Chip
                              key={i}
                              label={treatment}
                              size="small"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      )}

                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" color="primary">
                          {rec.packagePrice ? `$${rec.packagePrice}` : rec.price}
                        </Typography>
                        {rec.savings && (
                          <Chip
                            label={`Save $${rec.savings}`}
                            color="success"
                            size="small"
                          />
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Chat />}
                        onClick={() => handleChatWithJulie('treatment_selection', rec.name)}
                      >
                        Chat with Julie about This
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #FEFEFE 0%, #F9F7F4 100%)' }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" gutterBottom color="primary">
            Facial Treatment Planner
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover your perfect facial aesthetic treatment plan
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ minHeight: 400, mb: 4 }}>
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<NavigateBefore />}
            size="large"
          >
            Back
          </Button>
          
          {activeStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={activeStep === 0 && selectedConcerns.length === 0}
              endIcon={<NavigateNext />}
              variant="contained"
              size="large"
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<Chat />}
              onClick={() => handleChatWithJulie('final_consultation')}
            >
              Chat with Julie to Schedule
            </Button>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default FacialTreatmentWizard
