import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import CompareIcon from '@mui/icons-material/Compare';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const cases = [
  {
    id: 1,
    procedure: 'Dental Implants with Yomi',
    description: 'Full mouth restoration with robotic precision',
    before: '/images/patient1before.png',
    after: '/images/patient1after.png',
    duration: '3 visits over 4 months',
  },
  {
    id: 2,
    procedure: 'TMJ Treatment',
    description: 'Complete resolution of chronic jaw pain',
    before: '/images/patient1before.png',
    after: '/images/patient1after.png',
    duration: '6 weeks treatment',
  },
  {
    id: 3,
    procedure: 'EMFACE Results',
    description: 'Non-surgical facial lifting and contouring',
    before: '/images/patient1before.png',
    after: '/images/patient1after.png',
    duration: '4 sessions',
  },
];

const BeforeAfterGallery = () => {
  const [currentCase, setCurrentCase] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const nextCase = () => {
    setCurrentCase((prev) => (prev + 1) % cases.length);
    setSliderPosition(50);
  };

  const prevCase = () => {
    setCurrentCase((prev) => (prev - 1 + cases.length) % cases.length);
    setSliderPosition(50);
  };

  const currentCaseData = cases[currentCase];

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, mb: 2 }}
      >
        Real Results, Real Patients
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        paragraph
        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
      >
        See the transformative results our patients have achieved
      </Typography>

      <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Card sx={{ overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 300, md: 500 },
              cursor: 'ew-resize',
              userSelect: 'none',
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
          >
            {/* After Image */}
            <Box
              component="img"
              src={currentCaseData.after}
              alt="After"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500/e3f2fd/1976d2?text=After';
              }}
            />

            {/* Before Image with Clip */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              }}
            >
              <Box
                component="img"
                src={currentCaseData.before}
                alt="Before"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x500/ffebee/c62828?text=Before';
                }}
              />
            </Box>

            {/* Slider Line */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
                width: 4,
                bgcolor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'white',
                  boxShadow: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            >
              <CompareIcon
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'primary.main',
                }}
              />
            </Box>

            {/* Labels */}
            <Chip
              label="BEFORE"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'error.main',
                color: 'white',
              }}
            />
            <Chip
              label="AFTER"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'success.main',
                color: 'white',
              }}
            />
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  {currentCaseData.procedure}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentCaseData.description}
                </Typography>
              </Box>
              <Chip
                label={currentCaseData.duration}
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="center">
              <IconButton onClick={prevCase}>
                <ChevronLeftIcon />
              </IconButton>
              <Stack direction="row" spacing={1}>
                {cases.map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index === currentCase ? 'primary.main' : 'grey.300',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setCurrentCase(index);
                      setSliderPosition(50);
                    }}
                  />
                ))}
              </Stack>
              <IconButton onClick={nextCase}>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            Drag the slider to compare before and after
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default BeforeAfterGallery;