import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, 
  AccountBalance, 
  CheckCircle, 
  TrendingUp,
  Psychology,
  AttachMoney
} from '@mui/icons-material'
import { implantApiService } from '../../../services/implantApi'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface FinancingApplication {
  patientName: string
  email: string
  phone: string
  creditScore: number
  income: number
  treatmentCost: number
  provider: 'Cherry' | 'Sunbit' | 'CareCredit' | 'Affirm'
  softCreditCheck: boolean
}

interface FinancingData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
  }
  financialInfo: {
    income: number
    creditScore: number
    employmentStatus: string
    hasInsurance: boolean
  }
  treatmentInfo: {
    implantType: 'single' | 'multiple' | 'full_mouth'
    estimatedCost: number
    preferredProvider: string
  }
}

const steps = [
  'Personal Information',
  'Financial Details',
  'Treatment Preferences',
  'Pre-Qualification Results'
]

const financingProviders = [
  { name: 'Cherry', features: ['No hard credit check', 'Instant approval', '0% APR options'] },
  { name: 'Sunbit', features: ['Quick approval', 'Flexible terms', 'No prepayment penalty'] },
  { name: 'CareCredit', features: ['Healthcare focused', 'Promotional financing', 'Wide acceptance'] },
  { name: 'Affirm', features: ['Transparent pricing', 'No hidden fees', 'Simple payments'] }
]

const ImplantFinancingWizard: React.FC = () => {
  const { toggleChat, sendMessage } = useChatStore()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [financingData, setFinancingData] = useState<FinancingData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: ''
    },
    financialInfo: {
      income: 50000,
      creditScore: 650,
      employmentStatus: '',
      hasInsurance: false
    },
    treatmentInfo: {
      implantType: 'single',
      estimatedCost: 3500,
      preferredProvider: 'Cherry'
    }
  })
  const [qualificationResults, setQualificationResults] = useState<any>(null)

  const handleNext = async () => {
    if (activeStep === steps.length - 2) {
      // Submit for pre-qualification
      setIsLoading(true)
      try {
        const application: FinancingApplication = {
          patientName: `${financingData.personalInfo.firstName} ${financingData.personalInfo.lastName}`,
          email: financingData.personalInfo.email,
          phone: financingData.personalInfo.phone,
          creditScore: financingData.financialInfo.creditScore,
          income: financingData.financialInfo.income,
          treatmentCost: financingData.treatmentInfo.estimatedCost,
          provider: financingData.treatmentInfo.preferredProvider as any,
          softCreditCheck: true
        }
        
        const results = await implantApiService.submitFinancingApplication(application)
        setQualificationResults(results)
      } catch (error) {
        console.error('Financing application error:', error)
        // Mock results for demo
        setQualificationResults({
          approved: true,
          approvedAmount: financingData.treatmentInfo.estimatedCost,
          monthlyPayment: Math.round(financingData.treatmentInfo.estimatedCost / 24),
          term: 24,
          apr: 9.99,
          provider: financingData.treatmentInfo.preferredProvider
        })
      }
      setIsLoading(false)
    }
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const updateFinancingData = (section: keyof FinancingData, field: string, value: any) => {
    setFinancingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={financingData.personalInfo.firstName}
                onChange={(e) => updateFinancingData('personalInfo', 'firstName', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={financingData.personalInfo.lastName}
                onChange={(e) => updateFinancingData('personalInfo', 'lastName', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={financingData.personalInfo.email}
                onChange={(e) => updateFinancingData('personalInfo', 'email', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={financingData.personalInfo.phone}
                onChange={(e) => updateFinancingData('personalInfo', 'phone', e.target.value)}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={financingData.personalInfo.dateOfBirth}
                onChange={(e) => updateFinancingData('personalInfo', 'dateOfBirth', e.target.value)}
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Typography variant="h6" gutterBottom>
                Annual Income: ${financingData.financialInfo.income.toLocaleString()}
              </Typography>
              <Slider
                value={financingData.financialInfo.income}
                onChange={(_, value) => updateFinancingData('financialInfo', 'income', value)}
                min={20000}
                max={200000}
                step={5000}
                marks={[
                  { value: 20000, label: '$20K' },
                  { value: 100000, label: '$100K' },
                  { value: 200000, label: '$200K' }
                ]}
              />
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" gutterBottom>
                Estimated Credit Score: {financingData.financialInfo.creditScore}
              </Typography>
              <Slider
                value={financingData.financialInfo.creditScore}
                onChange={(_, value) => updateFinancingData('financialInfo', 'creditScore', value)}
                min={300}
                max={850}
                step={10}
                marks={[
                  { value: 300, label: 'Poor' },
                  { value: 580, label: 'Fair' },
                  { value: 670, label: 'Good' },
                  { value: 740, label: 'Very Good' },
                  { value: 800, label: 'Excellent' }
                ]}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  value={financingData.financialInfo.employmentStatus}
                  onChange={(e) => updateFinancingData('financialInfo', 'employmentStatus', e.target.value)}
                >
                  <MenuItem value="full-time">Full-time</MenuItem>
                  <MenuItem value="part-time">Part-time</MenuItem>
                  <MenuItem value="self-employed">Self-employed</MenuItem>
                  <MenuItem value="retired">Retired</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} sm={6}>
              <FormControl component="fieldset">
                <Typography variant="subtitle1" gutterBottom>
                  Do you have dental insurance?
                </Typography>
                <RadioGroup
                  value={financingData.financialInfo.hasInsurance}
                  onChange={(e) => updateFinancingData('financialInfo', 'hasInsurance', e.target.value === 'true')}
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        )

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid xs={12}>
              <FormControl component="fieldset">
                <Typography variant="h6" gutterBottom>
                  What type of implant treatment do you need?
                </Typography>
                <RadioGroup
                  value={financingData.treatmentInfo.implantType}
                  onChange={(e) => updateFinancingData('treatmentInfo', 'implantType', e.target.value)}
                >
                  <FormControlLabel 
                    value="single" 
                    control={<Radio />} 
                    label="Single Implant ($3,500 - $5,500)" 
                  />
                  <FormControlLabel 
                    value="multiple" 
                    control={<Radio />} 
                    label="Multiple Implants ($7,000 - $15,000)" 
                  />
                  <FormControlLabel 
                    value="full_mouth" 
                    control={<Radio />} 
                    label="Full Mouth Reconstruction ($25,000 - $45,000)" 
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <Typography variant="h6" gutterBottom>
                Preferred Financing Provider
              </Typography>
              <Grid container spacing={2}>
                {financingProviders.map((provider) => (
                  <Grid xs={12} sm={6} key={provider.name}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: financingData.treatmentInfo.preferredProvider === provider.name ? 2 : 1,
                        borderColor: financingData.treatmentInfo.preferredProvider === provider.name ? 'primary.main' : 'grey.300'
                      }}
                      onClick={() => updateFinancingData('treatmentInfo', 'preferredProvider', provider.name)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {provider.name}
                        </Typography>
                        {provider.features.map((feature, index) => (
                          <Chip
                            key={index}
                            label={feature}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )

      case 3:
        return qualificationResults ? (
          <Box textAlign="center">
            {qualificationResults.approved ? (
              <>
                <CheckCircle sx={{ fontSize: '4rem', color: 'success.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom color="success.main">
                  Congratulations! You're Pre-Qualified
                </Typography>
                <Alert severity="success" sx={{ mb: 3 }}>
                  You've been pre-qualified for up to ${qualificationResults.approvedAmount.toLocaleString()} 
                  with {qualificationResults.provider}
                </Alert>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid xs={6}>
                    <Card>
                      <CardContent>
                        <AttachMoney sx={{ fontSize: '2rem', color: 'primary.main' }} />
                        <Typography variant="h6">Monthly Payment</Typography>
                        <Typography variant="h4" color="primary">
                          ${qualificationResults.monthlyPayment}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={6}>
                    <Card>
                      <CardContent>
                        <TrendingUp sx={{ fontSize: '2rem', color: 'primary.main' }} />
                        <Typography variant="h6">APR</Typography>
                        <Typography variant="h4" color="primary">
                          {qualificationResults.apr}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    trackChatOpen('implant_financing_success')
                    trackEvent({
                      action: 'financing_qualified_schedule',
                      category: 'conversion',
                      label: 'implant_consultation',
                      value: qualificationResults.approvedAmount
                    })
                    toggleChat()
                    setTimeout(() => {
                      sendMessage(`Great news! I've been pre-qualified for dental implant financing up to $${qualificationResults.approvedAmount.toLocaleString()} with monthly payments of $${qualificationResults.monthlyPayment}. I'd like to schedule my consultation to move forward.`)
                    }, 500)
                  }}
                  sx={{ mr: 2 }}
                >
                  Chat with Julie to Schedule
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setActiveStep(0)}
                >
                  Start Over
                </Button>
              </>
            ) : (
              <>
                <Psychology sx={{ fontSize: '4rem', color: 'warning.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom color="warning.main">
                  Additional Information Needed
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  We'd like to discuss additional financing options with you personally.
                </Alert>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    trackChatOpen('implant_financing_assistance')
                    trackEvent({
                      action: 'additional_financing_help',
                      category: 'engagement',
                      label: 'implant_consultation'
                    })
                    toggleChat()
                    setTimeout(() => {
                      sendMessage("I went through the implant financing pre-qualification and need some additional assistance with my financing options. Can you help me explore other ways to make dental implants affordable?")
                    }, 500)
                  }}
                >
                  Chat with Julie for Help
                </Button>
              </>
            )}
          </Box>
        ) : null

      default:
        return null
    }
  }

  return (
    <Box 
      id="implant-financing-wizard"
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'grey.50' 
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2,
              color: 'primary.main'
            }}
          >
            Financing Pre-Qualification Wizard
          </Typography>
          
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontSize: '1.1rem',
              color: 'text.secondary',
              mb: 6,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Get pre-qualified for dental implant financing in just 3 steps. 
            No hard credit check required.
          </Typography>

          <Card sx={{ p: 4 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? (
                  <Box textAlign="center" py={4}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Processing your pre-qualification...
                    </Typography>
                  </Box>
                ) : (
                  renderStepContent(activeStep)
                )}
              </motion.div>
            </AnimatePresence>

            {!isLoading && activeStep < steps.length - 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  variant="outlined"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disabled={
                    (activeStep === 0 && !financingData.personalInfo.firstName) ||
                    (activeStep === 1 && !financingData.financialInfo.employmentStatus)
                  }
                >
                  {activeStep === steps.length - 2 ? 'Get Pre-Qualified' : 'Next'}
                </Button>
              </Box>
            )}
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ImplantFinancingWizard
