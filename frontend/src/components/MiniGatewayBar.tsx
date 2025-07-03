import React from 'react';
import { Box, Container, Button, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AutoAwesome as PrecisionIcon,
  ChatBubbleOutline as ChatIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import { useChatStore } from '../chatbot/store/chatStore';

export const MiniGatewayBar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  const isOpen = chatStore.isOpen;

  const handleGatewayClick = (type: 'precision' | 'chat' | 'emergency') => {
    // Open chat if not already open
    if (!chatStore.isOpen) {
      chatStore.toggleChat();
    }
    
    // Send context message after a small delay
    setTimeout(() => {
      if (type === 'precision') {
        chatStore.sendMessage("I know what service I need and I'm ready to book an appointment.");
      } else if (type === 'emergency') {
        chatStore.sendMessage("I need emergency dental care as soon as possible.");
      } else {
        chatStore.sendMessage("I'd like to learn more about your services.");
      }
    }, 300);
  };

  // Don't show on mobile when chat is open
  if (isMobile && isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: { xs: 'auto', md: 80 },
        bottom: { xs: 0, md: 'auto' },
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: { xs: '1px solid', md: 'none' },
        borderBottom: { xs: 'none', md: '1px solid' },
        borderColor: 'divider',
        py: 1.5,
        boxShadow: { 
          xs: '0 -4px 20px rgba(0, 0, 0, 0.08)', 
          md: '0 4px 20px rgba(0, 0, 0, 0.08)' 
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 2 },
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<PrecisionIcon />}
              onClick={() => handleGatewayClick('precision')}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: '#7c3aed',
                color: '#7c3aed',
                borderRadius: 2,
                minWidth: { xs: 'auto', sm: 140 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1.5, sm: 2 },
                '&:hover': {
                  borderColor: '#7c3aed',
                  bgcolor: 'rgba(124, 58, 237, 0.04)',
                },
              }}
            >
              {!isMobile && 'I Know'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<ChatIcon />}
              onClick={() => handleGatewayClick('chat')}
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                bgcolor: '#0891b2',
                borderRadius: 2,
                minWidth: { xs: 'auto', sm: 140 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1.5, sm: 2 },
                boxShadow: '0 2px 10px rgba(8, 145, 178, 0.3)',
                '&:hover': {
                  bgcolor: '#0e7490',
                  boxShadow: '0 4px 20px rgba(8, 145, 178, 0.4)',
                },
              }}
            >
              {!isMobile && 'Chat'}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<EmergencyIcon />}
              onClick={() => handleGatewayClick('emergency')}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: '#dc2626',
                color: '#dc2626',
                borderRadius: 2,
                minWidth: { xs: 'auto', sm: 140 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                px: { xs: 1.5, sm: 2 },
                '&:hover': {
                  borderColor: '#dc2626',
                  bgcolor: 'rgba(220, 38, 38, 0.04)',
                },
              }}
            >
              {!isMobile && 'Emergency'}
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};