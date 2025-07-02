-- Enable anonymous access for appointment booking
-- Run this to ensure the anon key can access the tables

-- First, let's check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('patients', 'appointments', 'services', 'staff', 'provider_time_slots');

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Make sure anon role has proper access
-- First drop all existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I CASCADE', 
            'public_access_' || r.tablename, 'public', r.tablename);
    END LOOP;
END $$;

-- Create new simple policies for each table
-- Services - full public access
CREATE POLICY "public_access_services" ON services
FOR ALL USING (true) WITH CHECK (true);

-- Staff - full public access  
CREATE POLICY "public_access_staff" ON staff
FOR ALL USING (true) WITH CHECK (true);

-- Patients - full public access
CREATE POLICY "public_access_patients" ON patients
FOR ALL USING (true) WITH CHECK (true);

-- Appointments - full public access
CREATE POLICY "public_access_appointments" ON appointments
FOR ALL USING (true) WITH CHECK (true);

-- Provider time slots - full public access
CREATE POLICY "public_access_provider_time_slots" ON provider_time_slots
FOR ALL USING (true) WITH CHECK (true);

-- Financial transactions - authenticated only
DROP POLICY IF EXISTS "public_access_financial_transactions" ON financial_transactions;
CREATE POLICY "auth_only_financial_transactions" ON financial_transactions
FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Grant all necessary permissions to anon
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Verify the policies are created
SELECT tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;