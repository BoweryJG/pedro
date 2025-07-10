import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ExpandMore as ExpandMoreIcon,
  CreditCard as CreditCardIcon,
  HealthAndSafety as InsuranceIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { financingService } from '../services/financingService';
import type { PatientFinancingData, InsuranceVerificationData } from '../services/financingService';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface FinancingWidgetProps {
  procedureType: 'yomi' | 'tmj' | 'emface';
  procedureCost: number;
  onComplete?: (result: any) => void;
}

const steps = ['Choose Option', 'Enter Information', 'Get Results'];

export const FinancingWidget: React.FC<FinancingWidgetProps> = ({
  procedureType,
  procedureCost,
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'financing' | 'insurance' | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Financing form data
  const [financingData, setFinancingData] = useState<Partial<PatientFinancingData>>({
    procedureType,
    procedureAmount: procedureCost
  });

  // Insurance form data
  const [insuranceData, setInsuranceData] = useState<Partial<InsuranceVerificationData>>({});
  const [dateOfBirth, setDateOfBirth] = useState<Dayjs | null>(null);
  
  // iFrame modal states
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [selectedFinancingProvider, setSelectedFinancingProvider] = useState<'cherry' | 'sunbit' | 'carecredit' | null>(null);
  const [financingUrl, setFinancingUrl] = useState('');

  const handleNext = async () => {
    if (activeStep === 0 && !selectedOption) {
      setErrors({ option: 'Please select an option' });
      return;
    }

    if (activeStep === 1) {
      if (!validateForm()) return;
      
      setLoading(true);
      try {
        if (selectedOption === 'financing') {
          const results = await financingService.checkFinancingEligibility({
            ...financingData,
            dateOfBirth: dateOfBirth?.format('YYYY-MM-DD') || ''
          } as PatientFinancingData);
          setResults({ type: 'financing', data: results });
        } else {
          const result = await financingService.verifyInsurance({
            ...insuranceData,
            patientDOB: dateOfBirth?.format('YYYY-MM-DD') || ''
          } as InsuranceVerificationData);
          
          const costEstimate = financingService.estimatePatientCost(procedureCost, result);
          setResults({ 
            type: 'insurance', 
            data: result,
            costEstimate 
          });
        }
        setActiveStep(2);
      } catch (error) {
        console.error('Error:', error);
        setErrors({ submit: 'An error occurred. Please try again.' });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (selectedOption === 'financing') {
      if (!financingData.firstName) newErrors.firstName = 'Required';
      if (!financingData.lastName) newErrors.lastName = 'Required';
      if (!financingData.email) newErrors.email = 'Required';
      if (!financingData.phone) newErrors.phone = 'Required';
      if (!dateOfBirth) newErrors.dateOfBirth = 'Required';
    } else {
      if (!insuranceData.patientFirstName) newErrors.firstName = 'Required';
      if (!insuranceData.patientLastName) newErrors.lastName = 'Required';
      if (!insuranceData.insuranceProvider) newErrors.provider = 'Required';
      if (!insuranceData.memberId) newErrors.memberId = 'Required';
      if (!dateOfBirth) newErrors.dateOfBirth = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              How would you like to handle payment?
            </Typography>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
              <Box flex={{ xs: '1 1 100%', md: '1 1 50%' }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedOption === 'financing' ? '2px solid' : '1px solid',
                    borderColor: selectedOption === 'financing' ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => {
                    setSelectedOption('financing');
                    setErrors({});
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <CreditCardIcon color="primary" />
                      <Typography variant="h6">Patient Financing</Typography>
                    </Box>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><SpeedIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="30-second approval" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="85% approval rate" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MoneyIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="0% interest options" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
              
              <Box flex={{ xs: '1 1 100%', md: '1 1 50%' }}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedOption === 'insurance' ? '2px solid' : '1px solid',
                    borderColor: selectedOption === 'insurance' ? 'primary.main' : 'grey.300',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => {
                    setSelectedOption('insurance');
                    setErrors({});
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <InsuranceIcon color="primary" />
                      <Typography variant="h6">Verify Insurance</Typography>
                    </Box>
                    <List dense>
                      <ListItem>
                        <ListItemIcon><CheckIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="Instant verification" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><SecurityIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="Secure & HIPAA compliant" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon><MoneyIcon fontSize="small" color="success" /></ListItemIcon>
                        <ListItemText primary="Know your costs upfront" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Box>
            </Box>
            {errors.option && (
              <Alert severity="error" sx={{ mt: 2 }}>{errors.option}</Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            {selectedOption === 'financing' ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Check Your Financing Options
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  No impact to your credit score
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={financingData.firstName || ''}
                      onChange={(e) => setFinancingData({ ...financingData, firstName: e.target.value })}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={financingData.lastName || ''}
                      onChange={(e) => setFinancingData({ ...financingData, lastName: e.target.value })}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={financingData.email || ''}
                      onChange={(e) => setFinancingData({ ...financingData, email: e.target.value })}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Phone"
                      fullWidth
                      value={financingData.phone || ''}
                      onChange={(e) => setFinancingData({ ...financingData, phone: e.target.value })}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        maxDate={dayjs().subtract(18, 'year')}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dateOfBirth,
                            helperText: errors.dateOfBirth
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Annual Income (Optional)"
                      fullWidth
                      type="number"
                      value={financingData.income || ''}
                      onChange={(e) => setFinancingData({ ...financingData, income: parseInt(e.target.value) })}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                      }}
                      helperText="Helps find best options"
                    />
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Verify Your Insurance Coverage
                </Typography>
                
                <Box display="flex" flexWrap="wrap" gap={2} sx={{ mt: 1 }}>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="First Name"
                      fullWidth
                      value={insuranceData.patientFirstName || ''}
                      onChange={(e) => setInsuranceData({ ...insuranceData, patientFirstName: e.target.value })}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Last Name"
                      fullWidth
                      value={insuranceData.patientLastName || ''}
                      onChange={(e) => setInsuranceData({ ...insuranceData, patientLastName: e.target.value })}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <FormControl fullWidth error={!!errors.provider}>
                      <InputLabel>Insurance Provider</InputLabel>
                      <Select
                        value={insuranceData.insuranceProvider || ''}
                        onChange={(e) => setInsuranceData({ ...insuranceData, insuranceProvider: e.target.value })}
                        label="Insurance Provider"
                      >
                        <MenuItem value="Delta Dental">Delta Dental</MenuItem>
                        <MenuItem value="Cigna">Cigna</MenuItem>
                        <MenuItem value="Aetna">Aetna</MenuItem>
                        <MenuItem value="United Healthcare">United Healthcare</MenuItem>
                        <MenuItem value="MetLife">MetLife</MenuItem>
                        <MenuItem value="Guardian">Guardian</MenuItem>
                        <MenuItem value="Humana">Humana</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Member ID"
                      fullWidth
                      value={insuranceData.memberId || ''}
                      onChange={(e) => setInsuranceData({ ...insuranceData, memberId: e.target.value })}
                      error={!!errors.memberId}
                      helperText={errors.memberId}
                    />
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date of Birth"
                        value={dateOfBirth}
                        onChange={setDateOfBirth}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dateOfBirth,
                            helperText: errors.dateOfBirth
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                  <Box flex={{ xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' }}>
                    <TextField
                      label="Group Number (Optional)"
                      fullWidth
                      value={insuranceData.groupNumber || ''}
                      onChange={(e) => setInsuranceData({ ...insuranceData, groupNumber: e.target.value })}
                    />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            {results?.type === 'financing' ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Your Financing Options
                </Typography>
                {results.data.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {results.data.map((option: any, index: number) => (
                      <Accordion key={index} defaultExpanded={option.approved && index === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box display="flex" alignItems="center" gap={2} width="100%">
                            {option.approved ? (
                              <CheckIcon color="success" />
                            ) : (
                              <Box sx={{ width: 24 }} />
                            )}
                            <Typography variant="subtitle1" flex={1}>
                              {option.provider.toUpperCase()}
                            </Typography>
                            {option.approved && (
                              <Chip 
                                label={`$${option.monthlyPayment}/mo`} 
                                color="primary" 
                                size="small" 
                              />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {option.approved ? (
                            <Box>
                              <Alert severity="success" sx={{ mb: 2 }}>
                                {option.message}
                              </Alert>
                              <Box display="flex" flexWrap="wrap" gap={2}>
                                <Box flex="1 1 calc(50% - 8px)">
                                  <Typography variant="body2" color="text.secondary">
                                    Approval Amount
                                  </Typography>
                                  <Typography variant="h6">
                                    ${option.approvalAmount}
                                  </Typography>
                                </Box>
                                <Box flex="1 1 calc(50% - 8px)">
                                  <Typography variant="body2" color="text.secondary">
                                    Monthly Payment
                                  </Typography>
                                  <Typography variant="h6">
                                    ${option.monthlyPayment}
                                  </Typography>
                                </Box>
                                <Box flex="1 1 calc(50% - 8px)">
                                  <Typography variant="body2" color="text.secondary">
                                    Term Length
                                  </Typography>
                                  <Typography variant="h6">
                                    {option.term} months
                                  </Typography>
                                </Box>
                                <Box flex="1 1 calc(50% - 8px)">
                                  <Typography variant="body2" color="text.secondary">
                                    APR
                                  </Typography>
                                  <Typography variant="h6">
                                    {option.apr}%
                                  </Typography>
                                </Box>
                              </Box>
                              {option.preQualificationId && (
                                <Box sx={{ mt: 2 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Pre-qualification ID: {option.preQualificationId}
                                  </Typography>
                                </Box>
                              )}
                              <Box sx={{ mt: 2 }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  fullWidth
                                  onClick={() => {
                                    // Handle application URL or direct modal
                                    if (option.applicationUrl) {
                                      setFinancingUrl(option.applicationUrl);
                                      setSelectedFinancingProvider(option.provider);
                                      setShowFinancingModal(true);
                                    } else {
                                      // Generate URL based on provider
                                      let url = '';
                                      switch (option.provider) {
                                        case 'cherry':
                                          url = `https://patient.withcherry.com/?practice_id=PEDRO_DENTAL_001&amount=${option.approvalAmount}`;
                                          break;
                                        case 'sunbit':
                                          url = `https://app.sunbit.com/apply?merchant=PEDRO_DENTAL_SI&amount=${option.approvalAmount}`;
                                          break;
                                        case 'carecredit':
                                          url = `https://www.carecredit.com/apply/?sitecode=B3CPLAdentist01&cmpid=B3CPLAdentist01&dtc=N`;
                                          break;
                                      }
                                      setFinancingUrl(url);
                                      setSelectedFinancingProvider(option.provider);
                                      setShowFinancingModal(true);
                                    }
                                  }}
                                >
                                  Apply Now with {option.provider.charAt(0).toUpperCase() + option.provider.slice(1)}
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            <Alert severity="info">
                              {option.message}
                            </Alert>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                ) : (
                  <Alert severity="warning">
                    No financing options available at this time. Please contact our office for alternative payment arrangements.
                  </Alert>
                )}
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Insurance Verification Results
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {results.data.eligible ? (
                    <>
                      <Alert severity="success" sx={{ mb: 2 }}>
                        {results.data.message}
                      </Alert>
                      
                      <Card sx={{ mb: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Coverage Details
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={2}>
                            <Box flex="1 1 calc(50% - 8px)">
                              <Typography variant="body2" color="text.secondary">
                                Coverage
                              </Typography>
                              <Typography variant="h6">
                                {results.data.coveragePercentage}%
                              </Typography>
                            </Box>
                            <Box flex="1 1 calc(50% - 8px)">
                              <Typography variant="body2" color="text.secondary">
                                Deductible
                              </Typography>
                              <Typography variant="h6">
                                ${results.data.deductibleMet} / ${results.data.deductible}
                              </Typography>
                            </Box>
                            <Box flex="1 1 calc(50% - 8px)">
                              <Typography variant="body2" color="text.secondary">
                                Benefits Remaining
                              </Typography>
                              <Typography variant="h6">
                                ${results.data.remainingBenefit}
                              </Typography>
                            </Box>
                            <Box flex="1 1 calc(50% - 8px)">
                              <Typography variant="body2" color="text.secondary">
                                Annual Maximum
                              </Typography>
                              <Typography variant="h6">
                                ${results.data.maxAnnualBenefit}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                            Estimated Cost for Your Procedure
                          </Typography>
                          <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 1, mb: 2 }}>
                            <Typography variant="h4" color="primary.contrastText">
                              ${results.costEstimate.estimatedCost}
                            </Typography>
                            <Typography variant="body2" color="primary.contrastText">
                              Your estimated out-of-pocket cost
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                            {results.costEstimate.breakdown}
                          </Typography>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Alert severity="error">
                      {results.data.message}
                    </Alert>
                  )}
                </Box>
              </>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                fullWidth
                onClick={() => onComplete?.(results)}
              >
                Continue to Booking
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent>
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
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
            >
              Back
            </Button>
            {activeStep < 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
                endIcon={loading && <CircularProgress size={20} />}
              >
                {activeStep === 1 ? 'Check Options' : 'Next'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Financing iFrame Modal */}
      <Dialog 
      open={showFinancingModal} 
      onClose={() => setShowFinancingModal(false)}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '900px'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">
          Complete Your {selectedFinancingProvider ? 
            selectedFinancingProvider.charAt(0).toUpperCase() + selectedFinancingProvider.slice(1) : 
            'Financing'
          } Application
        </Typography>
        <IconButton 
          onClick={() => setShowFinancingModal(false)}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {financingUrl && (
          <iframe
            src={financingUrl}
            width="100%"
            height="100%"
            style={{
              border: 'none',
              minHeight: '700px'
            }}
            title={`${selectedFinancingProvider} Financing Application`}
          />
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};