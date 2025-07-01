import { useEffect } from 'react'
import { Box, Container } from '@mui/material'
import { motion } from 'framer-motion'
import TMJHero from './components/TMJHero'
import TMJSymptomAssessment from './components/TMJSymptomAssessment'
import TMJTreatmentTimeline from './components/TMJTreatmentTimeline'
import TMJChatbot from './components/TMJChatbot'
import tmjContent from './data/tmjContent.json'

function App() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
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
    </Box>
  )
}

export default App
