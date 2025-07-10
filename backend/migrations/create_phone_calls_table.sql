-- Create phone_calls table for analytics and call tracking
CREATE TABLE IF NOT EXISTS phone_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sid TEXT UNIQUE,
  from_number TEXT,
  to_number TEXT,
  call_status TEXT,
  direction TEXT,
  duration_seconds INTEGER,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  recording_url TEXT,
  transcription TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_phone_calls_call_sid ON phone_calls(call_sid);
CREATE INDEX idx_phone_calls_from_number ON phone_calls(from_number);
CREATE INDEX idx_phone_calls_to_number ON phone_calls(to_number);
CREATE INDEX idx_phone_calls_started_at ON phone_calls(started_at DESC);
CREATE INDEX idx_phone_calls_call_status ON phone_calls(call_status);

-- Enable RLS
ALTER TABLE phone_calls ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage phone calls" ON phone_calls
  FOR ALL USING (true) WITH CHECK (true);

-- Create policy for authenticated users to read their own calls
CREATE POLICY "Users can view their own calls" ON phone_calls
  FOR SELECT USING (
    auth.role() = 'authenticated' AND 
    (from_number = auth.jwt()->>'phone' OR to_number = auth.jwt()->>'phone')
  );

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_phone_calls_updated_at BEFORE UPDATE
  ON phone_calls FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();