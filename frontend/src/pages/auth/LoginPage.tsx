import React, { useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { Google } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, user, isAuthorized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAuthorized) {
      navigate('/dr-pedro/dashboard');
    }
  }, [user, isAuthorized, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          animation: 'float 15s ease-in-out infinite',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite reverse',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card
          sx={{
            maxWidth: 480,
            width: '90vw',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top gradient bar */}
          <Box
            sx={{
              height: 6,
              background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
            }}
          />

          <CardContent sx={{ p: 6 }}>
            <Box textAlign="center" mb={4}>
              {/* Watch icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: 'white',
                  }}
                >
                  DP
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '1.75rem', md: '2.125rem' },
                }}
              >
                Dr. Pedro's Command Center
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  mb: 4,
                }}
              >
                Access your practice analytics dashboard
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGoogleSignIn}
              startIcon={<Google />}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'white',
                color: '#1a1a1a',
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: '#f5f5f5',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Sign in with Google
            </Button>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
                mt: 3,
              }}
            >
              Authorized staff only. Access is restricted to approved accounts.
            </Typography>
          </CardContent>
        </Card>
      </motion.div>

      {/* Floating animation styles */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-50px) scale(1.1); }
          }
        `}
      </style>
    </Box>
  );
};

export default LoginPage;