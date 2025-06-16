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
import BackendStatus from './components/BackendStatus';
import { ChatFirstContactWidget } from './components/ChatFirstContactWidget';
import { MobileChatOptimized } from './components/MobileChatOptimized';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Route path="instagram-dashboard" element={<InstagramDashboard />} />
        </Route>
      </Routes>
      {chatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
      {isMobile ? (
        <MobileChatOptimized onChatOpen={() => setChatOpen(true)} />
      ) : (
        <ChatFirstContactWidget onChatOpen={() => setChatOpen(true)} />
      )}
      <BackendStatus />
    </>
  );
}

export default App;
