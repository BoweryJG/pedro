import { useState, useEffect } from 'react';
import { Fab, Zoom, Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { CONTACT_INFO } from '../constants/contact';
import { trackEvent, trackChatOpen } from '../utils/analytics';
import { useChatStore } from '../chatbot/store/chatStore';

const FloatingAppointmentButton = () => {
  const [showButton, setShowButton] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const chatStore = useChatStore();

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (expanded) {
      trackEvent('floating_button_chat', {
        action: 'book_appointment'
      });
      trackChatOpen('floating_button');
      chatStore.sendMessage("I'd like to book an appointment");
      chatStore.setIsOpen(true);
      setExpanded(false);
    } else {
      trackEvent('floating_button_expand', {
        action: 'expand'
      });
      setExpanded(true);
      setTimeout(() => setExpanded(false), 5000);
    }
  };

  const handleTextJulie = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('floating_button_chat', {
      action: 'text_julie'
    });
    trackChatOpen('floating_button_text');
    chatStore.sendMessage("Hi Julie, I have a question about your services");
    chatStore.setIsOpen(true);
    setExpanded(false);
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      bgcolor: 'white',
                      p: 1,
                      borderRadius: 8,
                      boxShadow: 3,
                    }}
                  >
                    <Fab
                      size="small"
                      color="primary"
                      onClick={handleTextJulie}
                      sx={{ boxShadow: 2 }}
                    >
                      <ChatIcon />
                    </Fab>
                    <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        Text Julie
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            <Zoom in={showButton}>
              <Fab
                color="primary"
                onClick={handleClick}
                sx={{
                  boxShadow: 4,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <CalendarMonthIcon />
              </Fab>
            </Zoom>

            {/* Pulse animation */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: '2px solid',
                borderColor: 'primary.main',
                animation: 'pulse 2s infinite',
                pointerEvents: 'none',
                '@keyframes pulse': {
                  '0%': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%) scale(1)',
                  },
                  '100%': {
                    opacity: 0,
                    transform: 'translate(-50%, -50%) scale(1.5)',
                  },
                },
              }}
            />
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingAppointmentButton;