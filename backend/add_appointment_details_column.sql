-- Add appointment_details column to voice_calls table
ALTER TABLE voice_calls 
ADD COLUMN IF NOT EXISTS appointment_details JSONB DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN voice_calls.appointment_details IS 'Stores appointment booking details including date, time, patient info, and appointment ID';