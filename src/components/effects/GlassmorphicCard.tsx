import type { PaperProps } from '@mui/material';
import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

interface GlassmorphicCardProps extends PaperProps {
  blur?: number;
  transparency?: number;
  borderGradient?: string;
}

const GlassmorphicCard = styled(Paper)<GlassmorphicCardProps>(({ 
  theme, 
  blur = 20, 
  transparency = 0.1,
  borderGradient = 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)'
}) => ({
  background: `rgba(255, 255, 255, ${transparency})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: '1px solid transparent',
  borderRadius: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    padding: '1px',
    background: borderGradient,
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    pointerEvents: 'none',
  },
  
  '&:hover': {
    background: `rgba(255, 255, 255, ${transparency + 0.05})`,
    transform: 'translateY(-2px)',
    transition: 'all 0.3s ease',
  }
}));

export default GlassmorphicCard;