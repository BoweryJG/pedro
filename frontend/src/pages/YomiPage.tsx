import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { usePageTitle } from '../hooks/usePageTitle';

const YomiPage = () => {
  usePageTitle('Yomi Robotic Surgery');
  
  const navigate = useNavigate();
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true });
  const [processRef, processInView] = useInView({ triggerOnce: true });

  const benefits = [
    {
      icon: <SpeedIcon />,
      title: '50% Faster Healing',
      description: 'Minimally invasive procedures mean less tissue damage and quicker recovery times.',
    },
    {
      icon: <VerifiedUserIcon />,
      title: 'Unmatched Precision',
      description: 'Computer-guided accuracy ensures perfect implant placement every time.',
    },
    {
      icon: <TrendingDownIcon />,
      title: 'Reduced Risk',
      description: 'Lower risk of complications and infections with robotic assistance.',
    },
    {
      icon: <LocalHospitalIcon />,
      title: 'Less Pain',
      description: 'Smaller incisions and precise movements mean less post-operative discomfort.',
    },
  ];

  const faqs = [
    {
      question: 'What is Yomi robotic surgery?',
      answer: 'Yomi is the first and only FDA-cleared robot-assisted dental surgery system. It provides haptic guidance to ensure accurate dental implant placement according to the pre-operative plan.',
    },
    {
      question: 'How much faster is recovery with Yomi?',
      answer: 'Patients typically experience 50% faster healing times compared to traditional implant surgery. Most patients return to normal activities within 2-3 days instead of the usual week.',
    },
    {
      question: 'Is Yomi surgery more expensive?',
      answer: 'While there is a premium for this advanced technology, many patients find the benefits of faster healing, reduced pain, and better outcomes worth the investment. We offer flexible financing options.',
    },
    {
      question: 'Am I a candidate for Yomi surgery?',
      answer: 'Most patients requiring dental implants are candidates for Yomi surgery. We\'ll evaluate your specific case during a consultation to determine the best approach.',
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Consultation & Planning',
      description: '3D imaging and personalized treatment planning',
    },
    {
      step: 2,
      title: 'Robotic Surgery',
      description: 'Precise, computer-guided implant placement',
    },
    {
      step: 3,
      title: 'Rapid Recovery',
      description: 'Minimal downtime with 50% faster healing',
    },
    {
      step: 4,
      title: 'Perfect Results',
      description: 'Beautiful, long-lasting dental implants',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
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
                  label="Staten Island Exclusive"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    mb: 2,
                  }}
                />
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    mb: 3,
                  }}
                >
                  Yomi Robotic Dental Surgery
                </Typography>
                <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                  The only FDA-cleared robot-assisted dental surgery system. 
                  Experience the future of implant dentistry with 50% faster healing 
                  and unparalleled precision.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      py: 1.5,
                      px: 4,
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    Schedule Consultation
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
                    Watch Video Demo
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
                    height: { xs: 300, md: 400 },
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=800&q=80"
                    alt="Yomi Robotic Surgery"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 16,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box ref={benefitsRef} sx={{ py: 10, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h2"
              align="center"
              gutterBottom
              sx={{ fontWeight: 700, mb: 6 }}
            >
              Why Choose Yomi?
            </Typography>
          </motion.div>

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
                        color: 'primary.main',
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

      {/* Process Section */}
      <Box ref={processRef} sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            The Yomi Process
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {processSteps.map((step, index) => (
              <Box sx={{ flex: '1 1 100%', maxWidth: { xs: '100%', sm: '50%', md: '25%' } }} key={index}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={processInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                        fontWeight: 700,
                        mx: 'auto',
                        mb: 2,
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ py: 1 }}
              >
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Ready for the Future of Dental Surgery?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Be among the elite patients in Staten Island experiencing Yomi robotic surgery.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarTodayIcon />}
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
            Book Your Yomi Consultation
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default YomiPage;