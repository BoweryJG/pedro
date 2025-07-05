-- ========================================
-- SYSTEM SETTINGS TABLE
-- ========================================

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

-- ========================================
-- PHONE NUMBERS MANAGEMENT SCHEMA
-- ========================================

-- Table for clients/practices (create this first)
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  business_type TEXT DEFAULT 'dental_practice',
  billing_email TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'active',
  monthly_fee DECIMAL(10, 2) DEFAULT 49.99,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for managing all phone numbers
CREATE TABLE IF NOT EXISTS phone_numbers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  phone_sid TEXT UNIQUE NOT NULL,
  account_sid TEXT NOT NULL,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  friendly_name TEXT,
  capabilities JSONB DEFAULT '{"voice": true, "sms": true}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'released')),
  monthly_fee DECIMAL(10, 2) DEFAULT 1.15,
  voice_settings JSONB DEFAULT '{
    "enabled": true,
    "voiceModel": "aura-2-thalia-en",
    "personality": "professional",
    "enableAppointments": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Table for tracking call usage
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  call_sid TEXT UNIQUE NOT NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  duration INTEGER DEFAULT 0,
  status TEXT,
  recording_url TEXT,
  transcription TEXT,
  ai_summary TEXT,
  client_id UUID REFERENCES clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Table for billing/usage tracking
CREATE TABLE IF NOT EXISTS usage_billing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  phone_number TEXT REFERENCES phone_numbers(phone_number),
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_minutes INTEGER DEFAULT 0,
  total_calls INTEGER DEFAULT 0,
  platform_fee DECIMAL(10, 2) DEFAULT 49.99,
  number_fees DECIMAL(10, 2) DEFAULT 0,
  usage_fees DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) GENERATED ALWAYS AS (platform_fee + number_fees + usage_fees) STORED,
  stripe_invoice_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_phone_numbers_client_id ON phone_numbers(client_id);
CREATE INDEX idx_phone_numbers_status ON phone_numbers(status);
CREATE INDEX idx_call_logs_phone ON call_logs(to_number, created_at);
CREATE INDEX idx_call_logs_client ON call_logs(client_id, created_at);
CREATE INDEX idx_usage_billing_client ON usage_billing(client_id, billing_period_start);

-- Enable Row Level Security
ALTER TABLE phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_billing ENABLE ROW LEVEL SECURITY;