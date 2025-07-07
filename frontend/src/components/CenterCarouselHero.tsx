import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { TMJIcon, ImplantsIcon, RoboticIcon, MedSpaIcon, AboutFaceIcon } from './icons/SpectrumIcons';
import '../styles/luxury-design-system.css';

// Icon mapping for centers
const centerIcons = {
  tmj: TMJIcon,
  implants: ImplantsIcon,
  robotic: RoboticIcon,
  medspa: MedSpaIcon,
  aboutface: AboutFaceIcon,
};

// Lightweight center data
const centers = [
  {
    id: 'tmj',
    title: 'TMJ & Orofacial Pain',
    subtitle: 'Expert jaw disorder care',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stats: { label: 'Patients Treated', value: '2,500+' },
    features: ['Custom Oral Appliances', 'Physical Therapy', 'Pain Management'],
  },
  {
    id: 'implants',
    title: 'Dental Implants',
    subtitle: 'Permanent tooth replacement',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stats: { label: 'Success Rate', value: '99.2%' },
    features: ['Single & Full Arch', 'Bone Grafting', 'Lifetime Warranty'],
  },
  {
    id: 'robotic',
    title: 'Robotic Surgery',
    subtitle: 'Precision implant placement',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    stats: { label: 'Healing Time', value: '50% Faster' },
    features: ['Computer Precision', 'Minimally Invasive', 'Yomi Technology'],
  },
  {
    id: 'medspa',
    title: 'MedSpa & Aesthetics',
    subtitle: 'Facial rejuvenation',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    stats: { label: 'Treatments', value: '10,000+' },
    features: ['EMFACE Technology', 'Facial Contouring', 'Anti-Aging'],
  },
  {
    id: 'aboutface',
    title: 'AboutFace Aesthetics',
    subtitle: 'Complete smile makeovers',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    stats: { label: 'Google Rating', value: '5.0★' },
    features: ['Veneers', 'Teeth Whitening', 'Smile Design'],
  },
];

const CenterCarouselHero: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setCurrentCenter, setMode, addToJourneyPath } = useAdaptiveNavigation();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showFeatures, setShowFeatures] = useState<number | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Handle card click
  const handleCardClick = (centerId: string, index: number) => {
    if (showFeatures === index) {
      // Navigate on second click
      setCurrentCenter(centerId as any);
      setMode('center-focused');
      addToJourneyPath(`selected-${centerId}`);
      navigate(`/${centerId}`);
    } else {
      // Show features on first click
      setShowFeatures(index);
    }
  };

  // Update active index based on scroll position
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    
    const carousel = carouselRef.current;
    const scrollLeft = carousel.scrollLeft;
    const cardWidth = carousel.offsetWidth * 0.8; // 80% width cards
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      setShowFeatures(null);
    }
  }, [activeIndex]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !carouselRef.current) return;

    autoPlayRef.current = setInterval(() => {
      if (!carouselRef.current) return;
      
      const nextIndex = (activeIndex + 1) % centers.length;
      const cardWidth = carouselRef.current.offsetWidth * 0.8;
      
      carouselRef.current.scrollTo({
        left: nextIndex * cardWidth,
        behavior: 'smooth',
      });
    }, 8000); // Increased interval to reduce CPU usage

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [activeIndex, isAutoPlaying]);

  // Pause auto-play on interaction
  const handleInteractionStart = () => {
    setIsAutoPlaying(false);
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleInteractionEnd = () => {
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  // Setup intersection observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.5 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Box
      className="hero-spectrum spectrum-mesh"
      sx={{
        position: 'relative',
        minHeight: { xs: '100vh', md: '90vh' },
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Hero Particles */}
      <Box className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            className="particle"
            sx={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </Box>
      
      {/* Floating Service Orbs */}
      {centers.map((center, index) => (
        <Box
          key={`orb-${center.id}`}
          sx={{
            position: 'absolute',
            width: { xs: 60, md: 80 },
            height: { xs: 60, md: 80 },
            borderRadius: '50%',
            background: center.gradient,
            opacity: 0.3,
            filter: 'blur(40px)',
            left: `${20 + (index * 15)}%`,
            top: `${20 + (index % 2 ? 30 : 10)}%`,
            animation: `float-subtle ${20 + index * 2}s ease-in-out infinite`,
            animationDelay: `${index * 0.5}s`,
            transform: 'translate3d(0, 0, 0)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Header Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 6 }, pb: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            label="Staten Island's Premier Dental Excellence"
            className="glassmorphism"
            sx={{
              mb: 2,
              px: 2,
              py: 0.5,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          />
          
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 800,
              mb: 1,
              color: 'white',
            }}
          >
            Discover Your Path to Excellence
          </Typography>
          
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 400,
              mb: 2,
            }}
          >
            Explore our world-class specialties and revolutionary treatments
          </Typography>

          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'rgba(255, 255, 255, 0.5)' }}>
              <TouchAppIcon sx={{ fontSize: 20 }} />
              <Typography variant="caption">Swipe or tap cards</Typography>
            </Box>
          )}
        </Box>
      </Container>

      {/* Carousel Container */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Box
          ref={carouselRef}
          className="carousel-container"
          onScroll={handleScroll}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          sx={{
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            px: { xs: '10%', md: '10%' },
            py: 3,
            gap: { xs: 2, md: 3 },
            // Ensure first and last cards can center
            '&::before, &::after': {
              content: '""',
              flex: '0 0 auto',
              width: { xs: '10%', md: '10%' },
            },
          }}
        >
          {centers.map((center, index) => (
            <Box
              key={center.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="carousel-card"
              onClick={() => handleCardClick(center.id, index)}
              sx={{
                flex: '0 0 auto',
                width: { xs: '80%', md: '80%' },
                maxWidth: 400,
                scrollSnapAlign: 'center',
                cursor: 'pointer',
                transform: `scale(${activeIndex === index ? 1 : 0.9})`,
                opacity: activeIndex === index ? 1 : 0.7,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&.visible': {
                  animation: 'fadeInUp 0.6s ease-out',
                },
              }}
            >
              <Box
                className="glassmorphism luxury-carousel-card"
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: activeIndex === index 
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)'
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: activeIndex === index 
                    ? `3px solid transparent`
                    : '2px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: activeIndex === index 
                    ? `0 30px 80px rgba(0, 0, 0, 0.2), 0 0 120px ${center.gradient.match(/#[0-9a-fA-F]{6}/g)?.[0] || '#667eea'}40, inset 0 1px 0 rgba(255, 255, 255, 0.8)`
                    : '0 20px 50px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  padding: '3px',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    padding: '3px',
                    background: activeIndex === index 
                      ? center.gradient
                      : `linear-gradient(135deg, ${center.gradient}, rgba(255, 255, 255, 0.3))`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: activeIndex === index ? 1 : 0.6,
                    transition: 'opacity 0.5s ease',
                    filter: 'blur(0.5px)',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.03) translate3d(0, 0, 0)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 0.98) 100%)',
                    border: `3px solid transparent`,
                    boxShadow: `0 50px 120px rgba(0, 0, 0, 0.25), 0 0 180px ${center.gradient.match(/#[0-9a-fA-F]{6}/g)?.[0] || '#667eea'}50, inset 0 1px 0 rgba(255, 255, 255, 1)`,
                    '&::before': {
                      opacity: 1,
                      background: center.gradient,
                    },
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                {/* Removed gradient header - using pulsating border instead */}

                {/* Card Content */}
                <Box sx={{ p: { xs: 4, sm: 5 } }}>
                  {/* Icon and Title */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        background: `${center.gradient}, rgba(255, 255, 255, 0.1)`,
                        backgroundBlendMode: 'overlay',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        transform: activeIndex === index ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        boxShadow: activeIndex === index 
                          ? `0 0 40px rgba(255, 255, 255, 0.4), 0 0 80px rgba(255, 255, 255, 0.2), 0 20px 40px rgba(0, 0, 0, 0.3)`
                          : '0 0 20px rgba(255, 255, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.3)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -20,
                          borderRadius: '50%',
                          background: center.gradient,
                          opacity: activeIndex === index ? 0.5 : 0.3,
                          filter: 'blur(30px)',
                          transform: 'translate3d(0, 0, 0)',
                          transition: 'opacity 0.3s ease',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: -10,
                          borderRadius: '50%',
                          background: center.gradient,
                          opacity: 0.2,
                          filter: 'blur(20px)',
                          transform: 'translate3d(0, 0, 0)',
                        },
                        '&:hover': {
                          transform: 'scale(1.2)',
                          boxShadow: `0 0 50px rgba(255, 255, 255, 0.5), 0 0 100px rgba(255, 255, 255, 0.3), 0 25px 50px rgba(0, 0, 0, 0.4)`,
                          '&::before': {
                            opacity: 0.6,
                          },
                        },
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'relative', 
                          zIndex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          filter: `drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))`,
                          '& svg': {
                            width: 64,
                            height: 64,
                            color: 'white',
                            '& g': {
                              stroke: `url(#gradient-${center.id})`,
                              '& circle': {
                                fill: `url(#gradient-${center.id})`,
                              },
                            },
                            filter: activeIndex === index 
                              ? 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))'
                              : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          },
                        }}
                      >
                        {React.createElement(centerIcons[center.id as keyof typeof centerIcons], { 
                          size: 64,
                          className: `center-icon ${activeIndex === index ? 'active-icon' : ''}`
                        })}
                      </Box>
                    </Box>
                    
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 800, 
                        mb: 1, 
                        background: center.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: { xs: '1.75rem', sm: '2.25rem' },
                        textShadow: 'none',
                        letterSpacing: '-0.02em',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      }}
                    >
                      {center.title}
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(30, 41, 59, 0.8)',
                        fontSize: { xs: '1rem', sm: '1.125rem' },
                        textShadow: 'none',
                        fontWeight: 500,
                      }}
                    >
                      {center.subtitle}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2.5,
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${center.gradient}15, rgba(255, 255, 255, 0.4))`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `2px solid ${center.gradient}30`,
                      mb: 3,
                      boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 4px 12px ${center.gradient}20`,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(30, 41, 59, 0.7)',
                        fontSize: '0.875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {center.stats.label}
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 800, 
                        background: center.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontSize: { xs: '1.5rem', sm: '1.75rem' },
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                      }}
                    >
                      {center.stats.value}
                    </Typography>
                  </Box>

                  {/* Features (show on tap/click) */}
                  <Box
                    sx={{
                      overflow: 'hidden',
                      maxHeight: showFeatures === index ? 200 : 0,
                      transition: 'max-height 0.3s ease',
                      mb: showFeatures === index ? 2 : 0,
                    }}
                  >
                    {center.features.map((feature, idx) => (
                      <Typography
                        key={idx}
                        variant="body2"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          color: 'rgba(30, 41, 59, 0.8)',
                          fontSize: '1rem',
                          fontWeight: 500,
                          textShadow: 'none',
                        }}
                      >
                        <Box component="span" sx={{ background: center.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mr: 1, fontWeight: 800 }}>•</Box> {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* CTA Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: center.gradient,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: 'none',
                      color: 'white',
                      py: 2,
                      px: 3,
                      fontSize: '1.125rem',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translate3d(0, 0, 0)',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                      boxShadow: `0 8px 24px ${center.gradient}40, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-3px) translate3d(0, 0, 0)',
                        boxShadow: `0 16px 40px ${center.gradient}60, inset 0 1px 0 rgba(255, 255, 255, 0.5)`,
                        filter: 'brightness(1.1)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {showFeatures === index ? 'Enter Center' : 'Learn More'}
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Progress Indicators */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 1,
            pb: 3,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {centers.map((center, index) => (
            <Box
              key={index}
              sx={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: activeIndex === index 
                  ? center.gradient
                  : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                '&::after': activeIndex === index ? {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: center.gradient,
                  filter: 'blur(8px)',
                  opacity: 0.5,
                  transform: 'translate3d(0, 0, 0)',
                } : {},
              }}
              onClick={() => {
                if (carouselRef.current) {
                  const cardWidth = carouselRef.current.offsetWidth * 0.8;
                  carouselRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth',
                  });
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes borderPulse {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 300% 50%;
          }
        }
        
        /* GPU Optimization */
        .hero-spectrum {
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        .carousel-container {
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
        }
        
        .carousel-card {
          transform: translate3d(0, 0, 0);
          -webkit-transform: translate3d(0, 0, 0);
        }
        
        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .hero-particles {
            display: none;
          }
          
          .glassmorphism {
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
          }
        }
        
        /* Icon specific styles */
        .center-icon {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .center-icon:hover {
          transform: rotate(5deg) scale(1.05);
        }
        
        /* Pulsing animation for active icon */
        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
        
        .active-icon {
          animation: iconPulse 2s ease-in-out infinite;
        }
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* SVG Gradient Definitions for Icons */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          {centers.map((center) => {
            const gradientId = `gradient-${center.id}`;
            const colors = center.gradient.match(/#[0-9a-fA-F]{6}/g) || ['#000', '#fff'];
            return (
              <linearGradient key={gradientId} id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: colors[0], stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: colors[1], stopOpacity: 1 }} />
              </linearGradient>
            );
          })}
        </defs>
      </svg>
    </Box>
  );
};

export default CenterCarouselHero;