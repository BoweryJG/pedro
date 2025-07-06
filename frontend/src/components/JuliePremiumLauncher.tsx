import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Message as MessageIcon,
  Close as CloseIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../chatbot/store/chatStore';

export const JuliePremiumLauncher: React.FC = React.memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  const [isHovered, setIsHovered] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    // Stop pulsing after first interaction
    if (chatStore.isOpen) {
      setShowPulse(false);
    }
  }, [chatStore.isOpen]);

  const handleClick = () => {
    chatStore.toggleChat();
  };

  if (chatStore.isOpen) {
    return null; // Hide launcher when chat is open
  }

  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 24 : 40,
          right: isMobile ? 24 : 40,
          zIndex: 1300,
        }}
      >
        {/* Pulsating ring effect */}
        {showPulse && (
          <>
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pointerEvents: 'none',
              }}
            />
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.3, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                pointerEvents: 'none',
              }}
            />
          </>
        )}

        {/* Main launcher button */}
        <Box
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onClick={handleClick}
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: isHovered ? 3 : 2.5,
            py: 2,
            border: 'none',
            borderRadius: isHovered ? 30 : 40,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            cursor: 'pointer',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            },
          }}
        >
          {/* Sparkle effects */}
          <Box
            component={motion.div}
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Avatar */}
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Typography fontSize="1.8rem">👩‍⚕️</Typography>
          </Avatar>

          {/* Text content */}
          <AnimatePresence>
            {(isHovered || !isMobile) && (
              <Box
                component={motion.div}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                sx={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}
              >
                <Box sx={{ pr: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      fontFamily: 'Montserrat, sans-serif',
                      letterSpacing: '0.5px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Chat with Julie
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <SparkleIcon sx={{ fontSize: 12 }} />
                    EP3 Certified Care Coordinator
                  </Typography>
                </Box>
              </Box>
            )}
          </AnimatePresence>

          {/* Message icon for mobile */}
          {isMobile && !isHovered && (
            <MessageIcon sx={{ color: 'white', fontSize: 24, position: 'relative', zIndex: 1 }} />
          )}
        </Box>

        {/* Online indicator */}
        <Box
          component={motion.div}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          sx={{
            position: 'absolute',
            bottom: 5,
            right: 5,
            width: 16,
            height: 16,
            bgcolor: '#4caf50',
            borderRadius: '50%',
            border: '3px solid white',
            boxShadow: '0 0 10px rgba(76, 175, 80, 0.6)',
          }}
        />
      </Box>
    </AnimatePresence>
  );
});