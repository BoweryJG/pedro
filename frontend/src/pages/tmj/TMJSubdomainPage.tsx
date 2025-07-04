import { Box, Container } from '@mui/material'
import { motion } from 'framer-motion'
import TMJHero from '../../components/subdomain-components/tmj/TMJHero'
import TMJSymptomAssessment from '../../components/subdomain-components/tmj/TMJSymptomAssessment'
import TMJTreatmentTimeline from '../../components/subdomain-components/tmj/TMJTreatmentTimeline'
import TMJChatbot from '../../components/subdomain-components/tmj/TMJChatbot'
import Chatbot from '../../chatbot/components/Chatbot'
import tmjContent from '../../data/subdomain-content/tmj/tmjContent.json'

function TMJSubdomainPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <TMJHero content={tmjContent.hero} doctor={tmjContent.doctor} />
      
      {/* Symptom Assessment Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <TMJSymptomAssessment symptoms={tmjContent.symptoms} />
        </motion.div>
      </Container>

      {/* Treatment Timeline Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <TMJTreatmentTimeline 
              timeline={tmjContent.treatmentTimeline}
              treatments={tmjContent.treatments}
            />
          </motion.div>
        </Container>
      </Box>

      {/* Floating Chatbot */}
      <TMJChatbot
        contact={tmjContent.contact}
      />

      {/* Julie Chatbot */}
      <Chatbot />
    </Box>
  )
}

export default TMJSubdomainPage