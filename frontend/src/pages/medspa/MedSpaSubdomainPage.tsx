import { Box, Container } from '@mui/material'
import { motion } from 'framer-motion'
import MedSpaHero from '../../components/subdomain-components/medspa/MedSpaHero'
import TreatmentCombinationWizard from '../../components/subdomain-components/medspa/TreatmentCombinationWizard'
import MedSpaCostCalculator from '../../components/subdomain-components/medspa/MedSpaCostCalculator'
import AestheticGallery from '../../components/subdomain-components/medspa/AestheticGallery'
import MedSpaChatbot from '../../components/subdomain-components/medspa/MedSpaChatbot'
import medspaContent from '../../data/subdomain-content/medspa/medspaContent.json'

function MedSpaSubdomainPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <MedSpaHero content={medspaContent.hero} doctor={medspaContent.doctor} />
      
      {/* Treatment Combination Wizard Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <TreatmentCombinationWizard 
            treatments={medspaContent.treatments}
            packages={medspaContent.packages}
          />
        </motion.div>
      </Container>

      {/* Aesthetic Gallery Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <AestheticGallery 
              treatments={medspaContent.treatments}
              testimonials={medspaContent.testimonials}
            />
          </motion.div>
        </Container>
      </Box>

      {/* Cost Calculator Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <MedSpaCostCalculator 
            treatments={medspaContent.treatments}
            financing={medspaContent.financing}
          />
        </motion.div>
      </Container>

      {/* Floating Chatbot */}
      <MedSpaChatbot
        contact={medspaContent.contact}
      />
    </Box>
  )
}

export default MedSpaSubdomainPage