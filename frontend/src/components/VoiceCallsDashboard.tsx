import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { supabase } from '../services/supabaseClient';
import { format } from 'date-fns';

interface VoiceCall {
  id: string;
  session_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  call_type: string;
  patient_info: any;
  transcript: Array<{ role: string; text: string; timestamp: number }>;
  summary: string | null;
  appointment_booked: boolean;
}

export const VoiceCallsDashboard: React.FC = () => {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<VoiceCall | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVoiceCalls();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('voice_calls_channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'voice_calls' },
        () => fetchVoiceCalls()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchVoiceCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Error fetching voice calls:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredCalls = calls.filter(call => {
    const searchLower = searchTerm.toLowerCase();
    return (
      call.patient_info?.name?.toLowerCase().includes(searchLower) ||
      call.summary?.toLowerCase().includes(searchLower) ||
      call.transcript.some(t => t.text.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h5" gutterBottom>
          Voice Call Transcripts
        </Typography>
        <TextField
          fullWidth
          placeholder="Search by patient name or conversation content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 2 }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date & Time</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Summary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>
                  {format(new Date(call.started_at), 'MMM d, h:mm a')}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon fontSize="small" />
                    {call.patient_info?.name || 'Anonymous'}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <TimeIcon fontSize="small" />
                    {formatDuration(call.duration_seconds)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<PhoneIcon fontSize="small" />}
                    label={call.call_type === 'webrtc' ? 'Web Call' : 'Phone'}
                    size="small"
                    color={call.call_type === 'webrtc' ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" noWrap>
                    {call.summary || 'No summary available'}
                  </Typography>
                </TableCell>
                <TableCell>
                  {call.appointment_booked && (
                    <Chip
                      icon={<EventIcon fontSize="small" />}
                      label="Appointment"
                      size="small"
                      color="success"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => setSelectedCall(call)}
                  >
                    View Transcript
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transcript Dialog */}
      <Dialog
        open={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCall && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Call Transcript - {selectedCall.patient_info?.name || 'Anonymous'}
                </Typography>
                <IconButton onClick={() => setSelectedCall(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(selectedCall.started_at), 'MMMM d, yyyy h:mm a')} •
                  Duration: {formatDuration(selectedCall.duration_seconds)} •
                  {selectedCall.appointment_booked && ' Appointment Booked'}
                </Typography>
              </Box>
              
              {selectedCall.summary && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Summary
                  </Typography>
                  <Typography variant="body2">
                    {selectedCall.summary}
                  </Typography>
                </Paper>
              )}

              <Box>
                {selectedCall.transcript.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 2,
                      display: 'flex',
                      flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                      gap: 1,
                    }}
                  >
                    <Chip
                      label={message.role === 'user' ? 'Patient' : 'Julie'}
                      size="small"
                      color={message.role === 'user' ? 'primary' : 'secondary'}
                    />
                    <Paper
                      sx={{
                        p: 1.5,
                        maxWidth: '70%',
                        bgcolor: message.role === 'user' ? 'primary.light' : 'grey.100',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {format(new Date(message.timestamp), 'h:mm:ss a')}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCall(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};