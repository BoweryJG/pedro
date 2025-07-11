-- Fix automatic SMS sending by updating the trigger
-- This will send SMS immediately when appointments are created
--
-- IMPORTANT: Before running this script, ensure you have:
-- 1. Enabled the Supabase Vault extension: CREATE EXTENSION IF NOT EXISTS vault;
-- 2. Stored your service role key in the vault:
--    INSERT INTO vault.secrets (name, secret) 
--    VALUES ('service_role_key', 'your-actual-service-role-key');
-- 3. Optionally set the Supabase URL as a configuration parameter:
--    ALTER DATABASE your_database SET app.supabase_url = 'https://your-project.supabase.co';

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
    v_service_role_key TEXT;
    v_supabase_url TEXT;
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
        
        -- Get service role key from vault
        -- This assumes you have stored the service role key in Supabase Vault
        SELECT decrypted_secret INTO v_service_role_key
        FROM vault.decrypted_secrets
        WHERE name = 'service_role_key';
        
        -- Get Supabase URL from configuration
        SELECT current_setting('app.supabase_url', true) INTO v_supabase_url;
        IF v_supabase_url IS NULL THEN
            v_supabase_url := 'https://tsmtaarwgodklafqlbhm.supabase.co';
        END IF;
        
        -- Send SMS directly using pg_net with secure authentication
        PERFORM net.http_post(
            url := v_supabase_url || '/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || v_service_role_key
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
    v_service_role_key TEXT;
    v_supabase_url TEXT;
BEGIN
    -- Get service role key from vault
    SELECT decrypted_secret INTO v_service_role_key
    FROM vault.decrypted_secrets
    WHERE name = 'service_role_key';
    
    -- Get Supabase URL from configuration
    SELECT current_setting('app.supabase_url', true) INTO v_supabase_url;
    IF v_supabase_url IS NULL THEN
        v_supabase_url := 'https://tsmtaarwgodklafqlbhm.supabase.co';
    END IF;
    
    FOR r IN 
        SELECT * FROM sms_queue 
        WHERE status = 'pending' 
        LIMIT 10
    LOOP
        PERFORM net.http_post(
            url := v_supabase_url || '/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || v_service_role_key
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