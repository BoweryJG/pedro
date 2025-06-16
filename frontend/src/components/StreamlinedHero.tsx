import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  LocalPhone as PhoneIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { CONTACT_INFO } from '../constants/contact';

interface StreamlinedHeroProps {
  onNavigate: (path: string) => void;
}

const StreamlinedHero: React.FC<StreamlinedHeroProps> = ({ onNavigate }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '100vh', sm: '80vh', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        overflow: 'hidden',
        py: { xs: 4, md: 0 },
      }}
    >
      {/* Subtle gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '65%' } }}>
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '3rem', md: '4rem', lg: '4.5rem' },
                fontWeight: 700,
                lineHeight: 1.2,
                mb: { xs: 2, md: 3 },
                color: 'white',
              }}
            >
              Advanced Dental Care
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mt: 1,
                }}
              >
                Powered by Robotics
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
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 400,
                mb: { xs: 3, md: 4 },
                maxWidth: 600,
                lineHeight: 1.6,
              }}
            >
              Staten Island's only Yomi-certified practice. Experience precision implants, 
              TMJ relief, and facial rejuvenation with Dr. Pedro.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1.5, sm: 2 }} 
              sx={{ mb: { xs: 3, md: 4 } }}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />}
                onClick={() => onNavigate('/contact')}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  whiteSpace: 'nowrap',
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    boxShadow: '0 15px 40px rgba(59, 130, 246, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Book Consultation
              </Button>
              <Button
                variant="outlined"
                onClick={() => onNavigate('/services')}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  px: { xs: 3, sm: 4 },
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  minWidth: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                View Services
              </Button>
            </Stack>
          </motion.div>

          {/* Simple contact info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <PhoneIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: { xs: 18, sm: 20 } }} />
              <Typography sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                Call: {CONTACT_INFO.phone.display}
              </Typography>
            </Box>
          </motion.div>
        </Box>

        {/* Clean image on the right - only on larger screens */}
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: { md: '40%', lg: '35%' },
            height: { md: 500, lg: 600 },
            display: { xs: 'none', md: 'block' },
            opacity: 0.3,
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 0.3, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ height: '100%' }}
          >
            <Box
              sx={{
                height: '100%',
                borderRadius: '0 0 0 200px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
              }}
            >
              <img
                src="/images/pedro.png"
                alt="Dental Technology"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.7,
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default StreamlinedHero;