import { Container } from '@mui/material'
import AboutFaceHero from './components/AboutFaceHero'
import FacialTreatmentWizard from './components/FacialTreatmentWizard'
import FacialCostCalculator from './components/FacialCostCalculator'
import FacialGallery from './components/FacialGallery'
import AboutFaceChatbot from './components/AboutFaceChatbot'

function App() {
  return (
    <>
      <Container maxWidth={false} disableGutters>
        <AboutFaceHero />
        <FacialTreatmentWizard />
        <FacialGallery />
        <FacialCostCalculator />
      </Container>
      <AboutFaceChatbot />
    </>
  )
}

export default App
