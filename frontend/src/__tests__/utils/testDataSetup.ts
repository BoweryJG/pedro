import { Tables } from '../../lib/supabase';
import dayjs, { Dayjs } from 'dayjs';

/**
 * Test data factory functions for creating mock data
 */

export const createMockService = (overrides?: Partial<Tables['services']['Row']>): Tables['services']['Row'] => ({
  id: 'service-' + Math.random().toString(36).substr(2, 9),
  name: 'Test Service',
  description: 'Test service description',
  category: 'general',
  estimated_duration: '60 minutes',
  is_yomi_technology: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockStaff = (overrides?: Partial<Tables['staff']['Row']>): Tables['staff']['Row'] => ({
  id: 'staff-' + Math.random().toString(36).substr(2, 9),
  auth_user_id: 'auth-' + Math.random().toString(36).substr(2, 9),
  first_name: 'Test',
  last_name: 'Doctor',
  title: 'Dr.',
  specialization: 'General Dentistry',
  phone: '555-0123',
  email: 'doctor@test.com',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockPatient = (overrides?: Partial<Tables['patients']['Row']>): Tables['patients']['Row'] => ({
  id: 'patient-' + Math.random().toString(36).substr(2, 9),
  auth_user_id: 'auth-' + Math.random().toString(36).substr(2, 9),
  first_name: 'Test',
  last_name: 'Patient',
  email: 'patient@test.com',
  phone: '555-9876',
  date_of_birth: '1990-01-01',
  insurance_provider: null,
  insurance_member_id: null,
  insurance_group_number: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

export const createMockTimeSlot = (overrides?: Partial<{
  start_time: string;
  end_time: string;
  is_available: boolean;
}>) => ({
  start_time: '09:00:00',
  end_time: '09:30:00',
  is_available: true,
  ...overrides
});

export const createMockAppointment = (overrides?: Partial<Tables['appointments']['Row']>): Tables['appointments']['Row'] => ({
  id: 'appointment-' + Math.random().toString(36).substr(2, 9),
  patient_id: 'patient-123',
  service_id: 'service-123',
  staff_id: 'staff-123',
  appointment_date: dayjs().add(7, 'days').format('YYYY-MM-DD'),
  appointment_time: '10:00:00',
  duration: '60 minutes',
  status: 'scheduled',
  notes: null,
  cancelled_at: null,
  cancellation_reason: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

/**
 * Test data sets for different scenarios
 */

export const testDataSets = {
  services: {
    implantServices: [
      createMockService({
        id: 'implant-consult',
        name: 'Dental Implant Consultation',
        description: 'Comprehensive evaluation for dental implant candidacy',
        category: 'implant',
        estimated_duration: '90 minutes',
        is_yomi_technology: true
      }),
      createMockService({
        id: 'implant-surgery',
        name: 'Implant Placement Surgery',
        description: 'Surgical placement of dental implant with Yomi guidance',
        category: 'implant',
        estimated_duration: '120 minutes',
        is_yomi_technology: true
      }),
      createMockService({
        id: 'implant-restoration',
        name: 'Implant Crown Restoration',
        description: 'Final crown placement on healed implant',
        category: 'implant',
        estimated_duration: '60 minutes',
        is_yomi_technology: false
      })
    ],
    
    generalServices: [
      createMockService({
        id: 'cleaning',
        name: 'Professional Cleaning',
        description: 'Routine dental cleaning and examination',
        category: 'preventive',
        estimated_duration: '60 minutes'
      }),
      createMockService({
        id: 'filling',
        name: 'Tooth Filling',
        description: 'Composite filling for cavity treatment',
        category: 'restorative',
        estimated_duration: '45 minutes'
      }),
      createMockService({
        id: 'exam',
        name: 'Comprehensive Exam',
        description: 'Full dental examination with X-rays',
        category: 'diagnostic',
        estimated_duration: '30 minutes'
      })
    ]
  },

  staff: {
    implantSpecialists: [
      createMockStaff({
        id: 'dr-martinez',
        first_name: 'Pedro',
        last_name: 'Martinez',
        specialization: 'Implant Specialist',
        email: 'pedro.martinez@clinic.com'
      }),
      createMockStaff({
        id: 'dr-chen',
        first_name: 'Lisa',
        last_name: 'Chen',
        specialization: 'Oral Surgery & Implants',
        email: 'lisa.chen@clinic.com'
      })
    ],
    
    generalDentists: [
      createMockStaff({
        id: 'dr-johnson',
        first_name: 'Sarah',
        last_name: 'Johnson',
        specialization: 'General Dentistry',
        email: 'sarah.johnson@clinic.com'
      }),
      createMockStaff({
        id: 'dr-patel',
        first_name: 'Raj',
        last_name: 'Patel',
        specialization: 'Family Dentistry',
        email: 'raj.patel@clinic.com'
      })
    ]
  },

  patients: {
    regularPatients: [
      createMockPatient({
        id: 'patient-regular-1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@email.com',
        insurance_provider: 'Blue Cross Blue Shield',
        insurance_member_id: 'BCBS123456'
      }),
      createMockPatient({
        id: 'patient-regular-2',
        first_name: 'Mary',
        last_name: 'Johnson',
        email: 'mary.johnson@email.com',
        insurance_provider: 'Aetna',
        insurance_member_id: 'AET789012'
      })
    ],
    
    selfPayPatients: [
      createMockPatient({
        id: 'patient-selfpay-1',
        first_name: 'Robert',
        last_name: 'Williams',
        email: 'robert.williams@email.com'
      })
    ]
  },

  timeSlots: {
    morningSlots: [
      createMockTimeSlot({ start_time: '08:00:00', end_time: '08:30:00' }),
      createMockTimeSlot({ start_time: '08:30:00', end_time: '09:00:00' }),
      createMockTimeSlot({ start_time: '09:00:00', end_time: '09:30:00' }),
      createMockTimeSlot({ start_time: '09:30:00', end_time: '10:00:00' }),
      createMockTimeSlot({ start_time: '10:00:00', end_time: '10:30:00' }),
      createMockTimeSlot({ start_time: '10:30:00', end_time: '11:00:00' }),
      createMockTimeSlot({ start_time: '11:00:00', end_time: '11:30:00' }),
      createMockTimeSlot({ start_time: '11:30:00', end_time: '12:00:00' })
    ],
    
    afternoonSlots: [
      createMockTimeSlot({ start_time: '13:00:00', end_time: '13:30:00' }),
      createMockTimeSlot({ start_time: '13:30:00', end_time: '14:00:00' }),
      createMockTimeSlot({ start_time: '14:00:00', end_time: '14:30:00' }),
      createMockTimeSlot({ start_time: '14:30:00', end_time: '15:00:00' }),
      createMockTimeSlot({ start_time: '15:00:00', end_time: '15:30:00' }),
      createMockTimeSlot({ start_time: '15:30:00', end_time: '16:00:00' }),
      createMockTimeSlot({ start_time: '16:00:00', end_time: '16:30:00' }),
      createMockTimeSlot({ start_time: '16:30:00', end_time: '17:00:00' })
    ],
    
    busyDaySlots: [
      createMockTimeSlot({ start_time: '08:00:00', end_time: '08:30:00', is_available: false }),
      createMockTimeSlot({ start_time: '08:30:00', end_time: '09:00:00', is_available: false }),
      createMockTimeSlot({ start_time: '09:00:00', end_time: '09:30:00', is_available: true }),
      createMockTimeSlot({ start_time: '09:30:00', end_time: '10:00:00', is_available: false }),
      createMockTimeSlot({ start_time: '10:00:00', end_time: '10:30:00', is_available: false }),
      createMockTimeSlot({ start_time: '10:30:00', end_time: '11:00:00', is_available: true }),
      createMockTimeSlot({ start_time: '11:00:00', end_time: '11:30:00', is_available: false })
    ]
  },

  appointments: {
    upcomingAppointments: [
      createMockAppointment({
        id: 'apt-upcoming-1',
        appointment_date: dayjs().add(3, 'days').format('YYYY-MM-DD'),
        appointment_time: '10:00:00',
        status: 'scheduled'
      }),
      createMockAppointment({
        id: 'apt-upcoming-2',
        appointment_date: dayjs().add(7, 'days').format('YYYY-MM-DD'),
        appointment_time: '14:00:00',
        status: 'scheduled'
      }),
      createMockAppointment({
        id: 'apt-upcoming-3',
        appointment_date: dayjs().add(14, 'days').format('YYYY-MM-DD'),
        appointment_time: '09:00:00',
        status: 'scheduled'
      })
    ],
    
    pastAppointments: [
      createMockAppointment({
        id: 'apt-past-1',
        appointment_date: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
        appointment_time: '11:00:00',
        status: 'completed'
      }),
      createMockAppointment({
        id: 'apt-past-2',
        appointment_date: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
        appointment_time: '15:00:00',
        status: 'completed'
      })
    ],
    
    cancelledAppointments: [
      createMockAppointment({
        id: 'apt-cancelled-1',
        appointment_date: dayjs().add(5, 'days').format('YYYY-MM-DD'),
        appointment_time: '13:00:00',
        status: 'cancelled',
        cancelled_at: dayjs().subtract(2, 'days').toISOString(),
        cancellation_reason: 'Patient requested reschedule'
      })
    ]
  }
};

/**
 * Helper functions for test scenarios
 */

export const generateAvailableProviders = (
  staff: Tables['staff']['Row'][],
  date: Dayjs,
  slotsPerProvider: number = 4
) => {
  return staff.map(staffMember => {
    const baseHour = 9 + Math.floor(Math.random() * 4);
    const slots = Array.from({ length: slotsPerProvider }, (_, i) => {
      const startHour = baseHour + i;
      return createMockTimeSlot({
        start_time: `${startHour.toString().padStart(2, '0')}:00:00`,
        end_time: `${startHour.toString().padStart(2, '0')}:30:00`,
        is_available: Math.random() > 0.3 // 70% chance of availability
      });
    });
    
    return {
      staff: staffMember,
      slots: slots.filter(slot => slot.is_available)
    };
  }).filter(provider => provider.slots.length > 0);
};

export const generateBookingFormData = (overrides?: Partial<any>) => ({
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  phone: '5551234567',
  insuranceProvider: 'None / Self-Pay',
  insuranceMemberId: '',
  insuranceGroupNumber: '',
  serviceId: 'service-123',
  staffId: 'staff-123',
  date: dayjs().add(7, 'days'),
  time: '10:00:00',
  notes: '',
  ...overrides
});

/**
 * Mock API response generators
 */

export const mockApiResponses = {
  success: {
    services: () => ({ data: testDataSets.services.generalServices, error: null }),
    staff: () => ({ data: testDataSets.staff.generalDentists, error: null }),
    patient: () => ({ data: testDataSets.patients.regularPatients[0], error: null }),
    appointment: () => ({ data: 'appointment-success-123', error: null }),
    timeSlots: () => ({ data: testDataSets.timeSlots.morningSlots, error: null })
  },
  
  errors: {
    networkError: () => ({ data: null, error: new Error('Network request failed') }),
    authError: () => ({ data: null, error: new Error('Authentication required') }),
    validationError: () => ({ data: null, error: new Error('Invalid input data') }),
    conflictError: () => ({ data: null, error: new Error('Time slot no longer available') }),
    serverError: () => ({ data: null, error: new Error('Internal server error') })
  }
};

/**
 * Test scenario builders
 */

export const testScenarios = {
  happyPath: {
    services: testDataSets.services.generalServices,
    staff: testDataSets.staff.generalDentists,
    providers: generateAvailableProviders(testDataSets.staff.generalDentists, dayjs().add(7, 'days')),
    patient: testDataSets.patients.regularPatients[0],
    appointmentId: 'appointment-success-123'
  },
  
  busySchedule: {
    services: testDataSets.services.implantServices,
    staff: testDataSets.staff.implantSpecialists,
    providers: generateAvailableProviders(testDataSets.staff.implantSpecialists, dayjs().add(7, 'days'), 2),
    patient: testDataSets.patients.selfPayPatients[0],
    appointmentId: 'appointment-busy-456'
  },
  
  noAvailability: {
    services: testDataSets.services.implantServices,
    staff: testDataSets.staff.implantSpecialists,
    providers: [],
    patient: null,
    appointmentId: null
  }
};

/**
 * Utility functions for tests
 */

export const waitForLoadingToFinish = async (screen: any) => {
  const progressbars = screen.queryAllByRole('progressbar');
  if (progressbars.length > 0) {
    await screen.findByRole('progressbar', { hidden: true });
  }
};

export const fillPatientForm = async (user: any, screen: any, data: any) => {
  await user.type(screen.getByLabelText('First Name'), data.firstName);
  await user.type(screen.getByLabelText('Last Name'), data.lastName);
  await user.type(screen.getByLabelText('Email'), data.email);
  await user.type(screen.getByLabelText('Phone'), data.phone);
  
  if (data.insuranceProvider && data.insuranceProvider !== 'None / Self-Pay') {
    const insuranceSelect = screen.getByLabelText('Insurance Provider');
    await user.click(insuranceSelect);
    await user.click(screen.getByRole('option', { name: data.insuranceProvider }));
    
    if (data.insuranceMemberId) {
      await user.type(screen.getByLabelText('Member ID'), data.insuranceMemberId);
    }
    if (data.insuranceGroupNumber) {
      await user.type(screen.getByLabelText('Group Number'), data.insuranceGroupNumber);
    }
  }
  
  if (data.notes) {
    await user.type(screen.getByLabelText(/additional notes/i), data.notes);
  }
};

export const selectServiceAndProceed = async (screen: any, serviceName: string) => {
  const serviceCard = screen.getByText(serviceName).closest('[class*="CardActionArea"]');
  await serviceCard.click();
  await screen.getByRole('button', { name: /next/i }).click();
};

export const selectDateTimeAndProceed = async (screen: any, date: string, time: string) => {
  const dateInput = screen.getByLabelText('Preferred Date') || screen.getByTestId('date-picker');
  await dateInput.setAttribute('value', date);
  await dateInput.dispatchEvent(new Event('change', { bubbles: true }));
  
  await screen.findByRole('button', { name: time });
  await screen.getByRole('button', { name: time }).click();
  await screen.getByRole('button', { name: /next/i }).click();
};