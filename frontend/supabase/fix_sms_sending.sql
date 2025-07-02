-- Fix SMS sending by updating the trigger to call Edge Function
-- This will make SMS send immediately when appointments are created

-- First, let's create a function that calls the Edge Function
CREATE OR REPLACE FUNCTION queue_appointment_sms()
RETURNS TRIGGER AS $$
DECLARE
    v_patient RECORD;
    v_service RECORD;
    v_staff RECORD;
    v_message TEXT;
    v_formatted_date TEXT;
    v_formatted_time TEXT;
    v_result JSONB;
BEGIN
    -- Only proceed for new scheduled appointments
    IF NEW.status = 'scheduled' THEN
        -- Get patient details
        SELECT * INTO v_patient FROM patients WHERE id = NEW.patient_id;
        
        -- Get service details
        SELECT * INTO v_service FROM services WHERE id = NEW.service_id;
        
        -- Get staff details
        SELECT * INTO v_staff FROM staff WHERE id = NEW.staff_id;
        
        -- Format date and time
        v_formatted_date := to_char(NEW.appointment_date, 'Month DD, YYYY');
        v_formatted_time := to_char(NEW.appointment_time::time, 'HH12:MI AM');
        
        -- Create message
        v_message := format(
            'Hi %s, your appointment for %s with %s %s on %s at %s is confirmed. Code: %s. Call (929) 242-4535 to reschedule.',
            v_patient.first_name,
            v_service.name,
            v_staff.title,
            v_staff.last_name,
            trim(v_formatted_date),
            trim(v_formatted_time),
            NEW.confirmation_code
        );
        
        -- Insert into SMS queue
        INSERT INTO sms_queue (id, appointment_id, phone, message, status, created_at)
        VALUES (
            gen_random_uuid(),
            NEW.id,
            v_patient.phone,
            v_message,
            'pending',
            NOW()
        );
        
        -- Call Edge Function directly using Supabase's internal function
        -- This will send the SMS immediately
        PERFORM net.http_post(
            url := 'https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTIzNTIsImV4cCI6MjA1MTMyODM1Mn0.qKtWF3SQ9rVevhqVZGX3V_SdW1OFrBvaSrV4S9OU-0w'
            ),
            body := jsonb_build_object(
                'appointmentId', NEW.id::text,
                'phone', v_patient.phone,
                'message', v_message
            )
        );
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger is properly attached
DROP TRIGGER IF EXISTS appointment_sms_trigger ON appointments;
CREATE TRIGGER appointment_sms_trigger
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION queue_appointment_sms();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION queue_appointment_sms() TO anon, authenticated, service_role;

-- Test by manually sending pending SMS
UPDATE sms_queue 
SET status = 'pending' 
WHERE id IN (
    SELECT id FROM sms_queue 
    WHERE status = 'pending' 
    ORDER BY created_at DESC 
    LIMIT 1
);