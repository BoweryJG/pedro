import React, { useState } from 'react';
import {
  Box,
  Fab,
  Badge,
  Tooltip,
  Zoom,
  useTheme,
  Typography,
} from '@mui/material';
import {
  SmartToy as ChatIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Close as CloseIcon,
} from '@mui/icons-material';
import AnimatedGradientBorder from '../../components/effects/AnimatedGradientBorder';

export const EnhancedChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);
  const theme = useTheme();

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Enhanced Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <Zoom in={!isOpen} timeout={300}>
            <Box
              sx={{
                position: 'fixed',
                bottom: { xs: 16, sm: 24 },
                right: { xs: 16, sm: 24 },
                zIndex: theme.zIndex.speedDial,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  {/* Animated glow effect */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -12,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      opacity: 0.3,
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* Rotating border */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      inset: -3,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #10b981)',
                      padding: 3,
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        background: theme.palette.background.default,
                      }}
                    />
                  </motion.div>
                  
                  <Tooltip title="Chat with Julie - EP3 Certified Care Coordinator" placement="left">
                    <Badge
                      color="error"
                      variant="dot"
                      invisible={!hasNewMessage}
                      sx={{
                        '& .MuiBadge-dot': {
                          width: 14,
                          height: 14,
                          border: `2px solid ${theme.palette.background.default}`,
                          boxShadow: '0 2px 12px rgba(239, 68, 68, 0.6)',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                            '50%': {
                              transform: 'scale(1.2)',
                              opacity: 0.8,
                            },
                            '100%': {
                              transform: 'scale(1)',
                              opacity: 1,
                            },
                          },
                        },
                      }}
                    >
                      <Fab
                        onClick={handleOpen}
                        sx={{
                          width: 64,
                          height: 64,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.5)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 12px 40px rgba(59, 130, 246, 0.6)',
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                            animation: 'shimmer 3s infinite',
                          },
                          '@keyframes shimmer': {
                            '0%': { left: '-100%' },
                            '100%': { left: '200%' },
                          },
                        }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                          }}
                        >
                          <ChatIcon sx={{ fontSize: 32, color: 'white' }} />
                        </motion.div>
                      </Fab>
                    </Badge>
                  </Tooltip>
                  
                  {/* Sparkle particles */}
                  <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: [0, Math.cos((i * Math.PI) / 2) * 50],
                          y: [0, Math.sin((i * Math.PI) / 2) * 50],
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.5,
                          repeat: Infinity,
                          ease: 'easeOut',
                        }}
                      >
                        <SparkleIcon
                          sx={{
                            fontSize: 16,
                            color: '#fbbf24',
                            filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.8))',
                          }}
                        />
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Zoom>
        )}
      </AnimatePresence>

      {/* Enhanced Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: theme.zIndex.modal,
              width: '100%',
              maxWidth: 420,
              height: '600px',
              maxHeight: 'calc(100vh - 48px)',
            }}
          >
            <AnimatedGradientBorder
              borderRadius={16}
              borderWidth={3}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']}
              animationDuration={4}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  background: theme.palette.background.paper,
                  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.3)',
                }}
              >
                {/* Gradient overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 100,
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
                
                {/* Chat Interface */}
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ChatIcon sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Care Coordinator
                      </Typography>
                    </Box>
                    <Tooltip title="Close chat">
                      <Box>
                        <Badge
                          color="primary"
                          variant="dot"
                          invisible={true}
                        >
                          <Fab
                            size="small"
                            onClick={handleClose}
                            sx={{
                              bgcolor: 'background.paper',
                              boxShadow: 2,
                              '&:hover': {
                                transform: 'rotate(90deg)',
                                bgcolor: 'background.paper',
                              },
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <CloseIcon />
                          </Fab>
                        </Badge>
                      </Box>
                    </Tooltip>
                  </Box>
                  
                  {/* Messages Area */}
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    <Typography sx={{ textAlign: 'center', color: 'text.secondary', mb: 2 }}>
                      Welcome! How can I help you with your dental care today?
                    </Typography>
                  </Box>
                  
                  {/* Input Area */}
                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary">
                      Ask about our services, schedule appointments, or learn about financing options.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </AnimatedGradientBorder>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};