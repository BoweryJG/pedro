# Twilio SMS Webhook Setup for Appointment Cancellation

## Features Added
- Patients can cancel appointments by texting back
- Automatic response to cancellation requests
- Logging of all SMS interactions

## How Patients Can Cancel
When patients receive appointment confirmations, they'll see:
```
"Hi John, your appointment for Dental Cleaning with Dr. Pedro on July 3, 2025 at 10:30 AM is confirmed. Code: ABC123. Reply CANCEL ABC123 to cancel or call (929) 242-4535."
```

They can cancel by replying:
- `CANCEL ABC123`
- `C ABC123`
- Just `ABC123`

## Setup Instructions

1. **Log into Twilio Console**
   - Go to https://console.twilio.com
   - Use your credentials

2. **Configure the Phone Number**
   - Go to Phone Numbers > Manage > Active Numbers
   - Click on your number: +1 (929) 242-4535

3. **Set the Webhook URL**
   - In the "Messaging" section
   - Set "A message comes in" webhook to:
   ```
   https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/twilio-webhook
   ```
   - Method: HTTP POST
   - Save the configuration

## Test It
1. Book a test appointment
2. You'll receive SMS with cancellation instructions
3. Reply with `CANCEL [code]` to test cancellation
4. The appointment status will update to "cancelled" in the database

## What Happens
- Patient texts cancellation request
- Twilio sends webhook to your Edge Function
- Function validates the confirmation code
- Cancels the appointment if valid
- Sends confirmation SMS back to patient
- Logs the interaction in `sms_interactions` table

## Monitoring
View SMS interactions in the database:
```sql
SELECT * FROM sms_interactions ORDER BY created_at DESC;
```