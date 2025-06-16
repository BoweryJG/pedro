import React from 'react';
import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import ShimmerEffect from './ShimmerEffect';

interface EnhancedButtonProps extends ButtonProps {
  gradient?: string;
  glowColor?: string;
  shimmer?: boolean;
  pulseAnimation?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  gradient = 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  glowColor = 'rgba(59, 130, 246, 0.4)',
  shimmer = true,
  pulseAnimation = false,
  sx,
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {pulseAnimation && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              inset: -4,
              borderRadius: 'inherit',
              background: gradient,
              opacity: 0.6,
              filter: 'blur(15px)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: 'inherit',
              background: gradient,
              opacity: 0.4,
              filter: 'blur(25px)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.2, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </>
      )}
      
      <Button
        {...props}
        sx={{
          background: gradient,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `0 10px 30px ${glowColor}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 15px 40px ${glowColor}`,
            background: gradient,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
          ...sx,
        }}
      >
        {children}
        {shimmer && <ShimmerEffect color="rgba(255, 255, 255, 0.5)" duration={2} />}
      </Button>
    </motion.div>
  );
};

export default EnhancedButton;