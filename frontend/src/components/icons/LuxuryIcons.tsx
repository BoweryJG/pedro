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

// Luxury Smile Icon for Hero - Perfect smile representation
export const LuxurySparkleIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="smileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#764ba2" />
        <stop offset="100%" stopColor="#f093fb" />
      </linearGradient>
    </defs>
    {/* Perfect smile curve */}
    <path 
      d="M8 20 Q24 36 40 20" 
      fill="none" 
      stroke="url(#smileGradient)" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    {/* Teeth highlights */}
    <rect x="14" y="20" width="4" height="8" fill="url(#smileGradient)" opacity="0.3" rx="2" />
    <rect x="20" y="20" width="4" height="10" fill="url(#smileGradient)" opacity="0.4" rx="2" />
    <rect x="26" y="20" width="4" height="10" fill="url(#smileGradient)" opacity="0.4" rx="2" />
    <rect x="32" y="20" width="4" height="8" fill="url(#smileGradient)" opacity="0.3" rx="2" />
    {/* Sparkle points - static, no animation */}
    <circle cx="12" cy="16" r="2" fill="url(#smileGradient)" opacity="0.6" />
    <circle cx="36" cy="16" r="2" fill="url(#smileGradient)" opacity="0.6" />
  </SvgIcon>
);

// Luxury Tooth Icon for "I Know What I Need" - Direct dental care
export const LuxuryNavigationIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 48 48">
    <defs>
      <linearGradient id="toothGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Premium tooth shape */}
    <path
      d="M24 6 C20 6 16 8 14 12 C12 16 12 20 13 24 C14 28 15 32 16 36 C17 40 18 42 20 42 C22 42 23 40 24 36 C25 40 26 42 28 42 C30 42 31 40 32 36 C33 32 34 28 35 24 C36 20 36 16 34 12 C32 8 28 6 24 6 Z"
      fill="url(#toothGradient)"
    />
    {/* Crown highlight */}
    <ellipse cx="24" cy="14" rx="8" ry="6" fill="#ffffff" opacity="0.3" />
    {/* Root separation */}
    <path d="M24 24 L24 38" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
    {/* Shine effect */}
    <circle cx="20" cy="12" r="2" fill="#ffffff" opacity="0.5" />
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
    {/* Dental mirror with examination light */}
    <g>
      {/* Mirror head */}
      <circle cx="16" cy="16" r="12" fill="none" stroke="url(#exploreGradient)" strokeWidth="3" />
      <circle cx="16" cy="16" r="10" fill="url(#exploreGradient)" opacity="0.2" />
      
      {/* Mirror reflection */}
      <ellipse cx="16" cy="16" rx="8" ry="6" fill="#ffffff" opacity="0.3" />
      
      {/* Handle */}
      <path d="M24 24 L36 36" stroke="url(#exploreGradient)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Examination light rays - static */}
      <path d="M26 16 L32 16 M24 20 L30 22 M24 12 L30 10" 
            stroke="url(#exploreGradient)" 
            strokeWidth="1.5" 
            opacity="0.5" 
            strokeLinecap="round" />
      
      {/* Tooth being examined */}
      <path d="M12 14 C12 12 13 11 14 11 C15 11 16 12 16 14 L16 18 C16 19 15.5 20 15 20 C14.5 20 14 19 14 18 L14 14"
            fill="#ffffff" 
            opacity="0.6" />
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
    {/* Static emergency background */}
    <circle cx="24" cy="24" r="20" fill="url(#emergencyGradient)" opacity="0.15" />
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
    {/* Static alert indicators */}
    <g opacity="0.8">
      <circle cx="10" cy="10" r="2" fill="url(#emergencyGradient)" />
      <circle cx="38" cy="10" r="2" fill="url(#emergencyGradient)" />
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
    {/* Static dots */}
    <g fill="#ffffff">
      <circle cx="14" cy="21" r="2" />
      <circle cx="21" cy="21" r="2" />
      <circle cx="28" cy="21" r="2" />
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