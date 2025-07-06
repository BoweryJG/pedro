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
import '../styles/luxury-design-system.css';

// Lightweight center data
const centers = [
  {
    id: 'tmj',
    title: 'TMJ & Orofacial Pain',
    subtitle: 'Expert jaw disorder care',
    icon: '🦷',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stats: { label: 'Patients Treated', value: '2,500+' },
    features: ['Custom Oral Appliances', 'Physical Therapy', 'Pain Management'],
  },
  {
    id: 'implants',
    title: 'Dental Implants',
    subtitle: 'Permanent tooth replacement',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    stats: { label: 'Success Rate', value: '99.2%' },
    features: ['Single & Full Arch', 'Bone Grafting', 'Lifetime Warranty'],
  },
  {
    id: 'robotic',
    title: 'Robotic Surgery',
    subtitle: 'Precision implant placement',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    stats: { label: 'Healing Time', value: '50% Faster' },
    features: ['Computer Precision', 'Minimally Invasive', 'Yomi Technology'],
  },
  {
    id: 'medspa',
    title: 'MedSpa & Aesthetics',
    subtitle: 'Facial rejuvenation',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    stats: { label: 'Treatments', value: '10,000+' },
    features: ['EMFACE Technology', 'Facial Contouring', 'Anti-Aging'],
  },
  {
    id: 'aboutface',
    title: 'AboutFace Aesthetics',
    subtitle: 'Complete smile makeovers',
    icon: '😊',
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
            Choose Your Care Journey
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
            Swipe to explore our specialized centers
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
                className="glassmorphism"
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  position: 'relative',
                  background: activeIndex === index 
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: activeIndex === index 
                    ? 'rgba(255, 255, 255, 0.3)'
                    : 'rgba(255, 255, 255, 0.18)',
                  boxShadow: activeIndex === index 
                    ? '0 20px 40px rgba(0, 0, 0, 0.2)'
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translate3d(0, 0, 0)',
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                {/* Gradient Header */}
                <Box
                  sx={{
                    height: 6,
                    background: center.gradient,
                  }}
                />

                {/* Card Content */}
                <Box sx={{ p: { xs: 3, sm: 4 } }}>
                  {/* Icon and Title */}
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: center.gradient,
                        opacity: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        fontSize: 40,
                        transform: activeIndex === index ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: -2,
                          borderRadius: '50%',
                          background: center.gradient,
                          opacity: 0.3,
                          filter: 'blur(10px)',
                          transform: 'translate3d(0, 0, 0)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative', zIndex: 1 }}>{center.icon}</Box>
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                      {center.title}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {center.subtitle}
                    </Typography>
                  </Box>

                  {/* Stats */}
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(5px)',
                      WebkitBackdropFilter: 'blur(5px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {center.stats.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
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
                          mb: 0.5,
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        • {feature}
                      </Typography>
                    ))}
                  </Box>

                  {/* CTA Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: 'translate3d(0, 0, 0)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: center.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-2px) translate3d(0, 0, 0)',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
                        '&::before': {
                          opacity: 0.3,
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
        
        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </Box>
  );
};

export default CenterCarouselHero;