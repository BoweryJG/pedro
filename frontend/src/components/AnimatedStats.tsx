import { Box, Typography, Stack } from '@mui/material';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedIcon from '@mui/icons-material/Verified';
import TimerIcon from '@mui/icons-material/Timer';
import GroupIcon from '@mui/icons-material/Group';

const AnimatedStats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      value: 5847,
      suffix: '+',
      label: 'Happy Patients',
      duration: 2.5,
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
      value: 99.8,
      suffix: '%',
      label: 'Success Rate',
      decimals: 1,
      duration: 2,
    },
    {
      icon: <TimerIcon sx={{ fontSize: 40 }} />,
      value: 50,
      suffix: '%',
      label: 'Faster Healing',
      duration: 1.5,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      value: 1,
      suffix: '',
      prefix: '#',
      label: 'In Staten Island',
      duration: 1,
    },
  ];

  return (
    <Box ref={ref} sx={{ py: 4 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={4}
        justifyContent="center"
        alignItems="center"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                minWidth: 140,
                p: 2,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Box sx={{ color: 'white', mb: 1, opacity: 0.8 }}>
                {stat.icon}
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: 'white' }}>
                {inView && (
                  <>
                    {stat.prefix}
                    <CountUp
                      end={stat.value}
                      duration={stat.duration}
                      decimals={stat.decimals}
                      separator=","
                    />
                    {stat.suffix}
                  </>
                )}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                {stat.label}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default AnimatedStats;