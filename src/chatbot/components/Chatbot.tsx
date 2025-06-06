import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  IconButton, 
  Fab,
  Chip,
  CircularProgress,
  Fade,
  Slide,
  Avatar,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '../store/chatStore';

export const Chatbot: React.FC = () => {
  const {
    isOpen,
    isLoading,
    messages,
    currentStage,
    bookingIntent,
    suggestedResponses,
    toggleChat,
    sendMessage
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
  
  const getStageColor = () => {
    const colors = {
      greeting: '#4CAF50',
      discovery: '#2196F3',
      education: '#FF9800',
      'objection-handling': '#F44336',
      'social-proof': '#9C27B0',
      commitment: '#3F51B5',
      booking: '#4CAF50'
    };
    return colors[currentStage] || '#2196F3';
  };
  
  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Fab
              color="primary"
              size="large"
              onClick={toggleChat}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <ChatIcon />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat Window */}
      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: '90vw', sm: 400 },
            height: { xs: '80vh', sm: 600 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1001,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: `linear-gradient(45deg, ${getStageColor()} 30%, #21CBF3 90%)`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">Sophie</Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Your Smile Consultant
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={toggleChat} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Stage Indicator */}
          <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)} Stage
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Booking Intent: {bookingIntent}%
              </Typography>
            </Box>
          </Box>
          
          {/* Messages */}
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
                      bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32
                    }}
                  >
                    {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
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
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <BotIcon />
                </Avatar>
                <Box display="flex" gap={0.5}>
                  <CircularProgress size={8} />
                  <CircularProgress size={8} />
                  <CircularProgress size={8} />
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          {/* Suggested Responses */}
          {suggestedResponses.length > 0 && !isLoading && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Box display="flex" gap={1} flexWrap="wrap">
                {suggestedResponses.map((response, index) => (
                  <Chip
                    key={index}
                    label={response}
                    onClick={() => handleSuggestedResponse(response)}
                    variant="outlined"
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
          
          <Divider />
          
          {/* Input */}
          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
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
                  borderRadius: 3
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