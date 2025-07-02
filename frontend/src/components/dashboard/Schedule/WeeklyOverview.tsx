import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon
} from '@mui/icons-material';
import { format, startOfWeek, addDays, addWeeks, isSameDay, isToday } from 'date-fns';
import { motion } from 'framer-motion';

interface AppointmentSlot {
  id: string;
  time: string;
  patientName: string;
  type: string;
  duration: number;
  color: string;
}

interface DaySchedule {
  date: Date;
  appointments: AppointmentSlot[];
}

const WeeklyOverview: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Mock data - replace with Supabase query
  const getMockAppointments = (date: Date): AppointmentSlot[] => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return []; // No appointments on weekends

    const baseAppointments = [
      { id: '1', time: '09:00', patientName: 'Patient A', type: 'TMJ', duration: 60, color: '#FF6B6B' },
      { id: '2', time: '10:30', patientName: 'Patient B', type: 'Implant', duration: 90, color: '#4ECDC4' },
      { id: '3', time: '14:00', patientName: 'Patient C', type: 'Yomi', duration: 120, color: '#95E1D3' },
      { id: '4', time: '16:00', patientName: 'Patient D', type: 'MedSpa', duration: 45, color: '#F38181' }
    ];

    // Randomize appointments for variety
    return baseAppointments.slice(0, Math.floor(Math.random() * 4) + 1);
  };

  const handleWeekChange = (direction: 'prev' | 'next') => {
    setCurrentWeek(current => 
      direction === 'prev' ? addWeeks(current, -1) : addWeeks(current, 1)
    );
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const timeSlots = getTimeSlots();

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        height: '100%'
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => handleWeekChange('prev')} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Week of {format(currentWeek, 'MMMM d, yyyy')}
            </Typography>
            <IconButton onClick={() => handleWeekChange('next')} sx={{ color: 'white' }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Box sx={{ overflowX: 'auto' }}>
          <Grid container spacing={1} sx={{ minWidth: 900 }}>
            {/* Time Column */}
            <Grid item xs={1}>
              <Box sx={{ pt: 6 }}>
                {timeSlots.map(time => (
                  <Box
                    key={time}
                    sx={{
                      height: 60,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      pr: 1
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}
                    >
                      {time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Day Columns */}
            {weekDays.map((day, dayIndex) => {
              const appointments = getMockAppointments(day);
              const isCurrentDay = isToday(day);

              return (
                <Grid item key={dayIndex} sx={{ flex: 1 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.05 }}
                  >
                    {/* Day Header */}
                    <Box
                      sx={{
                        textAlign: 'center',
                        pb: 1,
                        mb: 1,
                        borderBottom: isCurrentDay ? '2px solid #FFD93D' : '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isCurrentDay ? '#FFD93D' : 'rgba(255,255,255,0.7)',
                          fontWeight: isCurrentDay ? 600 : 400
                        }}
                      >
                        {format(day, 'EEE')}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          color: isCurrentDay ? '#FFD93D' : 'white',
                          fontWeight: isCurrentDay ? 600 : 400
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>
                    </Box>

                    {/* Time Slots */}
                    <Box sx={{ position: 'relative' }}>
                      {timeSlots.map((time, timeIndex) => (
                        <Box
                          key={timeIndex}
                          sx={{
                            height: 60,
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative'
                          }}
                        />
                      ))}

                      {/* Appointments */}
                      {appointments.map((appointment) => {
                        const startHour = parseInt(appointment.time.split(':')[0]);
                        const startMinute = parseInt(appointment.time.split(':')[1]);
                        const topPosition = (startHour - 8) * 60 + startMinute;
                        const height = appointment.duration;

                        return (
                          <Tooltip
                            key={appointment.id}
                            title={`${appointment.time} - ${appointment.patientName} (${appointment.type})`}
                            placement="top"
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: topPosition,
                                left: 4,
                                right: 4,
                                height: height - 4,
                                backgroundColor: appointment.color,
                                borderRadius: 1,
                                p: 0.5,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                '&:hover': {
                                  opacity: 0.8,
                                  transform: 'scale(1.02)',
                                  transition: 'all 0.2s ease'
                                }
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'white',
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  display: 'block',
                                  lineHeight: 1.2
                                }}
                              >
                                {appointment.time}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'white',
                                  fontSize: '0.6rem',
                                  display: 'block',
                                  lineHeight: 1.2,
                                  opacity: 0.9
                                }}
                              >
                                {appointment.type}
                              </Typography>
                            </Box>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'TMJ', color: '#FF6B6B' },
            { label: 'Implants', color: '#4ECDC4' },
            { label: 'Yomi', color: '#95E1D3' },
            { label: 'MedSpa', color: '#F38181' }
          ].map(item => (
            <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CircleIcon sx={{ color: item.color, fontSize: 12 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyOverview;