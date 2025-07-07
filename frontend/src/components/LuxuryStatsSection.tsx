import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import CountUp from 'react-countup';

const stats = [
  {
    number: 15000,
    suffix: '+',
    label: 'Happy Patients',
    description: 'Trust us with their smile',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    number: 98,
    suffix: '%',
    label: 'Success Rate',
    description: 'In complex procedures',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    number: 25,
    suffix: '+',
    label: 'Years Excellence',
    description: 'Leading dental innovation',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    number: 50,
    suffix: '+',
    label: 'Team Members',
    description: 'Expert professionals',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
];

const LuxuryStatsSection: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
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

  return (
    <Box
      ref={ref}
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1A2A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 20% 50%, var(--luxury-gold) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, var(--luxury-silver) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, var(--luxury-pearl) 0%, transparent 50%)
          `,
          animation: 'float 20s ease-in-out infinite',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Section Header */}
        <div
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease'
          }}
        >
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
              Our Impact
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 3,
                color: 'white',
              }}
            >
              Proven Results That Transform Lives
            </Typography>
          </Box>
        </div>

        {/* Stats Grid */}
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <div
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`
                }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      '& .stat-gradient': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Gradient overlay */}
                  <Box
                    className="stat-gradient"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: stat.gradient,
                      opacity: 0.7,
                      transition: 'opacity 0.3s ease',
                    }}
                  />

                  {/* Number */}
                  <Typography
                    variant="h2"
                    className="panerai-statistic"
                    sx={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: { xs: '3rem', md: '4rem' },
                      fontWeight: 400,
                      mb: 1,
                      lineHeight: 1,
                    }}
                  >
                    {isInView && (
                      <CountUp
                        start={0}
                        end={stat.number}
                        duration={2.5}
                        separator=","
                        suffix={stat.suffix}
                      />
                    )}
                  </Typography>

                  {/* Label */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 600,
                      mb: 1,
                      color: 'white',
                    }}
                  >
                    {stat.label}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-secondary)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      textAlign: 'center',
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    {stat.description}
                  </Typography>
                </Box>
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LuxuryStatsSection;