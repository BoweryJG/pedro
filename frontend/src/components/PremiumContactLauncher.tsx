import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { VoiceCallButton } from './VoiceCallButton';
import { Chatbot } from '../chatbot/components/Chatbot';
import { useChatStore } from '../chatbot/store/chatStore';

export const PremiumContactLauncher: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  const controls = useAnimation();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'call' | 'text' | null>(null);
  const [isHovering, setIsHovering] = useState<'call' | 'text' | null>(null);

  const handleExpand = () => {
    setIsExpanded(true);
    controls.start({
      width: isMobile ? 240 : 280,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    });
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setIsHovering(null);
    controls.start({
      width: isMobile ? 120 : 140,
      transition: { type: "spring", stiffness: 400, damping: 30 }
    });
  };

  const handleCall = () => {
    setActiveMode('call');
    setIsExpanded(false);
  };

  const handleText = () => {
    setActiveMode('text');
    setIsExpanded(false);
    if (!chatStore.isOpen) {
      chatStore.toggleChat();
    }
  };

  const handleClose = () => {
    setActiveMode(null);
    if (chatStore.isOpen) {
      chatStore.toggleChat();
    }
  };

  // Sync with chat store
  React.useEffect(() => {
    if (chatStore.isOpen && activeMode !== 'text') {
      setActiveMode('text');
    }
  }, [chatStore.isOpen]);

  return (
    <>
      {/* Main Launcher */}
      <AnimatePresence>
        {!activeMode && (
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 24 : 36,
              right: isMobile ? 24 : 36,
              zIndex: 1300,
            }}
          >
            <Box
              component={motion.div}
              animate={controls}
              initial={{ width: isMobile ? 120 : 140 }}
              onClick={!isExpanded ? handleExpand : undefined}
              onMouseLeave={() => isExpanded && handleCollapse()}
              sx={{
                height: isMobile ? 56 : 64,
                background: isExpanded 
                  ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 50,
                boxShadow: isExpanded
                  ? '0 20px 60px rgba(102, 126, 234, 0.6), 0 0 0 1px rgba(102, 126, 234, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
                  : '0 8px 32px rgba(118, 75, 162, 0.4), 0 0 80px rgba(118, 75, 162, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isExpanded ? 'default' : 'pointer',
                overflow: 'hidden',
                position: 'relative',
                '&:hover': !isExpanded ? {
                  transform: 'translateY(-4px) scale(1.05)',
                  boxShadow: '0 12px 40px rgba(118, 75, 162, 0.6), 0 0 120px rgba(118, 75, 162, 0.3)',
                } : {},
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isExpanded 
                    ? 'none'
                    : 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 30%)',
                  pointerEvents: 'none',
                },
              }}
            >
              {!isExpanded ? (
                // Collapsed State
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  px: 3,
                }}>
                  <Box
                    component={motion.div}
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                  >
                    <DotIcon 
                      sx={{ 
                        fontSize: 10, 
                        color: '#4caf50',
                        filter: 'drop-shadow(0 0 6px #4caf50)',
                      }} 
                    />
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight={800}
                    sx={{ 
                      color: '#ffffff',
                      letterSpacing: '1px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      fontSize: isMobile ? '0.9rem' : '1rem',
                    }}
                  >
                    Contact
                  </Typography>
                </Box>
              ) : (
                // Expanded State
                <Box sx={{ 
                  display: 'flex', 
                  width: '100%',
                  height: '100%',
                }}>
                  {/* Call Section */}
                  <Box
                    component={motion.div}
                    whileHover={{ 
                      backgroundColor: 'rgba(102, 126, 234, 0.15)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCall}
                    onMouseEnter={() => setIsHovering('call')}
                    onMouseLeave={() => setIsHovering(null)}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      cursor: 'pointer',
                      position: 'relative',
                      borderRight: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50px 0 0 50px',
                      transition: 'all 0.3s ease',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #667eea, transparent)',
                        transform: isHovering === 'call' ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.3s ease',
                      }
                    }}
                  >
                    <Box
                      component={motion.div}
                      animate={isHovering === 'call' ? { 
                        rotate: [0, -15, 15, -15, 15, 0],
                      } : {}}
                      transition={{ duration: 0.6 }}
                    >
                      <PhoneIcon 
                        sx={{ 
                          fontSize: isMobile ? 26 : 30,
                          color: isHovering === 'call' ? '#667eea' : '#ffffff',
                          transition: 'all 0.3s ease',
                          filter: isHovering === 'call' 
                            ? 'drop-shadow(0 0 12px #667eea)' 
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        }} 
                      />
                    </Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={800}
                      sx={{ 
                        color: isHovering === 'call' ? '#667eea' : '#ffffff',
                        transition: 'all 0.3s ease',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        letterSpacing: '0.5px',
                        textShadow: isHovering === 'call' 
                          ? '0 0 20px rgba(102, 126, 234, 0.5)' 
                          : '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Call
                    </Typography>
                  </Box>

                  {/* Text Section */}
                  <Box
                    component={motion.div}
                    whileHover={{ 
                      backgroundColor: 'rgba(118, 75, 162, 0.15)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleText}
                    onMouseEnter={() => setIsHovering('text')}
                    onMouseLeave={() => setIsHovering(null)}
                    sx={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: '0 50px 50px 0',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #764ba2, transparent)',
                        transform: isHovering === 'text' ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s ease',
                      }
                    }}
                  >
                    <Box
                      component={motion.div}
                      animate={isHovering === 'text' ? { 
                        y: [0, -5, 0],
                        transition: { 
                          repeat: Infinity, 
                          duration: 1,
                          ease: "easeInOut"
                        }
                      } : {}}
                    >
                      <ChatIcon 
                        sx={{ 
                          fontSize: isMobile ? 26 : 30,
                          color: isHovering === 'text' ? '#764ba2' : '#ffffff',
                          transition: 'all 0.3s ease',
                          filter: isHovering === 'text' 
                            ? 'drop-shadow(0 0 12px #764ba2)' 
                            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                        }} 
                      />
                    </Box>
                    <Typography 
                      variant="h6" 
                      fontWeight={800}
                      sx={{ 
                        color: isHovering === 'text' ? '#764ba2' : '#ffffff',
                        transition: 'all 0.3s ease',
                        fontSize: isMobile ? '1rem' : '1.1rem',
                        letterSpacing: '0.5px',
                        textShadow: isHovering === 'text' 
                          ? '0 0 20px rgba(118, 75, 162, 0.5)' 
                          : '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Text
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Animated gradient background */}
              <Box
                component={motion.div}
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 100% 50%, rgba(118, 75, 162, 0.4) 0%, transparent 50%)',
                    'radial-gradient(circle at 0% 50%, rgba(102, 126, 234, 0.4) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  opacity: isExpanded ? 0.6 : 0,
                }}
              />
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Voice Mode */}
      {activeMode === 'call' && (
        <>
          <VoiceCallButton />
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'fixed',
              top: 20,
              right: 20,
              zIndex: 1500,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </>
      )}

      {/* Chat Mode - Chatbot handles its own visibility */}
    </>
  );
};