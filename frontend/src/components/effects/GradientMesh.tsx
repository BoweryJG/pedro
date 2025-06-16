import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface GradientMeshProps {
  colors?: string[];
  opacity?: number;
  animate?: boolean;
}

const GradientMesh: React.FC<GradientMeshProps> = ({ 
  colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
  opacity = 0.3,
  animate = true 
}) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        opacity,
      }}
    >
      <svg
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
        }}
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
            <feColorMatrix
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 20 -10"
            />
          </filter>
        </defs>
        <g filter="url(#goo)">
          {colors.map((color, i) => {
            const initialCx = 25 + (i * 25);
            const initialCy = 25 + (i * 15);
            
            return (
              <motion.circle
                key={i}
                r="20%"
                fill={color}
                initial={{
                  cx: `${initialCx}%`,
                  cy: `${initialCy}%`,
                }}
                animate={animate ? {
                  cx: [`${initialCx}%`, `${75 - (i * 15)}%`, `${initialCx}%`],
                  cy: [`${initialCy}%`, `${75 - (i * 25)}%`, `${initialCy}%`],
                  scale: [1, 1.5, 1],
                } : {
                  cx: `${initialCx}%`,
                  cy: `${initialCy}%`,
                }}
                transition={{
                  duration: 20 + i * 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </g>
      </svg>
    </Box>
  );
};

export default GradientMesh;