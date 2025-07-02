# Booking System Enhancements

This document details the enhanced features added to the booking system, including multi-language support, recurring appointments, group bookings, and more.

## Table of Contents

1. [Multi-Language Support](#multi-language-support)
2. [Recurring Appointments](#recurring-appointments)
3. [Group Booking](#group-booking)
4. [SMS Reminders Integration](#sms-reminders-integration)
5. [Calendar Sync](#calendar-sync)
6. [Appointment History](#appointment-history)
7. [Provider Vacation Management](#provider-vacation-management)
8. [Real-time Updates](#real-time-updates)

## Multi-Language Support

### Overview
The booking system now supports multiple languages with easy switching between English, Spanish, and Chinese.

### Implementation
```tsx
import { MultiLanguageBooking } from './components/booking-enhancements/MultiLanguageBooking';

// Usage
<MultiLanguageBooking
  open={open}
  onClose={onClose}
  availableLanguages={['en', 'es', 'zh']}
/>
```

### Features
- Language selector in booking dialog
- Translated UI elements
- Support for RTL languages (can be extended)
- Persistent language preference

### Adding New Languages
1. Add translations to `translations` object in `MultiLanguageBooking.tsx`
2. Add language code to `availableLanguages` array
3. Update language selector display names

## Recurring Appointments

### Overview
Patients can schedule recurring appointments with flexible patterns and end conditions.

### Usage
```tsx
import { RecurringAppointments, RecurrencePattern } from './components/booking-enhancements/RecurringAppointments';

const [recurrence, setRecurrence] = useState<RecurrencePattern>({
  enabled: false,
  type: 'weekly',
  interval: 1,
  endType: 'after',
  occurrences: 4,
});

<RecurringAppointments
  value={recurrence}
  onChange={setRecurrence}
  startDate={selectedDate}
  serviceId={serviceId}
  staffId={staffId}
/>
```

### Recurrence Patterns
- **Daily**: Every N days
- **Weekly**: Specific days of the week
- **Monthly**: Same day each month
- **Custom**: Select specific dates

### End Conditions
- Never (ongoing)
- After N occurrences
- On specific date

### Database Schema Update
```sql
-- Add to appointments table
ALTER TABLE appointments
ADD COLUMN recurrence_group_id UUID,
ADD COLUMN recurrence_pattern JSONB;

-- Create recurrence groups table
CREATE TABLE recurrence_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    pattern JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Group Booking

### Overview
Book appointments for multiple people (families, corporate groups) with coordinated scheduling.

### Usage
```tsx
import { GroupBooking, GroupBookingData } from './components/booking-enhancements/GroupBooking';

const [groupData, setGroupData] = useState<GroupBookingData>({
  type: 'family',
  members: [],
  preferSameTime: true,
  preferSameProvider: false,
});

<GroupBooking
  value={groupData}
  onChange={setGroupData}
  maxGroupSize={6}
  serviceId={serviceId}
/>
```

### Features
- Add up to 6 group members
- Family, corporate, or custom groups
- Relationship tracking for families
- Primary contact designation
- Same time/provider preferences

### Database Schema
```sql
-- Group bookings table
CREATE TABLE group_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT CHECK (type IN ('family', 'corporate', 'custom')),
    primary_contact_id UUID REFERENCES patients(id),
    prefer_same_time BOOLEAN DEFAULT false,
    prefer_same_provider BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link appointments to groups
ALTER TABLE appointments
ADD COLUMN group_booking_id UUID REFERENCES group_bookings(id);
```

## SMS Reminders Integration

### Overview
Send appointment reminders via SMS using Twilio or similar services.

### Setup
```bash
# Install Twilio SDK
npm install twilio

# Environment variables
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Implementation
```typescript
// backend/services/smsService.ts
import twilio from 'twilio';

export class SMSService {
  private client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  async sendReminder(appointment: any) {
    const message = `Reminder: You have an appointment on ${appointment.date} at ${appointment.time}`;
    
    return this.client.messages.create({
      body: message,
      to: appointment.patient.phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  }
}
```

### Database Schema
```sql
-- SMS preferences
ALTER TABLE patients
ADD COLUMN sms_reminders_enabled BOOLEAN DEFAULT true,
ADD COLUMN sms_reminder_hours INTEGER[] DEFAULT ARRAY[24, 2];
```

## Calendar Sync

### Overview
Sync appointments with Google Calendar, Outlook, and iCal.

### Google Calendar Integration
```typescript
// services/calendarSync.ts
import { google } from 'googleapis';

export class CalendarSyncService {
  async syncToGoogleCalendar(appointment: any, authToken: string) {
    const calendar = google.calendar({ version: 'v3', auth: authToken });
    
    const event = {
      summary: `Dental Appointment - ${appointment.service.name}`,
      location: 'Dr. Pedro\'s Office',
      description: appointment.notes,
      start: {
        dateTime: appointment.dateTime,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: appointment.endDateTime,
        timeZone: 'America/New_York',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };
    
    return calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
  }
}
```

### iCal Export
```typescript
export function generateICalEvent(appointment: any): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
UID:${appointment.id}@drpedro.com
DTSTAMP:${formatICalDate(new Date())}
DTSTART:${formatICalDate(appointment.dateTime)}
DTEND:${formatICalDate(appointment.endDateTime)}
SUMMARY:Dental Appointment - ${appointment.service.name}
LOCATION:Dr. Pedro's Office
END:VEVENT
END:VCALENDAR`;
}
```

## Appointment History

### Overview
View past appointments and easily rebook similar services.

### Implementation
```tsx
// components/AppointmentHistory.tsx
export const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    AppointmentService.getAppointmentHistory(patientId)
      .then(setAppointments);
  }, [patientId]);
  
  const handleRebook = (appointment: any) => {
    // Pre-fill booking form with previous appointment details
    openBookingForm({
      serviceId: appointment.service_id,
      staffId: appointment.staff_id,
      notes: `Follow-up to appointment on ${appointment.date}`,
    });
  };
  
  return (
    <List>
      {appointments.map(apt => (
        <ListItem key={apt.id}>
          <ListItemText
            primary={apt.service.name}
            secondary={`${apt.date} with ${apt.staff.name}`}
          />
          <Button onClick={() => handleRebook(apt)}>
            Book Again
          </Button>
        </ListItem>
      ))}
    </List>
  );
};
```

## Provider Vacation Management

### Overview
Providers can block out vacation dates and manage their availability.

### UI Implementation
```tsx
// components/ProviderVacationManager.tsx
export const ProviderVacationManager: React.FC = ({ staffId }) => {
  const [vacations, setVacations] = useState([]);
  
  const addVacation = async (dateRange: DateRange) => {
    await AppointmentService.addBlockedDates({
      staff_id: staffId,
      start_date: dateRange.start,
      end_date: dateRange.end,
      reason: 'Vacation',
      is_full_day: true,
    });
  };
  
  return (
    <Box>
      <DateRangePicker
        onChange={addVacation}
        disablePast
      />
      <List>
        {vacations.map(v => (
          <ListItem key={v.id}>
            {v.start_date} - {v.end_date}: {v.reason}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
```

### Database Updates
```sql
-- Enhanced blocked dates
ALTER TABLE blocked_dates
ADD COLUMN end_date DATE,
ADD COLUMN recurring BOOLEAN DEFAULT false,
ADD COLUMN recurrence_pattern JSONB;
```

## Real-time Updates

### Overview
Use WebSockets for real-time availability updates.

### Implementation with Supabase Realtime
```typescript
// hooks/useRealtimeAvailability.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeAvailability(staffId: string, date: string) {
  const [slots, setSlots] = useState([]);
  
  useEffect(() => {
    // Initial fetch
    fetchAvailableSlots(staffId, date).then(setSlots);
    
    // Subscribe to changes
    const subscription = supabase
      .channel('availability-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'provider_time_slots',
          filter: `staff_id=eq.${staffId}&date=eq.${date}`,
        },
        (payload) => {
          // Re-fetch slots on any change
          fetchAvailableSlots(staffId, date).then(setSlots);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [staffId, date]);
  
  return slots;
}
```

### WebSocket Server (Alternative)
```typescript
// backend/websocket.ts
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

export function broadcastAvailabilityUpdate(staffId: string, date: string) {
  const message = JSON.stringify({
    type: 'availability_update',
    staffId,
    date,
    timestamp: new Date().toISOString(),
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
```

## Testing Enhancements

### Multi-Language Testing
```typescript
describe('MultiLanguageBooking', () => {
  it('switches languages correctly', () => {
    const { getByText, getByRole } = render(<MultiLanguageBooking />);
    
    // Switch to Spanish
    fireEvent.change(getByRole('combobox'), { target: { value: 'es' } });
    expect(getByText('Reservar Cita')).toBeInTheDocument();
    
    // Switch to Chinese
    fireEvent.change(getByRole('combobox'), { target: { value: 'zh' } });
    expect(getByText('预约')).toBeInTheDocument();
  });
});
```

### Recurring Appointments Testing
```typescript
describe('RecurringAppointments', () => {
  it('generates correct weekly pattern', () => {
    const pattern: RecurrencePattern = {
      enabled: true,
      type: 'weekly',
      interval: 2,
      daysOfWeek: [1, 3], // Monday, Wednesday
      endType: 'after',
      occurrences: 4,
    };
    
    const dates = generatePreviewDates(dayjs('2025-07-01'), pattern);
    expect(dates).toHaveLength(4);
    expect(dates[1].day()).toBe(3); // Wednesday
  });
});
```

## Performance Considerations

1. **Lazy Loading**: Load enhancement components only when needed
   ```tsx
   const RecurringAppointments = lazy(() => 
     import('./booking-enhancements/RecurringAppointments')
   );
   ```

2. **Debouncing**: Debounce real-time updates to prevent excessive re-renders
   ```tsx
   const debouncedUpdate = useMemo(
     () => debounce(updateAvailability, 300),
     []
   );
   ```

3. **Caching**: Cache availability data with SWR or React Query
   ```tsx
   const { data: slots } = useSWR(
     ['availability', staffId, date],
     () => fetchAvailableSlots(staffId, date),
     { refreshInterval: 30000 } // Refresh every 30 seconds
   );
   ```

## Security Considerations

1. **Input Validation**: Validate all booking data on both client and server
2. **Rate Limiting**: Limit booking attempts to prevent abuse
3. **CSRF Protection**: Use CSRF tokens for booking submissions
4. **Phone Number Verification**: Verify phone numbers before enabling SMS
5. **Calendar Permissions**: Use OAuth2 for calendar integrations

## Future Enhancements

1. **AI-Powered Scheduling**: Suggest optimal appointment times
2. **Virtual Consultations**: Video appointment booking
3. **Insurance Verification**: Real-time insurance eligibility
4. **Waitlist Management**: Automatic notifications for cancellations
5. **Mobile App**: Native mobile booking experience