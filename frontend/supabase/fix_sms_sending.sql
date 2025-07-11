-- Fix SMS sending by updating the trigger to call Edge Function
-- This will make SMS send immediately when appointments are created
--
-- IMPORTANT: Before running this script, ensure you have:
-- 1. Enabled the Supabase Vault extension: CREATE EXTENSION IF NOT EXISTS vault;
-- 2. Stored your anon key in the vault:
--    INSERT INTO vault.secrets (name, secret) 
--    VALUES ('anon_key', 'your-actual-anon-key');
-- 3. Optionally set the Supabase URL as a configuration parameter:
--    ALTER DATABASE your_database SET app.supabase_url = 'https://your-project.supabase.co';

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
    v_anon_key TEXT;
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
        
        -- Get anon key from vault
        -- This assumes you have stored the anon key in Supabase Vault
        SELECT decrypted_secret INTO v_anon_key
        FROM vault.decrypted_secrets
        WHERE name = 'anon_key';
        
        -- Get Supabase URL from configuration
        SELECT current_setting('app.supabase_url', true) INTO v_supabase_url;
        IF v_supabase_url IS NULL THEN
            v_supabase_url := 'https://tsmtaarwgodklafqlbhm.supabase.co';
        END IF;
        
        -- Call Edge Function directly using Supabase's internal function
        -- This will send the SMS immediately
        PERFORM net.http_post(
            url := v_supabase_url || '/functions/v1/send-appointment-sms',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || v_anon_key
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