import React from 'react'
import { Container, Box } from '@mui/material'
import YomiHero from './components/YomiHero'
import YomiTechnologyShowcase from './components/YomiTechnologyShowcase'
import RoboticVsTraditional from './components/RoboticVsTraditional'
import YomiChatbot from './components/YomiChatbot'

function App() {
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

export default App