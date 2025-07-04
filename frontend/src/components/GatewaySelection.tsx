import React from 'react';
import { Box, Container, Typography, Card, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AutoAwesome as PrecisionIcon,
  ChatBubbleOutline as ChatIcon,
  Emergency as EmergencyIcon
} from '@mui/icons-material';
import { useChatStore } from '../chatbot/store/chatStore';

interface GatewayOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  backgroundElements: React.ReactNode;
  context: string;
}

export const GatewaySelection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();

  const handleGatewayClick = (gateway: GatewayOption) => {
    if (gateway.id === 'precision') {
      // Scroll to services section for users who know what they need
      const servicesSection = document.getElementById('services-section');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Open chat for other gateways
      if (!chatStore.isOpen) {
        chatStore.toggleChat();
      }
      
      // Send context message after a small delay
      setTimeout(() => {
        if (gateway.id === 'emergency') {
          chatStore.sendMessage("I need emergency dental care as soon as possible.");
        }
      }, 300);
    }
  };

  const gateways: GatewayOption[] = [
    {
      id: 'precision',
      icon: <PrecisionIcon sx={{ fontSize: 48 }} />,
      title: "I Know What I Need",
      subtitle: "Browse Services",
      description: "See our treatment options",
      gradient: 'radial-gradient(circle at 50% 50%, rgba(196, 181, 253, 0.3), rgba(255, 255, 255, 0.9))',
      backgroundElements: (
        <>
          {/* Circuit board patterns */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.05,
              backgroundImage: `
                linear-gradient(0deg, transparent 24%, rgba(196, 181, 253, 0.15) 25%, rgba(196, 181, 253, 0.15) 26%, transparent 27%, transparent 74%, rgba(196, 181, 253, 0.15) 75%, rgba(196, 181, 253, 0.15) 76%, transparent 77%, transparent),
                linear-gradient(90deg, transparent 24%, rgba(196, 181, 253, 0.15) 25%, rgba(196, 181, 253, 0.15) 26%, transparent 27%, transparent 74%, rgba(196, 181, 253, 0.15) 75%, rgba(196, 181, 253, 0.15) 76%, transparent 77%, transparent)
              `,
              backgroundSize: '50px 50px',
              pointerEvents: 'none',
            }}
          />
          {/* Glass morphism rings */}
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(196, 181, 253, 0.1)',
              backdropFilter: 'blur(10px)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              left: '15%',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(196, 181, 253, 0.08)',
              backdropFilter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />
        </>
      ),
      context: 'precision'
    },
    {
      id: 'chat',
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      title: "Chat with Julie EPT⁴",
      subtitle: "Enhanced Physician Technology",
      description: "Let Dr. Pedro's enhanced expertise guide you",
      gradient: 'linear-gradient(180deg, rgba(224, 242, 254, 0.8), rgba(178, 235, 242, 0.6))',
      backgroundElements: (
        <>
          {/* Bokeh dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                position: 'absolute',
                top: `${20 + i * 15}%`,
                left: `${10 + i * 13}%`,
                width: 40 + i * 10,
                height: 40 + i * 10,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(129, 230, 217, 0.3), transparent)',
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }}
            />
          ))}
          {/* Wave ripples */}
          <svg
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '30%',
              opacity: 0.1,
              pointerEvents: 'none',
            }}
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M0,40 C300,80 600,0 900,40 C1200,80 1200,120 1200,120 L0,120 Z"
              fill="url(#waveGradient)"
              animate={{
                d: [
                  "M0,40 C300,80 600,0 900,40 C1200,80 1200,120 1200,120 L0,120 Z",
                  "M0,20 C300,60 600,20 900,60 C1200,20 1200,120 1200,120 L0,120 Z",
                  "M0,40 C300,80 600,0 900,40 C1200,80 1200,120 1200,120 L0,120 Z",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#81e6d9" />
                <stop offset="100%" stopColor="#4fd1c5" />
              </linearGradient>
            </defs>
          </svg>
        </>
      ),
      context: 'chat'
    },
    {
      id: 'emergency',
      icon: <EmergencyIcon sx={{ fontSize: 48 }} />,
      title: "Emergency Care",
      subtitle: "Rapid Relief Portal",
      description: "Immediate assistance for urgent needs",
      gradient: 'linear-gradient(135deg, rgba(254, 215, 215, 0.8), rgba(254, 178, 178, 0.6))',
      backgroundElements: (
        <>
          {/* ECG pattern */}
          <svg
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '100px',
              transform: 'translateY(-50%)',
              opacity: 0.1,
              pointerEvents: 'none',
            }}
            viewBox="0 0 1200 100"
          >
            <motion.path
              d="M0,50 L200,50 L220,20 L240,80 L260,35 L280,65 L300,50 L1200,50"
              stroke="#fc8181"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </svg>
          {/* Vignette */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 40%, rgba(254, 178, 178, 0.1) 100%)',
              pointerEvents: 'none',
            }}
          />
        </>
      ),
      context: 'emergency'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h1"
          className="text-gradient"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 900,
            mb: 3,
            fontFamily: 'var(--font-primary)',
            letterSpacing: '-0.03em',
          }}
        >
          How Can We Help You Today?
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Choose your path to a healthier, more beautiful smile
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: { xs: 3, md: 4 },
          px: { xs: 2, md: 0 },
        }}
      >
        {gateways.map((gateway, index) => (
          <motion.div
            key={gateway.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="luxury-card hover-lift"
              onClick={() => handleGatewayClick(gateway)}
              sx={{
                height: { xs: '40vh', sm: '45vh', md: 420 },
                minHeight: { xs: 280, sm: 320, md: 420 },
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'white',
                border: '2px solid',
                borderColor: 'var(--luxury-border-gray)',
                borderRadius: '16px',
                transition: 'all 0.3s var(--transition-smooth)',
                boxShadow: 'var(--shadow-card)',
                '&:hover': {
                  transform: { xs: 'none', md: 'translateY(-4px)' },
                  boxShadow: 'var(--shadow-card-hover)',
                  borderColor: gateway.id === 'precision' ? 'rgba(124, 58, 237, 0.3)' : 
                              gateway.id === 'chat' ? 'rgba(8, 145, 178, 0.3)' : 'rgba(220, 38, 38, 0.3)',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                }
              }}
            >
              {gateway.backgroundElements}
              
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    mb: 3,
                    color: gateway.id === 'precision' ? '#7c3aed' : 
                           gateway.id === 'chat' ? '#0891b2' : '#dc2626',
                  }}
                >
                  {gateway.icon}
                </Box>
                
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.75rem', md: '2.125rem' },
                  }}
                >
                  {gateway.title}
                </Typography>
                
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {gateway.subtitle}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    maxWidth: 280,
                  }}
                >
                  {gateway.description}
                </Typography>

                {/* Mobile-friendly tap indicator */}
                {isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Tap to start →
                    </motion.div>
                  </Box>
                )}
              </Box>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Container>
  );
};