import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SubdialConfig {
  position: 'left' | 'right' | 'bottom';
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  type: 'number' | 'percentage' | 'currency' | 'duration';
  color?: string;
  secondaryLabel?: string;
}

interface GaugeClusterProps {
  title: string;
  mainValue: number;
  mainLabel: string;
  mainMax?: number;
  subdials: SubdialConfig[];
  timeDisplay?: string;
  bottomDisplay?: string;
  personName?: string;
}

const ProfessionalGaugeCluster: React.FC<GaugeClusterProps> = ({
  title,
  mainValue,
  mainLabel,
  mainMax = 100,
  subdials,
  timeDisplay = new Date().toLocaleTimeString('en-US', { hour12: false }),
  bottomDisplay,
  personName
}) => {
  // Calculate rotation for needles based on actual min/max values
  const calculateRotation = (value: number, min: number, max: number): number => {
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return normalized * 270 - 135; // -135° to 135°
  };

  // Format values based on type
  const formatValue = (value: number, type: SubdialConfig['type']): string => {
    switch (type) {
      case 'percentage':
        return `${Math.round(value)}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'duration':
        return `${Math.round(value)}m`;
      default:
        return Math.round(value).toString();
    }
  };

  // Position subdials
  const getSubdialPosition = (position: SubdialConfig['position']) => {
    switch (position) {
      case 'left':
        return { left: '15%', top: '50%', transform: 'translate(-50%, -50%)' };
      case 'right':
        return { right: '15%', top: '50%', transform: 'translate(50%, -50%)' };
      case 'bottom':
        return { left: '50%', bottom: '15%', transform: 'translate(-50%, 50%)' };
    }
  };

  // Render subdial
  const renderSubdial = (subdial: SubdialConfig, index: number) => {
    const rotation = calculateRotation(subdial.value, subdial.min, subdial.max);
    const formattedValue = formatValue(subdial.value, subdial.type);
    
    return (
      <Box
        key={index}
        sx={{
          position: 'absolute',
          ...getSubdialPosition(subdial.position),
          width: 140,
          height: 140,
        }}
      >
        {/* Subdial Background */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #2a2d3a, #1a1d2a)',
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Tick marks */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
              const angle = fraction * 270 - 135;
              const radian = (angle * Math.PI) / 180;
              const innerRadius = 55;
              const outerRadius = 65;
              const cx = 70;
              const cy = 70;
              
              return (
                <g key={fraction}>
                  <line
                    x1={cx + innerRadius * Math.cos(radian)}
                    y1={cy + innerRadius * Math.sin(radian)}
                    x2={cx + outerRadius * Math.cos(radian)}
                    y2={cy + outerRadius * Math.sin(radian)}
                    stroke="#666"
                    strokeWidth="2"
                  />
                  {/* Value labels */}
                  <text
                    x={cx + (outerRadius - 15) * Math.cos(radian)}
                    y={cy + (outerRadius - 15) * Math.sin(radian)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#888"
                    fontSize="10"
                  >
                    {Math.round(subdial.min + fraction * (subdial.max - subdial.min))}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Needle */}
          <motion.div
            initial={{ rotate: -135 }}
            animate={{ rotate: rotation }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 3,
                height: '40%',
                background: `linear-gradient(to top, ${subdial.color || '#00ff00'}, transparent)`,
                transformOrigin: 'bottom',
                bottom: '50%',
                boxShadow: `0 0 10px ${subdial.color || '#00ff00'}`,
              }}
            />
          </motion.div>

          {/* Center dot */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#333',
              border: '2px solid #666',
            }}
          />

          {/* Value display */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: subdial.color || '#00ff00', fontSize: 18, fontWeight: 'bold' }}>
              {formattedValue}
            </Typography>
            <Typography sx={{ color: '#888', fontSize: 10 }}>
              {subdial.unit}
            </Typography>
          </Box>

          {/* Label */}
          <Typography
            sx={{
              position: 'absolute',
              top: 15,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#aaa',
              fontSize: 11,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            {subdial.label}
          </Typography>

          {/* Secondary label if exists */}
          {subdial.secondaryLabel && (
            <Typography
              sx={{
                position: 'absolute',
                bottom: 5,
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#666',
                fontSize: 9,
              }}
            >
              {subdial.secondaryLabel}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, #1e2128, #0f1117)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 0 60px rgba(0,0,0,0.5)',
        border: '3px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Title */}
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#00ff00',
          px: 3,
          py: 0.5,
          borderRadius: 1,
        }}
      >
        <Typography sx={{ color: '#000', fontSize: 14, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>

      {/* Time display */}
      <Typography
        sx={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#00ff00',
          fontSize: 24,
          fontFamily: 'monospace',
          fontWeight: 'bold',
        }}
      >
        {timeDisplay}
      </Typography>

      {/* Main gauge */}
      <Box sx={{ position: 'relative', width: 300, height: 300 }}>
        {/* Main gauge background */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #2a2d3a, #1a1d2a)',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.7)',
            border: '3px solid rgba(255,255,255,0.1)',
          }}
        />

        {/* Main needle */}
        <motion.div
          initial={{ rotate: -135 }}
          animate={{ rotate: calculateRotation(mainValue, 0, mainMax) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 4,
              height: '45%',
              background: 'linear-gradient(to top, #fff, #888)',
              transformOrigin: 'bottom',
              bottom: '50%',
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          />
        </motion.div>

        {/* Main value */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: '#fff', fontSize: 48, fontWeight: 'bold' }}>
            {mainValue}
          </Typography>
          <Typography sx={{ color: '#888', fontSize: 14 }}>
            {mainLabel}
          </Typography>
        </Box>
      </Box>

      {/* Subdials */}
      {subdials.map((subdial, index) => renderSubdial(subdial, index))}

      {/* Bottom display */}
      {(personName || bottomDisplay) && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          {personName && (
            <Typography sx={{ color: '#00ff00', fontSize: 16, mb: 0.5 }}>
              {personName}
            </Typography>
          )}
          {bottomDisplay && (
            <Box
              sx={{
                background: '#000',
                border: '1px solid #333',
                px: 3,
                py: 1,
                borderRadius: 1,
              }}
            >
              <Typography sx={{ color: '#00ff00', fontSize: 20, fontFamily: 'monospace' }}>
                {bottomDisplay}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProfessionalGaugeCluster;