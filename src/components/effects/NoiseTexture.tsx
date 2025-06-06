import { Box } from '@mui/material';

interface NoiseTextureProps {
  opacity?: number;
  blendMode?: string;
}

const NoiseTexture: React.FC<NoiseTextureProps> = ({
  opacity = 0.05,
  blendMode = 'overlay',
}) => {
  // Generate noise pattern using SVG
  const noisePattern = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.9" 
          numOctaves="4" 
          seed="5"
        />
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.5"/>
    </svg>
  `;
  
  const encodedNoise = `data:image/svg+xml;base64,${btoa(noisePattern)}`;
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity,
        mixBlendMode: blendMode,
        backgroundImage: `url("${encodedNoise}")`,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default NoiseTexture;