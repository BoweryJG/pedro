import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { CONTACT_INFO } from '../../constants/contact';
import type { SelectChangeEvent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { procedureKnowledge } from '../knowledge/procedures';
import { trackEvent, trackProcedureInterest, trackConversion } from '../../utils/analytics';

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  procedure?: 'yomi' | 'tmj' | 'emface';
  onSubmit: (data: BookingData) => void;
}

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  procedure: string;
  preferredDate: Dayjs | null;
  preferredTime: Dayjs | null;
  alternateDate: Dayjs | null;
  insurance: string;
  message: string;
}

const steps = ['Contact Info', 'Procedure & Time', 'Review & Submit'];

export const BookingForm: React.FC<BookingFormProps> = ({
  open,
  onClose,
  procedure: initialProcedure,
  onSubmit
}) => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Track form open
  React.useEffect(() => {
    if (open) {
      trackEvent('booking_form_open', {
        initial_procedure: initialProcedure || 'none',
        source: 'chatbot'
      });
    }
  }, [open, initialProcedure]);
  const [formData, setFormData] = useState<BookingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    procedure: initialProcedure || '',
    preferredDate: null,
    preferredTime: null,
    alternateDate: null,
    insurance: 'none',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});
  
  const handleNext = () => {
    if (validateStep()) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      
      // Track step progression
      trackEvent('booking_form_step', {
        from_step: activeStep,
        to_step: nextStep,
        step_name: activeStep === 0 ? 'contact_info' : 'procedure_selection'
      });
    }
  };
  
  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };
  
  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};
    
    if (activeStep === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      
      // Email validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      
      // Phone validation
      if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone format';
      }
    }
    
    if (activeStep === 1) {
      if (!formData.procedure) newErrors.procedure = 'Please select a procedure';
      if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
      if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFieldChange = (field: keyof BookingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    
    // Track procedure selection
    if (field === 'procedure' && value) {
      trackProcedureInterest(value);
    }
  };
  
  const handleSubmit = () => {
    if (validateStep()) {
      // Track form submission
      trackEvent('booking_form_submit', {
        procedure: formData.procedure,
        has_insurance: formData.insurance !== 'none',
        insurance_type: formData.insurance
      });
      
      // Track conversion
      trackConversion('appointment', formData.procedure);
      
      onSubmit(formData);
      onClose();
    }
  };
  
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };
  
  const getProcedurePrice = (proc: string) => {
    const prices = {
      yomi: '$4,500 - $6,000',
      tmj: '$1,500 - $3,500',
      emface: '$3,200 (4 sessions)'
    };
    return prices[proc as keyof typeof prices] || 'Contact for pricing';
  };
  
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                fullWidth
                required
              />
            </Box>
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleFieldChange('phone', formatPhone(e.target.value))}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder={CONTACT_INFO.phone.display}
              fullWidth
              required
            />
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required error={!!errors.procedure}>
              <InputLabel>Procedure</InputLabel>
              <Select
                value={formData.procedure}
                onChange={(e: SelectChangeEvent) => handleFieldChange('procedure', e.target.value)}
                label="Procedure"
              >
                <MenuItem value="yomi">Yomi Robotic Dental Implants</MenuItem>
                <MenuItem value="tmj">TMJ/TMD Treatment</MenuItem>
                <MenuItem value="emface">Emface Facial Rejuvenation</MenuItem>
              </Select>
            </FormControl>
            
            {formData.procedure && (
              <Alert severity="info">
                Estimated cost: {getProcedurePrice(formData.procedure)}
              </Alert>
            )}
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Preferred Date"
                value={formData.preferredDate}
                onChange={(value) => handleFieldChange('preferredDate', value)}
                minDate={dayjs()}
                maxDate={dayjs().add(3, 'month')}
                slotProps={{
                  textField: {
                    error: !!errors.preferredDate,
                    helperText: errors.preferredDate,
                    required: true
                  }
                }}
              />
              
              <TimePicker
                label="Preferred Time"
                value={formData.preferredTime}
                onChange={(value) => handleFieldChange('preferredTime', value)}
                minutesStep={30}
                slotProps={{
                  textField: {
                    error: !!errors.preferredTime,
                    helperText: errors.preferredTime,
                    required: true
                  }
                }}
              />
              
              <DatePicker
                label="Alternate Date (Optional)"
                value={formData.alternateDate}
                onChange={(value) => handleFieldChange('alternateDate', value)}
                minDate={dayjs()}
                maxDate={dayjs().add(3, 'month')}
              />
            </LocalizationProvider>
            
            <FormControl fullWidth>
              <InputLabel>Insurance</InputLabel>
              <Select
                value={formData.insurance}
                onChange={(e: SelectChangeEvent) => handleFieldChange('insurance', e.target.value)}
                label="Insurance"
              >
                <MenuItem value="none">No Insurance</MenuItem>
                <MenuItem value="delta">Delta Dental</MenuItem>
                <MenuItem value="cigna">Cigna</MenuItem>
                <MenuItem value="aetna">Aetna</MenuItem>
                <MenuItem value="united">United Healthcare</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Additional Message (Optional)"
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success">
              Please review your consultation request
            </Alert>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Contact Information
              </Typography>
              <Typography variant="body2">
                {formData.firstName} {formData.lastName}
              </Typography>
              <Typography variant="body2">{formData.email}</Typography>
              <Typography variant="body2">{formData.phone}</Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Procedure Details
              </Typography>
              <Chip 
                label={procedureKnowledge[formData.procedure as keyof typeof procedureKnowledge]?.name || formData.procedure}
                color="primary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                Preferred: {formData.preferredDate && formData.preferredDate.format('MMM D, YYYY')} at{' '}
                {formData.preferredTime && formData.preferredTime.format('h:mm A')}
              </Typography>
              {formData.alternateDate && (
                <Typography variant="body2">
                  Alternate: {formData.alternateDate.format('MMM D, YYYY')}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Insurance: {formData.insurance === 'none' ? 'No Insurance' : formData.insurance}
              </Typography>
            </Box>
            
            {formData.message && (
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Your Message
                </Typography>
                <Typography variant="body2">{formData.message}</Typography>
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary">
              By submitting this request, you agree to be contacted by our office to
              confirm your appointment. We'll call you within 24 hours.
            </Typography>
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Book Your Consultation
        <Typography variant="subtitle2" color="text.secondary">
          Complete smile transformation starts here
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {renderStepContent()}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
            }}
          >
            Submit Request
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};