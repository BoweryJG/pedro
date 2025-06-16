-- Instagram DM Automation System for Dr. Pedro's Practice
-- Migration: 20250616_instagram_dm_automation.sql

-- Practices table (for future SaaS expansion)
CREATE TABLE IF NOT EXISTS practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  facebook_page_id TEXT UNIQUE,
  instagram_account_id TEXT UNIQUE,
  facebook_access_token TEXT,
  instagram_access_token TEXT,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table for tracking Instagram DM threads
CREATE TABLE IF NOT EXISTS instagram_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  instagram_thread_id TEXT NOT NULL,
  patient_instagram_id TEXT NOT NULL,
  patient_name TEXT,
  patient_username TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'archived')),
  sentiment_score FLOAT DEFAULT 0.0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(practice_id, instagram_thread_id)
);

-- Messages table for storing individual DMs
CREATE TABLE IF NOT EXISTS instagram_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES instagram_conversations(id) ON DELETE CASCADE,
  instagram_message_id TEXT UNIQUE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('patient', 'practice', 'ai')),
  sender_id TEXT NOT NULL,
  message_text TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'file')),
  attachments JSONB DEFAULT '[]',
  is_ai_generated BOOLEAN DEFAULT false,
  ai_confidence_score FLOAT,
  requires_human_review BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI responses table for storing templates and generated responses
CREATE TABLE IF NOT EXISTS ai_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  trigger_keywords TEXT[] DEFAULT '{}',
  trigger_intent TEXT, -- 'appointment_booking', 'pricing_inquiry', 'procedure_question', etc.
  response_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  success_rate FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointment requests table for tracking booking inquiries from DMs
CREATE TABLE IF NOT EXISTS appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES instagram_conversations(id) ON DELETE CASCADE,
  patient_name TEXT,
  patient_phone TEXT,
  patient_email TEXT,
  preferred_service TEXT,
  preferred_date DATE,
  preferred_time TIME,
  urgency TEXT DEFAULT 'routine' CHECK (urgency IN ('emergency', 'urgent', 'routine')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics table for tracking DM automation performance
CREATE TABLE IF NOT EXISTS dm_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_messages_received INTEGER DEFAULT 0,
  ai_responses_sent INTEGER DEFAULT 0,
  human_interventions INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  patient_satisfaction_score FLOAT DEFAULT 0.0,
  response_time_avg_minutes FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(practice_id, date)
);

-- Insert Dr. Pedro's practice
INSERT INTO practices (
  name,
  email,
  phone,
  address,
  subscription_tier,
  settings
) VALUES (
  'Dr. Pedro Advanced Dental Care',
  'info@drpedrodental.com',
  '(718) 555-0123',
  'Staten Island, NY',
  'enterprise',
  '{
    "business_hours": {
      "monday": {"open": "09:00", "close": "17:00"},
      "tuesday": {"open": "09:00", "close": "17:00"},
      "wednesday": {"open": "09:00", "close": "17:00"},
      "thursday": {"open": "09:00", "close": "17:00"},
      "friday": {"open": "09:00", "close": "17:00"},
      "saturday": {"open": "09:00", "close": "14:00"},
      "sunday": {"closed": true}
    },
    "services": [
      "Yomi Robotic Surgery",
      "TMJ Treatment", 
      "EMFACE Procedures",
      "General Dentistry",
      "Cosmetic Dentistry",
      "Dental Implants"
    ],
    "ai_personality": "professional, empathetic, knowledgeable about advanced dental procedures",
    "auto_respond": true,
    "require_human_review_for": ["complex_medical_questions", "emergencies", "complaints"]
  }'
) ON CONFLICT (email) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_conversations_practice_id ON instagram_conversations(practice_id);
CREATE INDEX IF NOT EXISTS idx_instagram_conversations_status ON instagram_conversations(status);
CREATE INDEX IF NOT EXISTS idx_instagram_conversations_last_message ON instagram_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_conversation_id ON instagram_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_instagram_messages_created_at ON instagram_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_responses_practice_id ON ai_responses(practice_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_status ON appointment_requests(status);
CREATE INDEX IF NOT EXISTS idx_dm_analytics_practice_date ON dm_analytics(practice_id, date);

-- Enable Row Level Security
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dm_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for future multi-tenant SaaS)
CREATE POLICY "Practices can only see their own data" ON practices
  USING (auth.uid() IN (
    SELECT user_id FROM practice_users WHERE practice_id = id
  ));

CREATE POLICY "Users can only see conversations for their practice" ON instagram_conversations
  USING (practice_id IN (
    SELECT practice_id FROM practice_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can only see messages for their practice conversations" ON instagram_messages
  USING (conversation_id IN (
    SELECT ic.id FROM instagram_conversations ic
    JOIN practice_users pu ON ic.practice_id = pu.practice_id
    WHERE pu.user_id = auth.uid()
  ));

-- Functions for automated tasks
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE instagram_conversations 
  SET last_message_at = NEW.created_at,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
  AFTER INSERT ON instagram_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();

-- Function to calculate response time
CREATE OR REPLACE FUNCTION calculate_response_time(conversation_uuid UUID)
RETURNS INTERVAL AS $$
DECLARE
  last_patient_message TIMESTAMPTZ;
  first_practice_response TIMESTAMPTZ;
BEGIN
  -- Get the last patient message timestamp
  SELECT created_at INTO last_patient_message
  FROM instagram_messages
  WHERE conversation_id = conversation_uuid
    AND sender_type = 'patient'
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Get the first practice/AI response after that patient message
  SELECT created_at INTO first_practice_response
  FROM instagram_messages
  WHERE conversation_id = conversation_uuid
    AND sender_type IN ('practice', 'ai')
    AND created_at > last_patient_message
  ORDER BY created_at ASC
  LIMIT 1;
  
  RETURN first_practice_response - last_patient_message;
END;
$$ LANGUAGE plpgsql;