import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import { LuxuryNavigationIcon, LuxuryExploreIcon, LuxuryEmergencyIcon, LuxurySparkleIcon } from './icons/LuxuryIcons';
import { CalendarMonth } from '@mui/icons-material';
import { BookAppointmentButton } from './BookAppointmentButton';

// Removed ParticleField component for performance optimization

const LuxuryCareConciergeHero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setMode, setShowCenterSelector, addToJourneyPath } = useAdaptiveNavigation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Parallax transforms
  const titleX = useTransform(smoothMouseX, [-400, 400], [-20, 20]);
  const titleY = useTransform(smoothMouseY, [-400, 400], [-10, 10]);
  const subtitleX = useTransform(smoothMouseX, [-400, 400], [-10, 10]);
  const subtitleY = useTransform(smoothMouseY, [-400, 400], [-5, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleKnowWhatINeed = () => {
    setMode('exploring');
    setShowCenterSelector(true);
    addToJourneyPath('direct-selection');
  };

  const handleHelpMeExplore = () => {
    setMode('exploring');
    addToJourneyPath('guided-exploration');
    window.dispatchEvent(new CustomEvent('openAIQuestionnaire'));
  };

  const handleEmergencyCare = () => {
    setMode('emergency');
    addToJourneyPath('emergency-care');
    window.location.href = '/contact?emergency=true';
  };

  const entryPoints = [
    {
      title: "I Know What I Need",
      subtitle: "Direct access to our specialized centers",
      icon: <LuxuryNavigationIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: handleKnowWhatINeed,
      delay: 0,
    },
    {
      title: "Help Me Explore",
      subtitle: "Let us guide you to the right treatment",
      icon: <LuxuryExploreIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
      action: handleHelpMeExplore,
      delay: 0.1,
    },
    {
      title: "Emergency Care",
      subtitle: "Immediate assistance for urgent dental needs",
      icon: <LuxuryEmergencyIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
      action: handleEmergencyCare,
      delay: 0.2,
    },
  ];

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        minHeight: { xs: '100vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)',
      }}
    >
      {/* Animated gradient background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'var(--gradient-aurora)',
          backgroundSize: '400% 400%',
          animation: 'aurora 20s ease infinite',
          opacity: 0.05,
          filter: 'blur(100px)',
        }}
      />
      
      {/* Particle system - removed for performance */}
      
      {/* Floating orbs - optimized blur for performance */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'var(--gradient-luxury)',
          filter: 'blur(40px)',
          opacity: 0.2,
          animation: 'float 8s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'var(--gradient-holographic)',
          filter: 'blur(50px)',
          opacity: 0.15,
          animation: 'float 10s ease-in-out infinite reverse',
          willChange: 'transform',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          {/* Luxury sparkle icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 80,
                mb: 4,
                position: 'relative',
              }}
            >
              <LuxurySparkleIcon 
                sx={{ 
                  fontSize: 64,
                  filter: 'drop-shadow(0 8px 32px rgba(102, 126, 234, 0.4))',
                }} 
              />
            </Box>
          </motion.div>

          {/* Animated title with parallax */}
          <motion.div
            style={{ x: titleX, y: titleY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                mb: 3,
                background: 'var(--gradient-luxury)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease infinite',
              }}
            >
              Welcome to Your Care Journey
            </Typography>
          </motion.div>

          {/* Animated subtitle */}
          <motion.div
            style={{ x: subtitleX, y: subtitleY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'var(--font-secondary)',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                fontWeight: 300,
                color: 'text.secondary',
                letterSpacing: '0.02em',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Experience the future of dental care with our intelligent navigation system
            </Typography>
          </motion.div>
        </Box>

        {/* Luxury entry cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {entryPoints.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6 + entry.delay,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -10 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card
                onClick={entry.action}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    '& .entry-gradient': {
                      opacity: 1,
                    },
                    '& .entry-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
                {/* Gradient overlay */}
                <Box
                  className="entry-gradient"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: entry.gradient,
                    opacity: hoveredCard === index ? 1 : 0.7,
                    transition: 'opacity 0.3s ease',
                  }}
                />
                
                {/* Glow effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -50,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 200,
                    height: 200,
                    background: entry.gradient,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    opacity: hoveredCard === index ? 0.3 : 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                  }}
                />

                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    className="entry-icon"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      height: 80,
                      transition: 'transform 0.3s ease',
                      position: 'relative',
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: entry.gradient, 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        filter: hoveredCard === index ? 'drop-shadow(0 4px 20px rgba(102, 126, 234, 0.4))' : 'none',
                        transition: 'filter 0.3s ease',
                      }}
                    >
                      {React.cloneElement(entry.icon, { sx: { fontSize: 64 } })}
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '1.8rem' },
                      color: 'var(--luxury-black)',
                      mb: 2,
                    }}
                  >
                    {entry.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{
                      fontFamily: 'var(--font-secondary)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    {entry.subtitle}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      background: entry.gradient,
                      color: 'white',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 600,
                      fontSize: '1rem',
                      letterSpacing: '0.02em',
                      px: 4,
                      py: 1.5,
                      borderRadius: '50px',
                      textTransform: 'none',
                      boxShadow: 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: entry.gradient,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Direct Booking Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              textAlign: 'center',
              p: { xs: 4, md: 6 },
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                mb: 2,
                color: 'var(--luxury-black)',
              }}
            >
              Ready to Book Your Appointment?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontFamily: 'var(--font-secondary)',
              }}
            >
              Skip the exploration and book directly with our award-winning dental team
            </Typography>
            <BookAppointmentButton
              size="large"
              sx={{
                background: 'var(--gradient-luxury)',
                color: 'white',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 600,
                fontSize: '1.1rem',
                letterSpacing: '0.02em',
                px: 5,
                py: 2,
                borderRadius: '50px',
                textTransform: 'none',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'var(--gradient-luxury)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)',
                },
              }}
            />
          </Box>
        </motion.div>

      </Container>
    </Box>
  );
};

export default LuxuryCareConciergeHero;