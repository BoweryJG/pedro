import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EnhancedBookingForm } from '../../components/EnhancedBookingForm';
import { AppointmentService } from '../../services/appointmentService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock AppointmentService
jest.mock('../../services/appointmentService');

// Mock MUI Date Picker to avoid complexity in tests
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange, ...props }: any) => (
    <input
      type="date"
      aria-label={label}
      value={value ? value.format('YYYY-MM-DD') : ''}
      onChange={(e) => onChange(e.target.value ? dayjs(e.target.value) : null)}
      {...props}
    />
  )
}));

const mockServices = [
  {
    id: 'service-1',
    name: 'Dental Implant Consultation',
    description: 'Initial consultation for dental implants',
    estimated_duration: '60 minutes',
    is_yomi_technology: true
  },
  {
    id: 'service-2',
    name: 'Regular Checkup',
    description: 'Routine dental examination',
    estimated_duration: '30 minutes',
    is_yomi_technology: false
  }
];

const mockStaff = [
  {
    id: 'staff-1',
    first_name: 'John',
    last_name: 'Doe',
    title: 'Dr.',
    specialization: 'Implant Specialist'
  },
  {
    id: 'staff-2',
    first_name: 'Jane',
    last_name: 'Smith',
    title: 'Dr.',
    specialization: 'General Dentistry'
  }
];

const mockAvailableProviders = [
  {
    staff: mockStaff[0],
    slots: [
      { start_time: '09:00:00', end_time: '09:30:00', is_available: true },
      { start_time: '10:00:00', end_time: '10:30:00', is_available: true },
      { start_time: '14:00:00', end_time: '14:30:00', is_available: true }
    ]
  },
  {
    staff: mockStaff[1],
    slots: [
      { start_time: '11:00:00', end_time: '11:30:00', is_available: true },
      { start_time: '15:00:00', end_time: '15:30:00', is_available: true }
    ]
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {component}
    </LocalizationProvider>
  );
};

describe('EnhancedBookingForm', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AppointmentService.getServices as jest.Mock).mockResolvedValue(mockServices);
    (AppointmentService.getStaff as jest.Mock).mockResolvedValue(mockStaff);
    (AppointmentService.getAvailableProviders as jest.Mock).mockResolvedValue(mockAvailableProviders);
  });

  describe('Dialog Rendering', () => {
    it('should render dialog when open is true', () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Book Your Appointment')).toBeInTheDocument();
    });

    it('should not render dialog when open is false', () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} open={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display stepper with correct steps', () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      expect(screen.getByText('Service & Provider')).toBeInTheDocument();
      expect(screen.getByText('Date & Time')).toBeInTheDocument();
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
      expect(screen.getByText('Review & Confirm')).toBeInTheDocument();
    });
  });

  describe('Step 1: Service Selection', () => {
    it('should load and display services on mount', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Dental Implant Consultation')).toBeInTheDocument();
        expect(screen.getByText('Regular Checkup')).toBeInTheDocument();
      });
      
      expect(AppointmentService.getServices).toHaveBeenCalled();
    });

    it('should display service details correctly', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      await waitFor(() => {
        const implantCard = screen.getByText('Dental Implant Consultation').closest('[class*="Card"]');
        expect(within(implantCard!).getByText('60 minutes')).toBeInTheDocument();
        expect(within(implantCard!).getByText('Yomi Technology')).toBeInTheDocument();
      });
    });

    it('should select service when clicked', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      await waitFor(() => {
        const serviceCard = screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]');
        fireEvent.click(serviceCard!);
      });
      
      // The card should show selected state (implementation specific)
      expect(AppointmentService.getStaff).toHaveBeenCalledWith('service-1');
    });

    it('should load with initial service if provided', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} initialService="service-2" />);
      
      await waitFor(() => {
        expect(AppointmentService.getStaff).toHaveBeenCalledWith('service-2');
      });
    });

    it('should show error when service selection is missing', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please select a service')).toBeInTheDocument();
      });
    });
  });

  describe('Step 2: Date & Time Selection', () => {
    beforeEach(async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Select a service and go to next step
      await waitFor(() => {
        const serviceCard = screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]');
        fireEvent.click(serviceCard!);
      });
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });

    it('should display date picker', () => {
      expect(screen.getByLabelText('Preferred Date')).toBeInTheDocument();
    });

    it('should load available providers when date is selected', async () => {
      const dateInput = screen.getByLabelText('Preferred Date');
      const futureDate = dayjs().add(7, 'days').format('YYYY-MM-DD');
      
      fireEvent.change(dateInput, { target: { value: futureDate } });
      
      await waitFor(() => {
        expect(AppointmentService.getAvailableProviders).toHaveBeenCalledWith(
          'service-1',
          expect.any(Object)
        );
        expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
        expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
      });
    });

    it('should display available time slots for each provider', async () => {
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        expect(screen.getByText('9:00 AM')).toBeInTheDocument();
        expect(screen.getByText('10:00 AM')).toBeInTheDocument();
        expect(screen.getByText('2:00 PM')).toBeInTheDocument();
        expect(screen.getByText('11:00 AM')).toBeInTheDocument();
        expect(screen.getByText('3:00 PM')).toBeInTheDocument();
      });
    });

    it('should select time slot when clicked', async () => {
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        const timeSlot = screen.getByRole('button', { name: '9:00 AM' });
        fireEvent.click(timeSlot);
      });
      
      // Check if the button shows selected state
      const selectedSlot = screen.getByRole('button', { name: '9:00 AM' });
      expect(selectedSlot).toHaveClass('MuiButton-contained');
    });

    it('should show warning when no slots available', async () => {
      (AppointmentService.getAvailableProviders as jest.Mock).mockResolvedValueOnce([]);
      
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        expect(screen.getByText(/no available appointments/i)).toBeInTheDocument();
      });
    });

    it('should validate date and time selection before proceeding', async () => {
      // Try to proceed without selecting date
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please select a date')).toBeInTheDocument();
      });
      
      // Select date but not time
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
      });
      
      await waitFor(() => {
        expect(screen.getByText('Please select a provider and time')).toBeInTheDocument();
      });
    });
  });

  describe('Step 3: Patient Information', () => {
    beforeEach(async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Navigate to patient info step
      await waitFor(() => {
        const serviceCard = screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]');
        fireEvent.click(serviceCard!);
      });
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        const timeSlot = screen.getByRole('button', { name: '9:00 AM' });
        fireEvent.click(timeSlot);
      });
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    });

    it('should display all patient information fields', () => {
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone')).toBeInTheDocument();
      expect(screen.getByLabelText('Insurance Provider')).toBeInTheDocument();
    });

    it('should validate required fields', async () => {
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'invalid-email');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '123');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid 10-digit phone number')).toBeInTheDocument();
      });
    });

    it('should show insurance fields when insurance is selected', async () => {
      const insuranceSelect = screen.getByLabelText('Insurance Provider');
      fireEvent.mouseDown(insuranceSelect);
      
      const blueCrossOption = screen.getByRole('option', { name: 'Blue Cross Blue Shield' });
      fireEvent.click(blueCrossOption);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Member ID')).toBeInTheDocument();
        expect(screen.getByLabelText('Group Number')).toBeInTheDocument();
      });
    });

    it('should hide insurance fields for self-pay', () => {
      expect(screen.queryByLabelText('Member ID')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Group Number')).not.toBeInTheDocument();
    });
  });

  describe('Step 4: Review & Confirm', () => {
    const fillCompleteForm = async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Step 1: Select service
      await waitFor(() => {
        const serviceCard = screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]');
        fireEvent.click(serviceCard!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Step 2: Select date and time
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      await waitFor(() => {
        const timeSlot = screen.getByRole('button', { name: '9:00 AM' });
        fireEvent.click(timeSlot);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Step 3: Fill patient info
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      await user.type(screen.getByLabelText(/additional notes/i), 'Please call before appointment');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
    };

    it('should display appointment summary', async () => {
      await fillCompleteForm();
      
      expect(screen.getByText('Review Your Appointment')).toBeInTheDocument();
      expect(screen.getByText('Dental Implant Consultation')).toBeInTheDocument();
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
      expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('Please call before appointment')).toBeInTheDocument();
    });

    it('should show confirmation alert', async () => {
      await fillCompleteForm();
      
      expect(screen.getByText(/You will receive a confirmation email/i)).toBeInTheDocument();
    });
  });

  describe('Appointment Submission', () => {
    it('should submit appointment successfully', async () => {
      const mockPatient = { id: 'patient-123' };
      const mockAppointmentId = 'appointment-456';
      
      (AppointmentService.createOrGetPatient as jest.Mock).mockResolvedValue(mockPatient);
      (AppointmentService.createAppointment as jest.Mock).mockResolvedValue(mockAppointmentId);
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Fill form quickly
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      fireEvent.change(screen.getByLabelText('Preferred Date'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Submit
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      await waitFor(() => {
        expect(AppointmentService.createOrGetPatient).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          insuranceProvider: undefined,
          insuranceMemberId: '',
          insuranceGroupNumber: ''
        });
        
        expect(AppointmentService.createAppointment).toHaveBeenCalledWith({
          patientId: 'patient-123',
          serviceId: 'service-1',
          staffId: 'staff-1',
          date: expect.any(Object),
          time: '09:00:00',
          duration: 60,
          notes: ''
        });
        
        expect(defaultProps.onSuccess).toHaveBeenCalledWith(mockAppointmentId);
      });
    });

    it('should display confirmation screen after successful booking', async () => {
      const mockAppointmentId = 'appointment-789';
      (AppointmentService.createOrGetPatient as jest.Mock).mockResolvedValue({ id: 'patient-123' });
      (AppointmentService.createAppointment as jest.Mock).mockResolvedValue(mockAppointmentId);
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Quick form fill and submit
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.change(screen.getByLabelText('Preferred Date'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Appointment Confirmed!')).toBeInTheDocument();
        expect(screen.getByText(`Confirmation Code: ${mockAppointmentId}`)).toBeInTheDocument();
        expect(screen.getByText(/confirmation email has been sent/i)).toBeInTheDocument();
      });
    });

    it('should handle submission errors', async () => {
      (AppointmentService.createOrGetPatient as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Quick form fill
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.change(screen.getByLabelText('Preferred Date'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Failed to book appointment. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back through steps', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Go to step 2
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      
      // Go back to step 1
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      
      expect(screen.getByText('Select a Service')).toBeInTheDocument();
    });

    it('should close dialog when cancel is clicked', () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should close dialog after confirmation', async () => {
      (AppointmentService.createOrGetPatient as jest.Mock).mockResolvedValue({ id: 'patient-123' });
      (AppointmentService.createAppointment as jest.Mock).mockResolvedValue('appointment-123');
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Quick form completion
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.change(screen.getByLabelText('Preferred Date'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
      });
      
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading spinner during data fetch', async () => {
      (AppointmentService.getServices as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockServices), 100))
      );
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    it('should disable buttons during loading', async () => {
      (AppointmentService.createOrGetPatient as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ id: 'patient-123' }), 100))
      );
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Quick navigation to submission
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.change(screen.getByLabelText('Preferred Date'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '9:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john@example.com');
      await user.type(screen.getByLabelText('Phone'), '1234567890');
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(confirmButton).toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display service loading error', async () => {
      (AppointmentService.getServices as jest.Mock).mockRejectedValue(new Error('Service unavailable'));
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load services')).toBeInTheDocument();
      });
    });

    it('should display provider loading error', async () => {
      (AppointmentService.getAvailableProviders as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const dateInput = screen.getByLabelText('Preferred Date');
      fireEvent.change(dateInput, { target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } });
      
      await waitFor(() => {
        expect(screen.getByText('Failed to load available times')).toBeInTheDocument();
      });
    });

    it('should clear errors when navigating', async () => {
      renderWithProviders(<EnhancedBookingForm {...defaultProps} />);
      
      // Trigger an error
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      await waitFor(() => {
        expect(screen.getByText('Please select a service')).toBeInTheDocument();
      });
      
      // Select service to clear error
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      expect(screen.queryByText('Please select a service')).not.toBeInTheDocument();
    });
  });
});