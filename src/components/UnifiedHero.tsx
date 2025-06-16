import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface UnifiedHeroProps {
  onNavigate: (path: string) => void;
}

const UnifiedHero: React.FC<UnifiedHeroProps> = ({ onNavigate }) => {
  const highlights = [
    { text: '50% Faster Healing', icon: '⚡' },
    { text: 'Robot-Assisted Surgery', icon: '🤖' },
    { text: 'Same-Day Consultations', icon: '📅' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '90vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              label="Staten Island's Only Yomi-Certified Practice"
              sx={{
                mb: 3,
                px: 2,
                py: 0.5,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                color: '#60a5fa',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            />
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                mb: 2,
                color: 'white',
              }}
            >
              Experience
              <Box
                component="span"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  ml: { sm: 1 },
                }}
              >
                Precision Dentistry
              </Box>
            </Typography>
          </motion.div>

          {/* Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 400,
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Advanced robotic surgery, TMJ relief, and facial rejuvenation 
              with Dr. Pedro
            </Typography>
          </motion.div>

          {/* Integrated Stats/Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1, sm: 2 }}
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 5 }}
            >
              {highlights.map((highlight, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <Box sx={{ fontSize: '1.25rem' }}>{highlight.icon}</Box>
                  <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}>
                    {highlight.text}
                  </Typography>
                  {index < highlights.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'block' },
                        width: 1,
                        height: 20,
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        mx: 2,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => onNavigate('/contact')}
                sx={{
                  py: { xs: 1.75, sm: 2 },
                  px: { xs: 4, sm: 5 },
                  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  minWidth: { xs: 250, sm: 'auto' },
                  '&:hover': {
                    boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Schedule Free Consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => onNavigate('/smile-simulator')}
                sx={{
                  py: { xs: 1.75, sm: 2 },
                  px: { xs: 4, sm: 5 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  minWidth: { xs: 250, sm: 'auto' },
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Try AI Smile Simulator
              </Button>
            </Stack>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 3, sm: 4 }}
              justifyContent="center"
              sx={{ mt: 6, color: 'rgba(255, 255, 255, 0.6)' }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 700, color: 'white' }}>
                  2000+
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Happy Patients
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 700, color: 'white' }}>
                  4.9★
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Google Rating
                </Typography>
              </Box>
              <Box sx={{ width: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.5rem', sm: '2rem' }, fontWeight: 700, color: 'white' }}>
                  15+
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                  Years Experience
                </Typography>
              </Box>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default UnifiedHero;