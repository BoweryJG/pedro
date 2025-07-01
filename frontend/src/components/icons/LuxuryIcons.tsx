import React from 'react';
import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';

// Premium Medical Cross for Dr. Pedro Logo - Refined geometric design
export const LuxuryMedicalIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
    </defs>
    {/* Abstract medical cross with golden ratio proportions */}
    <g>
      <path
        d="M24 12 L28 16 L28 20 L32 20 L36 24 L32 28 L28 28 L28 32 L24 36 L20 32 L20 28 L16 28 L12 24 L16 20 L20 20 L20 16 Z"
        fill="url(#medicalGradient)"
        opacity="0.9"
      />
      {/* Inner geometric accent */}
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.8" />
    </g>
  </SvgIcon>
);

// Luxury Lotus Icon for Hero - Abstract wellness and transformation
export const LuxurySparkleIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="lotusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <linearGradient id="lotusGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="50%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#667eea" />
      </linearGradient>
    </defs>
    {/* Abstract lotus petals using overlapping ellipses */}
    <g>
      {/* Center petal */}
      <ellipse cx="24" cy="16" rx="6" ry="12" fill="url(#lotusGradient)" opacity="0.7" />
      {/* Left petal */}
      <ellipse cx="24" cy="16" rx="6" ry="12" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(-30 24 24)" />
      {/* Right petal */}
      <ellipse cx="24" cy="16" rx="6" ry="12" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(30 24 24)" />
      {/* Far left petal */}
      <ellipse cx="24" cy="16" rx="5" ry="10" fill="url(#lotusGradient2)" opacity="0.5" transform="rotate(-60 24 24)" />
      {/* Far right petal */}
      <ellipse cx="24" cy="16" rx="5" ry="10" fill="url(#lotusGradient2)" opacity="0.5" transform="rotate(60 24 24)" />
      {/* Center circle */}
      <circle cx="24" cy="24" r="4" fill="url(#lotusGradient)" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.8" />
    </g>
  </SvgIcon>
);

// Luxury Precision Icon for "I Know What I Need" - Geometric clarity
export const LuxuryNavigationIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="precisionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Overlapping circles forming a mandala-like pattern */}
    <g>
      {/* Central hexagon formed by circles */}
      <circle cx="24" cy="14" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="32" cy="20" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="32" cy="28" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="24" cy="34" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="16" cy="28" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      <circle cx="16" cy="20" r="8" fill="none" stroke="url(#precisionGradient)" strokeWidth="1.5" opacity="0.8" />
      
      {/* Center focus point */}
      <circle cx="24" cy="24" r="3" fill="url(#precisionGradient)" />
      <circle cx="24" cy="24" r="1.5" fill="#ffffff" opacity="0.9" />
      
      {/* Connecting lines for structure */}
      <path d="M24 14 L32 20 L32 28 L24 34 L16 28 L16 20 Z" 
            fill="none" 
            stroke="url(#precisionGradient)" 
            strokeWidth="0.5" 
            opacity="0.3" />
    </g>
  </SvgIcon>
);

// Luxury Pathways Icon for "Help Me Explore" - Abstract guidance
export const LuxuryExploreIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d2ff" />
        <stop offset="100%" stopColor="#3a7bd5" />
      </linearGradient>
      <linearGradient id="pathwayGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Abstract constellation/pathway design */}
    <g>
      {/* Main pathway curves */}
      <path d="M12 36 Q24 24 36 12" fill="none" stroke="url(#pathwayGradient)" strokeWidth="2" opacity="0.6" />
      <path d="M12 12 Q24 24 36 36" fill="none" stroke="url(#pathwayGradient2)" strokeWidth="2" opacity="0.6" />
      
      {/* Connection nodes */}
      <circle cx="12" cy="12" r="3" fill="url(#pathwayGradient2)" opacity="0.8" />
      <circle cx="36" cy="12" r="3" fill="url(#pathwayGradient)" opacity="0.8" />
      <circle cx="12" cy="36" r="3" fill="url(#pathwayGradient)" opacity="0.8" />
      <circle cx="36" cy="36" r="3" fill="url(#pathwayGradient2)" opacity="0.8" />
      
      {/* Central convergence point */}
      <circle cx="24" cy="24" r="5" fill="none" stroke="url(#pathwayGradient)" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="2.5" fill="url(#pathwayGradient2)" />
      <circle cx="24" cy="24" r="1" fill="#ffffff" opacity="0.9" />
      
      {/* Subtle guide lines */}
      <line x1="12" y1="24" x2="36" y2="24" stroke="url(#pathwayGradient)" strokeWidth="0.5" opacity="0.3" />
      <line x1="24" y1="12" x2="24" y2="36" stroke="url(#pathwayGradient2)" strokeWidth="0.5" opacity="0.3" />
    </g>
  </SvgIcon>
);

// Luxury Emergency Icon - Refined geometric shield
export const LuxuryEmergencyIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="emergencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f857a6" />
        <stop offset="100%" stopColor="#ff5858" />
      </linearGradient>
    </defs>
    {/* Geometric shield design */}
    <g>
      {/* Modern shield shape using straight lines */}
      <path
        d="M24 6 L38 14 L38 26 L24 42 L10 26 L10 14 Z"
        fill="none"
        stroke="url(#emergencyGradient)"
        strokeWidth="2"
      />
      
      {/* Inner shield */}
      <path
        d="M24 10 L34 16 L34 24 L24 36 L14 24 L14 16 Z"
        fill="url(#emergencyGradient)"
        opacity="0.2"
      />
      
      {/* Elegant plus sign */}
      <path
        d="M24 18 L24 30 M18 24 L30 24"
        stroke="url(#emergencyGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Corner accents */}
      <circle cx="24" cy="6" r="1.5" fill="url(#emergencyGradient)" />
      <circle cx="38" cy="14" r="1.5" fill="url(#emergencyGradient)" opacity="0.7" />
      <circle cx="10" cy="14" r="1.5" fill="url(#emergencyGradient)" opacity="0.7" />
    </g>
  </SvgIcon>
);

// Luxury Chat Icon - Abstract communication bubbles
export const LuxuryChatIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Overlapping abstract speech bubbles */}
    <g>
      {/* Primary bubble */}
      <path
        d="M8 12 Q8 8 12 8 L28 8 Q32 8 32 12 L32 22 Q32 26 28 26 L20 26 L14 32 L14 26 L12 26 Q8 26 8 22 Z"
        fill="none"
        stroke="url(#chatGradient)"
        strokeWidth="2"
      />
      
      {/* Secondary overlapping bubble */}
      <path
        d="M18 18 Q18 16 20 16 L36 16 Q38 16 38 18 L38 28 Q38 30 36 30 L34 30 L34 34 L30 30 L20 30 Q18 30 18 28 Z"
        fill="url(#chatGradient)"
        opacity="0.3"
      />
      
      {/* Communication dots */}
      <circle cx="14" cy="17" r="1.5" fill="url(#chatGradient)" />
      <circle cx="20" cy="17" r="1.5" fill="url(#chatGradient)" />
      <circle cx="26" cy="17" r="1.5" fill="url(#chatGradient)" />
    </g>
  </SvgIcon>
);

// Luxury Contact Icon - Abstract envelope with geometric accents
export const LuxuryContactIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
    </defs>
    {/* Geometric envelope design */}
    <g>
      {/* Envelope body */}
      <rect x="8" y="14" width="32" height="22" rx="2" 
            fill="none" 
            stroke="url(#contactGradient)" 
            strokeWidth="2" />
      
      {/* Envelope flap as triangles */}
      <path d="M8 14 L24 26 L40 14" 
            fill="none" 
            stroke="url(#contactGradient)" 
            strokeWidth="2" />
      
      {/* Inner geometric pattern */}
      <path d="M8 36 L24 24 L40 36" 
            fill="none" 
            stroke="url(#contactGradient)" 
            strokeWidth="1" 
            opacity="0.5" />
      
      {/* Center seal */}
      <circle cx="24" cy="25" r="4" fill="url(#contactGradient)" opacity="0.3" />
      <circle cx="24" cy="25" r="2" fill="url(#contactGradient)" />
    </g>
  </SvgIcon>
);