import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  useTheme,
  Skeleton,
  Stack,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import HealingIcon from '@mui/icons-material/Healing';
import FaceIcon from '@mui/icons-material/Face';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TestimonialCarousel from '../components/TestimonialCarousel';
import BeforeAfterGallery from '../components/BeforeAfterGallery';
import ServiceComparison from '../components/ServiceComparison';
import EnhancedUnifiedHero from '../components/EnhancedUnifiedHero';
import EnhancedServiceCard from '../components/EnhancedServiceCard';
import GradientMesh from '../components/effects/GradientMesh';
import NoiseTexture from '../components/effects/NoiseTexture';
import AnimatedGradientBorder from '../components/effects/AnimatedGradientBorder';



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


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <ScrollProgress />
      
      {/* Enhanced Unified Hero Section with Rich Visual Effects */}
      <EnhancedUnifiedHero onNavigate={navigate} />

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
                  {loading ? (
                    <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                  ) : (
                    <EnhancedServiceCard
                      icon={service.icon}
                      title={service.title}
                      description={service.description}
                      path={service.path}
                      highlight={service.highlight}
                      color={service.color}
                      onNavigate={navigate}
                      index={index}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Specialized Care Centers Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                mb: 2,
              }}
            >
              Specialized Care Centers
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ 
                mb: { xs: 4, md: 8 }, 
                maxWidth: 700, 
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
              }}
            >
              Explore our dedicated centers for specialized treatments and aesthetic services
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              {
                title: 'TMJ & Orofacial Pain Center',
                description: 'Comprehensive diagnosis and treatment for jaw disorders and facial pain',
                path: '/tmj',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                features: ['Expert TMJ diagnosis', 'Custom treatment plans', 'Pain management'],
              },
              {
                title: 'Dental Implants Center',
                description: 'State-of-the-art implant solutions with traditional expertise',
                path: '/implants',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                features: ['Single & full arch', 'Bone grafting', 'Lifetime warranty'],
              },
              {
                title: 'Robotic Surgery Center',
                description: 'Advanced Yomi robotic technology for precise implant placement',
                path: '/robotic',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                features: ['Computer-guided precision', 'Minimally invasive', '50% faster healing'],
              },
              {
                title: 'MedSpa & Aesthetics',
                description: 'Non-invasive facial rejuvenation and aesthetic treatments',
                path: '/medspa',
                gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                features: ['EMFACE treatments', 'Facial contouring', 'Anti-aging solutions'],
              },
              {
                title: 'AboutFace Aesthetics',
                description: 'Advanced facial aesthetics and smile design treatments',
                path: '/aboutface',
                gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                features: ['Smile makeovers', 'Veneers', 'Teeth whitening'],
              },
            ].map((center, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                  onClick={() => navigate(center.path)}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 6,
                      background: center.gradient,
                    }}
                  />
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 2 }}
                    >
                      {center.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      {center.description}
                    </Typography>
                    <List dense>
                      {center.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                    <Button
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 2,
                        background: center.gradient,
                        color: 'white',
                        '&:hover': {
                          background: center.gradient,
                          filter: 'brightness(1.1)',
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
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
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <GradientMesh 
          colors={['#818cf8', '#c084fc', '#f472b6', '#60a5fa']}
          opacity={0.2}
          animate={true}
        />
        <NoiseTexture opacity={0.02} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
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
                <AnimatedGradientBorder
                  borderRadius={24}
                  colors={['#fbbf24', '#f59e0b', '#d97706', '#fbbf24']}
                  borderWidth={2}
                >
                  <Chip
                    label="NEW TECHNOLOGY"
                    sx={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                      color: 'black',
                      fontWeight: 800,
                      fontSize: '1rem',
                      py: 2.5,
                      px: 3,
                      border: 'none',
                      boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)',
                    }}
                  />
                </AnimatedGradientBorder>
              </motion.div>
              
              <Typography 
                variant="h2" 
                fontWeight={800} 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                  mt: 4,
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 30%, #f472b6 60%, #34d399 100%)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'gradient-shift 6s ease infinite',
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                }}
              >
                Try Our AI Smile Simulator
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 6, 
                  opacity: 0.9, 
                  maxWidth: 800, 
                  mx: 'auto',
                  fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              >
                See your perfect smile in seconds with our advanced AI technology. 
                Upload a photo and visualize your transformation instantly!
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={() => navigate('/smile-simulator')}
                      sx={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        color: 'white',
                        py: 2.5,
                        px: 6,
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        boxShadow: '0 20px 40px rgba(96, 165, 250, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 25px 50px rgba(96, 165, 250, 0.4)',
                        },
                      }}
                    >
                      Try Simulator Now
                    </Button>
                  </Box>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <AnimatedGradientBorder
                    borderRadius={12}
                    borderWidth={2}
                    colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.3)']}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/services')}
                      sx={{
                        border: 'none',
                        color: 'white',
                        py: 2.5,
                        px: 6,
                        fontSize: '1.3rem',
                        fontWeight: 600,
                        borderRadius: 1.5,
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                        },
                      }}
                    >
                      View All Services
                    </Button>
                  </AnimatedGradientBorder>
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
          py: { xs: 10, md: 14 },
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <GradientMesh 
          colors={['#667eea', '#764ba2', '#f687b3', '#818cf8']}
          opacity={0.25}
          animate={true}
        />
        <NoiseTexture opacity={0.03} />
        
        {/* Animated light beams */}
        <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: '100%',
                left: `${20 + i * 30}%`,
                width: 2,
                height: '150%',
                background: `linear-gradient(to top, transparent 0%, rgba(167, 139, 250, 0.6) 50%, transparent 100%)`,
                transform: 'rotate(-15deg)',
              }}
              animate={{
                top: ['-50%', '100%'],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8,
                delay: i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </Box>
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <AnimatedGradientBorder
              borderRadius={32}
              borderWidth={3}
              colors={['#60a5fa', '#a78bfa', '#f472b6', '#34d399']}
              animationDuration={5}
            >
              <Box sx={{ py: 6, px: { xs: 3, sm: 6 }, background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(20px)', borderRadius: 4 }}>
                <Typography 
                  variant="h2" 
                  fontWeight={800} 
                  gutterBottom
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 30%, #f472b6 60%, #34d399 100%)',
                    backgroundSize: '300% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'gradient-shift 8s ease infinite',
                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  Ready to Experience the Future of Dental Care?
                </Typography>
                <Typography 
                  variant="h5" 
                  paragraph 
                  sx={{ 
                    mb: 6, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' },
                    maxWidth: 700,
                    mx: 'auto',
                  }}
                >
                  Join thousands of satisfied patients who have transformed their smiles 
                  with our advanced robotic technology and expert care.
                </Typography>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/contact')}
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 28 }} />}
                      sx={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        color: 'white',
                        py: 3,
                        px: 8,
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(96, 165, 250, 0.4)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 25px 50px rgba(96, 165, 250, 0.5)',
                        },
                      }}
                    >
                      Schedule Your Consultation
                    </Button>
                  </Box>
                </motion.div>

                {/* Trust badges */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  justifyContent="center"
                  sx={{ mt: 6 }}
                >
                  {[
                    '✅ Free Consultation',
                    '🏆 Top Rated Practice',
                    '💎 Premium Technology',
                  ].map((badge, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <Chip
                        label={badge}
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontSize: '1rem',
                          py: 3,
                          px: 2,
                          fontWeight: 600,
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </AnimatedGradientBorder>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default EnhancedHomePage;