import React, { useState } from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import BreitlingChronomat from './watches/BreitlingChronomat';
import { useWatchTime } from '../../hooks/useWatchTime';
import { useSupabaseData, useSupabaseConnection } from '../../hooks/useSupabaseData';
import type { DataMode } from '../../types/watch.types';
import ErrorBoundary from '../ErrorBoundary';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const DentalDashboard: React.FC = () => {
  const theme = useTheme();
  const [dataMode, setDataMode] = useState<DataMode>('appointments');
  const [watchSize, setWatchSize] = useState<'small' | 'medium' | 'large'>('large');
  const [interactiveMode, setInteractiveMode] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Custom hooks
  const currentTime = useWatchTime();
  const { metrics, loading, error, lastUpdated, refetch } = useSupabaseData(realTimeUpdates);
  const { isConnected, connectionError } = useSupabaseConnection();

  const handleModeChange = (mode: DataMode) => {
    setDataMode(mode);
  };

  const getStatusColor = () => {
    if (loading) return theme.palette.warning.main;
    if (error || connectionError) return theme.palette.error.main;
    if (isConnected && metrics) return theme.palette.success.main;
    return theme.palette.grey[500];
  };

  const getStatusText = () => {
    if (loading) return 'Loading...';
    if (error) return `Error: ${error}`;
    if (connectionError) return `Connection: ${connectionError}`;
    if (isConnected && metrics) return 'Connected';
    return 'Disconnected';
  };

  // Show mock data with loading state while data is being fetched
  const displayMetrics = metrics || {
    appointments: {
      todayCount: 0,
      weeklyUpcoming: 0,
      completionRate: 0,
      averageDuration: 0,
      nextAppointment: null
    },
    patients: {
      totalActive: 0,
      newThisMonth: 0,
      satisfactionAverage: 0,
      returningPercentage: 0,
      patientOfTheDay: 'Loading...'
    },
    services: {
      totalServices: 0,
      yomiProcedures: 0,
      revenuePerService: 0,
      popularService: 'Loading...',
      bookingTrends: 0
    },
    performance: {
      dailyRevenue: 0,
      weeklyTarget: 0,
      staffProductivity: 0,
      testimonialRating: 0,
      performanceStatus: 'Loading...'
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 50%, ${theme.palette.grey[900]} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/noise.png) repeat',
          opacity: 0.02,
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 300,
                letterSpacing: '0.05em',
                mb: 0.5,
                fontFamily: 'Playfair Display, serif'
              }}
            >
              Practice Analytics Dashboard
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}
            >
              Dr. Pedro's Advanced Dentistry & Med Spa
            </Typography>
          </Box>
          
          {/* Status Indicator */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              background: 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              padding: '12px 20px',
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: getStatusColor(),
                boxShadow: `0 0 12px ${getStatusColor()}`
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                letterSpacing: '0.05em'
              }}
            >
              {getStatusText()}
            </Typography>
            {lastUpdated && (
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem'
                }}
              >
                Updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Main Watch Display */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%'
          }}
        >
          <ErrorBoundary>
            <Paper
              elevation={24}
              sx={{
                background: 'rgba(0, 0, 0, 0.02)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                padding: 4,
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mx: 'auto',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.1) 0%, transparent 60%)',
                  pointerEvents: 'none'
                }
              }}
            >
              {loading && !metrics ? (
                <LoadingState size="large" message="Initializing dashboard..." />
              ) : error ? (
                <ErrorState 
                  error={error} 
                  type="data"
                  onRetry={refetch} 
                />
              ) : connectionError ? (
                <ErrorState 
                  error={connectionError} 
                  type="connection"
                  onRetry={refetch} 
                />
              ) : (
                <BreitlingChronomat
                  model="chronomat"
                  size={watchSize}
                  dataMode={dataMode}
                  realTimeUpdates={realTimeUpdates}
                  interactiveMode={interactiveMode}
                  onModeChange={handleModeChange}
                  metrics={displayMetrics}
                  currentTime={currentTime}
                />
              )}
            </Paper>
          </ErrorBoundary>

          {/* Control Panel */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              gap: 3,
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(10px)',
              padding: 2,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap'
            }}
          >
            {/* Size Control */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                Size
              </Typography>
              <select
                value={watchSize}
                onChange={(e) => setWatchSize(e.target.value as 'small' | 'medium' | 'large')}
                style={{
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontFamily: theme.typography.fontFamily
                }}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </Box>

            {/* Data Mode Control */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                Data Mode
              </Typography>
              <select
                value={dataMode}
                onChange={(e) => setDataMode(e.target.value as DataMode)}
                style={{
                  background: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontFamily: theme.typography.fontFamily
                }}
              >
                <option value="appointments">Appointments</option>
                <option value="patients">Patients</option>
                <option value="services">Services</option>
                <option value="performance">Performance</option>
              </select>
            </Box>

            {/* Toggle Controls */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: theme.palette.text.primary,
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={interactiveMode}
                  onChange={(e) => setInteractiveMode(e.target.checked)}
                  style={{ accentColor: theme.palette.primary.main }}
                />
                Interactive Mode
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: theme.palette.text.primary,
                fontSize: '14px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={realTimeUpdates}
                  onChange={(e) => setRealTimeUpdates(e.target.checked)}
                  style={{ accentColor: theme.palette.primary.main }}
                />
                Real-time Updates
              </label>
            </Box>

            {/* Manual Refresh */}
            <button
              onClick={refetch}
              disabled={loading}
              style={{
                background: loading ? theme.palette.action.disabled : theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                border: 'none',
                borderRadius: '6px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s ease',
                fontFamily: theme.typography.fontFamily
              }}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </button>
          </Paper>

          {/* Current Time Display */}
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(10px)',
              color: theme.palette.primary.main,
              padding: '12px 24px',
              borderRadius: 2,
              border: `1px solid ${theme.palette.primary.main}20`,
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '0.1em'
            }}
          >
            Current Time: {currentTime.toLocaleTimeString()}
          </Paper>

          {/* Instructions */}
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(0, 0, 0, 0.02)',
              color: theme.palette.text.secondary,
              padding: 2,
              borderRadius: 2,
              maxWidth: 600,
              textAlign: 'center',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
              Interactive Features:
            </Typography>
            <Typography variant="caption" component="div" sx={{ lineHeight: 1.8 }}>
              • Click mode indicator to switch data views<br />
              • Use chronometer pushers to start/stop/reset timer<br />
              • Crown interaction for time adjustment (when interactive)<br />
              • Real-time data updates from practice management system
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default DentalDashboard;