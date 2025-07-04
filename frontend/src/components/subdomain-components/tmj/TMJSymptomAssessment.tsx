import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  LinearProgress,
  Chip,
  Alert,
  Paper
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Warning, Chat } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Symptom {
  name: string
  description: string
  severity: string
  frequency: string
  impact: string
}

interface TMJSymptomAssessmentProps {
  symptoms: Symptom[]
}

const TMJSymptomAssessment: React.FC<TMJSymptomAssessmentProps> = ({ symptoms }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const { toggleChat, sendMessage } = useChatStore()

  const questions = [
    {
      id: 'jaw_pain',
      question: 'Do you experience jaw pain or tenderness?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'clicking_popping',
      question: 'Do you hear clicking or popping sounds when opening your mouth?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'jaw_locking',
      question: 'Does your jaw ever lock or get stuck?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'headaches',
      question: 'Do you experience frequent headaches?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'ear_symptoms',
      question: 'Do you have ear pain, ringing, or fullness?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'teeth_grinding',
      question: 'Do you grind or clench your teeth?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'mouth_opening',
      question: 'Do you have difficulty opening your mouth wide?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    },
    {
      id: 'facial_pain',
      question: 'Do you experience facial pain or muscle tension?',
      options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
    }
  ]

  const handleResponse = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const calculateScore = () => {
    const scoreMap = { 'Never': 0, 'Rarely': 1, 'Sometimes': 2, 'Often': 3, 'Always': 4 }
    const totalScore = Object.values(responses).reduce((sum, response) => {
      return sum + (scoreMap[response as keyof typeof scoreMap] || 0)
    }, 0)
    return totalScore
  }

  const getRecommendation = (score: number) => {
    if (score <= 8) {
      return {
        level: 'Low Risk',
        color: 'success',
        icon: <CheckCircle />,
        message: 'Your symptoms suggest minimal TMJ concerns. Continue monitoring and maintain good oral habits.',
        action: 'Schedule a routine consultation for preventive care.'
      }
    } else if (score <= 16) {
      return {
        level: 'Moderate Risk',
        color: 'warning',
        icon: <Warning />,
        message: 'You may have mild to moderate TMJ symptoms that could benefit from professional evaluation.',
        action: 'Schedule a consultation to discuss treatment options.'
      }
    } else {
      return {
        level: 'High Risk',
        color: 'error',
        icon: <Warning />,
        message: 'Your symptoms suggest significant TMJ dysfunction that requires professional treatment.',
        action: 'Schedule an urgent consultation for comprehensive evaluation and treatment planning.'
      }
    }
  }

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const restartAssessment = () => {
    setCurrentStep(0)
    setResponses({})
    setShowResults(false)
  }

  const handleScheduleConsultation = async () => {
    // Create assessment summary for Julie
    const assessmentSummary = `I completed the TMJ assessment with a score of ${score}/32 (${recommendation.level}). My symptoms include: ${Object.entries(responses).map(([question, response]) => {
      const q = questions.find(q => q.id === question)
      return `${q?.question}: ${response}`
    }).join(', ')}. I need help scheduling a consultation.`
    
    // Track the event
    trackChatOpen('tmj-assessment-results')
    trackEvent({
      action: 'julie_chat_open',
      category: 'tmj',
      label: 'assessment_results',
      value: score
    })
    
    // Open Julie and send assessment context
    toggleChat()
    
    setTimeout(async () => {
      await sendMessage(assessmentSummary)
    }, 500)
  }

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100
  const score = calculateScore()
  const recommendation = getRecommendation(score)

  if (showResults) {
    return (
      <Container maxWidth="md" id="tmj-assessment">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            sx={{ mb: 4, color: 'primary.main' }}
          >
            Your TMJ Assessment Results
          </Typography>

          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Box textAlign="center" sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Score: {score}/32
              </Typography>
              <Chip
                icon={recommendation.icon}
                label={recommendation.level}
                color={recommendation.color as "success" | "warning" | "error"}
                size="medium"
                sx={{ fontSize: '1.1rem', py: 2, px: 1 }}
              />
            </Box>

            <Alert 
              severity={recommendation.color as "success" | "warning" | "error"} 
              sx={{ mb: 3, fontSize: '1.1rem' }}
            >
              {recommendation.message}
            </Alert>

            <Typography
              variant="h6"
              sx={{ mb: 3, textAlign: 'center', color: 'primary.main' }}
            >
              Recommended Action: {recommendation.action}
            </Typography>

            <Box textAlign="center" sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Chat />}
                onClick={handleScheduleConsultation}
                sx={{ mr: 2, mb: 2 }}
              >
                Chat with Julie to Schedule
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={restartAssessment}
                sx={{ mb: 2 }}
              >
                Retake Assessment
              </Button>
            </Box>
          </Paper>

          <Typography
            variant="h5"
            sx={{ mb: 3, color: 'primary.main' }}
          >
            Common TMJ Symptoms We Treat:
          </Typography>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 2
          }}>
            {symptoms.map((symptom, index) => (
              <Card key={index} sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                    {symptom.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {symptom.description}
                  </Typography>
                  <Box>
                    <Chip label={`Severity: ${symptom.severity}`} size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label={`Frequency: ${symptom.frequency}`} size="small" />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" id="tmj-assessment">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ mb: 2, color: 'primary.main' }}
        >
          TMJ Symptom Assessment
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Take our quick assessment to understand your TMJ symptoms and get personalized recommendations.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Question {currentStep + 1} of {questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}% Complete
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              }
            }} 
          />
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 3, color: 'primary.main' }}
                >
                  {currentQuestion.question}
                </Typography>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={responses[currentQuestion.id] || ''}
                    onChange={(e) => handleResponse(currentQuestion.id, e.target.value)}
                  >
                    {currentQuestion.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        sx={{
                          mb: 1,
                          p: 1,
                          borderRadius: 2,
                          '&:hover': {
                            bgcolor: 'grey.50'
                          }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={nextStep}
                    disabled={!responses[currentQuestion.id]}
                  >
                    {currentStep === questions.length - 1 ? 'Get Results' : 'Next'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Container>
  )
}

export default TMJSymptomAssessment
