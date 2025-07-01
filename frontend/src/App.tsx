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
import InstagramDashboard from './components/InstagramDashboard';
import { Chatbot } from './chatbot/components/Chatbot';
import LuxurySystemStatus from './components/LuxurySystemStatus';
import { ChatFirstContactWidget } from './components/ChatFirstContactWidget';
import { MobileChatOptimized } from './components/MobileChatOptimized';
import ScrollToTop from './components/ScrollToTop';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

// Subdomain Pages
import TMJSubdomainPage from './pages/tmj/TMJSubdomainPage';
import ImplantsSubdomainPage from './pages/implants/ImplantsSubdomainPage';
import RoboticSubdomainPage from './pages/robotic/RoboticSubdomainPage';
import MedSpaSubdomainPage from './pages/medspa/MedSpaSubdomainPage';
import AboutFaceSubdomainPage from './pages/aboutface/AboutFaceSubdomainPage';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <ScrollToTop />
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
          <Route path="instagram-dashboard" element={<InstagramDashboard />} />
          
          {/* Subdomain Routes */}
          <Route path="tmj/*" element={<TMJSubdomainPage />} />
          <Route path="implants/*" element={<ImplantsSubdomainPage />} />
          <Route path="robotic/*" element={<RoboticSubdomainPage />} />
          <Route path="medspa/*" element={<MedSpaSubdomainPage />} />
          <Route path="aboutface/*" element={<AboutFaceSubdomainPage />} />
        </Route>
      </Routes>
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
      {isMobile ? (
        <MobileChatOptimized onChatOpen={() => setChatOpen(true)} />
      ) : (
        <ChatFirstContactWidget onChatOpen={() => setChatOpen(true)} />
      )}
      <LuxurySystemStatus />
      {/* Luxury noise texture overlay */}
      <div className="noise-overlay" />
    </>
  );
}

export default App;
