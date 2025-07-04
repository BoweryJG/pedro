-- Pedro Phone System SQL Migrations
-- Database: tsmtaarwgodklafqlbhm
-- Created: 2025-07-04

-- ============================================
-- Migration 1: Add phone_call_id to appointments
-- ============================================
-- Add phone_call_id column to appointments table to link appointments with phone calls
ALTER TABLE public.appointments 
ADD COLUMN phone_call_id uuid REFERENCES public.phone_calls(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_appointments_phone_call_id ON public.appointments(phone_call_id);

-- Add comment to document the relationship
COMMENT ON COLUMN public.appointments.phone_call_id IS 'Reference to the phone call that initiated or is related to this appointment';

-- ============================================
-- Migration 2: Add appointment_id to sms_conversations
-- ============================================
-- Add appointment_id column to sms_conversations table to link conversations with appointments
ALTER TABLE public.sms_conversations 
ADD COLUMN appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_sms_conversations_appointment_id ON public.sms_conversations(appointment_id);

-- Add comment to document the relationship
COMMENT ON COLUMN public.sms_conversations.appointment_id IS 'Reference to the appointment that this SMS conversation is related to';

-- ============================================
-- Migration 3: Add appointment_id to phone_calls
-- ============================================
-- Add appointment_id column to phone_calls table to link calls with appointments
ALTER TABLE public.phone_calls 
ADD COLUMN appointment_id uuid REFERENCES public.appointments(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_phone_calls_appointment_id ON public.phone_calls(appointment_id);

-- Add comment to document the relationship
COMMENT ON COLUMN public.phone_calls.appointment_id IS 'Reference to the appointment that this phone call is related to';

-- ============================================
-- Migration 4: Add helper views and functions
-- ============================================
-- Create a view that shows appointments with their related phone calls
CREATE VIEW public.appointments_with_calls AS
SELECT 
    a.*,
    pc.call_sid,
    pc.from_number AS call_from_number,
    pc.to_number AS call_to_number,
    pc.direction AS call_direction,
    pc.status AS call_status,
    pc.duration AS call_duration,
    pc.recording_url,
    pc.transcription_text,
    pc.started_at AS call_started_at,
    pc.ended_at AS call_ended_at
FROM public.appointments a
LEFT JOIN public.phone_calls pc ON a.phone_call_id = pc.id;

-- Create a view that shows appointments with their related SMS conversations
CREATE VIEW public.appointments_with_sms AS
SELECT 
    a.*,
    sc.conversation_sid,
    sc.from_number AS sms_from_number,
    sc.to_number AS sms_to_number,
    sc.status AS sms_status,
    sc.message_count,
    sc.unread_count,
    sc.last_message_at
FROM public.appointments a
LEFT JOIN public.sms_conversations sc ON sc.appointment_id = a.id;

-- Create a function to get all communications for a patient
CREATE FUNCTION public.get_patient_communications(patient_uuid uuid)
RETURNS TABLE (
    communication_type text,
    communication_id uuid,
    from_number varchar,
    to_number varchar,
    status varchar,
    created_at timestamptz,
    appointment_id uuid,
    content text
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- Get phone calls
    SELECT 
        'phone_call'::text as communication_type,
        pc.id as communication_id,
        pc.from_number,
        pc.to_number,
        pc.status,
        pc.created_at,
        pc.appointment_id,
        pc.transcription_text as content
    FROM public.phone_calls pc
    JOIN public.appointments a ON pc.appointment_id = a.id
    WHERE a.patient_id = patient_uuid
    
    UNION ALL
    
    -- Get SMS conversations
    SELECT 
        'sms_conversation'::text as communication_type,
        sc.id as communication_id,
        sc.from_number,
        sc.to_number,
        sc.status,
        sc.created_at,
        sc.appointment_id,
        NULL::text as content
    FROM public.sms_conversations sc
    JOIN public.appointments a ON sc.appointment_id = a.id
    WHERE a.patient_id = patient_uuid
    
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant access to the views and function
GRANT SELECT ON public.appointments_with_calls TO authenticated;
GRANT SELECT ON public.appointments_with_sms TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_patient_communications(uuid) TO authenticated;

-- Add comments
COMMENT ON VIEW public.appointments_with_calls IS 'View that combines appointments with their related phone call information';
COMMENT ON VIEW public.appointments_with_sms IS 'View that combines appointments with their related SMS conversation information';
COMMENT ON FUNCTION public.get_patient_communications IS 'Function to retrieve all phone and SMS communications for a specific patient';

-- ============================================
-- Migration 5: Add updated_at triggers
-- ============================================
-- Create or replace the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for phone_calls table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_phone_calls_updated_at') THEN
        CREATE TRIGGER update_phone_calls_updated_at 
        BEFORE UPDATE ON public.phone_calls 
        FOR EACH ROW 
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- Add triggers for sms_conversations table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_sms_conversations_updated_at') THEN
        CREATE TRIGGER update_sms_conversations_updated_at 
        BEFORE UPDATE ON public.sms_conversations 
        FOR EACH ROW 
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- ============================================
-- Migration 6: Add indexes and constraints
-- ============================================
-- Add indexes for better query performance on phone_calls
CREATE INDEX IF NOT EXISTS idx_phone_calls_user_id ON public.phone_calls(user_id);
CREATE INDEX IF NOT EXISTS idx_phone_calls_created_at ON public.phone_calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phone_calls_from_number ON public.phone_calls(from_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_to_number ON public.phone_calls(to_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_status ON public.phone_calls(status);
CREATE INDEX IF NOT EXISTS idx_phone_calls_direction ON public.phone_calls(direction);

-- Add indexes for better query performance on sms_conversations
CREATE INDEX IF NOT EXISTS idx_sms_conversations_user_id ON public.sms_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_created_at ON public.sms_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_from_number ON public.sms_conversations(from_number);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_to_number ON public.sms_conversations(to_number);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_status ON public.sms_conversations(status);
CREATE INDEX IF NOT EXISTS idx_sms_conversations_last_message_at ON public.sms_conversations(last_message_at DESC);

-- Add check constraints to ensure data integrity
ALTER TABLE public.phone_calls 
ADD CONSTRAINT check_phone_calls_duration CHECK (duration >= 0);

ALTER TABLE public.sms_conversations 
ADD CONSTRAINT check_sms_conversations_message_count CHECK (message_count >= 0),
ADD CONSTRAINT check_sms_conversations_unread_count CHECK (unread_count >= 0);

-- Add a constraint to ensure phone numbers are in a valid format (E.164)
ALTER TABLE public.phone_calls
ADD CONSTRAINT check_phone_calls_from_number_format CHECK (from_number ~ '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT check_phone_calls_to_number_format CHECK (to_number ~ '^\+?[1-9]\d{1,14}$');

ALTER TABLE public.sms_conversations
ADD CONSTRAINT check_sms_conversations_from_number_format CHECK (from_number ~ '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT check_sms_conversations_to_number_format CHECK (to_number ~ '^\+?[1-9]\d{1,14}$');

-- Add comments to document the constraints
COMMENT ON CONSTRAINT check_phone_calls_duration ON public.phone_calls IS 'Ensures call duration is not negative';
COMMENT ON CONSTRAINT check_sms_conversations_message_count ON public.sms_conversations IS 'Ensures message count is not negative';
COMMENT ON CONSTRAINT check_sms_conversations_unread_count ON public.sms_conversations IS 'Ensures unread count is not negative';
COMMENT ON CONSTRAINT check_phone_calls_from_number_format ON public.phone_calls IS 'Ensures phone numbers are in E.164 format';
COMMENT ON CONSTRAINT check_phone_calls_to_number_format ON public.phone_calls IS 'Ensures phone numbers are in E.164 format';
COMMENT ON CONSTRAINT check_sms_conversations_from_number_format ON public.sms_conversations IS 'Ensures phone numbers are in E.164 format';
COMMENT ON CONSTRAINT check_sms_conversations_to_number_format ON public.sms_conversations IS 'Ensures phone numbers are in E.164 format';

-- ============================================
-- EXISTING RLS POLICIES (for reference)
-- ============================================
-- phone_calls table has the following RLS policies:
-- 1. Service role has full access to phone calls
-- 2. Users can view own phone calls
-- 3. Users can insert own phone calls
-- 4. Users can update own phone calls
-- 5. Users can delete own phone calls

-- sms_conversations table has the following RLS policies:
-- 1. Service role has full access to conversations
-- 2. Users can view own conversations
-- 3. Users can insert own conversations
-- 4. Users can update own conversations
-- 5. Users can delete own conversations

-- Note: RLS is already enabled on both tables