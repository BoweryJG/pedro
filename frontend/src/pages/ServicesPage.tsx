import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { usePageTitle } from '../hooks/usePageTitle';

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
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ServicesPage = () => {
  usePageTitle('Our Services');
  
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const serviceCategories: Array<{
    title: string;
    icon: React.ReactElement;
    services: Array<{
      name: string;
      description: string;
      features: string[];
      path?: string;
    }>;
  }> = [
    {
      title: 'Advanced Procedures',
      icon: <PrecisionManufacturingIcon />,
      services: [
        {
          name: 'Yomi Robotic Surgery',
          description: 'FDA-cleared robotic dental implant system',
          features: ['50% faster healing', 'Computer-guided precision', 'Minimally invasive'],
          path: '/yomi-robotic-surgery',
        },
        {
          name: 'TMJ Treatment',
          description: 'Comprehensive jaw disorder treatment',
          features: ['Custom oral appliances', 'Physical therapy', 'Pain management'],
          path: '/tmj-treatment',
        },
        {
          name: 'EMFACE by BTL',
          description: 'Non-invasive facial rejuvenation',
          features: ['20-minute sessions', 'No needles', 'Immediate results'],
          path: '/emface-mfa',
        },
      ],
    },
    {
      title: 'General Dentistry',
      icon: <CleaningServicesIcon />,
      services: [
        {
          name: 'Preventive Care',
          description: 'Maintain optimal oral health',
          features: ['Professional cleanings', 'Oral cancer screenings', 'Digital X-rays'],
        },
        {
          name: 'Restorative Dentistry',
          description: 'Repair and restore your smile',
          features: ['Tooth-colored fillings', 'Crowns & bridges', 'Root canal therapy'],
        },
        {
          name: 'Periodontal Care',
          description: 'Gum disease treatment',
          features: ['Deep cleanings', 'Gum grafting', 'Maintenance therapy'],
        },
      ],
    },
    {
      title: 'Cosmetic Dentistry',
      icon: <AutoAwesomeIcon />,
      services: [
        {
          name: 'Teeth Whitening',
          description: 'Professional whitening solutions',
          features: ['In-office treatment', 'Custom take-home trays', 'Long-lasting results'],
        },
        {
          name: 'Veneers',
          description: 'Transform your smile',
          features: ['Porcelain veneers', 'Minimal prep options', 'Natural appearance'],
        },
        {
          name: 'Smile Makeovers',
          description: 'Complete smile transformation',
          features: ['Personalized treatment plans', 'Multiple procedures', 'Dramatic results'],
        },
        {
          name: 'AI Smile Simulator',
          description: 'Visualize your perfect smile with AI',
          features: ['Instant transformations', 'AI-powered analysis', 'HIPAA compliant'],
          path: '/smile-simulator',
        },
      ],
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 800,
              mb: 3,
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}
          >
            From cutting-edge robotic surgery to comprehensive general dentistry, 
            we offer the full spectrum of dental care under one roof.
          </Typography>
        </Container>
      </Box>

      {/* Services Tabs Section */}
      <Box sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {serviceCategories.map((category, index) => (
                <Tab
                  key={index}
                  label={category.title}
                  icon={category.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>

          {serviceCategories.map((category, categoryIndex) => (
            <TabPanel key={categoryIndex} value={tabValue} index={categoryIndex}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {category.services.map((service, serviceIndex) => (
                  <Box sx={{ flex: '1 1 100%', maxWidth: { md: '33.333%' } }} key={serviceIndex}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
                    >
                      <Card
                        sx={{
                          height: '100%',
                          cursor: service.path ? 'pointer' : 'default',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => service.path && navigate(service.path)}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h5" fontWeight={600} gutterBottom>
                            {service.name}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            paragraph
                          >
                            {service.description}
                          </Typography>
                          <List dense>
                            {service.features.map((feature, i) => (
                              <ListItem key={i} disableGutters>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircleIcon
                                    fontSize="small"
                                    color="primary"
                                  />
                                </ListItemIcon>
                                <ListItemText primary={feature} />
                              </ListItem>
                            ))}
                          </List>
                          {service.path && (
                            <Button
                              variant="text"
                              color="primary"
                              sx={{ mt: 2 }}
                            >
                              Learn More →
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Box>
                ))}
              </Box>
            </TabPanel>
          ))}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: 'grey.100',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Not Sure Which Service You Need?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Schedule a consultation and we'll create a personalized treatment plan for you.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/contact')}
            sx={{ mt: 2 }}
          >
            Schedule Consultation
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default ServicesPage;