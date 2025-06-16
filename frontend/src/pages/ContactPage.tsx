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

const ContactPage = () => {
  usePageTitle('Contact Us');
  
  const [formRef, formInView] = useInView({ triggerOnce: true });
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
            {/* Contact Form */}
            <Box sx={{ width: { xs: '100%', md: '58.333%' }, px: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={formInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight={600} gutterBottom>
                      Schedule Your Appointment
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Fill out the form below and we'll contact you within 24 hours.
                    </Typography>

                    <Box
                      component="form"
                      onSubmit={handleSubmit}
                      sx={{ mt: 3 }}
                    >
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            select
                            label="Service Interested In"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            required
                          >
                            {services.map((service) => (
                              <MenuItem key={service} value={service}>
                                {service}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            label="Preferred Date"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                        <Box sx={{ width: { xs: '100%', sm: '50%' }, px: 1.5 }}>
                          <TextField
                            fullWidth
                            select
                            label="Preferred Time"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleChange}
                          >
                            {timeSlots.map((time) => (
                              <MenuItem key={time} value={time}>
                                {time}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Box>
                        <Box sx={{ width: '100%', px: 1.5 }}>
                          <TextField
                            fullWidth
                            label="Additional Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            multiline
                            rows={4}
                          />
                        </Box>
                        <Box sx={{ width: '100%', px: 1.5 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ py: 1.5 }}
                          >
                            Request Appointment
                          </Button>
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