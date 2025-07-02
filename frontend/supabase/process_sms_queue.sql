-- Process pending SMS messages in the queue
-- This will call the Edge Function to actually send them

DO $$
DECLARE
    r RECORD;
    result JSONB;
BEGIN
    -- Loop through pending SMS messages
    FOR r IN 
        SELECT * FROM sms_queue 
        WHERE status = 'pending' 
        ORDER BY created_at ASC
        LIMIT 5
    LOOP
        BEGIN
            -- Call the Edge Function
            SELECT content::jsonb INTO result
            FROM http((
                'POST',
                'https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/send-appointment-sms',
                ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.settings.supabase_anon_key')),
                      http_header('Content-Type', 'application/json')],
                'application/json',
                json_build_object(
                    'appointmentId', r.appointment_id,
                    'phone', r.phone,
                    'message', r.message
                )::text
            )::http_request);
            
            -- Update the SMS status
            IF result->>'success' = 'true' THEN
                UPDATE sms_queue 
                SET status = 'sent', 
                    sent_at = NOW(),
                    error = NULL
                WHERE id = r.id;
                
                RAISE NOTICE 'SMS sent successfully: %', r.id;
            ELSE
                UPDATE sms_queue 
                SET status = 'failed',
                    error = result->>'error'
                WHERE id = r.id;
                
                RAISE WARNING 'SMS failed: % - %', r.id, result->>'error';
            END IF;
            
        EXCEPTION WHEN OTHERS THEN
            UPDATE sms_queue 
            SET status = 'failed',
                error = SQLERRM
            WHERE id = r.id;
            
            RAISE WARNING 'SMS error: % - %', r.id, SQLERRM;
        END;
    END LOOP;
END $$;

-- Simpler approach - directly call the Edge Function from your app
-- Here's a function you can call to trigger SMS sending
CREATE OR REPLACE FUNCTION send_pending_sms()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- This function exists as a placeholder
    -- The actual SMS sending happens via Edge Function calls
    -- from your application code
    RAISE NOTICE 'Use Edge Functions to process SMS queue';
END;
$$;