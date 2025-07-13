import React, { useState, useEffect } from 'react';
import { Device } from '@twilio/voice-sdk';
import { Box, Button, CircularProgress, Typography, Card } from '@mui/material';
import { Call as CallIcon, CallEnd as CallEndIcon } from '@mui/icons-material';

export const TwilioVoiceChat: React.FC = () => {
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeTwilio();
  }, []);

  const initializeTwilio = async () => {
    try {
      // Get Twilio token from backend
      const response = await fetch('https://pedrobackend.onrender.com/api/voice/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: `user_${Date.now()}` })
      });
      
      const { token } = await response.json();
      
      // Initialize Twilio Device
      const twilioDevice = new Device(token);
      
      twilioDevice.on('ready', () => {
        console.log('Twilio Device ready');
        setDevice(twilioDevice);
      });
      
      twilioDevice.on('error', (error) => {
        console.error('Twilio error:', error);
        setError(error.message);
      });
      
      twilioDevice.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
      });
      
      twilioDevice.on('disconnect', () => {
        setIsConnected(false);
      });
      
      await twilioDevice.register();
      
    } catch (err) {
      setError('Failed to initialize voice chat');
      console.error('Twilio initialization error:', err);
    }
  };

  const startCall = async () => {
    if (!device) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      await device.connect({
        params: {
          To: 'julie-ai',
          agentName: 'Julie'
        }
      });
    } catch (err) {
      setError('Failed to connect call');
      setIsConnecting(false);
      console.error('Call connection error:', err);
    }
  };

  const endCall = () => {
    device?.disconnectAll();
    setIsConnected(false);
  };

  return (
    <Card sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Voice Chat with Julie
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      {!isConnected ? (
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={startCall}
          disabled={!device || isConnecting}
          startIcon={isConnecting ? <CircularProgress size={20} /> : <CallIcon />}
        >
          {isConnecting ? 'Connecting...' : 'Start Voice Call'}
        </Button>
      ) : (
        <Box>
          <Typography color="success.main" sx={{ mb: 2, textAlign: 'center' }}>
            Connected - Speak now!
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="error"
            size="large"
            onClick={endCall}
            startIcon={<CallEndIcon />}
          >
            End Call
          </Button>
        </Box>
      )}
      
      <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
        Powered by Twilio • No downloads needed
      </Typography>
    </Card>
  );
};