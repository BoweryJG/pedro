-- Disable SMS queue trigger that might be causing issues
-- Run this to fix appointment booking

-- Check if there's a trigger on appointments table
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    proname as function_name
FROM pg_trigger 
JOIN pg_proc ON pg_proc.oid = pg_trigger.tgfoid
WHERE tgrelid = 'appointments'::regclass
AND tgname LIKE '%sms%';

-- Disable any SMS-related triggers temporarily
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = 'appointments'::regclass 
        AND (tgname LIKE '%sms%' OR tgname LIKE '%notification%')
    LOOP
        EXECUTE format('ALTER TABLE appointments DISABLE TRIGGER %I', r.tgname);
        RAISE NOTICE 'Disabled trigger: %', r.tgname;
    END LOOP;
END $$;

-- Alternative: Create appointments table without any triggers
-- This is a nuclear option if the above doesn't work
/*
CREATE TABLE appointments_backup AS SELECT * FROM appointments;
DROP TABLE appointments CASCADE;
CREATE TABLE appointments LIKE appointments_backup INCLUDING ALL;
INSERT INTO appointments SELECT * FROM appointments_backup;
DROP TABLE appointments_backup;
*/

-- Grant full permissions on appointments
GRANT ALL ON appointments TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;