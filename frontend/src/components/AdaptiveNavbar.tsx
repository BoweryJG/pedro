import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import EmergencyIcon from '@mui/icons-material/Emergency';

const centerConfig = {
  tmj: {
    name: 'TMJ Center',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🦷',
  },
  implants: {
    name: 'Implants Center',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⚙️',
  },
  robotic: {
    name: 'Robotic Surgery',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🤖',
  },
  medspa: {
    name: 'MedSpa',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '✨',
  },
  aboutface: {
    name: 'AboutFace',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: '😊',
  },
};

const AdaptiveNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, currentCenter, setShowCenterSelector, setMode, setCurrentCenter } = useAdaptiveNavigation();
  const [scrolled, setScrolled] = useState(false);

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
    if (path.startsWith('/tmj')) {
      setMode('center-focused');
      setCurrentCenter('tmj');
    } else if (path.startsWith('/implants')) {
      setMode('center-focused');
      setCurrentCenter('implants');
    } else if (path.startsWith('/robotic')) {
      setMode('center-focused');
      setCurrentCenter('robotic');
    } else if (path.startsWith('/medspa')) {
      setMode('center-focused');
      setCurrentCenter('medspa');
    } else if (path.startsWith('/aboutface')) {
      setMode('center-focused');
      setCurrentCenter('aboutface');
    }
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
      sx={{
        background: scrolled
          ? alpha(theme.palette.background.default, 0.95)
          : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        boxShadow: scrolled ? theme.shadows[4] : 'none',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, md: 80 } }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              onClick={handleHome}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <LocalHospitalIcon
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  color: theme.palette.primary.main,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Dr. Pedro
              </Typography>
            </Box>
          </motion.div>

          {/* Center indicator when in center-focused mode */}
          <AnimatePresence>
            {mode === 'center-focused' && currentCenter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ marginLeft: 24 }}
              >
                <Chip
                  label={centerConfig[currentCenter].name}
                  icon={<span style={{ fontSize: 20 }}>{centerConfig[currentCenter].icon}</span>}
                  sx={{
                    background: centerConfig[currentCenter].gradient,
                    color: 'white',
                    fontWeight: 600,
                    py: 2.5,
                    px: 2,
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* Adaptive Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            {mode === 'minimal' && (
              <motion.div
                key="minimal"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ExploreIcon />}
                  onClick={handleChooseCare}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46a1 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  {isMobile ? 'Choose Care' : 'Choose Your Care'}
                </Button>
              </motion.div>
            )}

            {mode === 'center-focused' && (
              <motion.div
                key="center-focused"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', gap: 16 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<HomeIcon />}
                  onClick={handleHome}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                  }}
                >
                  Home
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ExploreIcon />}
                  onClick={handleChooseCare}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  Switch Center
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emergency Button - Always visible */}
          <IconButton
            onClick={handleEmergency}
            sx={{
              background: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              '&:hover': {
                background: alpha(theme.palette.error.main, 0.2),
                transform: 'scale(1.1)',
              },
            }}
          >
            <EmergencyIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdaptiveNavbar;