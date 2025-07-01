import LuxuryCareConciergeHero from '../components/LuxuryCareConciergeHero';
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
      <LuxuryCareConciergeHero />
      <LuxuryServicesShowcase />
      <LuxuryStatsSection />
      <LuxuryTrustIndicators />
      <LuxuryGoogleReviews />
    </Box>
  );
};

export default HomePage;