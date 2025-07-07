import React from 'react';

interface IconProps {
  className?: string;
  title?: string;
  size?: number;
}

const baseClass =
  'transition-transform ease-in-out duration-200 text-black hover:scale-105 active:scale-95';

export const TMJIcon = ({ className = '', title = 'TMJ Icon', size = 64 }: IconProps) => (
  <svg 
    viewBox="0 0 64 64" 
    width={size} 
    height={size} 
    className={`${baseClass} ${className}`} 
    aria-label={title} 
    role="img"
  >
    <title>{title}</title>
    <path d="M22 32c0-8 6-14 14-14s14 6 14 14-6 14-14 14" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="36" cy="32" r="3" fill="currentColor" />
  </svg>
);

export const ImplantIcon = ({ className = '', title = 'Implant Icon', size = 64 }: IconProps) => (
  <svg 
    viewBox="0 0 64 64" 
    width={size} 
    height={size} 
    className={`${baseClass} ${className}`} 
    aria-label={title} 
    role="img"
  >
    <title>{title}</title>
    <path d="M32 4v56m-8-8h16m-16-8h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="4" r="3" fill="currentColor" />
  </svg>
);

export const RobotSurgeryIcon = ({ className = '', title = 'Robotic Surgery Icon', size = 64 }: IconProps) => (
  <svg 
    viewBox="0 0 64 64" 
    width={size} 
    height={size} 
    className={`${baseClass} ${className}`} 
    aria-label={title} 
    role="img"
  >
    <title>{title}</title>
    <path d="M20 40L44 16m0 0v10m0-10h-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="44" cy="16" r="3" fill="currentColor" />
  </svg>
);

export const MedspaIcon = ({ className = '', title = 'Medspa Icon', size = 64 }: IconProps) => (
  <svg 
    viewBox="0 0 64 64" 
    width={size} 
    height={size} 
    className={`${baseClass} ${className}`} 
    aria-label={title} 
    role="img"
  >
    <title>{title}</title>
    <path d="M32 20c-8 0-14 6-14 14s6 14 14 14 14-6 14-14" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="32" cy="34" r="3" fill="currentColor" />
  </svg>
);

export const AboutFaceIcon = ({ className = '', title = 'About Face Icon', size = 64 }: IconProps) => (
  <svg 
    viewBox="0 0 64 64" 
    width={size} 
    height={size} 
    className={`${baseClass} ${className}`} 
    aria-label={title} 
    role="img"
  >
    <title>{title}</title>
    <path d="M20 24h24m-24 8h24m-24 8h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M32 20v24" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Export all icons as a collection
export const professionalIcons = {
  tmj: TMJIcon,
  implants: ImplantIcon,
  robotic: RobotSurgeryIcon,
  medspa: MedspaIcon,
  aboutface: AboutFaceIcon,
};

export type ProfessionalIconType = keyof typeof professionalIcons;