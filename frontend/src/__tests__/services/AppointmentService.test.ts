import { AppointmentService } from '../../services/appointmentService';
import { supabase } from '../../lib/supabase';
import dayjs from 'dayjs';

// Mock Supabase
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
    auth: {
      signUp: jest.fn()
    }
  }
}));

describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServices', () => {
    it('should fetch all services ordered by name', async () => {
      const mockServices = [
        { id: '1', name: 'Dental Implant', description: 'Full dental implant' },
        { id: '2', name: 'Consultation', description: 'Initial consultation' }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockServices, error: null })
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await AppointmentService.getServices();

      expect(supabase.from).toHaveBeenCalledWith('services');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('name');
      expect(result).toEqual(mockServices);
    });

    it('should throw error when service fetch fails', async () => {
      const mockError = new Error('Database error');
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: null, error: mockError })
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      await expect(AppointmentService.getServices()).rejects.toThrow('Database error');
    });
  });

  describe('getStaff', () => {
    it('should fetch all staff without service filter', async () => {
      const mockStaff = [
        { id: '1', first_name: 'John', last_name: 'Doe', specialization: 'General' },
        { id: '2', first_name: 'Jane', last_name: 'Smith', specialization: 'Implant' }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockStaff, error: null })
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await AppointmentService.getStaff();

      expect(supabase.from).toHaveBeenCalledWith('staff');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('last_name');
      expect(result).toEqual(mockStaff);
    });

    it('should fetch staff with service filter', async () => {
      const mockStaff = [
        { id: '2', first_name: 'Jane', last_name: 'Smith', specialization: 'Implant' }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        or: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockStaff, error: null })
      };

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await AppointmentService.getStaff('implant-service-id');

      expect(mockQuery.or).toHaveBeenCalledWith('specialization.ilike.%implant%,specialization.ilike.%general%');
      expect(result).toEqual(mockStaff);
    });
  });

  describe('getAvailableSlots', () => {
    it('should fetch available time slots for a staff member', async () => {
      const staffId = 'staff-1';
      const date = dayjs('2024-01-15');
      const duration = 30;
      const mockSlots = [
        { start_time: '09:00:00', end_time: '09:30:00', is_available: true },
        { start_time: '10:00:00', end_time: '10:30:00', is_available: true }
      ];

      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockSlots, error: null });

      const result = await AppointmentService.getAvailableSlots(staffId, date, duration);

      expect(supabase.rpc).toHaveBeenCalledWith('generate_time_slots', {
        p_staff_id: staffId,
        p_date: '2024-01-15',
        p_slot_duration: '30 minutes'
      });
      expect(result).toEqual(mockSlots);
    });

    it('should return empty array when no slots available', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({ data: null, error: null });

      const result = await AppointmentService.getAvailableSlots('staff-1', dayjs());

      expect(result).toEqual([]);
    });
  });

  describe('getAvailableProviders', () => {
    it('should return providers with available slots', async () => {
      const serviceId = 'service-1';
      const date = dayjs('2024-01-15');
      const mockStaff = [
        { id: 'staff-1', first_name: 'John', last_name: 'Doe' },
        { id: 'staff-2', first_name: 'Jane', last_name: 'Smith' }
      ];
      const mockSlots1 = [
        { start_time: '09:00:00', end_time: '09:30:00', is_available: true },
        { start_time: '10:00:00', end_time: '10:30:00', is_available: false }
      ];
      const mockSlots2 = [
        { start_time: '14:00:00', end_time: '14:30:00', is_available: true }
      ];

      // Mock getStaff
      jest.spyOn(AppointmentService, 'getStaff').mockResolvedValue(mockStaff);
      
      // Mock getAvailableSlots calls
      jest.spyOn(AppointmentService, 'getAvailableSlots')
        .mockResolvedValueOnce(mockSlots1)
        .mockResolvedValueOnce(mockSlots2);

      const result = await AppointmentService.getAvailableProviders(serviceId, date);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        staff: mockStaff[0],
        slots: [mockSlots1[0]] // Only available slot
      });
      expect(result[1]).toEqual({
        staff: mockStaff[1],
        slots: [mockSlots2[0]]
      });
    });

    it('should filter out providers with no available slots', async () => {
      const mockStaff = [
        { id: 'staff-1', first_name: 'John', last_name: 'Doe' }
      ];
      const mockSlots = [
        { start_time: '09:00:00', end_time: '09:30:00', is_available: false }
      ];

      jest.spyOn(AppointmentService, 'getStaff').mockResolvedValue(mockStaff);
      jest.spyOn(AppointmentService, 'getAvailableSlots').mockResolvedValue(mockSlots);

      const result = await AppointmentService.getAvailableProviders('service-1', dayjs());

      expect(result).toHaveLength(0);
    });
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        patientId: 'patient-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
        date: dayjs('2024-01-15'),
        time: '10:00:00',
        duration: 60,
        notes: 'Test appointment'
      };
      const mockAppointmentId = 'appointment-123';

      (supabase.rpc as jest.Mock).mockResolvedValue({ data: mockAppointmentId, error: null });

      const result = await AppointmentService.createAppointment(appointmentData);

      expect(supabase.rpc).toHaveBeenCalledWith('book_appointment', {
        p_patient_id: 'patient-1',
        p_service_id: 'service-1',
        p_staff_id: 'staff-1',
        p_date: '2024-01-15',
        p_time: '10:00:00',
        p_duration: '60 minutes',
        p_notes: 'Test appointment'
      });
      expect(result).toBe(mockAppointmentId);
    });

    it('should handle appointment creation without notes', async () => {
      const appointmentData = {
        patientId: 'patient-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
        date: dayjs('2024-01-15'),
        time: '10:00:00',
        duration: 30
      };

      (supabase.rpc as jest.Mock).mockResolvedValue({ data: 'appointment-123', error: null });

      await AppointmentService.createAppointment(appointmentData);

      expect(supabase.rpc).toHaveBeenCalledWith('book_appointment', expect.objectContaining({
        p_notes: undefined
      }));
    });
  });

  describe('createOrGetPatient', () => {
    it('should return existing patient and update insurance info', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890',
        insuranceProvider: 'Blue Cross',
        insuranceMemberId: 'BC123',
        insuranceGroupNumber: 'GRP123'
      };
      const existingPatient = { id: 'patient-1', ...patientData };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: existingPatient, error: null })
      };

      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null })
      };

      (supabase.from as jest.Mock)
        .mockReturnValueOnce(mockQuery)
        .mockReturnValueOnce(mockUpdateQuery);

      const result = await AppointmentService.createOrGetPatient(patientData);

      expect(result).toEqual(existingPatient);
      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        insurance_provider: 'Blue Cross',
        insurance_member_id: 'BC123',
        insurance_group_number: 'GRP123'
      });
    });

    it('should create new patient with auth', async () => {
      const patientData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210'
      };
      const newPatient = { id: 'patient-2', ...patientData };

      // Mock patient search (not found)
      const mockSearchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
      };

      // Mock auth signup
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: 'auth-user-1' } },
        error: null
      });

      // Mock patient creation
      const mockInsertQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: newPatient, error: null })
      };

      (supabase.from as jest.Mock)
        .mockReturnValueOnce(mockSearchQuery)
        .mockReturnValueOnce(mockInsertQuery);

      const result = await AppointmentService.createOrGetPatient(patientData);

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'jane@example.com',
        password: expect.any(String)
      });
      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        auth_user_id: 'auth-user-1',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        insurance_provider: undefined,
        insurance_member_id: undefined,
        insurance_group_number: undefined
      });
      expect(result).toEqual(newPatient);
    });
  });

  describe('getUpcomingAppointments', () => {
    it('should fetch upcoming appointments for a patient', async () => {
      const patientId = 'patient-1';
      const mockAppointments = [
        {
          id: 'apt-1',
          appointment_date: '2024-01-20',
          appointment_time: '10:00:00',
          service: { name: 'Consultation' },
          staff: { first_name: 'John', last_name: 'Doe' }
        }
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis()
      };

      // Chain order calls
      mockQuery.order.mockReturnValueOnce(mockQuery).mockReturnValueOnce({
        data: mockAppointments,
        error: null
      });

      (supabase.from as jest.Mock).mockReturnValue(mockQuery);

      const result = await AppointmentService.getUpcomingAppointments(patientId);

      expect(mockQuery.eq).toHaveBeenCalledWith('patient_id', patientId);
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'scheduled');
      expect(mockQuery.gte).toHaveBeenCalledWith('appointment_date', expect.any(String));
      expect(result).toEqual(mockAppointments);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment and free up time slot', async () => {
      const appointmentId = 'apt-1';
      const reason = 'Patient request';
      const cancelledAppointment = {
        id: appointmentId,
        status: 'cancelled',
        cancelled_at: expect.any(String),
        cancellation_reason: reason
      };

      const mockUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: cancelledAppointment, error: null })
      };

      const mockSlotUpdateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ data: null, error: null })
      };

      (supabase.from as jest.Mock)
        .mockReturnValueOnce(mockUpdateQuery)
        .mockReturnValueOnce(mockSlotUpdateQuery);

      const result = await AppointmentService.cancelAppointment(appointmentId, reason);

      expect(mockUpdateQuery.update).toHaveBeenCalledWith({
        status: 'cancelled',
        cancelled_at: expect.any(String),
        cancellation_reason: reason
      });
      expect(mockSlotUpdateQuery.update).toHaveBeenCalledWith({
        is_available: true,
        appointment_id: null
      });
      expect(result).toEqual(cancelledAppointment);
    });
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule appointment by cancelling and creating new', async () => {
      const appointmentId = 'apt-1';
      const newDate = dayjs('2024-01-25');
      const newTime = '14:00:00';
      const currentAppointment = {
        id: appointmentId,
        patient_id: 'patient-1',
        service_id: 'service-1',
        staff_id: 'staff-1',
        duration: '60 minutes',
        notes: 'Original notes'
      };

      // Mock fetching current appointment
      const mockFetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: currentAppointment, error: null })
      };

      (supabase.from as jest.Mock).mockReturnValueOnce(mockFetchQuery);

      // Mock cancel and create
      jest.spyOn(AppointmentService, 'cancelAppointment').mockResolvedValue(currentAppointment);
      jest.spyOn(AppointmentService, 'createAppointment').mockResolvedValue('new-apt-id');

      const result = await AppointmentService.rescheduleAppointment(
        appointmentId,
        newDate,
        newTime
      );

      expect(AppointmentService.cancelAppointment).toHaveBeenCalledWith(appointmentId, 'Rescheduled');
      expect(AppointmentService.createAppointment).toHaveBeenCalledWith({
        patientId: 'patient-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
        date: newDate,
        time: newTime,
        duration: 60,
        notes: 'Original notes'
      });
      expect(result).toBe('new-apt-id');
    });

    it('should reschedule with new staff member', async () => {
      const appointmentId = 'apt-1';
      const newDate = dayjs('2024-01-25');
      const newTime = '14:00:00';
      const newStaffId = 'staff-2';
      const currentAppointment = {
        id: appointmentId,
        patient_id: 'patient-1',
        service_id: 'service-1',
        staff_id: 'staff-1',
        duration: '30 minutes',
        notes: null
      };

      const mockFetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: currentAppointment, error: null })
      };

      (supabase.from as jest.Mock).mockReturnValueOnce(mockFetchQuery);

      jest.spyOn(AppointmentService, 'cancelAppointment').mockResolvedValue(currentAppointment);
      jest.spyOn(AppointmentService, 'createAppointment').mockResolvedValue('new-apt-id');

      await AppointmentService.rescheduleAppointment(
        appointmentId,
        newDate,
        newTime,
        newStaffId
      );

      expect(AppointmentService.createAppointment).toHaveBeenCalledWith(
        expect.objectContaining({
          staffId: newStaffId
        })
      );
    });
  });
});