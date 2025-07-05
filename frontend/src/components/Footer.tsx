import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { CONTACT_INFO } from '../constants/contact';
import { useChatStore } from '../chatbot/store/chatStore';

const Footer = () => {
  const toggleChat = useChatStore((state) => state.toggleChat);
  
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Dr. Greg Pedro, DMD
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Staten Island Sports Hall of Famer and board-certified prosthodontist with 30+ years of excellence. 
              Pioneering robotic dental implants, TMJ treatment, and aesthetic dentistry. 
              Enhanced by Julie EPT⁴ - available 24/7 for your convenience.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton 
                color="primary" 
                size="small"
                href="https://www.facebook.com/drpedrodental"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                size="small"
                href="https://www.instagram.com/drpedrodental"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton 
                color="primary" 
                size="small"
                href="https://www.linkedin.com/in/drpedro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn profile"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.333%' }, px: 2 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Link 
                  href={`tel:${CONTACT_INFO.phone.raw}`}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <Typography variant="body2">
                    {CONTACT_INFO.phone.display}
                  </Typography>
                </Link>
              </Box>
              <Button
                onClick={toggleChat}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  }
                }}
              >
                <ChatIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  Chat with Julie EPT⁴ 24/7
                </Typography>
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Link 
                  href={`mailto:${CONTACT_INFO.emails.suite.info}`}
                  color="inherit"
                  underline="hover"
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' }
                  }}
                >
                  <Typography variant="body2">
                    {CONTACT_INFO.emails.suite.info}
                  </Typography>
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  {CONTACT_INFO.address.street}<br />
                  {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zip}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.333%' }, px: 2 }}>
            <Typography variant="h6" gutterBottom>
              Our Services
            </Typography>
            <Stack spacing={1}>
              <Link href="/yomi-robotic-surgery" color="inherit" underline="hover">
                Yomi Robotic Surgery
              </Link>
              <Link href="/tmj-treatment" color="inherit" underline="hover">
                TMJ Treatment
              </Link>
              <Link href="/emface-mfa" color="inherit" underline="hover">
                EMFACE by BTL
              </Link>
              <Link href="/services" color="inherit" underline="hover">
                All Services
              </Link>
            </Stack>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Dr. Greg Pedro, DMD - Advanced Dental Care & Aesthetics. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Link href="/privacy" color="inherit" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="/terms" color="inherit" underline="hover" variant="body2">
              Terms of Service
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;