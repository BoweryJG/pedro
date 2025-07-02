import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, LinearProgress, Grid, Chip, IconButton, Tooltip, Avatar, Rating } from '@mui/material';
import { 
  Spa,
  Face,
  AutoAwesome,
  TrendingUp,
  Groups,
  AttachMoney,
  Star,
  EventRepeat,
  LocalOffer,
  FaceRetouchingNatural,
  Favorite,
  WaterDrop
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

interface TreatmentPackage {
  id: string;
  name: string;
  treatments: string[];
  totalValue: number;
  packagePrice: number;
  savings: number;
  popularity: number;
  bookings: number;
}

interface ClientSatisfaction {
  treatment: string;
  rating: number;
  reviews: number;
  topComment: string;
}

interface MedSpaMetrics {
  totalClients: number;
  activeMembers: number;
  averageSpend: number;
  retentionRate: number;
  monthlyRevenue: number;
  topTreatment: string;
  satisfactionScore: number;
  packageSalesRate: number;
}

interface PopularTreatment {
  name: string;
  icon: React.ReactNode;
  bookings: number;
  revenue: number;
  growth: number;
  satisfaction: number;
}

const MedSpaDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<MedSpaMetrics>({
    totalClients: 0,
    activeMembers: 0,
    averageSpend: 0,
    retentionRate: 0,
    monthlyRevenue: 0,
    topTreatment: '',
    satisfactionScore: 0,
    packageSalesRate: 0
  });
  const [packages, setPackages] = useState<TreatmentPackage[]>([]);
  const [popularTreatments, setPopularTreatments] = useState<PopularTreatment[]>([]);
  const [clientSatisfaction, setClientSatisfaction] = useState<ClientSatisfaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedSpaData();
  }, []);

  const fetchMedSpaData = async () => {
    try {
      // Fetch MedSpa-specific appointment data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(*), patients(*)')
        .eq('services.category', 'medspa')
        .order('appointment_date', { ascending: false });

      // Simulate treatment packages (in production, this would come from a packages table)
      const mockPackages: TreatmentPackage[] = [
        {
          id: '1',
          name: 'Signature Glow Package',
          treatments: ['HydraFacial', 'LED Therapy', 'Vitamin C Infusion'],
          totalValue: 850,
          packagePrice: 650,
          savings: 200,
          popularity: 92,
          bookings: 48
        },
        {
          id: '2',
          name: 'Anti-Aging Deluxe',
          treatments: ['Botox (20 units)', 'Microneedling', 'PRP Facial'],
          totalValue: 1400,
          packagePrice: 1150,
          savings: 250,
          popularity: 88,
          bookings: 36
        },
        {
          id: '3',
          name: 'Summer Ready Package',
          treatments: ['Laser Hair Removal (3 areas)', 'Chemical Peel', 'SPF Kit'],
          totalValue: 1200,
          packagePrice: 900,
          savings: 300,
          popularity: 85,
          bookings: 42
        },
        {
          id: '4',
          name: 'Bridal Beauty Bundle',
          treatments: ['EmFace', 'Teeth Whitening', 'HydraFacial', 'Dermaplaning'],
          totalValue: 2200,
          packagePrice: 1800,
          savings: 400,
          popularity: 95,
          bookings: 28
        }
      ];

      const mockTreatments: PopularTreatment[] = [
        {
          name: 'HydraFacial',
          icon: <WaterDrop sx={{ color: '#2196F3' }} />,
          bookings: 156,
          revenue: 23400,
          growth: 22,
          satisfaction: 4.9
        },
        {
          name: 'Botox',
          icon: <FaceRetouchingNatural sx={{ color: '#9C27B0' }} />,
          bookings: 124,
          revenue: 37200,
          growth: 18,
          satisfaction: 4.8
        },
        {
          name: 'EmFace',
          icon: <AutoAwesome sx={{ color: '#FF9800' }} />,
          bookings: 98,
          revenue: 68600,
          growth: 45,
          satisfaction: 4.95
        },
        {
          name: 'Laser Treatments',
          icon: <Face sx={{ color: '#F44336' }} />,
          bookings: 87,
          revenue: 26100,
          growth: 15,
          satisfaction: 4.7
        }
      ];

      const mockSatisfaction: ClientSatisfaction[] = [
        {
          treatment: 'EmFace',
          rating: 4.95,
          reviews: 89,
          topComment: 'Incredible results! My skin looks 10 years younger.'
        },
        {
          treatment: 'HydraFacial',
          rating: 4.9,
          reviews: 156,
          topComment: 'Best facial I\'ve ever had. Instant glow!'
        },
        {
          treatment: 'Botox',
          rating: 4.8,
          reviews: 124,
          topComment: 'Natural looking results. Dr. Pedro is an artist!'
        },
        {
          treatment: 'Package Deals',
          rating: 4.85,
          reviews: 154,
          topComment: 'Great value and personalized treatment plans.'
        }
      ];

      setMetrics({
        totalClients: 847,
        activeMembers: 312,
        averageSpend: 485,
        retentionRate: 82,
        monthlyRevenue: 156800,
        topTreatment: 'EmFace',
        satisfactionScore: 4.87,
        packageSalesRate: 68
      });

      setPackages(mockPackages);
      setPopularTreatments(mockTreatments);
      setClientSatisfaction(mockSatisfaction);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching MedSpa data:', error);
      setLoading(false);
    }
  };

  // Luxury spa-style circular metric
  const SpaMetricDisplay = ({ value, label, icon, color, suffix = '' }: any) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 130,
          height: 130,
          margin: '0 auto',
          position: 'relative',
          borderRadius: '50%',
          background: `conic-gradient(
            ${color} ${(value / 100) * 360}deg,
            rgba(255,255,255,0.05) ${(value / 100) * 360}deg
          )`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '85%',
            height: '85%',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          {icon}
          <Typography variant="h5" sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            mt: 1
          }}>
            {value}{suffix}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.65rem'
          }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        MedSpa Analytics
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SpaMetricDisplay
              value={metrics.retentionRate}
              label="Retention"
              suffix="%"
              icon={<Favorite sx={{ color: '#f093fb' }} />}
              color="#f093fb"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SpaMetricDisplay
              value={metrics.packageSalesRate}
              label="Package Sales"
              suffix="%"
              icon={<LocalOffer sx={{ color: '#f5576c' }} />}
              color="#f5576c"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SpaMetricDisplay
              value={Math.round(metrics.satisfactionScore * 20)}
              label="Satisfaction"
              suffix="%"
              icon={<Star sx={{ color: '#FFD700' }} />}
              color="#FFD700"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <SpaMetricDisplay
              value={Math.round((metrics.activeMembers / metrics.totalClients) * 100)}
              label="Active Members"
              suffix="%"
              icon={<Groups sx={{ color: '#4CAF50' }} />}
              color="#4CAF50"
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Treatment Packages Performance */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Treatment Package Performance
          </Typography>
          
          <Grid container spacing={2}>
            {packages.map((pkg) => (
              <Grid item xs={12} md={6} key={pkg.id}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    p: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {pkg.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                          {pkg.treatments.map((treatment, idx) => (
                            <Chip
                              key={idx}
                              label={treatment}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.65rem',
                                height: 20
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          ${pkg.packagePrice}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          textDecoration: 'line-through'
                        }}>
                          ${pkg.totalValue}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Popularity
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={pkg.popularity}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                background: 'linear-gradient(90deg, #f093fb, #f5576c)'
                              }
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            Bookings
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            {pkg.bookings}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={`Save $${pkg.savings}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(76, 175, 80, 0.2)',
                          color: '#4CAF50',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Popular Treatments */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Treatment Performance
          </Typography>
          
          <Grid container spacing={2}>
            {popularTreatments.map((treatment, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  p: 2,
                  textAlign: 'center'
                }}>
                  <Box sx={{ mb: 2 }}>
                    {treatment.icon}
                  </Box>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold', mb: 1 }}>
                    {treatment.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Bookings
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {treatment.bookings}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Revenue
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      ${(treatment.revenue / 1000).toFixed(1)}k
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Growth
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TrendingUp sx={{ fontSize: 12, color: '#4CAF50' }} />
                      <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {treatment.growth}%
                      </Typography>
                    </Box>
                  </Box>
                  <Rating 
                    value={treatment.satisfaction} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                    sx={{ 
                      '& .MuiRating-iconFilled': { color: '#FFD700' }
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Client Satisfaction */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Client Satisfaction Highlights
          </Typography>
          
          {clientSatisfaction.map((item, index) => (
            <Box key={index} sx={{ mb: 3, pb: 2, borderBottom: index < clientSatisfaction.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                <Box>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {item.treatment}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Rating value={item.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {item.rating} ({item.reviews} reviews)
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<Star />}
                  label="Top Rated"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255, 215, 0, 0.2)',
                    color: '#FFD700',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                "{item.topComment}"
              </Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Revenue Summary */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
            borderRadius: 3
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    ${metrics.monthlyRevenue.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                      +24% from last month
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            borderRadius: 3
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Average Client Spend
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    ${metrics.averageSpend}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 2 }}>
                    {metrics.totalClients} total clients
                  </Typography>
                </Box>
                <Spa sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MedSpaDashboard;