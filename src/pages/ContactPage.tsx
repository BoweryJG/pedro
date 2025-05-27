import {
  Box,
  Container,
  Typography,
  Grid,
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

const ContactPage = () => {
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
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
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
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Preferred Date"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Additional Message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            multiline
                            rows={4}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{ py: 1.5 }}
                          >
                            Request Appointment
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={5}>
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
                          secondary="(718) 555-0123"
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <EmailIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Email"
                          secondary="info@edwardspedrodental.com"
                        />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <LocationOnIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary="123 Advanced Dental Plaza, Staten Island, NY 10301"
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
                        <ListItemText primary="Monday - Friday: 9:00 AM - 6:00 PM" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Saturday: 9:00 AM - 2:00 PM" />
                      </ListItem>
                      <ListItem disableGutters>
                        <ListItemIcon>
                          <AccessTimeIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Sunday: Closed" />
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
            </Grid>
          </Grid>
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