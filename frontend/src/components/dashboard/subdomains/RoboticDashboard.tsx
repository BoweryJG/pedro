import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, LinearProgress, Grid, Chip, IconButton, Tooltip, Avatar } from '@mui/material';
import { 
  PrecisionManufacturing,
  Speed,
  Timer,
  CheckCircle,
  Architecture,
  AttachMoney,
  Timeline,
  Engineering,
  Insights,
  Memory,
  CenterFocusStrong,
  ThreeDRotation
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

interface YomiProcedure {
  id: string;
  patientName: string;
  procedureType: string;
  date: string;
  duration: number; // minutes
  implantsPLaced: number;
  accuracyScore: number; // percentage
  deviationMm: number;
  status: 'completed' | 'scheduled' | 'in-progress';
}

interface PrecisionMetric {
  metric: string;
  yomiValue: number;
  traditionalValue: number;
  improvement: number;
  unit: string;
}

interface RoboticMetrics {
  totalProcedures: number;
  averageAccuracy: number;
  averageDuration: number;
  timeReduction: number;
  revenueGenerated: number;
  patientSatisfaction: number;
  complicationRate: number;
  efficiencyGain: number;
}

const RoboticDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<RoboticMetrics>({
    totalProcedures: 0,
    averageAccuracy: 0,
    averageDuration: 0,
    timeReduction: 0,
    revenueGenerated: 0,
    patientSatisfaction: 0,
    complicationRate: 0,
    efficiencyGain: 0
  });
  const [recentProcedures, setRecentProcedures] = useState<YomiProcedure[]>([]);
  const [precisionComparison] = useState<PrecisionMetric[]>([
    { metric: 'Angular Deviation', yomiValue: 1.2, traditionalValue: 8.5, improvement: 85.9, unit: '°' },
    { metric: 'Depth Accuracy', yomiValue: 0.3, traditionalValue: 1.8, improvement: 83.3, unit: 'mm' },
    { metric: 'Entry Point', yomiValue: 0.5, traditionalValue: 2.1, improvement: 76.2, unit: 'mm' },
    { metric: 'Apex Deviation', yomiValue: 0.8, traditionalValue: 2.5, improvement: 68.0, unit: 'mm' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoboticData();
  }, []);

  const fetchRoboticData = async () => {
    try {
      // Fetch Yomi-specific appointment data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(*), patients(*)')
        .eq('services.is_yomi_technology', true)
        .order('appointment_date', { ascending: false });

      // Simulate recent Yomi procedures (in production, this would come from a dedicated procedures table)
      const mockProcedures: YomiProcedure[] = [
        {
          id: '1',
          patientName: 'Robert Wilson',
          procedureType: 'Full Arch Guided',
          date: '2024-12-28',
          duration: 95,
          implantsPLaced: 6,
          accuracyScore: 98.5,
          deviationMm: 0.4,
          status: 'completed'
        },
        {
          id: '2',
          patientName: 'Lisa Anderson',
          procedureType: 'Single Posterior',
          date: '2024-12-27',
          duration: 35,
          implantsPLaced: 1,
          accuracyScore: 99.2,
          deviationMm: 0.2,
          status: 'completed'
        },
        {
          id: '3',
          patientName: 'James Martinez',
          procedureType: 'Multiple Anterior',
          date: '2024-12-26',
          duration: 68,
          implantsPLaced: 3,
          accuracyScore: 97.8,
          deviationMm: 0.6,
          status: 'completed'
        },
        {
          id: '4',
          patientName: 'Patricia Brown',
          procedureType: 'Sinus Lift Guided',
          date: '2025-01-03',
          duration: 0,
          implantsPLaced: 0,
          accuracyScore: 0,
          deviationMm: 0,
          status: 'scheduled'
        }
      ];

      const completedProcedures = mockProcedures.filter(p => p.status === 'completed');
      const avgAccuracy = completedProcedures.reduce((sum, p) => sum + p.accuracyScore, 0) / completedProcedures.length;
      const avgDuration = completedProcedures.reduce((sum, p) => sum + p.duration, 0) / completedProcedures.length;

      setMetrics({
        totalProcedures: 89,
        averageAccuracy: avgAccuracy,
        averageDuration: avgDuration,
        timeReduction: 42,
        revenueGenerated: 678500,
        patientSatisfaction: 4.95,
        complicationRate: 0.5,
        efficiencyGain: 65
      });

      setRecentProcedures(mockProcedures);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching robotic data:', error);
      setLoading(false);
    }
  };

  // High-tech precision display component
  const PrecisionDisplay = ({ value, label, unit, icon }: any) => (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          margin: '0 auto',
          position: 'relative',
          background: 'radial-gradient(circle at 30% 30%, #3a3a3a, #1a1a1a)',
          borderRadius: '50%',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'conic-gradient(from 0deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
            animation: 'rotate 4s linear infinite',
          }
        }}
      >
        <Box
          sx={{
            width: '90%',
            height: '90%',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #2a2a2a, #1a1a1a)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          {icon}
          <Typography variant="h5" sx={{ 
            color: '#fff', 
            fontWeight: 'bold',
            fontFamily: 'monospace',
            mt: 0.5
          }}>
            {value}{unit}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ 
        color: 'rgba(255,255,255,0.8)', 
        mt: 1,
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '0.7rem'
      }}>
        {label}
      </Typography>
    </Box>
  );

  // 3D-style metric card
  const Metric3DCard = ({ title, value, subtitle, icon, gradient }: any) => (
    <motion.div
      whileHover={{ scale: 1.05, rotateY: 5 }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: 1000 }}
    >
      <Card sx={{ 
        background: gradient,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transform: 'rotateX(5deg)',
        transformStyle: 'preserve-3d',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Box sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500 }}>
                {title}
              </Typography>
              <Typography variant="h3" sx={{ 
                color: '#fff', 
                fontWeight: 'bold', 
                mt: 1,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                {subtitle}
              </Typography>
            </Box>
            <Box sx={{ 
              opacity: 0.3,
              transform: 'translateZ(20px)'
            }}>
              {icon}
            </Box>
          </Box>
        </Box>
      </Card>
    </motion.div>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #00F5FF 0%, #FF00E5 50%, #FFE500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }}>
        Yomi Robotic Analytics
      </Typography>

      {/* Precision Metrics Display */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <PrecisionDisplay
            value={metrics.averageAccuracy.toFixed(1)}
            label="Accuracy"
            unit="%"
            icon={<CenterFocusStrong sx={{ color: '#00F5FF', fontSize: 24 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <PrecisionDisplay
            value={metrics.averageDuration.toFixed(0)}
            label="Avg Time"
            unit="min"
            icon={<Timer sx={{ color: '#FF00E5', fontSize: 24 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <PrecisionDisplay
            value={metrics.timeReduction}
            label="Time Saved"
            unit="%"
            icon={<Speed sx={{ color: '#FFE500', fontSize: 24 }} />}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <PrecisionDisplay
            value={metrics.complicationRate}
            label="Complication"
            unit="%"
            icon={<Engineering sx={{ color: '#4CAF50', fontSize: 24 }} />}
          />
        </Grid>
      </Grid>

      {/* Precision Comparison Chart */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 3,
          background: 'linear-gradient(90deg, rgba(0,245,255,0.1) 0%, rgba(255,0,229,0.1) 50%, rgba(255,229,0,0.1) 100%)'
        }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Yomi vs Traditional Precision Metrics
          </Typography>
          
          {precisionComparison.map((metric, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#fff' }}>
                  {metric.metric}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" sx={{ color: '#00F5FF' }}>
                    Yomi: {metric.yomiValue}{metric.unit}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Traditional: {metric.traditionalValue}{metric.unit}
                  </Typography>
                  <Chip
                    label={`-${metric.improvement}%`}
                    size="small"
                    sx={{ 
                      height: 18,
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      color: '#4CAF50',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, height: 8 }}>
                <Box sx={{ 
                  flex: metric.yomiValue / metric.traditionalValue,
                  background: 'linear-gradient(90deg, #00F5FF, #00A5FF)',
                  borderRadius: 4,
                  boxShadow: '0 0 10px #00F5FF66'
                }} />
                <Box sx={{ 
                  flex: 1 - (metric.yomiValue / metric.traditionalValue),
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 4
                }} />
              </Box>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Recent Procedures */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3
      }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Recent Yomi Procedures
            </Typography>
            <Chip 
              icon={<PrecisionManufacturing sx={{ fontSize: 16 }} />}
              label={`${metrics.totalProcedures} Total`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(0, 245, 255, 0.2)',
                color: '#00F5FF',
                fontWeight: 'bold'
              }}
            />
          </Box>

          <Grid container spacing={2}>
            {recentProcedures.map((procedure) => (
              <Grid item xs={12} key={procedure.id}>
                <motion.div whileHover={{ x: 5 }}>
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    p: 2,
                    borderLeft: `4px solid ${procedure.status === 'completed' ? '#00F5FF' : '#FFE500'}`
                  }}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ 
                            bgcolor: procedure.status === 'completed' ? '#00F5FF22' : '#FFE50022',
                            color: procedure.status === 'completed' ? '#00F5FF' : '#FFE500'
                          }}>
                            <ThreeDRotation />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                              {procedure.patientName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              {procedure.procedureType}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={6} sm={2}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Date
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#fff' }}>
                          {new Date(procedure.date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      
                      {procedure.status === 'completed' && (
                        <>
                          <Grid item xs={6} sm={2}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Duration
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#fff' }}>
                              {procedure.duration} min
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4} sm={2}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Accuracy
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#00F5FF', fontWeight: 'bold' }}>
                              {procedure.accuracyScore}%
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4} sm={2}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              Deviation
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                              {procedure.deviationMm}mm
                            </Typography>
                          </Grid>
                        </>
                      )}
                      
                      <Grid item xs={4} sm={1}>
                        <Chip
                          label={procedure.status}
                          size="small"
                          sx={{
                            backgroundColor: procedure.status === 'completed' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 229, 0, 0.2)',
                            color: procedure.status === 'completed' ? '#4CAF50' : '#FFE500',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>

      {/* Performance Metrics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Metric3DCard
            title="Revenue Generated"
            value={`$${metrics.revenueGenerated.toLocaleString()}`}
            subtitle={`${metrics.totalProcedures} procedures`}
            icon={<AttachMoney sx={{ fontSize: 48 }} />}
            gradient="linear-gradient(135deg, #667eea, #764ba2)"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Metric3DCard
            title="Efficiency Gain"
            value={`${metrics.efficiencyGain}%`}
            subtitle="vs traditional methods"
            icon={<Insights sx={{ fontSize: 48 }} />}
            gradient="linear-gradient(135deg, #00F5FF, #0080FF)"
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Metric3DCard
            title="Patient Satisfaction"
            value={metrics.patientSatisfaction}
            subtitle="out of 5.0 rating"
            icon={<CheckCircle sx={{ fontSize: 48 }} />}
            gradient="linear-gradient(135deg, #4CAF50, #45a049)"
          />
        </Grid>
      </Grid>

      <style jsx global>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default RoboticDashboard;