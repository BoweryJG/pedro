import {
  Box,
  Container,
  Typography,
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
import { usePageTitle } from '../hooks/usePageTitle';

const AboutPage = () => {
  usePageTitle('About Dr. Pedro');
  
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [doctorsRef, doctorsInView] = useInView({ triggerOnce: true });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true });

  const doctors = [
    {
      name: 'Dr. Greg Pedro',
      title: 'DMD, Prosthodontist',
      image: '/images/gregpedro.jpg',
      education: ['Fordham University - B.S. General Science', 'Temple University School of Dentistry - DMD (1992)', 'Board-Certified Prosthodontist (1994)', 'Robotic Dental Implant Surgery Certification'],
      specialties: ['Prosthodontics', 'TMJ/TMD Treatment', 'Robotic Dental Implants (YOMI)', 'Complex Full-Mouth Reconstructions', 'Cosmetic Smile Makeovers', 'Advanced Denture Solutions'],
      bio: 'Staten Island Sports Hall of Famer and championship athlete turned pioneering prosthodontist, Dr. Pedro brings 30+ years of excellence to every patient. As the owner of New York Robotic Institute for Dental Implants and founder of About Face Dental & Aesthetic Boutique, he combines cutting-edge technology with hometown values.',
      extendedBio: {
        championship: 'Dr. Pedro\'s journey began as a basketball star at St. Peter\'s Boys High School, where he led the 1982-83 Eagles to Staten Island\'s first and only CHSAA AA Intersectional championship. His athletic excellence earned him full scholarships to both Michigan State and Fordham University.',
        innovation: 'As a pioneer in robotic dental implant surgery, Dr. Pedro utilizes advanced YOMI technology to achieve unprecedented precision. His expertise in TMJ/TMD treatment employs multiple unique modalities, providing relief to patients who have suffered for years with chronic jaw pain.',
        community: 'After building a thriving practice in Pennsylvania for nearly 20 years, Dr. Pedro returned to Staten Island in 2023 with a mission: to give back to the community that shaped him. His state-of-the-art About Face Dental & Aesthetic Boutique represents Staten Island\'s first dental medi-spa, combining comprehensive dental care with aesthetic services.',
        philosophy: 'Dr. Pedro is known for treating even the most anxious patients with exceptional patience and understanding. His practice philosophy centers on creating a comfortable, welcoming environment where patients feel confident in their dental health and smile. "The greatest victories are the ones that transform lives, one smile at a time."'
      }
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
              Meet Dr. Pedro
            </Typography>
            <Typography
              variant="h5"
              align="center"
              sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9 }}
            >
              Bringing the most advanced dental care to Staten Island 
              with compassion, excellence, and cutting-edge technology.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Doctors Section */}
      <Box ref={doctorsRef} sx={{ py: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {doctors.map((doctor, index) => (
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 3 }} key={index}>
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

                      <Typography paragraph sx={{ mb: 3, fontWeight: 500 }}>
                        {doctor.bio}
                      </Typography>

                      {doctor.extendedBio && (
                        <Box sx={{ mb: 4 }}>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              From Championship Courts to Dental Excellence
                            </Typography>
                            <Typography paragraph color="text.secondary">
                              {doctor.extendedBio.championship}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Pioneering Dental Innovation
                            </Typography>
                            <Typography paragraph color="text.secondary">
                              {doctor.extendedBio.innovation}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Giving Back to Staten Island
                            </Typography>
                            <Typography paragraph color="text.secondary">
                              {doctor.extendedBio.community}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom color="primary">
                              Patient-First Philosophy
                            </Typography>
                            <Typography paragraph color="text.secondary">
                              {doctor.extendedBio.philosophy}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Education & Credentials
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
                          Areas of Expertise
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
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Achievement Section */}
      <Box sx={{ py: 10, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              Excellence in Every Smile
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
              From the basketball courts where he earned a place in the Staten Island Sports Hall of Fame 
              to the forefront of robotic dentistry, Dr. Pedro's commitment to excellence has never wavered. 
              Today, he brings world-class prosthodontic care and cutting-edge technology to his hometown, 
              transforming lives one smile at a time.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  30+
                </Typography>
                <Typography variant="h6">Years of Excellence</Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  10,000+
                </Typography>
                <Typography variant="h6">Lives Transformed</Typography>
              </Box>
              <Box>
                <Typography variant="h3" color="primary.main" fontWeight={700}>
                  #1
                </Typography>
                <Typography variant="h6">Robotic Implant Provider in Staten Island</Typography>
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {values.map((value, index) => (
              <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 2 }} key={index}>
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
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;