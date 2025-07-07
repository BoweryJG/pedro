// import ImageFocusedHero from '../components/ImageFocusedHero';
import CenterCarouselHero from '../components/CenterCarouselHero';
import LuxuryServicesShowcase from '../components/LuxuryServicesShowcase';
import LuxuryStatsSection from '../components/LuxuryStatsSection';
import LuxuryTrustIndicators from '../components/LuxuryTrustIndicators';
import LuxuryGoogleReviews from '../components/LuxuryGoogleReviews';
import MeetDrPedroSection from '../components/MeetDrPedroSection';
import { Box } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';
import { TexturedSection } from '../components/effects/TextureOverlays';

const HomePage = () => {
  usePageTitle('Home');
  
  return (
    <Box sx={{ backgroundColor: 'var(--luxury-warm-white)' }}>
      {/* Main Carousel Hero Section */}
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
        <CenterCarouselHero />
      </Box>
      
      {/* Meet Dr. Pedro Section */}
      <Box className="luxury-section">
        <MeetDrPedroSection />
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