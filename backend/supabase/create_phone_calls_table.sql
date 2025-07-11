-- Create phone_calls table for storing Twilio call records
CREATE TABLE IF NOT EXISTS phone_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    call_sid TEXT UNIQUE NOT NULL,
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    call_status TEXT NOT NULL,
    direction TEXT NOT NULL,
    duration_seconds INTEGER,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    recording_url TEXT,
    transcription TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_phone_calls_call_sid ON phone_calls(call_sid);
CREATE INDEX IF NOT EXISTS idx_phone_calls_from_number ON phone_calls(from_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_to_number ON phone_calls(to_number);
CREATE INDEX IF NOT EXISTS idx_phone_calls_started_at ON phone_calls(started_at);
CREATE INDEX IF NOT EXISTS idx_phone_calls_call_status ON phone_calls(call_status);

-- Enable Row Level Security
ALTER TABLE phone_calls ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Service role can do everything
CREATE POLICY "Service role has full access to phone_calls" ON phone_calls
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated users can read their own calls (based on phone number)
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

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_phone_calls_updated_at 
    BEFORE UPDATE ON phone_calls 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE phone_calls IS 'Stores Twilio phone call records and metadata';