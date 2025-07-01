import { Container } from '@mui/material'
import AboutFaceHero from '../../components/subdomain-components/aboutface/AboutFaceHero'
import FacialTreatmentWizard from '../../components/subdomain-components/aboutface/FacialTreatmentWizard'
import FacialCostCalculator from '../../components/subdomain-components/aboutface/FacialCostCalculator'
import FacialGallery from '../../components/subdomain-components/aboutface/FacialGallery'
import AboutFaceChatbot from '../../components/subdomain-components/aboutface/AboutFaceChatbot'

function AboutFaceSubdomainPage() {
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

export default AboutFaceSubdomainPage