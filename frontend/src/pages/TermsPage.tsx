import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';

const TermsPage: React.FC = () => {
  usePageTitle('Terms of Service');

  return (
    <Box sx={{ py: { xs: 12, md: 16 }, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, backgroundColor: 'white', borderRadius: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ mb: 4 }}>
            Terms of Service
          </Typography>
          
          <Typography variant="body1" paragraph>
            Last Updated: {new Date().toLocaleDateString()}
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using the services of Dr. Greg Pedro, DMD, you accept and agree to be bound by these Terms of Service.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Dental Services
          </Typography>
          <Typography variant="body1" paragraph>
            Our dental services are provided by licensed professionals. Treatment plans are customized for each patient 
            based on individual needs and clinical evaluation. Results may vary.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Appointment Policy
          </Typography>
          <Typography variant="body1" paragraph>
            Appointments can be scheduled through our website, by phone, or through our AI assistant Julie EPT⁴. 
            We require 24-hour notice for cancellations to avoid cancellation fees.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Payment and Insurance
          </Typography>
          <Typography variant="body1" paragraph>
            Payment is due at the time of service unless other arrangements have been made. We accept most major insurance plans 
            and offer financing options through Sunbit, Cherry, and CareCredit.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            Dr. Greg Pedro, DMD and its staff shall not be liable for any indirect, incidental, special, or consequential damages 
            arising from the use of our services or website.
          </Typography>

          <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Contact Information
          </Typography>
          <Typography variant="body1" component="div">
            Dr. Greg Pedro, DMD<br />
            4300 Hylan Blvd<br />
            Staten Island, NY 10312<br />
            Phone: (929) 242-4535<br />
            Email: info@gregpedromd.com
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsPage;