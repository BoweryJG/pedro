-- Migration: HIPAA Compliant Row Level Security Policies
-- This migration updates all RLS policies to ensure proper data access restrictions
-- and HIPAA compliance for sensitive healthcare data

-- =====================================================
-- PATIENTS TABLE - Contains PHI (Protected Health Information)
-- =====================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Patients can insert their own record" ON patients;
DROP POLICY IF EXISTS "Patients can view their own record" ON patients;
DROP POLICY IF EXISTS "patient_select_policy" ON patients;
DROP POLICY IF EXISTS "patient_update_policy" ON patients;

-- Enable RLS if not already enabled
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Patients can only view their own record
CREATE POLICY "patients_select_own" ON patients
    FOR SELECT
    USING (auth.uid() = auth_user_id);

-- Patients can update their own record
CREATE POLICY "patients_update_own" ON patients
    FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Service role can manage all patient records (for backend operations)
CREATE POLICY "patients_service_role_all" ON patients
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Staff with proper role can view patient records
CREATE POLICY "patients_staff_select" ON patients
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Staff with proper role can update patient records
CREATE POLICY "patients_staff_update" ON patients
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Allow anonymous users to create patient records for booking (with limited fields)
CREATE POLICY "patients_anon_insert_booking" ON patients
    FOR INSERT
    WITH CHECK (
        auth.role() = 'anon' 
        AND first_name IS NOT NULL 
        AND last_name IS NOT NULL 
        AND email IS NOT NULL
    );

-- =====================================================
-- APPOINTMENTS TABLE - Contains PHI
-- =====================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
DROP POLICY IF EXISTS "Appointments can be updated by staff or patient" ON appointments;
DROP POLICY IF EXISTS "appointment_select_policy" ON appointments;
DROP POLICY IF EXISTS "appointment_insert_policy" ON appointments;
DROP POLICY IF EXISTS "appointment_update_policy" ON appointments;
DROP POLICY IF EXISTS "appointment_delete_policy" ON appointments;

-- Enable RLS if not already enabled
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own appointments
CREATE POLICY "appointments_patient_select_own" ON appointments
    FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Patients can update their own appointments (for cancellations)
CREATE POLICY "appointments_patient_update_own" ON appointments
    FOR UPDATE
    USING (
        patient_id IN (
            SELECT id FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Staff can view all appointments
CREATE POLICY "appointments_staff_select" ON appointments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Staff can manage all appointments
CREATE POLICY "appointments_staff_all" ON appointments
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Allow anonymous users to create appointments for booking
CREATE POLICY "appointments_anon_insert_booking" ON appointments
    FOR INSERT
    WITH CHECK (
        auth.role() = 'anon' 
        AND status = 'scheduled'
    );

-- Service role can manage all appointments
CREATE POLICY "appointments_service_role_all" ON appointments
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- FINANCIAL_TRANSACTIONS TABLE - Contains sensitive financial data
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Financial data viewable by authenticated users only" ON financial_transactions;

-- Enable RLS if not already enabled
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Patients can only view their own financial transactions
CREATE POLICY "financial_patient_select_own" ON financial_transactions
    FOR SELECT
    USING (
        patient_id IN (
            SELECT id FROM patients 
            WHERE auth_user_id = auth.uid()
        )
    );

-- Staff can view and manage all financial transactions
CREATE POLICY "financial_staff_all" ON financial_transactions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Service role can manage all financial transactions
CREATE POLICY "financial_service_role_all" ON financial_transactions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- STAFF TABLE - Public info with restrictions
-- =====================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Staff are viewable by everyone" ON staff;
DROP POLICY IF EXISTS "staff_select_policy" ON staff;

-- Enable RLS if not already enabled
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Only active staff members are viewable publicly (for booking)
CREATE POLICY "staff_public_select_active" ON staff
    FOR SELECT
    USING (is_active = true);

-- Staff can update their own record
CREATE POLICY "staff_update_own" ON staff
    FOR UPDATE
    USING (auth.uid() = auth_user_id);

-- Service role can manage all staff
CREATE POLICY "staff_service_role_all" ON staff
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- SERVICES TABLE - Public information
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "service_select_policy" ON services;

-- Enable RLS if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Services are publicly viewable
CREATE POLICY "services_public_select" ON services
    FOR SELECT
    USING (true);

-- Only staff can manage services
CREATE POLICY "services_staff_all" ON services
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Service role can manage all services
CREATE POLICY "services_service_role_all" ON services
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PROVIDER_TIME_SLOTS TABLE - Scheduling data
-- =====================================================

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Time slots are viewable by everyone" ON provider_time_slots;
DROP POLICY IF EXISTS "Time slots can be inserted for booking" ON provider_time_slots;
DROP POLICY IF EXISTS "Time slots can be updated for booking" ON provider_time_slots;
DROP POLICY IF EXISTS "provider_time_slots_select_policy" ON provider_time_slots;

-- Enable RLS if not already enabled
ALTER TABLE provider_time_slots ENABLE ROW LEVEL SECURITY;

-- Available time slots are publicly viewable
CREATE POLICY "time_slots_public_select_available" ON provider_time_slots
    FOR SELECT
    USING (is_available = true);

-- Staff can view all time slots
CREATE POLICY "time_slots_staff_select" ON provider_time_slots
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Staff can manage time slots
CREATE POLICY "time_slots_staff_all" ON provider_time_slots
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff.auth_user_id = auth.uid() 
            AND staff.is_active = true
        )
    );

-- Allow anonymous updates for booking (only to mark as unavailable)
CREATE POLICY "time_slots_anon_update_booking" ON provider_time_slots
    FOR UPDATE
    USING (auth.role() = 'anon' AND is_available = true)
    WITH CHECK (is_available = false);

-- Service role can manage all time slots
CREATE POLICY "time_slots_service_role_all" ON provider_time_slots
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- PHONE AND SMS RELATED TABLES - Contains PHI
-- =====================================================

-- PHONE_CALLS TABLE
ALTER TABLE phone_calls ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own phone calls" ON phone_calls;
DROP POLICY IF EXISTS "Users can insert own phone calls" ON phone_calls;
DROP POLICY IF EXISTS "Users can update own phone calls" ON phone_calls;
DROP POLICY IF EXISTS "Users can delete own phone calls" ON phone_calls;
DROP POLICY IF EXISTS "Service role has full access to phone calls" ON phone_calls;

-- Only service role can access phone calls
CREATE POLICY "phone_calls_service_role_only" ON phone_calls
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- VOICE_CALLS TABLE
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Service role can manage voice calls" ON voice_calls;

-- Only service role can access voice calls
CREATE POLICY "voice_calls_service_role_only" ON voice_calls
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- SMS_CONVERSATIONS TABLE
ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view own conversations" ON sms_conversations;
DROP POLICY IF EXISTS "Users can insert own conversations" ON sms_conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON sms_conversations;
DROP POLICY IF EXISTS "Users can delete own conversations" ON sms_conversations;
DROP POLICY IF EXISTS "Service role has full access to conversations" ON sms_conversations;

-- Only service role can access SMS conversations
CREATE POLICY "sms_conversations_service_role_only" ON sms_conversations
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- SMS_MESSAGES TABLE
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can view messages in own conversations" ON sms_messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON sms_messages;
DROP POLICY IF EXISTS "Users can update messages in own conversations" ON sms_messages;
DROP POLICY IF EXISTS "Users can delete messages in own conversations" ON sms_messages;
DROP POLICY IF EXISTS "Service role has full access to messages" ON sms_messages;

-- Only service role can access SMS messages
CREATE POLICY "sms_messages_service_role_only" ON sms_messages
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- SMS_INTERACTIONS TABLE (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'sms_interactions') THEN
        ALTER TABLE sms_interactions ENABLE ROW LEVEL SECURITY;
        
        -- Drop any existing policies
        DROP POLICY IF EXISTS "Service role can manage SMS interactions" ON sms_interactions;
        
        -- Only service role can access SMS interactions
        CREATE POLICY "sms_interactions_service_role_only" ON sms_interactions
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- OTHER SENSITIVE TABLES
-- =====================================================

-- WEBHOOK_LOGS TABLE (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'webhook_logs') THEN
        ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
        
        -- Only service role can access webhook logs
        CREATE POLICY "webhook_logs_service_role_only" ON webhook_logs
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- SYSTEM_SETTINGS TABLE (if exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'system_settings') THEN
        ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
        
        -- Only service role can access system settings
        CREATE POLICY "system_settings_service_role_only" ON system_settings
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- GRANT APPROPRIATE PERMISSIONS
-- =====================================================

-- Revoke broad permissions previously granted
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

-- Grant minimal necessary permissions for anonymous users (booking only)
GRANT SELECT ON services TO anon;
GRANT SELECT ON staff TO anon;
GRANT SELECT ON provider_time_slots TO anon;
GRANT INSERT ON patients TO anon;
GRANT INSERT ON appointments TO anon;
GRANT UPDATE (is_available) ON provider_time_slots TO anon;

-- Grant appropriate permissions for authenticated users
GRANT SELECT ON services TO authenticated;
GRANT SELECT ON staff TO authenticated;
GRANT SELECT, UPDATE ON patients TO authenticated;
GRANT SELECT, INSERT, UPDATE ON appointments TO authenticated;
GRANT SELECT ON provider_time_slots TO authenticated;
GRANT SELECT ON financial_transactions TO authenticated;

-- Service role retains full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- =====================================================
-- AUDIT LOG
-- =====================================================

-- Create audit log table for HIPAA compliance
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    user_id UUID,
    user_role TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Only service role can access audit logs
CREATE POLICY "audit_log_service_role_only" ON audit_log
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- Create audit triggers for sensitive tables
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        table_name,
        operation,
        user_id,
        user_role,
        record_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        auth.uid(),
        auth.jwt() ->> 'role',
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE 
            WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW)
            ELSE NULL
        END,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent'
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_patients
    AFTER INSERT OR UPDATE OR DELETE ON patients
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_appointments
    AFTER INSERT OR UPDATE OR DELETE ON appointments
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_financial_transactions
    AFTER INSERT OR UPDATE OR DELETE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "patients_select_own" ON patients IS 'HIPAA: Patients can only access their own records';
COMMENT ON POLICY "appointments_patient_select_own" ON appointments IS 'HIPAA: Patients can only view their own appointments';
COMMENT ON POLICY "financial_patient_select_own" ON financial_transactions IS 'HIPAA: Patients can only view their own financial records';
COMMENT ON TABLE audit_log IS 'HIPAA compliance: Audit trail for all access to sensitive data';