import React from 'react';
import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
import { useChatStore } from '../chatbot/store/chatStore';

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
      {...buttonProps}
    >
      {children}
    </Button>
  );
};