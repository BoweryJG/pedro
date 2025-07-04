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
      <TexturedSection textures={['diagonal', 'grain']} sx={{ className: 'luxury-section' }}>
        <MeetDrPedroSection />
      </TexturedSection>
      
      {/* Services Section with Alternating Background */}
      <TexturedSection textures={['dots', 'radial']} sx={{ className: 'luxury-section-alt' }}>
        <LuxuryServicesShowcase />
      </TexturedSection>
      
      {/* Stats Section with Dark Background */}
      <TexturedSection textures={['crosshatch', 'grain']} sx={{ className: 'luxury-section-dark' }}>
        <LuxuryStatsSection />
      </TexturedSection>
      
      {/* Trust Indicators with Normal Background */}
      <TexturedSection textures={['grid', 'grain']} sx={{ className: 'luxury-section' }}>
        <LuxuryTrustIndicators />
      </TexturedSection>
      
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