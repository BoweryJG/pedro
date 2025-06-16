import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Fab, 
  Badge,
  Typography,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  AutoAwesome as SparkleIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@mui/material/styles';

// Pulse animation
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(33, 150, 243, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(33, 150, 243, 0);
  }
`;

// Floating animation
const floating = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// Sparkle rotation
const sparkleRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface ChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const ChatbotLauncher: React.FC<ChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle,
  unreadCount = 0
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show tooltip after 5 seconds if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setShowTooltip(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  // Hide tooltip after 10 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);
    onToggle();
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          {/* Welcome Message Bubble */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 80,
                    right: 0,
                    bgcolor: 'white',
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: 280,
                    maxWidth: 320,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      right: 30,
                      width: 0,
                      height: 0,
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid white',
                    }
                  }}
                >
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem'
                      }}
                    >
                      👋
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Hi! I'm Sophie 🦷
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Need help with dental implants, jaw pain, or facial treatments? 
                        I'm here to answer your questions!
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block',
                          mt: 1,
                          color: 'primary.main',
                          fontWeight: 'medium'
                        }}
                      >
                        Click to chat with me →
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Launcher Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tooltip 
              title="Chat with Sophie - Your Smile Consultant" 
              placement="left"
              arrow
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    right: 8,
                    top: 8,
                  }
                }}
              >
                <Fab
                  size="large"
                  onClick={handleClick}
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
                    boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
                    animation: `${pulse} 2s infinite, ${floating} 3s ease-in-out infinite`,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1976D2 0%, #0097A7 100%)',
                      boxShadow: '0 6px 25px rgba(33, 150, 243, 0.6)',
                    },
                    '&:active': {
                      boxShadow: '0 2px 10px rgba(33, 150, 243, 0.4)',
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 28, color: 'white' }} />
                    
                    {/* Sparkle Effects */}
                    <SparkleIcon 
                      sx={{ 
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        fontSize: 16,
                        color: '#FFD700',
                        animation: `${sparkleRotate} 3s linear infinite`,
                      }} 
                    />
                    <SparkleIcon 
                      sx={{ 
                        position: 'absolute',
                        bottom: -6,
                        left: -6,
                        fontSize: 12,
                        color: '#FFD700',
                        animation: `${sparkleRotate} 2s linear infinite reverse`,
                      }} 
                    />
                  </Box>
                </Fab>
              </Badge>
            </Tooltip>
          </motion.div>

          {/* "New" Label */}
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -5,
                  bgcolor: '#4CAF50',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                  animation: `${floating} 2s ease-in-out infinite`,
                }}
              >
                NEW
              </Box>
            </motion.div>
          )}
        </Box>
      )}
    </AnimatePresence>
  );
};