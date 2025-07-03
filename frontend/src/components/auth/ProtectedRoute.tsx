import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isAuthorized } = useAuth();
  
  // Check for direct access bypass
  const hasDirectAccess = localStorage.getItem('directAccess') === 'true';

  if (loading && !hasDirectAccess) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#22c55e' }} />
      </Box>
    );
  }

  if (!hasDirectAccess && !user) {
    return <Navigate to="/dr-pedro/login" replace />;
  }

  if (!hasDirectAccess && !isAuthorized) {
    return <Navigate to="/dr-pedro/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;