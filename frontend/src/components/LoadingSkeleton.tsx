import { Box, Skeleton, Container } from '@mui/material';

const LoadingSkeleton = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Hero skeleton */}
        <Skeleton variant="rectangular" height={500} sx={{ mb: 4, borderRadius: 2 }} />
        
        {/* Stats skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={150} sx={{ flex: 1, borderRadius: 2 }} />
          ))}
        </Box>
        
        {/* Services skeleton */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LoadingSkeleton;