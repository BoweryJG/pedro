-- Rollback script for HIPAA compliant RLS policies migration
-- Use this to revert to previous state if needed

-- =====================================================
-- RESTORE PATIENTS TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "patients_select_own" ON patients;
DROP POLICY IF EXISTS "patients_update_own" ON patients;
DROP POLICY IF EXISTS "patients_service_role_all" ON patients;
DROP POLICY IF EXISTS "patients_staff_select" ON patients;
DROP POLICY IF EXISTS "patients_staff_update" ON patients;
DROP POLICY IF EXISTS "patients_anon_insert_booking" ON patients;

-- Restore original policies
CREATE POLICY "Patients can insert their own record" 
ON patients FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Patients can view their own record" 
ON patients FOR SELECT 
USING (true);

-- =====================================================
-- RESTORE APPOINTMENTS TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "appointments_patient_select_own" ON appointments;
DROP POLICY IF EXISTS "appointments_patient_update_own" ON appointments;
DROP POLICY IF EXISTS "appointments_staff_select" ON appointments;
DROP POLICY IF EXISTS "appointments_staff_all" ON appointments;
DROP POLICY IF EXISTS "appointments_anon_insert_booking" ON appointments;
DROP POLICY IF EXISTS "appointments_service_role_all" ON appointments;

-- Restore original policies
CREATE POLICY "Anyone can create appointments" 
ON appointments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view appointments" 
ON appointments FOR SELECT 
USING (true);

CREATE POLICY "Appointments can be updated by staff or patient" 
ON appointments FOR UPDATE 
USING (true);

-- =====================================================
-- RESTORE FINANCIAL_TRANSACTIONS TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "financial_patient_select_own" ON financial_transactions;
DROP POLICY IF EXISTS "financial_staff_all" ON financial_transactions;
DROP POLICY IF EXISTS "financial_service_role_all" ON financial_transactions;

-- Restore original policy
CREATE POLICY "Financial data viewable by authenticated users only" 
ON financial_transactions FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- =====================================================
-- RESTORE STAFF TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "staff_public_select_active" ON staff;
DROP POLICY IF EXISTS "staff_update_own" ON staff;
DROP POLICY IF EXISTS "staff_service_role_all" ON staff;

-- Restore original policy
CREATE POLICY "Staff are viewable by everyone" 
ON staff FOR SELECT 
USING (is_active = true);

-- =====================================================
-- RESTORE SERVICES TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "services_public_select" ON services;
DROP POLICY IF EXISTS "services_staff_all" ON services;
DROP POLICY IF EXISTS "services_service_role_all" ON services;

-- Restore original policy
CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

-- =====================================================
-- RESTORE PROVIDER_TIME_SLOTS TABLE POLICIES
-- =====================================================

-- Drop new policies
DROP POLICY IF EXISTS "time_slots_public_select_available" ON provider_time_slots;
DROP POLICY IF EXISTS "time_slots_staff_select" ON provider_time_slots;
DROP POLICY IF EXISTS "time_slots_staff_all" ON provider_time_slots;
DROP POLICY IF EXISTS "time_slots_anon_update_booking" ON provider_time_slots;
DROP POLICY IF EXISTS "time_slots_service_role_all" ON provider_time_slots;

-- Restore original policies
CREATE POLICY "Time slots are viewable by everyone" 
ON provider_time_slots FOR SELECT 
USING (true);

CREATE POLICY "Time slots can be inserted for booking" 
ON provider_time_slots FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Time slots can be updated for booking" 
ON provider_time_slots FOR UPDATE 
USING (true);

-- =====================================================
-- RESTORE PHONE/SMS TABLE POLICIES
-- =====================================================

-- Drop restrictive policies
DROP POLICY IF EXISTS "phone_calls_service_role_only" ON phone_calls;
DROP POLICY IF EXISTS "voice_calls_service_role_only" ON voice_calls;
DROP POLICY IF EXISTS "sms_conversations_service_role_only" ON sms_conversations;
DROP POLICY IF EXISTS "sms_messages_service_role_only" ON sms_messages;

-- Note: Original phone/SMS policies varied by implementation
-- You may need to restore specific policies based on your original setup

-- =====================================================
-- RESTORE PERMISSIONS
-- =====================================================

-- Restore broader permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON patients, appointments, provider_time_slots TO anon, authenticated;
GRANT UPDATE ON patients, appointments, provider_time_slots TO anon, authenticated;

-- =====================================================
-- REMOVE AUDIT FUNCTIONALITY
-- =====================================================

-- Drop audit triggers
DROP TRIGGER IF EXISTS audit_patients ON patients;
DROP TRIGGER IF EXISTS audit_appointments ON appointments;
DROP TRIGGER IF EXISTS audit_financial_transactions ON financial_transactions;

-- Drop audit function
DROP FUNCTION IF EXISTS audit_trigger_function();

-- Drop audit log table
DROP TABLE IF EXISTS audit_log;

-- =====================================================
-- FINAL NOTES
-- =====================================================

-- This rollback restores the more permissive policies that existed before
-- the HIPAA-compliant migration. Use with caution as it may expose sensitive data.
-- 
-- After running this rollback, you should verify:
-- 1. All original policies are restored correctly
-- 2. Application functionality works as expected
-- 3. Consider implementing a phased approach to security improvements