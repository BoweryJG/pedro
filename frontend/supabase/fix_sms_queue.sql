-- Fix SMS queue table permissions
-- Run this if you have an sms_queue table

-- Check if sms_queue table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sms_queue') THEN
        -- Enable RLS
        ALTER TABLE sms_queue ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "public_access_sms_queue" ON sms_queue;
        
        -- Create public access policy
        CREATE POLICY "public_access_sms_queue" ON sms_queue
        FOR ALL USING (true) WITH CHECK (true);
        
        -- Grant permissions
        GRANT ALL ON sms_queue TO anon, authenticated;
        
        RAISE NOTICE 'SMS queue table policies updated';
    ELSE
        RAISE NOTICE 'SMS queue table does not exist';
    END IF;
END $$;