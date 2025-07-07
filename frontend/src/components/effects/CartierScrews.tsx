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
  size = 8, 
  position, 
  metalType = 'steel',
  interactive = true,
  className = ''
}) => {
  const screwId = `screw-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <g 
      className={`cartier-screw ${interactive ? 'interactive' : ''} ${className}`}
      transform={`translate(${position.x}, ${position.y})`}
    >
      {/* Gradient definitions */}
      <defs>
        <radialGradient id={`${screwId}-outer`} cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor={
            metalType === 'gold' ? '#f4e4bc' : 
            metalType === 'bronze' ? '#d4af37' : '#e8e8e8'
          } />
          <stop offset="50%" stopColor={
            metalType === 'gold' ? '#c9a961' : 
            metalType === 'bronze' ? '#8b6914' : '#b8b8b8'
          } />
          <stop offset="100%" stopColor={
            metalType === 'gold' ? '#b8860b' : 
            metalType === 'bronze' ? '#6b5b00' : '#9ca3af'
          } />
        </radialGradient>
        <radialGradient id={`${screwId}-inner`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </radialGradient>
      </defs>

      {/* Outer ring with beveled edge */}
      <circle 
        cx="0" 
        cy="0" 
        r={size} 
        fill={`url(#${screwId}-outer)`}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="0.5"
        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
      />
      
      {/* Inner depression */}
      <circle 
        cx="0" 
        cy="0" 
        r={size * 0.7} 
        fill={`url(#${screwId}-inner)`}
      />
      
      {/* Cross slot (Phillips head style) */}
      <g stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round">
        <line x1={-size * 0.5} y1="0" x2={size * 0.5} y2="0" />
        <line x1="0" y1={-size * 0.5} x2="0" y2={size * 0.5} />
      </g>
      
      {/* Highlight for 3D effect */}
      <circle 
        cx={-size * 0.2} 
        cy={-size * 0.2} 
        r={size * 0.3} 
        fill="rgba(255,255,255,0.4)"
        opacity="0.6"
      />
    </g>
  );
};

export const CornerScrews: React.FC<CornerScrewsProps> = ({
  containerWidth,
  containerHeight,
  screwSize = 6,
  metalType = 'steel',
  interactive = true,
  offset = 12
}) => {
  const corners = [
    { x: offset, y: offset }, // Top-left
    { x: containerWidth - offset, y: offset }, // Top-right
    { x: offset, y: containerHeight - offset }, // Bottom-left
    { x: containerWidth - offset, y: containerHeight - offset }, // Bottom-right
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
        zIndex: 10
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
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    transform-origin: center;
  }

  .cartier-screw.interactive:hover {
    transform: rotate(45deg) scale(1.1);
    filter: brightness(1.3) drop-shadow(0 2px 6px rgba(0,0,0,0.3));
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