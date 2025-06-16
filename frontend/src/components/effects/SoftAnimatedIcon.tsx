import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactElement } from 'react';
import { cloneElement } from 'react';

interface SoftAnimatedIconProps {
  icon: ReactElement;
  gradient?: string;
  glowColor?: string;
  size?: number;
  animate?: boolean;
}

const SoftAnimatedIcon: React.FC<SoftAnimatedIconProps> = ({
  icon,
  gradient = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  glowColor = 'rgba(139, 92, 246, 0.3)',
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
      {/* Soft ambient glow - no harsh edges */}
      <motion.div
        style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 60%)`,
          filter: 'blur(25px)',
          opacity: 0.5,
        }}
        animate={animate ? {
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.6, 0.5],
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Icon container with subtle shadow */}
      <Box
        sx={{
          position: 'relative',
          background: gradient,
          borderRadius: '50%',
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px ${glowColor}`,
          zIndex: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 6px 25px ${glowColor}`,
          },
        }}
      >
        {cloneElement(icon, {
          sx: {
            ...(icon.props as any)?.sx,
            color: 'white',
            fontSize: size,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          },
        } as any)}
      </Box>
    </Box>
  );
};

export default SoftAnimatedIcon;