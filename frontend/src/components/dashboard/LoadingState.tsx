import React from 'react';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading dashboard data...', 
  size = 'medium' 
}) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 3
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: sizeMap[size] + 40,
          height: sizeMap[size] + 40,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CircularProgress 
          size={sizeMap[size]} 
          thickness={3}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
          className="loading-spinner"
        />
        
        {/* Luxury watch-style loading indicator */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent, rgba(0, 255, 136, 0.1), transparent)',
            animation: 'rotate 3s linear infinite',
            opacity: 0.5
          }}
        />
      </Paper>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
          letterSpacing: '0.05em',
          animation: 'pulse 2s ease-in-out infinite'
        }}
      >
        {message}
      </Typography>

      {/* Loading dots */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${index * 0.2}s`,
              opacity: 0.6
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoadingState;