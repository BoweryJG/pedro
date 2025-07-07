import React from 'react';

interface LuxuryIconProps {
  size?: number;
  className?: string;
}

// Exact luxury gold gradient from the image
const LUXURY_GRADIENT = {
  primary: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 25%, #FFA500 50%, #FF8C00 75%, #CD853F 100%)',
  highlight: 'linear-gradient(135deg, #FFFACD 0%, #F5DEB3 50%, #DEB887 100%)',
  shadow: 'rgba(139, 69, 19, 0.3)'
};

// TMJ/Dental Chair Icon (top-left from image)
export const TMJChairIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const id = `tmj-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="75%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>
        <linearGradient id={`${id}-highlight`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFACD" />
          <stop offset="50%" stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>
      </defs>
      
      {/* Chair base */}
      <rect x="20" y="75" width="60" height="15" rx="7" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Chair seat */}
      <rect x="25" y="50" width="50" height="25" rx="5" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Chair back */}
      <rect x="30" y="20" width="40" height="35" rx="5" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Headrest */}
      <ellipse cx="50" cy="15" rx="15" ry="8" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Armrest */}
      <rect x="15" y="45" width="8" height="20" rx="4" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      <rect x="77" y="45" width="8" height="20" rx="4" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Support column */}
      <rect x="45" y="75" width="10" height="10" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Highlights */}
      <ellipse cx="45" cy="35" rx="8" ry="6" fill={`url(#${id}-highlight)`} opacity="0.6"/>
      <rect x="28" y="22" width="15" height="8" rx="2" fill={`url(#${id}-highlight)`} opacity="0.4"/>
    </svg>
  );
};

// Female Profile Icon (top-center from image)
export const FemaleProfileIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const id = `profile-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="75%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>
      </defs>
      
      {/* Hair/Head outline */}
      <path d="M30 15 Q20 10 25 25 Q25 45 30 60 Q35 75 45 75 Q55 75 60 60 Q65 45 65 25 Q70 10 60 15 Q50 5 40 5 Q35 5 30 15 Z" 
            fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Face profile */}
      <path d="M40 20 Q35 25 35 35 Q35 45 40 55 Q45 65 50 65 Q55 60 58 50 Q60 40 58 30 Q55 20 50 20 Q45 18 40 20 Z" 
            fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Eye */}
      <circle cx="42" cy="35" r="2" fill="#8B4513"/>
      
      {/* Nose */}
      <path d="M45 38 L47 42 L45 42 Z" fill="#8B4513"/>
      
      {/* Lips */}
      <path d="M44 48 Q47 50 47 48" fill="#B8860B" stroke="#8B4513" strokeWidth="0.5"/>
      
      {/* Hair details */}
      <path d="M30 15 Q25 20 30 25 Q40 20 50 25 Q60 20 65 25 Q70 15 60 15" 
            fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="0.5"/>
    </svg>
  );
};

// Tooth Icon (middle-right from image)
export const ToothIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const id = `tooth-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="75%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>
        <linearGradient id={`${id}-highlight`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFACD" />
          <stop offset="50%" stopColor="#F5DEB3" />
          <stop offset="100%" stopColor="#DEB887" />
        </linearGradient>
      </defs>
      
      {/* Main tooth body */}
      <path d="M35 20 Q30 15 35 10 Q40 5 45 10 Q50 5 55 10 Q60 15 55 20 L55 50 Q55 65 50 70 Q45 75 40 70 Q35 65 35 50 Z" 
            fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1.5"/>
      
      {/* Tooth crown detail */}
      <path d="M37 15 Q42 12 45 15 Q48 12 53 15 Q53 25 45 30 Q37 25 37 15" 
            fill={`url(#${id}-highlight)`} opacity="0.7"/>
      
      {/* Root lines */}
      <line x1="40" y1="60" x2="40" y2="70" stroke="#8B4513" strokeWidth="1"/>
      <line x1="45" y1="60" x2="45" y2="70" stroke="#8B4513" strokeWidth="1"/>
      <line x1="50" y1="60" x2="50" y2="70" stroke="#8B4513" strokeWidth="1"/>
      
      {/* Shine highlight */}
      <ellipse cx="42" cy="25" rx="3" ry="8" fill="#FFFACD" opacity="0.8"/>
    </svg>
  );
};

// Treatment Bottle Icon (middle-left from image)
export const TreatmentBottleIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const id = `bottle-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="75%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>
      </defs>
      
      {/* Bottle body */}
      <rect x="35" y="30" width="30" height="50" rx="5" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Bottle neck */}
      <rect x="42" y="20" width="16" height="15" rx="2" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Cap */}
      <rect x="40" y="15" width="20" height="8" rx="4" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Dropper/applicator */}
      <line x1="50" y1="15" x2="50" y2="10" stroke={`url(#${id}-gold)`} strokeWidth="3" strokeLinecap="round"/>
      <circle cx="50" cy="8" r="2" fill={`url(#${id}-gold)`}/>
      
      {/* Drop */}
      <path d="M70 40 Q75 45 70 50 Q65 45 70 40" fill="#4169E1" opacity="0.8"/>
      
      {/* Sparkle */}
      <g fill="#FFFACD">
        <polygon points="25,25 27,30 32,30 28,33 30,38 25,35 20,38 22,33 18,30 23,30"/>
        <circle cx="75" cy="60" r="2"/>
        <circle cx="80" cy="70" r="1"/>
      </g>
      
      {/* Label area */}
      <rect x="38" y="40" width="24" height="20" rx="2" fill="rgba(255,255,255,0.3)" stroke="#8B4513" strokeWidth="0.5"/>
    </svg>
  );
};

// Hand with Treatment Icon (bottom-right from image)
export const HandTreatmentIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const id = `hand-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id={`${id}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="25%" stopColor="#FFD700" />
          <stop offset="50%" stopColor="#FFA500" />
          <stop offset="75%" stopColor="#FF8C00" />
          <stop offset="100%" stopColor="#CD853F" />
        </linearGradient>
      </defs>
      
      {/* Palm */}
      <ellipse cx="50" cy="60" rx="20" ry="15" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Fingers */}
      <ellipse cx="35" cy="40" rx="4" ry="12" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      <ellipse cx="45" cy="35" rx="4" ry="15" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      <ellipse cx="55" cy="35" rx="4" ry="15" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      <ellipse cx="65" cy="40" rx="4" ry="12" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Thumb */}
      <ellipse cx="30" cy="55" rx="6" ry="10" fill={`url(#${id}-gold)`} stroke="#8B4513" strokeWidth="1"/>
      
      {/* Treatment/cream blob */}
      <ellipse cx="50" cy="55" rx="8" ry="5" fill="#E6E6FA" opacity="0.9"/>
      <ellipse cx="48" cy="53" rx="3" ry="2" fill="#FFFACD"/>
      
      {/* Sparkles around treatment */}
      <g fill="#FFFACD">
        <circle cx="40" cy="50" r="1"/>
        <circle cx="60" cy="52" r="1"/>
        <circle cx="55" cy="45" r="0.5"/>
        <polygon points="35,45 36,47 38,47 37,48 37.5,50 35,49 32.5,50 33,48 32,47 34,47"/>
      </g>
    </svg>
  );
};

export const exactLuxuryIcons = {
  tmj: TMJChairIcon,
  implants: ToothIcon,
  robotic: TreatmentBottleIcon,
  medspa: FemaleProfileIcon,
  aboutface: HandTreatmentIcon,
};

export type ExactIconType = keyof typeof exactLuxuryIcons;