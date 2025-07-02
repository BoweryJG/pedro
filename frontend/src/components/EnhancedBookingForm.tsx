import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Person,
  LocalHospital,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { AppointmentService, type TimeSlot, type AvailableProvider } from '../services/appointmentService';
import type { Tables } from '../types/supabase';

interface EnhancedBookingFormProps {
  open: boolean;
  onClose: () => void;
  initialService?: string;
  onSuccess?: (appointmentId: string) => void;
}

interface BookingFormData {
  // Patient Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  insuranceProvider: string;
  insuranceMemberId: string;
  insuranceGroupNumber: string;
  
  // Appointment Details
  serviceId: string;
  staffId: string;
  date: Dayjs | null;
  time: string;
  notes: string;
}

const steps = ['Service & Provider', 'Date & Time', 'Patient Information', 'Review & Confirm'];

const insuranceProviders = [
  'None / Self-Pay',
  'Aetna',
  'Blue Cross Blue Shield',
  'Cigna',
  'Delta Dental',
  'Guardian',
  'Humana',
  'MetLife',
  'UnitedHealthcare',
  'Other'
];

export const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  open,
  onClose,
  initialService,
  onSuccess
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [services, setServices] = useState<Tables['services']['Row'][]>([]);
  const [staff, setStaff] = useState<Tables['staff']['Row'][]>([]);
  const [availableProviders, setAvailableProviders] = useState<AvailableProvider[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    insuranceProvider: 'None / Self-Pay',
    insuranceMemberId: '',
    insuranceGroupNumber: '',
    serviceId: initialService || '',
    staffId: '',
    date: null,
    time: '',
    notes: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    if (formData.serviceId) {
      loadStaff(formData.serviceId);
    }
  }, [formData.serviceId]);

  useEffect(() => {
    if (formData.date && formData.serviceId) {
      loadAvailableProviders();
    }
  }, [formData.date, formData.serviceId]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getServices();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async (serviceId: string) => {
    try {
      setLoading(true);
      const data = await AppointmentService.getStaff(serviceId);
      setStaff(data);
    } catch (err) {
      setError('Failed to load providers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableProviders = async () => {
    if (!formData.date || !formData.serviceId) return;
    
    try {
      setLoading(true);
      const providers = await AppointmentService.getAvailableProviders(
        formData.serviceId,
        formData.date
      );
      setAvailableProviders(providers);
      
      // If a staff member was previously selected but has no availability, clear selection
      if (formData.staffId && !providers.find(p => p.staff.id === formData.staffId)) {
        setFormData(prev => ({ ...prev, staffId: '', time: '' }));
        setSelectedTimeSlot(null);
      }
    } catch (err) {
      setError('Failed to load available times');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setError('');
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (): boolean => {
    switch (activeStep) {
      case 0: // Service & Provider
        if (!formData.serviceId) {
          setError('Please select a service');
          return false;
        }
        return true;
        
      case 1: // Date & Time
        if (!formData.date) {
          setError('Please select a date');
          return false;
        }
        if (!formData.staffId || !formData.time) {
          setError('Please select a provider and time');
          return false;
        }
        return true;
        
      case 2: // Patient Information
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
          setError('Please enter a valid 10-digit phone number');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create or get patient
      const patient = await AppointmentService.createOrGetPatient({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        insuranceProvider: formData.insuranceProvider !== 'None / Self-Pay' ? formData.insuranceProvider : undefined,
        insuranceMemberId: formData.insuranceMemberId,
        insuranceGroupNumber: formData.insuranceGroupNumber
      });
      
      // Get service duration
      const service = services.find(s => s.id === formData.serviceId);
      const duration = service?.estimated_duration ? 
        parseInt(service.estimated_duration.split(' ')[0]) : 60;
      
      // Create appointment
      const appointmentId = await AppointmentService.createAppointment({
        patientId: patient.id,
        serviceId: formData.serviceId,
        staffId: formData.staffId,
        date: formData.date!,
        time: formData.time,
        duration,
        notes: formData.notes
      });
      
      setConfirmationCode(appointmentId);
      setActiveStep(steps.length);
      
      if (onSuccess) {
        onSuccess(appointmentId);
      }
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderServiceSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select a Service
      </Typography>
      <Grid container spacing={2}>
        {services.map(service => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card 
              variant={formData.serviceId === service.id ? "elevation" : "outlined"}
              sx={{ 
                cursor: 'pointer',
                borderColor: formData.serviceId === service.id ? 'primary.main' : undefined,
                borderWidth: formData.serviceId === service.id ? 2 : 1
              }}
            >
              <CardActionArea onClick={() => setFormData(prev => ({ ...prev, serviceId: service.id }))}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {service.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {service.description}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip 
                      size="small" 
                      icon={<AccessTime />} 
                      label={service.estimated_duration || '60 minutes'} 
                    />
                    {service.is_yomi_technology && (
                      <Chip 
                        size="small" 
                        color="primary" 
                        label="Yomi Technology" 
                      />
                    )}
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderDateTimeSelection = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Date & Time
      </Typography>
      
      <Box mb={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Preferred Date"
            value={formData.date}
            onChange={(newDate) => setFormData(prev => ({ ...prev, date: newDate }))}
            minDate={dayjs().add(1, 'day')}
            maxDate={dayjs().add(3, 'month')}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined"
              }
            }}
          />
        </LocalizationProvider>
      </Box>

      {formData.date && availableProviders.length > 0 && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Available Providers & Times
          </Typography>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {availableProviders.map(provider => (
              <Box key={provider.staff.id} mb={2}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Person />
                  <Typography variant="subtitle2">
                    {provider.staff.title} {provider.staff.first_name} {provider.staff.last_name}
                  </Typography>
                  {provider.staff.specialization && (
                    <Chip size="small" label={provider.staff.specialization} />
                  )}
                </Box>
                <Grid container spacing={1}>
                  {provider.slots.slice(0, 8).map(slot => (
                    <Grid item xs={6} sm={3} key={slot.start_time}>
                      <Button
                        variant={
                          formData.staffId === provider.staff.id && 
                          formData.time === slot.start_time ? "contained" : "outlined"
                        }
                        size="small"
                        fullWidth
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            staffId: provider.staff.id,
                            time: slot.start_time
                          }));
                          setSelectedTimeSlot(slot);
                        }}
                      >
                        {dayjs(`2000-01-01 ${slot.start_time}`).format('h:mm A')}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </>
      )}

      {formData.date && availableProviders.length === 0 && !loading && (
        <Alert severity="warning">
          No available appointments for this date. Please select another date.
        </Alert>
      )}
    </Box>
  );

  const renderPatientInfo = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Patient Information
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(123) 456-7890"
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Insurance Information
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Insurance Provider</InputLabel>
            <Select
              value={formData.insuranceProvider}
              onChange={(e) => setFormData(prev => ({ ...prev, insuranceProvider: e.target.value }))}
              label="Insurance Provider"
            >
              {insuranceProviders.map(provider => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {formData.insuranceProvider !== 'None / Self-Pay' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Member ID"
                value={formData.insuranceMemberId}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceMemberId: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Group Number"
                value={formData.insuranceGroupNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, insuranceGroupNumber: e.target.value }))}
              />
            </Grid>
          </>
        )}
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Notes (Optional)"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Any special requests or information we should know?"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderReview = () => {
    const selectedService = services.find(s => s.id === formData.serviceId);
    const selectedStaff = staff.find(s => s.id === formData.staffId);
    
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Review Your Appointment
        </Typography>
        
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                <Typography variant="body1">{selectedService?.name}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                <Typography variant="body1">
                  {selectedStaff?.title} {selectedStaff?.first_name} {selectedStaff?.last_name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1">
                  {formData.date?.format('MMMM D, YYYY')} at {dayjs(`2000-01-01 ${formData.time}`).format('h:mm A')}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Patient</Typography>
                <Typography variant="body1">
                  {formData.firstName} {formData.lastName}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Contact</Typography>
                <Typography variant="body1">{formData.email}</Typography>
                <Typography variant="body1">{formData.phone}</Typography>
              </Grid>
              
              {formData.insuranceProvider !== 'None / Self-Pay' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Insurance</Typography>
                  <Typography variant="body1">{formData.insuranceProvider}</Typography>
                </Grid>
              )}
              
              {formData.notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
                  <Typography variant="body1">{formData.notes}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          You will receive a confirmation email with appointment details and reminders.
        </Alert>
      </Box>
    );
  };

  const renderConfirmation = () => (
    <Box textAlign="center" py={4}>
      <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Appointment Confirmed!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Your appointment has been successfully booked.
      </Typography>
      <Typography variant="h6" gutterBottom>
        Confirmation Code: {confirmationCode}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        A confirmation email has been sent to {formData.email}
      </Typography>
      <Button variant="contained" onClick={onClose} sx={{ mt: 2 }}>
        Close
      </Button>
    </Box>
  );

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderServiceSelection();
      case 1:
        return renderDateTimeSelection();
      case 2:
        return renderPatientInfo();
      case 3:
        return renderReview();
      default:
        return renderConfirmation();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      {activeStep < steps.length && (
        <>
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalHospital color="primary" />
              Book Your Appointment
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Box mb={3}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              getStepContent()
            )}
          </DialogContent>
          
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            {activeStep > 0 && (
              <Button onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                disabled={loading}
              >
                Confirm Booking
              </Button>
            )}
          </DialogActions>
        </>
      )}
      
      {activeStep >= steps.length && getStepContent()}
    </Dialog>
  );
};