import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Chip,
  CircularProgress,
  Fade,
  Slide,
  Avatar,
  Divider,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AutoAwesome as SparkleIcon,
  LocalOffer as OfferIcon,
  ArrowBack as ArrowBackIcon,
  Psychology as AIIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../store/chatStore';
import { FinancingWidget } from './FinancingWidget';

// Premium typing indicator
const TypingIndicator: React.FC = () => (
  <Box display="flex" alignItems="center" gap={1}>
    <Avatar 
      sx={{ 
        width: 40,
        height: 40,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
      }}
    >
      <Typography fontSize="1.4rem">👩‍⚕️</Typography>
    </Avatar>
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box display="flex" gap={0.5}>
        {[0, 0.2, 0.4].map((delay, index) => (
          <motion.div
            key={index}
            animate={{ 
              y: [0, -8, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              delay,
              ease: "easeInOut",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            />
          </motion.div>
        ))}
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
        Julie is typing...
      </Typography>
    </Box>
  </Box>
);

// Online status indicator
const OnlineStatus: React.FC = () => (
  <Box display="flex" alignItems="center" gap={0.5}>
    <Box
      component={motion.div}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      sx={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: '#4caf50',
        boxShadow: '0 0 10px rgba(76, 175, 80, 0.6)',
      }}
    />
    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
      Available 24/7
    </Typography>
  </Box>
);

interface PremiumChatbotProps {
  onClose?: () => void;
}

export const PremiumChatbot: React.FC<PremiumChatbotProps> = React.memo(({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const {
    isOpen,
    isLoading,
    messages,
    bookingIntent,
    suggestedResponses,
    showFinancingWidget,
    financingProcedure,
    toggleChat,
    sendMessage,
    setShowFinancingWidget
  } = useChatStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (onClose) {
          onClose();
        } else {
          toggleChat();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose, toggleChat]);
  
  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const message = input.trim();
      setInput('');
      await sendMessage(message);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleSuggestedResponse = (response: string) => {
    setInput(response);
    inputRef.current?.focus();
  };
  
  return (
    <>
      {/* Mobile Backdrop with blur */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose ? onClose() : toggleChat()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>
      
      {/* Premium Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
              position: 'fixed',
              bottom: { xs: 0, sm: 24 },
              right: { xs: 0, sm: 24 },
              left: { xs: 0, sm: 'auto' },
              width: { xs: '100vw', sm: 440 },
              height: { xs: '100vh', sm: 680 },
              maxHeight: { xs: '100vh', sm: '85vh' },
              zIndex: 1001,
              borderRadius: { xs: 0, sm: 3 },
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Gradient border effect */}
            <Box
              sx={{
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                bottom: -1,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f857a6 100%)',
                borderRadius: { xs: 0, sm: 3 },
                zIndex: -1,
                opacity: 0.8,
              }}
            />
            
            {/* Main container */}
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: { xs: 0, sm: '12px' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Premium Header */}
              <Box
                sx={{
                  p: 2.5,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated background pattern */}
                <Box
                  component={motion.div}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.1,
                    backgroundImage: `radial-gradient(circle at 20% 80%, white 0%, transparent 50%),
                                      radial-gradient(circle at 80% 20%, white 0%, transparent 50%)`,
                    backgroundSize: '100% 100%',
                  }}
                />
                
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={2}>
                      {isMobile && (
                        <Tooltip title="Close chat" arrow>
                          <IconButton
                            onClick={() => onClose ? onClose() : toggleChat()}
                            sx={{ 
                              color: 'white',
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              p: 1,
                              '&:hover': { 
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                transform: 'scale(1.1)',
                              },
                            }}
                          >
                            <CloseIcon sx={{ fontSize: 24 }} />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Avatar 
                        sx={{ 
                          width: 56,
                          height: 56,
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                          border: '3px solid rgba(255, 255, 255, 0.3)',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography fontSize="2rem">👩‍⚕️</Typography>
                      </Avatar>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography 
                            variant="h5" 
                            fontWeight="bold"
                            sx={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            Julie
                          </Typography>
                          <AIIcon sx={{ fontSize: 20, color: '#FFD700' }} />
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.9,
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          Premium Care Coordinator
                        </Typography>
                        <OnlineStatus />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="Press ESC to close"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontSize: '0.75rem',
                          display: { xs: 'none', md: 'flex' },
                        }}
                      />
                      <Tooltip title="Close chat (ESC)" arrow>
                        <IconButton 
                          onClick={() => onClose ? onClose() : toggleChat()} 
                          sx={{ 
                            color: 'white',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            '&:hover': { 
                              bgcolor: 'rgba(255, 255, 255, 0.3)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 28 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* Journey Progress Indicator */}
              <Box 
                sx={{ 
                  px: 3, 
                  py: 2, 
                  background: 'linear-gradient(to bottom, rgba(245, 245, 245, 0.8), rgba(255, 255, 255, 0.8))',
                  backdropFilter: 'blur(10px)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Consultation Progress
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {bookingIntent}% Complete
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={bookingIntent} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: bookingIntent > 80 
                          ? 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                          : bookingIntent > 50
                          ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                      }
                    }}
                  />
                  {bookingIntent > 60 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{
                        position: 'absolute',
                        right: -5,
                        top: -5,
                      }}
                    >
                      <SparkleIcon sx={{ fontSize: 18, color: '#FFD700' }} />
                    </motion.div>
                  )}
                </Box>
              </Box>
              
              {/* Messages Area */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflow: 'auto',
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                  '&::-webkit-scrollbar': {
                    width: 6,
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(102, 126, 234, 0.3)',
                    borderRadius: 3,
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.5)',
                    },
                  },
                }}
              >
                {showFinancingWidget && financingProcedure ? (
                  <FinancingWidget
                    procedureType={financingProcedure}
                    procedureCost={
                      financingProcedure === 'yomi' ? 5000 :
                      financingProcedure === 'tmj' ? 2500 :
                      3200
                    }
                    onComplete={() => {
                      setShowFinancingWidget(false);
                      sendMessage('I completed the financing/insurance check');
                    }}
                  />
                ) : (
                  <>
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: message.role === 'user' ? 'primary.main' : 'transparent',
                                background: message.role === 'assistant' 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : undefined,
                                border: message.role === 'assistant' ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
                                boxShadow: message.role === 'assistant' 
                                  ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                              }}
                            >
                              {message.role === 'user' ? (
                                <PersonIcon sx={{ fontSize: 22 }} />
                              ) : (
                                <Typography fontSize="1.4rem">👩‍⚕️</Typography>
                              )}
                            </Avatar>
                            <Box
                              sx={{
                                maxWidth: '75%',
                                p: 2.5,
                                background: message.role === 'user' 
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: message.role === 'user'
                                  ? 'transparent'
                                  : 'rgba(0, 0, 0, 0.08)',
                                borderRadius: 3,
                                color: message.role === 'user' ? 'white' : 'text.primary',
                                boxShadow: message.role === 'user'
                                  ? '0 4px 20px rgba(102, 126, 234, 0.3)'
                                  : '0 2px 10px rgba(0, 0, 0, 0.05)',
                                position: 'relative',
                                '& p': {
                                  fontSize: '0.95rem',
                                  lineHeight: 1.6,
                                  fontFamily: 'Inter, sans-serif',
                                },
                                '& a': {
                                  color: message.role === 'user' ? 'white' : 'primary.main',
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                              </ReactMarkdown>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && <TypingIndicator />}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </Box>
              
              {/* Suggested Responses */}
              <AnimatePresence>
                {suggestedResponses.length > 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Box 
                      sx={{ 
                        px: 3, 
                        pb: 2,
                        background: 'linear-gradient(to top, rgba(245, 245, 245, 0.8), rgba(255, 255, 255, 0.8))',
                      }}
                    >
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          mb: 1.5,
                          fontWeight: 600,
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Suggested Questions
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {suggestedResponses.map((response, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Chip
                              label={response}
                              onClick={() => handleSuggestedResponse(response)}
                              icon={<SparkleIcon />}
                              sx={{
                                cursor: 'pointer',
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                fontWeight: 500,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white',
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                  '& .MuiChip-icon': {
                                    color: 'white',
                                  },
                                },
                              }}
                            />
                          </motion.div>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Premium Input Area */}
              <Box 
                sx={{ 
                  p: 2.5,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-end',
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask Julie anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  inputRef={inputRef}
                  multiline
                  maxRows={3}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      fontSize: { xs: 16, sm: 15 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'rgba(102, 126, 234, 0.5)',
                      },
                      '&.Mui-focused': {
                        borderColor: 'primary.main',
                        boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
                      },
                      '& fieldset': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      },
                    },
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      width: 48,
                      height: 48,
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.1)',
                        color: 'rgba(0, 0, 0, 0.3)',
                      },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </motion.div>
              </Box>
            </Box>
          </Box>
        )}
      </AnimatePresence>
    </>
  );
});

export default PremiumChatbot;