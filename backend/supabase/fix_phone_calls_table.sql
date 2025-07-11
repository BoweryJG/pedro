-- First, let's check if the table exists and what columns it has
-- Run this query first to see the current structure:
/*
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'phone_calls' 
ORDER BY ordinal_position;
*/

-- If the table exists but is missing columns, run this to add them:
ALTER TABLE phone_calls 
ADD COLUMN IF NOT EXISTS call_status TEXT,
ADD COLUMN IF NOT EXISTS direction TEXT,
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS recording_url TEXT,
ADD COLUMN IF NOT EXISTS transcription TEXT;

-- If the table doesn't exist at all, create it:
CREATE TABLE IF NOT EXISTS phone_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    call_sid TEXT UNIQUE NOT NULL,
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    call_status TEXT,
    direction TEXT,
    duration_seconds INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    recording_url TEXT,
    transcription TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_phone_calls_call_sid ON phone_calls(call_sid);
CREATE INDEX IF NOT EXISTS idx_phone_calls_from_number ON phone_calls(from_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_to_number ON phone_calls(to_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_started_at ON phone_calls(started_at);
CREATE INDEX IF NOT EXISTS idx_phone_calls_call_status ON phone_calls(call_status);

-- Enable RLS if not already enabled
ALTER TABLE phone_calls ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Service role has full access to phone_calls" ON phone_calls;
DROP POLICY IF EXISTS "Users can read their own phone calls" ON phone_calls;

-- Service role can do everything
CREATE POLICY "Service role has full access to phone_calls" ON phone_calls
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users can read their own calls
CREATE POLICY "Users can read their own phone calls" ON phone_calls
    FOR SELECT
    TO authenticated
    USING (
        from_number IN (
            SELECT phone FROM auth.users WHERE id = auth.uid()
        ) OR
        to_number IN (
            SELECT phone FROM auth.users WHERE id = auth.uid()
        )
    );

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS update_phone_calls_updated_at ON phone_calls;
CREATE TRIGGER update_phone_calls_updated_at 
    BEFORE UPDATE ON phone_calls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();