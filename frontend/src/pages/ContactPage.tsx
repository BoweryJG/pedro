import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { usePageTitle } from '../hooks/usePageTitle';
import { CONTACT_INFO } from '../constants/contact';
import { useChatStore } from '../chatbot/store/chatStore';

const ContactPage = () => {
  usePageTitle('Contact Us');
  
  const [formRef, formInView] = useInView({ triggerOnce: true });
  const toggleChat = useChatStore((state) => state.toggleChat);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
  });

  const services = [
    'Yomi Robotic Surgery Consultation',
    'TMJ Treatment Evaluation',
    'EMFACE Consultation',
    'General Dentistry',
    'Cosmetic Dentistry',
    'Emergency Care',
    'Other',
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
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
            Contact Us
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ maxWidth: 600, mx: 'auto', opacity: 0.9 }}
          >
            Ready to experience the future of dental care? 
            Schedule your consultation today.
          </Typography>
        </Container>
      </Box>

      {/* Contact Form & Info Section */}
      <Box ref={formRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {/* Chat with Julie */}
            <Box sx={{ width: { xs: '100%', md: '58.333%' }, px: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Box sx={{ fontSize: '4rem', mb: 2 }}>👩‍⚕️</Box>
                      <Typography variant="h4" fontWeight={600} gutterBottom>
                        Chat with Julie
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        paragraph
                      >
                        Your Personal Dental Care Assistant
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
                      >
                        Julie can help you schedule appointments, check insurance coverage, 
                        explore financing options, and answer any questions about our services - 
                        all in real-time!
                      </Typography>
                      
                      <Stack spacing={2} sx={{ maxWidth: 400, mx: 'auto' }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={toggleChat}
                          sx={{ 
                            py: 2,
                            fontSize: '1.1rem',
                            background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
                            boxShadow: '0 3px 5px 2px rgba(26, 115, 232, .3)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 10px 2px rgba(26, 115, 232, .3)',
                            },
                          }}
                        >
                          Start Chatting with Julie
                        </Button>
                        
                        <Typography variant="body2" color="text.secondary">
                          Available 24/7 • Instant responses • No waiting
                        </Typography>
                      </Stack>
                      
                      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Julie can help with:
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
                          {[
                            '📅 Booking appointments',
                            '💰 Financing options',
                            '🦷 Treatment questions',
                            '📋 Insurance verification',
                            '❌ Cancellations'
                          ].map((item) => (
                            <Typography key={item} variant="caption" sx={{ p: 1 }}>
                              {item}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Contact Information */}
            <Box sx={{ width: { xs: '100%', md: '41.667%' }, px: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Stack spacing={3}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Get in Touch
                    </Typography>
                    <List>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone"
                          secondary={CONTACT_INFO.phone.display}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary={CONTACT_INFO.emails.suite.info}
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <LocationOnIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={CONTACT_INFO.address.full}
                        />
                      </ListItem>
                    </List>
                  </Paper>

                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      Office Hours
                    </Typography>
                    <List dense>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`Monday - Friday: ${CONTACT_INFO.businessHours.weekdays}`} />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`Saturday: ${CONTACT_INFO.businessHours.saturday}`} />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={`Sunday: ${CONTACT_INFO.businessHours.sunday}`} />
                      </ListItem>
                    </List>
                  </Paper>

                  <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white' }}>
                    <CalendarTodayIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Emergency Appointments Available
                    </Typography>
                    <Typography variant="body2">
                      We understand dental emergencies can't wait. 
                      Call us for same-day emergency appointments.
                    </Typography>
                  </Paper>
                </Stack>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Map Section */}
      <Box sx={{ height: 400, bgcolor: 'grey.200' }}>
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.300',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Interactive Map Coming Soon
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage;