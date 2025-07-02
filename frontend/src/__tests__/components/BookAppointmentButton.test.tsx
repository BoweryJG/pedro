import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookAppointmentButton } from '../../components/BookAppointmentButton';
import { EnhancedBookingForm } from '../../components/EnhancedBookingForm';

// Mock the EnhancedBookingForm component
jest.mock('../../components/EnhancedBookingForm', () => ({
  EnhancedBookingForm: jest.fn(({ open, onClose, onSuccess }) => {
    if (!open) return null;
    return (
      <div data-testid="booking-form-mock">
        <button onClick={onClose}>Close</button>
        <button onClick={() => onSuccess('test-appointment-id')}>Success</button>
      </div>
    );
  })
}));

describe('BookAppointmentButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<BookAppointmentButton />);
      
      const button = screen.getByRole('button', { name: /book appointment/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('MuiButton-contained');
      expect(button).toHaveClass('MuiButton-sizeLarge');
    });

    it('should render with custom text', () => {
      render(<BookAppointmentButton>Schedule Now</BookAppointmentButton>);
      
      expect(screen.getByRole('button', { name: /schedule now/i })).toBeInTheDocument();
    });

    it('should render with custom button props', () => {
      render(
        <BookAppointmentButton 
          variant="outlined" 
          size="small"
          color="secondary"
          disabled
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-outlined');
      expect(button).toHaveClass('MuiButton-sizeSmall');
      expect(button).toBeDisabled();
    });

    it('should render with calendar icon by default', () => {
      render(<BookAppointmentButton />);
      
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('should render without icon when startIcon is null', () => {
      render(<BookAppointmentButton startIcon={null} />);
      
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should open booking form when clicked', () => {
      render(<BookAppointmentButton />);
      
      const button = screen.getByRole('button', { name: /book appointment/i });
      fireEvent.click(button);
      
      expect(screen.getByTestId('booking-form-mock')).toBeInTheDocument();
      expect(EnhancedBookingForm).toHaveBeenCalledWith(
        expect.objectContaining({
          open: true,
          onClose: expect.any(Function),
          onSuccess: expect.any(Function)
        }),
        expect.any(Object)
      );
    });

    it('should pass initial service to booking form', () => {
      const initialService = 'dental-implant';
      render(<BookAppointmentButton initialService={initialService} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(EnhancedBookingForm).toHaveBeenCalledWith(
        expect.objectContaining({
          initialService: initialService
        }),
        expect.any(Object)
      );
    });

    it('should close booking form when close button is clicked', () => {
      render(<BookAppointmentButton />);
      
      // Open the form
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      expect(screen.getByTestId('booking-form-mock')).toBeInTheDocument();
      
      // Close the form
      fireEvent.click(screen.getByRole('button', { name: /close/i }));
      expect(screen.queryByTestId('booking-form-mock')).not.toBeInTheDocument();
    });

    it('should handle successful booking', () => {
      const onSuccess = jest.fn();
      render(<BookAppointmentButton onSuccess={onSuccess} />);
      
      // Open the form
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Trigger success
      fireEvent.click(screen.getByRole('button', { name: /success/i }));
      
      expect(onSuccess).toHaveBeenCalledWith('test-appointment-id');
      expect(screen.queryByTestId('booking-form-mock')).not.toBeInTheDocument();
    });

    it('should not call onSuccess if not provided', () => {
      render(<BookAppointmentButton />);
      
      // Open the form
      fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
      
      // Trigger success without error
      expect(() => {
        fireEvent.click(screen.getByRole('button', { name: /success/i }));
      }).not.toThrow();
    });
  });

  describe('Props forwarding', () => {
    it('should forward button props correctly', () => {
      const handleClick = jest.fn();
      render(
        <BookAppointmentButton 
          className="custom-class"
          sx={{ margin: 2 }}
          fullWidth
          data-testid="custom-button"
        />
      );
      
      const button = screen.getByTestId('custom-button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveStyle({ width: '100%' });
    });

    it('should not pass onClick to underlying button', () => {
      const onClick = jest.fn();
      render(<BookAppointmentButton onClick={onClick as any} />);
      
      // The onClick should be intercepted and not passed to the button
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(onClick).not.toHaveBeenCalled();
      expect(screen.getByTestId('booking-form-mock')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible button with proper labeling', () => {
      render(<BookAppointmentButton />);
      
      const button = screen.getByRole('button', { name: /book appointment/i });
      expect(button).toHaveAccessibleName('Book Appointment');
    });

    it('should maintain focus management', () => {
      render(<BookAppointmentButton />);
      
      const button = screen.getByRole('button', { name: /book appointment/i });
      button.focus();
      expect(document.activeElement).toBe(button);
      
      fireEvent.click(button);
      // Form opens but button should maintain some focus context
    });
  });
});