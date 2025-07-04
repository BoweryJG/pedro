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
import { keyframes } from '@mui/material/styles';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0);
  }
`;

const centers = [
  {
    id: 'tmj',
    title: 'TMJ & Orofacial Pain',
    subtitle: 'Expert care for jaw disorders',
    description: 'Comprehensive diagnosis and treatment for temporomandibular joint disorders and facial pain.',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: '🦷',
    features: ['Custom Oral Appliances', 'Physical Therapy', 'Pain Management'],
    stats: { patients: '2,500+', satisfaction: '98%' },
  },
  {
    id: 'implants',
    title: 'Dental Implants',
    subtitle: 'Permanent tooth replacement',
    description: 'State-of-the-art implant solutions with traditional expertise and modern technology.',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '⚙️',
    features: ['Single & Full Arch', 'Bone Grafting', 'Lifetime Warranty'],
    stats: { implants: '5,000+', successRate: '99.2%' },
  },
  {
    id: 'robotic',
    title: 'Robotic Surgery',
    subtitle: 'Precision implant placement',
    description: 'Advanced Yomi robotic technology for computer-guided implant surgery.',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🤖',
    features: ['Computer Precision', 'Minimally Invasive', '50% Faster Healing'],
    stats: { procedures: '1,000+', accuracy: '0.1mm' },
  },
  {
    id: 'medspa',
    title: 'MedSpa & Aesthetics',
    subtitle: 'Facial rejuvenation',
    description: 'Non-invasive aesthetic treatments for facial enhancement and anti-aging.',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '✨',
    features: ['EMFACE Technology', 'Facial Contouring', 'Anti-Aging Solutions'],
    stats: { treatments: '10,000+', clientReturn: '95%' },
  },
  {
    id: 'aboutface',
    title: 'AboutFace Aesthetics',
    subtitle: 'Complete smile makeovers',
    description: 'Advanced cosmetic dentistry for transformative smile design.',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    icon: '😊',
    features: ['Veneers', 'Teeth Whitening', 'Smile Design'],
    stats: { smiles: '3,000+', rating: '5.0★' },
  },
];

interface CenterSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const CenterSelectionModal: React.FC<CenterSelectionModalProps> = ({ open, onClose }) => {
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
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: theme.palette.background.default,
          overflow: 'hidden',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <IconButton onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Choose Your Care Center
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Select from our specialized centers for expert care
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {centers.map((center, index) => (
            <Box key={center.id} sx={{ flex: '1 1 300px', minWidth: 0, maxWidth: { xs: '100%', md: '50%', lg: '33.333%' } }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                onHoverStart={() => setHoveredCenter(center.id)}
                onHoverEnd={() => setHoveredCenter(null)}
              >
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    border: '2px solid',
                    borderColor: hoveredCenter === center.id 
                      ? theme.palette.primary.main 
                      : alpha(theme.palette.divider, 0.2),
                    animation: hoveredCenter === center.id ? `${pulse} 2s infinite` : 'none',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[10],
                    },
                  }}
                  onClick={() => handleSelectCenter(center.id)}
                >
                  <Box
                    sx={{
                      height: 8,
                      background: center.gradient,
                    }}
                  />
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          background: 'rgba(102, 126, 234, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          mr: 2,
                        }}
                      >
                        {center.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {center.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {center.subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {center.description}
                    </Typography>

                    <AnimatePresence>
                      {hoveredCenter === center.id && (
                        <Fade in={true}>
                          <Box>
                            <Box sx={{ mb: 2 }}>
                              {center.features.map((feature, idx) => (
                                <Typography
                                  key={idx}
                                  variant="body2"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 0.5,
                                    color: theme.palette.primary.main,
                                  }}
                                >
                                  • {feature}
                                </Typography>
                              ))}
                            </Box>
                            
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                pt: 2,
                                borderTop: 1,
                                borderColor: 'divider',
                              }}
                            >
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {Object.keys(center.stats)[0]}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {Object.values(center.stats)[0]}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {Object.keys(center.stats)[1]}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {Object.values(center.stats)[1]}
                                </Typography>
                              </Box>
                              <ArrowForwardIcon 
                                sx={{ 
                                  color: theme.palette.primary.main,
                                  animation: `${pulse} 1s infinite`,
                                }}
                              />
                            </Box>
                          </Box>
                        </Fade>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CenterSelectionModal;