import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const MeetDrPedroSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const highlights = [
    {
      icon: <EmojiEventsIcon />,
      title: "Sports Hall of Fame",
      description: "Staten Island basketball champion"
    },
    {
      icon: <SchoolIcon />,
      title: "30+ Years Excellence",
      description: "Board-certified prosthodontist"
    },
    {
      icon: <PrecisionManufacturingIcon />,
      title: "Robotic Pioneer",
      description: "Advanced YOMI implant technology"
    }
  ];

  return (
    <Box 
      ref={ref}
      sx={{ 
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Image Section */}
          <Grid item xs={12} md={5}>
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-50px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease'
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    right: 20,
                    bottom: 20,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 4,
                    opacity: 0.1,
                    zIndex: -1,
                  }
                }}
              >
                <Avatar
                  src="/images/gregpedro.jpg"
                  sx={{
                    width: { xs: 280, md: 400 },
                    height: { xs: 280, md: 400 },
                    margin: 'auto',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    border: '4px solid white',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 30,
                    right: 10,
                    background: 'white',
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    Dr. Greg Pedro
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    DMD, Prosthodontist
                  </Typography>
                </Box>
              </Box>
            </div>
          </Grid>

          {/* Content Section */}
          <Grid item xs={12} md={7}>
            <div
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s'
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                Meet Your Doctor
              </Typography>

              <Typography
                variant="h5"
                sx={{ 
                  mb: 3, 
                  fontWeight: 500, 
                  lineHeight: 1.6,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                From Staten Island Sports Hall of Fame champion to pioneering prosthodontist, 
                Dr. Pedro brings 30+ years of excellence and cutting-edge technology to transform your smile.
              </Typography>

              <Typography
                variant="body1"
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary', 
                  lineHeight: 1.8,
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                After earning full athletic scholarships and graduating from Temple University School of Dentistry, 
                Dr. Pedro became a board-certified prosthodontist specializing in complex dental reconstructions. 
                His return to Staten Island in 2023 marked the opening of About Face Dental & Aesthetic Boutique—bringing 
                world-class care and robotic precision to his hometown community.
              </Typography>

              {/* Highlights */}
              <Stack spacing={2} sx={{ mb: 4 }}>
                {highlights.map((highlight, index) => (
                  <div
                    key={index}
                    style={{
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                      transition: `opacity 0.5s ease ${0.4 + index * 0.1}s, transform 0.5s ease ${0.4 + index * 0.1}s`
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box 
                        sx={{ 
                          color: 'primary.main',
                          '& svg': { fontSize: 28 }
                        }}
                      >
                        {highlight.icon}
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {highlight.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {highlight.description}
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                ))}
              </Stack>

              {/* Specialties */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['TMJ Treatment', 'Robotic Implants', 'Full-Mouth Reconstruction', 'Cosmetic Dentistry'].map((specialty) => (
                    <Chip
                      key={specialty}
                      label={specialty}
                      sx={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        color: 'primary.main',
                        fontWeight: 500,
                        mb: 1,
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* CTA Button */}
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/about')}
                className="panerai-cta"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Read Full Biography
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.05,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          opacity: 0.05,
        }}
      />
    </Box>
  );
};

export default MeetDrPedroSection;