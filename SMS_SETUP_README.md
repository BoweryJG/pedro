# SMS Appointment Confirmation System

## Overview
This system automatically sends SMS confirmations to patients when they book appointments through the Dr. Pedro dental website. Messages are sent from (929) 242-4535 using Twilio's SMS service.

## How It Works

### Architecture Flow
1. **Patient Books Appointment** 
   - Uses the booking form at `/booking`
   - Fills in personal info, selects service, provider, date/time

2. **Frontend (React)**
   - `EnhancedBookingForm.tsx` collects patient data
   - `appointmentService.ts` creates appointment in Supabase
   - Calls Supabase Edge Function to send SMS

3. **Backend (Supabase)**
   - Stores appointment in `appointments` table
   - Triggers Edge Function `send-appointment-sms`
   - Also queues SMS in `sms_queue` table as backup

4. **SMS Delivery (Twilio)**
   - Edge Function calls Twilio API
   - Sends from Dr. Pedro number: (929) 242-4535
   - Patient receives confirmation with appointment details

## Technical Components

### Database Tables
- `appointments` - Stores all appointment data
- `patients` - Patient information including phone numbers
- `services` - Available dental services
- `staff` - Providers/doctors
- `sms_queue` - Backup queue for SMS messages

### Key Files
- `/frontend/src/components/EnhancedBookingForm.tsx` - Booking UI
- `/frontend/src/services/appointmentService.ts` - Appointment logic
- Supabase Edge Function: `send-appointment-sms` - SMS sending logic

### Environment Variables
```bash
# Twilio Credentials (stored in Edge Function)
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+19292424535
```

## SMS Message Format
```
Hi [FirstName], your appointment for [Service] with [Provider] on [Date] at [Time] is confirmed. Code: [ConfirmationCode]. Call (718) 720-5600 to reschedule.
```

## Troubleshooting

### SMS Not Sending
1. Check Supabase Edge Function logs
2. Verify patient has valid phone number
3. Check `sms_queue` table for failed messages

### Wrong Phone Number
- SMS sends from (929) 242-4535 (Dr. Pedro)
- If you need to change this, update Edge Function

### Delivery Issues
- Error 30034: Phone has opted out - recipient needs to text START to number
- Undelivered status: Usually carrier blocking or invalid number

## Testing SMS

### Send Test Message
```javascript
// Run from backend directory
node test-messaging-service-final.js
```

### Process Queued Messages
```javascript
// If Edge Function fails, process queue manually
node process-sms-queue.js
```

## Twilio Configuration

### Account Settings
- Account Type: Full (not trial)
- A2P 10DLC: Registered and verified
- Campaign: Low Volume Mixed

### Phone Numbers
1. **Primary**: +1 (929) 242-4535 - Greg Pedro
2. **Backup**: +1 (845) 409-0692 - Bowery Creative Agency

Both numbers are in the Default Messaging Service pool.

## Common Issues & Solutions

### "Authentication Error - invalid username"
- Wrong Twilio credentials
- Check Account SID starts with 'AC'
- Verify auth token is correct

### Messages Show as Undelivered
1. Recipient opted out - they need to text START
2. Carrier blocking - contact Twilio support
3. Invalid phone number format

### Messages Coming from Wrong Number
- Edge Function forces specific number
- Update `From` field in Edge Function if needed

## Maintenance

### Update SMS Template
Edit the message template in `/frontend/src/services/appointmentService.ts` line 154

### Change Sending Number
Update Edge Function `send-appointment-sms` line with new number

### View SMS History
1. Twilio Console → Monitor → Messaging
2. Supabase → `sms_queue` table

## Support Contacts
- Twilio Support: 1-844-814-4627
- Supabase Support: support@supabase.io