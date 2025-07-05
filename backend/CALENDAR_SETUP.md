# Calendar Availability Setup Guide

This guide explains how to set up the production-ready calendar availability system for Julie AI.

## Features

- Real-time appointment availability checking
- Natural language time parsing ("tomorrow at 2pm", "next Tuesday")
- Automatic slot conflict detection
- Provider schedule management
- Blocked time periods (vacations, meetings)
- Conversational rescheduling when slots are unavailable

## Database Setup

1. Run the availability schema migration:
```bash
psql -U your_user -d your_database -f backend/database/availability_schema.sql
```

2. (Optional) Seed sample data for testing:
```bash
psql -U your_user -d your_database -f backend/database/seed_availability.sql
```

## Environment Configuration

Add these variables to your `.env` file:

```env
# Default provider for appointments
DEFAULT_PROVIDER_ID=your_provider_uuid_here

# OpenRouter API key for AI responses
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Setting Up Provider Schedules

1. **Add a provider's weekly schedule:**
```sql
-- Example: Dr. Pedro works Mon-Fri, 9 AM - 5 PM with lunch break
INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time) VALUES
('your-provider-id', 1, '09:00:00', '12:00:00'), -- Monday morning
('your-provider-id', 1, '13:00:00', '17:00:00'), -- Monday afternoon
-- ... repeat for other days
```

2. **Block time for vacations or meetings:**
```sql
INSERT INTO provider_blocked_times (provider_id, start_time, end_time, reason) VALUES
('your-provider-id', '2024-12-25 00:00:00', '2024-12-25 23:59:59', 'Christmas Holiday');
```

## Usage Flow

1. **Patient requests appointment:**
   - "I'd like to book an appointment"
   - Julie AI collects necessary information

2. **Availability check:**
   - System queries real-time availability
   - Returns next 3 available slots

3. **Natural conversation:**
   - "I have tomorrow at 2pm, Thursday at 10am, or Friday at 3:30pm available"
   - Patient: "Thursday works great"

4. **Booking confirmation:**
   - System verifies slot is still available
   - Books appointment and updates calendar
   - Sends confirmation text

5. **Conflict handling:**
   - If requested time unavailable, offers alternatives
   - Smooth conversational flow for rescheduling

## API Endpoints

The calendar service provides these key methods:

- `getAvailableSlots()` - Get available slots for date range
- `getNextAvailableSlots()` - Get next N available slots
- `isSlotAvailable()` - Check specific time availability
- `bookSlot()` - Book appointment and block calendar slot
- `parseTimeReference()` - Parse natural language times

## Testing

1. Install dependencies:
```bash
cd backend
npm install
```

2. Test the calendar service:
```javascript
import calendarService from './services/calendarService.js';

// Get next 3 available slots
const slots = await calendarService.getNextAvailableSlots('provider-id', 3);
console.log(slots);

// Check if specific time is available
const available = await calendarService.isSlotAvailable(
  'provider-id',
  new Date('2024-01-15 14:00:00')
);
```

## Production Considerations

1. **Time Zones:** Currently uses America/Chicago timezone. Update in `calendarService.js` for your location.

2. **Appointment Duration:** Default is 30 minutes. Adjust in `calendarService.js` or make it configurable per service type.

3. **Performance:** Indexes are included for fast queries. Monitor query performance with large datasets.

4. **Concurrency:** The unique constraint on `(provider_id, start_time)` prevents double-booking.

5. **Backup:** Regularly backup the appointment_slots table as it contains booking data.

## Monitoring

Track these metrics for system health:

- Slot availability percentage
- Booking success rate
- Average response time for availability queries
- Failed booking attempts (conflicts)

## Troubleshooting

**Issue:** "Slot not available" errors
- Check provider_schedules has correct hours
- Verify no blocking entries in provider_blocked_times
- Ensure appointment_slots table is being updated

**Issue:** Wrong times displayed
- Verify timezone settings
- Check date-fns formatting in calendarService.js

**Issue:** Double bookings
- Ensure unique constraint exists on appointment_slots
- Check transaction isolation level in Supabase