import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// TMJ Icon - Interlocking wave patterns representing sound/vibration therapy
export const TMJIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`spectrum-icon ${className}`}
    style={{ transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Interlocking wave patterns */}
      <path d="M6 24c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" />
      <path d="M14 24c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" />
      <path d="M22 24c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" />
      <path d="M30 24c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" />
      <path d="M34 24c0-4 2-6 4-6s4 2 4 6-2 6-4 6-4-2-4-6z" />
      {/* Vibration lines */}
      <path d="M8 14c8-2 16-2 24 0" opacity="0.6" />
      <path d="M8 34c8 2 16 2 24 0" opacity="0.6" />
      {/* Central resonance point */}
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.3" />
    </g>
  </svg>
);

// Implants Icon - Crystalline faceted structures
export const ImplantsIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`spectrum-icon ${className}`}
    style={{ transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Main crystal structure */}
      <path d="M24 8L16 20L24 40L32 20Z" />
      {/* Facet lines */}
      <path d="M24 8L12 24L24 40" />
      <path d="M24 8L36 24L24 40" />
      {/* Inner facets */}
      <path d="M16 20L24 24L32 20" />
      <path d="M16 20L24 16L32 20" opacity="0.6" />
      {/* Side crystals */}
      <path d="M8 24L12 20L12 28Z" opacity="0.8" />
      <path d="M40 24L36 20L36 28Z" opacity="0.8" />
      {/* Light reflection points */}
      <circle cx="20" cy="18" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="18" r="1" fill="currentColor" opacity="0.5" />
    </g>
  </svg>
);

// Robotic Icon - Circuit-inspired mandala patterns
export const RoboticIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`spectrum-icon ${className}`}
    style={{ transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Central processor */}
      <rect x="20" y="20" width="8" height="8" />
      {/* Circuit paths - horizontal and vertical */}
      <path d="M10 24H20M28 24H38" />
      <path d="M24 10V20M24 28V38" />
      {/* Diagonal circuit paths */}
      <path d="M14 14L20 20M28 28L34 34" />
      <path d="M34 14L28 20M20 28L14 34" />
      {/* Node points */}
      <circle cx="10" cy="24" r="2" fill="currentColor" />
      <circle cx="38" cy="24" r="2" fill="currentColor" />
      <circle cx="24" cy="10" r="2" fill="currentColor" />
      <circle cx="24" cy="38" r="2" fill="currentColor" />
      {/* Corner nodes */}
      <circle cx="14" cy="14" r="2" fill="currentColor" />
      <circle cx="34" cy="14" r="2" fill="currentColor" />
      <circle cx="14" cy="34" r="2" fill="currentColor" />
      <circle cx="34" cy="34" r="2" fill="currentColor" />
      {/* Outer ring segments */}
      <path d="M8 20A16 16 0 0 1 20 8" opacity="0.6" />
      <path d="M28 8A16 16 0 0 1 40 20" opacity="0.6" />
      <path d="M40 28A16 16 0 0 1 28 40" opacity="0.6" />
      <path d="M20 40A16 16 0 0 1 8 28" opacity="0.6" />
    </g>
  </svg>
);

// MedSpa Icon - Flowing liquid infinity forms
export const MedSpaIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`spectrum-icon ${className}`}
    style={{ transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Main infinity flow */}
      <path d="M24 24C24 24 32 16 36 16C40 16 44 20 44 24C44 28 40 32 36 32C32 32 24 24 24 24C24 24 16 32 12 32C8 32 4 28 4 24C4 20 8 16 12 16C16 16 24 24 24 24Z" />
      {/* Secondary flow layers */}
      <path d="M24 24C24 24 30 20 32 20C34 20 36 22 36 24C36 26 34 28 32 28C30 28 24 24 24 24C24 24 18 28 16 28C14 28 12 26 12 24C12 22 14 20 16 20C18 20 24 24 24 24Z" opacity="0.6" />
      {/* Water droplets */}
      <path d="M24 12C24 12 21 8 21 6C21 4.5 22.5 3 24 3C25.5 3 27 4.5 27 6C27 8 24 12 24 12Z" opacity="0.8" />
      <path d="M36 36C36 36 34 34 34 33C34 32.2 34.7 31.5 35.5 31.5C36.3 31.5 37 32.2 37 33C37 34 36 36 36 36Z" opacity="0.6" />
      <path d="M12 36C12 36 10 34 10 33C10 32.2 10.7 31.5 11.5 31.5C12.3 31.5 13 32.2 13 33C13 34 12 36 12 36Z" opacity="0.6" />
    </g>
  </svg>
);

// AboutFace Icon - Radiant sunburst with contour lines
export const AboutFaceIcon: React.FC<IconProps> = ({ className = '', size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`spectrum-icon ${className}`}
    style={{ transition: 'transform 0.3s ease' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Central circle */}
      <circle cx="24" cy="24" r="6" />
      {/* Radiating lines */}
      <path d="M24 8V14" />
      <path d="M24 34V40" />
      <path d="M8 24H14" />
      <path d="M34 24H40" />
      <path d="M13.5 13.5L17.5 17.5" />
      <path d="M30.5 30.5L34.5 34.5" />
      <path d="M34.5 13.5L30.5 17.5" />
      <path d="M17.5 30.5L13.5 34.5" />
      {/* Contour curves */}
      <path d="M16 24C16 19.6 19.6 16 24 16" opacity="0.8" />
      <path d="M32 24C32 28.4 28.4 32 24 32" opacity="0.8" />
      <path d="M20 20C20 17.8 21.8 16 24 16" opacity="0.6" />
      <path d="M28 28C28 30.2 26.2 32 24 32" opacity="0.6" />
      {/* Additional radial elements */}
      <path d="M24 4V6" opacity="0.6" />
      <path d="M24 42V44" opacity="0.6" />
      <path d="M4 24H6" opacity="0.6" />
      <path d="M42 24H44" opacity="0.6" />
      <path d="M9.5 9.5L11 11" opacity="0.6" />
      <path d="M37 37L38.5 38.5" opacity="0.6" />
      <path d="M38.5 9.5L37 11" opacity="0.6" />
      <path d="M11 37L9.5 38.5" opacity="0.6" />
    </g>
  </svg>
);

// Export all icons as a collection
export const SpectrumIcons = {
  TMJ: TMJIcon,
  Implants: ImplantsIcon,
  Robotic: RoboticIcon,
  MedSpa: MedSpaIcon,
  AboutFace: AboutFaceIcon,
};

// Add global styles for the icons
const style = document.createElement('style');
style.textContent = `
  .spectrum-icon {
    cursor: pointer;
    display: inline-block;
  }
`;
document.head.appendChild(style);