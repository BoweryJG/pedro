import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { LuxuryChatIcon } from '../../components/icons/LuxuryIcons';

interface PremiumChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const PremiumChatbotLauncher: React.FC<PremiumChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: 0.5 
      }}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          // Subtle shadow
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
          
          // Hover state
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0 6px 30px rgba(102, 126, 234, 0.35)',
            '&::after': {
              transform: 'translate(-50%, -50%) scale(1.5)',
            },
            '& .chat-icon': {
              transform: 'scale(1.1)',
            }
          },
          
          // Active state
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
          
          // Ambient glow
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
            animation: 'pulse 3s ease-in-out infinite',
          },
          
          // Inner light
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 60%)',
            transition: 'transform 0.3s ease',
          },
          
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 0.5,
            },
            '50%': {
              transform: 'scale(1.1)',
              opacity: 0.8,
            },
          },
        }}
      >
        <LuxuryChatIcon 
          className="chat-icon"
          sx={{ 
            fontSize: 28, 
            color: 'white',
            position: 'relative',
            zIndex: 1,
            transition: 'transform 0.3s ease',
          }} 
        />
      </Box>
    </motion.div>
  );
};