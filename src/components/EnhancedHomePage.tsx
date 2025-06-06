import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HealingIcon from '@mui/icons-material/Healing';
import FaceIcon from '@mui/icons-material/Face';
import TimerIcon from '@mui/icons-material/Timer';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TestimonialCarousel from '../components/TestimonialCarousel';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import ServiceComparison from '../components/ServiceComparison';
import UnifiedHero from '../components/UnifiedHero';

// Animated counter component
const AnimatedCounter = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Floating elements for AI section
const FloatingElements = () => {
  const elements = [
    { icon: '🧠', size: 40, x: '10%', y: '20%', duration: 15 },
    { icon: '✨', size: 30, x: '80%', y: '15%', duration: 20 },
    { icon: '🦷', size: 35, x: '70%', y: '70%', duration: 18 },
    { icon: '💡', size: 25, x: '20%', y: '60%', duration: 22 },
    { icon: '🔬', size: 30, x: '90%', y: '40%', duration: 17 },
  ];

  return (
    <>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: el.x,
            top: el.y,
            fontSize: el.size,
            zIndex: 0,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {el.icon}
        </motion.div>
      ))}
    </>
  );
};

// Progress bar component
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(to right, #1e40af, #7c3aed)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 1300,
      }}
    />
  );
};

// Wave divider component
const WaveDivider = ({ flip = false, color = '#ffffff' }) => (
  <Box
    sx={{
      position: 'absolute',
      bottom: flip ? 'auto' : -1,
      top: flip ? -1 : 'auto',
      left: 0,
      right: 0,
      height: 60,
      overflow: 'hidden',
      transform: flip ? 'rotate(180deg)' : 'none',
    }}
  >
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 0, width: '100%', height: '100%' }}
    >
      <path
        d="M0,30 Q300,0 600,30 T1200,30 L1200,60 L0,60 Z"
        fill={color}
      />
    </svg>
  </Box>
);

const EnhancedHomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const services = [
    {
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 40 }} />,
      title: 'Yomi Robotic Surgery',
      description: 'The only robot-assisted dental surgery system in Staten Island. Experience precision like never before with 50% faster healing.',
      path: '/yomi-robotic-surgery',
      highlight: true,
      color: '#1e40af',
    },
    {
      icon: <HealingIcon sx={{ fontSize: 40 }} />,
      title: 'TMJ Treatment',
      description: 'Comprehensive TMJ disorder treatment with proven results. End your jaw pain with our specialized approach.',
      path: '/tmj-treatment',
      color: '#7c3aed',
    },
    {
      icon: <FaceIcon sx={{ fontSize: 40 }} />,
      title: 'EMFACE by BTL',
      description: 'Revolutionary non-invasive facial rejuvenation. Lift, tone, and contour without needles or downtime.',
      path: '/emface-mfa',
      color: '#ec4899',
    },
  ];

  const stats = [
    { value: 50, suffix: '%', label: 'Faster Healing', icon: <TimerIcon /> },
    { value: 100, suffix: '%', label: 'Precision Rate', icon: <VerifiedIcon /> },
    { value: 2000, suffix: '+', label: 'Happy Patients', icon: <TrendingUpIcon /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <ScrollProgress />
      
      {/* Unified Hero Section with Integrated Stats */}
      <UnifiedHero onNavigate={navigate} />

      {/* Enhanced Services Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default', position: 'relative' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Our Advanced Services
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ 
                mb: { xs: 4, md: 8 }, 
                maxWidth: 600, 
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}
            >
              Combining cutting-edge technology with compassionate care
            </Typography>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {services.map((service, index) => (
                <Box sx={{ flex: '1 1 100%', maxWidth: { md: '33.333%' } }} key={index}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      transition: { type: 'spring', stiffness: 300 },
                    }}
                  >
                    {loading ? (
                      <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                    ) : (
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'visible',
                          background: `linear-gradient(135deg, ${alpha(service.color, 0.05)} 0%, transparent 100%)`,
                          border: service.highlight ? `2px solid ${service.color}` : '1px solid',
                          borderColor: service.highlight ? service.color : 'divider',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: service.color,
                            boxShadow: `0 10px 40px ${alpha(service.color, 0.2)}`,
                            '& .service-icon': {
                              transform: 'rotate(360deg)',
                            },
                          },
                        }}
                        onClick={() => navigate(service.path)}
                      >
                        {service.highlight && (
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Chip
                              label="Most Popular"
                              sx={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                background: `linear-gradient(135deg, ${service.color} 0%, ${alpha(service.color, 0.8)} 100%)`,
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </motion.div>
                        )}
                        <CardContent sx={{ p: 4 }}>
                          <Box
                            className="service-icon"
                            sx={{
                              color: service.color,
                              mb: 3,
                              display: 'flex',
                              justifyContent: 'center',
                              transition: 'transform 0.6s ease',
                            }}
                          >
                            {service.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            align="center" 
                            gutterBottom 
                            fontWeight={600}
                            sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } }}
                          >
                            {service.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                            paragraph
                            sx={{ 
                              mb: 3,
                              fontSize: { xs: '0.875rem', sm: '1rem' }
                            }}
                          >
                            {service.description}
                          </Typography>
                          <Box textAlign="center">
                            <Button
                              endIcon={<ArrowForwardIcon />}
                              sx={{
                                color: service.color,
                                '&:hover': {
                                  background: alpha(service.color, 0.1),
                                },
                              }}
                            >
                              Learn More
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced Testimonials Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.background.default} 100%)`,
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TestimonialCarousel />
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced AI Simulator CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <FloatingElements />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: 'spring' }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Chip
                  label="NEW"
                  color="warning"
                  sx={{
                    mb: 3,
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 2,
                    px: 3,
                  }}
                />
              </motion.div>
              
              <Typography 
                variant="h2" 
                fontWeight={800} 
                gutterBottom
                sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
              >
                Try Our AI Smile Simulator
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 6, 
                  opacity: 0.95, 
                  maxWidth: 700, 
                  mx: 'auto',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                }}
              >
                See your perfect smile in seconds with our advanced AI technology. 
                Upload a photo and visualize your transformation instantly!
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<AutoAwesomeIcon />}
                    onClick={() => navigate('/smile-simulator')}
                    sx={{
                      bgcolor: 'white',
                      color: '#818cf8',
                      py: 2,
                      px: 5,
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      '&:hover': {
                        bgcolor: 'grey.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    Try Simulator Now
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/services')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      borderWidth: 2,
                      py: 2,
                      px: 5,
                      fontSize: '1.2rem',
                      borderRadius: 3,
                      backdropFilter: 'blur(10px)',
                      background: alpha('#ffffff', 0.1),
                      '&:hover': {
                        borderColor: 'white',
                        background: alpha('#ffffff', 0.2),
                        borderWidth: 2,
                      },
                    }}
                  >
                    View All Services
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
        
        <WaveDivider color={theme.palette.grey[50]} />
      </Box>

      {/* Enhanced Before/After Gallery with Parallax */}
      <Box sx={{ position: 'relative', bgcolor: theme.palette.grey[50] }}>
        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <BeforeAfterGallery />
        </motion.div>
      </Box>

      {/* Service Comparison */}
      <Box sx={{ bgcolor: 'background.default', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ServiceComparison />
          </motion.div>
        </Container>
      </Box>

      {/* Enhanced Final CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: `
            linear-gradient(135deg, ${alpha('#667eea', 0.95)} 0%, ${alpha('#764ba2', 0.95)} 100%),
            url('/images/office-pattern.jpg')
          `,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          }}
        />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h2" 
              fontWeight={800} 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' } }}
            >
              Ready to Experience the Future of Dental Care?
            </Typography>
            <Typography 
              variant="h5" 
              paragraph 
              sx={{ 
                mb: 6, 
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              Join thousands of satisfied patients who have transformed their smiles with our advanced technology.
            </Typography>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/contact')}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  py: 2.5,
                  px: 6,
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  borderRadius: 4,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
                  },
                }}
              >
                Schedule Your Consultation
              </Button>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default EnhancedHomePage;