-- Fix automatic SMS sending by updating the trigger
-- This will send SMS immediately when appointments are created

-- First, create a function that sends SMS directly
CREATE OR REPLACE FUNCTION send_appointment_sms_immediately()
RETURNS TRIGGER AS $$
DECLARE
    v_patient RECORD;
    v_service RECORD;
    v_staff RECORD;
    v_message TEXT;
    v_formatted_date TEXT;
    v_formatted_time TEXT;
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
        
        -- Send SMS directly using pg_net
        PERFORM net.http_post(
            url := 'https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc1MjM1MiwiZXhwIjoyMDUxMzI4MzUyfQ.HrboJTgQNvDZQ92M9NXf5pTlNUkRfr0F2uqS7eELAsI'
            ),
            body := jsonb_build_object(
                'appointmentId', NEW.id::text,
                'phone', v_patient.phone,
                'message', v_message
            ),
            timeout_milliseconds := 5000
        );
        
        -- Also insert into SMS queue for record keeping
        INSERT INTO sms_queue (id, appointment_id, phone, message, status, created_at, sent_at)
        VALUES (
            gen_random_uuid(),
            NEW.id,
            v_patient.phone,
            v_message,
            'processing',
            NOW(),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old triggers
DROP TRIGGER IF EXISTS appointment_sms_trigger ON appointments;
DROP TRIGGER IF EXISTS appointment_sms_queue_trigger ON appointments;

-- Create new trigger
CREATE TRIGGER send_sms_on_appointment_creation
AFTER INSERT ON appointments
FOR EACH ROW
EXECUTE FUNCTION send_appointment_sms_immediately();

-- Grant permissions
GRANT EXECUTE ON FUNCTION send_appointment_sms_immediately() TO anon, authenticated, service_role;

-- Enable http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;

-- Process any existing pending SMS
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT * FROM sms_queue 
        WHERE status = 'pending' 
        LIMIT 10
    LOOP
        PERFORM net.http_post(
            url := 'https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTc1MjM1MiwiZXhwIjoyMDUxMzI4MzUyfQ.HrboJTgQNvDZQ92M9NXf5pTlNUkRfr0F2uqS7eELAsI'
            ),
            body := jsonb_build_object(
                'appointmentId', r.appointment_id::text,
                'phone', r.phone,
                'message', r.message
            ),
            timeout_milliseconds := 5000
        );
        
        UPDATE sms_queue 
        SET status = 'processing', sent_at = NOW() 
        WHERE id = r.id;
    END LOOP;
END $$;