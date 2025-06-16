import React from 'react';
import { Box, IconButton } from '@mui/material';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { keyframes } from '@mui/material/styles';

// Subtle breathing animation
const breathe = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 5px 15px rgba(99, 102, 241, 0.2),
      0 0 0 0 rgba(99, 102, 241, 0.1);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 
      0 8px 25px rgba(99, 102, 241, 0.3),
      0 0 0 8px rgba(99, 102, 241, 0.1);
  }
`;

// Elegant ripple effect
const ripple = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
`;

interface ElegantChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ElegantChatbotLauncher: React.FC<ElegantChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  if (isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.3 
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Subtle ripple rings */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              opacity: 0.3,
              animation: `${ripple} 3s ease-out infinite`,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 60,
              height: 60,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              opacity: 0.2,
              animation: `${ripple} 3s ease-out infinite 1s`,
            }}
          />
          
          {/* Main button */}
          <IconButton
            onClick={onToggle}
            sx={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              animation: `${breathe} 4s ease-in-out infinite`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'visible',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                transform: 'translateY(-3px)',
                '&::before': {
                  opacity: 1,
                },
                '& .elegant-icon': {
                  transform: 'rotate(180deg) scale(1.1)',
                }
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -1,
                borderRadius: '50%',
                padding: 1,
                background: 'linear-gradient(135deg, #60a5fa 0%, #c084fc 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          >
            <SparkleIcon 
              className="elegant-icon"
              sx={{ 
                fontSize: 28,
                color: 'white',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }} 
            />
            
            {/* Floating particles */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                '& .particle': {
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  background: 'white',
                  borderRadius: '50%',
                  opacity: 0,
                  '@keyframes float-up': {
                    '0%': {
                      transform: 'translateY(0) translateX(0)',
                      opacity: 0,
                    },
                    '10%': {
                      opacity: 1,
                    },
                    '90%': {
                      opacity: 1,
                    },
                    '100%': {
                      transform: 'translateY(-30px) translateX(10px)',
                      opacity: 0,
                    },
                  },
                },
              }}
            >
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  className="particle"
                  sx={{
                    left: '50%',
                    bottom: '50%',
                    animation: `float-up 2s ease-out infinite ${i * 0.5}s`,
                    marginLeft: `${(i - 1) * 15}px`,
                  }}
                />
              ))}
            </Box>
          </IconButton>
          
          {/* Elegant glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};