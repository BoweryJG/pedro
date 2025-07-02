import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BookAppointmentButton } from '../../components/BookAppointmentButton';
import { AppointmentService } from '../../services/appointmentService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Mock AppointmentService
jest.mock('../../services/appointmentService');

// Mock date picker for simplicity
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange, ...props }: any) => (
    <input
      type="date"
      aria-label={label}
      value={value ? value.format('YYYY-MM-DD') : ''}
      onChange={(e) => onChange(e.target.value ? dayjs(e.target.value) : null)}
      data-testid="date-picker"
      {...props}
    />
  )
}));

// Test data
const mockServices = [
  {
    id: 'implant-consult',
    name: 'Dental Implant Consultation',
    description: 'Comprehensive evaluation for dental implants',
    estimated_duration: '90 minutes',
    is_yomi_technology: true
  },
  {
    id: 'cleaning',
    name: 'Professional Cleaning',
    description: 'Routine dental cleaning and examination',
    estimated_duration: '60 minutes',
    is_yomi_technology: false
  }
];

const mockStaff = [
  {
    id: 'dr-martinez',
    first_name: 'Pedro',
    last_name: 'Martinez',
    title: 'Dr.',
    specialization: 'Implant Specialist'
  },
  {
    id: 'dr-johnson',
    first_name: 'Sarah',
    last_name: 'Johnson',
    title: 'Dr.',
    specialization: 'General Dentistry'
  }
];

const mockAvailableProviders = [
  {
    staff: mockStaff[0],
    slots: [
      { start_time: '09:00:00', end_time: '10:30:00', is_available: true },
      { start_time: '14:00:00', end_time: '15:30:00', is_available: true }
    ]
  },
  {
    staff: mockStaff[1],
    slots: [
      { start_time: '10:00:00', end_time: '11:00:00', is_available: true },
      { start_time: '16:00:00', end_time: '17:00:00', is_available: true }
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

describe('Booking Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up default mocks
    (AppointmentService.getServices as jest.Mock).mockResolvedValue(mockServices);
    (AppointmentService.getStaff as jest.Mock).mockResolvedValue(mockStaff);
    (AppointmentService.getAvailableProviders as jest.Mock).mockResolvedValue(mockAvailableProviders);
    (AppointmentService.createOrGetPatient as jest.Mock).mockResolvedValue({
      id: 'patient-new-123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    });
    (AppointmentService.createAppointment as jest.Mock).mockResolvedValue('appointment-success-123');
  });

  describe('Complete Booking Flow', () => {
    it('should complete entire booking flow successfully', async () => {
      const onSuccess = jest.fn();
      renderWithProviders(<BookAppointmentButton onSuccess={onSuccess} />);
      
      // Step 1: Click Book Appointment button
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Verify dialog opens
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Book Your Appointment')).toBeInTheDocument();
      
      // Step 2: Select service
      await waitFor(() => {
        expect(screen.getByText('Dental Implant Consultation')).toBeInTheDocument();
      });
      
      const implantService = screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]');
      fireEvent.click(implantService!);
      
      // Verify service is selected and staff is loaded
      expect(AppointmentService.getStaff).toHaveBeenCalledWith('implant-consult');
      
      // Go to next step
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Step 3: Select date and time
      expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
      
      const dateInput = screen.getByTestId('date-picker');
      const selectedDate = dayjs().add(5, 'days').format('YYYY-MM-DD');
      fireEvent.change(dateInput, { target: { value: selectedDate } });
      
      // Wait for providers to load
      await waitFor(() => {
        expect(AppointmentService.getAvailableProviders).toHaveBeenCalledWith(
          'implant-consult',
          expect.any(Object)
        );
        expect(screen.getByText('Dr. Pedro Martinez')).toBeInTheDocument();
      });
      
      // Select time slot
      const morningSlot = screen.getByRole('button', { name: '9:00 AM' });
      fireEvent.click(morningSlot);
      
      // Go to next step
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Step 4: Fill patient information
      expect(screen.getByText('Patient Information')).toBeInTheDocument();
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john.doe@example.com');
      await user.type(screen.getByLabelText('Phone'), '5551234567');
      
      // Select insurance
      const insuranceSelect = screen.getByLabelText('Insurance Provider');
      fireEvent.mouseDown(insuranceSelect);
      fireEvent.click(screen.getByRole('option', { name: 'Blue Cross Blue Shield' }));
      
      await user.type(screen.getByLabelText('Member ID'), 'BCBS123456');
      await user.type(screen.getByLabelText('Group Number'), 'GRP789');
      
      // Add notes
      await user.type(screen.getByLabelText(/additional notes/i), 'First time patient, referred by Dr. Smith');
      
      // Go to review step
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Step 5: Review appointment
      expect(screen.getByText('Review Your Appointment')).toBeInTheDocument();
      
      // Verify all information is displayed correctly
      expect(screen.getByText('Dental Implant Consultation')).toBeInTheDocument();
      expect(screen.getByText('Dr. Pedro Martinez')).toBeInTheDocument();
      expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('5551234567')).toBeInTheDocument();
      expect(screen.getByText('Blue Cross Blue Shield')).toBeInTheDocument();
      expect(screen.getByText('First time patient, referred by Dr. Smith')).toBeInTheDocument();
      
      // Submit appointment
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      // Verify API calls
      await waitFor(() => {
        expect(AppointmentService.createOrGetPatient).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '5551234567',
          insuranceProvider: 'Blue Cross Blue Shield',
          insuranceMemberId: 'BCBS123456',
          insuranceGroupNumber: 'GRP789'
        });
        
        expect(AppointmentService.createAppointment).toHaveBeenCalledWith({
          patientId: 'patient-new-123',
          serviceId: 'implant-consult',
          staffId: 'dr-martinez',
          date: expect.any(Object),
          time: '09:00:00',
          duration: 90,
          notes: 'First time patient, referred by Dr. Smith'
        });
      });
      
      // Verify confirmation screen
      await waitFor(() => {
        expect(screen.getByText('Appointment Confirmed!')).toBeInTheDocument();
        expect(screen.getByText('Confirmation Code: appointment-success-123')).toBeInTheDocument();
      });
      
      // Verify success callback
      expect(onSuccess).toHaveBeenCalledWith('appointment-success-123');
      
      // Close dialog
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      
      // Verify dialog is closed
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should handle booking flow with existing patient', async () => {
      // Mock existing patient
      (AppointmentService.createOrGetPatient as jest.Mock).mockResolvedValue({
        id: 'existing-patient-456',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        insurance_provider: 'Aetna'
      });
      
      renderWithProviders(<BookAppointmentButton />);
      
      // Open booking form
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Quick flow through to patient info
      await waitFor(() => {
        fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(3, 'days').format('YYYY-MM-DD') } 
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '10:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Fill patient info for existing patient
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Jane');
      await user.type(screen.getByLabelText('Last Name'), 'Smith');
      await user.type(screen.getByLabelText('Email'), 'jane.smith@example.com');
      await user.type(screen.getByLabelText('Phone'), '5559876543');
      
      // Continue with flow
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      // Verify patient was found and not created new
      await waitFor(() => {
        expect(AppointmentService.createOrGetPatient).toHaveBeenCalled();
        expect(AppointmentService.createAppointment).toHaveBeenCalledWith(
          expect.objectContaining({
            patientId: 'existing-patient-456'
          })
        );
      });
    });
  });

  describe('Flow with Initial Service', () => {
    it('should pre-select service when initialService is provided', async () => {
      renderWithProviders(<BookAppointmentButton initialService="cleaning" />);
      
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        // Verify cleaning service is pre-selected
        expect(AppointmentService.getStaff).toHaveBeenCalledWith('cleaning');
        
        // Service should already be selected visually
        const cleaningCard = screen.getByText('Professional Cleaning').closest('[class*="Card"]');
        expect(cleaningCard).toHaveStyle({ borderWidth: '2px' });
      });
      
      // Should be able to proceed directly to date selection
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
    });
  });

  describe('Error Handling in Flow', () => {
    it('should handle patient creation error gracefully', async () => {
      (AppointmentService.createOrGetPatient as jest.Mock).mockRejectedValue(
        new Error('Email already in use')
      );
      
      renderWithProviders(<BookAppointmentButton />);
      
      // Quick flow to submission
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(2, 'days').format('YYYY-MM-DD') } 
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '10:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Test');
      await user.type(screen.getByLabelText('Last Name'), 'User');
      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Phone'), '5551112222');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      // Should show error message
      await waitFor(() => {
        expect(screen.getByText('Failed to book appointment. Please try again.')).toBeInTheDocument();
      });
      
      // Should stay on review step
      expect(screen.getByText('Review Your Appointment')).toBeInTheDocument();
    });

    it('should handle appointment creation error', async () => {
      (AppointmentService.createAppointment as jest.Mock).mockRejectedValue(
        new Error('Time slot no longer available')
      );
      
      renderWithProviders(<BookAppointmentButton />);
      
      // Quick flow to submission
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(1, 'day').format('YYYY-MM-DD') } 
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '2:00 PM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Error');
      await user.type(screen.getByLabelText('Last Name'), 'Test');
      await user.type(screen.getByLabelText('Email'), 'error@test.com');
      await user.type(screen.getByLabelText('Phone'), '5553334444');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /confirm booking/i }));
      
      // Should show error
      await waitFor(() => {
        expect(screen.getByText('Failed to book appointment. Please try again.')).toBeInTheDocument();
      });
      
      // User should be able to go back and select different time
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      
      expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
    });
  });

  describe('Flow Cancellation', () => {
    it('should allow user to cancel at any step', async () => {
      renderWithProviders(<BookAppointmentButton />);
      
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Cancel at step 1
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      
      // Open again and proceed to step 2
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      await waitFor(() => {
        fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Cancel at step 2
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      
      // Verify no API calls were made
      expect(AppointmentService.createOrGetPatient).not.toHaveBeenCalled();
      expect(AppointmentService.createAppointment).not.toHaveBeenCalled();
    });
  });

  describe('Data Persistence During Navigation', () => {
    it('should maintain form data when navigating between steps', async () => {
      renderWithProviders(<BookAppointmentButton />);
      
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Select service
      await waitFor(() => {
        fireEvent.click(screen.getByText('Dental Implant Consultation').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Select date and time
      const selectedDate = dayjs().add(10, 'days').format('YYYY-MM-DD');
      fireEvent.change(screen.getByTestId('date-picker'), { target: { value: selectedDate } });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '2:00 PM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Fill patient info
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Persistence');
      await user.type(screen.getByLabelText('Last Name'), 'Test');
      await user.type(screen.getByLabelText('Email'), 'persist@test.com');
      await user.type(screen.getByLabelText('Phone'), '5556667777');
      
      // Go back to step 2
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      
      // Verify time is still selected
      const selectedTimeButton = screen.getByRole('button', { name: '2:00 PM' });
      expect(selectedTimeButton).toHaveClass('MuiButton-contained');
      
      // Go back to step 1
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      
      // Verify service is still selected
      const implantCard = screen.getByText('Dental Implant Consultation').closest('[class*="Card"]');
      expect(implantCard).toHaveStyle({ borderWidth: '2px' });
      
      // Go forward to step 3
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Verify patient data is preserved
      expect(screen.getByLabelText('First Name')).toHaveValue('Persistence');
      expect(screen.getByLabelText('Last Name')).toHaveValue('Test');
      expect(screen.getByLabelText('Email')).toHaveValue('persist@test.com');
      expect(screen.getByLabelText('Phone')).toHaveValue('5556667777');
    });
  });

  describe('Real-time Validation', () => {
    it('should validate data at each step before allowing progression', async () => {
      renderWithProviders(<BookAppointmentButton />);
      
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Try to proceed without selecting service
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText('Please select a service')).toBeInTheDocument();
      
      // Select service and proceed
      await waitFor(() => {
        fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Try to proceed without date
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText('Please select a date')).toBeInTheDocument();
      
      // Select date but not time
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(7, 'days').format('YYYY-MM-DD') } 
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: /next/i }));
      });
      expect(screen.getByText('Please select a provider and time')).toBeInTheDocument();
      
      // Select time and proceed
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '10:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Try to proceed with invalid email
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Valid');
      await user.type(screen.getByLabelText('Last Name'), 'User');
      await user.type(screen.getByLabelText('Email'), 'invalid-email');
      await user.type(screen.getByLabelText('Phone'), '5551234567');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      
      // Fix email but use invalid phone
      await user.clear(screen.getByLabelText('Email'));
      await user.type(screen.getByLabelText('Email'), 'valid@email.com');
      await user.clear(screen.getByLabelText('Phone'));
      await user.type(screen.getByLabelText('Phone'), '123');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      expect(screen.getByText('Please enter a valid 10-digit phone number')).toBeInTheDocument();
    });
  });

  describe('Performance and Loading States', () => {
    it('should show appropriate loading states during async operations', async () => {
      // Delay service loading
      (AppointmentService.getServices as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockServices), 500))
      );
      
      renderWithProviders(<BookAppointmentButton />);
      
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Should show loading spinner
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      // Wait for services to load
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByText('Dental Implant Consultation')).toBeInTheDocument();
      });
      
      // Select service
      fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      // Delay provider loading
      (AppointmentService.getAvailableProviders as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockAvailableProviders), 300))
      );
      
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(5, 'days').format('YYYY-MM-DD') } 
      });
      
      // Should show loading while fetching providers
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByText('Dr. Pedro Martinez')).toBeInTheDocument();
      });
    });

    it('should disable navigation buttons during loading', async () => {
      // Delay appointment creation
      (AppointmentService.createAppointment as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve('appointment-123'), 1000))
      );
      
      renderWithProviders(<BookAppointmentButton />);
      
      // Quick flow to submission
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      await waitFor(() => {
        fireEvent.click(screen.getByText('Professional Cleaning').closest('[class*="CardActionArea"]')!);
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      fireEvent.change(screen.getByTestId('date-picker'), { 
        target: { value: dayjs().add(3, 'days').format('YYYY-MM-DD') } 
      });
      
      await waitFor(() => {
        fireEvent.click(screen.getByRole('button', { name: '10:00 AM' }));
      });
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const user = userEvent.setup();
      await user.type(screen.getByLabelText('First Name'), 'Loading');
      await user.type(screen.getByLabelText('Last Name'), 'Test');
      await user.type(screen.getByLabelText('Email'), 'loading@test.com');
      await user.type(screen.getByLabelText('Phone'), '5558889999');
      
      fireEvent.click(screen.getByRole('button', { name: /next/i }));
      
      const confirmButton = screen.getByRole('button', { name: /confirm booking/i });
      fireEvent.click(confirmButton);
      
      // Buttons should be disabled during submission
      await waitFor(() => {
        expect(confirmButton).toBeDisabled();
        expect(screen.getByRole('button', { name: /back/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      });
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Appointment Confirmed!')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});