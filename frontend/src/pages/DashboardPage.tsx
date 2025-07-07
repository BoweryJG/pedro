import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Container, Button, Dialog } from '@mui/material';
// Removed framer-motion for better performance
import DentalDashboard from '../components/dashboard/DentalDashboard';
import DailySchedule from '../components/dashboard/Schedule/DailySchedule';
import WeeklyOverview from '../components/dashboard/Schedule/WeeklyOverview';
import StaffScheduler from '../components/dashboard/Schedule/StaffScheduler';
import ProfessionalGaugeCluster from '../components/analytics/ProfessionalGaugeCluster';
import TMJDashboard from '../components/dashboard/subdomains/TMJDashboard';
import ImplantsDashboard from '../components/dashboard/subdomains/ImplantsDashboard';
import RoboticDashboard from '../components/dashboard/subdomains/RoboticDashboard';
import MedSpaDashboard from '../components/dashboard/subdomains/MedSpaDashboard';
import { VoiceCallsDashboard } from '../components/VoiceCallsDashboard';
import { VoiceCallDebug } from '../components/VoiceCallDebug';
import VoiceAISettings from '../components/dashboard/VoiceAISettings';
import PhoneNumberManager from '../components/dashboard/PhoneNumberManager';
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
          {children}
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
    // Only initialize analytics when Analytics tab is active
    if (tabValue === 4) { // Analytics tab index
      const analyticsService = new AnalyticsService(practiceId);
      setAnalytics(analyticsService);
      analyticsService.startRealtimeTracking();
      
      return () => {
        analyticsService.cleanup();
      };
    }
  }, [practiceId, tabValue]);

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
        <div>
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
        </div>

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
            <Tab label="Voice Calls" />
            <Tab label="Voice AI Settings" />
            <Tab label="Phone Numbers" />
            <Tab label="Subdomains" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', py: 4 }}>
            {/* Services Gauge */}
            <ProfessionalGaugeCluster
              title="SERVICES"
              mainValue={20}
              mainLabel="Total Services"
              mainMax={50}
              subdials={[
                {
                  position: 'left',
                  label: 'YOMI Procedures',
                  value: 4,
                  min: 0,
                  max: 10,
                  unit: 'procedures',
                  type: 'number',
                  color: '#00bcd4'
                },
                {
                  position: 'right',
                  label: 'Avg Duration',
                  value: 45,
                  min: 0,
                  max: 120,
                  unit: 'minutes',
                  type: 'duration',
                  color: '#4fc3f7',
                  secondaryLabel: '+15% Group Trend'
                },
                {
                  position: 'bottom',
                  label: 'Revenue/Week',
                  value: 458,
                  min: 0,
                  max: 1000,
                  unit: 'USD',
                  type: 'currency',
                  color: '#66bb6a'
                }
              ]}
              bottomDisplay="Dental Bridge"
            />
            
            {/* Patients Gauge */}
            <ProfessionalGaugeCluster
              title="PATIENTS"
              mainValue={21}
              mainLabel="Total Active Patients"
              mainMax={50}
              subdials={[
                {
                  position: 'left',
                  label: 'New This Month',
                  value: 24,
                  min: 0,
                  max: 50,
                  unit: 'patients',
                  type: 'number',
                  color: '#29b6f6'
                },
                {
                  position: 'right',
                  label: 'Avg Wait Time',
                  value: 96,
                  min: 0,
                  max: 180,
                  unit: 'minutes',
                  type: 'duration',
                  color: '#ffa726',
                  secondaryLabel: '30m Late'
                },
                {
                  position: 'bottom',
                  label: 'Growth Rate',
                  value: 10,
                  min: -20,
                  max: 20,
                  unit: 'percent',
                  type: 'percentage',
                  color: '#66bb6a'
                }
              ]}
              personName="Jason Golden"
              bottomDisplay="10% Up"
            />
          </Box>
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
          {analytics && <DentalDashboard />}
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <VoiceCallDebug />
          <VoiceCallsDashboard />
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          <VoiceAISettings />
        </TabPanel>

        <TabPanel value={tabValue} index={7}>
          <PhoneNumberManager />
        </TabPanel>

        <TabPanel value={tabValue} index={8}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {['TMJ', 'Implants', 'Robotic', 'MedSpa'].map((subdomain) => (
              <Box
                key={subdomain}
                onClick={() => openSubdomainDashboard(subdomain)}
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  p: 4,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  position: 'relative',
                  zIndex: 10,
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
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