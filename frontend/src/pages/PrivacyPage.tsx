import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';

const PrivacyPage: React.FC = () => {
  usePageTitle('Privacy Policy');

  return (
    <Box sx={{ py: { xs: 12, md: 16 }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
            Privacy Policy
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            At Dr. Greg Pedro, DMD, we collect information you provide directly to us, such as when you request an appointment, 
            submit a form, or communicate with us via phone, email, or our AI assistant Julie EPT⁴.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the information we collect to provide dental services, schedule appointments, process insurance claims, 
            and improve our services. We maintain strict confidentiality of all patient records in accordance with HIPAA regulations.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational measures to protect your personal information against 
            unauthorized access, alteration, disclosure, or destruction.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          <Typography variant="body1" component="div">
            Dr. Greg Pedro, DMD<br />
            4300 Hylan Blvd<br />
            Staten Island, NY 10312<br />
            Phone: (929) 242-4535<br />
            Email: privacy@gregpedromd.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPage;