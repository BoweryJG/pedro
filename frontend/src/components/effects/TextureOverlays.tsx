import React from 'react';
import { Box, styled } from '@mui/material';

// Diagonal Lines Pattern
export const DiagonalLines = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  backgroundImage: `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 35px,
    rgba(0, 0, 0, 0.01) 35px,
    rgba(0, 0, 0, 0.01) 70px
  )`,
  zIndex: 1,
}));

// Micro Dot Pattern
export const MicroDots = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  backgroundImage: `radial-gradient(circle, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
  backgroundSize: '20px 20px',
  zIndex: 1,
}));

// Radial Gradient Overlay
export const RadialGradientOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  background: `radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.02) 100%)`,
  zIndex: 1,
}));

// Grain Texture - SIMPLIFIED FOR PERFORMANCE
export const GrainTexture = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  opacity: 0.02,
  zIndex: 2,
  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
  // Animation removed for performance
}));

// Cross Hatch Pattern
export const CrossHatch = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.01) 10px,
      rgba(0, 0, 0, 0.01) 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.01) 10px,
      rgba(0, 0, 0, 0.01) 11px
    )
  `,
  zIndex: 1,
}));

// Subtle Grid Pattern
export const SubtleGrid = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  backgroundImage: `
    linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)
  `,
  backgroundSize: '50px 50px',
  zIndex: 1,
}));

// Composite Texture Container
interface TexturedSectionProps {
  children: React.ReactNode;
  textures?: ('diagonal' | 'dots' | 'radial' | 'grain' | 'crosshatch' | 'grid')[];
  sx?: any;
}

export const TexturedSection: React.FC<TexturedSectionProps> = ({ 
  children, 
  textures = ['diagonal', 'grain'],
  sx = {} 
}) => {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      {textures.includes('diagonal') && <DiagonalLines />}
      {textures.includes('dots') && <MicroDots />}
      {textures.includes('radial') && <RadialGradientOverlay />}
      {textures.includes('grain') && <GrainTexture />}
      {textures.includes('crosshatch') && <CrossHatch />}
      {textures.includes('grid') && <SubtleGrid />}
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        {children}
      </Box>
    </Box>
  );
};

// Premium Card with Texture
export const TexturedCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 35px,
        rgba(0, 0, 0, 0.01) 35px,
        rgba(0, 0, 0, 0.01) 70px
      )
    `,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  },
}));