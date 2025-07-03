import React, { useState } from 'react';
import {
  Box,
  Fab,
  Paper,
  IconButton,
  Tooltip,
  Zoom,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCallButton } from './VoiceCallButton';
import { Chatbot } from '../chatbot/components/Chatbot';
import { useChatStore } from '../chatbot/store/chatStore';

export const UnifiedContactButton: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  
  const [showOptions, setShowOptions] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'voice' | null>(null);

  const handleMainClick = () => {
    setShowOptions(!showOptions);
  };

  const handleChatClick = () => {
    setShowOptions(false);
    setActiveMode('chat');
    chatStore.openChat();
  };

  const handleVoiceClick = () => {
    setShowOptions(false);
    setActiveMode('voice');
  };

  const handleClose = () => {
    setActiveMode(null);
    if (chatStore.isOpen) {
      chatStore.closeChat();
    }
  };

  // If chat is open via chatStore, sync our state
  React.useEffect(() => {
    if (chatStore.isOpen && activeMode !== 'chat') {
      setActiveMode('chat');
    }
  }, [chatStore.isOpen]);

  return (
    <>
      {/* Main FAB - Only show when nothing is active */}
      <AnimatePresence>
        {!activeMode && (
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
            }}
          >
            {/* Options when expanded */}
            <AnimatePresence>
              {showOptions && (
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  sx={{
                    position: 'absolute',
                    bottom: 70,
                    right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'flex-end',
                  }}
                >
                  {/* Voice Option */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="caption">Talk to Julie</Typography>
                    </Paper>
                    <Fab
                      size="small"
                      color="secondary"
                      onClick={handleVoiceClick}
                      sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        boxShadow: '0 2px 10px rgba(245, 87, 108, 0.3)',
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 20 }} />
                    </Fab>
                  </Box>

                  {/* Chat Option */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Paper
                      elevation={2}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 20,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant="caption">Chat with Julie</Typography>
                    </Paper>
                    <Fab
                      size="small"
                      onClick={handleChatClick}
                      sx={{
                        bgcolor: '#667eea',
                        '&:hover': { bgcolor: '#764ba2' },
                        boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <ChatIcon sx={{ fontSize: 20 }} />
                    </Fab>
                  </Box>
                </Box>
              )}
            </AnimatePresence>

            {/* Main Button */}
            <Tooltip title="Contact Julie" placement="left">
              <Fab
                color="primary"
                size={isMobile ? "medium" : "large"}
                onClick={handleMainClick}
                sx={{
                  background: showOptions 
                    ? 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 20px rgba(118, 75, 162, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {showOptions ? (
                  <CloseIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
                ) : (
                  <BotIcon sx={{ fontSize: isMobile ? 24 : 28 }} />
                )}
              </Fab>
            </Tooltip>
          </Box>
        )}
      </AnimatePresence>

      {/* Voice Mode - Use existing VoiceCallButton but with close option */}
      {activeMode === 'voice' && (
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

      {/* Chat Mode - Already handled by Chatbot component */}
      {activeMode === 'chat' && !chatStore.isOpen && (
        <Chatbot />
      )}
    </>
  );
};