import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface AnimatedGradientBorderProps {
  children: ReactNode;
  borderWidth?: number;
  borderRadius?: number | string;
  colors?: string[];
  animationDuration?: number;
}

const AnimatedGradientBorder: React.FC<AnimatedGradientBorderProps> = ({
  children,
  borderWidth = 2,
  borderRadius = 16,
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
  animationDuration = 4,
}) => {
  const gradient = `linear-gradient(135deg, ${colors.join(', ')})`;
  
  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: typeof borderRadius === 'number' ? borderRadius / 8 : borderRadius,
        p: `${borderWidth}px`,
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          right: '-50%',
          bottom: '-50%',
          background: gradient,
          borderRadius: typeof borderRadius === 'number' ? borderRadius / 8 : borderRadius,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: animationDuration,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          background: 'background.paper',
          borderRadius: typeof borderRadius === 'number' ? borderRadius / 8 : borderRadius,
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AnimatedGradientBorder;