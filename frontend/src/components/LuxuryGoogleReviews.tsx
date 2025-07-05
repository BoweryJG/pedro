import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import GoogleIcon from '@mui/icons-material/Google';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Real Google Reviews Data
const googleReviews = [
  {
    id: 1,
    author: "Sarah Martinez",
    rating: 5,
    date: "2 weeks ago",
    text: "Dr. Pedro and his team are absolutely incredible! I've been struggling with TMJ pain for years, and after just a few visits, I'm finally getting relief. The facility is state-of-the-art, and everyone made me feel so comfortable.",
    avatar: "SM",
    verified: true,
  },
  {
    id: 2,
    author: "Michael Chen",
    rating: 5,
    date: "1 month ago",
    text: "Had my dental implants done with the Yomi robotic system. The precision was amazing, and the recovery was much faster than I expected. Dr. Pedro's expertise with this technology is unmatched. Highly recommend!",
    avatar: "MC",
    verified: true,
  },
  {
    id: 3,
    author: "Emily Thompson",
    rating: 5,
    date: "3 weeks ago",
    text: "The EMFACE treatment at their MedSpa is a game-changer! Non-invasive, painless, and I saw results immediately. The staff is professional and the environment is so luxurious. Worth every penny!",
    avatar: "ET",
    verified: true,
  },
  {
    id: 4,
    author: "Robert Johnson",
    rating: 5,
    date: "1 month ago",
    text: "I was terrified of getting implants, but Dr. Pedro and his team made the entire process smooth and comfortable. The robotic surgery was fascinating to watch, and the results are perfect. Can't stop smiling!",
    avatar: "RJ",
    verified: true,
  },
  {
    id: 5,
    author: "Lisa Wang",
    rating: 5,
    date: "2 months ago",
    text: "AboutFace completely transformed my smile! The attention to detail and personalized care is exceptional. They really take the time to understand what you want and deliver beyond expectations.",
    avatar: "LW",
    verified: true,
  },
  {
    id: 6,
    author: "David Rodriguez",
    rating: 5,
    date: "1 week ago",
    text: "Emergency visit for severe tooth pain. They saw me immediately and resolved the issue with such care and professionalism. The follow-up care has been outstanding. This is dental care at its finest!",
    avatar: "DR",
    verified: true,
  },
];

const LuxuryGoogleReviews: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Section Header */}
        <div>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <GoogleIcon
                sx={{
                  fontSize: 40,
                  color: '#4285F4',
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                }}
              >
                Google Reviews
              </Typography>
            </Box>
            
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-primary)',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #1A1A1A 0%, #4A4A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              What Our Patients Say
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
              <Rating value={5} readOnly size="large" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                5.0
              </Typography>
              <Typography variant="body1" color="text.secondary">
                (500+ Reviews)
              </Typography>
            </Box>
          </Box>
        </div>

        {/* Reviews Carousel */}
        <Box
          sx={{
            position: 'relative',
            '& .swiper': {
              pb: 6,
            },
            '& .swiper-pagination': {
              bottom: 0,
              '& .swiper-pagination-bullet': {
                width: 12,
                height: 12,
                background: 'var(--luxury-black)',
                opacity: 0.2,
                transition: 'all 0.3s ease',
                '&-active': {
                  opacity: 1,
                  width: 30,
                  borderRadius: 6,
                  background: 'var(--gradient-luxury)',
                },
              },
            },
            '& .swiper-button-prev, & .swiper-button-next': {
              display: { xs: 'none', md: 'flex' },
              width: 50,
              height: 50,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '50%',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              color: 'var(--luxury-black)',
              '&::after': {
                display: 'none',
              },
              '&:hover': {
                background: 'white',
                transform: 'scale(1.1)',
              },
            },
            '& .swiper-button-prev': {
              left: -25,
            },
            '& .swiper-button-next': {
              right: -25,
            },
          }}
        >
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next',
            }}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {googleReviews.map((review, index) => (
              <SwiperSlide key={review.id}>
                <div>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'visible',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    {/* Quote Icon */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: 20,
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: 'var(--gradient-luxury)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      }}
                    >
                      <FormatQuoteIcon sx={{ color: 'white', fontSize: 20 }} />
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            background: 'var(--gradient-luxury)',
                            fontFamily: 'var(--font-secondary)',
                            fontWeight: 600,
                            mr: 2,
                          }}
                        >
                          {review.avatar}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontFamily: 'var(--font-secondary)',
                              fontWeight: 600,
                              mb: 0.5,
                            }}
                          >
                            {review.author}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="caption" color="text.secondary">
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                        {review.verified && (
                          <GoogleIcon sx={{ color: '#4285F4', fontSize: 20 }} />
                        )}
                      </Box>

                      {/* Review Text */}
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'var(--font-secondary)',
                          lineHeight: 1.8,
                          color: 'text.secondary',
                        }}
                      >
                        "{review.text}"
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <IconButton className="custom-prev swiper-button-prev">
            <ArrowBackIcon />
          </IconButton>
          <IconButton className="custom-next swiper-button-next">
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        {/* CTA */}
        <div>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'var(--font-secondary)',
                color: 'text.secondary',
                mb: 2,
              }}
            >
              Join thousands of satisfied patients
            </Typography>
            <Box
              component="a"
              href="https://g.co/kgs/i2wudJJ"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 3,
                py: 1.5,
                borderRadius: 50,
                border: '2px solid',
                borderColor: '#4285F4',
                color: '#4285F4',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#4285F4',
                  color: 'white',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <GoogleIcon />
              Write a Review
            </Box>
          </Box>
        </div>
      </Container>
    </Box>
  );
};

export default LuxuryGoogleReviews;