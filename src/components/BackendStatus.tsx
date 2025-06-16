import { useState, useEffect } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { healthCheck } from '../services/api';

const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [backendInfo, setBackendInfo] = useState<any>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await healthCheck();
        if (response) {
          setStatus('online');
          setBackendInfo(response);
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
        console.error('Backend check failed:', error);
      }
    };

    checkBackend();
    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Chip 
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 
                  status === 'online' ? '#4caf50' : 
                  status === 'offline' ? '#f44336' : 
                  '#ff9800',
              }}
            />
            <Typography variant="caption">
              Backend: {status}
            </Typography>
          </Box>
        }
        variant="outlined"
        size="small"
      />
      {backendInfo && status === 'online' && (
        <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
          {backendInfo.message}
        </Box>
      )}
    </Box>
  );
};

export default BackendStatus;