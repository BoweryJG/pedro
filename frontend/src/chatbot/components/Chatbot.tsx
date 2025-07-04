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
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  AutoAwesome as SparkleIcon,
  LocalOffer as OfferIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../store/chatStore';
import { FinancingWidget } from './FinancingWidget';
import axios from 'axios';

// Mini status indicator component
const StatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
        await axios.get(`${apiUrl}/health`, { timeout: 5000 });
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Tooltip title={isConnected ? "All systems operational" : "Limited connectivity - Some features may be unavailable"}>
      <Box 
        component="span" 
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: isConnected ? '#4CAF50' : '#ff9800',
          display: 'inline-block',
          animation: 'pulse 2s infinite',
          cursor: 'help'
        }}
      />
    </Tooltip>
  );
};

interface ChatbotProps {
  onClose?: () => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
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
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <Box
          onClick={() => {
            if (onClose) {
              onClose();
            } else {
              toggleChat();
            }
          }}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
      )}
      
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: { xs: 0, sm: 24 },
            right: { xs: 0, sm: 24 },
            left: { xs: 0, sm: 'auto' },
            width: { xs: '100vw', sm: 400 },
            height: { xs: '92vh', sm: 600 },
            maxHeight: { xs: '92vh', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden'
          }}
        >
          {/* Mobile Header with Back Button */}
          {isMobile && (
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <IconButton
                onClick={() => {
                  if (onClose) {
                    onClose();
                  } else {
                    toggleChat();
                  }
                }}
                sx={{ p: 0 }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Chat with Julie
              </Typography>
              <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                <Typography fontSize="1.2rem">👩‍⚕️</Typography>
              </Avatar>
            </Box>
          )}
          
          {/* Desktop Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 48,
                  height: 48,
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
              >
                <Typography fontSize="1.8rem">👩‍⚕️</Typography>
              </Avatar>
              <Box>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Typography variant="h6" fontWeight="bold">
                    Julie
                  </Typography>
                  <SparkleIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                </Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.9,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <StatusIndicator />
                  Active Now • Your Personal Dental Care Assistant
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  toggleChat();
                }
              }} 
              sx={{ 
                color: 'white',
                width: { xs: 44, sm: 40 },
                height: { xs: 44, sm: 40 },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                },
                '&:active': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  transform: 'scale(0.95)'
                }
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: 28, sm: 24 } }} />
            </IconButton>
          </Box>
          
          {/* Enhanced Stage Indicator */}
          <Box sx={{ px: 2, py: 1.5, bgcolor: 'grey.50' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  Journey Progress
                </Typography>
                {bookingIntent > 60 && (
                  <OfferIcon sx={{ fontSize: 14, color: '#4CAF50' }} />
                )}
              </Box>
              <Typography variant="caption" color="primary" fontWeight="bold">
                {bookingIntent}% Ready to Book
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={bookingIntent} 
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: bookingIntent > 80 
                    ? 'linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%)'
                    : bookingIntent > 50
                    ? 'linear-gradient(90deg, #2196F3 0%, #03A9F4 100%)'
                    : 'linear-gradient(90deg, #9C27B0 0%, #E91E63 100%)',
                }
              }}
            />
          </Box>
          
          {/* Messages or Financing Widget */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
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
                onComplete={(_result) => {
                  setShowFinancingWidget(false);
                  sendMessage('I completed the financing/insurance check');
                }}
              />
            ) : (
              <>
            {messages.map((message) => (
              <Fade in key={message.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                    gap: 1
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                      width: 36,
                      height: 36,
                      border: message.role === 'assistant' ? '2px solid #e0e0e0' : 'none'
                    }}
                  >
                    {message.role === 'user' ? (
                      <PersonIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <Typography fontSize="1.2rem">👩‍⚕️</Typography>
                    )}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 8,
                        [message.role === 'user' ? 'right' : 'left']: -6,
                        width: 0,
                        height: 0,
                        borderStyle: 'solid',
                        borderWidth: '6px 6px 6px 0',
                        borderColor: `transparent ${
                          message.role === 'user' ? '#42a5f5' : '#f5f5f5'
                        } transparent transparent`,
                        transform: message.role === 'user' ? 'rotate(180deg)' : 'none'
                      }
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </Paper>
                </Box>
              </Fade>
            ))}
            
            {isLoading && (
              <Box display="flex" gap={1} alignItems="center">
                <Avatar 
                  sx={{ 
                    bgcolor: 'white',
                    width: 36,
                    height: 36,
                    border: '2px solid #e0e0e0'
                  }}
                >
                  <Typography fontSize="1.2rem">👩‍⚕️</Typography>
                </Avatar>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box display="flex" gap={0.5}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    >
                      <CircularProgress size={8} sx={{ color: 'primary.main' }} />
                    </motion.div>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontStyle="italic">
                    Julie is thinking...
                  </Typography>
                </Paper>
              </Box>
            )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Enhanced Suggested Responses */}
          {suggestedResponses.length > 0 && !isLoading && (
            <Box sx={{ px: 2, pb: 2, bgcolor: 'grey.50' }}>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ display: 'block', mb: 1 }}
              >
                Quick responses:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {suggestedResponses.map((response, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Chip
                      label={response}
                      onClick={() => handleSuggestedResponse(response)}
                      icon={
                        response.toLowerCase().includes('appointment') || 
                        response.toLowerCase().includes('book') 
                          ? <OfferIcon /> 
                          : <SparkleIcon />
                      }
                      sx={{
                        cursor: 'pointer',
                        borderColor: 'primary.light',
                        bgcolor: 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderColor: 'primary.main',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}
          
          <Divider />
          
          {/* Input - Mobile optimized */}
          <Box sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            display: 'flex', 
            gap: 1,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            // Safe area for iPhone notch/home indicator
            pb: { xs: 'env(safe-area-inset-bottom, 16px)', sm: 2 }
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
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
                  fontSize: { xs: 16, sm: 14 }, // Prevents zoom on iOS
                  '& textarea': {
                    fontSize: { xs: 16, sm: 14 }, // Prevents zoom on iOS
                  }
                }
              }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                minWidth: { xs: 48, sm: 40 },
                minHeight: { xs: 48, sm: 40 },
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                '&:disabled': {
                  bgcolor: 'grey.300'
                }
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default Chatbot;