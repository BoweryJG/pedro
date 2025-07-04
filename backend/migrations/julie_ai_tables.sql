-- Julie AI Voice Assistant Database Schema
-- This migration creates the necessary tables for Julie AI voice assistant

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Voice calls tracking table
CREATE TABLE IF NOT EXISTS voice_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  call_sid TEXT UNIQUE,
  phone_number TEXT,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'failed', 'no_answer', 'busy')),
  ai_system TEXT DEFAULT 'julie_moshi',
  duration_seconds INTEGER,
  transcript JSONB,
  patient_info JSONB,
  appointment_booked BOOLEAN DEFAULT FALSE,
  emergency_detected BOOLEAN DEFAULT FALSE,
  human_handoff_requested BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_voice_calls_phone ON voice_calls(phone_number);
CREATE INDEX idx_voice_calls_status ON voice_calls(status);
CREATE INDEX idx_voice_calls_created ON voice_calls(created_at DESC);
CREATE INDEX idx_voice_calls_emergency ON voice_calls(emergency_detected) WHERE emergency_detected = TRUE;

-- Emergency calls table
CREATE TABLE IF NOT EXISTS emergency_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_call_id UUID REFERENCES voice_calls(id),
  patient_name TEXT,
  phone_number TEXT,
  concern TEXT,
  severity TEXT CHECK (severity IN ('critical', 'urgent', 'moderate', 'low')),
  symptoms TEXT[],
  action_taken TEXT,
  referred_to_er BOOLEAN DEFAULT FALSE,
  transcript JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_emergency_calls_phone ON emergency_calls(phone_number);
CREATE INDEX idx_emergency_calls_severity ON emergency_calls(severity);
CREATE INDEX idx_emergency_calls_created ON emergency_calls(created_at DESC);

-- Callback requests table
CREATE TABLE IF NOT EXISTS callback_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_call_id UUID REFERENCES voice_calls(id),
  patient_name TEXT,
  phone_number TEXT NOT NULL,
  reason TEXT,
  preferred_callback_time TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_to TEXT,
  callback_completed_at TIMESTAMP WITH TIME ZONE,
  callback_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('high', 'normal', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_callback_requests_status ON callback_requests(status);
CREATE INDEX idx_callback_requests_phone ON callback_requests(phone_number);
CREATE INDEX idx_callback_requests_created ON callback_requests(created_at DESC);

-- Voice appointments table (tracks appointments booked via Julie AI)
CREATE TABLE IF NOT EXISTS voice_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voice_call_id UUID REFERENCES voice_calls(id),
  appointment_id UUID, -- References main appointments table
  patient_name TEXT,
  patient_phone TEXT,
  patient_email TEXT,
  concern TEXT,
  preferred_date DATE,
  preferred_time TIME,
  actual_date DATE,
  actual_time TIME,
  duration_minutes INTEGER DEFAULT 30,
  confirmation_sent BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_voice_appointments_phone ON voice_appointments(patient_phone);
CREATE INDEX idx_voice_appointments_date ON voice_appointments(actual_date);

-- Voice analytics table (aggregated metrics)
CREATE TABLE IF NOT EXISTS voice_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  completed_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  avg_duration_seconds NUMERIC,
  appointments_booked INTEGER DEFAULT 0,
  emergencies_handled INTEGER DEFAULT 0,
  human_handoffs INTEGER DEFAULT 0,
  unique_callers INTEGER DEFAULT 0,
  busiest_hour INTEGER,
  conversion_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Create index
CREATE INDEX idx_voice_analytics_date ON voice_analytics(date DESC);

-- Conversation templates (for consistent responses)
CREATE TABLE IF NOT EXISTS conversation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  trigger_keywords TEXT[],
  response_template TEXT NOT NULL,
  requires_followup BOOLEAN DEFAULT FALSE,
  followup_questions TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_conversation_templates_category ON conversation_templates(category);
CREATE INDEX idx_conversation_templates_active ON conversation_templates(active);

-- Insert some default conversation templates
INSERT INTO conversation_templates (category, trigger_keywords, response_template, requires_followup, followup_questions) VALUES
('greeting', ARRAY['hello', 'hi', 'hey'], 'Thank you for calling Dr. Pedro''s office. This is Julie. How can I help you today?', FALSE, NULL),
('appointment', ARRAY['appointment', 'book', 'schedule', 'available'], 'I''d be happy to help you book an appointment. May I have your name please?', TRUE, ARRAY['What brings you in to see Dr. Pedro?', 'When works best for you?']),
('emergency', ARRAY['emergency', 'pain', 'bleeding', 'swelling'], 'I understand you''re experiencing a dental emergency. Are you in severe pain right now?', TRUE, ARRAY['On a scale of 1-10, how would you rate your pain?', 'How long have you been experiencing this?']),
('insurance', ARRAY['insurance', 'coverage', 'payment', 'cost'], 'I can help you with insurance questions. We accept most major dental insurance plans. Would you like me to check if we accept your specific insurance?', TRUE, ARRAY['What insurance provider do you have?']),
('human', ARRAY['speak to someone', 'talk to human', 'real person', 'doctor'], 'Of course! I''ll have someone from our team call you right back. What''s the best number to reach you?', TRUE, NULL);

-- Function to update analytics
CREATE OR REPLACE FUNCTION update_voice_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when a call completes
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO voice_analytics (
      date,
      total_calls,
      completed_calls,
      avg_duration_seconds,
      appointments_booked,
      emergencies_handled,
      human_handoffs
    ) VALUES (
      DATE(NEW.ended_at),
      1,
      1,
      NEW.duration_seconds,
      CASE WHEN NEW.appointment_booked THEN 1 ELSE 0 END,
      CASE WHEN NEW.emergency_detected THEN 1 ELSE 0 END,
      CASE WHEN NEW.human_handoff_requested THEN 1 ELSE 0 END
    )
    ON CONFLICT (date) DO UPDATE SET
      total_calls = voice_analytics.total_calls + 1,
      completed_calls = voice_analytics.completed_calls + 1,
      avg_duration_seconds = (
        (voice_analytics.avg_duration_seconds * voice_analytics.completed_calls + EXCLUDED.avg_duration_seconds) / 
        (voice_analytics.completed_calls + 1)
      ),
      appointments_booked = voice_analytics.appointments_booked + EXCLUDED.appointments_booked,
      emergencies_handled = voice_analytics.emergencies_handled + EXCLUDED.emergencies_handled,
      human_handoffs = voice_analytics.human_handoffs + EXCLUDED.human_handoffs;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for analytics
CREATE TRIGGER voice_call_analytics_trigger
AFTER UPDATE ON voice_calls
FOR EACH ROW
EXECUTE FUNCTION update_voice_analytics();

-- Function to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_voice_calls_updated_at BEFORE UPDATE ON voice_calls
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_callback_requests_updated_at BEFORE UPDATE ON callback_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_templates_updated_at BEFORE UPDATE ON conversation_templates
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your Supabase roles)
GRANT ALL ON voice_calls TO authenticated;
GRANT ALL ON emergency_calls TO authenticated;
GRANT ALL ON callback_requests TO authenticated;
GRANT ALL ON voice_appointments TO authenticated;
GRANT SELECT ON voice_analytics TO authenticated;
GRANT SELECT ON conversation_templates TO authenticated;

-- Enable RLS (Row Level Security)
ALTER TABLE voice_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your security requirements)
CREATE POLICY "Service role can manage all voice data" ON voice_calls
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage emergency calls" ON emergency_calls
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage callbacks" ON callback_requests
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role can manage voice appointments" ON voice_appointments
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Authenticated users can view analytics" ON voice_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Everyone can view active templates" ON conversation_templates
  FOR SELECT USING (active = true);