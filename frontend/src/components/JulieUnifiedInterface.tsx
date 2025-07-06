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
    setMode(newMode);
    if (newMode === 'chat') {
      chatStore.openChat();
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
          zIndex: 1300,
        }}
      >
        {/* Main Julie Launcher */}
        <Tooltip title="Talk to Julie - EP3 Certified Care Coordinator" placement="left" arrow>
          <Fab
            color="primary"
            size="large"
            onClick={() => handleModeSwitch('chat')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              width: 72,
              height: 72,
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
              },
            }}
          >
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'transparent' }}>
              <Typography fontSize="2rem">👩‍⚕️</Typography>
            </Avatar>
          </Fab>
        </Tooltip>

        {/* Mode Selection Pills */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip
            label="💬 Chat"
            onClick={() => handleModeSwitch('chat')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'primary.main', color: 'white' },
            }}
          />
          <Chip
            label="🎤 Voice"
            onClick={() => handleModeSwitch('voice')}
            sx={{
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'secondary.main', color: 'white' },
            }}
          />
        </Box>
      </Box>
    );
  }

  if (mode === 'chat') {
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
                <Typography fontSize="1.5rem">👩‍⚕️</Typography>
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