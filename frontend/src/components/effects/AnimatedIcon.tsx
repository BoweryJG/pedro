import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { cloneElement } from 'react';

interface AnimatedIconProps {
  icon: ReactElement;
  gradient?: string;
  pulseColor?: string;
  glowColor?: string;
  size?: number;
  animate?: boolean;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  gradient = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  pulseColor = 'rgba(59, 130, 246, 0.4)',
  glowColor = 'rgba(139, 92, 246, 0.6)',
  size = 40,
  animate = true,
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size * 1.5,
        height: size * 1.5,
      }}
    >
      {/* Glow effect */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: glowColor,
          filter: 'blur(20px)',
          opacity: 0.6,
        }}
        animate={animate ? {
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.8, 0.6],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Soft pulse effect - single subtle wave */}
      {animate && (
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pulseColor} 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.8, 1.8],
            opacity: [0.4, 0, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}
      
      {/* Icon container with gradient */}
      <Box
        sx={{
          position: 'relative',
          background: gradient,
          borderRadius: '50%',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 32px ${pulseColor}`,
          zIndex: 1,
        }}
      >
        {cloneElement(icon, {
          sx: {
            ...(icon.props as any)?.sx,
            color: 'white',
            fontSize: size,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          },
        } as any)}
      </Box>
    </Box>
  );
};

export default AnimatedIcon;