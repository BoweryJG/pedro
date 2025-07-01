import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import LuxuryAdaptiveNavbar from './LuxuryAdaptiveNavbar';
import LuxuryFooter from './LuxuryFooter';
import LuxuryCenterSelectionModal from './LuxuryCenterSelectionModal';
import AIQuestionnaire from './AIQuestionnaire';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';

const Layout = () => {
  const { showCenterSelector, setShowCenterSelector } = useAdaptiveNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LuxuryAdaptiveNavbar />
      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 8, md: 10 } }}>
        <Outlet />
      </Box>
      <LuxuryFooter />
      
      {/* Center Selection Modal */}
      <LuxuryCenterSelectionModal 
        open={showCenterSelector} 
        onClose={() => setShowCenterSelector(false)} 
      />
      
      {/* AI Questionnaire */}
      <AIQuestionnaire />
    </Box>
  );
};

export default Layout;