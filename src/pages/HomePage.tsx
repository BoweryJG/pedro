import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
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
import EnhancedHero from '../components/EnhancedHero';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });

  const services = [
    {
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 40 }} />,
      title: 'Yomi Robotic Surgery',
      description: 'The only robot-assisted dental surgery system in Staten Island. Experience precision like never before with 50% faster healing.',
      path: '/yomi-robotic-surgery',
      highlight: true,
    },
    {
      icon: <HealingIcon sx={{ fontSize: 40 }} />,
      title: 'TMJ Treatment',
      description: 'Comprehensive TMJ disorder treatment with proven results. End your jaw pain with our specialized approach.',
      path: '/tmj-treatment',
    },
    {
      icon: <FaceIcon sx={{ fontSize: 40 }} />,
      title: 'EMFACE by BTL',
      description: 'Revolutionary non-invasive facial rejuvenation. Lift, tone, and contour without needles or downtime.',
      path: '/emface-mfa',
    },
  ];

  const stats = [
    { value: '50%', label: 'Faster Healing', icon: <TimerIcon /> },
    { value: '100%', label: 'Precision Rate', icon: <VerifiedIcon /> },
    { value: '2000+', label: 'Happy Patients', icon: <TrendingUpIcon /> },
  ];

  return (
    <Box>
      {/* Enhanced Hero Section */}
      <EnhancedHero onNavigate={navigate} />

      {/* Stats Section */}
      <Box
        ref={statsRef}
        sx={{
          py: 8,
          background: 'linear-gradient(to right, #1e40af, #7c3aed)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {stats.map((stat, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { md: '33.333%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box textAlign="center">
                    <Box sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h2" fontWeight={700} gutterBottom>
                      {stat.value}
                    </Typography>
                    <Typography variant="h6">
                      {stat.label}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box ref={featuresRef} sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Our Advanced Services
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
            >
              Combining cutting-edge technology with compassionate care
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {services.map((service, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { md: '33.333%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'visible',
                      ...(service.highlight && {
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }),
                    }}
                    onClick={() => navigate(service.path)}
                  >
                    {service.highlight && (
                      <Chip
                        label="Most Popular"
                        color="primary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: 20,
                        }}
                      />
                    )}
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          color: 'primary.main',
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        {service.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        fontWeight={600}
                      >
                        {service.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        align="center"
                        paragraph
                      >
                        {service.description}
                      </Typography>
                      <Box textAlign="center" mt={3}>
                        <Button
                          endIcon={<ArrowForwardIcon />}
                          color="primary"
                        >
                          Learn More
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <TestimonialCarousel />
        </Container>
      </Box>

      {/* AI Simulator CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '60%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            transform: 'rotate(-30deg)',
          }
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <Chip
                label="NEW"
                color="warning"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Try Our AI Smile Simulator
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, maxWidth: 600, mx: 'auto' }}>
                See your perfect smile in seconds with our advanced AI technology. 
                Upload a photo and visualize your transformation instantly!
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoAwesomeIcon />}
                  onClick={() => navigate('/smile-simulator')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                    },
                  }}
                >
                  Try Simulator Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/services')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  View All Services
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Before/After Gallery */}
      <BeforeAfterGallery />

      {/* Service Comparison */}
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <ServiceComparison />
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready to Experience the Future of Dental Care?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of satisfied patients who have transformed their smiles with our advanced technology.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              py: 2,
              px: 5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            Schedule Your Consultation
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;