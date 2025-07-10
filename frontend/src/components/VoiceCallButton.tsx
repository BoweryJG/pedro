import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  IconButton,
  Paper,
  Typography,
  CircularProgress,
  Slide,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  PhoneDisabled as PhoneEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  VolumeUp as SpeakerIcon,
  CheckCircle as ConnectedIcon,
  Error as ErrorIcon,
  WifiTethering as ConnectingIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCallButtonProps {
  apiUrl?: string;
}

export const VoiceCallButton: React.FC<VoiceCallButtonProps> = ({ 
  apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com' 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string}>>([]);
  const [connectionError, setConnectionError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);

  // Initialize audio context
  const initAudioContext = async () => {
    console.log('[VoiceCall] Initializing audio context...');
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('[VoiceCall] Audio context created');
      
      // Get user media
      console.log('[VoiceCall] Requesting microphone access...');
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      console.log('[VoiceCall] Microphone access granted');
      
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      // Process audio and send to server
      processorRef.current.onaudioprocess = (e) => {
        if (!isCallActive || isMuted) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const pcm16 = new Int16Array(inputData.length);
        
        // Convert Float32 to Int16
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Send audio data to server
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64Audio = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));
          wsRef.current.send(JSON.stringify({
            type: 'audio-data',
            audio: base64Audio
          }));
        }
        
        // Simple voice activity detection
        const rms = Math.sqrt(pcm16.reduce((sum, val) => sum + val * val, 0) / pcm16.length) / 32768;
        setIsListening(rms > 0.01);
      };
      
      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      console.log('[VoiceCall] Audio pipeline established');
      
    } catch (error) {
      console.error('[VoiceCall] Audio init error:', error);
      setConnectionError('Microphone access denied');
      setConnectionStatus('error');
    }
  };

  // Start voice call
  const startCall = async () => {
    console.log('[VoiceCall] Starting call...');
    setIsConnecting(true);
    setConnectionStatus('connecting');
    setConnectionError('');
    
    try {
      // Initialize audio
      await initAudioContext();
      
      // Connect WebSocket - ensure proper protocol for production
      const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
      const wsUrl = apiUrl.replace(/^https?/, wsProtocol) + '/webrtc-voice';
      console.log('[VoiceCall] Connecting to WebSocket:', wsUrl);
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('[VoiceCall] WebSocket connected successfully');
        setIsConnecting(false);
        setIsCallActive(true);
        setConnectionStatus('connected');
        
        // Start call session
        const sessionId = `web_${Date.now()}`;
        console.log('[VoiceCall] Starting session:', sessionId);
        wsRef.current!.send(JSON.stringify({
          type: 'start-call',
          sessionId: sessionId
        }));
      };
      
      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('[VoiceCall] Received message:', data.type);
        
        switch (data.type) {
          case 'ready':
            console.log('[VoiceCall] Server is ready');
            break;
            
          case 'transcript':
            console.log('[VoiceCall] Transcript received:', data.role, data.text);
            setTranscript(prev => [...prev, { role: data.role, text: data.text }]);
            break;
            
          case 'audio-response':
            console.log('[VoiceCall] Audio response received');
            await playAudioResponse(data.audio, data.sampleRate);
            break;
            
          case 'session-ready':
            console.log('[VoiceCall] Session ready:', data.sessionId);
            // Add a welcome message to the transcript
            setTranscript(prev => [...prev, { 
              role: 'assistant', 
              text: "Hello! I'm Julie from Dr. Pedro's office. How may I assist you today?" 
            }]);
            break;
            
          case 'call-ended':
            console.log('[VoiceCall] Call ended by server');
            endCall();
            break;
            
          default:
            console.log('[VoiceCall] Unknown message type:', data.type);
        }
      };
      
      wsRef.current.onerror = (error) => {
        console.error('[VoiceCall] WebSocket error:', error);
        setConnectionError('Connection failed - please check your internet connection');
        setConnectionStatus('error');
        setIsConnecting(false);
      };
      
      wsRef.current.onclose = (event) => {
        console.log('[VoiceCall] WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        if (isCallActive) {
          endCall();
        }
      };
      
    } catch (error) {
      console.error('[VoiceCall] Call start error:', error);
      setConnectionError('Failed to start call - ' + (error as Error).message);
      setConnectionStatus('error');
      setIsConnecting(false);
    }
  };

  // Play audio response from Julie
  const playAudioResponse = async (base64Audio: string, sampleRate: number) => {
    if (!audioContextRef.current) return;
    
    try {
      setIsSpeaking(true);
      
      // Decode base64 to array buffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Convert to Float32Array for Web Audio
      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768;
      }
      
      // Create audio buffer
      const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, sampleRate);
      audioBuffer.getChannelData(0).set(float32);
      
      // Play audio
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsSpeaking(false);
      source.start();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsSpeaking(false);
    }
  };

  // End call
  const endCall = () => {
    // Send end signal
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end-call' }));
    }
    
    // Cleanup
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsCallActive(false);
    setIsConnecting(false);
    setTranscript([]);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      {/* Floating Call Button */}
      <AnimatePresence>
        {!isCallActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{
              position: 'fixed',
              bottom: isMobile ? 80 : 24,
              right: 24,
              zIndex: 1300,
            }}
          >
            <Tooltip 
              title={
                connectionError ? connectionError : 
                isConnecting ? 'Connecting to Julie...' : 
                'Start voice call with Julie'
              }
              placement="left"
            >
              <Fab
                color="primary"
                size="large"
                onClick={startCall}
                disabled={isConnecting}
                data-voice-call-button
                sx={{
                  background: connectionError 
                    ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: connectionError
                    ? '0 4px 20px rgba(244, 67, 54, 0.4)'
                    : '0 4px 20px rgba(118, 75, 162, 0.4)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {isConnecting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : connectionError ? (
                  <ErrorIcon />
                ) : (
                  <PhoneIcon />
                )}
              </Fab>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                bgcolor: 'background.paper',
                px: 1,
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              Talk to Julie
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Interface */}
      <Slide direction="up" in={isCallActive} mountOnEnter unmountOnExit>
        <Paper
          elevation={10}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: isMobile ? '60vh' : '400px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1400,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <Typography fontSize="1.5rem">👩‍⚕️</Typography>
              </Avatar>
              <Box>
                <Typography variant="h6">Julie</Typography>
                <Typography variant="caption">
                  Enhanced Physician Technology
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              {/* Connection Status */}
              {connectionStatus === 'connecting' && (
                <Chip
                  icon={<ConnectingIcon sx={{ animation: 'pulse 1.5s infinite' }} />}
                  label="Connecting"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              )}
              {connectionStatus === 'connected' && (
                <Chip
                  icon={<ConnectedIcon />}
                  label="Connected"
                  size="small"
                  sx={{ bgcolor: 'rgba(76, 175, 80, 0.3)' }}
                />
              )}
              {connectionStatus === 'error' && (
                <Chip
                  icon={<ErrorIcon />}
                  label="Error"
                  size="small"
                  sx={{ bgcolor: 'rgba(244, 67, 54, 0.3)' }}
                />
              )}
              
              {/* Voice Activity */}
              {isListening && (
                <Chip
                  icon={<MicIcon />}
                  label="Listening"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              )}
              {isSpeaking && (
                <Chip
                  icon={<SpeakerIcon />}
                  label="Speaking"
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}
                />
              )}
            </Box>
          </Box>

          {/* Transcript */}
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: 'grey.50',
            }}
          >
            {transcript.map((entry, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  textAlign: entry.role === 'user' ? 'right' : 'left',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: 'inline-block',
                    p: 1,
                    borderRadius: 2,
                    bgcolor: entry.role === 'user' ? 'primary.light' : 'white',
                    color: entry.role === 'user' ? 'white' : 'text.primary',
                    maxWidth: '80%',
                  }}
                >
                  {entry.text}
                </Typography>
              </Box>
            ))}
            
            {connectionError && (
              <Typography color="error" variant="body2" align="center">
                {connectionError}
              </Typography>
            )}
          </Box>

          {/* Controls */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
            }}
          >
            <IconButton
              onClick={toggleMute}
              color={isMuted ? 'error' : 'default'}
              sx={{
                bgcolor: isMuted ? 'error.light' : 'grey.200',
                '&:hover': {
                  bgcolor: isMuted ? 'error.main' : 'grey.300',
                },
              }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            
            <IconButton
              onClick={endCall}
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                px: 3,
                '&:hover': {
                  bgcolor: 'error.dark',
                },
              }}
            >
              <PhoneEndIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};