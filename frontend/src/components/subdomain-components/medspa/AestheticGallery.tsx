import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab
} from '@mui/material'
import { motion } from 'framer-motion'
import { PhotoLibrary, Star, Close, Compare } from '@mui/icons-material'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface Treatment {
  id: string
  name: string
  description: string
  duration: string
  priceRange: string
  benefits: string[]
  image: string
}

interface Testimonial {
  name: string
  rating: number
  comment: string
  treatment: string
}

interface AestheticGalleryProps {
  treatments: Treatment[]
  testimonials: Testimonial[]
}

interface BeforeAfterImage {
  id: string
  treatment: string
  beforeImage: string
  afterImage: string
  description: string
  timeline: string
}

const AestheticGallery: React.FC<AestheticGalleryProps> = ({
  treatments,
  testimonials
}) => {
  const { toggleChat, sendMessage } = useChatStore()
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedImage, setSelectedImage] = useState<BeforeAfterImage | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleScheduleConsultation = () => {
    trackChatOpen('medspa_aesthetic_gallery')
    trackEvent({
      action: 'consultation_request',
      category: 'medspa',
      label: 'aesthetic_gallery_cta'
    })

    toggleChat()
    setTimeout(() => {
      sendMessage("I've been looking at your before and after gallery and I'm really impressed with the results! I'd like to schedule a consultation to discuss which aesthetic treatments would be best for my goals.")
    }, 500)
  }

  // Mock before/after data (in real app, this would come from props)
  const beforeAfterImages: BeforeAfterImage[] = [
    {
      id: '1',
      treatment: 'Botox & Fillers',
      beforeImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/Teeth-Whitening-Background.png',
      afterImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/05/Teeth-Whitening-Featured-Image.png',
      description: 'Natural-looking facial rejuvenation with Botox and dermal fillers',
      timeline: '2 weeks post-treatment'
    },
    {
      id: '2',
      treatment: 'EMFACE',
      beforeImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/Implants-Background.jpg',
      afterImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/05/Implants-Featured-Image.png',
      description: 'Non-invasive facial muscle toning and lifting',
      timeline: '4 weeks post-treatment'
    },
    {
      id: '3',
      treatment: 'Opus Plasma',
      beforeImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/Veneers-Background.png',
      afterImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/Dental-Implants-Logo.png',
      description: 'Skin resurfacing for improved texture and tone',
      timeline: '6 weeks post-treatment'
    },
    {
      id: '4',
      treatment: 'Teeth Whitening',
      beforeImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/TMJ-Background.png',
      afterImage: 'https://aboutfacedentalmedspa.com/wp-content/uploads/2023/04/Teeth-Whitening-Logo-1.png',
      description: 'Professional teeth whitening for a brighter smile',
      timeline: 'Immediate results'
    }
  ]

  const handleImageClick = (image: BeforeAfterImage) => {
    setSelectedImage(image)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedImage(null)
  }

  const tabContent = [
    { label: 'Before & After', value: 0 },
    { label: 'Treatment Gallery', value: 1 },
    { label: 'Patient Reviews', value: 2 }
  ]

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 2, color: 'primary.main', fontWeight: 700 }}
          >
            <PhotoLibrary sx={{ mr: 2, fontSize: 'inherit' }} />
            Aesthetic Transformation Gallery
          </Typography>
          
          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 6, color: 'text.secondary', maxWidth: 800, mx: 'auto' }}
          >
            See the beautiful, natural results our patients achieve with our aesthetic treatments
          </Typography>
        </motion.div>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            centered
            sx={{
              '& .MuiTab-root': {
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none'
              }
            }}
          >
            {tabContent.map((tab) => (
              <Tab key={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {/* Before & After Gallery */}
        {selectedTab === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              {beforeAfterImages.map((image, index) => (
                <Grid item="true" key={image.id} xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: 6
                        }
                      }}
                      onClick={() => handleImageClick(image)}
                    >
                      <Box sx={{ position: 'relative', height: 300 }}>
                        <Grid container sx={{ height: '100%' }}>
                          <Grid item="true" xs={6}>
                            <Box
                              sx={{
                                height: '100%',
                                background: `url(${image.beforeImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                              }}
                            >
                              <Chip
                                label="BEFORE"
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  left: 8,
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item="true" xs={6}>
                            <Box
                              sx={{
                                height: '100%',
                                background: `url(${image.afterImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative'
                              }}
                            >
                              <Chip
                                label="AFTER"
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'white',
                            borderRadius: '50%',
                            p: 1,
                            boxShadow: 2
                          }}
                        >
                          <Compare sx={{ color: 'primary.main' }} />
                        </Box>
                      </Box>
                      
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {image.treatment}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          {image.description}
                        </Typography>
                        <Chip
                          label={image.timeline}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Treatment Gallery */}
        {selectedTab === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              {treatments.map((treatment, index) => (
                <Grid item="true" key={treatment.id} xs={12} sm={6} md={4}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <Box
                        sx={{
                          height: 250,
                          background: `url(${treatment.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                          {treatment.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          {treatment.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip
                            label={treatment.duration}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={treatment.priceRange}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        
                        <Box>
                          {treatment.benefits.slice(0, 2).map((benefit, idx) => (
                            <Chip
                              key={idx}
                              label={benefit}
                              size="small"
                              sx={{ mr: 0.5, mb: 0.5 }}
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Patient Reviews */}
        {selectedTab === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item="true" key={index} xs={12} md={6}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.05) 0%, rgba(139, 74, 139, 0.05) 100%)',
                        border: '1px solid',
                        borderColor: 'primary.light'
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <Avatar
                            sx={{
                              bgcolor: 'primary.main',
                              mr: 2,
                              width: 56,
                              height: 56
                            }}
                          >
                            {testimonial.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {testimonial.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating value={testimonial.rating} readOnly size="small" />
                              <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                                {testimonial.treatment}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            fontStyle: 'italic',
                            lineHeight: 1.7,
                            color: 'text.primary'
                          }}
                        >
                          "{testimonial.comment}"
                        </Typography>
                        
                        <Box sx={{ display: 'flex', mt: 3 }}>
                          {[...Array(testimonial.rating)].map((_, idx) => (
                            <Star
                              key={idx}
                              sx={{ color: 'primary.main', fontSize: 20 }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card
            sx={{
              mt: 8,
              p: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(184, 134, 11, 0.1) 0%, rgba(139, 74, 139, 0.1) 100%)'
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
              Ready to Begin Your Transformation?
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Book your personalized aesthetic consultation and discover how we can help you achieve your beauty goals
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5 }}
              onClick={handleScheduleConsultation}
            >
              Chat with Julie about Your Transformation
            </Button>
          </Card>
        </motion.div>

        {/* Before/After Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedImage?.treatment} - Before & After
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item="true" xs={6}>
                    <Box
                      sx={{
                        height: 400,
                        background: `url(${selectedImage.beforeImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 2,
                        position: 'relative'
                      }}
                    >
                      <Chip
                        label="BEFORE"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item="true" xs={6}>
                    <Box
                      sx={{
                        height: 400,
                        background: `url(${selectedImage.afterImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 2,
                        position: 'relative'
                      }}
                    >
                      <Chip
                        label="AFTER"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'primary.main',
                          color: 'white'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedImage.description}
                </Typography>
                <Chip
                  label={selectedImage.timeline}
                  color="primary"
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  )
}

export default AestheticGallery