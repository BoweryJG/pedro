import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AboutPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [doctorsRef, doctorsInView] = useInView({ triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true });

  const doctors = [
    {
      name: 'Dr. John Edwards',
      title: 'DDS, General Dentistry',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
      education: ['NYU College of Dentistry', 'Advanced Implant Training'],
      specialties: ['General Dentistry', 'Cosmetic Dentistry', 'Dental Implants'],
      bio: 'With over 15 years of experience, Dr. Edwards is committed to providing comprehensive dental care with a gentle touch.',
    },
    {
      name: 'Dr. Greg Pedro',
      title: 'DDS, Prosthodontist',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80',
      education: ['Columbia University', 'Prosthodontics Residency', 'Yomi Robotic Surgery Certification'],
      specialties: ['Prosthodontics', 'TMJ Treatment', 'Yomi Robotic Surgery', 'EMFACE'],
      bio: 'Staten Island\'s only Yomi-certified surgeon, Dr. Pedro brings cutting-edge technology and expertise to every patient.',
    },
  ];

  const values = [
    {
      icon: <SchoolIcon />,
      title: 'Excellence',
      description: 'Continuous education and adoption of the latest technologies.',
    },
    {
      icon: <FavoriteIcon />,
      title: 'Compassion',
      description: 'Patient-centered care with understanding and empathy.',
    },
    {
      icon: <EmojiEventsIcon />,
      title: 'Innovation',
      description: 'Leading Staten Island with advanced dental solutions.',
    },
    {
      icon: <GroupsIcon />,
      title: 'Partnership',
      description: 'Building lasting relationships with our patients.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              align="center"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 3,
              }}
            >
              Meet Your Dental Team
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}
            >
              Two distinguished doctors, one vision: bringing the most advanced 
              dental care to Staten Island with compassion and excellence.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Doctors Section */}
      <Box ref={doctorsRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {doctors.map((doctor, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={doctorsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          src={doctor.image}
                          sx={{ width: 120, height: 120, mr: 3 }}
                        />
                        <Box>
                          <Typography variant="h4" fontWeight={700}>
                            {doctor.name}
                          </Typography>
                          <Typography variant="h6" color="text.secondary">
                            {doctor.title}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography paragraph sx={{ mb: 3 }}>
                        {doctor.bio}
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Education
                        </Typography>
                        <Stack spacing={1}>
                          {doctor.education.map((edu, i) => (
                            <Typography key={i} variant="body2" color="text.secondary">
                              • {edu}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Specialties
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {doctor.specialties.map((specialty, i) => (
                            <Chip
                              key={i}
                              label={specialty}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Partnership Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              A Powerful Partnership
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
              Dr. Edwards and Dr. Pedro have joined forces to create Staten Island's most 
              advanced dental practice. Combining Dr. Edwards' comprehensive approach to 
              general dentistry with Dr. Pedro's cutting-edge specialties, including the 
              exclusive Yomi robotic surgery system, we offer unparalleled care under one roof.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  35+
                </Typography>
                <Typography variant="h6">Years Combined Experience</Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  5,000+
                </Typography>
                <Typography variant="h6">Happy Patients</Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  #1
                </Typography>
                <Typography variant="h6">Yomi Provider in Staten Island</Typography>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* Values Section */}
      <Box ref={valuesRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, mb: 6 }}
          >
            Our Core Values
          </Typography>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={valuesInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                        '& svg': { fontSize: 48 },
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;