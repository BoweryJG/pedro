import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { keyframes } from '@mui/material/styles';

const luxuryPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
    border-color: rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
    border-color: rgba(102, 126, 234, 0.8);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
    border-color: rgba(102, 126, 234, 0.4);
  }
`;

const shimmerEffect = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const centers = [
  {
    id: 'tmj',
    title: 'TMJ & Orofacial Excellence',
    subtitle: 'Precision care for complex jaw disorders',
    description: 'Advanced neuromuscular therapy combining cutting-edge diagnostics with personalized treatment protocols.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🦷',
    features: ['Proprietary Pain Mapping', 'Biofeedback Therapy', 'Neuro-Muscular Reprogramming'],
    stats: { patients: '2,500+', satisfaction: '98%' },
    luxuryColor: '#667eea',
  },
  {
    id: 'implants',
    title: 'Implant Artistry Studio',
    subtitle: 'Permanent solutions with artistic precision',
    description: 'Where engineering meets aesthetics - creating smiles that last a lifetime with Swiss precision.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⚙️',
    features: ['3D Smile Architecture', 'Biocompatible Materials', 'Lifetime Excellence Guarantee'],
    stats: { implants: '5,000+', successRate: '99.2%' },
    luxuryColor: '#f093fb',
  },
  {
    id: 'robotic',
    title: 'Robotic Surgery Suite',
    subtitle: 'Future of precision dental surgery',
    description: 'Experience the pinnacle of surgical excellence with Yomi - where AI meets artistry.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🤖',
    features: ['Sub-millimeter Precision', 'AI-Guided Planning', 'Accelerated Healing Protocol'],
    stats: { procedures: '1,000+', accuracy: '0.1mm' },
    luxuryColor: '#4facfe',
  },
  {
    id: 'medspa',
    title: 'MedSpa Luxury Collection',
    subtitle: 'Curated aesthetic excellence',
    description: 'Where medical expertise meets spa luxury - redefining facial rejuvenation.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '✨',
    features: ['EMFACE Revolution', 'Signature Protocols', 'Celebrity Techniques'],
    stats: { treatments: '10,000+', clientReturn: '95%' },
    luxuryColor: '#fa709a',
  },
  {
    id: 'aboutface',
    title: 'AboutFace Atelier',
    subtitle: 'Bespoke smile couture',
    description: 'Crafting one-of-a-kind smiles with the precision of haute couture and the vision of fine art.',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: '😊',
    features: ['Digital Smile Design', 'Porcelain Artistry', 'Facial Harmony Analysis'],
    stats: { smiles: '3,000+', rating: '5.0★' },
    luxuryColor: '#a8edea',
  },
];

interface LuxuryCenterSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const LuxuryCenterSelectionModal: React.FC<LuxuryCenterSelectionModalProps> = ({ open, onClose }) => {
  console.log('🚨 LuxuryCenterSelectionModal render - open:', open);
  
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setCurrentCenter, setMode, addToJourneyPath } = useAdaptiveNavigation();
  const [hoveredCenter, setHoveredCenter] = useState<string | null>(null);

  const handleSelectCenter = (centerId: string) => {
    setCurrentCenter(centerId as any);
    setMode('center-focused');
    addToJourneyPath(`selected-${centerId}`);
    navigate(`/${centerId}`);
    onClose();
    
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 6,
          background: 'rgba(250, 250, 250, 0.95)',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--gradient-aurora)',
            backgroundSize: '300% 300%',
            opacity: 0.03,
            animation: 'aurora 15s ease infinite',
            pointerEvents: 'none',
          },
        },
      }}
    >
      {/* Luxury close button */}
      <Box
        sx={{
          position: 'absolute',
          top: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <IconButton 
          onClick={onClose} 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            color: 'var(--luxury-black)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.95)',
              transform: 'rotate(90deg)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 3, md: 6 } }}>
        {/* Luxury header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 60,
                height: 60,
                mb: 3,
                borderRadius: '50%',
                background: 'var(--gradient-luxury)',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
              }}
            >
              <AutoAwesomeIcon sx={{ color: 'white', fontSize: 32 }} />
            </Box>
          </motion.div>
          
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-primary)',
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'var(--gradient-luxury)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            Select Your Excellence Center
          </Typography>
          <Typography 
            variant="h6" 
            sx={{
              fontFamily: 'var(--font-secondary)',
              fontWeight: 300,
              color: 'text.secondary',
              letterSpacing: '0.02em',
            }}
          >
            Choose from our collection of specialized care destinations
          </Typography>
        </Box>

        {/* Luxury center cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 4,
        }}>
          {centers.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredCenter(center.id)}
              onHoverEnd={() => setHoveredCenter(null)}
            >
              <Card
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid',
                  borderColor: hoveredCenter === center.id 
                    ? center.luxuryColor 
                    : 'transparent',
                  borderRadius: 4,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: hoveredCenter === center.id ? `${luxuryPulse} 2s infinite` : 'none',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, transparent 0%, ${alpha(center.luxuryColor, 0.1)} 50%, transparent 100%)`,
                    backgroundSize: '200% 100%',
                    opacity: hoveredCenter === center.id ? 1 : 0,
                    animation: hoveredCenter === center.id ? `${shimmerEffect} 2s infinite` : 'none',
                    transition: 'opacity 0.3s ease',
                    borderRadius: 'inherit',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 20px 40px ${alpha(center.luxuryColor, 0.3)}`,
                  },
                }}
                onClick={() => handleSelectCenter(center.id)}
              >
                {/* Luxury gradient bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: center.gradient,
                    opacity: hoveredCenter === center.id ? 1 : 0.8,
                  }}
                />
                
                {/* Floating glow orb */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: center.gradient,
                    filter: 'blur(40px)',
                    opacity: hoveredCenter === center.id ? 0.6 : 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                  }}
                />
                
                <CardContent sx={{ p: 4, position: 'relative' }}>
                  {/* Icon and title */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(center.luxuryColor, 0.1)}, ${alpha(center.luxuryColor, 0.05)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 32,
                        mr: 2,
                        flexShrink: 0,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: -2,
                          borderRadius: 'inherit',
                          background: center.gradient,
                          opacity: hoveredCenter === center.id ? 0.5 : 0,
                          filter: 'blur(8px)',
                          transition: 'opacity 0.3s ease',
                        },
                      }}
                    >
                      {center.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontFamily: 'var(--font-primary)',
                          fontWeight: 700,
                          fontSize: '1.5rem',
                          color: 'var(--luxury-black)',
                          mb: 0.5,
                        }}
                      >
                        {center.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{
                          fontFamily: 'var(--font-secondary)',
                          fontWeight: 500,
                          color: center.luxuryColor,
                          letterSpacing: '0.02em',
                        }}
                      >
                        {center.subtitle}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body1" 
                    sx={{
                      fontFamily: 'var(--font-secondary)',
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {center.description}
                  </Typography>

                  {/* Features with animation */}
                  <AnimatePresence>
                    {hoveredCenter === center.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      >
                        <Box sx={{ mb: 3 }}>
                          {center.features.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                  fontFamily: 'var(--font-secondary)',
                                  '&::before': {
                                    content: '"✦"',
                                    color: center.luxuryColor,
                                    mr: 1,
                                    fontSize: '1.2rem',
                                  },
                                }}
                              >
                                {feature}
                              </Typography>
                            </motion.div>
                          ))}
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Stats and CTA */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 2,
                      borderTop: hoveredCenter === center.id ? 1 : 0,
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      {Object.entries(center.stats).map(([key, value]) => (
                        <Box key={key}>
                          <Typography 
                            variant="caption" 
                            sx={{
                              fontFamily: 'var(--font-secondary)',
                              color: 'text.secondary',
                              textTransform: 'capitalize',
                            }}
                          >
                            {key}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'var(--font-accent)',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              background: center.gradient,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <ArrowForwardIcon 
                      sx={{ 
                        color: center.luxuryColor,
                        fontSize: 28,
                        transform: hoveredCenter === center.id ? 'translateX(5px)' : 'translateX(0)',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LuxuryCenterSelectionModal;