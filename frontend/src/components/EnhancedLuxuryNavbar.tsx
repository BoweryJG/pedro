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
import { CornerScrews, cartierScrewStyles } from './effects/CartierScrews';

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
  console.log('🚨 NAVBAR v2 - CACHE BUST - ', new Date().toISOString());
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
    console.log('🚨 Centers button clicked');
    console.log('🚨 Current showCenterSelector value:', showCenterSelector);
    console.log('🚨 Setting showCenterSelector to true');
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
    { label: 'Technology', path: '/robotic' },
    { label: 'Results', path: '/smile-simulator' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <AppBar
      position="fixed"
      ref={navRef}
      sx={{
        zIndex: 9999, // Force navbar to be on top
        background: scrolled
          ? 'rgba(255, 255, 255, 0.98)'
          : 'rgba(255, 255, 255, 0.95)',
        boxShadow: scrolled
          ? '0 4px 20px rgba(0, 0, 0, 0.08)'
          : '0 2px 10px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        width: '100%',
        left: 0,
        right: 0,
        // Add explicit container padding
        px: { xs: 2, sm: 3, md: 4, lg: 6 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          backdropFilter: 'blur(16px) saturate(150%)',
          WebkitBackdropFilter: 'blur(16px) saturate(150%)',
          borderBottom: scrolled 
            ? '4px solid rgba(102, 126, 234, 0.6)' 
            : '4px solid rgba(102, 126, 234, 0.5)',
          borderLeft: scrolled
            ? '4px solid rgba(102, 126, 234, 0.6)'
            : '4px solid rgba(102, 126, 234, 0.5)',
          borderRight: scrolled
            ? '4px solid rgba(102, 126, 234, 0.6)'
            : '4px solid rgba(102, 126, 234, 0.5)',
          borderTop: '2px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '0 0 16px 16px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: -1,
          boxShadow: scrolled 
            ? '0 8px 32px rgba(102, 126, 234, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.5), -4px 0 16px rgba(102, 126, 234, 0.15), 4px 0 16px rgba(102, 126, 234, 0.15)'
            : '0 4px 16px rgba(102, 126, 234, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), -3px 0 12px rgba(102, 126, 234, 0.1), 3px 0 12px rgba(102, 126, 234, 0.1)',
          // Add enhanced side shadows for visual separation
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            boxShadow: scrolled
              ? 'inset 20px 0 40px -20px rgba(102, 126, 234, 0.15), inset -20px 0 40px -20px rgba(102, 126, 234, 0.15), inset 2px 0 0 rgba(102, 126, 234, 0.2), inset -2px 0 0 rgba(102, 126, 234, 0.2)'
              : 'inset 20px 0 40px -20px rgba(102, 126, 234, 0.1), inset -20px 0 40px -20px rgba(102, 126, 234, 0.1), inset 1px 0 0 rgba(102, 126, 234, 0.15), inset -1px 0 0 rgba(102, 126, 234, 0.15)',
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -1,
          left: 0,
          right: 0,
          height: '3px',
          background: scrolled
            ? 'linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.4) 50%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1,
          filter: 'blur(1px)',
        },
      }}
    >
      {/* Cartier Corner Screws for Navbar */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: -1, // Keep screws behind interactive elements
          '& > *': {
            pointerEvents: 'none', // Screws shouldn't intercept clicks
          },
        }}
      >
        <CornerScrews
          containerWidth={typeof window !== 'undefined' ? window.innerWidth : 1920}
          containerHeight={80}
          screwSize={3.6}
          metalType="steel"
          interactive={true}
          offset={20}
        />
      </Box>
      
      <Toolbar sx={{ 
        minHeight: { xs: 64, md: 80 }, 
        px: { xs: 4, sm: 6, md: 8, lg: 12 }, // Increased padding significantly
        position: 'relative',
        maxWidth: '100%',
        mx: 'auto',
        zIndex: 1, // Ensure toolbar content is above background
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
                  boxShadow: currentCenter
                    ? `0 8px 25px ${centerConfig[currentCenter].color}40, 0 2px 8px rgba(0,0,0,0.1)`
                    : '0 8px 25px rgba(102, 126, 234, 0.25), 0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '14px',
                    background: currentCenter 
                      ? centerConfig[currentCenter].gradient
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: -1,
                    filter: 'blur(8px)',
                  },
                  '&:hover': {
                    transform: 'rotate(-5deg) scale(1.05)',
                    boxShadow: currentCenter
                      ? `0 12px 40px ${centerConfig[currentCenter].color}50, 0 4px 16px rgba(0,0,0,0.15)`
                      : '0 12px 40px rgba(102, 126, 234, 0.35), 0 4px 16px rgba(0,0,0,0.15)',
                    '&::before': {
                      opacity: 0.6,
                    },
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
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 800,
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                    letterSpacing: '-0.02em',
                    color: scrolled ? '#1a1a1a' : '#2d2d2d',
                    lineHeight: 1,
                  }}
                >
                  Dr. Greg Pedro
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
                  onClick={() => {
                    console.log(`NAVBAR CLICK: Navigating to ${item.path}`);
                    navigate(item.path);
                  }}
                  sx={{
                    color: scrolled ? '#2d2d2d' : '#424242',
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    letterSpacing: '0.02em',
                    px: { xs: 1.5, md: 2 },
                    py: 1,
                    borderRadius: '8px',
                    position: 'relative',
                    zIndex: 10, // Force buttons to be clickable
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
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
                  onMouseDown={(e) => {
                    console.log('🚨 Centers button mouse down event', e);
                  }}
                  onPointerDown={(e) => {
                    console.log('🚨 Centers button pointer down event', e);
                  }}
                  sx={{
                    borderColor: scrolled ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)',
                    color: scrolled ? '#2d2d2d' : '#424242',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 2.5,
                    py: 1,
                    borderRadius: '25px',
                    position: 'relative',
                    zIndex: 10,
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      borderColor: currentCenter 
                        ? centerConfig[currentCenter].color
                        : '#667eea',
                      color: currentCenter 
                        ? centerConfig[currentCenter].color
                        : '#667eea',
                      backgroundColor: 'rgba(102,126,234,0.05)',
                    },
                    '&:active': {
                      backgroundColor: 'rgba(102,126,234,0.15)',
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  Centers
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    // Trigger EP³ Care interface with enhanced debugging
                    console.log('🚨 EP³ Care button clicked - dispatching open-julie-chat event');
                    const event = new CustomEvent('open-julie-chat', { bubbles: true });
                    window.dispatchEvent(event);
                    
                    // Enhanced fallback: Use direct window method if available
                    setTimeout(() => {
                      // First try: Use the direct window method if available
                      if ((window as any).openJulieChat) {
                        console.log('🚨 Using direct window.openJulieChat method');
                        (window as any).openJulieChat();
                        return;
                      }
                      
                      // Second try: Look for the main Julie FAB button by checking tooltip content
                      const fabButtons = document.querySelectorAll('.MuiFab-root');
                      for (const button of fabButtons) {
                        const tooltip = button.getAttribute('title') || button.getAttribute('aria-label');
                        if (tooltip && tooltip.toLowerCase().includes('julie')) {
                          console.log('🚨 Found Julie FAB button via tooltip, clicking it');
                          (button as HTMLElement).click();
                          return;
                        }
                      }
                      
                      // Third try: Look for the button with medical services icon
                      const medicalButton = document.querySelector('[data-testid*="MedicalServices"]')?.closest('button');
                      if (medicalButton) {
                        console.log('🚨 Found Julie button via medical icon, clicking it');
                        (medicalButton as HTMLElement).click();
                        return;
                      }
                      
                      // Fourth try: Look for any large FAB button in the bottom right
                      const bottomRightFab = document.querySelector('.MuiFab-sizeLarge');
                      if (bottomRightFab) {
                        console.log('🚨 Found large FAB button, clicking it');
                        (bottomRightFab as HTMLElement).click();
                      }
                    }, 300);
                  }}
                  sx={{
                    background: currentCenter 
                      ? centerConfig[currentCenter].gradient
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    px: 2.5,
                    py: 1,
                    borderRadius: '25px',
                    position: 'relative',
                    zIndex: 10,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 30px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Connect with EP<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</sup> Care
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
                ml: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {mobileMenuOpen ? <CloseIcon sx={{ fontSize: 28 }} /> : <MenuIcon sx={{ fontSize: 28 }} />}
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
                    console.log('Mobile EP³ Care button clicked');
                    const event = new CustomEvent('open-julie-chat', { bubbles: true });
                    window.dispatchEvent(event);
                    setMobileMenuOpen(false);
                    
                    // Same fallback logic for mobile
                    setTimeout(() => {
                      if ((window as any).openJulieChat) {
                        (window as any).openJulieChat();
                        return;
                      }
                      
                      const fabButtons = document.querySelectorAll('.MuiFab-root');
                      for (const button of fabButtons) {
                        const tooltip = button.getAttribute('title') || button.getAttribute('aria-label');
                        if (tooltip && tooltip.toLowerCase().includes('julie')) {
                          (button as HTMLElement).click();
                          return;
                        }
                      }
                      
                      const bottomRightFab = document.querySelector('.MuiFab-sizeLarge');
                      if (bottomRightFab) {
                        (bottomRightFab as HTMLElement).click();
                      }
                    }, 300);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '25px',
                    py: 1.5,
                  }}
                >
                  Connect with EP<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</sup> Care
                </Button>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Cartier Screw Styles */}
      <style>{`
        ${cartierScrewStyles}
        
        /* Enhanced navbar depth and shadows */
        .MuiAppBar-root {
          border-radius: 0 0 8px 8px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.08),
            0 2px 8px rgba(0, 0, 0, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        /* Subtle depth enhancement */
        .MuiAppBar-root::before {
          box-shadow: 
            0 0 40px rgba(102, 126, 234, 0.05),
            0 0 80px rgba(102, 126, 234, 0.03);
        }
      `}</style>
    </AppBar>
  );
};

export default EnhancedLuxuryNavbar;