-- Create table to log SMS interactions
CREATE TABLE IF NOT EXISTS sms_interactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    incoming_message TEXT,
    outgoing_message TEXT,
    action_taken VARCHAR(50),
    appointment_id UUID REFERENCES appointments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for phone lookups
CREATE INDEX idx_sms_interactions_phone ON sms_interactions(phone);
CREATE INDEX idx_sms_interactions_created_at ON sms_interactions(created_at DESC);

-- Enable RLS
ALTER TABLE sms_interactions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role only
CREATE POLICY "Service role can manage SMS interactions" 
ON sms_interactions FOR ALL 
USING (auth.jwt()->>'role' = 'service_role');

-- Grant permissions
GRANT ALL ON sms_interactions TO service_role;

-- Update appointment confirmation messages to include instructions
UPDATE sms_queue 
SET message = message || ' Reply CANCEL ' || 
    (SELECT confirmation_code FROM appointments WHERE appointments.id = sms_queue.appointment_id) || 
    ' to cancel.'
WHERE status = 'pending' 
AND appointment_id IS NOT NULL;