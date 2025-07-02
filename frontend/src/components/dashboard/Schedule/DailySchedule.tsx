import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format, addDays, startOfDay } from 'date-fns';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  time: string;
  duration: number;
  type: string;
  provider: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'no-show';
  notes?: string;
  phone?: string;
  email?: string;
}

const DailySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Mock data - replace with Supabase query
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Smith',
        time: '09:00',
        duration: 60,
        type: 'TMJ Consultation',
        provider: 'Dr. Pedro',
        status: 'confirmed',
        phone: '+1 (555) 123-4567',
        email: 'john.smith@email.com'
      },
      {
        id: '2',
        patientName: 'Sarah Johnson',
        time: '10:30',
        duration: 90,
        type: 'Yomi Implant',
        provider: 'Dr. Pedro',
        status: 'scheduled',
        phone: '+1 (555) 234-5678',
        email: 'sarah.j@email.com'
      },
      {
        id: '3',
        patientName: 'Michael Chen',
        time: '14:00',
        duration: 45,
        type: 'Follow-up',
        provider: 'Dr. Pedro',
        status: 'scheduled',
        phone: '+1 (555) 345-6789',
        email: 'mchen@email.com'
      },
      {
        id: '4',
        patientName: 'Emma Wilson',
        time: '15:30',
        duration: 60,
        type: 'MedSpa Consultation',
        provider: 'Dr. Pedro',
        status: 'confirmed',
        phone: '+1 (555) 456-7890',
        email: 'emma.w@email.com'
      }
    ];
    setAppointments(mockAppointments);
  }, [selectedDate]);

  const handleDateChange = (direction: 'prev' | 'next') => {
    setSelectedDate(current => 
      direction === 'prev' ? addDays(current, -1) : addDays(current, 1)
    );
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'scheduled': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'default';
      case 'no-show': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    if (type.includes('TMJ')) return '#FF6B6B';
    if (type.includes('Implant')) return '#4ECDC4';
    if (type.includes('Yomi')) return '#95E1D3';
    if (type.includes('MedSpa')) return '#F38181';
    return '#778BEB';
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}
    >
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => handleDateChange('prev')} sx={{ color: 'white' }}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
            <IconButton onClick={() => handleDateChange('next')} sx={{ color: 'white' }}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Chip
            label={`${appointments.length} Appointments`}
            sx={{
              background: 'linear-gradient(45deg, #FFD93D 0%, #FFB03A 100%)',
              color: '#000',
              fontWeight: 600
            }}
          />
        </Box>

        {/* Appointment List */}
        <List sx={{ p: 0 }}>
          {appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  mb: 2,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'translateX(5px)',
                    transition: 'all 0.3s ease'
                  }
                }}
                onClick={() => handleAppointmentClick(appointment)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Avatar
                    sx={{
                      bgcolor: getTypeColor(appointment.type),
                      width: 50,
                      height: 50
                    }}
                  >
                    {appointment.patientName.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography sx={{ color: 'white', fontWeight: 600 }}>
                          {appointment.patientName}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          size="small"
                          color={getStatusColor(appointment.status) as any}
                          sx={{ height: 24 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TimeIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.6)' }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {appointment.time} ({appointment.duration} min)
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: getTypeColor(appointment.type),
                            fontWeight: 600
                          }}
                        >
                          {appointment.type}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Call Patient">
                        <IconButton
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.6)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${appointment.phone}`;
                          }}
                        >
                          <PhoneIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send SMS">
                        <IconButton
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.6)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `sms:${appointment.phone}`;
                          }}
                        >
                          <MessageIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Send Email">
                        <IconButton
                          edge="end"
                          sx={{ color: 'rgba(255,255,255,0.6)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${appointment.email}`;
                          }}
                        >
                          <EmailIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItemSecondaryAction>
                </Box>
              </ListItem>
            </motion.div>
          ))}
        </List>

        {/* Appointment Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
              borderRadius: 3
            }
          }}
        >
          {selectedAppointment && (
            <>
              <DialogTitle sx={{ color: 'white' }}>
                Appointment Details
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Patient"
                    value={selectedAppointment.patientName}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Time"
                    value={`${selectedAppointment.time} (${selectedAppointment.duration} minutes)`}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Type"
                    value={selectedAppointment.type}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedAppointment.status}
                    select
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="no-show">No Show</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    placeholder="Add appointment notes..."
                    sx={{ mb: 2 }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={() => setDialogOpen(false)}>
                  Save Changes
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DailySchedule;