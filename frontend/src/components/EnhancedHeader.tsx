import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CONTACT_INFO } from '../constants/contact';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
  Stack,
  Container,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  LocalHospital as LocalHospitalIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as SparkleIcon,
  Science as ScienceIcon,
  Psychology as PsychologyIcon,
  Face as FaceIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { 
    label: 'Yomi Robot', 
    path: '/yomi-robotic-surgery',
    icon: <ScienceIcon fontSize="small" />,
    highlight: true
  },
  { 
    label: 'TMJ Treatment', 
    path: '/tmj-treatment',
    icon: <PsychologyIcon fontSize="small" />
  },
  { 
    label: 'EMFACE', 
    path: '/emface-mfa',
    icon: <FaceIcon fontSize="small" />
  },
  { 
    label: 'Smile Simulator', 
    path: '/smile-simulator',
    icon: <SparkleIcon fontSize="small" />,
    highlight: true
  },
  { label: 'Contact', path: '/contact' },
];

const EnhancedHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };


  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
          color: 'text.primary',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        {/* Top Bar */}
        {!isTablet && (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
              color: 'white',
              py: 0.5,
            }}
          >
            <Container maxWidth="xl">
              <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="caption">
                      {CONTACT_INFO.phone.display}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <ScheduleIcon fontSize="small" />
                    <Typography variant="caption">
                      Mon-Fri: 9AM-6PM | Sat: 10AM-4PM
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    const event = new CustomEvent('open-julie-chat');
                    window.dispatchEvent(event);
                  }}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    fontSize: '0.75rem',
                    py: 0.5,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  startIcon={<SparkleIcon fontSize="small" />}
                >
                  Talk to Julie EP<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</sup>
                </Button>
              </Stack>
            </Container>
          </Box>
        )}

        {/* Main Navbar */}
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              py: scrolled ? 1 : 2,
              px: { xs: 2, sm: 3 },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {/* Logo Section */}
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={2}
              sx={{ flexGrow: 1 }}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                  }}
                >
                  <LocalHospitalIcon 
                    sx={{ 
                      fontSize: 28, 
                      color: 'white' 
                    }} 
                  />
                </Box>
              </motion.div>
              
              <Box>
                <Typography
                  variant={scrolled ? 'h6' : 'h5'}
                  component={motion.div}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    transition: 'font-size 0.3s ease-in-out',
                  }}
                >
                  Staten Island Advanced Dentistry
                </Typography>
                {!scrolled && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Dr. Pedro • Expert Prosthodontic Care
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* Desktop Navigation */}
            {!isMobile ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => handleNavigation(item.path)}
                      startIcon={item.icon}
                      sx={{
                        color: location.pathname === item.path 
                          ? 'primary.main' 
                          : 'text.primary',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        position: 'relative',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        background: item.highlight && location.pathname !== item.path
                          ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)'
                          : location.pathname === item.path
                          ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
                          : 'transparent',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      {item.label}
                      {item.highlight && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            ml: 0.5,
                            height: 16,
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                            color: 'white',
                          }}
                        />
                      )}
                    </Button>
                  </motion.div>
                ))}
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      const event = new CustomEvent('open-julie-chat');
                      window.dispatchEvent(event);
                    }}
                    startIcon={<SparkleIcon />}
                    sx={{
                      ml: 2,
                      background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                      boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)',
                      },
                    }}
                  >
                    Talk to Julie EP<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</sup>
                  </Button>
                </motion.div>
              </Stack>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  ml: 1,
                  background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 320,
            background: 'linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Drawer Header */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Typography 
              variant="h6" 
              fontWeight="700"
              sx={{
                background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Menu
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'white',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {/* Mobile Menu Items */}
          <List sx={{ p: 0 }}>
            <AnimatePresence>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      selected={location.pathname === item.path}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        background: location.pathname === item.path
                          ? 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)'
                          : 'rgba(255, 255, 255, 0.8)',
                        color: location.pathname === item.path ? 'white' : 'text.primary',
                        '&:hover': {
                          background: location.pathname === item.path
                            ? 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)'
                            : 'white',
                        },
                        transition: 'all 0.3s ease-in-out',
                      }}
                    >
                      {item.icon && (
                        <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                          {item.icon}
                        </Box>
                      )}
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{
                          fontWeight: location.pathname === item.path ? 600 : 500,
                        }}
                      />
                      {item.highlight && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: location.pathname === item.path
                              ? 'rgba(255, 255, 255, 0.3)'
                              : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                            color: location.pathname === item.path ? 'white' : 'white',
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}
          >
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => {
                const event = new CustomEvent('open-julie-chat');
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
              startIcon={<SparkleIcon />}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
                boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #6d28d9 100%)',
                  boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)',
                },
              }}
            >
              Talk to Julie EP<sup style={{ fontSize: '0.6em', verticalAlign: 'super' }}>3</sup>
            </Button>
          </motion.div>

          {/* Contact Info */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'white', borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Contact Us
            </Typography>
            <Stack spacing={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2">{CONTACT_INFO.phone.display}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon fontSize="small" color="primary" />
                <Typography variant="body2">Mon-Fri: 9AM-6PM</Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Drawer>

    </>
  );
};

export default EnhancedHeader;