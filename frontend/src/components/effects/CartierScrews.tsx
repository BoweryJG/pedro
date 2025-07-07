import React from 'react';

interface CartierScrewProps {
  size?: number;
  position: { x: number; y: number };
  metalType?: 'steel' | 'gold' | 'bronze';
  interactive?: boolean;
  className?: string;
}

interface CornerScrewsProps {
  containerWidth: number;
  containerHeight: number;
  screwSize?: number;
  metalType?: 'steel' | 'gold' | 'bronze';
  interactive?: boolean;
  offset?: number;
}

export const CartierScrew: React.FC<CartierScrewProps> = ({ 
  size = 4, 
  position, 
  metalType = 'steel',
  interactive = true,
  className = ''
}) => {
  const screwId = `screw-${Math.random().toString(36).substr(2, 9)}`;
  const hexPoints = [];
  // Generate hexagon points for Allen key socket
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    hexPoints.push(`${Math.cos(angle) * size * 0.35},${Math.sin(angle) * size * 0.35}`);
  }
  
  return (
    <g 
      className={`cartier-screw ${interactive ? 'interactive' : ''} ${className}`}
      transform={`translate(${position.x}, ${position.y})`}
    >
      {/* Ultra-detailed gradient definitions */}
      <defs>
        {/* Main metal gradient with multiple stops for realism */}
        <radialGradient id={`${screwId}-outer`} cx="0.3" cy="0.3" r="1">
          <stop offset="0%" stopColor={
            metalType === 'gold' ? '#fff9e6' : 
            metalType === 'bronze' ? '#f4e4bc' : '#fafafa'
          } />
          <stop offset="15%" stopColor={
            metalType === 'gold' ? '#f4e4bc' : 
            metalType === 'bronze' ? '#e6d4a8' : '#f0f0f0'
          } />
          <stop offset="30%" stopColor={
            metalType === 'gold' ? '#e6d4a8' : 
            metalType === 'bronze' ? '#d4af37' : '#e0e0e0'
          } />
          <stop offset="50%" stopColor={
            metalType === 'gold' ? '#c9a961' : 
            metalType === 'bronze' ? '#a8862b' : '#c0c0c0'
          } />
          <stop offset="70%" stopColor={
            metalType === 'gold' ? '#b8860b' : 
            metalType === 'bronze' ? '#8b6914' : '#a0a0a0'
          } />
          <stop offset="85%" stopColor={
            metalType === 'gold' ? '#a07605' : 
            metalType === 'bronze' ? '#6b5b00' : '#808080'
          } />
          <stop offset="100%" stopColor={
            metalType === 'gold' ? '#8b6914' : 
            metalType === 'bronze' ? '#5a4a00' : '#606060'
          } />
        </radialGradient>
        
        {/* Inner socket gradient for depth */}
        <radialGradient id={`${screwId}-socket`} cx="0.5" cy="0.5" r="0.8">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
          <stop offset="30%" stopColor="#1a1a1a" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#333333" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4d4d4d" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Edge bevel gradient */}
        <linearGradient id={`${screwId}-bevel`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
        </linearGradient>
        
        {/* Micro-texture pattern */}
        <pattern id={`${screwId}-texture`} x="0" y="0" width="2" height="2" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.3" fill="rgba(0,0,0,0.05)" />
        </pattern>
        
        {/* Specular highlight */}
        <radialGradient id={`${screwId}-highlight`} cx="0.3" cy="0.3" r="0.5">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Outer ring with multi-layer beveling */}
      <circle 
        cx="0" 
        cy="0" 
        r={size} 
        fill={`url(#${screwId}-outer)`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={size * 0.02}
        filter="drop-shadow(0 0.5px 1px rgba(0,0,0,0.3))"
      />
      
      {/* Beveled edge ring */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.95} 
        fill="none"
        stroke={`url(#${screwId}-bevel)`}
        strokeWidth={size * 0.05}
        opacity="0.8"
      />
      
      {/* Micro-texture overlay */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.9} 
        fill={`url(#${screwId}-texture)`}
        opacity="0.3"
      />
      
      {/* Inner socket depression */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.7} 
        fill={`url(#${screwId}-socket)`}
        filter="blur(0.2px)"
      />
      
      {/* Hexagonal Allen socket with depth */}
      <g filter="drop-shadow(0 0.5px 1px rgba(0,0,0,0.6))">
        {/* Socket walls */}
        <polygon 
          points={hexPoints.join(' ')}
          fill="none"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth={size * 0.04}
          strokeLinejoin="round"
        />
        {/* Socket bottom */}
        <polygon 
          points={hexPoints.join(' ')}
          fill="rgba(0,0,0,0.5)"
          transform="scale(0.9)"
        />
        {/* Socket edge highlights */}
        <polygon 
          points={hexPoints.join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={size * 0.02}
          strokeLinejoin="round"
          transform="translate(-0.1,-0.1)"
        />
      </g>
      
      {/* Tooling marks (subtle circular patterns) */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.85} 
        fill="none"
        stroke="rgba(0,0,0,0.05)"
        strokeWidth={size * 0.01}
      />
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.75} 
        fill="none"
        stroke="rgba(0,0,0,0.03)"
        strokeWidth={size * 0.01}
      />
      
      {/* Primary specular highlight */}
      <ellipse 
        cx={-size * 0.25} 
        cy={-size * 0.25} 
        rx={size * 0.35} 
        ry={size * 0.3}
        fill={`url(#${screwId}-highlight)`}
        opacity="0.7"
        transform="rotate(-45)"
      />
      
      {/* Secondary rim highlight */}
      <path
        d={`M ${-size * 0.7} ${-size * 0.5} A ${size} ${size} 0 0 1 ${size * 0.5} ${-size * 0.7}`}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth={size * 0.03}
        opacity="0.6"
      />
    </g>
  );
};

export const CornerScrews: React.FC<CornerScrewsProps> = ({
  containerWidth,
  containerHeight,
  screwSize = 3,
  metalType = 'steel',
  interactive = true,
  offset = 12
}) => {
  // Account for screw radius to prevent cutoff
  const adjustedOffset = offset + screwSize;
  
  const corners = [
    { x: adjustedOffset, y: adjustedOffset }, // Top-left
    { x: containerWidth - adjustedOffset, y: adjustedOffset }, // Top-right
    { x: adjustedOffset, y: containerHeight - adjustedOffset }, // Bottom-left
    { x: containerWidth - adjustedOffset, y: containerHeight - adjustedOffset }, // Bottom-right
  ];

  return (
    <svg 
      className="corner-screws-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: containerWidth,
        height: containerHeight,
        pointerEvents: interactive ? 'auto' : 'none',
        zIndex: 10,
        overflow: 'visible' // Ensure screws are not clipped
      }}
    >
      {corners.map((corner, index) => (
        <CartierScrew
          key={index}
          size={screwSize}
          position={corner}
          metalType={metalType}
          interactive={interactive}
          className={`corner-screw corner-${index}`}
        />
      ))}
    </svg>
  );
};

// CSS styles for the screws
export const cartierScrewStyles = `
  .cartier-screw.interactive {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    transform-origin: center;
    will-change: transform, filter;
  }

  .cartier-screw.interactive:hover {
    transform: rotate(30deg) scale(1.15);
    filter: brightness(1.2) contrast(1.1) drop-shadow(0 1px 3px rgba(0,0,0,0.4));
  }
  
  /* Add subtle glint animation on hover */
  .cartier-screw.interactive:hover ellipse {
    animation: glint 0.8s ease-in-out;
  }
  
  @keyframes glint {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; transform: translate(-1px, -1px); }
  }

  .corner-screws-overlay {
    border-radius: inherit;
  }

  /* Staggered animation for corner screws */
  .corner-screw.corner-0 { animation-delay: 0s; }
  .corner-screw.corner-1 { animation-delay: 0.1s; }
  .corner-screw.corner-2 { animation-delay: 0.2s; }
  .corner-screw.corner-3 { animation-delay: 0.3s; }

  @keyframes screwIn {
    from {
      transform: rotate(-180deg) scale(0);
      opacity: 0;
    }
    to {
      transform: rotate(0deg) scale(1);
      opacity: 1;
    }
  }

  .cartier-screw {
    animation: screwIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Subtle pulsing effect for active state */
  @keyframes screwPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  .cartier-screw.active {
    animation: screwPulse 2s ease-in-out infinite;
  }

  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    .cartier-screw.interactive,
    .cartier-screw {
      animation: none !important;
      transition: none !important;
    }
    
    .cartier-screw.interactive:hover {
      transform: none !important;
    }
  }
`;