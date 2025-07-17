-- Create conversation_sessions table for TMJ chatbot state management
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT UNIQUE NOT NULL,
  current_stage TEXT NOT NULL DEFAULT 'greeting',
  gathered_info JSONB DEFAULT '{}',
  conversation_history JSONB DEFAULT '[]',
  user_info JSONB DEFAULT '{}',
  frustration_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_conversation_id 
ON conversation_sessions (conversation_id);

-- Create index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_updated_at 
ON conversation_sessions (updated_at);

-- Add RLS policies
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;

-- Allow public access for chatbot (no authentication required)
CREATE POLICY "Allow public access to conversation sessions" 
ON conversation_sessions FOR ALL 
USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_conversation_sessions_updated_at
  BEFORE UPDATE ON conversation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_sessions_updated_at();

-- Add comments for documentation
COMMENT ON TABLE conversation_sessions IS 'Tracks TMJ chatbot conversation state and gathered patient information';
COMMENT ON COLUMN conversation_sessions.conversation_id IS 'Unique identifier for the conversation session';
COMMENT ON COLUMN conversation_sessions.current_stage IS 'Current stage of the TMJ consultation process';
COMMENT ON COLUMN conversation_sessions.gathered_info IS 'Patient information collected during the conversation';
COMMENT ON COLUMN conversation_sessions.conversation_history IS 'Full message history for context';
COMMENT ON COLUMN conversation_sessions.user_info IS 'User metadata and preferences';
COMMENT ON COLUMN conversation_sessions.frustration_level IS 'Detected user frustration level (0-5)';