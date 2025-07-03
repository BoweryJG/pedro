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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { LuxuryMedicalIcon, LuxuryExploreIcon, LuxuryEmergencyIcon, LuxurySparkleIcon } from './icons/LuxuryIcons';

// Enhanced center configuration with better colors
const centerConfig = {
  tmj: {
    name: 'TMJ Excellence',
    shortName: 'TMJ',
    gradient: 'linear-gradient(135deg, #5E60CE 0%, #5390D9 100%)',
    color: '#5E60CE',
    icon: '🦷',
  },
  implants: {
    name: 'Implant Artistry',
    shortName: 'Implants',
    gradient: 'linear-gradient(135deg, #7209B7 0%, #B5179E 100%)',
    color: '#7209B7',
    icon: '⚙️',
  },
  robotic: {
    name: 'Robotic Surgery',
    shortName: 'Robotic',
    gradient: 'linear-gradient(135deg, #006BA2 0%, #0496FF 100%)',
    color: '#006BA2',
    icon: '🤖',
  },
  medspa: {
    name: 'MedSpa Elite',
    shortName: 'MedSpa',
    gradient: 'linear-gradient(135deg, #F72585 0%, #FF006E 100%)',
    color: '#F72585',
    icon: '✨',
  },
  aboutface: {
    name: 'AboutFace',
    shortName: 'AboutFace',
    gradient: 'linear-gradient(135deg, #3A0CA3 0%, #7209B7 100%)',
    color: '#3A0CA3',
    icon: '😊',
  },
};

const EnhancedLuxuryNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, currentCenter, setShowCenterSelector, setMode, setCurrentCenter } = useAdaptiveNavigation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Technology', path: '/yomi' },
    { label: 'Results', path: '/smile-simulator' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar
      position="fixed"
      ref={navRef}
      sx={{
        background: 'transparent',
        boxShadow: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: scrolled
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: scrolled 
            ? '1px solid rgba(0, 0, 0, 0.08)' 
            : '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: -1,
        },
      }}
    >
      <Toolbar sx={{ 
        minHeight: { xs: 64, md: 80 }, 
        px: { xs: 2, md: 4 },
        position: 'relative' 
      }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 0 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            <Box
              onClick={handleHome}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                py: 1,
                pr: 3,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '0%',
                  height: 2,
                  background: currentCenter 
                    ? centerConfig[currentCenter].gradient
                    : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: currentCenter 
                    ? centerConfig[currentCenter].gradient
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(-5deg)',
                    boxShadow: '0 6px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Typography sx={{ fontSize: 24 }}>
                  {currentCenter ? centerConfig[currentCenter].icon : '🦷'}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontWeight: 800,
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    letterSpacing: '-0.02em',
                    color: scrolled ? '#1a1a1a' : '#2d2d2d',
                    lineHeight: 1,
                  }}
                >
                  Dr. Pedro
                </Typography>
                {currentCenter && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      color: centerConfig[currentCenter].color,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {centerConfig[currentCenter].shortName}
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            justifyContent: 'center',
            gap: 1,
          }}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.4, 0, 0.2, 1] 
                }}
              >
                <Button
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: scrolled ? '#2d2d2d' : '#424242',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    letterSpacing: '0.02em',
                    px: 2,
                    py: 1,
                    borderRadius: '8px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: scrolled ? '#000' : '#1a1a1a',
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 2,
                      background: currentCenter 
                        ? centerConfig[currentCenter].gradient
                        : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.3s ease',
                    },
                    '&:hover::before': {
                      width: '80%',
                    },
                    ...(location.pathname === item.path && {
                      color: currentCenter 
                        ? centerConfig[currentCenter].color
                        : '#667eea',
                      fontWeight: 600,
                      '&::before': {
                        width: '80%',
                      },
                    }),
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {!isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  variant="outlined"
                  onClick={handleChooseCare}
                  sx={{
                    borderColor: scrolled ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                    color: scrolled ? '#2d2d2d' : '#424242',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 3,
                    py: 1,
                    borderRadius: '25px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: currentCenter 
                        ? centerConfig[currentCenter].color
                        : '#667eea',
                      color: currentCenter 
                        ? centerConfig[currentCenter].color
                        : '#667eea',
                      backgroundColor: 'rgba(102,126,234,0.05)',
                    },
                  }}
                >
                  Explore Centers
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate('/contact')}
                  sx={{
                    background: currentCenter 
                      ? centerConfig[currentCenter].gradient
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    px: 3,
                    py: 1,
                    borderRadius: '25px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Book Consultation
                </Button>
              </motion.div>
            </>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{
                color: scrolled ? '#2d2d2d' : '#424242',
                transition: 'all 0.3s ease',
              }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                bgcolor: 'rgba(255,255,255,0.98)',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                py: 2,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  fullWidth
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    justifyContent: 'flex-start',
                    px: 4,
                    py: 1.5,
                    color: '#2d2d2d',
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Box sx={{ px: 2, pt: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    navigate('/contact');
                    setMobileMenuOpen(false);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '25px',
                    py: 1.5,
                  }}
                >
                  Book Consultation
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </AppBar>
  );
};