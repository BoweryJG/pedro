import React from 'react';
import { Box, Fab } from '@mui/material';
import { SmartToy as ChatIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SimpleChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SimpleChatbotLauncher: React.FC<SimpleChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.3 
      }}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <Fab
        onClick={onToggle}
        sx={{
          width: 64,
          height: 64,
          background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
          boxShadow: '0 4px 20px rgba(129, 140, 248, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 24px rgba(129, 140, 248, 0.4)',
          },
        }}
      >
        <ChatIcon sx={{ fontSize: 28, color: 'white' }} />
      </Fab>
      
      {/* Simple status dot */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 4,
          right: 4,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#10b981',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      />
    </motion.div>
  );
};