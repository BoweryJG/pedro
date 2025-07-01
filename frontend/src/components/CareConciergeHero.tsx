import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import DirectionsIcon from '@mui/icons-material/Directions';
import QuizIcon from '@mui/icons-material/Quiz';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const CareConciergeHero: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setMode, setShowCenterSelector, addToJourneyPath } = useAdaptiveNavigation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const handleKnowWhatINeed = () => {
    setMode('exploring');
    setShowCenterSelector(true);
    addToJourneyPath('direct-selection');
  };

  const handleHelpMeExplore = () => {
    setMode('exploring');
    addToJourneyPath('guided-exploration');
    // This will trigger the AI questionnaire
    window.dispatchEvent(new CustomEvent('openAIQuestionnaire'));
  };

  const handleEmergencyCare = () => {
    setMode('emergency');
    addToJourneyPath('emergency-care');
    // Navigate to emergency contact
    window.location.href = '/contact?emergency=true';
  };

  const entryPoints = [
    {
      title: "I Know What I Need",
      subtitle: "Direct access to our specialized centers",
      icon: <DirectionsIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      action: handleKnowWhatINeed,
      description: "Choose from our 5 specialized care centers",
    },
    {
      title: "Help Me Explore",
      subtitle: "AI-guided recommendations based on your needs",
      icon: <QuizIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: handleHelpMeExplore,
      description: "Answer a few questions for personalized guidance",
    },
    {
      title: "Emergency Care",
      subtitle: "Immediate assistance for urgent dental needs",
      icon: <EmergencyShareIcon sx={{ fontSize: 48 }} />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: handleEmergencyCare,
      description: "Connect with our emergency team now",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
            initial={{
              left: `${i * 25}%`,
              top: `${i * 20}%`,
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ display: 'inline-block' }}
            >
              <AutoAwesomeIcon
                sx={{
                  fontSize: 60,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
            </motion.div>
            
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Your Care Journey
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 800,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                fontWeight: 300,
              }}
            >
              Experience the future of dental care with our intelligent navigation system
            </Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {entryPoints.map((entry, index) => (
              <Box key={index} sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[10],
                      },
                    }}
                    onClick={entry.action}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 6,
                        background: entry.gradient,
                      }}
                    />
                    
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: '50%',
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3,
                        }}
                      >
                        <Box sx={{ background: entry.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {entry.icon}
                        </Box>
                      </Box>
                      
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        {entry.title}
                      </Typography>
                      
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                        {entry.subtitle}
                      </Typography>
                      
                      <AnimatePresence>
                        {hoveredCard === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                              {entry.description}
                            </Typography>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          background: entry.gradient,
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            background: entry.gradient,
                            filter: 'brightness(1.1)',
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CareConciergeHero;