import { Container, Box } from '@mui/material'
import ImplantHero from '../../components/subdomain-components/implants/ImplantHero'
import ImplantFinancingWizard from '../../components/subdomain-components/implants/ImplantFinancingWizard'
import ImplantCostCalculator from '../../components/subdomain-components/implants/ImplantCostCalculator'
import ImplantChatbot from '../../components/subdomain-components/implants/ImplantChatbot'

function ImplantsSubdomainPage() {
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

export default ImplantsSubdomainPage