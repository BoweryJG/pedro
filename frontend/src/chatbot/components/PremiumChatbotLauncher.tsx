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
          width: 64,
          height: 64,
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          
          // Sophisticated glass effect
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: `
            0 8px 32px rgba(102, 126, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.6),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05)
          `,
          
          // Hover state
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: `
              0 12px 40px rgba(102, 126, 234, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.8),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05)
            `,
            '& .chat-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          },
          
          // Active state
          '&:active': {
            transform: 'translateY(-1px)',
            boxShadow: `
              0 4px 20px rgba(102, 126, 234, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.6),
              inset 0 -1px 0 rgba(0, 0, 0, 0.05)
            `,
          },
        }}
      >
        <LuxuryChatIcon 
          className="chat-icon"
          sx={{ 
            fontSize: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.2))',
            transition: 'all 0.3s ease',
          }} 
        />
      </Box>
    </motion.div>
  );
};