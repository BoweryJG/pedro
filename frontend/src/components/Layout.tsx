import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import EnhancedLuxuryNavbar from './EnhancedLuxuryNavbar';
import LuxuryFooter from './LuxuryFooter';
import LuxuryCenterSelectionModal from './LuxuryCenterSelectionModal';
import AIQuestionnaire from './AIQuestionnaire';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import { TexturedSection, GrainTexture, SubtleGrid } from './effects/TextureOverlays';

const Layout = () => {
  const { showCenterSelector, setShowCenterSelector } = useAdaptiveNavigation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Global texture overlays */}
      <GrainTexture />
      <SubtleGrid />
      
      <EnhancedLuxuryNavbar />
      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 8, md: 10 }, position: 'relative', zIndex: 10 }}>
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