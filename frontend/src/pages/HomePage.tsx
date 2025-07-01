import LuxuryCareConciergeHero from '../components/LuxuryCareConciergeHero';
import { Box } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  
  return (
    <Box>
      <LuxuryCareConciergeHero />
      {/* Additional homepage sections can be added here */}
    </Box>
  );
};

export default HomePage;