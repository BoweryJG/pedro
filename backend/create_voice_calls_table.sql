-- Create table for voice call transcripts
CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  call_type TEXT DEFAULT 'webrtc', -- 'webrtc' or 'twilio'
  patient_info JSONB DEFAULT '{}',
  transcript JSONB DEFAULT '[]', -- Array of {role, text, timestamp}
  summary TEXT,
  appointment_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_voice_calls_session_id ON voice_calls(session_id);
CREATE INDEX idx_voice_calls_started_at ON voice_calls(started_at DESC);
CREATE INDEX idx_voice_calls_appointment_booked ON voice_calls(appointment_booked);

-- Enable RLS
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage voice calls" ON voice_calls
  FOR ALL USING (true) WITH CHECK (true);