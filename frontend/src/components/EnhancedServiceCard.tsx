import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GlassmorphicCard from './effects/GlassmorphicCard';
import AnimatedGradientBorder from './effects/AnimatedGradientBorder';
import SoftAnimatedIcon from './effects/SoftAnimatedIcon';
import NoiseTexture from './effects/NoiseTexture';
import { trackEvent, trackProcedureInterest } from '../utils/analytics';

interface EnhancedServiceCardProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  path: string;
  highlight?: boolean;
  color: string;
  onNavigate: (path: string) => void;
  index: number;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({
  icon,
  title,
  description,
  path,
  highlight = false,
  color,
  onNavigate,
  index,
}) => {
  const gradientColors = [
    `${color}`,
    `${alpha(color, 0.8)}`,
    `${alpha(color, 0.6)}`,
    `${alpha(color, 0.4)}`,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
    >
      <Box sx={{ position: 'relative', height: '100%' }}>
        {highlight && (
          <AnimatedGradientBorder
            borderRadius={16}
            borderWidth={3}
            colors={gradientColors}
            animationDuration={3}
          >
            <GlassmorphicCard
              elevation={0}
              blur={30}
              transparency={0.08}
              borderGradient={`linear-gradient(135deg, ${alpha(color, 0.3)} 0%, ${alpha(color, 0.1)} 100%)`}
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  '& .service-glow': {
                    opacity: 1,
                  },
                  '& .service-particles': {
                    opacity: 0.6,
                  },
                },
              }}
              onClick={() => {
                trackEvent('service_card_click', {
                  service_title: title,
                  service_path: path,
                  action: 'navigate'
                });
                trackProcedureInterest(title.toLowerCase());
                onNavigate(path);
              }}
            >
              <NoiseTexture opacity={0.02} />
              
              {/* Animated background gradient */}
              <Box
                className="service-glow"
                sx={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: `radial-gradient(circle at center, ${alpha(color, 0.2)} 0%, transparent 70%)`,
                  opacity: 0.5,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                }}
              />
              
              {/* Floating particles */}
              <Box
                className="service-particles"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                  pointerEvents: 'none',
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: color,
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                    }}
                    animate={{
                      y: [-10, -30, -10],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                {highlight && (
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', top: -15, right: 20 }}
                  >
                    <Chip
                      label="Most Popular"
                      sx={{
                        background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        py: 2.5,
                        px: 2,
                        boxShadow: `0 8px 20px ${alpha(color, 0.4)}`,
                      }}
                    />
                  </motion.div>
                )}
                
                {/* Animated Icon */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <SoftAnimatedIcon
                    icon={icon}
                    gradient={`linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`}
                    glowColor={alpha(color, 0.3)}
                    size={50}
                    animate={false}
                  />
                </Box>
                
                <Typography 
                  variant="h5" 
                  align="center" 
                  gutterBottom 
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                    color: 'text.primary',
                  }}
                >
                  {title}
                </Typography>
                
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  paragraph
                  sx={{ 
                    mb: 4,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.6,
                  }}
                >
                  {description}
                </Typography>
                
                <Box textAlign="center">
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: color,
                      fontWeight: 600,
                      fontSize: '1rem',
                      position: 'relative',
                      overflow: 'hidden',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
                        borderRadius: 'inherit',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        '&::before': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </GlassmorphicCard>
          </AnimatedGradientBorder>
        )}
        
        {!highlight && (
          <GlassmorphicCard
            elevation={0}
            blur={20}
            transparency={0.05}
            borderGradient={`linear-gradient(135deg, ${alpha(color, 0.2)} 0%, ${alpha(color, 0.05)} 100%)`}
            sx={{
              height: '100%',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${alpha(color, 0.1)}`,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                borderColor: alpha(color, 0.3),
                boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
                '& .service-glow': {
                  opacity: 0.8,
                },
              },
            }}
            onClick={() => {
              trackEvent('service_card_click', {
                service_title: title,
                service_path: path,
                action: 'navigate',
                variant: 'mobile'
              });
              trackProcedureInterest(title.toLowerCase());
              onNavigate(path);
            }}
          >
            <NoiseTexture opacity={0.02} />
            
            <Box
              className="service-glow"
              sx={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `radial-gradient(circle at center, ${alpha(color, 0.15)} 0%, transparent 70%)`,
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }}
            />

            <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <SoftAnimatedIcon
                  icon={icon}
                  gradient={`linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`}
                  glowColor={alpha(color, 0.25)}
                  size={45}
                  animate={false}
                />
              </Box>
              
              <Typography 
                variant="h5" 
                align="center" 
                gutterBottom 
                fontWeight={700}
                sx={{ 
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                {title}
              </Typography>
              
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                paragraph
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
              
              <Box textAlign="center">
                <Button
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    color: color,
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(color, 0.08),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </GlassmorphicCard>
        )}
      </Box>
    </motion.div>
  );
};

export default EnhancedServiceCard;