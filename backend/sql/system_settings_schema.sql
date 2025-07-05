-- System Settings Table for Voice AI Configuration

CREATE TABLE IF NOT EXISTS system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category)
);

-- Insert default voice AI settings
INSERT INTO system_settings (category, settings) 
VALUES ('voice_ai', '{
  "enabled": true,
  "twilioPhoneNumber": "+19292424535",
  "voiceModel": "aura-2-thalia-en",
  "voiceSpeed": 0.95,
  "voicePitch": 1.05,
  "personality": "professional",
  "greetingMessage": "Thank you for calling Dr. Pedro''s office. This is Julie. How can I help you today?",
  "llmModel": "gpt-4o-mini",
  "enableAppointments": true,
  "enableEmergencyDetection": true,
  "maxCallDuration": 600,
  "recordCalls": true
}')
ON CONFLICT (category) DO NOTHING;

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;