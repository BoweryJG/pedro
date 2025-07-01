# Booking System Setup Guide

## Overview

The booking system is now integrated with Supabase for a complete appointment management solution. This guide will help you set up and configure the system.

## Features

- **Patient appointment booking** with real-time availability
- **Provider availability management** with customizable schedules
- **Automatic time slot generation** based on provider schedules
- **Holiday and blocked date management**
- **Appointment confirmations and reminders**
- **Insurance information collection**
- **Waiting list functionality**

## Database Setup

### 1. Run Migrations

Execute the following migrations in your Supabase project:

```bash
cd backend
npm run db:push
```

Or manually run these SQL files in order:
1. `backend/supabase/migrations/20250521_initial_schema.sql`
2. `backend/supabase/migrations/20250616_instagram_dm_automation.sql`
3. `backend/supabase/migrations/20250701_booking_system_enhancements.sql`

### 2. Seed Initial Data

```bash
cd backend
npm run db:seed
```

Or manually run:
- `backend/supabase/seed/seed_data.sql`
- `backend/supabase/seed/booking_seed_data.sql`

## Environment Configuration

### 1. Copy the example environment file

```bash
cp .env.example .env
```

### 2. Configure Supabase credentials

Add your Supabase project credentials to `.env`:

```
# Frontend
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

## Frontend Integration

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Using the Booking Component

The booking system provides two main components:

#### BookAppointmentButton

A simple button that opens the booking form:

```tsx
import { BookAppointmentButton } from './components/BookAppointmentButton';

// Basic usage
<BookAppointmentButton />

// With initial service selection
<BookAppointmentButton 
  initialService="service-id-here"
  onSuccess={(appointmentId) => {
    console.log('Appointment booked:', appointmentId);
  }}
/>
```

#### EnhancedBookingForm

The full booking form dialog:

```tsx
import { EnhancedBookingForm } from './components/EnhancedBookingForm';

const [open, setOpen] = useState(false);

<EnhancedBookingForm
  open={open}
  onClose={() => setOpen(false)}
  initialService="optional-service-id"
  onSuccess={(appointmentId) => {
    // Handle success
  }}
/>
```

## Backend Services

### AppointmentService Methods

- `getServices()` - Fetch all available services
- `getStaff(serviceId?)` - Get staff members (optionally filtered by service)
- `getAvailableSlots(staffId, date, duration)` - Get available time slots
- `createAppointment(data)` - Book an appointment
- `cancelAppointment(id, reason)` - Cancel an appointment
- `rescheduleAppointment(id, newDate, newTime)` - Reschedule an appointment

## Managing Provider Availability

### Setting Regular Hours

Insert into `provider_availability` table:

```sql
INSERT INTO provider_availability (staff_id, day_of_week, start_time, end_time)
VALUES 
  ('staff-uuid', 1, '09:00', '17:00'), -- Monday
  ('staff-uuid', 2, '09:00', '17:00'); -- Tuesday
```

### Blocking Dates (Holidays, Vacations)

```sql
INSERT INTO blocked_dates (date, reason, is_full_day)
VALUES ('2025-12-25', 'Christmas Day', true);

-- Or block specific hours
INSERT INTO blocked_dates (staff_id, date, start_time, end_time, reason)
VALUES ('staff-uuid', '2025-07-15', '14:00', '17:00', 'Staff Meeting');
```

## Email Notifications (Optional)

To enable email confirmations and reminders:

1. Set up a Supabase Edge Function for sending emails
2. Configure your email service (SendGrid, Resend, etc.)
3. Update the booking confirmation logic to trigger emails

## Testing the System

1. **Test Provider Availability**
   ```sql
   SELECT * FROM generate_time_slots(
     'staff-id'::uuid,
     '2025-07-15'::date,
     '30 minutes'::interval
   );
   ```

2. **Test Booking Flow**
   - Navigate to your homepage
   - Click "Book Appointment"
   - Select a service, provider, and time
   - Complete the patient information
   - Verify the appointment is created in the database

## Troubleshooting

### Common Issues

1. **No available time slots showing**
   - Check provider_availability table has entries
   - Verify no blocked_dates conflict
   - Ensure date is in the future

2. **Booking fails**
   - Check Supabase RLS policies
   - Verify all required fields are provided
   - Check browser console for errors

3. **Supabase connection issues**
   - Verify environment variables are set
   - Check Supabase project is active
   - Ensure anon key has proper permissions

## Next Steps

1. **Customize Services**: Update the services table with your actual offerings
2. **Add Providers**: Add all your staff members and their schedules
3. **Set Holidays**: Add your practice's holiday schedule
4. **Test Thoroughly**: Book test appointments for each service
5. **Enable Reminders**: Set up email/SMS reminder system

## Support

For issues or questions:
- Check Supabase logs for database errors
- Review browser console for frontend errors
- Ensure all migrations ran successfully