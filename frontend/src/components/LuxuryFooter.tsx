import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { CONTACT_INFO } from '../constants/contact';
import { LuxuryContactIcon, LuxuryChatIcon, LuxuryMedicalIcon } from './icons/LuxuryIcons';

const LuxuryFooter: React.FC = () => {
  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
  ];

  const services = [
    { name: 'TMJ Excellence', href: '/tmj' },
    { name: 'Implant Artistry', href: '/implants' },
    { name: 'Robotic Precision', href: '/robotic' },
    { name: 'MedSpa Luxury', href: '/medspa' },
    { name: 'AboutFace Elite', href: '/aboutface' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        mt: 'auto',
        pt: 8,
        pb: 4,
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F0F0F0 100%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      {/* Luxury gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'var(--gradient-aurora)',
          backgroundSize: '400% 400%',
          animation: 'aurora 20s ease infinite',
          opacity: 0.03,
          filter: 'blur(100px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
            gap: 6,
            mb: 6,
          }}
        >
          {/* Brand Section */}
          <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <LuxuryMedicalIcon 
                  sx={{ 
                    fontSize: 48,
                    background: 'var(--gradient-luxury)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3))',
                  }} 
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'var(--font-primary)',
                    fontWeight: 700,
                    background: 'var(--gradient-luxury)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Dr. Pedro
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: 400,
                  lineHeight: 1.8,
                  mb: 4,
                  fontFamily: 'var(--font-secondary)',
                }}
              >
                Elevating dental care to an art form. Where cutting-edge technology meets 
                unparalleled expertise for your perfect smile.
              </Typography>
              <Stack direction="row" spacing={1}>
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      sx={{
                        background: alpha('#667eea', 0.1),
                        color: '#667eea',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'var(--gradient-luxury)',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                        },
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>
          </Box>

          {/* Services Section */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  mb: 3,
                  color: 'var(--luxury-black)',
                }}
              >
                Centers of Excellence
              </Typography>
              <Stack spacing={1.5}>
                {services.map((service, index) => (
                  <Link
                    key={index}
                    href={service.href}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-secondary)',
                      fontSize: '0.95rem',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -2,
                        left: 0,
                        width: 0,
                        height: 2,
                        background: 'var(--gradient-luxury)',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover': {
                        color: '#667eea',
                        transform: 'translateX(4px)',
                        '&::after': {
                          width: '100%',
                        },
                      },
                    }}
                  >
                    {service.name}
                  </Link>
                ))}
              </Stack>
            </motion.div>
          </Box>

          {/* Contact Section */}
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                  mb: 3,
                  color: 'var(--luxury-black)',
                }}
              >
                Get in Touch
              </Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LuxuryChatIcon 
                    sx={{ 
                      fontSize: 32,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }} 
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 600,
                        color: 'var(--luxury-black)',
                      }}
                    >
                      {CONTACT_INFO.phone.display}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'var(--font-secondary)',
                      }}
                    >
                      Available 24/7
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LuxuryContactIcon 
                    sx={{ 
                      fontSize: 32,
                      background: 'linear-gradient(135deg, #764ba2 0%, #f093fb 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }} 
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 600,
                        color: 'var(--luxury-black)',
                      }}
                    >
                      {CONTACT_INFO.emails.suite.info}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'var(--font-secondary)',
                      }}
                    >
                      Concierge Support
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <LocationOnIcon 
                    sx={{ 
                      fontSize: 32,
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }} 
                  />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'var(--font-secondary)',
                        fontWeight: 600,
                        color: 'var(--luxury-black)',
                      }}
                    >
                      {CONTACT_INFO.address.street}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'var(--font-secondary)',
                      }}
                    >
                      {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </motion.div>
          </Box>
        </Box>

        <Divider
          sx={{
            borderColor: alpha('#000', 0.05),
            my: 4,
          }}
        />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontFamily: 'var(--font-secondary)',
              fontSize: '0.875rem',
            }}
          >
            © {new Date().getFullYear()} Dr. Pedro. Crafted with excellence.
          </Typography>
          <Stack
            direction="row"
            spacing={3}
            sx={{
              '& a': {
                color: 'text.secondary',
                textDecoration: 'none',
                fontFamily: 'var(--font-secondary)',
                fontSize: '0.875rem',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: '#667eea',
                },
              },
            }}
          >
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default LuxuryFooter;