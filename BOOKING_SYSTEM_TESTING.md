# Booking System Testing Guide

## Overview

This guide provides comprehensive testing instructions for the Pedro Martinez DMD dental booking system. It covers unit tests, component tests, integration tests, manual testing procedures, and performance considerations.

## Table of Contents

1. [Test Architecture](#test-architecture)
2. [Running Tests](#running-tests)
3. [Unit Tests](#unit-tests)
4. [Component Tests](#component-tests)
5. [Integration Tests](#integration-tests)
6. [Manual Testing Checklist](#manual-testing-checklist)
7. [Performance Testing](#performance-testing)
8. [Test Data Management](#test-data-management)
9. [Troubleshooting](#troubleshooting)

## Test Architecture

### Test Structure
```
src/__tests__/
├── services/           # Unit tests for services
│   └── AppointmentService.test.ts
├── components/         # Component tests
│   ├── BookAppointmentButton.test.tsx
│   └── EnhancedBookingForm.test.tsx
├── integration/        # Integration tests
│   └── BookingFlow.integration.test.tsx
└── utils/             # Test utilities and helpers
    └── testDataSetup.ts
```

### Testing Stack
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **MSW (Mock Service Worker)**: API mocking (optional for E2E)

## Running Tests

### All Tests
```bash
npm test
# or
yarn test
```

### Watch Mode
```bash
npm test -- --watch
# or
yarn test --watch
```

### Coverage Report
```bash
npm test -- --coverage
# or
yarn test --coverage
```

### Specific Test Suite
```bash
# Run only service tests
npm test -- AppointmentService

# Run only component tests
npm test -- components/

# Run only integration tests
npm test -- integration/
```

## Unit Tests

### AppointmentService Tests

The `AppointmentService.test.ts` file covers all methods of the appointment service:

#### Test Categories:
1. **Service Management**
   - `getServices()`: Fetching available services
   - Error handling for service fetch failures

2. **Staff Management**
   - `getStaff()`: Fetching staff with/without filters
   - Specialization-based filtering

3. **Availability Management**
   - `getAvailableSlots()`: Time slot generation
   - `getAvailableProviders()`: Provider availability aggregation
   - Empty slot handling

4. **Appointment Operations**
   - `createAppointment()`: Booking creation
   - `cancelAppointment()`: Cancellation with slot release
   - `rescheduleAppointment()`: Rescheduling workflow

5. **Patient Management**
   - `createOrGetPatient()`: Patient creation/retrieval
   - Insurance information updates
   - Authentication handling

#### Example Test Pattern:
```typescript
describe('AppointmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServices', () => {
    it('should fetch all services ordered by name', async () => {
      // Arrange
      const mockServices = [/* test data */];
      (supabase.from as jest.Mock).mockReturnValue(/* mock query */);

      // Act
      const result = await AppointmentService.getServices();

      // Assert
      expect(result).toEqual(mockServices);
    });
  });
});
```

## Component Tests

### BookAppointmentButton Tests

Tests the button component that triggers the booking form:

#### Test Coverage:
- **Rendering**: Default props, custom text, button variants
- **Interaction**: Click handling, form opening/closing
- **Props**: Initial service passing, success callbacks
- **Accessibility**: ARIA labels, focus management

### EnhancedBookingForm Tests

Comprehensive tests for the multi-step booking form:

#### Test Coverage:
1. **Dialog Management**
   - Open/close states
   - Stepper navigation

2. **Service Selection (Step 1)**
   - Service loading and display
   - Selection handling
   - Validation

3. **Date & Time Selection (Step 2)**
   - Date picker interaction
   - Provider availability loading
   - Time slot selection
   - No availability scenarios

4. **Patient Information (Step 3)**
   - Form field validation
   - Email/phone format validation
   - Insurance field toggling

5. **Review & Confirmation (Step 4)**
   - Summary display
   - Submission handling
   - Success/error states

#### Key Test Patterns:
```typescript
describe('Step Navigation', () => {
  it('should navigate between steps maintaining data', async () => {
    // Test data persistence across steps
  });
});
```

## Integration Tests

### BookingFlow Integration Tests

End-to-end tests simulating complete user journeys:

#### Test Scenarios:

1. **Complete Booking Flow**
   - Full journey from button click to confirmation
   - All form fields and validations
   - API integration verification

2. **Existing Patient Flow**
   - Patient recognition and data pre-fill
   - Insurance update handling

3. **Error Recovery**
   - Network failures
   - Validation errors
   - Time slot conflicts

4. **Performance**
   - Loading states
   - Button disabling during operations
   - Async operation handling

#### Example Integration Test:
```typescript
it('should complete entire booking flow successfully', async () => {
  // 1. Open booking form
  fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
  
  // 2. Select service
  await selectService('Dental Implant Consultation');
  
  // 3. Select date and time
  await selectDateTime(futureDate, '9:00 AM');
  
  // 4. Fill patient info
  await fillPatientForm(userData);
  
  // 5. Review and confirm
  await confirmBooking();
  
  // 6. Verify success
  expect(screen.getByText('Appointment Confirmed!')).toBeInTheDocument();
});
```

## Manual Testing Checklist

### Pre-Testing Setup
- [ ] Clear browser cache and cookies
- [ ] Ensure test database is properly seeded
- [ ] Verify all services are running (frontend, backend, database)
- [ ] Check network connectivity

### Functional Testing

#### 1. Service Selection
- [ ] All services load and display correctly
- [ ] Service cards show correct information (name, duration, Yomi indicator)
- [ ] Selection highlights the chosen service
- [ ] Cannot proceed without selecting a service

#### 2. Date & Time Selection
- [ ] Date picker restricts past dates
- [ ] Date picker allows up to 3 months in advance
- [ ] Provider availability loads after date selection
- [ ] Time slots display in correct format (12-hour)
- [ ] Selected time slot is visually highlighted
- [ ] "No availability" message appears when appropriate

#### 3. Patient Information
- [ ] All required fields show error when empty
- [ ] Email validation works (invalid formats rejected)
- [ ] Phone validation accepts only 10 digits
- [ ] Insurance fields appear/hide based on selection
- [ ] Form remembers data when navigating back

#### 4. Booking Submission
- [ ] Review screen shows all entered information
- [ ] Loading state appears during submission
- [ ] Success confirmation displays appointment ID
- [ ] Email confirmation mentions are accurate
- [ ] Form closes properly after completion

### Cross-Browser Testing
Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing
- [ ] Keyboard navigation through entire flow
- [ ] Screen reader compatibility
- [ ] Proper ARIA labels
- [ ] Color contrast compliance
- [ ] Focus indicators visible

### Error Scenarios
- [ ] Network disconnection during booking
- [ ] Session timeout handling
- [ ] Double-click prevention on submit
- [ ] Graceful handling of API errors

## Performance Testing

### Key Metrics to Monitor

1. **Load Times**
   - Initial form render: < 500ms
   - Service loading: < 1s
   - Provider availability fetch: < 2s
   - Appointment submission: < 3s

2. **Memory Usage**
   - No memory leaks during repeated open/close
   - Efficient cleanup of event listeners
   - Proper component unmounting

3. **API Call Optimization**
   - Minimize redundant API calls
   - Implement proper caching where appropriate
   - Bundle requests when possible

### Performance Test Script
```javascript
// Example performance test
describe('Performance', () => {
  it('should load services within 1 second', async () => {
    const startTime = performance.now();
    
    render(<BookingForm />);
    await waitFor(() => {
      expect(screen.getByText('Select a Service')).toBeInTheDocument();
    });
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(1000);
  });
});
```

### Load Testing Scenarios

1. **Concurrent Users**
   - Test with 10, 50, 100 simultaneous bookings
   - Monitor response times and error rates

2. **Peak Hours Simulation**
   - Simulate morning rush (8-10 AM)
   - Test system behavior with limited slots

3. **Database Performance**
   - Monitor query execution times
   - Check for N+1 query problems
   - Verify index usage

## Test Data Management

### Using Test Data Factory
```typescript
import { testDataSets, createMockService } from '../utils/testDataSetup';

// Use predefined data sets
const services = testDataSets.services.implantServices;

// Create custom test data
const customService = createMockService({
  name: 'Special Treatment',
  estimated_duration: '120 minutes'
});
```

### Test Database Seeding
```sql
-- Seed test services
INSERT INTO services (name, description, estimated_duration, is_yomi_technology)
VALUES 
  ('Test Implant Consult', 'Test description', '90 minutes', true),
  ('Test Cleaning', 'Test description', '60 minutes', false);

-- Seed test staff
INSERT INTO staff (first_name, last_name, title, specialization, email)
VALUES 
  ('Test', 'Doctor', 'Dr.', 'Implant Specialist', 'test.doctor@clinic.com');

-- Seed test time slots
INSERT INTO provider_time_slots (staff_id, date, start_time, end_time, is_available)
VALUES 
  ('staff-id', '2024-01-15', '09:00:00', '09:30:00', true);
```

## Troubleshooting

### Common Test Issues

1. **Async Timing Issues**
   ```typescript
   // Use waitFor for async operations
   await waitFor(() => {
     expect(screen.getByText('Expected Text')).toBeInTheDocument();
   });
   ```

2. **Mock Not Working**
   ```typescript
   // Ensure mocks are cleared between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Date Picker Issues**
   ```typescript
   // Mock date picker for consistent testing
   jest.mock('@mui/x-date-pickers/DatePicker', () => ({
     DatePicker: ({ onChange }) => (
       <input onChange={(e) => onChange(dayjs(e.target.value))} />
     )
   }));
   ```

### Debugging Tips

1. **Use screen.debug()**
   ```typescript
   screen.debug(); // Prints current DOM
   screen.debug(screen.getByRole('button')); // Print specific element
   ```

2. **Check for Multiple Elements**
   ```typescript
   // When getBy fails, use getAllBy to see duplicates
   const buttons = screen.getAllByRole('button');
   console.log('Found buttons:', buttons.length);
   ```

3. **Async Debugging**
   ```typescript
   // Add custom timeout for debugging
   await waitFor(() => {
     expect(element).toBeInTheDocument();
   }, { timeout: 5000 });
   ```

## Best Practices

1. **Test Isolation**
   - Each test should be independent
   - Clean up after each test
   - Don't rely on test execution order

2. **Meaningful Assertions**
   ```typescript
   // Bad
   expect(result).toBeTruthy();
   
   // Good
   expect(result).toEqual({ id: 'apt-123', status: 'scheduled' });
   ```

3. **User-Centric Testing**
   - Test from the user's perspective
   - Use accessible queries (getByRole, getByLabelText)
   - Avoid implementation details

4. **Test Organization**
   - Group related tests with describe blocks
   - Use clear, descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

## Continuous Integration

### GitHub Actions Configuration
```yaml
name: Run Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm test -- --bail --findRelatedTests"
    }
  }
}
```

## Reporting

### Test Coverage Goals
- Overall: > 80%
- Critical paths: > 95%
- New features: 100%

### Monitoring Test Health
- Track flaky tests
- Monitor test execution time
- Review coverage trends
- Document known issues

---

For questions or issues with testing, please refer to the main project documentation or contact the development team.