import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Stack,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  VolumeUp as VolumeUpIcon,
} from '@mui/icons-material';

interface SimpleWebRTCVoiceProps {
  onClose?: () => void;
}

export const SimpleWebRTCVoice: React.FC<SimpleWebRTCVoiceProps> = ({ onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string, timestamp: number}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [isJulieSpeaking, setIsJulieSpeaking] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionIdRef = useRef<string>(`session_${Date.now()}`);
  const transcriptBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto-scroll transcript
    if (transcriptBoxRef.current) {
      transcriptBoxRef.current.scrollTop = transcriptBoxRef.current.scrollHeight;
    }
  }, [transcript]);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get user media permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create WebSocket connection to backend
      const wsUrl = import.meta.env.VITE_API_URL?.replace('http', 'ws') || 'ws://localhost:3001';
      const ws = new WebSocket(`${wsUrl}/webrtc-voice`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebRTC voice connected');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Send start-call message
        ws.send(JSON.stringify({
          type: 'start-call',
          sessionId: sessionIdRef.current
        }));

        // Setup media recorder
        setupMediaRecorder(stream, ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'ready':
            case 'session-ready':
              console.log('Session ready:', data.sessionId);
              break;
              
            case 'transcript':
              setTranscript(prev => [...prev, {
                role: data.role,
                text: data.text,
                timestamp: data.timestamp || Date.now()
              }]);
              break;
              
            case 'audio-response':
              playAudioResponse(data.audio, data.sampleRate || 8000);
              break;
              
            case 'call-ended':
              handleCallEnded(data.duration);
              break;
          }
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('WebSocket closed');
        setIsConnected(false);
        stopRecording();
      };

    } catch (error: any) {
      console.error('Connection error:', error);
      setError(error.message || 'Failed to connect. Please check your microphone permissions.');
      setIsConnecting(false);
    }
  };

  const setupMediaRecorder = (stream: MediaStream, ws: WebSocket) => {
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus'
    });
    
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
        // Convert blob to base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            ws.send(JSON.stringify({
              type: 'audio-data',
              sessionId: sessionIdRef.current,
              audio: base64Audio
            }));
          }
        };
        reader.readAsDataURL(event.data);
      }
    };

    // Start recording in chunks
    mediaRecorder.start(250); // Send audio every 250ms
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const playAudioResponse = async (base64Audio: string, sampleRate: number) => {
    try {
      setIsJulieSpeaking(true);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const audioContext = audioContextRef.current;
      
      // Decode base64 to array buffer
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create audio buffer from PCM data
      const audioBuffer = audioContext.createBuffer(1, bytes.length / 2, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      // Convert PCM16 to float32
      const dataView = new DataView(bytes.buffer);
      for (let i = 0; i < channelData.length; i++) {
        const sample = dataView.getInt16(i * 2, true) / 32768;
        channelData[i] = sample;
      }
      
      // Play the audio
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsJulieSpeaking(false);
      source.start(0);
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsJulieSpeaking(false);
    }
  };

  const disconnect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'end-call',
        sessionId: sessionIdRef.current
      }));
      wsRef.current.close();
    }
    
    stopRecording();
    setIsConnected(false);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const handleCallEnded = (duration: number) => {
    setTranscript(prev => [...prev, {
      role: 'system',
      text: `Call ended. Duration: ${duration} seconds`,
      timestamp: Date.now()
    }]);
  };

  const sendQuickMessage = (text: string) => {
    // Simulate user saying something
    setTranscript(prev => [...prev, {
      role: 'user',
      text: text,
      timestamp: Date.now()
    }]);
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Voice Chat with Julie
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!isConnected ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Click to start a voice conversation with Julie, your AI dental assistant.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <CallIcon />}
              onClick={connect}
              disabled={isConnecting}
              color="primary"
            >
              {isConnecting ? 'Connecting...' : 'Start Voice Call'}
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Recording indicator */}
            {isRecording && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress color="error" />
                <Typography variant="caption" color="error" sx={{ display: 'block', textAlign: 'center' }}>
                  <MicIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Listening...
                </Typography>
              </Box>
            )}

            {/* Julie speaking indicator */}
            {isJulieSpeaking && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress color="primary" />
                <Typography variant="caption" color="primary" sx={{ display: 'block', textAlign: 'center' }}>
                  <VolumeUpIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Julie is speaking...
                </Typography>
              </Box>
            )}

            {/* Transcript */}
            <Box 
              ref={transcriptBoxRef}
              sx={{ 
                bgcolor: 'grey.100', 
                p: 2, 
                borderRadius: 1, 
                height: 300, 
                overflow: 'auto',
                mb: 2
              }}
            >
              {transcript.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Conversation will appear here...
                </Typography>
              ) : (
                transcript.map((msg, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography 
                      variant="caption" 
                      color={msg.role === 'user' ? 'primary' : msg.role === 'assistant' ? 'secondary' : 'text.secondary'}
                      fontWeight="bold"
                    >
                      {msg.role === 'user' ? 'You' : msg.role === 'assistant' ? 'Julie' : 'System'}:
                    </Typography>
                    <Typography variant="body2">
                      {msg.text}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>

            {/* Quick actions */}
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
              <Chip 
                label="Book Appointment" 
                onClick={() => sendQuickMessage("I'd like to book an appointment")}
                size="small"
              />
              <Chip 
                label="About Services" 
                onClick={() => sendQuickMessage("What services do you offer?")}
                size="small"
              />
              <Chip 
                label="Insurance" 
                onClick={() => sendQuickMessage("Do you accept my insurance?")}
                size="small"
              />
            </Stack>

            {/* End call button */}
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<CallEndIcon />}
              onClick={disconnect}
            >
              End Call
            </Button>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          No phone needed • Works in your browser • Private & secure
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SimpleWebRTCVoice;