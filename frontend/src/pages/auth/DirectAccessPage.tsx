import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const DirectAccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a temporary auth token in localStorage
    localStorage.setItem('directAccess', 'true');
    localStorage.setItem('userEmail', 'jasonwilliamgolden@gmail.com');
  }, []);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Direct Access Enabled
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Bypassing Supabase auth due to browser issues
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/dr-pedro/dashboard')}
        sx={{ mr: 2 }}
      >
        Go to Dashboard
      </Button>
      <Button
        variant="outlined"
        onClick={() => navigate('/dr-pedro/sms')}
      >
        Go to SMS Queue
      </Button>
    </Box>
  );
};

export default DirectAccessPage;