import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface SubdomainInfo {
  id: string;
  name: string;
  url: string;
  color: string;
  description: string;
  isActive?: boolean;
}

interface CrossDomainNavProps {
  currentSubdomain?: string;
  patientSession?: any;
  onChatbotHandoff?: (targetDomain: string) => void;
}

const SUBDOMAINS: SubdomainInfo[] = [
  {
    id: 'main',
    name: 'Main Practice',
    url: 'https://drpedro.com',
    color: '#1976d2',
    description: 'General Dentistry & Prosthodontics'
  },
  {
    id: 'tmj',
    name: 'TMJ Treatment',
    url: 'https://tmj.drpedro.com',
    color: '#d32f2f',
    description: 'Specialized TMJ & Jaw Pain Solutions'
  },
  {
    id: 'implants',
    name: 'Dental Implants',
    url: 'https://implants.drpedro.com',
    color: '#388e3c',
    description: 'Advanced Implant Dentistry'
  },
  {
    id: 'robotic',
    name: 'Yomi Robotic Surgery',
    url: 'https://yomi.drpedro.com',
    color: '#7b1fa2',
    description: 'Precision Robotic Dental Surgery'
  },
  {
    id: 'medspa',
    name: 'MedSpa Services',
    url: 'https://medspa.drpedro.com',
    color: '#f57c00',
    description: 'Aesthetic & Facial Treatments'
  },
  {
    id: 'aboutface',
    name: 'About Face',
    url: 'https://aboutface.drpedro.com',
    color: '#5d4037',
    description: 'Facial Aesthetics & Rejuvenation'
  }
];

export const CrossDomainNav: React.FC<CrossDomainNavProps> = ({
  currentSubdomain = 'main',
  patientSession,
  onChatbotHandoff
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [servicesAnchor, setServicesAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const currentDomain = SUBDOMAINS.find(d => d.id === currentSubdomain) || SUBDOMAINS[0];

  useEffect(() => {
    // Load patient session data from cross-domain storage
    loadPatientSession();
  }, []);

  const loadPatientSession = async () => {
    try {
      // Check localStorage first
      const localSession = localStorage.getItem('dr_pedro_patient_session');
      if (localSession) {
        setPatientData(JSON.parse(localSession));
        return;
      }

      // Check sessionStorage
      const sessionData = sessionStorage.getItem('dr_pedro_patient_session');
      if (sessionData) {
        setPatientData(JSON.parse(sessionData));
        return;
      }

      // Try to get from parent domain
      await loadFromParentDomain();
    } catch (error) {
      console.warn('Could not load patient session:', error);
    }
  };

  const loadFromParentDomain = async () => {
    try {
      const response = await fetch(`${getBaseApiUrl()}/api/patient/session`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const sessionData = await response.json();
        setPatientData(sessionData);
        
        // Store in local storage for future use
        localStorage.setItem('dr_pedro_patient_session', JSON.stringify(sessionData));
      }
    } catch (error) {
      console.warn('Could not load session from parent domain:', error);
    }
  };

  const getBaseApiUrl = () => {
    if (window.location.hostname.includes('localhost')) {
      return 'http://localhost:3001';
    }
    return 'https://pedrobackend.onrender.com';
  };

  const handleServicesClick = (event: React.MouseEvent<HTMLElement>) => {
    setServicesAnchor(event.currentTarget);
  };

  const handleServicesClose = () => {
    setServicesAnchor(null);
  };

  const handleSubdomainNavigation = async (subdomain: SubdomainInfo) => {
    try {
      // Save current session state before navigation
      if (patientData) {
        await savePatientSession(patientData);
      }

      // Trigger analytics tracking
      trackCrossDomainNavigation(currentSubdomain, subdomain.id);

      // Handle chatbot handoff if callback provided
      if (onChatbotHandoff) {
        onChatbotHandoff(subdomain.id);
      }

      // Navigate to subdomain
      window.location.href = subdomain.url;
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to direct navigation
      window.location.href = subdomain.url;
    }
  };

  const savePatientSession = async (sessionData: any) => {
    try {
      // Save to local storage
      localStorage.setItem('dr_pedro_patient_session', JSON.stringify(sessionData));
      
      // Save to backend
      await fetch(`${getBaseApiUrl()}/api/patient/session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });
    } catch (error) {
      console.warn('Could not save patient session:', error);
    }
  };

  const trackCrossDomainNavigation = async (from: string, to: string) => {
    try {
      await fetch(`${getBaseApiUrl()}/api/analytics/cross-domain-navigation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from,
          to,
          timestamp: new Date().toISOString(),
          patientId: patientData?.id,
          sessionId: patientData?.sessionId
        })
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  const handlePhoneCall = () => {
    window.open('tel:+17185550123', '_self');
  };

  const handleChatToggle = () => {
    // Trigger global chat widget
    window.dispatchEvent(new CustomEvent('toggleChat', { 
      detail: { domain: currentSubdomain } 
    }));
  };

  const renderDesktopNav = () => (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: currentDomain.color,
        boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'white'
              }}
              onClick={() => handleSubdomainNavigation(SUBDOMAINS[0])}
            >
              Dr. Pedro Advanced Dental Care
            </Typography>
          </motion.div>
          
          <Chip 
            label={currentDomain.name}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <Button
            color="inherit"
            onClick={handleServicesClick}
            sx={{ fontWeight: 600 }}
          >
            All Services
          </Button>
          
          <IconButton 
            color="inherit" 
            onClick={handlePhoneCall}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <PhoneIcon />
          </IconButton>
          
          <IconButton 
            color="inherit" 
            onClick={handleChatToggle}
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <ChatIcon />
          </IconButton>
        </Box>

        <Menu
          anchorEl={servicesAnchor}
          open={Boolean(servicesAnchor)}
          onClose={handleServicesClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 320,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }
          }}
        >
          {SUBDOMAINS.map((subdomain) => (
            <MenuItem 
              key={subdomain.id}
              onClick={() => {
                handleSubdomainNavigation(subdomain);
                handleServicesClose();
              }}
              sx={{
                py: 2,
                borderLeft: subdomain.id === currentSubdomain ? `4px solid ${subdomain.color}` : 'none',
                backgroundColor: subdomain.id === currentSubdomain ? 'rgba(0,0,0,0.04)' : 'transparent'
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color={subdomain.color}>
                  {subdomain.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subdomain.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );

  const renderMobileNav = () => (
    <>
      <AppBar 
        position="sticky" 
        sx={{ backgroundColor: currentDomain.color }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setMobileDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Dr. Pedro
          </Typography>
          
          <IconButton color="inherit" onClick={handleChatToggle}>
            <ChatIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: { width: 300 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Dr. Pedro Services
            </Typography>
            <IconButton onClick={() => setMobileDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        
        <List>
          {SUBDOMAINS.map((subdomain) => (
            <ListItem
              key={subdomain.id}
              button
              onClick={() => {
                handleSubdomainNavigation(subdomain);
                setMobileDrawerOpen(false);
              }}
              sx={{
                borderLeft: subdomain.id === currentSubdomain ? `4px solid ${subdomain.color}` : 'none',
                backgroundColor: subdomain.id === currentSubdomain ? 'rgba(0,0,0,0.04)' : 'transparent'
              }}
            >
              <ListItemText
                primary={
                  <Typography fontWeight={600} color={subdomain.color}>
                    {subdomain.name}
                  </Typography>
                }
                secondary={subdomain.description}
              />
            </ListItem>
          ))}
        </List>
        
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PhoneIcon />}
            onClick={handlePhoneCall}
            sx={{ 
              backgroundColor: currentDomain.color,
              '&:hover': { backgroundColor: currentDomain.color }
            }}
          >
            Call Now: (718) 555-0123
          </Button>
        </Box>
      </Drawer>
    </>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isMobile ? renderMobileNav() : renderDesktopNav()}
    </motion.div>
  );
};

export default CrossDomainNav;