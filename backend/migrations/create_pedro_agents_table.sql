-- Create pedro_agents table for patient-focused agents (limited to 5)
CREATE TABLE IF NOT EXISTS pedro_agents (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('patient-care', 'patient-education', 'patient-support')),
  personality JSONB NOT NULL DEFAULT '{}',
  capabilities JSONB NOT NULL DEFAULT '{}',
  voice_config JSONB DEFAULT NULL,
  knowledge_base JSONB DEFAULT '{}',
  procedures_access TEXT[] DEFAULT ARRAY['dental_procedures', 'aesthetic_procedures'],
  deployed_from VARCHAR(100),
  deployed_at TIMESTAMP WITH TIME ZONE,
  platform_specific JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voice_configurations table if not exists
CREATE TABLE IF NOT EXISTS voice_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES pedro_agents(id) ON DELETE CASCADE,
  voice_id VARCHAR(255) NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Create indexes
CREATE INDEX idx_pedro_agents_type ON pedro_agents(type);
CREATE INDEX idx_pedro_agents_deployed_from ON pedro_agents(deployed_from);
CREATE INDEX idx_voice_configurations_agent_id ON voice_configurations(agent_id);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pedro_agents_updated_at 
  BEFORE UPDATE ON pedro_agents 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_voice_configurations_updated_at 
  BEFORE UPDATE ON voice_configurations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add check constraint to limit agents to 5
CREATE OR REPLACE FUNCTION check_pedro_agent_limit()
RETURNS TRIGGER AS $$
DECLARE
  agent_count INTEGER;
BEGIN
  -- Count existing agents (excluding the one being updated)
  SELECT COUNT(*) INTO agent_count
  FROM pedro_agents
  WHERE id != COALESCE(NEW.id, gen_random_uuid());
  
  IF agent_count >= 5 THEN
    RAISE EXCEPTION 'Pedro platform is limited to 5 agents maximum';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_pedro_agent_limit
  BEFORE INSERT ON pedro_agents
  FOR EACH ROW
  EXECUTE FUNCTION check_pedro_agent_limit();

-- Add RLS policies
ALTER TABLE pedro_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_configurations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to pedro_agents" ON pedro_agents
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert/update/delete only from service role
CREATE POLICY "Allow service role full access to pedro_agents" ON pedro_agents
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow read access to voice_configurations" ON voice_configurations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow service role full access to voice_configurations" ON voice_configurations
  FOR ALL
  TO service_role
  USING (true);