import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, LinearProgress, Grid, Chip, IconButton, Tooltip, Avatar } from '@mui/material';
import { 
  TrendingUp,
  CheckCircle,
  Schedule,
  Healing,
  MedicalServices,
  AttachMoney,
  Timeline,
  Engineering,
  VerifiedUser,
  Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

interface ImplantCase {
  id: string;
  patientName: string;
  implantType: string;
  placementDate: string;
  healingProgress: number;
  osseointegrationStatus: 'excellent' | 'good' | 'monitoring' | 'concern';
  nextCheckup: string;
  totalCost: number;
}

interface HealingPhase {
  phase: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  startDate: string;
  endDate: string;
}

interface ImplantMetrics {
  totalImplants: number;
  successRate: number;
  averageHealingTime: number;
  activePatients: number;
  revenueGenerated: number;
  averageRevenue: number;
  procedureEfficiency: number;
  patientSatisfaction: number;
}

const ImplantsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ImplantMetrics>({
    totalImplants: 0,
    successRate: 0,
    averageHealingTime: 0,
    activePatients: 0,
    revenueGenerated: 0,
    averageRevenue: 0,
    procedureEfficiency: 0,
    patientSatisfaction: 0
  });
  const [activeCases, setActiveCases] = useState<ImplantCase[]>([]);
  const [healingPhases] = useState<HealingPhase[]>([
    { phase: 'Initial Healing', duration: '1-2 weeks', status: 'completed', startDate: '2024-10-01', endDate: '2024-10-14' },
    { phase: 'Osseointegration', duration: '3-6 months', status: 'in-progress', startDate: '2024-10-15', endDate: '2025-04-15' },
    { phase: 'Abutment Placement', duration: '2-3 weeks', status: 'upcoming', startDate: '2025-04-16', endDate: '2025-05-07' },
    { phase: 'Crown Placement', duration: '1-2 weeks', status: 'upcoming', startDate: '2025-05-08', endDate: '2025-05-22' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImplantData();
  }, []);

  const fetchImplantData = async () => {
    try {
      // Fetch implant-specific appointment data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(*), patients(*)')
        .eq('services.category', 'implants')
        .order('appointment_date', { ascending: false });

      // Simulate active implant cases (in production, this would come from a dedicated implants table)
      const mockActiveCases: ImplantCase[] = [
        {
          id: '1',
          patientName: 'John Smith',
          implantType: 'Single Molar',
          placementDate: '2024-11-15',
          healingProgress: 75,
          osseointegrationStatus: 'excellent',
          nextCheckup: '2025-01-15',
          totalCost: 4500
        },
        {
          id: '2',
          patientName: 'Sarah Johnson',
          implantType: 'Full Arch (All-on-4)',
          placementDate: '2024-10-01',
          healingProgress: 85,
          osseointegrationStatus: 'excellent',
          nextCheckup: '2025-01-08',
          totalCost: 25000
        },
        {
          id: '3',
          patientName: 'Michael Chen',
          implantType: 'Anterior Bridge',
          placementDate: '2024-12-01',
          healingProgress: 45,
          osseointegrationStatus: 'good',
          nextCheckup: '2025-01-20',
          totalCost: 8500
        },
        {
          id: '4',
          patientName: 'Emma Davis',
          implantType: 'Single Incisor',
          placementDate: '2024-12-15',
          healingProgress: 30,
          osseointegrationStatus: 'monitoring',
          nextCheckup: '2025-01-05',
          totalCost: 3800
        }
      ];

      const totalRevenue = mockActiveCases.reduce((sum, c) => sum + c.totalCost, 0);

      setMetrics({
        totalImplants: 127,
        successRate: 98.5,
        averageHealingTime: 4.2,
        activePatients: mockActiveCases.length,
        revenueGenerated: totalRevenue + 425000,
        averageRevenue: 4850,
        procedureEfficiency: 94,
        patientSatisfaction: 4.9
      });

      setActiveCases(mockActiveCases);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching implant data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#2196F3';
      case 'monitoring': return '#FF9800';
      case 'concern': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  // Luxury watch-style gauge component
  const GaugeMetric = ({ value, max, label, sublabel, color }: any) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 140,
          height: 140,
          margin: '0 auto',
          position: 'relative',
          background: 'conic-gradient(from 180deg, #1a1a1a 0deg, #2a2a2a 360deg)',
          borderRadius: '50%',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '94%',
            height: '94%',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
            boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5)',
          }
        }}
      >
        <svg
          width="140"
          height="140"
          style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="70"
            cy="70"
            r="60"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="70"
            cy="70"
            r="60"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${(value / max) * 377} 377`}
            strokeLinecap="round"
            style={{ 
              transition: 'stroke-dasharray 1s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 10px ${color}66)`
            }}
          />
        </svg>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            fontFamily: 'var(--font-secondary)',
            letterSpacing: '-0.02em'
          }}>
            {value}
            {label.includes('%') && '%'}
          </Typography>
          <Typography variant="caption" sx={{ 
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            {sublabel}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" sx={{ 
        color: 'rgba(255,255,255,0.8)', 
        mt: 2,
        fontWeight: 500
      }}>
        {label}
      </Typography>
    </Box>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        Implant Center Analytics
      </Typography>

      {/* Premium Metrics Display */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GaugeMetric
              value={metrics.successRate}
              max={100}
              label="Success Rate"
              sublabel="Osseointegration"
              color="#4CAF50"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GaugeMetric
              value={metrics.procedureEfficiency}
              max={100}
              label="Efficiency Rate"
              sublabel="Procedures"
              color="#2196F3"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GaugeMetric
              value={metrics.averageHealingTime}
              max={6}
              label="Avg Healing"
              sublabel="Months"
              color="#9C27B0"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} md={3}>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GaugeMetric
              value={metrics.patientSatisfaction}
              max={5}
              label="Satisfaction"
              sublabel="Rating"
              color="#FF9800"
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Active Cases Monitor */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2
      }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Active Implant Cases
            </Typography>
            <Chip 
              icon={<Engineering sx={{ fontSize: 16 }} />}
              label={`${metrics.activePatients} Active`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(102, 126, 234, 0.2)',
                color: '#fff',
                fontWeight: 'bold'
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {activeCases.map((caseData) => (
              <Grid item xs={12} md={6} key={caseData.id}>
                <motion.div whileHover={{ scale: 1.02 }}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    p: 2
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar sx={{ 
                          bgcolor: getStatusColor(caseData.osseointegrationStatus),
                          width: 48,
                          height: 48
                        }}>
                          <MedicalServices />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                            {caseData.patientName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {caseData.implantType}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={caseData.osseointegrationStatus}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(caseData.osseointegrationStatus)}22`,
                          color: getStatusColor(caseData.osseointegrationStatus),
                          border: `1px solid ${getStatusColor(caseData.osseointegrationStatus)}44`,
                          fontWeight: 'bold',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Healing Progress
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold' }}>
                          {caseData.healingProgress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={caseData.healingProgress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: `linear-gradient(90deg, ${getStatusColor(caseData.osseointegrationStatus)} 0%, ${getStatusColor(caseData.osseointegrationStatus)}88 100%)`
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Next: {new Date(caseData.nextCheckup).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        ${caseData.totalCost.toLocaleString()}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Healing Timeline */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Standard Healing Timeline
          </Typography>
          
          <Box sx={{ position: 'relative', pl: 4 }}>
            {healingPhases.map((phase, index) => (
              <Box key={index} sx={{ mb: 3, position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: -28,
                    top: 8,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: phase.status === 'completed' ? '#4CAF50' :
                               phase.status === 'in-progress' ? '#2196F3' :
                               'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: phase.status !== 'upcoming' ? 
                      `0 0 20px ${phase.status === 'completed' ? '#4CAF50' : '#2196F3'}66` : 
                      'none'
                  }}
                >
                  {phase.status === 'completed' && <CheckCircle sx={{ fontSize: 16, color: '#fff' }} />}
                  {phase.status === 'in-progress' && <Timer sx={{ fontSize: 16, color: '#fff' }} />}
                </Box>

                {index < healingPhases.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -16,
                      top: 32,
                      width: 2,
                      height: 48,
                      background: phase.status === 'completed' ? '#4CAF50' : 'rgba(255,255,255,0.1)'
                    }}
                  />
                )}

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                      {phase.phase}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: phase.status === 'completed' ? '#4CAF50' :
                             phase.status === 'in-progress' ? '#2196F3' :
                             'rgba(255,255,255,0.6)'
                    }}>
                      {phase.duration}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      {/* Revenue Analytics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            borderRadius: 2
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Total Revenue
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    ${metrics.revenueGenerated.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <TrendingUp sx={{ fontSize: 20, color: '#4CAF50' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      +18% from last quarter
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
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
            borderRadius: 2
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Total Implants Placed
                  </Typography>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    {metrics.totalImplants}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 2 }}>
                    Avg. ${metrics.averageRevenue.toLocaleString()} per implant
                  </Typography>
                </Box>
                <VerifiedUser sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImplantsDashboard;