import { supabase, Tables } from '../lib/supabase';
import dayjs, { Dayjs } from 'dayjs';

export interface TimeSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailableProvider {
  staff: Tables['staff']['Row'];
  slots: TimeSlot[];
}

export class AppointmentService {
  static async getServices() {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  }

  static async getStaff(serviceId?: string) {
    let query = supabase.from('staff').select('*');
    
    if (serviceId) {
      // Filter staff based on service specialization
      query = query.or('specialization.ilike.%implant%,specialization.ilike.%general%');
    }
    
    const { data, error } = await query.order('last_name');
    
    if (error) throw error;
    return data;
  }

  static async getAvailableSlots(
    staffId: string,
    date: Dayjs,
    duration: number = 30
  ): Promise<TimeSlot[]> {
    const { data, error } = await supabase.rpc('generate_time_slots', {
      p_staff_id: staffId,
      p_date: date.format('YYYY-MM-DD'),
      p_slot_duration: `${duration} minutes`
    });
    
    if (error) throw error;
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
    const { data, error } = await supabase.rpc('book_appointment', {
      p_patient_id: appointmentData.patientId,
      p_service_id: appointmentData.serviceId,
      p_staff_id: appointmentData.staffId,
      p_date: appointmentData.date.format('YYYY-MM-DD'),
      p_time: appointmentData.time,
      p_duration: `${appointmentData.duration} minutes`,
      p_notes: appointmentData.notes
    });
    
    if (error) throw error;
    return data;
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
    const { data: existingPatient, error: searchError } = await supabase
      .from('patients')
      .select('*')
      .eq('email', patientData.email)
      .single();
    
    if (!searchError && existingPatient) {
      // Update insurance info if provided
      if (patientData.insuranceProvider) {
        await supabase
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
    
    // Create new patient with anonymous auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: patientData.email,
      password: Math.random().toString(36).slice(-8) // Temporary password
    });
    
    if (authError) throw authError;
    
    // Create patient record
    const { data: newPatient, error: createError } = await supabase
      .from('patients')
      .insert({
        auth_user_id: authData.user!.id,
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
    
    if (createError) throw createError;
    return newPatient;
  }

  static async getUpcomingAppointments(patientId: string) {
    const today = dayjs().format('YYYY-MM-DD');
    
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    await supabase
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
    const { data: currentAppointment, error: fetchError } = await supabase
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