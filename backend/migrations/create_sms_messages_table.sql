-- Create sms_messages table for Twilio SMS tracking
CREATE TABLE IF NOT EXISTS sms_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_sid TEXT UNIQUE NOT NULL,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  body TEXT,
  status TEXT,
  direction TEXT,
  error_code TEXT,
  error_message TEXT,
  num_segments INTEGER,
  num_media INTEGER,
  price DECIMAL(10,4),
  price_unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_sms_messages_message_sid ON sms_messages(message_sid);
CREATE INDEX idx_sms_messages_from_number ON sms_messages(from_number);
CREATE INDEX idx_sms_messages_to_number ON sms_messages(to_number);
CREATE INDEX idx_sms_messages_created_at ON sms_messages(created_at DESC);
CREATE INDEX idx_sms_messages_status ON sms_messages(status);

-- Enable RLS
ALTER TABLE sms_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage SMS messages" ON sms_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Add trigger to update updated_at
CREATE TRIGGER update_sms_messages_updated_at BEFORE UPDATE
  ON sms_messages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();