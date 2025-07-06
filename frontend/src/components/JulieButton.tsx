import React from 'react';
import {
  Button,
  ButtonProps,
  useTheme,
  alpha,
  Box,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Chat as ChatIcon,
  AutoAwesome as AIIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useChatStore } from '../chatbot/store/chatStore';

interface JulieButtonProps extends Omit<ButtonProps, 'onClick'> {
  mode: 'voice' | 'chat';
  showIcon?: boolean;
  showCertificationBadge?: boolean;
}

export const JulieButton: React.FC<JulieButtonProps> = ({
  mode,
  variant = 'contained',
  size = 'large',
  showIcon = true,
  showCertificationBadge = false,
  children = mode === 'voice' ? 'Talk to Julie' : 'Chat with Julie',
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const chatStore = useChatStore();
  const [isVoiceActive, setIsVoiceActive] = React.useState(false);

  const handleClick = () => {
    if (mode === 'chat') {
      if (!chatStore.isOpen) {
        chatStore.toggleChat();
      }
    } else {
      // Voice mode - trigger VoiceCallButton
      // Find and click the VoiceCallButton
      const voiceButton = document.querySelector('[data-voice-call-button]');
      if (voiceButton) {
        (voiceButton as HTMLElement).click();
      } else {
        // If VoiceCallButton not found, set flag to show it
        setIsVoiceActive(true);
      }
    }
  };

  const icon = mode === 'voice' ? <PhoneIcon /> : <ChatIcon />;

  const buttonStyles = {
    position: 'relative' as const,
    overflow: 'hidden',
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'none' as const,
    borderRadius: 2,
    px: 4,
    py: 1.5,
    
    // Premium gradient background
    background: variant === 'contained' 
      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
      : 'transparent',
    
    // Premium border
    border: variant === 'outlined' 
      ? `2px solid ${alpha(theme.palette.primary.main, 0.5)}`
      : 'none',
    
    // Shadows
    boxShadow: variant === 'contained'
      ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.3)}`
      : 'none',
    
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: variant === 'contained'
        ? `0 8px 30px ${alpha(theme.palette.primary.main, 0.4)}`
        : `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
      
      background: variant === 'contained'
        ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
        : alpha(theme.palette.primary.main, 0.05),
      
      border: variant === 'outlined'
        ? `2px solid ${theme.palette.primary.main}`
        : 'none',
    },
    
    '&:active': {
      transform: 'translateY(0)',
    },
    
    // Shimmer effect
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, 
        transparent 0%, 
        ${alpha('#fff', 0.2)} 50%, 
        transparent 100%
      )`,
      transition: 'left 0.5s ease',
    },
    
    '&:hover::before': {
      left: '100%',
    },
    
    ...sx,
  };

  return (
    <>
      <Button
        component={motion.button}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        variant={variant}
        size={size}
        onClick={handleClick}
        startIcon={showIcon ? icon : undefined}
        sx={buttonStyles}
        {...props}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {children}
          {showCertificationBadge && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                ml: 1,
                px: 1,
                py: 0.25,
                borderRadius: 1,
                bgcolor: alpha('#fff', 0.2),
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              <AIIcon sx={{ fontSize: '0.875rem' }} />
              EP3
            </Box>
          )}
        </Box>
      </Button>
      
      {/* Trigger VoiceCallButton if needed */}
      {isVoiceActive && mode === 'voice' && (
        <Box sx={{ display: 'none' }}>
          <button
            ref={(el) => {
              if (el) {
                setTimeout(() => {
                  el.click();
                  setIsVoiceActive(false);
                }, 100);
              }
            }}
            onClick={() => {
              const event = new CustomEvent('julie-voice-call');
              window.dispatchEvent(event);
            }}
          />
        </Box>
      )}
    </>
  );
};