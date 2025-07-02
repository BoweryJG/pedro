import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Container, Button, Dialog } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DentalDashboard from '../components/dashboard/DentalDashboard';
import DailySchedule from '../components/dashboard/Schedule/DailySchedule';
import WeeklyOverview from '../components/dashboard/Schedule/WeeklyOverview';
import StaffScheduler from '../components/dashboard/Schedule/StaffScheduler';
import WatchSubdialMetrics from '../services/analytics/WatchSubdialMetrics';
import TMJDashboard from '../components/dashboard/subdomains/TMJDashboard';
import ImplantsDashboard from '../components/dashboard/subdomains/ImplantsDashboard';
import RoboticDashboard from '../components/dashboard/subdomains/RoboticDashboard';
import MedSpaDashboard from '../components/dashboard/subdomains/MedSpaDashboard';
import { useSupabase } from '../hooks/useSupabase';
import { AnalyticsService } from '../services/analytics/analyticsService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      )}
    </div>
  );
}

const DashboardPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [subdomainOpen, setSubdomainOpen] = useState(false);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string>('');
  const { supabase } = useSupabase();
  const [analytics, setAnalytics] = useState<AnalyticsService | null>(null);
  const [practiceId] = useState('tsmtaarwgodklafqlbhm'); // Dr. Pedro's practice ID

  useEffect(() => {
    // Initialize analytics service
    const analyticsService = new AnalyticsService(practiceId);
    setAnalytics(analyticsService);

    // Start real-time tracking
    analyticsService.startRealtimeTracking();

    return () => {
      // Cleanup subscriptions
      analyticsService.cleanup();
    };
  }, [practiceId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const openSubdomainDashboard = (subdomain: string) => {
    setSelectedSubdomain(subdomain);
    setSubdomainOpen(true);
  };

  const closeSubdomainDashboard = () => {
    setSubdomainOpen(false);
    setSelectedSubdomain('');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        pt: { xs: 10, md: 12 },
        pb: 4,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 800,
              mb: 1,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ffffff 30%, #e1bee7 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dr. Pedro's Practice Command Center
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Luxury Analytics • Real-Time Insights • Precision Management
          </Typography>
        </motion.div>

        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.1)', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="dashboard tabs"
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 600,
                fontSize: '1rem',
                minHeight: 64,
                '&.Mui-selected': {
                  color: '#22c55e',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#22c55e',
                height: 3,
              },
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Watch Dashboard" />
            <Tab label="Daily Schedule" />
            <Tab label="Week Overview" />
            <Tab label="Staff Schedule" />
            <Tab label="Analytics" />
            <Tab label="Subdomains" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <DentalDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <DailySchedule />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <WeeklyOverview />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <StaffScheduler />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          {analytics && <WatchSubdialMetrics analytics={analytics} />}
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {['TMJ', 'Implants', 'Robotic', 'MedSpa'].map((subdomain) => (
              <motion.div
                key={subdomain}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Box
                  onClick={() => openSubdomainDashboard(subdomain)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 4,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      color: 'white',
                      mb: 2,
                      fontWeight: 700,
                    }}
                  >
                    {subdomain}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    View detailed analytics and metrics
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </TabPanel>

        {/* Subdomain Dashboard Dialog */}
        <Dialog
          open={subdomainOpen}
          onClose={closeSubdomainDashboard}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Button
              onClick={closeSubdomainDashboard}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: 'white',
              }}
            >
              Close
            </Button>
            {selectedSubdomain === 'TMJ' && <TMJDashboard />}
            {selectedSubdomain === 'Implants' && <ImplantsDashboard />}
            {selectedSubdomain === 'Robotic' && <RoboticDashboard />}
            {selectedSubdomain === 'MedSpa' && <MedSpaDashboard />}
          </Box>
        </Dialog>
      </Container>
    </Box>
  );
};

export default DashboardPage;