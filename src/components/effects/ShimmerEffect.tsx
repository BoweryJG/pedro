import { Box } from '@mui/material';
import { keyframes } from '@mui/system';

interface ShimmerEffectProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  duration?: number;
}

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
`;

const ShimmerEffect: React.FC<ShimmerEffectProps> = ({
  width = '100%',
  height = '100%',
  color = 'rgba(255, 255, 255, 0.3)',
  duration = 1.5,
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`,
          animation: `${shimmer} ${duration}s infinite`,
        }}
      />
    </Box>
  );
};

export default ShimmerEffect;