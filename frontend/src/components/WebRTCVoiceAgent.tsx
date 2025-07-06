import React, { useState, useEffect, useRef } from 'react';
import { 
  Room, 
  RoomEvent, 
  Track, 
  LocalParticipant, 
  createLocalTracks,
  VideoPresets
} from 'livekit-client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  Stack,
  Alert,
  Collapse,
  LinearProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Call as CallIcon,
  CallEnd as CallEndIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  SignalCellularAlt as SignalIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface WebRTCVoiceAgentProps {
  onSessionEnd?: (sessionId: string) => void;
}

const WebRTCVoiceAgent: React.FC<WebRTCVoiceAgentProps> = ({ onSessionEnd }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  
  const roomRef = useRef<Room | null>(null);
  const sessionIdRef = useRef<string>(`session_${Date.now()}`);
  const audioTrackRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Get LiveKit token from backend
      const tokenResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/voice-agent/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Patient',
          roomName: 'medical-consultation'
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to get connection token');
      }

      const { token, serverUrl, roomName } = await tokenResponse.json();

      // Start voice agent session
      const sessionResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/voice-agent/start-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          roomName
        })
      });

      if (!sessionResponse.ok) {
        throw new Error('Failed to start voice agent session');
      }

      // Create and connect to LiveKit room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      roomRef.current = room;

      // Set up event handlers
      room.on(RoomEvent.Connected, () => {
        console.log('Connected to voice agent');
        setIsConnected(true);
        setIsConnecting(false);
        addTranscript('system', 'Connected to Julie, your AI assistant');
      });

      room.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from voice agent');
        setIsConnected(false);
      });

      room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
        if (participant instanceof LocalParticipant) {
          switch (quality) {
            case 'excellent':
            case 'good':
              setConnectionQuality('excellent');
              break;
            case 'poor':
              setConnectionQuality('poor');
              break;
            default:
              setConnectionQuality('good');
          }
        }
      });

      room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Audio && participant.identity === 'AI_Assistant_Julie') {
          // Attach AI agent's audio
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
          audioElement.play();
          
          // Monitor when agent is speaking
          track.on('audioPlaybackStarted', () => setIsAgentSpeaking(true));
          track.on('audioPlaybackEnded', () => setIsAgentSpeaking(false));
        }
      });

      room.on(RoomEvent.DataReceived, (payload, participant) => {
        // Handle transcripts and other data from the agent
        try {
          const data = JSON.parse(new TextDecoder().decode(payload));
          if (data.type === 'transcript') {
            addTranscript(data.speaker, data.text);
          }
        } catch (e) {
          console.error('Error parsing data:', e);
        }
      });

      // Connect to room
      await room.connect(serverUrl, token);

      // Create and publish local audio track
      const tracks = await createLocalTracks({
        audio: true,
        video: false
      });

      const audioTrack = tracks.find(track => track.kind === Track.Kind.Audio);
      if (audioTrack) {
        await room.localParticipant.publishTrack(audioTrack);
        audioTrackRef.current = audioTrack;
      }

    } catch (error) {
      console.error('Connection error:', error);
      setError(error.message || 'Failed to connect to voice agent');
      setIsConnecting(false);
      setIsConnected(false);
    }
  };

  const disconnect = async () => {
    try {
      // End session on backend
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/voice-agent/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current
        })
      });

      // Disconnect from LiveKit
      if (roomRef.current) {
        await roomRef.current.disconnect();
        roomRef.current = null;
      }

      setIsConnected(false);
      addTranscript('system', 'Disconnected from voice agent');
      
      if (onSessionEnd) {
        onSessionEnd(sessionIdRef.current);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const toggleMute = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.mute = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleSpeaker = () => {
    setSpeakerMuted(!speakerMuted);
    // In a real implementation, you would mute/unmute remote audio tracks
  };

  const addTranscript = (speaker: string, text: string) => {
    setTranscript(prev => [...prev, `${speaker === 'system' ? '🔊' : speaker === 'user' ? '👤' : '🤖'} ${text}`]);
  };

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent':
        return <SignalIcon color="success" />;
      case 'good':
        return <SignalIcon color="warning" />;
      case 'poor':
        return <SignalIcon color="error" />;
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', my: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          AI Voice Assistant - Julie
          {isConnected && getQualityIcon()}
        </Typography>

        <Collapse in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Collapse>

        {!isConnected ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Connect to speak with Julie about appointments, procedures, or any questions about Dr. Pedro's services.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={isConnecting ? <CircularProgress size={20} /> : <CallIcon />}
              onClick={connect}
              disabled={isConnecting}
              sx={{ px: 4, py: 1.5 }}
            >
              {isConnecting ? 'Connecting...' : 'Start Voice Call'}
            </Button>
          </Box>
        ) : (
          <Box>
            {/* Call Controls */}
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <IconButton
                color={isMuted ? 'error' : 'primary'}
                onClick={toggleMute}
                size="large"
                sx={{ 
                  bgcolor: isMuted ? 'error.light' : 'primary.light',
                  '&:hover': { bgcolor: isMuted ? 'error.main' : 'primary.main' }
                }}
              >
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>

              <IconButton
                color="error"
                onClick={disconnect}
                size="large"
                sx={{ 
                  bgcolor: 'error.light',
                  '&:hover': { bgcolor: 'error.main' }
                }}
              >
                <CallEndIcon />
              </IconButton>

              <IconButton
                color={speakerMuted ? 'error' : 'primary'}
                onClick={toggleSpeaker}
                size="large"
                sx={{ 
                  bgcolor: speakerMuted ? 'error.light' : 'primary.light',
                  '&:hover': { bgcolor: speakerMuted ? 'error.main' : 'primary.main' }
                }}
              >
                {speakerMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Stack>

            {/* Agent Speaking Indicator */}
            {isAgentSpeaking && (
              <Box sx={{ mb: 2 }}>
                <LinearProgress color="primary" />
                <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block', textAlign: 'center' }}>
                  Julie is speaking...
                </Typography>
              </Box>
            )}

            {/* Transcript */}
            <Box sx={{ 
              bgcolor: 'grey.100', 
              p: 2, 
              borderRadius: 1, 
              maxHeight: 300, 
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              <Typography variant="subtitle2" gutterBottom>
                Conversation Transcript
              </Typography>
              {transcript.map((line, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                  {line}
                </Typography>
              ))}
            </Box>

            {/* Quick Actions */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap">
              <Chip 
                label="Book Appointment" 
                onClick={() => addTranscript('user', 'I would like to book an appointment')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="Ask About Yomi" 
                onClick={() => addTranscript('user', 'Tell me about Yomi robotic implants')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="EmFace Info" 
                onClick={() => addTranscript('user', 'What is EmFace treatment?')}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label="TMJ Help" 
                onClick={() => addTranscript('user', 'I have jaw pain, can you help?')}
                color="primary"
                variant="outlined"
              />
            </Stack>
          </Box>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Powered by WebRTC • No phone required • HIPAA compliant
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WebRTCVoiceAgent;