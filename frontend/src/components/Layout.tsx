import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AdaptiveNavbar from './AdaptiveNavbar';
import Footer from './Footer';
import CenterSelectionModal from './CenterSelectionModal';
import AIQuestionnaire from './AIQuestionnaire';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';

const Layout = () => {
  const { showCenterSelector, setShowCenterSelector } = useAdaptiveNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdaptiveNavbar />
      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 8, md: 10 } }}>
        <Outlet />
      </Box>
      <Footer />
      
      {/* Center Selection Modal */}
      <CenterSelectionModal 
        open={showCenterSelector} 
        onClose={() => setShowCenterSelector(false)} 
      />
      
      {/* AI Questionnaire */}
      <AIQuestionnaire />
    </Box>
  );
};

export default Layout;