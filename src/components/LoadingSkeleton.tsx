import { Box, Skeleton, Stack, Container } from '@mui/material';

export const HeroSkeleton = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'grey.100' }}>
    <Container maxWidth="lg">
      <Stack spacing={3} alignItems="center">
        <Skeleton variant="rounded" width={200} height={40} />
        <Skeleton variant="text" sx={{ fontSize: '4rem', width: '80%' }} />
        <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '60%' }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="rounded" width={180} height={50} />
          <Skeleton variant="rounded" width={180} height={50} />
        </Stack>
        <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={140} height={120} />
          ))}
        </Stack>
      </Stack>
    </Container>
  </Box>
);

export const ServiceCardSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Stack spacing={2} alignItems="center">
      <Skeleton variant="circular" width={60} height={60} />
      <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '80%' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
      <Skeleton variant="rounded" width={120} height={36} sx={{ mt: 2 }} />
    </Stack>
  </Box>
);

export const TestimonialSkeleton = () => (
  <Box sx={{ p: 3 }}>
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={56} height={56} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" sx={{ fontSize: '1.2rem', width: '60%' }} />
          <Skeleton variant="text" sx={{ fontSize: '0.8rem', width: '40%' }} />
        </Box>
      </Box>
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
      <Skeleton variant="text" sx={{ fontSize: '1rem', width: '80%' }} />
    </Stack>
  </Box>
);

export const PageLoadingSkeleton = () => (
  <Box>
    <HeroSkeleton />
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={8}>
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '3rem', width: '40%', mx: 'auto', mb: 4 }} />
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ flex: '1 1 300px' }}>
                <ServiceCardSkeleton />
              </Box>
            ))}
          </Box>
        </Box>
        <Box>
          <Skeleton variant="text" sx={{ fontSize: '3rem', width: '40%', mx: 'auto', mb: 4 }} />
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ flex: '1 1 300px' }}>
                <TestimonialSkeleton />
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </Container>
  </Box>
);