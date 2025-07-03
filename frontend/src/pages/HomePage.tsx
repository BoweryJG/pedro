import { GatewaySelection } from '../components/GatewaySelection';
import LuxuryServicesShowcase from '../components/LuxuryServicesShowcase';
import LuxuryStatsSection from '../components/LuxuryStatsSection';
import LuxuryTrustIndicators from '../components/LuxuryTrustIndicators';
import LuxuryGoogleReviews from '../components/LuxuryGoogleReviews';
import { Box } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  
  return (
    <Box sx={{ backgroundColor: 'var(--luxury-warm-white)' }}>
      {/* Main Gateway Selection - Hero Section */}
      <Box 
        className="luxury-section"
        sx={{ 
          minHeight: { xs: '100vh', md: '85vh' }, 
          display: 'flex', 
          alignItems: 'center',
          background: 'var(--gradient-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <GatewaySelection />
      </Box>
      
      {/* Services Section with Alternating Background */}
      <Box className="luxury-section-alt">
        <LuxuryServicesShowcase />
      </Box>
      
      {/* Stats Section with Dark Background */}
      <Box className="luxury-section-dark">
        <LuxuryStatsSection />
      </Box>
      
      {/* Trust Indicators with Normal Background */}
      <Box className="luxury-section">
        <LuxuryTrustIndicators />
      </Box>
      
      {/* Reviews Section with Subtle Background */}
      <Box className="luxury-section-alt">
        <LuxuryGoogleReviews />
      </Box>
      
      {/* Wave Divider at Bottom */}
      <div className="section-divider-wave" />
    </Box>
  );
};

export default HomePage;