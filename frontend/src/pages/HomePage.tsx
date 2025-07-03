import { GatewaySelection } from '../components/GatewaySelection';
import { MiniGatewayBar } from '../components/MiniGatewayBar';
import LuxuryServicesShowcase from '../components/LuxuryServicesShowcase';
import LuxuryStatsSection from '../components/LuxuryStatsSection';
import LuxuryTrustIndicators from '../components/LuxuryTrustIndicators';
import LuxuryGoogleReviews from '../components/LuxuryGoogleReviews';
import { Box } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';
import { useChatStore } from '../chatbot/store/chatStore';

const HomePage = () => {
  usePageTitle('Home');
  const isOpen = useChatStore((state) => state.isOpen);
  
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
      
      {/* Mini Gateway Bar - shows when scrolled past main gateways */}
      {!isOpen && <MiniGatewayBar />}
      
      <LuxuryServicesShowcase />
      <LuxuryStatsSection />
      <LuxuryTrustIndicators />
      <LuxuryGoogleReviews />
    </Box>
  );
};

export default HomePage;