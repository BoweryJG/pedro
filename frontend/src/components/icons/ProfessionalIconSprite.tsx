import React from 'react';

interface ProfessionalIconProps {
  iconType: 'dental-chair' | 'female-profile' | 'tech-device' | 'treatment-bottle' | 'sparkle-face' | 'tooth' | 'calendar' | 'mobile' | 'hand-treatment';
  size?: number;
  className?: string;
  active?: boolean;
}

// Exact positions for the 3x3 luxury medical icons grid
const ICON_POSITIONS = {
  'dental-chair': { x: 0, y: 0 },      // Top-left - TMJ
  'female-profile': { x: 50, y: 0 },   // Top-center - Aesthetics  
  'tech-device': { x: 100, y: 0 },     // Top-right - Robotic
  'treatment-bottle': { x: 0, y: 50 }, // Middle-left
  'sparkle-face': { x: 50, y: 50 },    // Middle-center - MedSpa
  'tooth': { x: 100, y: 50 },          // Middle-right - Implants
  'calendar': { x: 0, y: 100 },        // Bottom-left
  'mobile': { x: 50, y: 100 },         // Bottom-center
  'hand-treatment': { x: 100, y: 100 } // Bottom-right - AboutFace
};

export const ProfessionalIconSprite: React.FC<ProfessionalIconProps> = ({ 
  iconType, 
  size = 120, 
  className = '',
  active = false 
}) => {
  const position = ICON_POSITIONS[iconType];
  
  return (
    <div
      className={`professional-icon-sprite ${active ? 'active' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundImage: 'url(/images/luxury-medical-icons.png)',
        backgroundSize: '300% 300%', // 3x3 grid
        backgroundPosition: `${position.x}% ${position.y}%`,
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: active 
          ? 'drop-shadow(0 8px 24px rgba(212, 175, 55, 0.4)) brightness(1.1) contrast(1.1)' 
          : 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))',
        transform: active ? 'scale(1.05)' : 'scale(1)',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {/* Professional glow effect for active state */}
      {active && (
        <div
          style={{
            position: 'absolute',
            inset: -20,
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            zIndex: -1,
            animation: 'professionalGlow 3s ease-in-out infinite',
          }}
        />
      )}
      
      {/* Luxury rim effect */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          background: active 
            ? 'linear-gradient(45deg, #D4AF37, #FFD700, #D4AF37)' 
            : 'linear-gradient(45deg, rgba(212, 175, 55, 0.3), rgba(255, 215, 0, 0.3), rgba(212, 175, 55, 0.3))',
          padding: '2px',
          zIndex: -1,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
};

// Enhanced icons mapping for dental specialties
export const professionalIcons = {
  tmj: 'dental-chair' as const,
  implants: 'tooth' as const,
  robotic: 'tech-device' as const,
  medspa: 'sparkle-face' as const,
  aboutface: 'hand-treatment' as const,
};

export type ProfessionalIconType = keyof typeof professionalIcons;

// Professional styling for the icons
export const professionalIconStyles = `
  .professional-icon-sprite {
    position: relative;
    cursor: pointer;
    background-attachment: fixed;
  }
  
  .professional-icon-sprite:hover {
    transform: scale(1.08) rotate(2deg) !important;
    filter: drop-shadow(0 12px 32px rgba(212, 175, 55, 0.5)) brightness(1.15) contrast(1.15) !important;
  }
  
  .professional-icon-sprite.active {
    animation: professionalPulse 2s ease-in-out infinite;
  }
  
  @keyframes professionalGlow {
    0%, 100% { 
      opacity: 0.6;
      transform: scale(1);
    }
    50% { 
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
  
  @keyframes professionalPulse {
    0%, 100% { 
      transform: scale(1.05);
    }
    50% { 
      transform: scale(1.08);
    }
  }
  
  /* High performance GPU acceleration */
  .professional-icon-sprite {
    will-change: transform, filter;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }
  
  /* Preload the sprite image for instant loading */
  .professional-icon-sprite::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 1px;
    background-image: url(/images/luxury-medical-icons.png);
    opacity: 0;
    pointer-events: none;
  }
  
  /* Professional focus states for accessibility */
  .professional-icon-sprite:focus {
    outline: 3px solid rgba(212, 175, 55, 0.6);
    outline-offset: 4px;
  }
  
  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .professional-icon-sprite,
    .professional-icon-sprite:hover,
    .professional-icon-sprite.active {
      animation: none !important;
      transition: none !important;
      transform: none !important;
    }
  }
`;