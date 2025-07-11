import React from 'react';
import { Alert, AlertTitle, Box, Container, Typography, Paper, Chip } from '@mui/material';
import { Error as ErrorIcon, Warning as WarningIcon } from '@mui/icons-material';

class EnvironmentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      isEnvError: false 
    };
  }

  static getDerivedStateFromError(error) {
    // Check if this is an environment configuration error
    const isEnvError = error.message?.includes('environment') || 
                      error.message?.includes('VITE_') ||
                      error.message?.includes('configuration');
    
    return { 
      hasError: true, 
      error,
      isEnvError 
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.isEnvError) {
        return (
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ mb: 3 }}
            >
              <AlertTitle>Environment Configuration Error</AlertTitle>
              The application cannot start due to missing or invalid environment variables.
            </Alert>

            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                How to fix this:
              </Typography>
              
              <Box component="ol" sx={{ pl: 2 }}>
                <Typography component="li" sx={{ mb: 1 }}>
                  Copy <Chip label=".env.example" size="small" /> to <Chip label=".env" size="small" /> in the frontend directory
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Fill in the required environment variables
                </Typography>
                <Typography component="li" sx={{ mb: 1 }}>
                  Restart the development server
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mt: 3 }} icon={<WarningIcon />}>
                <Typography variant="body2">
                  <strong>Required variable:</strong> VITE_API_URL (e.g., http://localhost:3001/api)
                </Typography>
              </Alert>

              {import.meta.env.DEV && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                    {this.state.error?.stack}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Container>
        );
      }

      // Generic error fallback
      return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Alert>
          
          {import.meta.env.DEV && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                {this.state.error?.stack}
              </Typography>
            </Box>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}

export default EnvironmentErrorBoundary;