import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { AppointmentService } from '../services/appointmentService';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const TestBooking = () => {
  const [services, setServices] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Testing Supabase connection...');
      console.log('Supabase enabled:', isSupabaseEnabled);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Anon Key (first 20 chars):', import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20));
      
      // Direct test
      console.log('Direct Supabase test...');
      const { data: directData, error: directError } = await supabase
        .from('services')
        .select('*');
      console.log('Direct services query:', { data: directData, error: directError });
      
      // Test 1: Get services
      console.log('Fetching services via AppointmentService...');
      const servicesData = await AppointmentService.getServices();
      console.log('Services:', servicesData);
      setServices(servicesData || []);
      
      // Test 2: Get staff
      console.log('Fetching staff via AppointmentService...');
      const staffData = await AppointmentService.getStaff();
      console.log('Staff:', staffData);
      setStaff(staffData || []);
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Booking System Test
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography>Supabase Enabled: {isSupabaseEnabled ? 'Yes' : 'No'}</Typography>
        <Typography>Environment: {import.meta.env.MODE}</Typography>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Button 
        variant="contained" 
        onClick={testConnection}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Services ({services.length})</Typography>
        {services.map((service) => (
          <Typography key={service.id}>
            - {service.name} ({service.category})
          </Typography>
        ))}
      </Box>
      
      <Box>
        <Typography variant="h6">Staff ({staff.length})</Typography>
        {staff.map((member) => (
          <Typography key={member.id}>
            - {member.title} {member.first_name} {member.last_name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default TestBooking;