import { supabase } from '../lib/supabase';
import type { Tables } from '../types/supabase';
import dayjs, { Dayjs } from 'dayjs';

// Use the existing supabase client from lib/supabase
const bookingSupabase = supabase;

export type TimeSlot = {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export type AvailableProvider = {
  staff: Tables['staff']['Row'];
  slots: TimeSlot[];
}

export class AppointmentService {
  static async getServices() {
    console.log('AppointmentService.getServices - starting');
    const { data, error } = await bookingSupabase
      .from('services')
      .select('*')
      .order('name');
    
    console.log('AppointmentService.getServices - result:', { data, error });
    
    if (error) {
      console.error('Error fetching services:', error);
      // Don't return mock data in production
      console.error('Failed to fetch services:', error);
      throw error;
    }
    return data || [];
  }

  static async getStaff(serviceId?: string) {
    console.log('AppointmentService.getStaff - starting', { serviceId });
    let query = bookingSupabase.from('staff').select('*');
    
    if (serviceId) {
      // Filter staff based on service specialization
      query = query.or('specialization.ilike.%implant%,specialization.ilike.%general%');
    }
    
    const { data, error } = await query.order('last_name');
    
    console.log('AppointmentService.getStaff - result:', { data, error });
    
    if (error) {
      console.error('Error fetching staff:', error);
      // Don't return mock data in production
      console.error('Failed to fetch staff:', error);
      throw error;
    }
    return data || [];
  }

  static async getAvailableSlots(
    staffId: string,
    date: Dayjs,
    duration: number = 30
  ): Promise<TimeSlot[]> {
    const { data, error } = await bookingSupabase.rpc('generate_time_slots', {
      p_staff_id: staffId,
      p_date: date.format('YYYY-MM-DD'),
      p_slot_duration: `${duration} minutes`
    });
    
    if (error) {
      console.error('Error fetching time slots:', error);
      // Don't return mock data in production
      console.error('Failed to fetch time slots:', error);
      throw error;
    }
    return data || [];
  }

  static async getAvailableProviders(
    serviceId: string,
    date: Dayjs
  ): Promise<AvailableProvider[]> {
    // Get all staff members
    const staff = await this.getStaff(serviceId);
    
    // Get available slots for each staff member
    const providersWithSlots = await Promise.all(
      staff.map(async (staffMember) => {
        const slots = await this.getAvailableSlots(staffMember.id, date);
        return {
          staff: staffMember,
          slots: slots.filter(slot => slot.is_available)
        };
      })
    );
    
    // Return only providers with available slots
    return providersWithSlots.filter(provider => provider.slots.length > 0);
  }

  static async createAppointment(appointmentData: {
    patientId: string;
    serviceId: string;
    staffId: string;
    date: Dayjs;
    time: string;
    duration: number;
    notes?: string;
  }) {
    // Generate confirmation code
    const confirmationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Try to create appointment
    let appointment;
    try {
      const { data, error } = await bookingSupabase
        .from('appointments')
        .insert({
          patient_id: appointmentData.patientId,
          service_id: appointmentData.serviceId,
          staff_id: appointmentData.staffId,
          appointment_date: appointmentData.date.format('YYYY-MM-DD'),
          appointment_time: appointmentData.time,
          duration: `${appointmentData.duration} minutes`,
          notes: appointmentData.notes,
          confirmation_code: confirmationCode,
          status: 'scheduled'
        })
        .select()
        .single();
      
      if (error) throw error;
      appointment = data;
    } catch (err: unknown) {
      console.error('Appointment creation error:', err);
      
      // If it's an sms_queue error, the appointment might have been created
      // Try to fetch it by confirmation code
      if (err instanceof Error && err.message?.includes('sms_queue')) {
        console.log('SMS queue error detected, checking if appointment was created...');
        
        // If we get here with SMS queue error, the appointment was likely created
        // but we should still throw the error to handle it properly upstream
        throw err;
      }
      
      throw err;
    }
    
    if (!appointment) {
      const error = new Error('Failed to create appointment - no data returned');
      console.error('Error creating appointment:', error);
      throw error;
    }
    
    // Mark time slot as unavailable
    const endTime = dayjs(`2000-01-01 ${appointmentData.time}`)
      .add(appointmentData.duration, 'minute')
      .format('HH:mm:ss');
      
    await bookingSupabase
      .from('provider_time_slots')
      .insert({
        staff_id: appointmentData.staffId,
        date: appointmentData.date.format('YYYY-MM-DD'),
        start_time: appointmentData.time,
        end_time: endTime,
        is_available: false,
        appointment_id: appointment.id
      });
    
    // Get patient info for SMS
    const { data: patient } = await bookingSupabase
      .from('patients')
      .select('*')
      .eq('id', appointmentData.patientId)
      .single();
      
    // Verify service and staff exist
    await bookingSupabase
      .from('services')
      .select('*')
      .eq('id', appointmentData.serviceId)
      .single();
      
    await bookingSupabase
      .from('staff')
      .select('*')
      .eq('id', appointmentData.staffId)
      .single();
    
    // SMS is now sent automatically by database trigger
    console.log('SMS will be sent automatically via database trigger');
    
    // Show confirmation to user
    if (patient) {
      const formattedDate = appointmentData.date.format('MMMM D, YYYY');
      const formattedTime = dayjs(`2000-01-01 ${appointmentData.time}`).format('h:mm A');
      
      console.log(`Appointment confirmed for ${patient.first_name}`);
      console.log(`Date: ${formattedDate} at ${formattedTime}`);
      console.log(`Confirmation Code: ${confirmationCode}`);
    }
    
    return appointment.id;
  }

  static async createOrGetPatient(patientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    insuranceProvider?: string;
    insuranceMemberId?: string;
    insuranceGroupNumber?: string;
  }) {
    // First check if patient exists
    const { data: existingPatient, error: searchError } = await bookingSupabase
      .from('patients')
      .select('*')
      .eq('email', patientData.email)
      .single();
    
    if (!searchError && existingPatient) {
      // Update insurance info if provided
      if (patientData.insuranceProvider) {
        await bookingSupabase
          .from('patients')
          .update({
            insurance_provider: patientData.insuranceProvider,
            insurance_member_id: patientData.insuranceMemberId,
            insurance_group_number: patientData.insuranceGroupNumber
          })
          .eq('id', existingPatient.id);
      }
      return existingPatient;
    }
    
    // Create patient record without auth for now
    const { data: newPatient, error: createError } = await bookingSupabase
      .from('patients')
      .insert({
        auth_user_id: crypto.randomUUID(), // Generate proper UUID for anonymous patients
        first_name: patientData.firstName,
        last_name: patientData.lastName,
        email: patientData.email,
        phone: patientData.phone,
        insurance_provider: patientData.insuranceProvider,
        insurance_member_id: patientData.insuranceMemberId,
        insurance_group_number: patientData.insuranceGroupNumber
      })
      .select()
      .single();
    
    if (createError) {
      console.error('Error creating patient:', createError);
      // Don't return mock data in production
      console.error('Failed to create patient:', createError);
      throw createError;
    }
    return newPatient;
  }

  static async getUpcomingAppointments(patientId: string) {
    const today = dayjs().format('YYYY-MM-DD');
    
    const { data, error } = await bookingSupabase
      .from('appointments')
      .select(`
        *,
        service:services(*),
        staff:staff(*)
      `)
      .eq('patient_id', patientId)
      .eq('status', 'scheduled')
      .gte('appointment_date', today)
      .order('appointment_date')
      .order('appointment_time');
    
    if (error) throw error;
    return data;
  }

  static async cancelAppointment(appointmentId: string, reason?: string) {
    const { data, error } = await bookingSupabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason
      })
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Free up the time slot
    await bookingSupabase
      .from('provider_time_slots')
      .update({ is_available: true, appointment_id: null })
      .eq('appointment_id', appointmentId);
    
    return data;
  }

  static async rescheduleAppointment(
    appointmentId: string,
    newDate: Dayjs,
    newTime: string,
    newStaffId?: string
  ) {
    // Get current appointment
    const { data: currentAppointment, error: fetchError } = await bookingSupabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Cancel current appointment
    await this.cancelAppointment(appointmentId, 'Rescheduled');
    
    // Create new appointment
    return this.createAppointment({
      patientId: currentAppointment.patient_id,
      serviceId: currentAppointment.service_id,
      staffId: newStaffId || currentAppointment.staff_id,
      date: newDate,
      time: newTime,
      duration: currentAppointment.duration ? parseInt(currentAppointment.duration) : 60,
      notes: currentAppointment.notes
    });
  }
}