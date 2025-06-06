import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import YomiPage from './pages/YomiPage';
import TMJPage from './pages/TMJPage';
import EmfacePage from './pages/EmfacePage';
import ContactPage from './pages/ContactPage';
import SmileSimulatorPage from './pages/SmileSimulatorPage';
import { EnhancedChatbot } from './chatbot/components/EnhancedChatbot';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="yomi-robotic-surgery" element={<YomiPage />} />
          <Route path="tmj-treatment" element={<TMJPage />} />
          <Route path="emface-mfa" element={<EmfacePage />} />
          <Route path="smile-simulator" element={<SmileSimulatorPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
      <EnhancedChatbot />
    </>
  );
}

export default App;
