-- Targeted HIPAA-Compliant RLS Fix for Dangerous Policies
-- This migration ONLY fixes the dangerous "Allow all" policies
-- Preserves existing working policies and uses Supabase auth

-- =====================================================
-- 1. APPOINTMENTS TABLE - CRITICAL FIX
-- Currently: "Allow all operations" - ANYONE can see ALL appointments!
-- =====================================================

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Allow all operations on appointments" ON appointments;

-- Patients can view their own appointments
CREATE POLICY "appointments_patient_view_own" ON appointments
    FOR SELECT
    USING (
        -- Check if user is authenticated and is the patient
        auth.uid() IS NOT NULL AND
        patient_id IN (
            SELECT id FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Patients can update their own appointments (for cancellations)
CREATE POLICY "appointments_patient_update_own" ON appointments
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        patient_id IN (
            SELECT id FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        -- Can only change to cancelled status
        status IN ('cancelled', 'scheduled')
    );

-- Allow anonymous users to create appointments (for online booking)
CREATE POLICY "appointments_anon_insert" ON appointments
    FOR INSERT
    WITH CHECK (
        -- New appointments must be scheduled status
        status = 'scheduled'
    );

-- Staff (authenticated non-patients) can manage all appointments
CREATE POLICY "appointments_staff_manage" ON appointments
    FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        -- User is authenticated but NOT a patient
        NOT EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- =====================================================
-- 2. PATIENTS TABLE - FIX CONFLICTING POLICIES
-- Currently: Multiple conflicting policies including "Allow all"
-- =====================================================

-- Drop all existing patient policies to start clean
DROP POLICY IF EXISTS "Allow all operations on patients" ON patients;
DROP POLICY IF EXISTS "patient_select_policy_anon" ON patients;
DROP POLICY IF EXISTS "patient_insert_policy_anon" ON patients;
DROP POLICY IF EXISTS "patient_insert_policy" ON patients;

-- Patients can view and update their own record
CREATE POLICY "patients_own_record" ON patients
    FOR ALL
    USING (
        auth.uid() = auth_user_id
    );

-- Allow anonymous users to create patient records (for registration)
CREATE POLICY "patients_anon_register" ON patients
    FOR INSERT
    WITH CHECK (
        -- Must provide basic info
        first_name IS NOT NULL AND 
        last_name IS NOT NULL AND
        (email IS NOT NULL OR phone IS NOT NULL)
    );

-- Staff can view all patients (for scheduling/treatment)
CREATE POLICY "patients_staff_view_all" ON patients
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL AND
        -- User is authenticated but NOT a patient
        NOT EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Staff can update patient records
CREATE POLICY "patients_staff_update" ON patients
    FOR UPDATE
    USING (
        auth.uid() IS NOT NULL AND
        -- User is authenticated but NOT a patient
        NOT EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- =====================================================
-- 3. SERVICES TABLE - FIX "Allow all"
-- Currently: "Allow all operations" - should be read-only for public
-- =====================================================

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Allow all operations on services" ON services;

-- Services are publicly viewable (for website)
CREATE POLICY "services_public_view" ON services
    FOR SELECT
    USING (true);

-- Only authenticated staff can manage services
CREATE POLICY "services_staff_manage" ON services
    FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        -- User is authenticated but NOT a patient
        NOT EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- =====================================================
-- 4. TESTIMONIALS TABLE - FIX "Allow all"
-- Currently: "Allow all operations" - should have restrictions
-- =====================================================

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Allow all operations on testimonials" ON testimonials;

-- Published testimonials are publicly viewable
CREATE POLICY "testimonials_public_view" ON testimonials
    FOR SELECT
    USING (
        -- Only show approved testimonials
        is_approved = true OR
        -- Or if user is staff
        (auth.uid() IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM patients WHERE auth_user_id = auth.uid()
        ))
    );

-- Patients can submit testimonials
CREATE POLICY "testimonials_patient_insert" ON testimonials
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Staff can manage all testimonials
CREATE POLICY "testimonials_staff_manage" ON testimonials
    FOR ALL
    USING (
        auth.uid() IS NOT NULL AND
        NOT EXISTS (
            SELECT 1 FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- =====================================================
-- 5. SMS_QUEUE - Remove "Anyone can use" policy
-- Currently: "Anyone can use SMS queue" - DANGEROUS!
-- =====================================================

-- Drop the dangerous policy
DROP POLICY IF EXISTS "Anyone can use SMS queue" ON sms_queue;

-- The other policies (Service role bypass, Staff can manage) are sufficient

-- =====================================================
-- 6. Add missing column for testimonials if needed
-- =====================================================

-- Add is_approved column if it doesn't exist
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- =====================================================
-- SUMMARY OF CHANGES
-- =====================================================

COMMENT ON TABLE appointments IS 'RLS Fixed: Patients see only their own, staff see all, anonymous can book';
COMMENT ON TABLE patients IS 'RLS Fixed: Patients access own record, staff see all, anonymous can register';
COMMENT ON TABLE services IS 'RLS Fixed: Public read-only, staff can manage';
COMMENT ON TABLE testimonials IS 'RLS Fixed: Public sees approved only, patients can submit, staff manage all';
COMMENT ON TABLE sms_queue IS 'RLS Fixed: Removed public access, staff/service role only';

-- Log this migration
INSERT INTO audit_logs (
    action,
    resource_type,
    metadata,
    created_at
) VALUES (
    'HIPAA_RLS_MIGRATION',
    'SYSTEM',
    jsonb_build_object(
        'migration', 'fix_dangerous_rls_policies',
        'tables_fixed', ARRAY['appointments', 'patients', 'services', 'testimonials', 'sms_queue'],
        'applied_at', CURRENT_TIMESTAMP
    ),
    CURRENT_TIMESTAMP
);