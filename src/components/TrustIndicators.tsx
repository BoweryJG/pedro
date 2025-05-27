import { Box, Typography, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';

const TrustIndicators = () => {
  const certifications = [
    { icon: <VerifiedUserIcon />, text: 'FDA Approved Yomi System' },
    { icon: <LocalHospitalIcon />, text: 'Board Certified Doctors' },
    { icon: <EmojiEventsIcon />, text: 'Excellence Award 2024' },
    { icon: <StarIcon />, text: '5.0 Google Rating' },
  ];

  const insuranceLogos = [
    'Delta Dental',
    'Aetna',
    'Cigna',
    'MetLife',
    'Guardian',
    'United Healthcare',
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {/* Certifications */}
      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        justifyContent="center"
        sx={{ mb: 3 }}
      >
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Chip
              icon={cert.icon}
              label={cert.text}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          </motion.div>
        ))}
      </Stack>

      {/* Insurance Providers */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{ color: 'white', opacity: 0.8, mb: 2 }}
        >
          Accepting Most Insurance Plans Including:
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          flexWrap="wrap"
          justifyContent="center"
          sx={{
            '& > div': {
              px: 2,
              py: 1,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1,
              minWidth: 100,
              textAlign: 'center',
            },
          }}
        >
          {insuranceLogos.map((insurance, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
            >
              <Typography variant="caption" fontWeight={600}>
                {insurance}
              </Typography>
            </motion.div>
          ))}
        </Stack>
      </Box>

      {/* As Featured In */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{ color: 'white', opacity: 0.8, mb: 2 }}
        >
          As Featured In:
        </Typography>
        <Stack
          direction="row"
          spacing={3}
          justifyContent="center"
          sx={{ opacity: 0.7 }}
        >
          {['Staten Island Advance', 'NY1', 'News 12', 'Dental Tribune'].map(
            (media, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: 'white', fontStyle: 'italic' }}
                >
                  {media}
                </Typography>
              </motion.div>
            )
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default TrustIndicators;