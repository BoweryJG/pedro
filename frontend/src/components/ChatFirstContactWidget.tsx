import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Badge, 
  Zoom,
  Paper,
  Typography,
  Button,
  Divider,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import { 
  Chat as ChatIcon, 
  Phone as PhoneIcon,
  Close as CloseIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { keyframes } from '@mui/material/styles';
import { CONTACT_INFO } from '../constants/contact';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

interface ChatFirstContactWidgetProps {
  onChatOpen: () => void;
}

export const ChatFirstContactWidget: React.FC<ChatFirstContactWidgetProps> = ({ onChatOpen }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleChatClick = () => {
    setHasInteracted(true);
    setShowOptions(false);
    onChatOpen();
  };

  const handlePhoneClick = () => {
    setHasInteracted(true);
    window.gtag?.('event', 'phone_click', {
      event_category: 'contact',
      event_label: 'chat_widget_phone',
    });
    window.location.href = CONTACT_INFO.phone.href;
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1400,
      }}
    >
      {showOptions && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            bottom: 80,
            right: 0,
            width: 320,
            p: 3,
            borderRadius: 3,
            animation: `${slideIn} 0.3s ease-out`,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              How can we help?
            </Typography>
            <IconButton size="small" onClick={() => setShowOptions(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ChatIcon />}
              onClick={handleChatClick}
              sx={{
                py: 2,
                background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
                boxShadow: '0 3px 5px 2px rgba(26, 115, 232, .3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px 2px rgba(26, 115, 232, .3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Start Live Chat
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  {CONTACT_INFO.chat.availability}
                </Typography>
              </Box>
            </Button>

            <Alert 
              severity="success" 
              icon={<CheckIcon />}
              sx={{ 
                py: 0.5,
                '& .MuiAlert-message': { fontSize: '0.875rem' }
              }}
            >
              Most patients get answers in under 2 minutes!
            </Alert>

            <Divider sx={{ my: 1 }}>
              <Chip label="or" size="small" />
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<PhoneIcon />}
              onClick={handlePhoneClick}
              sx={{
                py: 1.5,
                borderColor: '#e0e0e0',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#1a73e8',
                  color: '#1a73e8',
                },
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="subtitle2">
                  Call {CONTACT_INFO.phone.display}
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  {CONTACT_INFO.businessHours.weekdays}
                </Typography>
              </Box>
            </Button>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              px: 1,
              py: 0.5,
              bgcolor: 'rgba(0,0,0,0.04)',
              borderRadius: 1,
            }}>
              <TimeIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary">
                {CONTACT_INFO.emergencyNote}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      <Tooltip 
        title={!hasInteracted ? "Chat with us!" : ""} 
        placement="left"
        arrow
      >
        <Badge
          badgeContent={!hasInteracted ? "1" : 0}
          color="error"
          overlap="circular"
          sx={{
            '& .MuiBadge-badge': {
              animation: !hasInteracted ? `${pulse} 2s ease-in-out infinite` : 'none',
            },
          }}
        >
          <IconButton
            onClick={() => setShowOptions(!showOptions)}
            sx={{
              width: 64,
              height: 64,
              bgcolor: '#1a73e8',
              color: 'white',
              boxShadow: '0 4px 12px rgba(26, 115, 232, 0.4)',
              '&:hover': {
                bgcolor: '#1557b0',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
              animation: !hasInteracted ? `${pulse} 2s ease-in-out infinite` : 'none',
            }}
          >
            <ChatIcon fontSize="large" />
          </IconButton>
        </Badge>
      </Tooltip>
    </Box>
  );
};