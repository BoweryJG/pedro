import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SparklesIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { usePageTitle } from '../hooks/usePageTitle';

const EmfacePage = () => {
  usePageTitle('EMFACE Treatment');
  
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true });
  const [processRef, processInView] = useInView({ triggerOnce: true });
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true });

  const benefits = [
    {
      icon: <AccessTimeIcon />,
      title: '20-Minute Sessions',
      description: 'Quick lunch-time treatments with no downtime.',
    },
    {
      icon: <FaceRetouchingNaturalIcon />,
      title: 'Natural Results',
      description: 'Lift and tone without looking "done" or frozen.',
    },
    {
      icon: <VerifiedIcon />,
      title: 'FDA Cleared',
      description: 'Clinically proven safe and effective technology.',
    },
    {
      icon: <TrendingUpIcon />,
      title: 'Long-Lasting',
      description: 'Results that improve over time and last months.',
    },
  ];

  const treatedAreas = [
    'Forehead lines and wrinkles',
    'Crow\'s feet around eyes',
    'Cheek lifting and contouring',
    'Jawline definition',
    'Overall facial muscle tone',
    'Skin texture improvement',
  ];

  const processSteps = [
    {
      title: 'Consultation',
      description: 'Personalized assessment and treatment planning',
      time: '15 min',
    },
    {
      title: 'Preparation',
      description: 'Gentle cleansing and applicator placement',
      time: '5 min',
    },
    {
      title: 'Treatment',
      description: 'Relaxing HIFES and RF energy application',
      time: '20 min',
    },
    {
      title: 'Immediate Results',
      description: 'Walk out with lifted, glowing skin',
      time: 'Instant',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #e879f9 0%, #c026d3 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="Revolutionary MFA Technology"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mb: 2,
                  }}
                  icon={<SparklesIcon sx={{ color: 'white' }} />}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                  }}
                >
                  EMFACE by BTL
                </Typography>
                <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                  The first and only needle-free procedure that simultaneously treats 
                  facial skin and muscles. Lift, tone, and rejuvenate in just 20 minutes.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      bgcolor: 'white',
                      color: 'secondary.main',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Book EMFACE Session
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    See Before & After
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
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                  }}
                >
                  <Typography variant="h3" gutterBottom fontWeight={700}>
                    95%
                  </Typography>
                  <Typography variant="h6" paragraph>
                    Patient satisfaction rate
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Clinical Results:
                    </Typography>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        <Typography>37% wrinkle reduction</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        <Typography>23% more lift</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        <Typography>30% increase in muscle tone</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            How EMFACE Works
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}
          >
            EMFACE uses synchronized RF (radiofrequency) and HIFES (high-intensity facial electrical stimulation) 
            to simultaneously treat your facial skin and muscles.
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <Card sx={{ height: '100%', p: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    RF Technology
                  </Typography>
                  <Typography paragraph color="text.secondary">
                    Heats the dermis to stimulate collagen and elastin production, 
                    improving skin texture and reducing wrinkles.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Increases collagen production" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Improves skin elasticity" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Reduces fine lines" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <Card sx={{ height: '100%', p: 3 }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    HIFES Technology
                  </Typography>
                  <Typography paragraph color="text.secondary">
                    Contracts facial muscles to increase muscle density and 
                    create a lifting effect without injections.
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Lifts and tones muscles" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Defines facial contours" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary="Non-invasive alternative" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box ref={benefitsRef} sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Why Choose EMFACE?
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {benefits.map((benefit, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'secondary.main',
                        mb: 2,
                        '& svg': { fontSize: 48 },
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Treatment Areas Section */}
      <Box ref={resultsRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={resultsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h3" gutterBottom fontWeight={600}>
                  Treatment Areas
                </Typography>
                <Typography paragraph color="text.secondary" sx={{ mb: 3 }}>
                  EMFACE can effectively treat multiple areas of the face in a single session:
                </Typography>
                <List>
                  {treatedAreas.map((area, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <FaceRetouchingNaturalIcon color="secondary" />
                      </ListItemIcon>
                      <ListItemText primary={area} />
                    </ListItem>
                  ))}
                </List>
              </motion.div>
            </Box>
            <Box sx={{ flex: '1 1 100%', maxWidth: { md: '50%' } }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={resultsInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=800&q=80"
                  alt="EMFACE Treatment"
                  style={{
                    width: '100%',
                    borderRadius: 16,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                />
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Process Timeline Section */}
      <Box ref={processRef} sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Your EMFACE Experience
          </Typography>

          <Timeline position="alternate">
            {processSteps.map((step, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="secondary">
                    {index + 1}
                  </TimelineDot>
                  {index < processSteps.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={processInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Paper sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight={600}>
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary">
                        {step.description}
                      </Typography>
                      <Chip
                        label={step.time}
                        size="small"
                        sx={{ mt: 1 }}
                        color="secondary"
                      />
                    </Paper>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #c026d3 0%, #e879f9 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Experience the EMFACE Difference
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join the revolution in non-invasive facial rejuvenation. 
            Look naturally lifted and refreshed.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                bgcolor: 'white',
                color: 'secondary.main',
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Book Your EMFACE Session
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Download Brochure
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default EmfacePage;