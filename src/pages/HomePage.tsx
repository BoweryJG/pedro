import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Stack,
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

const HomePage = () => {
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
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
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 2,
                    background: 'linear-gradient(45deg, #1e40af 30%, #7c3aed 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  The Future of Dental Care is Here
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  paragraph
                  sx={{ mb: 3 }}
                >
                  Staten Island's only practice with Yomi robotic surgery. 
                  Experience precision, comfort, and faster healing.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/contact')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                    }}
                  >
                    Book Consultation
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/yomi-robotic-surgery')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                    }}
                  >
                    Learn About Yomi
                  </Button>
                </Stack>
              </motion.div>
            </Box>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 300, md: 500 },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -20,
                      right: -20,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(45deg, #1e40af 30%, #7c3aed 90%)',
                      borderRadius: 4,
                      opacity: 0.1,
                      transform: 'rotate(3deg)',
                    },
                  }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 4,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                      alt="Advanced Dental Technology"
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 20,
                        left: 20,
                        right: 20,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Chip
                        label="Staten Island Exclusive"
                        color="primary"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="h6" fontWeight={600}>
                        Yomi Robotic Dental Surgery
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Precision technology for optimal results
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

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