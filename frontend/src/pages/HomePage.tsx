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
    <Box>
      {/* Main Gateway Selection */}
      <Box sx={{ 
        minHeight: { xs: '100vh', md: '80vh' }, 
        display: 'flex', 
        alignItems: 'center',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
      }}>
        <GatewaySelection />
      </Box>
      
      <LuxuryServicesShowcase />
      <LuxuryStatsSection />
      <LuxuryTrustIndicators />
      <LuxuryGoogleReviews />
    </Box>
  );
};

export default HomePage;