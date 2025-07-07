import React from 'react';

interface LuxuryIconProps {
  size?: number;
  className?: string;
}

// Luxury gold gradient definition
const luxuryGoldGradient = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#F4E4BC" />
      <stop offset="30%" stopColor="#D4AF37" />
      <stop offset="70%" stopColor="#B8860B" />
      <stop offset="100%" stopColor="#8B6914" />
    </linearGradient>
    <linearGradient id={`${id}-highlight`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FFFACD" opacity="0.8" />
      <stop offset="100%" stopColor="#F4E4BC" opacity="0.3" />
    </linearGradient>
  </defs>
);

export const TMJIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'tmj-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Dental Chair */}
      <g transform="translate(10, 10)">
        {/* Chair base */}
        <path
          d="M20 70 L60 70 Q65 70 65 75 L65 80 Q65 85 60 85 L20 85 Q15 85 15 80 L15 75 Q15 70 20 70 Z"
          fill={`url(#${gradientId})`}
          stroke="#8B6914"
          strokeWidth="1"
        />
        {/* Chair back */}
        <path
          d="M25 25 L55 25 Q60 25 60 30 L60 70 L25 70 L25 30 Q25 25 25 25 Z"
          fill={`url(#${gradientId})`}
          stroke="#8B6914"
          strokeWidth="1"
        />
        {/* Headrest */}
        <ellipse cx="40" cy="20" rx="12" ry="8" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Arm rest */}
        <rect x="10" y="40" width="15" height="25" rx="3" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Support column */}
        <rect x="35" y="70" width="10" height="15" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Highlight */}
        <path
          d="M30 30 L50 30 Q52 30 52 32 L52 45 L30 45 Z"
          fill={`url(#${gradientId}-highlight)`}
        />
      </g>
    </svg>
  );
};

export const AestheticsIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'aesthetics-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Female Profile */}
      <g transform="translate(15, 10)">
        {/* Face outline */}
        <path
          d="M35 15 Q50 10 50 25 L50 45 Q50 60 45 65 Q40 70 35 70 Q25 70 20 65 Q15 60 15 45 L15 25 Q15 10 35 15 Z"
          fill={`url(#${gradientId})`}
          stroke="#8B6914"
          strokeWidth="1"
        />
        {/* Hair */}
        <path
          d="M20 20 Q15 15 25 10 Q40 5 55 15 Q60 20 55 25 L50 25 Q50 15 35 15 Q25 15 20 20 Z"
          fill={`url(#${gradientId})`}
          stroke="#8B6914"
          strokeWidth="1"
        />
        {/* Eye */}
        <ellipse cx="28" cy="35" rx="3" ry="2" fill="#8B6914" />
        {/* Nose */}
        <path d="M32 40 L34 45 L32 45 Z" fill="#8B6914" />
        {/* Lips */}
        <path d="M30 50 Q35 52 35 50 Q35 52 30 50" fill="#B8860B" stroke="#8B6914" strokeWidth="0.5" />
        {/* Highlight */}
        <ellipse cx="30" cy="25" rx="8" ry="12" fill={`url(#${gradientId}-highlight)`} opacity="0.6" />
      </g>
    </svg>
  );
};

export const ImplantIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'implant-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Tooth with Implant */}
      <g transform="translate(20, 15)">
        {/* Tooth crown */}
        <path
          d="M20 20 Q15 15 20 10 Q25 5 30 10 Q35 5 40 10 Q45 15 40 20 L40 45 Q40 55 35 60 Q30 65 25 60 Q20 55 20 45 Z"
          fill={`url(#${gradientId})`}
          stroke="#8B6914"
          strokeWidth="1.5"
        />
        {/* Implant screw */}
        <rect x="27" y="50" width="6" height="20" rx="1" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Screw threads */}
        <line x1="25" y1="55" x2="35" y2="55" stroke="#8B6914" strokeWidth="0.5" />
        <line x1="25" y1="60" x2="35" y2="60" stroke="#8B6914" strokeWidth="0.5" />
        <line x1="25" y1="65" x2="35" y2="65" stroke="#8B6914" strokeWidth="0.5" />
        {/* Highlight */}
        <ellipse cx="25" cy="25" rx="4" ry="8" fill={`url(#${gradientId}-highlight)`} opacity="0.8" />
      </g>
    </svg>
  );
};

export const RoboticIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'robotic-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Robotic Precision Tool */}
      <g transform="translate(15, 10)">
        {/* Main body */}
        <rect x="25" y="20" width="20" height="40" rx="3" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1.5" />
        {/* Robotic arm */}
        <rect x="20" y="15" width="30" height="8" rx="4" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Precision tip */}
        <polygon points="30,60 35,70 30,70 25,70 30,60" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Control panel */}
        <rect x="28" y="25" width="14" height="10" rx="1" fill="#8B6914" />
        <circle cx="32" cy="30" r="1.5" fill={`url(#${gradientId})`} />
        <circle cx="38" cy="30" r="1.5" fill={`url(#${gradientId})`} />
        {/* Connecting cables */}
        <path d="M15 19 Q10 15 5 20 Q10 25 15 19" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
        <path d="M50 19 Q55 15 60 20 Q55 25 50 19" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
        {/* Highlight */}
        <rect x="28" y="22" width="8" height="15" fill={`url(#${gradientId}-highlight)`} opacity="0.6" />
      </g>
    </svg>
  );
};

export const MedSpaIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'medspa-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Aesthetic Treatment */}
      <g transform="translate(10, 10)">
        {/* Face outline */}
        <circle cx="40" cy="35" r="20" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1.5" />
        {/* Sparkles */}
        <g fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.5">
          <polygon points="25,20 27,25 32,25 28,28 30,33 25,30 20,33 22,28 18,25 23,25" />
          <polygon points="60,25 61,28 64,28 62,30 63,33 60,31 57,33 58,30 56,28 59,28" />
          <polygon points="55,45 56,47 58,47 57,48 57.5,50 55,49 52.5,50 53,48 52,47 54,47" />
        </g>
        {/* Treatment device */}
        <rect x="35" y="60" width="10" height="15" rx="2" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        <circle cx="40" cy="55" r="3" fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="1" />
        {/* Light beam */}
        <path d="M40 55 L40 45 M38 50 L42 50" stroke="#F4E4BC" strokeWidth="2" opacity="0.8" />
        {/* Highlight */}
        <ellipse cx="35" cy="30" rx="6" ry="10" fill={`url(#${gradientId}-highlight)`} opacity="0.6" />
      </g>
    </svg>
  );
};

export const AboutFaceIcon: React.FC<LuxuryIconProps> = ({ size = 80, className = '' }) => {
  const gradientId = 'aboutface-gradient';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      {luxuryGoldGradient(gradientId)}
      {/* Smile/Teeth */}
      <g transform="translate(10, 25)">
        {/* Smile arc */}
        <path
          d="M10 30 Q40 10 70 30"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Individual teeth */}
        <g fill={`url(#${gradientId})`} stroke="#8B6914" strokeWidth="0.5">
          <rect x="18" y="25" width="4" height="8" rx="2" />
          <rect x="24" y="22" width="4" height="11" rx="2" />
          <rect x="30" y="20" width="4" height="13" rx="2" />
          <rect x="36" y="19" width="4" height="14" rx="2" />
          <rect x="42" y="19" width="4" height="14" rx="2" />
          <rect x="48" y="20" width="4" height="13" rx="2" />
          <rect x="54" y="22" width="4" height="11" rx="2" />
          <rect x="60" y="25" width="4" height="8" rx="2" />
        </g>
        {/* Highlight on front teeth */}
        <rect x="32" y="21" width="2" height="10" fill={`url(#${gradientId}-highlight)`} opacity="0.8" />
        <rect x="44" y="21" width="2" height="10" fill={`url(#${gradientId}-highlight)`} opacity="0.8" />
        {/* Sparkle */}
        <polygon points="50,10 52,15 57,15 53,18 55,23 50,20 45,23 47,18 43,15 48,15" fill="#F4E4BC" />
      </g>
    </svg>
  );
};

// Icon mapping for easy use
export const luxuryMedicalIcons = {
  tmj: TMJIcon,
  implants: ImplantIcon,
  robotic: RoboticIcon,
  medspa: MedSpaIcon,
  aboutface: AboutFaceIcon,
  aesthetics: AestheticsIcon,
};

export type LuxuryIconType = keyof typeof luxuryMedicalIcons;