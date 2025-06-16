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
  Avatar,
  Rating,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { usePageTitle } from '../hooks/usePageTitle';
import { CONTACT_INFO } from '../constants/contact';

const TMJPage = () => {
  usePageTitle('TMJ Treatment');
  
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [symptomsRef, symptomsInView] = useInView({ triggerOnce: true });
  const [treatmentRef, treatmentInView] = useInView({ triggerOnce: true });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true });

  const symptoms = [
    'Jaw pain or tenderness',
    'Clicking or popping sounds',
    'Difficulty chewing',
    'Facial pain',
    'Ear pain or ringing',
    'Headaches or migraines',
    'Neck and shoulder pain',
    'Jaw locking or limited movement',
  ];

  const treatments = [
    {
      icon: <AssessmentIcon />,
      title: 'Comprehensive Diagnosis',
      description: 'Advanced 3D imaging and thorough evaluation to identify the root cause.',
    },
    {
      icon: <MedicalServicesIcon />,
      title: 'Custom Oral Appliances',
      description: 'Precision-fitted devices to realign your jaw and relieve pressure.',
    },
    {
      icon: <SelfImprovementIcon />,
      title: 'Physical Therapy',
      description: 'Targeted exercises and manual therapy to restore function.',
    },
    {
      icon: <PsychologyIcon />,
      title: 'Stress Management',
      description: 'Techniques to reduce jaw clenching and teeth grinding.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      rating: 5,
      text: 'After years of jaw pain, Dr. Pedro finally gave me my life back. The TMJ treatment was life-changing!',
      date: '2 months ago',
    },
    {
      name: 'Michael R.',
      rating: 5,
      text: 'The custom oral appliance eliminated my headaches completely. I wish I had found Dr. Pedro sooner.',
      date: '3 months ago',
    },
    {
      name: 'Jennifer L.',
      rating: 5,
      text: 'Professional, caring, and truly understands TMJ disorders. The comprehensive approach made all the difference.',
      date: '1 month ago',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
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
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                  }}
                >
                  TMJ Treatment That Works
                </Typography>
                <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                  End your jaw pain with Staten Island's most comprehensive TMJ disorder treatment program. 
                  Our proven approach helps thousands find lasting relief.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      bgcolor: 'white',
                      color: 'success.main',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Get Pain Relief Now
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
                    Free TMJ Assessment
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
                  <Typography variant="h4" gutterBottom fontWeight={600}>
                    Over 2,000 Patients Treated
                  </Typography>
                  <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
                    Dr. Pedro's expertise in TMJ disorders has helped thousands of Staten Island 
                    residents find lasting relief from chronic jaw pain.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label="95% Success Rate"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      label="20+ Years Experience"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                    <Chip
                      label="Insurance Accepted"
                      sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                  </Box>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Symptoms Section */}
      <Box ref={symptomsRef} sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={symptomsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Do You Have TMJ Disorder?
            </Typography>
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              paragraph
              sx={{ mb: 6 }}
            >
              If you experience any of these symptoms, you may benefit from our TMJ treatment:
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {symptoms.map((symptom, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={symptomsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                      '&:hover': {
                        bgcolor: 'primary.50',
                        transform: 'translateX(8px)',
                        transition: 'all 0.3s',
                      },
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
                    <Typography>{symptom}</Typography>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Treatment Approach Section */}
      <Box ref={treatmentRef} sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Our Comprehensive Treatment Approach
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {treatments.map((treatment, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={treatmentInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        color: 'success.main',
                        mb: 2,
                        '& svg': { fontSize: 48 },
                      }}
                    >
                      {treatment.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {treatment.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {treatment.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box ref={testimonialsRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Patient Success Stories
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { md: '33.333%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card sx={{ height: '100%', p: 3, position: 'relative' }}>
                    <FormatQuoteIcon
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        fontSize: 40,
                        color: 'grey.200',
                      }}
                    />
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                          {testimonial.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600}>
                            {testimonial.name}
                          </Typography>
                          <Rating value={testimonial.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        "{testimonial.text}"
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.date}
                      </Typography>
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
          py: 8,
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Stop Living with TMJ Pain
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands who have found lasting relief. Schedule your consultation today.
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
                color: 'success.main',
                py: 2,
                px: 5,
                fontSize: '1.1rem',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Schedule TMJ Consultation
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
              Call {CONTACT_INFO.phone.display}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default TMJPage;