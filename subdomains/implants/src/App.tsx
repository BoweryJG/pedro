import React from 'react'
import { Container, Box } from '@mui/material'
import ImplantHero from './components/ImplantHero'
import ImplantFinancingWizard from './components/ImplantFinancingWizard'
import ImplantCostCalculator from './components/ImplantCostCalculator'
import ImplantChatbot from './components/ImplantChatbot'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth={false} disableGutters>
        <ImplantHero />
        <ImplantFinancingWizard />
        <ImplantCostCalculator />
        <ImplantChatbot />
      </Container>
    </Box>
  )
}

export default App