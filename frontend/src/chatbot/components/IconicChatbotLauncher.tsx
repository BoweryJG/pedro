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
          
          // Simple shape with soft glow
          '& .launcher-shape': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
            borderRadius: '50%',
            transition: 'all 0.5s ease',
            transform: hovering ? 'scale(1.05)' : 'scale(1)',
            boxShadow: hovering 
              ? '0 8px 30px rgba(129, 140, 248, 0.5)' 
              : '0 4px 20px rgba(129, 140, 248, 0.3)',
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
          
        }}
      >
        {/* Morphing background shape */}
        <Box className="launcher-shape" />
        
        
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
            
          </svg>
        </Box>
        
        
        {/* Static status dot */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)',
          }}
        />
      </Box>
    </motion.div>
  );
};