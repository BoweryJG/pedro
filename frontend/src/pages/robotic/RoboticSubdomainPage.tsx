import { Container, Box } from '@mui/material'
import YomiHero from '../../components/subdomain-components/robotic/YomiHero'
import YomiTechnologyShowcase from '../../components/subdomain-components/robotic/YomiTechnologyShowcase'
import RoboticVsTraditional from '../../components/subdomain-components/robotic/RoboticVsTraditional'
import YomiChatbot from '../../components/subdomain-components/robotic/YomiChatbot'

function RoboticSubdomainPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false} disableGutters>
        <YomiHero />
        <YomiTechnologyShowcase />
        <RoboticVsTraditional />
        <YomiChatbot />
      </Container>
    </Box>
  )
}

export default RoboticSubdomainPage