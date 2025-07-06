import { Box, Typography, Card, CardContent, Avatar, Rating, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// Import Swiper styles
import 'swiper/swiper-bundle.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Martinez',
    rating: 5,
    text: 'Dr. Pedro\'s Yomi robotic surgery was incredible! I was back to work in 3 days with minimal pain. The precision was amazing.',
    procedure: 'Dental Implants with Yomi',
    image: 'SM',
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    text: 'After years of TMJ pain, Dr. Pedro finally gave me relief. His custom treatment plan changed my life.',
    procedure: 'TMJ Treatment',
    image: 'MC',
  },
  {
    id: 3,
    name: 'Jennifer Williams',
    rating: 5,
    text: 'EMFACE treatments have taken 10 years off my face! No needles, no downtime, just amazing results.',
    procedure: 'EMFACE',
    image: 'JW',
  },
  {
    id: 4,
    name: 'Robert Thompson',
    rating: 5,
    text: 'Dr. Pedro is fantastic! He handled both my regular care and my implants with amazing skill and precision.',
    procedure: 'General & Implant Care',
    image: 'RT',
  },
  {
    id: 5,
    name: 'Maria Rodriguez',
    rating: 5,
    text: 'The technology here is unbelievable. Watching the Yomi robot work was like science fiction!',
    procedure: 'Yomi Robotic Surgery',
    image: 'MR',
  },
];

const TestimonialCarousel = () => {
  return (
    <Box sx={{ position: 'relative', py: 6 }}>
      <Typography
        variant="h2"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700, mb: 6 }}
      >
        What Our Patients Say
      </Typography>

      <Box sx={{ px: { xs: 2, md: 8 } }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          style={{ paddingBottom: 50 }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <Card
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'visible',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '2px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 40px rgba(102, 126, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '16px',
                    padding: '2px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f857a6 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 0.98) 100%)',
                    border: '2px solid rgba(102, 126, 234, 0.4)',
                    boxShadow: '0 30px 80px rgba(0, 0, 0, 0.15), 0 0 60px rgba(102, 126, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 1)',
                    '&::before': {
                      opacity: 0.8,
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <FormatQuoteIcon
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      fontSize: 40,
                      color: 'grey.200',
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2,
                      }}
                    >
                      {testimonial.image}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Rating value={testimonial.rating} readOnly size="small" />
                    </Box>
                  </Box>

                  <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                    "{testimonial.text}"
                  </Typography>

                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={600}
                  >
                    {testimonial.procedure}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <IconButton
          className="swiper-button-prev"
          sx={{
            position: 'absolute',
            left: { xs: -16, md: 0 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            boxShadow: 2,
            zIndex: 10,
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          className="swiper-button-next"
          sx={{
            position: 'absolute',
            right: { xs: -16, md: 0 },
            top: '50%',
            transform: 'translateY(-50%)',
            bgcolor: 'white',
            boxShadow: 2,
            zIndex: 10,
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TestimonialCarousel;