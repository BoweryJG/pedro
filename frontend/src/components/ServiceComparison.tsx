import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface ComparisonData {
  traditional: {
    title: string;
    features: Array<{ text: string; available: boolean }>;
    time: string;
    pain: string;
    cost: string;
  };
  advanced: {
    title: string;
    features: Array<{ text: string; available: boolean }>;
    time: string;
    pain: string;
    cost: string;
  };
}

const comparisons: Record<string, ComparisonData> = {
  implants: {
    traditional: {
      title: 'Traditional Implants',
      features: [
        { text: 'Manual placement', available: true },
        { text: 'Longer healing time', available: false },
        { text: 'Higher risk of complications', available: false },
        { text: 'Multiple appointments', available: true },
        { text: 'More invasive procedure', available: false },
      ],
      time: '6-9 months',
      pain: 'Moderate to High',
      cost: '$$',
    },
    advanced: {
      title: 'Yomi Robotic Surgery',
      features: [
        { text: 'Computer-guided precision', available: true },
        { text: '50% faster healing', available: true },
        { text: 'Minimal complications', available: true },
        { text: 'Fewer appointments', available: true },
        { text: 'Minimally invasive', available: true },
      ],
      time: '3-4 months',
      pain: 'Minimal',
      cost: '$$$',
    },
  },
  tmj: {
    traditional: {
      title: 'Traditional TMJ Treatment',
      features: [
        { text: 'Pain medication only', available: true },
        { text: 'Generic mouth guards', available: true },
        { text: 'Limited diagnostic tools', available: false },
        { text: 'Slow results', available: false },
        { text: 'Surgery as last resort', available: true },
      ],
      time: '6-12 months',
      pain: 'Ongoing',
      cost: '$',
    },
    advanced: {
      title: 'Our TMJ Protocol',
      features: [
        { text: 'Comprehensive diagnosis', available: true },
        { text: 'Custom oral appliances', available: true },
        { text: 'Advanced 3D imaging', available: true },
        { text: 'Rapid pain relief', available: true },
        { text: 'Non-surgical solutions', available: true },
      ],
      time: '6-8 weeks',
      pain: 'Rapidly decreasing',
      cost: '$$',
    },
  },
  facial: {
    traditional: {
      title: 'Traditional Facelift',
      features: [
        { text: 'Surgical procedure', available: true },
        { text: 'General anesthesia', available: true },
        { text: 'Weeks of downtime', available: false },
        { text: 'Visible scarring', available: false },
        { text: 'Risk of complications', available: false },
      ],
      time: '2-4 weeks recovery',
      pain: 'Significant',
      cost: '$$$$',
    },
    advanced: {
      title: 'EMFACE by BTL',
      features: [
        { text: 'Non-invasive treatment', available: true },
        { text: 'No needles or surgery', available: true },
        { text: 'Zero downtime', available: true },
        { text: 'Natural-looking results', available: true },
        { text: 'FDA cleared & safe', available: true },
      ],
      time: '20 minutes',
      pain: 'None',
      cost: '$$',
    },
  },
};

const ServiceComparison = () => {
  const [selectedService, setSelectedService] = useState<keyof typeof comparisons>('implants');

  const services = [
    { key: 'implants', label: 'Dental Implants', icon: '🦷' },
    { key: 'tmj', label: 'TMJ Treatment', icon: '🩺' },
    { key: 'facial', label: 'Facial Rejuvenation', icon: '✨' },
  ];

  const currentComparison = comparisons[selectedService];

  return (
    <Box sx={{ py: 8 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, mb: 2 }}
      >
        Why Choose Advanced Treatment?
      </Typography>
      <Typography
        variant="h6"
        align="center"
        color="text.secondary"
        paragraph
        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
      >
        Compare traditional methods with our cutting-edge solutions
      </Typography>

      {/* Service Selector */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mb: 6, flexWrap: 'wrap' }}
      >
        {services.map((service) => (
          <Button
            key={service.key}
            variant={selectedService === service.key ? 'contained' : 'outlined'}
            size="large"
            startIcon={<span style={{ fontSize: '1.5rem' }}>{service.icon}</span>}
            onClick={() => setSelectedService(service.key as keyof typeof comparisons)}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 8,
              textTransform: 'none',
              fontSize: '1.1rem',
            }}
          >
            {service.label}
          </Button>
        ))}
      </Stack>

      {/* Comparison Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedService}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Traditional Method */}
            <Card
              sx={{
                flex: '1 1 350px',
                maxWidth: 450,
                position: 'relative',
                bgcolor: 'grey.50',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom align="center">
                  {currentComparison.traditional.title}
                </Typography>
                
                <Stack spacing={2} sx={{ my: 4 }}>
                  {currentComparison.traditional.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      {feature.available ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <CloseIcon sx={{ color: 'error.main' }} />
                      )}
                      <Typography
                        sx={{
                          textDecoration: !feature.available ? 'line-through' : 'none',
                          opacity: !feature.available ? 0.6 : 1,
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Stack spacing={2}>
                  <Paper sx={{ p: 2, bgcolor: 'white' }}>
                    <Typography variant="body2" color="text.secondary">
                      Treatment Time
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {currentComparison.traditional.time}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: 'white' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pain Level
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {currentComparison.traditional.pain}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: 'white' }}>
                    <Typography variant="body2" color="text.secondary">
                      Cost Range
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {currentComparison.traditional.cost}
                    </Typography>
                  </Paper>
                </Stack>
              </CardContent>
            </Card>

            {/* Advanced Method */}
            <Card
              sx={{
                flex: '1 1 350px',
                maxWidth: 450,
                position: 'relative',
                border: '2px solid',
                borderColor: 'primary.main',
                transform: 'scale(1.05)',
              }}
            >
              <Chip
                label="RECOMMENDED"
                color="primary"
                icon={<TrendingUpIcon />}
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom align="center" color="primary">
                  {currentComparison.advanced.title}
                </Typography>
                
                <Stack spacing={2} sx={{ my: 4 }}>
                  {currentComparison.advanced.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <CheckIcon sx={{ color: 'success.main' }} />
                      <Typography fontWeight={500}>
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>

                <Stack spacing={2}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.50' }}>
                    <Typography variant="body2" color="text.secondary">
                      Treatment Time
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {currentComparison.advanced.time}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pain Level
                    </Typography>
                    <Typography variant="h6" fontWeight={600} color="success.dark">
                      {currentComparison.advanced.pain}
                    </Typography>
                  </Paper>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="body2" color="text.secondary">
                      Cost Range
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {currentComparison.advanced.cost}
                    </Typography>
                  </Paper>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={() => window.location.href = '/contact'}
                >
                  Get Started Today
                </Button>
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default ServiceComparison;