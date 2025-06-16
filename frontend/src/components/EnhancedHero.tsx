import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
  Paper,
  Avatar,
  Rating,
} from '@mui/material';
import { CONTACT_INFO } from '../constants/contact';
import {
  ArrowForward as ArrowForwardIcon,
  PlayCircleOutline as PlayIcon,
  KeyboardArrowDown as ScrollDownIcon,
  AutoAwesome as SparkleIcon,
  CheckCircle as CheckIcon,
  LocalPhone as PhoneIcon,
  Schedule as ScheduleIcon,
  Science as ScienceIcon,
  Speed as SpeedIcon,
  Verified as VerifiedIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

interface EnhancedHeroProps {
  onNavigate: (path: string) => void;
}

const EnhancedHero: React.FC<EnhancedHeroProps> = ({ onNavigate }) => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [_showVideo, setShowVideo] = useState(false);

  // Rotating text animations
  const rotatingTexts = [
    "Robot-Assisted Dental Surgery",
    "Pain-Free TMJ Treatment",
    "Non-Invasive Facial Rejuvenation",
    "50% Faster Healing Times",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: <ScienceIcon />, text: "Only Yomi Provider in Staten Island" },
    { icon: <SpeedIcon />, text: "Same-Day Consultations" },
    { icon: <VerifiedIcon />, text: "FDA Approved Technology" },
    { icon: <GroupsIcon />, text: "2000+ Happy Patients" },
  ];

  const stats = [
    { value: 50, suffix: '%', label: 'Faster Healing' },
    { value: 100, suffix: '%', label: 'Precision Rate' },
    { value: 4.9, suffix: '', label: 'Google Rating', decimals: 1 },
    { value: 15, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <Box
      ref={heroRef}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background: 'radial-gradient(circle, rgba(30, 64, 175, 0.1) 0%, transparent 70%)',
            animation: 'rotate 30s linear infinite',
          },
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: 'rgba(124, 58, 237, 0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </Box>

      {/* Video Background (Optional) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
        }}
      >
        <source src="/videos/dental-office.mp4" type="video/mp4" />
      </video>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 6,
            alignItems: 'center',
          }}
        >
          {/* Left Column - Content */}
          <Box>
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <Chip
                  icon={<SparkleIcon />}
                  label="Staten Island's #1 Advanced Dental Practice"
                  sx={{
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(30, 64, 175, 0.2) 100%)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    color: 'white',
                    fontSize: '0.875rem',
                    py: 2,
                    px: 1,
                  }}
                />
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Rating value={5} readOnly size="small" />
                  <Typography variant="caption" sx={{ color: 'grey.400' }}>
                    (200+ Reviews)
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  color: 'white',
                  '& .gradient': {
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  },
                }}
              >
                Experience the Future of{' '}
                <span className="gradient">Dental Care</span>
              </Typography>
            </motion.div>

            {/* Rotating Subheading */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Box sx={{ height: 60, mb: 4 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTextIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: 'grey.300',
                        fontWeight: 400,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <CheckIcon sx={{ color: 'success.main' }} />
                      {rotatingTexts[currentTextIndex]}
                    </Typography>
                  </motion.div>
                </AnimatePresence>
              </Box>
            </motion.div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ mb: 5, gap: 2 }}
              >
                {features.map((feature, index) => (
                  <Chip
                    key={index}
                    icon={feature.icon}
                    label={feature.text}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      '& .MuiChip-icon': {
                        color: 'primary.light',
                      },
                    }}
                  />
                ))}
              </Stack>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => onNavigate('/contact')}
                  sx={{
                    py: 2,
                    px: 4,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 25px 50px rgba(59, 130, 246, 0.4)',
                    },
                  }}
                >
                  Book Free Consultation
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayIcon />}
                  onClick={() => setShowVideo(true)}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Watch Yomi Demo
                </Button>
              </Stack>
            </motion.div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <PhoneIcon sx={{ color: 'primary.light' }} />
                  <Typography sx={{ color: 'grey.300' }}>
                    Call: {CONTACT_INFO.phone.display}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <ScheduleIcon sx={{ color: 'primary.light' }} />
                  <Typography sx={{ color: 'grey.300' }}>
                    Open: Mon-Fri 9AM-6PM
                  </Typography>
                </Box>
              </Stack>
            </motion.div>
          </Box>

          {/* Right Column - Visual Elements */}
          <Box
            sx={{
              position: 'relative',
              display: { xs: 'none', lg: 'block' },
            }}
          >
            {/* 3D Card Stack */}
            <Box sx={{ position: 'relative', height: 600 }}>
              {/* Main Image Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={heroInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '70%',
                }}
              >
                <Paper
                  elevation={20}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    position: 'relative',
                    transform: 'perspective(1000px) rotateY(10deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateY(0deg) scale(1.02)',
                    },
                  }}
                >
                  <img
                    src="/images/pedro.png"
                    alt="Pedro Advanced Dental"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.9,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                      p: 3,
                    }}
                  >
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                      Yomi Robotic System
                    </Typography>
                    <Typography sx={{ color: 'grey.300' }}>
                      Precision meets innovation
                    </Typography>
                  </Box>
                </Paper>
              </motion.div>

              {/* Floating Stats Cards */}
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, x: -50, y: -50 }}
                  animate={heroInView ? { 
                    opacity: 1, 
                    scale: 1, 
                    x: 0, 
                    y: 0,
                  } : {}}
                  transition={{ 
                    duration: 0.6, 
                    delay: 1 + index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  }}
                  style={{
                    position: 'absolute',
                    top: `${20 + index * 25}%`,
                    right: index % 2 === 0 ? '5%' : '0%',
                    zIndex: 10 - index,
                  }}
                >
                  <Paper
                    elevation={10}
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      minWidth: 140,
                      textAlign: 'center',
                      border: '1px solid rgba(124, 58, 237, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 800,
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <CountUp
                        end={stat.value}
                        decimals={stat.decimals || 0}
                        suffix={stat.suffix}
                        duration={2}
                        start={heroInView ? 0 : stat.value}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}

              {/* Patient Review Card */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={heroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
                style={{
                  position: 'absolute',
                  bottom: '5%',
                  left: '5%',
                  zIndex: 15,
                }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    maxWidth: 280,
                    border: '1px solid rgba(124, 58, 237, 0.1)',
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{ 
                        width: 48, 
                        height: 48,
                        bgcolor: 'primary.main'
                      }}
                    >
                      SM
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Sarah M.
                      </Typography>
                      <Rating value={5} readOnly size="small" />
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}
                  >
                    "The Yomi robot made my implant surgery so precise and comfortable!"
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          </Box>
        </Box>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <IconButton
            sx={{
              color: 'white',
              animation: 'bounce 2s infinite',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-10px)',
                },
                '60%': {
                  transform: 'translateY(-5px)',
                },
              },
            }}
          >
            <ScrollDownIcon fontSize="large" />
          </IconButton>
        </motion.div>
      </Container>
    </Box>
  );
};

export default EnhancedHero;