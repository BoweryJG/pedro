import React from 'react';
import { 
  Box, 
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  IconButton,
  Typography,
  Fab,
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Phone as PhoneIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { CONTACT_INFO } from '../constants/contact';
import { trackPhoneClick, trackChatOpen, trackContactMethodChoice } from '../utils/analytics';

interface MobileChatOptimizedProps {
  onChatOpen: () => void;
}

export const MobileChatOptimized: React.FC<MobileChatOptimizedProps> = ({ onChatOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showDrawer, setShowDrawer] = React.useState(false);

  const handleChatClick = () => {
    trackChatOpen('mobile_optimized');
    trackContactMethodChoice('chat', 'mobile');
    onChatOpen();
    setShowDrawer(false);
  };

  const handlePhoneClick = () => {
    trackPhoneClick('mobile_optimized');
    trackContactMethodChoice('phone', 'mobile');
    window.location.href = CONTACT_INFO.phone.href;
  };

  if (!isMobile) return null;

  return (
    <>
      {/* Mobile-optimized floating action button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1200,
        }}
      >
        <Fab
          color="primary"
          size="large"
          onClick={() => setShowDrawer(true)}
          sx={{
            background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
            boxShadow: '0 3px 5px 2px rgba(26, 115, 232, .3)',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ChatIcon />
        </Fab>
      </Box>

      {/* Swipeable bottom drawer for mobile */}
      <SwipeableDrawer
        anchor="bottom"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        onOpen={() => setShowDrawer(true)}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            pb: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pt: 1 }}>
          {/* Swipe indicator */}
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: 'grey.300',
              borderRadius: 2,
              mx: 'auto',
              mb: 2,
            }}
          />

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              How can we help you?
            </Typography>
            <IconButton onClick={() => setShowDrawer(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Options with touch-friendly sizing */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
            {/* Chat option - Primary */}
            <Box
              onClick={handleChatClick}
              sx={{
                p: 3,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                '&:active': {
                  transform: 'scale(0.98)',
                },
                transition: 'transform 0.1s',
              }}
            >
              <ChatIcon sx={{ fontSize: 32 }} />
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Start Live Chat
                </Typography>
                <Typography variant="caption">
                  Get instant answers 24/7
                </Typography>
              </Box>
            </Box>

            {/* Phone option - Secondary */}
            <Box
              onClick={handlePhoneClick}
              sx={{
                p: 3,
                bgcolor: 'grey.100',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'grey.300',
                '&:active': {
                  bgcolor: 'grey.200',
                },
              }}
            >
              <PhoneIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box flex={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Call {CONTACT_INFO.phone.display}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {CONTACT_INFO.businessHours.weekdays}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Quick info */}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            align="center" 
            display="block"
            sx={{ mt: 2 }}
          >
            {CONTACT_INFO.emergencyNote}
          </Typography>
        </Box>
      </SwipeableDrawer>
    </>
  );
};