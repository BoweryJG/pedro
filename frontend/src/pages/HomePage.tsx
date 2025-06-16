import EnhancedHomePage from '../components/EnhancedHomePage';
import { usePageTitle } from '../hooks/usePageTitle';

const HomePage = () => {
  usePageTitle('Home');
  
  return <EnhancedHomePage />;
};

export default HomePage;