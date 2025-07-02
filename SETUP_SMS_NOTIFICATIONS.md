# Setting Up SMS Notifications

To enable automatic SMS notifications when appointments are booked, follow these steps:

## Option 1: Using Twilio (Recommended)

### 1. Create a Twilio Account
- Go to https://www.twilio.com
- Sign up for a free trial account
- Get your Account SID, Auth Token, and a phone number

### 2. Create a Supabase Edge Function

Create a new edge function in your Supabase project:

```typescript
// supabase/functions/send-sms/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID')!
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN')!
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER')!

serve(async (req) => {
  try {
    const { appointmentId, phone, message } = await req.json()

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: phone,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    })

    const data = await response.json()
    
    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### 3. Deploy the Edge Function

```bash
supabase functions deploy send-sms
```

### 4. Set Environment Variables

In your Supabase dashboard, go to Edge Functions and set:
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN  
- TWILIO_PHONE_NUMBER

### 5. Update the Frontend

Add this to your appointment service after successful booking:

```typescript
// In appointmentService.ts, after creating appointment:
if (appointment && patientData.phone) {
  try {
    await supabase.functions.invoke('send-sms', {
      body: {
        appointmentId: appointment.id,
        phone: patientData.phone,
        message: `Hi ${patientData.firstName}, your appointment for ${serviceName} on ${date} at ${time} has been confirmed. Confirmation code: ${confirmationCode}. Reply STOP to opt out.`
      }
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
}
```

## Option 2: Quick Database Trigger (For Testing)

If you want to test without setting up Twilio, you can create a database trigger that logs SMS that would be sent:

```sql
-- Create a table to log SMS messages
CREATE TABLE sms_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id),
  phone TEXT,
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Create a trigger function
CREATE OR REPLACE FUNCTION send_appointment_sms()
RETURNS TRIGGER AS $$
DECLARE
  v_patient RECORD;
  v_service RECORD;
  v_staff RECORD;
  v_message TEXT;
BEGIN
  -- Only send for new appointments
  IF NEW.status = 'scheduled' AND OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get patient info
    SELECT * INTO v_patient FROM patients WHERE id = NEW.patient_id;
    -- Get service info
    SELECT * INTO v_service FROM services WHERE id = NEW.service_id;
    -- Get staff info
    SELECT * INTO v_staff FROM staff WHERE id = NEW.staff_id;
    
    -- Build message
    v_message := format(
      'Hi %s, your appointment for %s with %s %s on %s at %s has been confirmed. Confirmation: %s',
      v_patient.first_name,
      v_service.name,
      v_staff.title,
      v_staff.last_name,
      to_char(NEW.appointment_date, 'Mon DD'),
      to_char(NEW.appointment_time, 'HH12:MI AM'),
      NEW.confirmation_code
    );
    
    -- Log the SMS
    INSERT INTO sms_log (appointment_id, phone, message)
    VALUES (NEW.id, v_patient.phone, v_message);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER appointment_sms_trigger
AFTER INSERT OR UPDATE ON appointments
FOR EACH ROW
EXECUTE FUNCTION send_appointment_sms();
```

Then you can check the sms_log table to see what messages would be sent.

## Testing

After implementing either option, book a test appointment and check:
- Option 1: You should receive an actual SMS
- Option 2: Check the sms_log table in Supabase

## Production Considerations

1. Add proper error handling
2. Implement retry logic for failed sends
3. Add rate limiting to prevent abuse
4. Store SMS consent preferences
5. Handle opt-outs (STOP messages)
6. Log all SMS for compliance