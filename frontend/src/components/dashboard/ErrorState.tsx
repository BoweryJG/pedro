import React from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { Warning, Refresh, WifiOff, ErrorOutline } from '@mui/icons-material';

interface ErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
  type?: 'connection' | 'data' | 'auth' | 'general';
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry,
  type = 'general' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  const getErrorIcon = () => {
    switch (type) {
      case 'connection':
        return <WifiOff sx={{ fontSize: 48, color: 'error.main' }} />;
      case 'auth':
        return <ErrorOutline sx={{ fontSize: 48, color: 'warning.main' }} />;
      case 'data':
        return <Warning sx={{ fontSize: 48, color: 'error.main' }} />;
      default:
        return <Warning sx={{ fontSize: 48, color: 'error.main' }} />;
    }
  };

  const getErrorTitle = () => {
    switch (type) {
      case 'connection':
        return 'Connection Error';
      case 'auth':
        return 'Authentication Required';
      case 'data':
        return 'Data Load Error';
      default:
        return 'Something went wrong';
    }
  };

  const getErrorDescription = () => {
    switch (type) {
      case 'connection':
        return 'Unable to connect to the server. Please check your internet connection.';
      case 'auth':
        return 'You need to be logged in to access this dashboard.';
      case 'data':
        return 'Failed to load dashboard data. The server might be experiencing issues.';
      default:
        return errorMessage || 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: type === 'auth' 
            ? 'rgba(251, 191, 36, 0.05)' 
            : 'rgba(239, 68, 68, 0.05)',
          border: type === 'auth'
            ? '1px solid rgba(251, 191, 36, 0.2)'
            : '1px solid rgba(239, 68, 68, 0.2)'
        }}
        className={type !== 'auth' ? 'error-pulse' : ''}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: type === 'auth'
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.1), transparent)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.1), transparent)',
            pointerEvents: 'none'
          }}
        />

        {getErrorIcon()}
        
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            mt: 2,
            color: type === 'auth' ? 'warning.main' : 'error.main',
            fontWeight: 600
          }}
        >
          {getErrorTitle()}
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ mb: 3, lineHeight: 1.6 }}
        >
          {getErrorDescription()}
        </Typography>

        {/* Additional error details for development */}
        {process.env.NODE_ENV === 'development' && errorMessage !== getErrorDescription() && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              textAlign: 'left',
              '& .MuiAlert-message': {
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }
            }}
          >
            {errorMessage}
          </Alert>
        )}

        {onRetry && (
          <Button
            variant="contained"
            color={type === 'auth' ? 'warning' : 'primary'}
            startIcon={<Refresh />}
            onClick={onRetry}
            sx={{ 
              mt: 2,
              px: 3,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
              letterSpacing: '0.025em'
            }}
          >
            {type === 'auth' ? 'Go to Login' : 'Try Again'}
          </Button>
        )}

        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: type === 'auth' ? 'warning.main' : 'error.main',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      </Paper>
    </Box>
  );
};

export default ErrorState;