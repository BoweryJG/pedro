import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Fade,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import HomeIcon from '@mui/icons-material/Home';
import { LuxuryMedicalIcon, LuxuryExploreIcon, LuxuryEmergencyIcon, LuxurySparkleIcon } from './icons/LuxuryIcons';

// Enhanced center configuration with luxury branding
const centerConfig = {
  tmj: {
    name: 'TMJ Excellence Center',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🦷',
    glow: 'rgba(102, 126, 234, 0.3)',
  },
  implants: {
    name: 'Implant Artistry',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⚙️',
    glow: 'rgba(240, 147, 251, 0.3)',
  },
  robotic: {
    name: 'Robotic Precision',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🤖',
    glow: 'rgba(79, 172, 254, 0.3)',
  },
  medspa: {
    name: 'MedSpa Luxury',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '✨',
    glow: 'rgba(250, 112, 154, 0.3)',
  },
  aboutface: {
    name: 'AboutFace Elite',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: '😊',
    glow: 'rgba(168, 237, 234, 0.3)',
  },
};

const LuxuryAdaptiveNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, currentCenter, setShowCenterSelector, setMode, setCurrentCenter } = useAdaptiveNavigation();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Determine current center from URL
  useEffect(() => {
    const path = location.pathname;
    Object.keys(centerConfig).forEach((key) => {
      if (path.startsWith(`/${key}`)) {
        setMode('center-focused');
        setCurrentCenter(key as any);
      }
    });
  }, [location, setMode, setCurrentCenter]);

  const handleChooseCare = () => {
    setShowCenterSelector(true);
  };

  const handleEmergency = () => {
    setMode('emergency');
    navigate('/contact?emergency=true');
  };

  const handleHome = () => {
    setMode('minimal');
    navigate('/');
  };

  return (
    <AppBar
      position="fixed"
      ref={navRef}
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: scrolled
            ? 'rgba(250, 250, 250, 0.8)'
            : 'rgba(250, 250, 250, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '-200%',
          left: '-50%',
          width: '200%',
          height: '400%',
          background: 'var(--gradient-aurora)',
          backgroundSize: '300% 300%',
          opacity: scrolled ? 0.1 : 0,
          animation: 'none',
          pointerEvents: 'none',
          transition: 'opacity 0.6s ease',
          zIndex: -1,
        },
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 70, md: 90 }, position: 'relative' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Luxury Logo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.05 }}
          >
            <Box
              onClick={handleHome}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 2,
                  background: 'var(--gradient-luxury)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              <LuxuryMedicalIcon
                sx={{
                  fontSize: 42,
                  background: 'var(--gradient-luxury)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'drop-shadow(0 4px 16px rgba(102, 126, 234, 0.5))',
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', md: '1.8rem' },
                  letterSpacing: '-0.02em',
                  background: 'var(--gradient-luxury)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                }}
              >
                Dr. Pedro
              </Typography>
            </Box>
          </motion.div>

          {/* Luxury Center Indicator */}
          <AnimatePresence>
            {mode === 'center-focused' && currentCenter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -20 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ marginLeft: 32 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    padding: '2px',
                    borderRadius: '50px',
                    background: centerConfig[currentCenter].gradient,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50px',
                      padding: '2px',
                      background: centerConfig[currentCenter].gradient,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      animation: 'pulse-glow 3s infinite',
                    },
                  }}
                >
                  <Chip
                    label={centerConfig[currentCenter].name}
                    icon={
                      <Box
                        sx={{
                          fontSize: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {centerConfig[currentCenter].icon}
                      </Box>
                    }
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      color: 'var(--luxury-black)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      letterSpacing: '0.02em',
                      py: 3,
                      px: 3,
                      border: 'none',
                      '& .MuiChip-icon': {
                        marginLeft: '8px',
                        marginRight: '4px',
                      },
                    }}
                  />
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Luxury Navigation Actions */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {mode === 'minimal' && (
              <motion.div
                key="minimal"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box
                    onClick={handleChooseCare}
                    sx={{
                      position: 'relative',
                      cursor: 'pointer',
                      padding: '3px',
                      borderRadius: '50px',
                      background: 'var(--gradient-luxury)',
                      backgroundSize: '200% 200%',
                      animation: 'none',
                      boxShadow: '0 4px 30px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 8px 40px rgba(102, 126, 234, 0.5)',
                        animation: 'none',
                      },
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<LuxurySparkleIcon sx={{ fontSize: 24 }} />}
                      sx={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--luxury-black)',
                        px: { xs: 3, md: 4 },
                        py: { xs: 1.5, md: 2 },
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        borderRadius: '50px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.98)',
                          boxShadow: 'none',
                        },
                        '& .MuiButton-startIcon': {
                          color: 'var(--luxury-gold)',
                        },
                      }}
                    >
                      {isMobile ? 'Begin' : 'Begin Your Journey'}
                    </Button>
                  </Box>
                </motion.div>
              </motion.div>
            )}

            {mode === 'center-focused' && (
              <motion.div
                key="center-focused"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: 'flex', gap: 16 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={handleHome}
                  sx={{
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    color: 'var(--luxury-black)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                    borderRadius: '50px',
                    px: 3,
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                      background: 'rgba(255, 255, 255, 0.7)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Home
                </Button>
                <Box
                  sx={{
                    position: 'relative',
                    padding: '2px',
                    borderRadius: '50px',
                    background: 'var(--gradient-luxury)',
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<LuxuryExploreIcon sx={{ fontSize: 24 }} />}
                    onClick={handleChooseCare}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: 'var(--luxury-black)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 600,
                      borderRadius: '50px',
                      px: 3,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.98)',
                      },
                    }}
                  >
                    Switch Center
                  </Button>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luxury Emergency Button */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <IconButton
              onClick={handleEmergency}
              sx={{
                padding: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'transparent',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <LuxuryEmergencyIcon 
                sx={{ 
                  fontSize: 28,
                  filter: 'drop-shadow(0 2px 8px rgba(255, 61, 87, 0.3))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    filter: 'drop-shadow(0 4px 16px rgba(255, 61, 87, 0.5))',
                  },
                }} 
              />
            </IconButton>
          </motion.div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LuxuryAdaptiveNavbar;