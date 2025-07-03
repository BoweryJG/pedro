import React, { useState, useEffect } from 'react';
import { Box, Tooltip, Zoom } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface SystemStatus {
  api: boolean;
  instagram: boolean;
  database: boolean;
}

const LuxurySystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>({
    api: true,
    instagram: true,
    database: true,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
      const response = await axios.get(`${apiUrl}/health`, { timeout: 5000 });
      
      if (response.data) {
        setStatus({
          api: response.data.status === 'healthy',
          instagram: response.data.instagram?.status === 'connected',
          database: response.data.database?.status === 'connected',
        });
      }
    } catch (error) {
      // If backend is unreachable, only mark API as down
      setStatus(prev => ({ ...prev, api: false }));
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = status.api;
  const hasWarning = !isHealthy;
  const isOffline = !status.api;

  const getStatusColor = () => {
    if (loading) return 'rgba(102, 126, 234, 0.5)';
    if (isHealthy) return 'rgba(76, 175, 80, 0.6)';
    if (hasWarning) return 'rgba(255, 193, 7, 0.6)';
    return 'rgba(244, 67, 54, 0.6)';
  };

  const getStatusMessage = () => {
    if (loading) return 'Checking system status...';
    if (isHealthy) return 'All systems operational';
    if (isOffline) return 'System offline';
    
    return 'Backend offline - Chat may be unavailable';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
      }}
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <Tooltip
            title={getStatusMessage()}
            placement="left"
            arrow
            TransitionComponent={Zoom}
            sx={{
              '& .MuiTooltip-tooltip': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                color: 'var(--luxury-black)',
                fontFamily: 'var(--font-secondary)',
                fontSize: '0.875rem',
                fontWeight: 500,
                padding: '12px 20px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              },
              '& .MuiTooltip-arrow': {
                color: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            <Box
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                cursor: 'pointer',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -4,
                  borderRadius: '50%',
                  background: getStatusColor(),
                  filter: 'blur(12px)',
                  opacity: isHovered ? 0.8 : 0.6,
                  transition: 'all 0.3s ease',
                  animation: loading || !isHealthy ? 'pulse 2s infinite' : 'none',
                },
              }}
            >
              {/* Outer ring */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent, ' + getStatusColor() + ', transparent)',
                  animation: loading ? 'spin 2s linear infinite' : 'none',
                  opacity: 0.8,
                }}
              />
              
              {/* Inner orb */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 4,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: getStatusColor(),
                    boxShadow: `0 0 20px ${getStatusColor()}`,
                    animation: loading || !isHealthy ? 'pulse 2s infinite' : 'none',
                  },
                }}
              />

              {/* Hover effect */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      border: `2px solid ${getStatusColor()}`,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </AnimatePresence>
            </Box>
          </Tooltip>
        </motion.div>
      </AnimatePresence>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { 
              opacity: 0.6;
              transform: scale(1);
            }
            50% { 
              opacity: 0.8;
              transform: scale(1.1);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default LuxurySystemStatus;