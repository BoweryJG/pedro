import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  Grid,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { format, addDays, startOfWeek } from 'date-fns';
import { motion } from 'framer-motion';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
  email: string;
  phone: string;
}

interface Shift {
  id: string;
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'regular' | 'overtime' | 'on-call';
}

const StaffScheduler: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  // Mock staff data
  const staffMembers: StaffMember[] = [
    { id: '1', name: 'Dr. Pedro', role: 'Lead Dentist', color: '#FFD93D', email: 'drpedro@clinic.com', phone: '+1 555-0001' },
    { id: '2', name: 'Dr. Sarah Chen', role: 'Associate Dentist', color: '#4ECDC4', email: 'sarah@clinic.com', phone: '+1 555-0002' },
    { id: '3', name: 'Maria Garcia', role: 'Hygienist', color: '#FF6B6B', email: 'maria@clinic.com', phone: '+1 555-0003' },
    { id: '4', name: 'James Wilson', role: 'Assistant', color: '#95E1D3', email: 'james@clinic.com', phone: '+1 555-0004' },
    { id: '5', name: 'Emily Brown', role: 'Receptionist', color: '#F38181', email: 'emily@clinic.com', phone: '+1 555-0005' }
  ];

  // Mock shift data
  const [shifts, setShifts] = useState<Shift[]>([
    { id: '1', staffId: '1', date: addDays(currentWeek, 1), startTime: '08:00', endTime: '17:00', type: 'regular' },
    { id: '2', staffId: '1', date: addDays(currentWeek, 2), startTime: '08:00', endTime: '17:00', type: 'regular' },
    { id: '3', staffId: '2', date: addDays(currentWeek, 1), startTime: '09:00', endTime: '18:00', type: 'regular' },
    { id: '4', staffId: '3', date: addDays(currentWeek, 3), startTime: '08:00', endTime: '16:00', type: 'regular' },
    { id: '5', staffId: '4', date: addDays(currentWeek, 1), startTime: '08:00', endTime: '17:00', type: 'regular' },
    { id: '6', staffId: '5', date: addDays(currentWeek, 1), startTime: '08:00', endTime: '17:00', type: 'regular' }
  ]);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const getShiftsForDayAndStaff = (date: Date, staffId: string) => {
    return shifts.filter(shift => 
      format(shift.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
      shift.staffId === staffId
    );
  };

  const getStaffById = (id: string) => staffMembers.find(s => s.id === id);

  const handleAddShift = () => {
    setSelectedShift(null);
    setDialogOpen(true);
  };

  const handleEditShift = (shift: Shift) => {
    setSelectedShift(shift);
    setDialogOpen(true);
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'regular': return 'primary';
      case 'overtime': return 'warning';
      case 'on-call': return 'secondary';
      default: return 'default';
    }
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
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
            Staff Schedule
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddShift}
            sx={{
              background: 'linear-gradient(45deg, #FFD93D 0%, #FFB03A 100%)',
              color: '#000',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #FFB03A 0%, #FF9500 100%)'
              }
            }}
          >
            Add Shift
          </Button>
        </Box>

        {/* Staff Grid */}
        <Box sx={{ overflowX: 'auto' }}>
          <Grid container spacing={2}>
            {staffMembers.map((staff, index) => (
              <Grid item xs={12} key={staff.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 2
                    }}
                  >
                    <CardContent>
                      {/* Staff Info */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: staff.color,
                            width: 50,
                            height: 50,
                            mr: 2
                          }}
                        >
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: 'white', fontWeight: 600 }}>
                            {staff.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {staff.role}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Week Schedule */}
                      <Grid container spacing={1}>
                        {weekDays.map((day, dayIndex) => {
                          const dayShifts = getShiftsForDayAndStaff(day, staff.id);
                          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                          return (
                            <Grid item key={dayIndex} sx={{ flex: 1 }}>
                              <Box
                                sx={{
                                  textAlign: 'center',
                                  p: 1,
                                  borderRadius: 1,
                                  background: isWeekend 
                                    ? 'rgba(255,255,255,0.02)' 
                                    : dayShifts.length > 0 
                                      ? `${staff.color}20`
                                      : 'rgba(255,255,255,0.05)',
                                  border: `1px solid ${dayShifts.length > 0 ? staff.color : 'rgba(255,255,255,0.1)'}`
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{ 
                                    color: 'rgba(255,255,255,0.5)',
                                    display: 'block',
                                    mb: 0.5
                                  }}
                                >
                                  {format(day, 'EEE')}
                                </Typography>
                                {dayShifts.map(shift => (
                                  <Chip
                                    key={shift.id}
                                    label={`${shift.startTime}-${shift.endTime}`}
                                    size="small"
                                    color={getShiftTypeColor(shift.type) as any}
                                    onClick={() => handleEditShift(shift)}
                                    sx={{
                                      height: 20,
                                      fontSize: '0.65rem',
                                      cursor: 'pointer'
                                    }}
                                  />
                                ))}
                                {dayShifts.length === 0 && !isWeekend && (
                                  <Typography
                                    variant="caption"
                                    sx={{ color: 'rgba(255,255,255,0.3)' }}
                                  >
                                    Off
                                  </Typography>
                                )}
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Shift Dialog */}
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
          <DialogTitle sx={{ color: 'white' }}>
            {selectedShift ? 'Edit Shift' : 'Add New Shift'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Staff Member</InputLabel>
                <Select
                  value={selectedShift?.staffId || ''}
                  label="Staff Member"
                >
                  {staffMembers.map(staff => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                type="date"
                label="Date"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="Start Time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label="End Time"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Shift Type</InputLabel>
                <Select
                  value={selectedShift?.type || 'regular'}
                  label="Shift Type"
                >
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="overtime">Overtime</MenuItem>
                  <MenuItem value="on-call">On Call</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Send notification to staff member"
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            {selectedShift && (
              <Button
                color="error"
                onClick={() => {
                  // Handle delete
                  setDialogOpen(false);
                }}
              >
                Delete
              </Button>
            )}
            <Button onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              {selectedShift ? 'Update' : 'Add'} Shift
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StaffScheduler;