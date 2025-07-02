import React, { useState } from 'react';
import { Button, ButtonProps, Snackbar, Alert } from '@mui/material';
import { CalendarMonth, Phone } from '@mui/icons-material';
import { EnhancedBookingForm } from './EnhancedBookingForm';
import { isSupabaseEnabled } from '../lib/supabase';
import { CONTACT_INFO } from '../constants/contact';

interface BookAppointmentButtonProps extends Omit<ButtonProps, 'onClick'> {
  initialService?: string;
  onSuccess?: (appointmentId: string) => void;
}

export const BookAppointmentButton: React.FC<BookAppointmentButtonProps> = ({
  initialService,
  onSuccess,
  children = "Book Appointment",
  startIcon = <CalendarMonth />,
  variant = "contained",
  size = "large",
  ...buttonProps
}) => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showPhoneAlert, setShowPhoneAlert] = useState(false);

  const handleSuccess = (appointmentId: string) => {
    setBookingOpen(false);
    if (onSuccess) {
      onSuccess(appointmentId);
    }
  };

  const handleClick = () => {
    if (isSupabaseEnabled) {
      setBookingOpen(true);
    } else {
      // If Supabase is not configured, show call prompt
      setShowPhoneAlert(true);
    }
  };

  const handleCallNow = () => {
    window.location.href = `tel:${CONTACT_INFO.phone}`;
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={startIcon}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </Button>
      
      {isSupabaseEnabled && (
        <EnhancedBookingForm
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          initialService={initialService}
          onSuccess={handleSuccess}
        />
      )}
      
      <Snackbar
        open={showPhoneAlert}
        autoHideDuration={6000}
        onClose={() => setShowPhoneAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowPhoneAlert(false)} 
          severity="info"
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Phone />}
              onClick={handleCallNow}
            >
              Call Now
            </Button>
          }
        >
          Please call {CONTACT_INFO.phone} to book your appointment
        </Alert>
      </Snackbar>
    </>
  );
};