import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {/* Chat with Julie - Now the main focus */}
            <Box sx={{ width: { xs: '100%', md: '66.667%' }, px: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <Card 
                  sx={{ 
                    background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.5), rgba(255, 255, 255, 0.9))',
                    border: '1px solid rgba(129, 230, 217, 0.2)',
                    boxShadow: '0 10px 40px rgba(129, 230, 217, 0.1)',
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 6 } }}>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                      >
                        <Box sx={{ fontSize: '5rem', mb: 3 }}>👩‍⚕️</Box>
                      </motion.div>
                      <Typography variant="h3" fontWeight={700} gutterBottom>
                        Chat with Julie
                      </Typography>
                      <Typography
                        variant="h5"
                        color="text.secondary"
                        paragraph
                        sx={{ fontWeight: 300 }}
                      >
                        Your Personal Dental Care Assistant
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{ maxWidth: 600, mx: 'auto', mb: 4, lineHeight: 1.8 }}
                      >
                        Skip the forms and phone calls! Julie can help you schedule appointments, 
                        verify insurance coverage, explore financing options, and answer any questions 
                        about our services - all through a simple conversation.
                      </Typography>
                      
                      <Stack spacing={3} sx={{ maxWidth: 500, mx: 'auto' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            onClick={toggleChat}
                            sx={{ 
                              py: 2.5,
                              px: 6,
                              fontSize: '1.25rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: 3,
                              boxShadow: '0 4px 20px rgba(118, 75, 162, 0.3)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 30px rgba(118, 75, 162, 0.4)',
                              },
                            }}
                          >
                            Start Chatting with Julie
                          </Button>
                        </motion.div>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
                          Available 24/7 • Instant responses • No waiting
                        </Typography>
                      </Stack>
                      
                      <Box sx={{ mt: 6, p: 4, bgcolor: 'rgba(129, 230, 217, 0.05)', borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                          How Julie Can Help You:
                        </Typography>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                          gap: 2 
                        }}>
                          {[
                            { icon: '📅', title: 'Book Appointments', desc: 'Find the perfect time slot' },
                            { icon: '💰', title: 'Financing Options', desc: 'Explore payment plans' },
                            { icon: '🦷', title: 'Treatment Info', desc: 'Learn about procedures' },
                            { icon: '📋', title: 'Insurance Check', desc: 'Verify your coverage' },
                            { icon: '❌', title: 'Cancellations', desc: 'Reschedule easily' },
                            { icon: '🚨', title: 'Emergency Care', desc: 'Get immediate help' }
                          ].map((item) => (
                            <Box key={item.title} sx={{ textAlign: 'left', p: 2, bgcolor: 'white', borderRadius: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{ fontSize: '1.5rem' }}>{item.icon}</Typography>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {item.title}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {item.desc}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
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
                      <ListItem 
                        disableGutters
                        button
                        onClick={toggleChat}
                        sx={{ 
                          borderRadius: 1,
                          '&:hover': { 
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <ListItemIcon>
                          <PhoneIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Phone"
                          secondary="Chat with Julie for immediate assistance"
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

                  <Paper 
                    sx={{ 
                      p: 3, 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' }
                    }}
                    onClick={toggleChat}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 40, mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Emergency Appointments Available
                    </Typography>
                    <Typography variant="body2">
                      We understand dental emergencies can't wait. 
                      Chat with Julie now for immediate assistance and same-day appointments.
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