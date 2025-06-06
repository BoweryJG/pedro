import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface MinimalChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const MinimalChatbotLauncher: React.FC<MinimalChatbotLauncherProps> = ({ 
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
        bottom: 28,
        right: 28,
        zIndex: 1000,
      }}
    >
      <Box
        onClick={onToggle}
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
          
          // Hover state
          '&:hover': {
            transform: 'translateY(-2px) scale(1.05)',
            boxShadow: '0 6px 30px rgba(102, 126, 234, 0.35)',
            '& .chat-icon': {
              transform: 'scale(1.1)',
            },
            '& .dot': {
              animationPlayState: 'running',
            }
          },
          
          // Active state
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          },
          
          // Subtle breathing glow
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.4,
            filter: 'blur(10px)',
            animation: 'glow 3s ease-in-out infinite',
          },
          
          '@keyframes glow': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 0.4,
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 0.6,
            },
          },
        }}
      >
        {/* Clean chat icon */}
        <Box
          className="chat-icon"
          sx={{
            width: 28,
            height: 28,
            position: 'relative',
            transition: 'transform 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Message bubble shape */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'white',
                borderRadius: '50%',
                transform: 'scale(0.85)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -1,
                right: 3,
                width: 6,
                height: 6,
                background: 'white',
                borderRadius: '0 0 50% 0',
                transform: 'rotate(45deg) scale(0.85)',
              },
            }}
          />
          
          {/* Three dots */}
          <Box
            sx={{
              position: 'absolute',
              display: 'flex',
              gap: 0.4,
              zIndex: 1,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                className="dot"
                sx={{
                  width: 3.5,
                  height: 3.5,
                  borderRadius: '50%',
                  background: '#667eea',
                  animationPlayState: 'paused',
                  animation: `blink 1.4s ease-in-out infinite ${i * 0.2}s`,
                  '@keyframes blink': {
                    '0%, 60%, 100%': {
                      opacity: 1,
                    },
                    '30%': {
                      opacity: 0.3,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Box>
        
        {/* Small notification indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid white',
          }}
        />
      </Box>
    </motion.div>
  );
};