import React, { useState } from 'react';
import { Button, ButtonProps } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { EnhancedBookingForm } from './EnhancedBookingForm';

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

  const handleSuccess = (appointmentId: string) => {
    setBookingOpen(false);
    if (onSuccess) {
      onSuccess(appointmentId);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        startIcon={startIcon}
        onClick={() => setBookingOpen(true)}
        {...buttonProps}
      >
        {children}
      </Button>
      
      <EnhancedBookingForm
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialService={initialService}
        onSuccess={handleSuccess}
      />
    </>
  );
};