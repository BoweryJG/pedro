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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Divider
} from '@mui/material'
import { motion } from 'framer-motion'
import { Calculate, CreditCard, Timeline } from '@mui/icons-material'
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

interface FinancingOption {
  provider: string
  terms: string
  description: string
}

interface Financing {
  title: string
  description: string
  options: FinancingOption[]
}

interface MedSpaCostCalculatorProps {
  treatments: Treatment[]
  financing: Financing
}

const MedSpaCostCalculator: React.FC<MedSpaCostCalculatorProps> = ({
  treatments,
  financing
}) => {
  const { toggleChat, sendMessage } = useChatStore()
  const [selectedTreatments, setSelectedTreatments] = useState<{[key: string]: number}>({})
  const [paymentPlan, setPaymentPlan] = useState<number>(6)
  const [selectedFinancing, setSelectedFinancing] = useState<string>('CareCredit')

  const handleScheduleConsultation = () => {
    const selectedTreatmentNames = Object.entries(selectedTreatments)
      .filter(([_, quantity]) => quantity > 0)
      .map(([treatmentId, quantity]) => {
        const treatment = treatments.find(t => t.id === treatmentId)
        return `${treatment?.name} (${quantity}x)`
      })
      .join(', ')

    const totalCost = getTotalCost()
    const monthlyPayment = getMonthlyPayment()

    trackChatOpen('medspa_cost_calculator')
    trackEvent({
      action: 'consultation_request',
      category: 'medspa',
      label: 'cost_calculator',
      value: totalCost
    })

    toggleChat()
    setTimeout(() => {
      if (selectedTreatmentNames) {
        sendMessage(`I'm interested in scheduling a consultation for aesthetic treatments. I've been looking at: ${selectedTreatmentNames}. The estimated cost is $${totalCost.toLocaleString()} with potential monthly payments of $${monthlyPayment.toFixed(0)}. Can you help me schedule a consultation to discuss these treatments?`)
      } else {
        sendMessage("I'm interested in aesthetic treatments and would like to schedule a consultation to discuss pricing and financing options.")
      }
    }, 500)
  }

  const handleTreatmentQuantityChange = (treatmentId: string, quantity: number) => {
    if (quantity === 0) {
      const newSelected = { ...selectedTreatments }
      delete newSelected[treatmentId]
      setSelectedTreatments(newSelected)
    } else {
      setSelectedTreatments(prev => ({
        ...prev,
        [treatmentId]: quantity
      }))
    }
  }

  const calculateTreatmentCost = (treatment: Treatment, quantity: number) => {
    const priceMatch = treatment.priceRange.match(/\$(\d+)-(\d+)/)
    if (priceMatch) {
      const averagePrice = (parseInt(priceMatch[1]) + parseInt(priceMatch[2])) / 2
      return averagePrice * quantity
    }
    return 0
  }

  const getTotalCost = () => {
    return Object.entries(selectedTreatments).reduce((total, [treatmentId, quantity]) => {
      const treatment = treatments.find(t => t.id === treatmentId)
      return total + (treatment ? calculateTreatmentCost(treatment, quantity) : 0)
    }, 0)
  }

  const getMonthlyPayment = () => {
    const total = getTotalCost()
    if (selectedFinancing === 'CareCredit' && paymentPlan <= 12) {
      return total / paymentPlan // 0% APR for qualified terms
    }
    // Simple calculation with estimated APR for other cases
    const apr = 0.15 // 15% APR estimate
    const monthlyRate = apr / 12
    return total * (monthlyRate * Math.pow(1 + monthlyRate, paymentPlan)) / (Math.pow(1 + monthlyRate, paymentPlan) - 1)
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
            <Calculate sx={{ mr: 2, fontSize: 'inherit' }} />
            Aesthetic Investment Calculator
          </Typography>
          
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
          >
            Plan your aesthetic journey with flexible financing options
          </Typography>
        </motion.div>

        <Grid container spacing={6}>
          {/* Treatment Selection */}
          <Grid item="true" xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                Select Your Treatments
              </Typography>

              <Grid container spacing={3}>
                {treatments.map((treatment, index) => (
                  <Grid item="true" key={treatment.id} xs={12} sm={6}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          border: selectedTreatments[treatment.id] ? '2px solid' : '1px solid',
                          borderColor: selectedTreatments[treatment.id] ? 'primary.main' : 'divider',
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                background: `url(${treatment.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: 2,
                                mr: 2
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {treatment.name}
                              </Typography>
                              <Chip
                                label={treatment.priceRange}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          </Box>

                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            {treatment.description}
                          </Typography>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2">Quantity:</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {[0, 1, 2, 3].map(num => (
                                <Button
                                  key={num}
                                  size="small"
                                  variant={selectedTreatments[treatment.id] === num ? 'contained' : 'outlined'}
                                  onClick={() => handleTreatmentQuantityChange(treatment.id, num)}
                                  sx={{ minWidth: 40 }}
                                >
                                  {num}
                                </Button>
                              ))}
                            </Box>
                          </Box>

                          {selectedTreatments[treatment.id] > 0 && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              <Typography variant="body2">
                                Subtotal: ${calculateTreatmentCost(treatment, selectedTreatments[treatment.id]).toLocaleString()}
                              </Typography>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Cost Summary & Financing */}
          <Grid item="true" xs={12} md={4}>
            <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
                Investment Summary
              </Typography>

              {Object.keys(selectedTreatments).length > 0 ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    {Object.entries(selectedTreatments).map(([treatmentId, quantity]) => {
                      const treatment = treatments.find(t => t.id === treatmentId)
                      return treatment ? (
                        <Box key={treatmentId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">
                            {treatment.name} × {quantity}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            ${calculateTreatmentCost(treatment, quantity).toLocaleString()}
                          </Typography>
                        </Box>
                      ) : null
                    })}
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Investment:</Typography>
                      <Typography variant="h6" sx={{ color: 'primary.main' }}>
                        ${getTotalCost().toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Financing Options */}
                  <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white', mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      <CreditCard sx={{ mr: 1 }} />
                      Financing Options
                    </Typography>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel sx={{ color: 'white' }}>Financing Provider</InputLabel>
                      <Select
                        value={selectedFinancing}
                        onChange={(e) => setSelectedFinancing(e.target.value)}
                        sx={{ 
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }
                        }}
                      >
                        {financing.options.map((option, index) => (
                          <MenuItem key={index} value={option.provider}>
                            {option.provider}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="body2" sx={{ mb: 2 }}>
                      Payment Term: {paymentPlan} months
                    </Typography>
                    <Slider
                      value={paymentPlan}
                      onChange={(_, value) => setPaymentPlan(value as number)}
                      min={6}
                      max={60}
                      step={6}
                      marks={[
                        { value: 6, label: '6mo' },
                        { value: 12, label: '12mo' },
                        { value: 24, label: '24mo' },
                        { value: 36, label: '36mo' }
                      ]}
                      sx={{ 
                        color: 'white',
                        '& .MuiSlider-thumb': { bgcolor: 'white' },
                        '& .MuiSlider-track': { bgcolor: 'white' },
                        '& .MuiSlider-rail': { bgcolor: 'rgba(255,255,255,0.3)' }
                      }}
                    />

                    <Alert severity="success" sx={{ mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Monthly Payment: ${getMonthlyPayment().toFixed(0)}
                      </Typography>
                      {selectedFinancing === 'CareCredit' && paymentPlan <= 12 && (
                        <Typography variant="body2">
                          0% APR for qualified applicants
                        </Typography>
                      )}
                    </Alert>
                  </Paper>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<Timeline />}
                    onClick={handleScheduleConsultation}
                  >
                    Chat with Julie about This Plan
                  </Button>
                </>
              ) : (
                <Alert severity="info">
                  <Typography variant="body2">
                    Select treatments above to see pricing and financing options
                  </Typography>
                </Alert>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* Financing Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card sx={{ mt: 6, p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'primary.main' }}>
              {financing.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
              {financing.description}
            </Typography>

            <Grid container spacing={3}>
              {financing.options.map((option, index) => (
                <Grid item="true" key={index} xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                        {option.provider}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mb: 2, color: 'success.main' }}>
                        {option.terms}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {option.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}

export default MedSpaCostCalculator