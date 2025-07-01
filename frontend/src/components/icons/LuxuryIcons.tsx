import React from 'react';
import { SvgIcon } from '@mui/material';
import type { SvgIconProps } from '@mui/material/SvgIcon';

// Premium Medical Cross for Dr. Pedro Logo
export const LuxuryMedicalIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="medicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <filter id="medicalGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Outer shield shape */}
    <path
      d="M24 2C24 2 8 8 8 24C8 40 24 46 24 46C24 46 40 40 40 24C40 8 24 2 24 2Z"
      fill="url(#medicalGradient)"
      opacity="0.1"
    />
    {/* Premium medical cross with rounded corners */}
    <g filter="url(#medicalGlow)">
      <path
        d="M28 16H32C33.1 16 34 16.9 34 18V22H38C39.1 22 40 22.9 40 24C40 25.1 39.1 26 38 26H34V30C34 31.1 33.1 32 32 32H28C26.9 32 26 31.1 26 30V26H22V30C22 31.1 21.1 32 20 32H16C14.9 32 14 31.1 14 30V26H10C8.9 26 8 25.1 8 24C8 22.9 8.9 22 10 22H14V18C14 16.9 14.9 16 16 16H20C21.1 16 22 16.9 22 18V22H26V18C26 16.9 26.9 16 28 16Z"
        fill="url(#medicalGradient)"
      />
      {/* Center gem */}
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="24" cy="24" r="2" fill="url(#medicalGradient)" />
    </g>
    {/* Decorative corner elements */}
    <circle cx="12" cy="12" r="1.5" fill="url(#medicalGradient)" opacity="0.6" />
    <circle cx="36" cy="12" r="1.5" fill="url(#medicalGradient)" opacity="0.6" />
    <circle cx="12" cy="36" r="1.5" fill="url(#medicalGradient)" opacity="0.6" />
    <circle cx="36" cy="36" r="1.5" fill="url(#medicalGradient)" opacity="0.6" />
  </SvgIcon>
);

// Luxury Diamond Icon for Hero - Represents premium quality and brilliance
export const LuxurySparkleIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <linearGradient id="diamondShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Diamond shape */}
    <g>
      {/* Bottom facets */}
      <path d="M24 40 L8 20 L16 20 Z" fill="url(#diamondGradient)" opacity="0.7" />
      <path d="M24 40 L16 20 L24 20 Z" fill="url(#diamondGradient)" opacity="0.8" />
      <path d="M24 40 L24 20 L32 20 Z" fill="url(#diamondGradient)" opacity="0.9" />
      <path d="M24 40 L32 20 L40 20 Z" fill="url(#diamondGradient)" opacity="0.7" />
      
      {/* Top facets */}
      <path d="M8 20 L12 8 L20 8 L16 20 Z" fill="url(#diamondGradient)" />
      <path d="M16 20 L20 8 L28 8 L24 20 Z" fill="url(#diamondGradient)" opacity="0.95" />
      <path d="M24 20 L28 8 L36 8 L32 20 Z" fill="url(#diamondGradient)" />
      <path d="M32 20 L36 8 L40 20 Z" fill="url(#diamondGradient)" opacity="0.85" />
      
      {/* Top crown */}
      <path d="M12 8 L20 8 L24 4 Z" fill="url(#diamondShine)" />
      <path d="M20 8 L28 8 L24 4 Z" fill="url(#diamondShine)" opacity="0.9" />
      <path d="M28 8 L36 8 L24 4 Z" fill="url(#diamondShine)" />
      
      {/* Sparkle effect */}
      <circle cx="24" cy="16" r="2" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
    </g>
  </SvgIcon>
);

// Luxury Target Icon for "I Know What I Need" - Represents precision and clarity
export const LuxuryNavigationIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="targetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
      <filter id="targetGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Luxury target rings */}
    <g filter="url(#targetGlow)">
      {/* Outer ring */}
      <circle cx="24" cy="24" r="20" fill="none" stroke="url(#targetGradient)" strokeWidth="2" opacity="0.3" />
      
      {/* Middle ring */}
      <circle cx="24" cy="24" r="14" fill="none" stroke="url(#targetGradient)" strokeWidth="2.5" opacity="0.5" />
      
      {/* Inner ring */}
      <circle cx="24" cy="24" r="8" fill="none" stroke="url(#targetGradient)" strokeWidth="3" opacity="0.7" />
      
      {/* Center bullseye */}
      <circle cx="24" cy="24" r="4" fill="url(#targetGradient)" />
      <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.9" />
      
      {/* Precision crosshairs */}
      <path d="M24 4 L24 12 M24 36 L24 44 M4 24 L12 24 M36 24 L44 24" 
            stroke="url(#targetGradient)" 
            strokeWidth="1.5" 
            opacity="0.4" />
      
      {/* Corner guides */}
      <path d="M12 12 L16 12 L12 16 M36 12 L32 12 L36 16 M12 36 L16 36 L12 32 M36 36 L32 36 L36 32" 
            fill="url(#targetGradient)" 
            opacity="0.6" />
    </g>
    
    {/* Animated pulse */}
    <circle cx="24" cy="24" r="4" fill="none" stroke="url(#targetGradient)" strokeWidth="1" opacity="0.6">
      <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
    </circle>
  </SvgIcon>
);

// Luxury Exploration Icon for "Help Me Explore"
export const LuxuryExploreIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="exploreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00d2ff" />
        <stop offset="100%" stopColor="#3a7bd5" />
      </linearGradient>
      <filter id="exploreGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Orbital paths */}
    <g opacity="0.3">
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="url(#exploreGradient)" strokeWidth="1" transform="rotate(45 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="url(#exploreGradient)" strokeWidth="1" transform="rotate(-45 24 24)" />
      <ellipse cx="24" cy="24" rx="18" ry="8" fill="none" stroke="url(#exploreGradient)" strokeWidth="1" transform="rotate(90 24 24)" />
    </g>
    {/* Luxury compass with pathways */}
    <g filter="url(#exploreGlow)">
      {/* Compass base */}
      <circle cx="24" cy="24" r="18" fill="none" stroke="url(#exploreGradient)" strokeWidth="2" />
      
      {/* Cardinal directions */}
      <path d="M24 6 L28 14 L24 18 L20 14 Z" fill="url(#exploreGradient)" />
      <path d="M42 24 L34 28 L30 24 L34 20 Z" fill="url(#exploreGradient)" opacity="0.7" />
      <path d="M24 42 L20 34 L24 30 L28 34 Z" fill="url(#exploreGradient)" opacity="0.7" />
      <path d="M6 24 L14 20 L18 24 L14 28 Z" fill="url(#exploreGradient)" opacity="0.7" />
      
      {/* Center pivot */}
      <circle cx="24" cy="24" r="4" fill="url(#exploreGradient)" />
      <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.9" />
      
      {/* Connecting pathways */}
      <path d="M24 18 L24 30 M18 24 L30 24" stroke="#ffffff" strokeWidth="1" opacity="0.5" />
      
      {/* Discovery markers */}
      <circle cx="24" cy="10" r="1.5" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="38" cy="24" r="1.5" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="24" cy="38" r="1.5" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="10" cy="24" r="1.5" fill="#ffffff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" begin="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  </SvgIcon>
);

// Luxury Emergency Icon
export const LuxuryEmergencyIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="emergencyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f857a6" />
        <stop offset="100%" stopColor="#ff5858" />
      </linearGradient>
      <filter id="emergencyPulse">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Pulsing background */}
    <circle cx="24" cy="24" r="20" fill="url(#emergencyGradient)" opacity="0.2">
      <animate attributeName="r" values="20;22;20" dur="1s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1s" repeatCount="indefinite" />
    </circle>
    {/* Shield with cross */}
    <g filter="url(#emergencyPulse)">
      {/* Premium shield shape */}
      <path
        d="M24,6 L36,12 C38,13 38,15 38,18 C38,30 30,40 24,42 C18,40 10,30 10,18 C10,15 10,13 12,12 L24,6Z"
        fill="url(#emergencyGradient)"
      />
      {/* Medical cross with rounded corners */}
      <path
        d="M27,18 L27,15 C27,14 26,13 25,13 L23,13 C22,13 21,14 21,15 L21,18 L18,18 C17,18 16,19 16,20 L16,22 C16,23 17,24 18,24 L21,24 L21,27 C21,28 22,29 23,29 L25,29 C26,29 27,28 27,27 L27,24 L30,24 C31,24 32,23 32,22 L32,20 C32,19 31,18 30,18 L27,18Z"
        fill="#ffffff"
        opacity="0.95"
      />
    </g>
    {/* Alert indicators */}
    <g opacity="0.8">
      <circle cx="10" cy="10" r="2" fill="url(#emergencyGradient)">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="38" cy="10" r="2" fill="url(#emergencyGradient)">
        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.5s" begin="0.25s" repeatCount="indefinite" />
      </circle>
    </g>
  </SvgIcon>
);

// Luxury Chat Icon
export const LuxuryChatIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Premium chat bubble */}
    <path
      d="M8,8 L32,8 C36,8 40,12 40,16 L40,28 C40,32 36,36 32,36 L16,36 L8,42 L8,36 C4,36 4,32 4,28 L4,16 C4,12 4,8 8,8Z"
      fill="url(#chatGradient)"
      opacity="0.1"
    />
    <path
      d="M10,10 L30,10 C34,10 36,12 36,16 L36,26 C36,30 34,32 30,32 L18,32 L10,38 L10,32 C6,32 6,30 6,26 L6,16 C6,12 6,10 10,10Z"
      fill="url(#chatGradient)"
    />
    {/* Animated dots */}
    <g fill="#ffffff">
      <circle cx="14" cy="21" r="2">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="21" cy="21" r="2">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="28" cy="21" r="2">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" begin="1s" repeatCount="indefinite" />
      </circle>
    </g>
  </SvgIcon>
);

// Luxury Contact Icon
export const LuxuryContactIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="contactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
      <filter id="contactGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    {/* Luxury envelope */}
    <g filter="url(#contactGlow)">
      {/* Envelope back */}
      <path
        d="M6,16 L6,36 C6,38 8,40 10,40 L38,40 C40,40 42,38 42,36 L42,16 L24,28 L6,16Z"
        fill="url(#contactGradient)"
        opacity="0.9"
      />
      {/* Envelope flap */}
      <path
        d="M6,12 C6,10 8,8 10,8 L38,8 C40,8 42,10 42,12 L42,16 L24,28 L6,16 L6,12Z"
        fill="url(#contactGradient)"
      />
      {/* Letter inside */}
      <rect x="12" y="18" width="24" height="16" fill="#ffffff" opacity="0.3" rx="2" />
      {/* Wax seal */}
      <circle cx="24" cy="24" r="6" fill="#ffffff" opacity="0.9" />
      <circle cx="24" cy="24" r="5" fill="url(#contactGradient)" />
      <text x="24" y="28" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">P</text>
    </g>
  </SvgIcon>
);