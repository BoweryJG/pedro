import { Box, Container, Typography, Paper, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TimerIcon from '@mui/icons-material/Timer';
import SecurityIcon from '@mui/icons-material/Security';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { usePageTitle } from '../hooks/usePageTitle';

const SmileSimulatorPage = () => {
  usePageTitle('Smile Simulator');
  
  const navigate = useNavigate();

  const features = [
    {
      icon: <AutoAwesomeIcon />,
      title: 'AI-Powered',
      description: 'Advanced algorithms trained on millions of cases'
    },
    {
      icon: <TimerIcon />,
      title: 'Instant Results',
      description: 'See transformations in under 10 seconds'
    },
    {
      icon: <SecurityIcon />,
      title: 'HIPAA Compliant',
      description: 'Secure photo processing and storage'
    },
    {
      icon: <PhotoCameraIcon />,
      title: 'Easy Upload',
      description: 'Simple photo capture and upload process'
    }
  ];

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/services')}
              sx={{ mb: 2 }}
            >
              Back to Services
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h3" fontWeight={700}>
                SmileLab AI Simulator
              </Typography>
              <Chip 
                label="BETA" 
                color="primary" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              />
            </Box>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Visualize your perfect smile transformation with advanced AI technology
            </Typography>
          </Box>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            {features.map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  flex: '1 1 100%',
                  maxWidth: { md: 'calc(25% - 12px)' },
                  p: 3,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 1 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </motion.div>

        {/* Simulator Iframe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: 'white'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: { xs: '600px', md: '800px' },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }
              }}
            >
              <iframe
                src="https://dentalimplantsimulator.netlify.app/"
                title="SmileLab AI Dental Simulator"
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  position: 'relative',
                  zIndex: 0
                }}
                allow="camera"
              />
            </Box>
          </Paper>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              How to Use the Simulator:
            </Typography>
            <Box component="ol" sx={{ pl: 2, mb: 0 }}>
              <Typography component="li" sx={{ mb: 1 }}>
                Upload a clear photo of your current smile
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                Our AI will analyze your dental structure
              </Typography>
              <Typography component="li" sx={{ mb: 1 }}>
                View instant visualization of potential improvements
              </Typography>
              <Typography component="li">
                Schedule a consultation to discuss your transformation
              </Typography>
            </Box>
          </Paper>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Ready to Transform Your Smile?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              After using the simulator, book a consultation to discuss your personalized treatment plan
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/contact')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #68428e 100%)',
                }
              }}
            >
              Book Your Consultation
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SmileSimulatorPage;