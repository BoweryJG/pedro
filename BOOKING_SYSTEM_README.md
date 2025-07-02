# Dr. Pedro Dental Booking System

## Overview
Complete online booking system for Staten Island Advanced Dentistry, featuring real-time availability, automated SMS confirmations, and patient management.

## Features
- 🗓️ Real-time appointment scheduling
- 📱 Automated SMS confirmations via Twilio
- 👥 Patient profile management
- 🦷 Service selection (cleanings, implants, emergencies, etc.)
- 👨‍⚕️ Provider selection (Dr. Pedro, Dr. Johnson)
- 📊 Appointment tracking and management
- 🔒 Secure patient data storage

## System Architecture

### Frontend (React + TypeScript)
```
/frontend/src/
├── components/
│   └── EnhancedBookingForm.tsx    # Main booking interface
├── services/
│   └── appointmentService.ts      # API calls and business logic
├── pages/
│   └── TestBooking.tsx           # Booking page component
└── lib/
    └── supabase.ts               # Supabase client configuration
```

### Backend (Supabase)
- **Database**: PostgreSQL with real-time subscriptions
- **Edge Functions**: Serverless functions for SMS sending
- **Authentication**: Supabase Auth (ready for patient login)
- **Storage**: For patient documents (future feature)

### SMS Service (Twilio)
- **Primary Number**: (929) 242-4535 (Dr. Pedro)
- **Backup Number**: (845) 409-0692 (Bowery Creative)
- **A2P Compliance**: Registered campaign for healthcare messaging

## Database Schema

### Core Tables
```sql
appointments
├── id (UUID)
├── patient_id → patients
├── service_id → services  
├── staff_id → staff
├── appointment_date
├── appointment_time
├── status (scheduled/completed/cancelled)
├── confirmation_code
└── notes

patients
├── id (UUID)
├── first_name
├── last_name
├── email
├── phone
├── insurance_provider
└── insurance_member_id

services
├── id (UUID)
├── name
├── description
├── duration
├── price
└── category

staff
├── id (UUID)
├── first_name
├── last_name
├── title (Dr./DDS)
├── specialization
└── email
```

## Booking Process Flow

1. **Patient Information**
   - Name, email, phone
   - Insurance details (optional)
   - Creates or updates patient record

2. **Service Selection**
   - Choose from available services
   - Shows duration and description

3. **Provider & Time Selection**
   - Select preferred provider or any available
   - Calendar shows available dates
   - Time slots based on provider availability

4. **Confirmation**
   - Review appointment details
   - Add notes if needed
   - Submit booking

5. **Automated Confirmation**
   - Appointment saved to database
   - SMS sent immediately via Twilio
   - Confirmation code generated

## Key Features Implementation

### Real-Time Availability
```typescript
// Checks provider schedules and existing appointments
const slots = await supabase.rpc('generate_time_slots', {
  p_staff_id: staffId,
  p_date: date,
  p_slot_duration: duration
});
```

### SMS Integration
```typescript
// Automatic SMS on booking
await supabase.functions.invoke('send-appointment-sms', {
  body: {
    appointmentId: appointment.id,
    phone: patient.phone,
    message: confirmationMessage
  }
});
```

### Conflict Prevention
- Database constraints prevent double-booking
- Time slots marked unavailable immediately
- Real-time updates across all sessions

## Environment Setup

### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Edge Functions (via Supabase Dashboard)
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

## Running the System

### Development
```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Frontend runs on http://localhost:5173
```

### Testing Booking
1. Navigate to http://localhost:5173/booking
2. Fill in patient information
3. Select service and provider
4. Choose available time slot
5. Confirm booking
6. Check for SMS confirmation

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Supabase)
- Database migrations in `/supabase/migrations/`
- Edge Functions deployed via Supabase CLI
- Environment variables set in Supabase Dashboard

## API Endpoints

### Appointment Service Methods
- `getServices()` - List all services
- `getStaff(serviceId?)` - List providers
- `getAvailableSlots(staffId, date)` - Get time slots
- `createAppointment(data)` - Book appointment
- `cancelAppointment(id)` - Cancel booking
- `rescheduleAppointment(id, newDate, newTime)` - Change appointment

## Security Considerations
- Row Level Security (RLS) on all tables
- Sanitized user inputs
- Secure SMS delivery via Twilio
- HIPAA considerations for patient data

## Future Enhancements
- Patient portal with login
- Appointment reminders (24hr before)
- Online forms and document upload
- Payment processing integration
- Video consultation booking
- Multi-location support

## Troubleshooting

### Common Issues
1. **Booking fails**: Check browser console for errors
2. **No SMS received**: See SMS_SETUP_README.md
3. **No available slots**: Verify staff schedules in database
4. **Double booking**: Check database constraints

### Debug Mode
```javascript
// Enable debug logging in appointmentService.ts
console.log('AppointmentService.getServices - result:', { data, error });
```

## Support
- Technical Issues: Check Supabase logs
- SMS Issues: See Twilio dashboard
- Database: Query via Supabase SQL editor