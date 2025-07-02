import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, LinearProgress, Grid, Chip, IconButton, Tooltip } from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccessTime,
  Healing,
  Psychology,
  LocalHospital,
  Assessment,
  Schedule,
  AttachMoney
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabase';

interface PainData {
  date: string;
  level: number;
  location: string;
  triggers?: string[];
}

interface TreatmentProgress {
  milestone: string;
  date: string;
  completed: boolean;
  improvement: number;
}

interface TMJMetrics {
  averagePainLevel: number;
  painTrend: 'improving' | 'stable' | 'worsening';
  treatmentCompliance: number;
  nextAppointment: string;
  totalSessions: number;
  improvementRate: number;
  revenueContribution: number;
  patientSatisfaction: number;
}

const TMJDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<TMJMetrics>({
    averagePainLevel: 0,
    painTrend: 'stable',
    treatmentCompliance: 0,
    nextAppointment: '',
    totalSessions: 0,
    improvementRate: 0,
    revenueContribution: 0,
    patientSatisfaction: 0
  });
  const [painHistory, setPainHistory] = useState<PainData[]>([]);
  const [treatmentMilestones, setTreatmentMilestones] = useState<TreatmentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTMJData();
  }, []);

  const fetchTMJData = async () => {
    try {
      // Fetch TMJ-specific appointment data
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(*)')
        .eq('services.category', 'tmj')
        .order('appointment_date', { ascending: false });

      // Simulate pain tracking data (in production, this would come from a pain tracking table)
      const mockPainHistory: PainData[] = [
        { date: '2024-12-01', level: 8, location: 'jaw', triggers: ['stress', 'cold'] },
        { date: '2024-12-08', level: 7, location: 'temple', triggers: ['chewing'] },
        { date: '2024-12-15', level: 6, location: 'jaw', triggers: ['stress'] },
        { date: '2024-12-22', level: 5, location: 'jaw', triggers: [] },
        { date: '2024-12-29', level: 4, location: 'temple', triggers: [] },
      ];

      const mockMilestones: TreatmentProgress[] = [
        { milestone: 'Initial Assessment', date: '2024-12-01', completed: true, improvement: 0 },
        { milestone: 'Custom Splint Fitting', date: '2024-12-08', completed: true, improvement: 15 },
        { milestone: 'Physical Therapy Start', date: '2024-12-15', completed: true, improvement: 25 },
        { milestone: 'Mid-Treatment Review', date: '2024-12-22', completed: true, improvement: 40 },
        { milestone: 'Treatment Completion', date: '2025-01-15', completed: false, improvement: 0 },
      ];

      // Calculate metrics
      const avgPain = mockPainHistory.reduce((sum, p) => sum + p.level, 0) / mockPainHistory.length;
      const painTrend = mockPainHistory[0].level < mockPainHistory[mockPainHistory.length - 1].level 
        ? 'improving' : mockPainHistory[0].level > mockPainHistory[mockPainHistory.length - 1].level 
        ? 'worsening' : 'stable';

      setMetrics({
        averagePainLevel: avgPain,
        painTrend,
        treatmentCompliance: 92,
        nextAppointment: '2025-01-08',
        totalSessions: appointments?.length || 12,
        improvementRate: 40,
        revenueContribution: 15750,
        patientSatisfaction: 4.8
      });

      setPainHistory(mockPainHistory);
      setTreatmentMilestones(mockMilestones);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching TMJ data:', error);
      setLoading(false);
    }
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return '#4CAF50';
    if (level <= 6) return '#FF9800';
    return '#F44336';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'improving' ? <TrendingDown color="success" /> : 
           trend === 'worsening' ? <TrendingUp color="error" /> : 
           <TrendingUp color="action" />;
  };

  // Watch complication style circular progress
  const CircularMetric = ({ value, max, label, icon, color }: any) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
          boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <svg width="120" height="120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(value / max) * 314} 314`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        TMJ Treatment Analytics
      </Typography>

      {/* Key Metrics Row - Watch Complications Style */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CircularMetric
              value={Math.round(10 - metrics.averagePainLevel)}
              max={10}
              label="Pain Relief"
              icon={<Healing sx={{ color: '#4CAF50' }} />}
              color="#4CAF50"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CircularMetric
              value={metrics.treatmentCompliance}
              max={100}
              label="Compliance %"
              icon={<Psychology sx={{ color: '#2196F3' }} />}
              color="#2196F3"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CircularMetric
              value={metrics.improvementRate}
              max={100}
              label="Improvement %"
              icon={<TrendingUp sx={{ color: '#9C27B0' }} />}
              color="#9C27B0"
            />
          </motion.div>
        </Grid>
        <Grid item xs={6} sm={3}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <CircularMetric
              value={metrics.patientSatisfaction}
              max={5}
              label="Satisfaction"
              icon={<Assessment sx={{ color: '#FF9800' }} />}
              color="#FF9800"
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Pain Tracking Chart */}
      <Card sx={{ 
        mb: 3, 
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Pain Level Tracking
            </Typography>
            <Chip 
              icon={getTrendIcon(metrics.painTrend)}
              label={metrics.painTrend}
              size="small"
              sx={{ 
                backgroundColor: metrics.painTrend === 'improving' ? 'rgba(76, 175, 80, 0.2)' : 
                                metrics.painTrend === 'worsening' ? 'rgba(244, 67, 54, 0.2)' : 
                                'rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: 200 }}>
            {painHistory.map((pain, index) => (
              <Tooltip key={index} title={`${pain.date}: Level ${pain.level}/10`}>
                <Box
                  sx={{
                    width: '15%',
                    height: `${pain.level * 10}%`,
                    background: `linear-gradient(to top, ${getPainColor(pain.level)}, ${getPainColor(pain.level)}88)`,
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: `0 10px 20px ${getPainColor(pain.level)}44`
                    }
                  }}
                >
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      position: 'absolute', 
                      top: -20, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                  >
                    {pain.level}
                  </Typography>
                </Box>
              </Tooltip>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            {painHistory.map((pain, index) => (
              <Typography key={index} variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {new Date(pain.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            ))}
          </Box>
        </Box>
      </Card>

      {/* Treatment Progress Timeline */}
      <Card sx={{ 
        mb: 3,
        background: 'linear-gradient(145deg, #1e1e1e, #2a2a2a)',
        boxShadow: '8px 8px 16px #0a0a0a, -8px -8px 16px #3a3a3a',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3 }}>
            Treatment Timeline
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            {treatmentMilestones.map((milestone, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: milestone.completed 
                      ? 'linear-gradient(135deg, #4CAF50, #45a049)' 
                      : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: milestone.completed 
                      ? '0 4px 12px rgba(76, 175, 80, 0.4)' 
                      : 'none',
                    zIndex: 1
                  }}
                >
                  <LocalHospital sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                
                <Box sx={{ ml: 3, flex: 1 }}>
                  <Typography variant="body1" sx={{ color: '#fff', fontWeight: 'bold' }}>
                    {milestone.milestone}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {new Date(milestone.date).toLocaleDateString()} 
                    {milestone.improvement > 0 && ` • ${milestone.improvement}% improvement`}
                  </Typography>
                </Box>
                
                {index < treatmentMilestones.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 20,
                      top: 60 + index * 72,
                      width: 2,
                      height: 40,
                      background: milestone.completed 
                        ? 'linear-gradient(to bottom, #4CAF50, rgba(76, 175, 80, 0.3))' 
                        : 'rgba(255,255,255,0.1)'
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Card>

      {/* Revenue & Stats Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Revenue Contribution
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    ${metrics.revenueContribution.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                    {metrics.totalSessions} treatment sessions
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb, #f5576c)',
            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)'
          }}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    Next Appointment
                  </Typography>
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 'bold', mt: 1 }}>
                    {new Date(metrics.nextAppointment).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                    Mid-treatment evaluation
                  </Typography>
                </Box>
                <Schedule sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)' }} />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TMJDashboard;