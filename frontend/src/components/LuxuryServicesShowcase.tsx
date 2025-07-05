import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    id: 'tmj',
    title: 'TMJ & Orofacial Pain',
    description: 'Advanced neuromuscular therapy for chronic jaw pain and headaches',
    features: ['Pain Mapping', 'Biofeedback', 'Custom Orthotics'],
    image: '/images/tmj-treatment.jpg',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/tmj',
  },
  {
    id: 'implants',
    title: 'Dental Implants',
    description: 'Permanent tooth replacement with artistic precision',
    features: ['Same-Day Teeth', '3D Planning', 'Lifetime Warranty'],
    image: '/images/dental-implants.jpg',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    route: '/implants',
  },
  {
    id: 'robotic',
    title: 'Robotic Surgery',
    description: 'Yomi robotic-assisted implant placement for unmatched precision',
    features: ['0.1mm Accuracy', 'AI Planning', 'Faster Healing'],
    image: '/images/yomi-robot.jpg',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: '/robotic',
  },
  {
    id: 'medspa',
    title: 'MedSpa Treatments',
    description: 'Non-invasive facial rejuvenation with EMFACE technology',
    features: ['No Needles', 'No Downtime', 'Instant Results'],
    image: '/images/emface.jpg',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    route: '/medspa',
  },
];

const LuxuryServicesShowcase: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <Box
      id="services-section"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <div>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                fontFamily: 'var(--font-secondary)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--luxury-gold)',
                mb: 2,
              }}
            >
              Our Excellence Centers
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 3,
                background: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Specialized Care, Exceptional Results
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-secondary)',
                fontWeight: 300,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Each center represents the pinnacle of its specialty, equipped with cutting-edge technology and staffed by world-class experts
            </Typography>
          </Box>
        </div>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} key={service.id}>
              <div
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <Card
                  onClick={() => navigate(service.route)}
                  className="panerai-card"
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 4,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      '& .service-overlay': {
                        opacity: 1,
                      },
                      '& .service-image': {
                        transform: 'scale(1.05)',
                      },
                      '& .arrow-icon': {
                        transform: 'translateX(5px)',
                      },
                    },
                  }}
                >
                  {/* Gradient Overlay */}
                  <Box
                    className="service-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: service.gradient,
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      zIndex: 1,
                      mixBlendMode: 'multiply',
                    }}
                  />

                  {/* Service Image */}
                  <Box
                    sx={{
                      height: 250,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src={service.image}
                      alt={service.title}
                      className="service-image"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                    />
                    
                    {/* Feature Chips */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                        zIndex: 2,
                      }}
                    >
                      {service.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            fontFamily: 'var(--font-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            height: 24,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontFamily: 'var(--font-primary)',
                            fontWeight: 700,
                            mb: 2,
                            color: 'var(--luxury-black)',
                          }}
                        >
                          {service.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: 'var(--font-secondary)',
                            color: 'text.secondary',
                            lineHeight: 1.8,
                          }}
                        >
                          {service.description}
                        </Typography>
                      </Box>
                      <IconButton
                        className="arrow-icon"
                        sx={{
                          background: hoveredService === service.id ? service.gradient : 'transparent',
                          color: hoveredService === service.id ? 'white' : 'var(--luxury-black)',
                          border: '2px solid',
                          borderColor: hoveredService === service.id ? 'transparent' : 'rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: service.gradient,
                            color: 'white',
                            borderColor: 'transparent',
                          },
                        }}
                      >
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LuxuryServicesShowcase;