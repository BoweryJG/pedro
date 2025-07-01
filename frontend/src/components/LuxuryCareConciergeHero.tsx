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

// Particle system component
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
        ctx.fill();
        
        // Draw connections
        particles.forEach((otherParticle) => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) +
            Math.pow(particle.y - otherParticle.y, 2)
          );
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};

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
      subtitle: "AI-guided recommendations based on your needs",
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
      
      {/* Particle system */}
      <ParticleField />
      
      {/* Floating orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'var(--gradient-luxury)',
          filter: 'blur(80px)',
          opacity: 0.3,
          animation: 'float 8s ease-in-out infinite',
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
          filter: 'blur(100px)',
          opacity: 0.2,
          animation: 'float 10s ease-in-out infinite reverse',
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
                width: 80,
                height: 80,
                mb: 4,
                borderRadius: '50%',
                background: 'var(--gradient-luxury)',
                boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: -20,
                  borderRadius: '50%',
                  background: 'var(--gradient-luxury)',
                  opacity: 0.3,
                  filter: 'blur(20px)',
                  animation: 'pulse-glow 3s infinite',
                },
              }}
            >
              <LuxurySparkleIcon sx={{ color: 'white', fontSize: 40 }} />
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
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: 'rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      transition: 'transform 0.3s ease',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -2,
                        borderRadius: '50%',
                        background: entry.gradient,
                        opacity: hoveredCard === index ? 0.5 : 0,
                        filter: 'blur(10px)',
                        transition: 'opacity 0.3s ease',
                      },
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: entry.gradient, 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      {entry.icon}
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

      </Container>
    </Box>
  );
};

export default LuxuryCareConciergeHero;