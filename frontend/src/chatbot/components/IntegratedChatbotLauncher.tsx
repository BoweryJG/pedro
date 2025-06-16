import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface IntegratedChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const IntegratedChatbotLauncher: React.FC<IntegratedChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setShowWelcome(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
      }}
    >
      {/* Floating Welcome Messages - Aligned with launcher */}
      <AnimatePresence>
        {showWelcome && !hovering && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 1.5,
                mr: 1,
              }}
            >
              {/* Message bubbles */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    borderRadius: '18px 18px 4px 18px',
                    px: 2.5,
                    py: 1.5,
                    maxWidth: 220,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#374151',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                    }}
                  >
                    Hi! Need help with dental care? 👋
                  </Typography>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '18px 18px 4px 18px',
                    px: 2.5,
                    py: 1.5,
                    maxWidth: 200,
                    boxShadow: '0 2px 12px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Ask me about our services ✨
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Launcher Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3 
        }}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
      >
        <Box
          onClick={onToggle}
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'visible',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(102, 126, 234, 0.3)',
            
            // Hover effects
            '&:hover': {
              transform: 'translateY(-3px) scale(1.05)',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              '& .inner-icon': {
                transform: 'rotate(90deg) scale(1.1)',
              },
              '& .orbit-dot': {
                opacity: 1,
              }
            },
            
            // Active state
            '&:active': {
              transform: 'translateY(-1px) scale(0.98)',
            },
            
            // Subtle glow ring
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -3,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: 0.3,
              filter: 'blur(8px)',
              animation: 'breathe 3s ease-in-out infinite',
            },
            
            '@keyframes breathe': {
              '0%, 100%': {
                transform: 'scale(1)',
                opacity: 0.3,
              },
              '50%': {
                transform: 'scale(1.1)',
                opacity: 0.5,
              },
            },
          }}
        >
          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              className="orbit-dot"
              sx={{
                position: 'absolute',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: 'white',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                animation: hovering ? `orbit 2s linear infinite ${i * 0.33}s` : 'none',
                '@keyframes orbit': {
                  from: {
                    transform: `rotate(${i * 120}deg) translateX(25px) rotate(-${i * 120}deg)`,
                  },
                  to: {
                    transform: `rotate(${i * 120 + 360}deg) translateX(25px) rotate(-${i * 120 + 360}deg)`,
                  },
                },
              }}
            />
          ))}
          
          {/* Modern chat icon */}
          <Box
            className="inner-icon"
            sx={{
              width: 28,
              height: 28,
              position: 'relative',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Custom chat bubble */}
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
                  transform: 'scale(0.9)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  right: 2,
                  width: 8,
                  height: 8,
                  background: 'white',
                  borderRadius: '0 0 50% 0',
                  transform: 'rotate(45deg)',
                },
              }}
            />
            {/* Dots */}
            <Box
              sx={{
                position: 'absolute',
                display: 'flex',
                gap: 0.5,
                zIndex: 1,
              }}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#667eea',
                    animation: hovering ? `bounce 1.4s ease-in-out infinite ${i * 0.16}s` : 'none',
                    '@keyframes bounce': {
                      '0%, 60%, 100%': {
                        transform: 'translateY(0)',
                      },
                      '30%': {
                        transform: 'translateY(-4px)',
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          
          {/* Notification dot */}
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid white',
              animation: 'pulse-dot 2s ease-in-out infinite',
              '@keyframes pulse-dot': {
                '0%, 100%': {
                  transform: 'scale(1)',
                },
                '50%': {
                  transform: 'scale(1.2)',
                },
              },
            }}
          />
        </Box>
      </motion.div>
    </Box>
  );
};