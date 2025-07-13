import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Mic as MicIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';

interface SocketIOVoiceProps {
  onClose?: () => void;
  agentName?: string;
  voiceId?: string;
}

export const SocketIOVoice: React.FC<SocketIOVoiceProps> = ({ agentName = 'Julie', voiceId }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string, timestamp: number}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isJulieSpeaking, setIsJulieSpeaking] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionIdRef = useRef<string>(`session_${Date.now()}`);
  const transcriptBoxRef = useRef<HTMLDivElement>(null);

  // Connect to Socket.IO
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect to Socket.IO
      const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
      socketRef.current = io(`${apiUrl}/voice`, {
        transports: ['websocket', 'polling'], // Allow both for Render
        reconnection: true,
        reconnectionAttempts: 3,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket.IO connected!');
        setIsConnecting(false);
        setIsConnected(true);
        
        // Start the call
        socketRef.current!.emit('start-call', { 
          sessionId: sessionIdRef.current,
          agentName,
          voiceId 
        });
      });

      socketRef.current.on('call-started', (data) => {
        console.log('Call started:', data);
        startRecording(stream);
      });

      socketRef.current.on('transcript', (data) => {
        setTranscript(prev => [...prev, {
          ...data,
          timestamp: Date.now()
        }]);
      });

      socketRef.current.on('audio-response', async (data) => {
        await playAudioResponse(data.audio, data.sampleRate);
      });

      socketRef.current.on('error', (error) => {
        console.error('Socket.IO error:', error);
        setError('Connection error');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket.IO disconnected');
        setIsConnected(false);
        stopRecording();
      });

    } catch (err) {
      console.error('Failed to connect:', err);
      setError('Failed to connect - please check microphone permissions');
      setIsConnecting(false);
    }
  }, [agentName, voiceId]);

  // Start recording audio
  const startRecording = (stream: MediaStream) => {
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        if (base64Audio && socketRef.current?.connected) {
          socketRef.current.emit('audio-data', {
            sessionId: sessionIdRef.current,
            audio: base64Audio
          });
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    // Record in 1-second chunks
    mediaRecorderRef.current.start(1000);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play audio response
  const playAudioResponse = async (base64Audio: string, _sampleRate: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    try {
      setIsJulieSpeaking(true);
      
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.onended = () => setIsJulieSpeaking(false);
      source.start();
      
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsJulieSpeaking(false);
    }
  };

  // Disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit('end-call', { sessionId: sessionIdRef.current });
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    stopRecording();
    setIsConnected(false);
    setTranscript([]);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Voice Chat with {agentName} (Socket.IO)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Connection Status */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {isConnected && (
            <Chip
              icon={<VolumeUpIcon />}
              label="Connected"
              color="success"
              size="small"
            />
          )}
          {isRecording && (
            <Chip
              icon={<MicIcon />}
              label="Recording"
              color="primary"
              size="small"
            />
          )}
          {isJulieSpeaking && (
            <Chip
              icon={<VolumeUpIcon />}
              label={`${agentName} is speaking`}
              color="secondary"
              size="small"
            />
          )}
        </Stack>

        {/* Transcript */}
        <Box
          ref={transcriptBoxRef}
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: 'grey.50',
            borderRadius: 2,
            p: 2,
            mb: 2,
            minHeight: 200,
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
                  bgcolor: entry.role === 'user' ? 'primary.light' : 'grey.200',
                  color: entry.role === 'user' ? 'white' : 'text.primary',
                  maxWidth: '80%',
                }}
              >
                {entry.text}
              </Typography>
            </Box>
          ))}
          {transcript.length === 0 && !isConnected && (
            <Typography variant="body2" color="text.secondary" align="center">
              Click "Start Call" to begin your conversation
            </Typography>
          )}
        </Box>

        {/* Call Controls */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {!isConnected ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={connect}
              disabled={isConnecting}
              startIcon={isConnecting ? <CircularProgress size={20} /> : <CallIcon />}
            >
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={disconnect}
              startIcon={<CallEndIcon />}
            >
              End Call
            </Button>
          )}
        </Stack>

        {isJulieSpeaking && (
          <LinearProgress sx={{ mt: 2 }} />
        )}
      </CardContent>
    </Card>
  );
};