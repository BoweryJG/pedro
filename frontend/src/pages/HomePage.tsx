import CareConciergeHero from '../components/CareConciergeHero';
import { Box } from '@mui/material';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  
  return (
    <Box>
      <CareConciergeHero />
      {/* Additional homepage sections can be added here */}
    </Box>
  );
};

export default HomePage;