import React from 'react';
import { Box } from '@mui/material';

interface IconProps {
  className?: string;
  title?: string;
  size?: number;
}

export const TMJIcon = ({ className = '', title = 'TMJ Icon', size = 64 }: IconProps) => (
  <Box
    className={className}
    sx={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        p: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
          borderRadius: '50%',
        },
      }}
    >
      <svg 
        viewBox="0 0 64 64" 
        style={{ width: '100%', height: '100%' }}
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M24 32c0-7 6-12 12-12s12 5 12 12-6 12-12 12" stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="36" cy="32" r="3" fill="#1a1a1a" />
      </svg>
    </Box>
  </Box>
);

export const ImplantIcon = ({ className = '', title = 'Implant Icon', size = 64 }: IconProps) => (
  <Box
    className={className}
    sx={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        p: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
          borderRadius: '50%',
        },
      }}
    >
      <svg 
        viewBox="0 0 64 64" 
        style={{ width: '100%', height: '100%' }}
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M32 4v56m-8-8h16m-16-8h16" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="32" cy="4" r="3" fill="#1a1a1a" />
      </svg>
    </Box>
  </Box>
);

export const RobotSurgeryIcon = ({ className = '', title = 'Robotic Surgery Icon', size = 64 }: IconProps) => (
  <Box
    className={className}
    sx={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        p: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
          borderRadius: '50%',
        },
      }}
    >
      <svg 
        viewBox="0 0 64 64" 
        style={{ width: '100%', height: '100%' }}
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M20 40L44 16m0 0v10m0-10h-10" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="44" cy="16" r="3" fill="#1a1a1a" />
      </svg>
    </Box>
  </Box>
);

export const MedspaIcon = ({ className = '', title = 'Medspa Icon', size = 64 }: IconProps) => (
  <Box
    className={className}
    sx={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        p: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
          borderRadius: '50%',
        },
      }}
    >
      <svg 
        viewBox="0 0 64 64" 
        style={{ width: '100%', height: '100%' }}
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M32 20c-8 0-14 6-14 14s6 14 14 14 14-6 14-14" fill="none" stroke="#1a1a1a" strokeWidth="3.5" />
        <circle cx="32" cy="34" r="3" fill="#1a1a1a" />
      </svg>
    </Box>
  </Box>
);

export const AboutFaceIcon = ({ className = '', title = 'About Face Icon', size = 64 }: IconProps) => (
  <Box
    className={className}
    sx={{
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      },
      '&:active': {
        transform: 'scale(0.95)',
      },
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderRadius: '50%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        p: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%)',
          borderRadius: '50%',
        },
      }}
    >
      <svg 
        viewBox="0 0 64 64" 
        style={{ width: '100%', height: '100%' }}
        aria-label={title} 
        role="img"
      >
        <title>{title}</title>
        <path d="M20 24h24m-24 8h24m-24 8h24" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M32 20v24" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </svg>
    </Box>
  </Box>
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