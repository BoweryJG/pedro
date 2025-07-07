import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SecurityIcon from '@mui/icons-material/Security';

const trustIndicators = [
  {
    icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
    title: 'Board Certified',
    description: 'Prosthodontist - Complex Dental Reconstruction',
    color: '#4285F4',
  },
  {
    icon: <WorkspacePremiumIcon sx={{ fontSize: 48 }} />,
    title: 'Robotic Surgery Pioneer',
    description: 'YOMI Robotic Implant Technology Specialist',
    color: '#667eea',
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 48 }} />,
    title: 'Temple University',
    description: 'DMD from Temple University School of Dentistry',
    color: '#f093fb',
  },
  {
    icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
    title: 'Sports Hall of Fame',
    description: 'Staten Island Sports Hall of Fame Inductee',
    color: '#fa709a',
  },
  {
    icon: <LocalHospitalIcon sx={{ fontSize: 48 }} />,
    title: 'Hospital Affiliated',
    description: 'Richmond University Medical Center',
    color: '#4facfe',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48 }} />,
    title: '30+ Years Excellence',
    description: 'Three Decades of Advanced Dental Care',
    color: '#43e97b',
  },
];

const LuxuryTrustIndicators: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'white',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <div>
          <Box sx={{ textAlign: { xs: 'center', md: 'center' }, mb: 8 }}>
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
              Credentials & Recognition
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
                textAlign: { xs: 'center', md: 'center' },
              }}
            >
              Why Choose Our Practice
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-secondary)',
                fontWeight: 300,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
                textAlign: { xs: 'center', md: 'center' },
              }}
            >
              Recognized excellence backed by prestigious certifications and continuous innovation
            </Typography>
          </Box>
        </div>

        {/* Trust Indicators Grid */}
        <Grid container spacing={3} justifyContent={{ xs: 'center', md: 'flex-start' }}>
          {trustIndicators.map((indicator, index) => (
            <Grid item xs={6} md={4} key={index} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <div>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    height: '100%',
                    textAlign: 'center',
                    background: 'rgba(250, 250, 250, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                      borderColor: indicator.color,
                      '& .indicator-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .indicator-glow': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Glow effect */}
                  <Box
                    className="indicator-glow"
                    sx={{
                      position: 'absolute',
                      top: -50,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 150,
                      height: 150,
                      borderRadius: '50%',
                      background: indicator.color,
                      filter: 'blur(60px)',
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Icon */}
                  <Box
                    className="indicator-icon"
                    sx={{
                      color: indicator.color,
                      mb: 2,
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {indicator.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                      mb: 1,
                      color: 'var(--luxury-black)',
                    }}
                  >
                    {indicator.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-secondary)',
                      color: 'text.secondary',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      lineHeight: 1.6,
                      textAlign: 'center',
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    {indicator.description}
                  </Typography>
                </Paper>
              </div>
            </Grid>
          ))}
        </Grid>

        {/* Bottom CTA */}
        <div>
          <Box
            sx={{
              mt: 8,
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(244, 143, 177, 0.05) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontWeight: 700,
                mb: 2,
                background: 'var(--gradient-luxury)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Experience Excellence in Every Visit
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'var(--font-secondary)',
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join our family of patients who trust us with their most precious asset - their smile
            </Typography>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default LuxuryTrustIndicators;