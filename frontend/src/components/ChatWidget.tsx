import React from 'react';
import { Box } from '@mui/material';
import { Chatbot } from '../chatbot/components/Chatbot';

interface ChatWidgetProps {
  onNewMessage?: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNewMessage }) => {
  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Chatbot />
    </Box>
  );
};