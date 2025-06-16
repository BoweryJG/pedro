import React from 'react';
import { Box, Fab } from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/material/styles';

// Radiating pulse animation
const radiate = keyframes`
  0% {
    box-shadow: 
      0 0 0 0 rgba(33, 150, 243, 0.7),
      0 0 0 0 rgba(33, 150, 243, 0.5),
      0 0 0 0 rgba(33, 150, 243, 0.3);
  }
  100% {
    box-shadow: 
      0 0 0 20px rgba(33, 150, 243, 0),
      0 0 0 40px rgba(33, 150, 243, 0),
      0 0 0 60px rgba(33, 150, 243, 0);
  }
`;

// Glow effect
const glow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(33, 150, 243, 0.6),
      0 0 40px rgba(33, 150, 243, 0.4),
      0 0 60px rgba(33, 150, 243, 0.2);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(33, 150, 243, 0.8),
      0 0 50px rgba(33, 150, 243, 0.6),
      0 0 70px rgba(33, 150, 243, 0.4);
  }
`;

interface SimplifiedChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SimplifiedChatbotLauncher: React.FC<SimplifiedChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  if (isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5 
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 72,
              height: 72,
              borderRadius: '50%',
              animation: `${radiate} 2s ease-out infinite`,
            }
          }}
        >
          <Fab
            size="large"
            onClick={onToggle}
            sx={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              animation: `${glow} 3s ease-in-out infinite`,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                transform: 'translateY(-2px)',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1) rotate(10deg)',
                }
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            }}
          >
            <ChatIcon 
              sx={{ 
                fontSize: 32, 
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                transition: 'transform 0.3s ease',
              }} 
            />
          </Fab>
          
          {/* Inner glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};