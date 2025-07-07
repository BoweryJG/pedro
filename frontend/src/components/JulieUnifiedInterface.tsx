import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Mic as MicIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  VolumeUp as SpeakerIcon,
  StopCircle as StopIcon,
  PlayArrow as PlayIcon,
  LocalHospital as MedicalIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '../chatbot/store/chatStore';
import { PremiumChatbot } from '../chatbot/components/PremiumChatbot';

interface JulieUnifiedInterfaceProps {
  onClose?: () => void;
}

export const JulieUnifiedInterface: React.FC<JulieUnifiedInterfaceProps> = ({ onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();
  
  const [mode, setMode] = useState<'closed' | 'chat' | 'voice'>('closed');
  
  // Debug mode changes
  useEffect(() => {
    console.log('🔄 JulieUnifiedInterface: Mode changed to:', mode);
  }, [mode]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicePermission, setVoicePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleVoiceMessage(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoicePermission('denied');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setVoicePermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setVoicePermission('denied');
      return false;
    }
  };

  const startListening = async () => {
    if (voicePermission === 'prompt') {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    if (recognitionRef.current && voicePermission === 'granted') {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleVoiceMessage = async (message: string) => {
    if (message.trim()) {
      await chatStore.sendMessage(message);
      setTranscript('');
      
      // Get the latest response and speak it
      const latestMessage = chatStore.messages[chatStore.messages.length - 1];
      if (latestMessage && latestMessage.role === 'assistant') {
        speakResponse(latestMessage.content);
      }
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.name.includes('Female') || voice.name.includes('Samantha') || voice.name.includes('Karen')
      ) || speechSynthesis.getVoices()[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleModeSwitch = (newMode: 'chat' | 'voice') => {
    console.log('🔄 JulieUnifiedInterface: Switching mode to:', newMode);
    setMode(newMode);
    if (newMode === 'chat') {
      // Use setTimeout to ensure state updates happen in order
      setTimeout(() => {
        chatStore.openChat();
        console.log('✅ JulieUnifiedInterface: Chat store opened');
      }, 50);
      stopListening();
      stopSpeaking();
    } else if (newMode === 'voice') {
      chatStore.closeChat();
    }
  };

  const handleClose = () => {
    setMode('closed');
    chatStore.closeChat();
    stopListening();
    stopSpeaking();
    onClose?.();
  };

  // Listen for external events to open Julie
  useEffect(() => {
    const handleOpenJulieChat = () => {
      console.log('✅ JulieUnifiedInterface: Received open-julie-chat event');
      setMode('chat');
      // Ensure chat store is opened with a slight delay to allow mode change to propagate
      setTimeout(() => {
        chatStore.openChat();
      }, 100);
    };

    const handleOpenJulieVoice = () => {
      console.log('✅ JulieUnifiedInterface: Received open-julie-voice event');
      setMode('voice');
      chatStore.closeChat();
    };

    console.log('🎯 JulieUnifiedInterface: Setting up event listeners');
    window.addEventListener('open-julie-chat', handleOpenJulieChat);
    window.addEventListener('open-julie-voice', handleOpenJulieVoice);
    
    // Expose direct methods on window for fallback access
    (window as any).openJulieChat = handleOpenJulieChat;
    (window as any).openJulieVoice = handleOpenJulieVoice;

    return () => {
      console.log('🔄 JulieUnifiedInterface: Cleaning up event listeners');
      window.removeEventListener('open-julie-chat', handleOpenJulieChat);
      window.removeEventListener('open-julie-voice', handleOpenJulieVoice);
      delete (window as any).openJulieChat;
      delete (window as any).openJulieVoice;
    };
  }, [chatStore]);

  if (mode === 'closed') {
    return (
      <Box
        component={motion.div}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 24 : 40,
          right: isMobile ? 24 : 40,
          zIndex: 10000, // Ensure Julie button is above everything
        }}
      >
        {/* Pulsing ring effect */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: 'absolute',
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />
        {/* Floating "Chat with Julie" label */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          sx={{
            position: 'absolute',
            right: 90,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
            fontWeight: 700,
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            display: { xs: 'none', sm: 'block' },
            '&::after': {
              content: '""',
              position: 'absolute',
              right: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '8px 0 8px 8px',
              borderColor: 'transparent transparent transparent #764ba2',
            },
          }}
        >
          Chat with Julie 👩‍⚕️
        </Box>

        {/* Main Julie Launcher - Professional Medical Interface */}
        <Tooltip title="Click to chat with Julie - EP³ Care Coordinator" placement="left" arrow>
          <Fab
            color="primary"
            size="large"
            onClick={() => handleModeSwitch('chat')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              width: 80,
              height: 80,
              position: 'relative',
              overflow: 'visible',
              animation: 'gentle-bounce 3s ease-in-out infinite',
              '@keyframes gentle-bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 20px 50px rgba(102, 126, 234, 0.7)',
                animation: 'none',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -2,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                opacity: 0.3,
                filter: 'blur(15px)',
                zIndex: -1,
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MedicalServicesIcon 
                sx={{ 
                  fontSize: 36, 
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} 
              />
              {/* "Click Me" hint for first-time users */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
                sx={{
                  position: 'absolute',
                  top: -35,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '4px 4px 0 4px',
                    borderColor: 'rgba(0, 0, 0, 0.8) transparent transparent transparent',
                  },
                }}
              >
                Click me! 👆
              </Box>
              {/* EP³ Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <Typography 
                  sx={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 900,
                    color: 'white',
                    lineHeight: 1,
                  }}
                >
                  EP³
                </Typography>
              </Box>
            </Box>
          </Fab>
        </Tooltip>

        {/* Mode Selection Pills with better visibility */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          sx={{
            position: 'absolute',
            bottom: -70,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
            background: 'rgba(255, 255, 255, 0.95)',
            p: 1,
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Chip
            icon={<ChatIcon sx={{ fontSize: 16 }} />}
            label="Chat"
            onClick={() => handleModeSwitch('chat')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: 'primary.main', color: 'white' },
            }}
          />
          <Chip
            icon={<MicIcon sx={{ fontSize: 16 }} />}
            label="Voice"
            onClick={() => handleModeSwitch('voice')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: 'secondary.main', color: 'white' },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (mode === 'chat') {
    console.log('🎨 JulieUnifiedInterface: Rendering PremiumChatbot, isOpen:', chatStore.isOpen);
    return <PremiumChatbot onClose={handleClose} />;
  }

  // Voice Mode Interface
  return (
    <AnimatePresence>
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        sx={{
          position: 'fixed',
          bottom: isMobile ? 20 : 40,
          right: isMobile ? 20 : 40,
          zIndex: 1300,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(245, 87, 108, 0.95) 0%, rgba(240, 147, 251, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            color: 'white',
            minWidth: 300,
            maxWidth: isMobile ? '90vw' : 400,
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                <MedicalIcon sx={{ fontSize: 28, color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Voice Chat with Julie
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  EP3 Certified Care Coordinator
                </Typography>
              </Box>
            </Box>
            <Box>
              <Tooltip title="Switch to Text Chat">
                <IconButton
                  onClick={() => handleModeSwitch('chat')}
                  sx={{ color: 'white', mr: 1 }}
                >
                  <ChatIcon />
                </IconButton>
              </Tooltip>
              <IconButton onClick={handleClose} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }} />

          {/* Voice Controls */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {voicePermission === 'denied' && (
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                Microphone access is required for voice chat. Please enable it in your browser settings.
              </Typography>
            )}

            {transcript && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                <Typography variant="body2" sx={{ color: 'white', fontStyle: 'italic' }}>
                  "{transcript}"
                </Typography>
              </Paper>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              {/* Microphone Button */}
              <Tooltip title={isListening ? "Stop Listening" : "Start Speaking"}>
                <Fab
                  color={isListening ? "secondary" : "default"}
                  onClick={isListening ? stopListening : startListening}
                  disabled={voicePermission === 'denied'}
                  sx={{
                    bgcolor: isListening ? '#ff4444' : 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: isListening ? '#ff3333' : 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {isListening ? <StopIcon /> : <MicIcon />}
                </Fab>
              </Tooltip>

              {/* Speaker Button */}
              <Tooltip title={isSpeaking ? "Stop Julie" : "Julie will respond"}>
                <Fab
                  color={isSpeaking ? "primary" : "default"}
                  onClick={isSpeaking ? stopSpeaking : undefined}
                  sx={{
                    bgcolor: isSpeaking ? '#4CAF50' : 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      bgcolor: isSpeaking ? '#45a049' : 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  {isSpeaking ? <PlayIcon /> : <SpeakerIcon />}
                </Fab>
              </Tooltip>
            </Box>
          </Box>

          {/* Status Indicators */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Chip
              label={isListening ? "Listening..." : "Press mic to speak"}
              color={isListening ? "success" : "default"}
              size="small"
              sx={{ color: 'white', bgcolor: 'rgba(255, 255, 255, 0.2)' }}
            />
            {isSpeaking && (
              <Chip
                label="Julie is speaking..."
                color="primary"
                size="small"
                sx={{ color: 'white' }}
              />
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="Book Appointment"
              onClick={() => handleVoiceMessage("I'd like to book an appointment")}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              label="Ask About Services"
              onClick={() => handleVoiceMessage("What services do you offer?")}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
            <Chip
              label="Emergency"
              onClick={() => handleVoiceMessage("I have a dental emergency")}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
            />
          </Box>
        </Paper>
      </Box>
    </AnimatePresence>
  );
};

export default JulieUnifiedInterface;