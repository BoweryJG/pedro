import React from 'react';

interface IconProps {
  className?: string;
  title?: string;
  size?: number;
}

const baseClass =
  'transition-all ease-in-out duration-200 hover:scale-105 active:scale-95';

export const TMJIcon = ({ className = '', title = 'TMJ Icon', size = 64 }: IconProps) => (
  <div className={`${baseClass} ${className} inline-flex items-center justify-center`} style={{ width: size, height: size }}>
    <div className="w-full h-full bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full text-black"
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M24 32c0-7 6-12 12-12s12 5 12 12-6 12-12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="32" r="3" fill="currentColor" />
      </svg>
    </div>
  </div>
);

export const ImplantIcon = ({ className = '', title = 'Implant Icon', size = 64 }: IconProps) => (
  <div className={`${baseClass} ${className} inline-flex items-center justify-center`} style={{ width: size, height: size }}>
    <div className="w-full h-full bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full text-black"
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M32 4v56m-8-8h16m-16-8h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="4" r="3" fill="currentColor" />
      </svg>
    </div>
  </div>
);

export const RobotSurgeryIcon = ({ className = '', title = 'Robotic Surgery Icon', size = 64 }: IconProps) => (
  <div className={`${baseClass} ${className} inline-flex items-center justify-center`} style={{ width: size, height: size }}>
    <div className="w-full h-full bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full text-black"
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M20 40L44 16m0 0v10m0-10h-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="16" r="3" fill="currentColor" />
      </svg>
    </div>
  </div>
);

export const MedspaIcon = ({ className = '', title = 'Medspa Icon', size = 64 }: IconProps) => (
  <div className={`${baseClass} ${className} inline-flex items-center justify-center`} style={{ width: size, height: size }}>
    <div className="w-full h-full bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full text-black"
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M32 20c-8 0-14 6-14 14s6 14 14 14 14-6 14-14" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <circle cx="32" cy="34" r="3" fill="currentColor" />
      </svg>
    </div>
  </div>
);

export const AboutFaceIcon = ({ className = '', title = 'About Face Icon', size = 64 }: IconProps) => (
  <div className={`${baseClass} ${className} inline-flex items-center justify-center`} style={{ width: size, height: size }}>
    <div className="w-full h-full bg-white rounded-full shadow-lg p-3 flex items-center justify-center">
      <svg 
        viewBox="0 0 64 64" 
        className="w-full h-full text-black"
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M20 24h24m-24 8h24m-24 8h24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M32 20v24" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    </div>
  </div>
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