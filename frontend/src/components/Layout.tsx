import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import EnhancedLuxuryNavbar from './EnhancedLuxuryNavbar';
import LuxuryFooter from './LuxuryFooter';
import LuxuryCenterSelectionModal from './LuxuryCenterSelectionModal';
import AIQuestionnaire from './AIQuestionnaire';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import { TexturedSection } from './effects/TextureOverlays';

const Layout = () => {
  const { showCenterSelector, setShowCenterSelector } = useAdaptiveNavigation();

  console.log('🚨 Layout render - showCenterSelector:', showCenterSelector);
  
  // Add debugging for when showCenterSelector changes
  React.useEffect(() => {
    console.log('🚨 Layout useEffect - showCenterSelector changed to:', showCenterSelector);
  }, [showCenterSelector]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Global texture overlays - REMOVED FOR PERFORMANCE */}
      
      <EnhancedLuxuryNavbar />
      <Box component="main" sx={{ flexGrow: 1, mt: { xs: 8, md: 10 }, position: 'relative' }}>
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
      
      {/* Debug button - TEMPORARY */}
      <Box sx={{ position: 'fixed', bottom: 100, right: 20, zIndex: 9999 }}>
        <button 
          onClick={() => {
            console.log('🚨 DEBUG BUTTON CLICKED');
            setShowCenterSelector(true);
          }}
          style={{ 
            padding: '10px 20px', 
            background: 'red', 
            color: 'white', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          DEBUG: Open Modal
        </button>
      </Box>
    </Box>
  );
};

export default Layout;