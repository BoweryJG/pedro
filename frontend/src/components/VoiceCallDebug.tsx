import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';

export const VoiceCallDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  
  const testVoiceConnection = async () => {
    setDebugInfo([]);
    setError('');
    
    try {
      // 1. Test backend API
      const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
      setDebugInfo(prev => [...prev, `Testing API URL: ${apiUrl}`]);
      
      const apiResponse = await fetch(`${apiUrl}/api/status`);
      const apiData = await apiResponse.json();
      setDebugInfo(prev => [...prev, `API Status: ${JSON.stringify(apiData)}`]);
      
      // 2. Test WebSocket connection
      const wsUrl = apiUrl.replace('http', 'ws') + '/webrtc-voice';
      setDebugInfo(prev => [...prev, `Testing WebSocket URL: ${wsUrl}`]);
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setDebugInfo(prev => [...prev, '✓ WebSocket connected successfully']);
        
        // Send test message
        ws.send(JSON.stringify({
          type: 'start-call',
          sessionId: `test_${Date.now()}`
        }));
      };
      
      ws.onmessage = (event) => {
        setDebugInfo(prev => [...prev, `WebSocket message: ${event.data}`]);
      };
      
      ws.onerror = (error) => {
        setError(`WebSocket error: ${error}`);
        setDebugInfo(prev => [...prev, `✗ WebSocket error occurred`]);
      };
      
      ws.onclose = (event) => {
        setDebugInfo(prev => [...prev, `WebSocket closed: Code ${event.code}, Reason: ${event.reason}`]);
      };
      
      // 3. Test microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setDebugInfo(prev => [...prev, '✓ Microphone access granted']);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setDebugInfo(prev => [...prev, '✗ Microphone access denied']);
      }
      
    } catch (err) {
      setError(`Test failed: ${err}`);
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Voice Call Debug Tool
      </Typography>
      
      <Button
        variant="contained"
        startIcon={<PhoneIcon />}
        onClick={testVoiceConnection}
        fullWidth
        sx={{ mb: 2 }}
      >
        Test Voice Connection
      </Button>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {debugInfo.length > 0 && (
        <Box sx={{ 
          bgcolor: 'grey.900', 
          color: 'common.white',
          p: 2,
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          whiteSpace: 'pre-wrap',
          maxHeight: 400,
          overflow: 'auto'
        }}>
          {debugInfo.map((info, index) => (
            <div key={index}>{info}</div>
          ))}
        </Box>
      )}
    </Paper>
  );
};