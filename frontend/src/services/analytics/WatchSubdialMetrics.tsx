import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SubdialMetric {
  label: string;
  value: number;
  max: number;
  unit?: string;
  color: string;
}

interface WatchSubdialMetricsProps {
  metrics: SubdialMetric[];
}

const WatchSubdialMetrics: React.FC<WatchSubdialMetricsProps> = ({ metrics }) => {
  const calculateRotation = (value: number, max: number) => {
    return (value / max) * 270 - 135; // -135 to 135 degrees
  };

  return (
    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', my: 4 }}>
      {metrics.map((metric, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Subdial Background */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          />

          {/* Tick marks */}
          {[...Array(9)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: 2,
                height: 8,
                background: 'rgba(255,255,255,0.3)',
                top: 4,
                left: '50%',
                transform: `translateX(-50%) rotate(${-135 + i * 33.75}deg)`,
                transformOrigin: '50% 56px'
              }}
            />
          ))}

          {/* Needle */}
          <motion.div
            initial={{ rotate: -135 }}
            animate={{ rotate: calculateRotation(metric.value, metric.max) }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            style={{
              position: 'absolute',
              width: 3,
              height: 45,
              background: `linear-gradient(to bottom, ${metric.color} 0%, ${metric.color} 50%, transparent 50%)`,
              bottom: '50%',
              left: '50%',
              transform: 'translateX(-50%)',
              transformOrigin: 'bottom',
              filter: `drop-shadow(0 0 4px ${metric.color})`
            }}
          />

          {/* Center dot */}
          <Box
            sx={{
              position: 'absolute',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: metric.color,
              boxShadow: `0 0 8px ${metric.color}`,
              zIndex: 2
            }}
          />

          {/* Value display */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 25,
              textAlign: 'center',
              width: '100%'
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: metric.color,
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            >
              {metric.value}{metric.unit || ''}
            </Typography>
          </Box>

          {/* Label */}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              bottom: -5,
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              width: '100%',
              textAlign: 'center'
            }}
          >
            {metric.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WatchSubdialMetrics;