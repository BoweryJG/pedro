import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Message as MessageIcon,
  Close as CloseIcon,
  Psychology as BrainIcon,
  LocalHospital as MedicalIcon,
  AutoAwesome as SpecialistIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCallButton } from './VoiceCallButton';
import { useChatStore } from '../chatbot/store/chatStore';

export const JulieProfessionalLauncher: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState<'consultation' | 'message' | null>(null);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);

  const specialties = [
    'Robotic Surgery Specialist',
    'TMJ Treatment Expert',
    'Aesthetic Procedures',
    'Implant Specialist'
  ];

  // Rotate specialties
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConsultation = () => {
    setActiveMode('consultation');
    setIsExpanded(false);
  };

  const handleMessage = () => {
    setActiveMode('message');
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

  // Julie's avatar - using initials for now
  const JulieAvatar = () => (
    <Avatar
      sx={{
        width: 48,
        height: 48,
        bgcolor: 'primary.main',
        background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
        fontSize: '1.2rem',
        fontWeight: 600,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
        border: '2px solid white',
      }}
    >
      EP³
    </Avatar>
  );

  return (
    <>
      {/* Professional Medical Badge Launcher */}
      <AnimatePresence>
        {!activeMode && (
          <Box
            component={motion.div}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            sx={{
              position: 'fixed',
              bottom: isMobile ? 20 : 32,
              right: isMobile ? 20 : 32,
              zIndex: 1300,
            }}
          >
            <Box
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsExpanded(!isExpanded)}
              sx={{
                width: isExpanded ? (isMobile ? 300 : 340) : (isMobile ? 220 : 240),
                bgcolor: 'background.paper',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.18)',
                  borderColor: 'primary.main',
                },
              }}
            >
              {/* Collapsed State - Compact Badge */}
              {!isExpanded ? (
                <Box sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ position: 'relative' }}>
                      <JulieAvatar />
                      <Box
                        component={motion.div}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 16,
                          height: 16,
                          bgcolor: '#4caf50',
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 0 8px rgba(76, 175, 80, 0.6)',
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        fontWeight={700}
                        sx={{ lineHeight: 1.2 }}
                      >
                        Julie
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.7rem',
                          display: 'block',
                        }}
                      >
                        EP³ Certified Medical Assistant
                      </Typography>
                      <Box
                        component={motion.div}
                        key={currentSpecialty}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'primary.main',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        >
                          {specialties[currentSpecialty]}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : (
                // Expanded State - Full Professional Card
                <Box>
                  {/* Header */}
                  <Box 
                    sx={{ 
                      p: 2,
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <JulieAvatar />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                          Julie
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Senior Surgical Consultant
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          Dr. Pedro's Practice
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Credentials & Specialties */}
                  <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      <Chip 
                        icon={<MedicalIcon sx={{ fontSize: 16 }} />}
                        label="EP³ Certified"
                        size="small"
                        sx={{ 
                          height: 24,
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                          fontWeight: 600,
                        }}
                      />
                      <Chip 
                        icon={<SpecialistIcon sx={{ fontSize: 16 }} />}
                        label="10+ Years"
                        size="small"
                        sx={{ 
                          height: 24,
                          fontSize: '0.7rem',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.dark',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      Specializing in:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      <Chip label="Yomi Robotic Surgery" size="small" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
                      <Chip label="TMJ Disorders" size="small" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
                      <Chip label="EMFACE Aesthetics" size="small" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
                      <Chip label="Dental Implants" size="small" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                    <Box
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleConsultation}
                      sx={{
                        flex: 1,
                        p: 1.5,
                        border: 'none',
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        },
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 18 }} />
                      Voice Consult
                    </Box>
                    <Box
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleMessage}
                      sx={{
                        flex: 1,
                        p: 1.5,
                        border: '1px solid',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        cursor: 'pointer',
                        fontFamily: theme.typography.fontFamily,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          borderColor: 'primary.dark',
                        },
                      }}
                    >
                      <MessageIcon sx={{ fontSize: 18 }} />
                      Message
                    </Box>
                  </Box>

                  {/* Status Bar */}
                  <Box 
                    sx={{ 
                      px: 2,
                      py: 1,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      borderTop: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      component={motion.div}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <BrainIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                      Available now • Instant response
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </AnimatePresence>

      {/* Voice Consultation Mode */}
      {activeMode === 'consultation' && (
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

      {/* Message Mode - Chatbot is handled globally in App.tsx */}
    </>
  );
};