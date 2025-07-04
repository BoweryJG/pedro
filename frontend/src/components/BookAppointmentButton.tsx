import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useChatStore } from '../chatbot/store/chatStore';
import { trackEvent, trackChatOpen, trackProcedureInterest } from '../utils/analytics';

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
  const chatStore = useChatStore();

  const handleClick = () => {
    // Track button click
    trackEvent('book_appointment_button_click', {
      initial_service: initialService || 'none',
      location: window.location.pathname
    });
    
    // Track chat open
    trackChatOpen('appointment_button');
    
    // Track procedure interest if service is specified
    if (initialService) {
      trackProcedureInterest(initialService);
    }
    
    // Send a message with the service context if provided
    if (initialService) {
      chatStore.sendMessage(`I'd like to book an appointment for ${initialService}`);
    } else {
      chatStore.sendMessage("I'd like to book an appointment");
    }
    
    // Open chat if not already open
    if (!chatStore.isOpen) {
      chatStore.toggleChat();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      startIcon={startIcon}
      onClick={handleClick}
      className="panerai-cta"
      {...buttonProps}
    >
      {children}
    </Button>
  );
};