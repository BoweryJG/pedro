-- Migration: Add comprehensive webhook support for VoIP.ms and Twilio
-- Description: Adds fields and tables to support all webhook data

-- Add webhook-specific fields to phone_calls table if they don't exist
ALTER TABLE phone_calls 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'twilio',
ADD COLUMN IF NOT EXISTS recording_duration INTEGER,
ADD COLUMN IF NOT EXISTS transcription_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS error_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS webhook_events JSONB DEFAULT '[]'::jsonb;

-- Add webhook-specific fields to sms_conversations table if they don't exist
ALTER TABLE sms_conversations 
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'twilio',
ADD COLUMN IF NOT EXISTS message_sid VARCHAR(255),
ADD COLUMN IF NOT EXISTS error_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS auto_response_sent BOOLEAN DEFAULT FALSE;

-- Create webhook_logs table for debugging and audit
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    webhook_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    headers JSONB,
    body JSONB,
    response_status INTEGER,
    response_body JSONB,
    error_message TEXT,
    ip_address VARCHAR(45),
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for webhook_logs
CREATE INDEX IF NOT EXISTS idx_webhook_logs_type ON webhook_logs(webhook_type);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_error ON webhook_logs(error_message) WHERE error_message IS NOT NULL;

-- Create auto_responses table for tracking auto-response patterns
CREATE TABLE IF NOT EXISTS auto_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trigger_pattern VARCHAR(255) NOT NULL,
    response_message TEXT NOT NULL,
    trigger_count INTEGER DEFAULT 0,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default auto-response patterns
INSERT INTO auto_responses (trigger_pattern, response_message) VALUES
('appointment', 'Thank you for your interest in scheduling an appointment! Please visit our website at gregpedromd.com or call us at (954) 456-1627 during business hours. Our team will be happy to assist you.'),
('emergency', 'For dental emergencies, please call our emergency line at (954) 456-1627. If this is a life-threatening emergency, please call 911 immediately.'),
('hours', 'Our office hours are Monday-Friday 8:00 AM - 5:00 PM. We are closed on weekends. For appointments, please call (954) 456-1627.'),
('location', 'We are located at 3031 SW 160th Ave, Suite 103 Miramar, FL 33027. Visit gregpedromd.com for detailed directions and parking information.'),
('insurance', 'We accept most major dental insurance plans. Please call our office at (954) 456-1627 to verify your specific coverage.')
ON CONFLICT DO NOTHING;

-- Create voip_settings table for storing VoIP.ms configuration
CREATE TABLE IF NOT EXISTS voip_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    did VARCHAR(20) NOT NULL UNIQUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    sms_webhook_url TEXT,
    recording_enabled BOOLEAN DEFAULT TRUE,
    recording_webhook_url TEXT,
    cdr_webhook_url TEXT,
    allowed_ips TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_auto_responses_updated_at ON auto_responses;
CREATE TRIGGER update_auto_responses_updated_at BEFORE UPDATE ON auto_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_voip_settings_updated_at ON voip_settings;
CREATE TRIGGER update_voip_settings_updated_at BEFORE UPDATE ON voip_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for SMS conversation analytics
CREATE OR REPLACE VIEW sms_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as date,
    provider,
    direction,
    COUNT(*) as message_count,
    COUNT(CASE WHEN auto_response_sent THEN 1 END) as auto_responses,
    COUNT(CASE WHEN error_code IS NOT NULL THEN 1 END) as errors
FROM sms_conversations
GROUP BY DATE_TRUNC('day', created_at), provider, direction;

-- Create view for call analytics
CREATE OR REPLACE VIEW call_analytics AS
SELECT 
    DATE_TRUNC('day', started_at) as date,
    provider,
    direction,
    status,
    COUNT(*) as call_count,
    AVG(duration) as avg_duration,
    SUM(price) as total_cost,
    COUNT(CASE WHEN recording_url IS NOT NULL THEN 1 END) as recorded_calls,
    COUNT(CASE WHEN transcription_text IS NOT NULL THEN 1 END) as transcribed_calls
FROM phone_calls
WHERE started_at IS NOT NULL
GROUP BY DATE_TRUNC('day', started_at), provider, direction, status;

-- Create function to log webhook requests
CREATE OR REPLACE FUNCTION log_webhook_request(
    p_webhook_type VARCHAR,
    p_provider VARCHAR,
    p_endpoint VARCHAR,
    p_method VARCHAR,
    p_headers JSONB,
    p_body JSONB,
    p_ip_address VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO webhook_logs (
        webhook_type,
        provider,
        endpoint,
        method,
        headers,
        body,
        ip_address
    ) VALUES (
        p_webhook_type,
        p_provider,
        p_endpoint,
        p_method,
        p_headers,
        p_body,
        p_ip_address
    ) RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update webhook log response
CREATE OR REPLACE FUNCTION update_webhook_log_response(
    p_log_id UUID,
    p_response_status INTEGER,
    p_response_body JSONB,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE webhook_logs
    SET 
        response_status = p_response_status,
        response_body = p_response_body,
        error_message = p_error_message,
        processing_time_ms = EXTRACT(MILLISECOND FROM (NOW() - created_at))
    WHERE id = p_log_id;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions to service role
GRANT ALL ON webhook_logs TO service_role;
GRANT ALL ON auto_responses TO service_role;
GRANT ALL ON voip_settings TO service_role;
GRANT SELECT ON sms_analytics TO service_role;
GRANT SELECT ON call_analytics TO service_role;

-- Add RLS policies
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE voip_settings ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role has full access to webhook_logs" ON webhook_logs
    FOR ALL TO service_role USING (true);

CREATE POLICY "Service role has full access to auto_responses" ON auto_responses
    FOR ALL TO service_role USING (true);

CREATE POLICY "Service role has full access to voip_settings" ON voip_settings
    FOR ALL TO service_role USING (true);