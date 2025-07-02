import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Warning, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
              maxWidth: 600,
              textAlign: 'center',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}
            className="error-pulse"
          >
            <Warning sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            
            <Typography variant="h5" gutterBottom sx={{ color: 'error.main' }}>
              Something went wrong
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {this.state.error?.message || 'An unexpected error occurred while loading this component.'}
            </Typography>

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: 'grey.100',
                  borderRadius: 1,
                  textAlign: 'left',
                  maxHeight: 200,
                  overflow: 'auto'
                }}
              >
                <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace' }}>
                  {this.state.errorInfo.componentStack}
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{ mt: 3 }}
            >
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;