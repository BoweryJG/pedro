import React from 'react';
import { motion } from 'framer-motion';

interface ColorEchoSystemProps {
  subdomain?: 'tmj' | 'implants' | 'robotic' | 'medspa' | 'aboutface';
  particleCount?: number;
}

export const ColorEchoSystem: React.FC<ColorEchoSystemProps> = ({ 
  subdomain, 
  particleCount = 15 
}) => {
  // Spectrum colors from the main brand
  const spectrumColors = [
    '#1A237E', // spectrum-indigo
    '#7C4DFF', // spectrum-violet
    '#F50057', // spectrum-fuchsia
    '#FF6B6B', // spectrum-coral
    '#FFB300', // spectrum-amber
  ];

  // Generate particles with random positions and delays
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    color: spectrumColors[i % spectrumColors.length],
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 10 + Math.random() * 5,
    size: 3 + Math.random() * 3,
  }));

  return (
    <div className="color-echo-system">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="echo-particle"
          style={{
            position: 'absolute',
            left: particle.left,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            borderRadius: '50%',
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.8, 1.2, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      <style jsx>{`
        .color-echo-system {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        
        @media (max-width: 768px) {
          .color-echo-system {
            display: none; /* Disable on mobile for performance */
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .echo-particle {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Export a hook for programmatic control
export const useColorEcho = () => {
  const [isActive, setIsActive] = React.useState(true);
  
  const toggleColorEcho = () => setIsActive(!isActive);
  const enableColorEcho = () => setIsActive(true);
  const disableColorEcho = () => setIsActive(false);
  
  return {
    isActive,
    toggleColorEcho,
    enableColorEcho,
    disableColorEcho,
  };
};