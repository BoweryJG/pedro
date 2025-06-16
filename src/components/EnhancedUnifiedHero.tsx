import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  alpha,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
  Timer as TimerIcon,
  PrecisionManufacturing as RobotIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import GradientMesh from './effects/GradientMesh';
import NoiseTexture from './effects/NoiseTexture';
import ParticlesBackground from './effects/ParticlesBackground';
import AnimatedGradientBorder from './effects/AnimatedGradientBorder';
import SoftAnimatedIcon from './effects/SoftAnimatedIcon';

interface EnhancedUnifiedHeroProps {
  onNavigate: (path: string) => void;
}

const EnhancedUnifiedHero: React.FC<EnhancedUnifiedHeroProps> = ({ onNavigate }) => {
  const highlights = [
    { text: '50% Faster Healing', icon: <TimerIcon />, gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' },
    { text: 'Robot-Assisted Surgery', icon: <RobotIcon />, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' },
    { text: 'Same-Day Consultations', icon: <CalendarIcon />, gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: '100vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0a0e27 0%, #0f172a 50%, #1e293b 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Layered background effects */}
      <GradientMesh 
        colors={['#1e40af', '#7c3aed', '#ec4899', '#06b6d4']}
        opacity={0.15}
        animate={true}
      />
      
      <ParticlesBackground 
        count={40}
        colors={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']}
        opacity={0.4}
      />
      
      <NoiseTexture opacity={0.03} />
      
      {/* Animated gradient orbs */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 1000, mx: 'auto' }}>
          {/* Premium Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedGradientBorder
              borderRadius={24}
              colors={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']}
              borderWidth={2}
            >
              <Chip
                icon={<AutoAwesomeIcon />}
                label="Staten Island's Only Yomi-Certified Practice"
                sx={{
                  px: 3,
                  py: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  color: 'white',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: '#fbbf24',
                  },
                }}
              />
            </AnimatedGradientBorder>
          </motion.div>

          {/* Main Headline with rich gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                mt: 4,
                color: 'white',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Experience
              <Box
                component="span"
                sx={{
                  display: { xs: 'block', sm: 'inline' },
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 30%, #f472b6 60%, #34d399 100%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  ml: { sm: 2 },
                  animation: 'gradient-shift 6s ease infinite',
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                Precision Dentistry
              </Box>
            </Typography>
          </motion.div>

          {/* Enhanced Subheadline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                mb: 5,
                maxWidth: 800,
                mx: 'auto',
                lineHeight: 1.6,
                textShadow: '0 2px 10px rgba(0,0,0,0.2)',
              }}
            >
              Advanced robotic surgery, TMJ relief, and facial rejuvenation 
              with Dr. Pedro
            </Typography>
          </motion.div>

          {/* Enhanced Highlights with animated icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              justifyContent="center"
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ flex: 1 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha('#000', 0.3)}, ${alpha('#000', 0.1)})`,
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha('#fff', 0.1)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha('#000', 0.4)}, ${alpha('#000', 0.2)})`,
                        borderColor: alpha('#fff', 0.2),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 30px ${alpha('#000', 0.3)}`,
                      },
                    }}
                  >
                    <SoftAnimatedIcon
                      icon={highlight.icon}
                      gradient={highlight.gradient}
                      size={24}
                      animate={false}
                    />
                    <Typography 
                      sx={{ 
                        color: 'white',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                      }}
                    >
                      {highlight.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>

          {/* Enhanced CTA Buttons */}
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
              <Box sx={{ position: 'relative' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate('/contact')}
                  sx={{
                    py: { xs: 2, sm: 2.5 },
                    px: { xs: 5, sm: 6 },
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 25px 50px rgba(59, 130, 246, 0.5)',
                    },
                  }}
                >
                  Schedule Free Consultation
                </Button>
              </Box>
              
              <AnimatedGradientBorder
                borderRadius={24}
                borderWidth={2}
                colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.1)']}
              >
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => onNavigate('/smile-simulator')}
                  sx={{
                    py: { xs: 2, sm: 2.5 },
                    px: { xs: 5, sm: 6 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    fontWeight: 600,
                    border: 'none',
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                    },
                  }}
                >
                  Try AI Smile Simulator
                </Button>
              </AnimatedGradientBorder>
            </Stack>
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 2, sm: 4 }}
              justifyContent="center"
              sx={{ mt: 8 }}
            >
              {[
                { value: '2000+', label: 'Happy Patients' },
                { value: '4.9★', label: 'Google Rating' },
                { value: '15+', label: 'Years Experience' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.05)}`,
                    }}
                  >
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '1.75rem', sm: '2.25rem' },
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      sx={{ 
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default EnhancedUnifiedHero;