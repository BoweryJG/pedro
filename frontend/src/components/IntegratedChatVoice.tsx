import React, { useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Zoom,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCallButton } from './VoiceCallButton';
import { ChatWidget } from './ChatWidget';

export const IntegratedChatVoice: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice' | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const handleOpen = (mode: 'chat' | 'voice') => {
    setIsOpen(true);
    setActiveMode(mode);
    if (mode === 'chat') {
      setUnreadMessages(0);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setActiveMode(null);
  };

  return (
    <>
      {/* Unified FAB with options */}
      <AnimatePresence>
        {!isOpen && (
          <Box
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 20 : 24,
              right: isMobile ? 20 : 24,
              zIndex: 1300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            {/* Secondary action - Voice Call */}
            <Tooltip title="Talk to Julie" placement="left" arrow>
              <Fab
                color="secondary"
                size="medium"
                onClick={() => handleOpen('voice')}
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  boxShadow: '0 3px 15px rgba(245, 87, 108, 0.3)',
                  transform: 'scale(0.9)',
                  '&:hover': {
                    transform: 'scale(1)',
                  },
                }}
              >
                <PhoneIcon />
              </Fab>
            </Tooltip>

            {/* Primary action - Chat */}
            <Tooltip title="Chat with Julie" placement="left" arrow>
              <Badge badgeContent={unreadMessages} color="error">
                <Fab
                  color="primary"
                  size="large"
                  onClick={() => handleOpen('chat')}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(118, 75, 162, 0.4)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  <BotIcon sx={{ fontSize: 28 }} />
                </Fab>
              </Badge>
            </Tooltip>

            {/* Label */}
            <Paper
              elevation={3}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 20,
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="caption" fontWeight="bold">
                Talk to Julie
              </Typography>
            </Paper>
          </Box>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      {isOpen && activeMode === 'chat' && (
        <Zoom in={true}>
          <Paper
            elevation={10}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 0 : 24,
              right: isMobile ? 0 : 24,
              width: isMobile ? '100vw' : 380,
              height: isMobile ? '100vh' : 600,
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1400,
              borderRadius: isMobile ? 0 : 3,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BotIcon />
                <Typography variant="h6">Chat with Julie</Typography>
              </Box>
              <Box>
                <Tooltip title="Switch to Voice Call">
                  <IconButton
                    size="small"
                    sx={{ color: 'inherit' }}
                    onClick={() => setActiveMode('voice')}
                  >
                    <PhoneIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{ color: 'inherit' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <ChatWidget onNewMessage={() => setUnreadMessages(prev => prev + 1)} />
            </Box>
          </Paper>
        </Zoom>
      )}

      {/* Voice Interface */}
      {isOpen && activeMode === 'voice' && (
        <Box sx={{ position: 'relative' }}>
          <VoiceCallButton />
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'fixed',
              top: isMobile ? 60 : 80,
              right: 24,
              zIndex: 1500,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'background.paper' },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Tooltip title="Switch to Chat">
            <IconButton
              onClick={() => setActiveMode('chat')}
              sx={{
                position: 'fixed',
                top: isMobile ? 60 : 80,
                right: 80,
                zIndex: 1500,
                bgcolor: 'background.paper',
                boxShadow: 2,
                '&:hover': { bgcolor: 'background.paper' },
              }}
            >
              <ChatIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );
};