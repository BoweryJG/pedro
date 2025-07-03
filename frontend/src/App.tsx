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
import TestBooking from './pages/TestBooking';
import { Chatbot } from './chatbot/components/Chatbot';
import LuxurySystemStatus from './components/LuxurySystemStatus';
import { ChatFirstContactWidget } from './components/ChatFirstContactWidget';
import { MobileChatOptimized } from './components/MobileChatOptimized';
import ScrollToTop from './components/ScrollToTop';
import { useMediaQuery, useTheme } from '@mui/material';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleAnalytics } from './components/GoogleAnalytics';
import DirectAccessPage from './pages/auth/DirectAccessPage';
import { useChatStore } from './chatbot/store/chatStore';

// Subdomain Pages
import TMJSubdomainPage from './pages/tmj/TMJSubdomainPage';
import ImplantsSubdomainPage from './pages/implants/ImplantsSubdomainPage';
import RoboticSubdomainPage from './pages/robotic/RoboticSubdomainPage';
import MedSpaSubdomainPage from './pages/medspa/MedSpaSubdomainPage';
import AboutFaceSubdomainPage from './pages/aboutface/AboutFaceSubdomainPage';
import SMSQueue from './pages/admin/SMSQueue';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const chatStore = useChatStore();

  const handleOpenChat = () => {
    if (!chatStore.isOpen) {
      chatStore.toggleChat();
    }
  };

  const handleCloseChat = () => {
    if (chatStore.isOpen) {
      chatStore.toggleChat();
    }
  };

  return (
    <AuthProvider>
      <GoogleAnalytics />
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
          <Route path="booking" element={<TestBooking />} />
          
          {/* Subdomain Routes */}
          <Route path="tmj/*" element={<TMJSubdomainPage />} />
          <Route path="implants/*" element={<ImplantsSubdomainPage />} />
          <Route path="robotic/*" element={<RoboticSubdomainPage />} />
          <Route path="medspa/*" element={<MedSpaSubdomainPage />} />
          <Route path="aboutface/*" element={<AboutFaceSubdomainPage />} />
        </Route>
        
        {/* Protected Dashboard Routes */}
        <Route path="/dr-pedro/login" element={<LoginPage />} />
        <Route path="/dr-pedro/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/dr-pedro/direct-access" element={<DirectAccessPage />} />
        <Route
          path="/dr-pedro/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dr-pedro/sms"
          element={
            <ProtectedRoute>
              <SMSQueue />
            </ProtectedRoute>
          }
        />
      </Routes>
      {chatStore.isOpen && <Chatbot onClose={handleCloseChat} />}
      {isMobile ? (
        <MobileChatOptimized onChatOpen={handleOpenChat} />
      ) : (
        <ChatFirstContactWidget onChatOpen={handleOpenChat} />
      )}
      <LuxurySystemStatus />
      {/* Luxury noise texture overlay */}
      <div className="noise-overlay" />
    </AuthProvider>
  );
}

export default App;
