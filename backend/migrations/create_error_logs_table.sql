-- Create error_logs table for storing application errors
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  status_code INTEGER DEFAULT 500,
  method VARCHAR(10),
  path TEXT,
  query JSONB,
  body JSONB,
  headers JSONB,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  environment VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_error_logs_error_id ON error_logs(error_id);
CREATE INDEX idx_error_logs_status_code ON error_logs(status_code);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX idx_error_logs_environment ON error_logs(environment);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_error_logs_updated_at 
  BEFORE UPDATE ON error_logs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Policy for super admins to view all errors
CREATE POLICY "Super admins can view all errors" ON error_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

-- Policy for service role to insert errors
CREATE POLICY "Service role can insert errors" ON error_logs
  FOR INSERT
  WITH CHECK (true);

-- Add comments
COMMENT ON TABLE error_logs IS 'Stores application error logs for monitoring and debugging';
COMMENT ON COLUMN error_logs.error_id IS 'Unique identifier for tracking errors across systems';
COMMENT ON COLUMN error_logs.metadata IS 'Additional error context and custom fields';