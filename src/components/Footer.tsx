import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
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
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom>
              Edwards & Pedro Advanced Dental Care
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Leading the future of dental care with cutting-edge Yomi robotic surgery,
              comprehensive TMJ treatment, and revolutionary EMFACE procedures.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="primary" size="small">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  (718) 555-0123
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  info@edwardspedrodental.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOnIcon sx={{ mr: 1, color: 'primary.main', fontSize: 20 }} />
                <Typography variant="body2">
                  123 Advanced Dental Plaza<br />
                  Staten Island, NY 10301
                </Typography>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Edwards & Pedro Advanced Dental Care. All rights reserved.
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