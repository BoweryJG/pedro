import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Slider,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material'
import { motion } from 'framer-motion'
import { 
  Calculate, 
  CheckCircle,
  ExpandMore,
  CreditCard,
  Schedule,
  Psychology
} from '@mui/icons-material'
import { implantApiService, implantApiUtils } from '../../../services/implantApi'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface CostBreakdown {
  implantCost: number
  crownCost: number
  surgicalFees: number
  bonusServices: number
  total: number
}

interface FinancingOption {
  provider: string
  monthlyPayment: number
  term: number
  apr: number
  totalCost: number
}

const ImplantCostCalculator: React.FC = () => {
  const { toggleChat, sendMessage } = useChatStore()
  const [implantType, setImplantType] = useState<'single' | 'multiple' | 'full_mouth'>('single')
  const [quantity, setQuantity] = useState(1)
  const [includeCrown, setIncludeCrown] = useState(true)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null)
  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const bonusServices = [
    { name: '3D Imaging & Planning', cost: 350, description: 'Comprehensive 3D scan for precise placement' },
    { name: 'Bone Grafting', cost: 800, description: 'Bone augmentation if needed' },
    { name: 'Sinus Lift', cost: 1200, description: 'Upper jaw bone enhancement' },
    { name: 'Sedation', cost: 400, description: 'IV sedation for comfort' },
    { name: 'Temporary Crown', cost: 300, description: 'Immediate temporary restoration' },
    { name: 'Premium Crown Material', cost: 500, description: 'Zirconia or porcelain upgrade' }
  ]

  const baseCosts = {
    single: { implant: 2500, crown: 1200, surgical: 800 },
    multiple: { implant: 2200, crown: 1100, surgical: 600 },
    full_mouth: { implant: 2000, crown: 1000, surgical: 500 }
  }

  const calculateCost = async () => {
    setIsCalculating(true)
    
    try {
      const baseCost = baseCosts[implantType]
      const implantCost = baseCost.implant * quantity
      const crownCost = includeCrown ? baseCost.crown * quantity : 0
      const surgicalFees = baseCost.surgical * quantity
      const bonusServicesCost = selectedServices.reduce((total, serviceName) => {
        const service = bonusServices.find(s => s.name === serviceName)
        return total + (service?.cost || 0)
      }, 0)
      
      const total = implantCost + crownCost + surgicalFees + bonusServicesCost

      const breakdown: CostBreakdown = {
        implantCost,
        crownCost,
        surgicalFees,
        bonusServices: bonusServicesCost,
        total
      }
      
      setCostBreakdown(breakdown)
      
      // Generate financing options
      const financing: FinancingOption[] = [
        {
          provider: 'Cherry',
          monthlyPayment: implantApiUtils.calculateMonthlyPayment(total, 0, 12),
          term: 12,
          apr: 0,
          totalCost: total
        },
        {
          provider: 'Sunbit',
          monthlyPayment: implantApiUtils.calculateMonthlyPayment(total, 9.99, 24),
          term: 24,
          apr: 9.99,
          totalCost: total * 1.1
        },
        {
          provider: 'CareCredit',
          monthlyPayment: implantApiUtils.calculateMonthlyPayment(total, 14.99, 36),
          term: 36,
          apr: 14.99,
          totalCost: total * 1.2
        },
        {
          provider: 'Affirm',
          monthlyPayment: implantApiUtils.calculateMonthlyPayment(total, 6.99, 18),
          term: 18,
          apr: 6.99,
          totalCost: total * 1.05
        }
      ]
      
      setFinancingOptions(financing)
      
      // Track calculation event
      await implantApiService.trackEvent({
        event: 'cost_calculation',
        page: 'implant_cost_calculator',
        component: 'cost_calculator',
        data: {
          implantType,
          quantity,
          includeCrown,
          selectedServices,
          totalCost: total
        }
      })
      
    } catch (error) {
      console.error('Cost calculation error:', error)
    }
    
    setIsCalculating(false)
  }

  const handleServiceToggle = (serviceName: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    )
  }

  const handleScheduleConsultation = () => {
    trackChatOpen('implant_cost_calculator')
    trackEvent({
      action: 'schedule_from_calculator',
      category: 'conversion',
      label: 'implant_consultation',
      value: costBreakdown?.total
    })
    toggleChat()
    setTimeout(() => {
      sendMessage(`I'm interested in dental implants. Based on the cost calculator, my estimated treatment cost is ${costBreakdown ? implantApiUtils.formatCurrency(costBreakdown.total) : 'around $3,500'}. I'd like to schedule a consultation.`)
    }, 500)
  }

  useEffect(() => {
    calculateCost()
  }, [implantType, quantity, includeCrown, selectedServices])

  return (
    <Box 
      id="implant-cost-calculator"
      sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'background.default' 
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Calculate sx={{ fontSize: '3rem', color: 'primary.main', mb: 2 }} />
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
              Implant Cost Calculator
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
              Get an instant estimate for your dental implant treatment with financing options
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Calculator Controls */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ p: 3, height: 'fit-content' }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Treatment Details
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Implant Type</InputLabel>
                  <Select
                    value={implantType}
                    onChange={(e) => setImplantType(e.target.value as any)}
                  >
                    <MenuItem value="single">Single Implant</MenuItem>
                    <MenuItem value="multiple">Multiple Implants</MenuItem>
                    <MenuItem value="full_mouth">Full Mouth Reconstruction</MenuItem>
                  </Select>
                </FormControl>

                {implantType !== 'full_mouth' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>
                      Number of Implants: {quantity}
                    </Typography>
                    <Slider
                      value={quantity}
                      onChange={(_, value) => setQuantity(value as number)}
                      min={1}
                      max={implantType === 'single' ? 1 : 8}
                      step={1}
                      marks
                    />
                  </Box>
                )}

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeCrown}
                      onChange={(e) => setIncludeCrown(e.target.checked)}
                    />
                  }
                  label="Include Crown/Restoration"
                  sx={{ mb: 3 }}
                />

                <Typography variant="h6" gutterBottom>
                  Additional Services
                </Typography>
                {bonusServices.map((service) => (
                  <Accordion key={service.name} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedServices.includes(service.name)}
                            onChange={() => handleServiceToggle(service.name)}
                          />
                        }
                        label={`${service.name} (+${implantApiUtils.formatCurrency(service.cost)})`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Card>
            </Grid>

            {/* Cost Breakdown */}
            <Grid size={{ xs: 12, md: 8 }}>
              {costBreakdown && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        Cost Breakdown
                      </Typography>
                      
                      <TableContainer component={Paper} variant="outlined">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Service</TableCell>
                              <TableCell align="right">Cost</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>Implant(s) ({quantity}x)</TableCell>
                              <TableCell align="right">
                                {implantApiUtils.formatCurrency(costBreakdown.implantCost)}
                              </TableCell>
                            </TableRow>
                            {includeCrown && (
                              <TableRow>
                                <TableCell>Crown(s) ({quantity}x)</TableCell>
                                <TableCell align="right">
                                  {implantApiUtils.formatCurrency(costBreakdown.crownCost)}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>Surgical Fees</TableCell>
                              <TableCell align="right">
                                {implantApiUtils.formatCurrency(costBreakdown.surgicalFees)}
                              </TableCell>
                            </TableRow>
                            {costBreakdown.bonusServices > 0 && (
                              <TableRow>
                                <TableCell>Additional Services</TableCell>
                                <TableCell align="right">
                                  {implantApiUtils.formatCurrency(costBreakdown.bonusServices)}
                                </TableCell>
                              </TableRow>
                            )}
                            <TableRow sx={{ bgcolor: 'primary.light' }}>
                              <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>
                                Total Estimated Cost
                              </TableCell>
                              <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>
                                {implantApiUtils.formatCurrency(costBreakdown.total)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>

                  {/* Financing Options */}
                  <Card>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        Financing Options
                      </Typography>
                      
                      <Alert severity="info" sx={{ mb: 3 }}>
                        <strong>Good news!</strong> Most patients qualify for financing with low monthly payments.
                      </Alert>

                      <Grid container spacing={2}>
                        {financingOptions.map((option) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={option.provider}>
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <CreditCard sx={{ color: 'primary.main', mr: 1 }} />
                                  <Typography variant="h6" color="primary">
                                    {option.provider}
                                  </Typography>
                                </Box>
                                
                                <Typography variant="h4" color="success.main" gutterBottom>
                                  {implantApiUtils.formatCurrency(option.monthlyPayment)}/mo
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {option.term} months • {option.apr}% APR
                                </Typography>
                                
                                {option.apr === 0 && (
                                  <Chip 
                                    label="0% Interest" 
                                    color="success" 
                                    size="small" 
                                    sx={{ mb: 1 }}
                                  />
                                )}
                                
                                <Typography variant="caption" display="block">
                                  Total: {implantApiUtils.formatCurrency(option.totalCost)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>

                      <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleScheduleConsultation}
                          startIcon={<Psychology />}
                          sx={{
                            mr: 2,
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem'
                          }}
                        >
                          Chat with Julie to Schedule
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            const element = document.getElementById('implant-financing-wizard')
                            element?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          startIcon={<CheckCircle />}
                          sx={{
                            py: 1.5,
                            px: 4,
                            fontSize: '1.1rem'
                          }}
                        >
                          Get Pre-Qualified
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ImplantCostCalculator
