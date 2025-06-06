import React, { useState } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface IconicChatbotLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const IconicChatbotLauncher: React.FC<IconicChatbotLauncherProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  const [hovering, setHovering] = useState(false);

  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3 
      }}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 1000,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Box
        onClick={onToggle}
        sx={{
          width: 70,
          height: 70,
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          // Morphing shape
          '& .launcher-shape': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
            borderRadius: hovering ? '30% 70% 70% 30% / 30% 30% 70% 70%' : '50%',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hovering ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            boxShadow: hovering 
              ? '0 20px 40px rgba(129, 140, 248, 0.4), inset 0 0 20px rgba(255,255,255,0.2)' 
              : '0 10px 30px rgba(129, 140, 248, 0.3)',
            
            // Animated border
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -3,
              borderRadius: 'inherit',
              padding: 3,
              background: 'linear-gradient(45deg, #60a5fa, #a78bfa, #f472b6, #60a5fa)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: hovering ? 1 : 0,
              transition: 'opacity 0.3s ease',
              animation: hovering ? 'rotate-border 3s linear infinite' : 'none',
            },
          },
          
          // Center icon container
          '& .icon-container': {
            position: 'relative',
            zIndex: 2,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: hovering ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          },
          
          // Animated rings
          '& .ring': {
            position: 'absolute',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            animation: 'expand-ring 2s ease-out infinite',
          },
          
          '@keyframes rotate-border': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
          
          '@keyframes expand-ring': {
            '0%': {
              width: 40,
              height: 40,
              opacity: 1,
            },
            '100%': {
              width: 90,
              height: 90,
              opacity: 0,
            },
          },
        }}
      >
        {/* Morphing background shape */}
        <Box className="launcher-shape" />
        
        {/* Animated rings */}
        {hovering && (
          <>
            <Box className="ring" sx={{ animationDelay: '0s' }} />
            <Box className="ring" sx={{ animationDelay: '0.5s' }} />
            <Box className="ring" sx={{ animationDelay: '1s' }} />
          </>
        )}
        
        {/* Unique icon design */}
        <Box className="icon-container">
          {/* Custom AI chat icon */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            {/* Brain/AI shape */}
            <path
              d="M16 4C11 4 8 7 8 11C8 13 9 14 9 14C9 14 8 15 8 17C8 19 9 20 10 20C10 20 10 22 12 23C14 24 16 24 16 24C16 24 18 24 20 23C22 22 22 20 22 20C23 20 24 19 24 17C24 15 23 14 23 14C23 14 24 13 24 11C24 7 21 4 16 4Z"
              fill="white"
              opacity="0.9"
            />
            
            {/* Neural connections */}
            <circle cx="12" cy="10" r="1.5" fill="#818cf8" />
            <circle cx="20" cy="10" r="1.5" fill="#818cf8" />
            <circle cx="16" cy="14" r="1.5" fill="#c084fc" />
            <circle cx="12" cy="18" r="1.5" fill="#f472b6" />
            <circle cx="20" cy="18" r="1.5" fill="#f472b6" />
            
            {/* Connecting lines */}
            <path
              d="M12 10L16 14M20 10L16 14M16 14L12 18M16 14L20 18"
              stroke="#e0e7ff"
              strokeWidth="1"
              opacity="0.6"
            />
            
            {/* Sparkle effects */}
            {hovering && (
              <>
                <circle cx="8" cy="8" r="1" fill="white" opacity="0.8">
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="24" cy="8" r="1" fill="white" opacity="0.8">
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur="2s"
                    begin="0.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="16" cy="26" r="1" fill="white" opacity="0.8">
                  <animate
                    attributeName="opacity"
                    values="0;0.8;0"
                    dur="2s"
                    begin="1s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>
        </Box>
        
        {/* Floating particles */}
        {hovering && (
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: ['#818cf8', '#c084fc', '#f472b6'][i % 3],
                  left: '50%',
                  top: '50%',
                  animation: `float-particle-${i} 3s ease-in-out infinite`,
                  [`@keyframes float-particle-${i}`]: {
                    '0%': {
                      transform: 'translate(-50%, -50%) translate(0, 0)',
                      opacity: 0,
                    },
                    '20%': {
                      opacity: 1,
                    },
                    '80%': {
                      opacity: 1,
                    },
                    '100%': {
                      transform: `translate(-50%, -50%) translate(${Math.cos(i * 60 * Math.PI / 180) * 40}px, ${Math.sin(i * 60 * Math.PI / 180) * 40}px)`,
                      opacity: 0,
                    },
                  },
                }}
              />
            ))}
          </Box>
        )}
        
        {/* Pulse indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)',
            animation: 'pulse-dot 2s ease-in-out infinite',
            '@keyframes pulse-dot': {
              '0%, 100%': {
                transform: 'scale(1)',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)',
              },
              '50%': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 0 6px rgba(16, 185, 129, 0.1)',
              },
            },
          }}
        />
      </Box>
    </motion.div>
  );
};