import React, { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Avatar,
  Rating,
  Chip,
  IconButton,
  Dialog,
  DialogContent
} from '@mui/material'
import { motion } from 'framer-motion'
import { 
  AutoAwesome, 
  Visibility,
  Close,
  Star,
  Face,
  Chat
} from '@mui/icons-material'
import aboutFaceContent from '../../../data/subdomain-content/aboutface/aboutFaceContent.json'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
)

const FacialGallery: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { beforeAfter, testimonials } = aboutFaceContent
  const { toggleChat, sendMessage } = useChatStore()

  const handleChatWithJulie = async () => {
    trackChatOpen('aboutface_gallery')
    trackEvent({
      action: 'gallery_consultation_interest',
      category: 'engagement',
      label: 'transformation_gallery'
    })
    toggleChat()
    setTimeout(() => {
      sendMessage("I'm interested in achieving similar transformation results with EmFace treatments at AboutFace Aesthetics")
    }, 500)
  }

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleImageClick = (image: string) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  return (
    <Box sx={{ py: 8, background: 'linear-gradient(135deg, #F9F7F4 0%, #FEFEFE 100%)' }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={6}>
          <Typography variant="h2" gutterBottom color="primary">
            Facial Transformation Gallery
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            See the beautiful, natural results our patients achieve
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              centered
              sx={{
                '& .MuiTab-root': {
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none'
                }
              }}
            >
              <Tab label="Before & After" icon={<AutoAwesome />} iconPosition="start" />
              <Tab label="Patient Reviews" icon={<Star />} iconPosition="start" />
            </Tabs>
          </Box>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {beforeAfter.map((item, index) => (
              <Grid xs={12} md={4} key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 48px rgba(200, 168, 130, 0.2)'
                      }
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Grid container>
                        <Grid xs={6}>
                          <Box sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={item.before}
                              alt={`${item.treatment} before`}
                              sx={{
                                width: '100%',
                                height: 300,
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleImageClick(item.before)}
                            />
                            <Chip
                              label="Before"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: 'white'
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid xs={6}>
                          <Box sx={{ position: 'relative' }}>
                            <Box
                              component="img"
                              src={item.after}
                              alt={`${item.treatment} after`}
                              sx={{
                                width: '100%',
                                height: 300,
                                objectFit: 'cover',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleImageClick(item.after)}
                            />
                            <Chip
                              label="After"
                              size="small"
                              color="primary"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(200, 168, 130, 0.9)',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(200, 168, 130, 1)',
                            transform: 'translate(-50%, -50%) scale(1.1)'
                          }
                        }}
                        onClick={() => handleImageClick(item.before)}
                      >
                        <Visibility />
                      </IconButton>
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Face color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold">
                          {item.treatment}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AutoAwesome />}
                      >
                        View Full Case
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid xs={12} md={4} key={testimonial.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(200, 168, 130, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar 
                          src={testimonial.image} 
                          sx={{ width: 60, height: 60, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {testimonial.name}
                          </Typography>
                          <Rating
                            value={testimonial.rating}
                            readOnly
                            size="small"
                            sx={{ color: '#C8A882' }}
                          />
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 3,
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          color: 'text.primary'
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      
                      <Chip
                        label={testimonial.treatment}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Call to Action */}
        <Box textAlign="center" sx={{ mt: 8 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Ready to Begin Your Transformation?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Schedule your personalized consultation to discuss your facial aesthetic goals
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Chat />}
            onClick={handleChatWithJulie}
            sx={{ px: 6, py: 2 }}
          >
            Chat with Julie about Results
          </Button>
        </Box>

        {/* Image Modal */}
        <Dialog
          open={!!selectedImage}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)'
                }
              }}
            >
              <Close />
            </IconButton>
            {selectedImage && (
              <Box
                component="img"
                src={selectedImage}
                alt="Treatment result"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  )
}

export default FacialGallery
