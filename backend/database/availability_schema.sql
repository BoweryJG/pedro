-- Provider availability schema for calendar booking system

-- Provider schedules with recurring availability
CREATE TABLE provider_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Time slots for appointments
CREATE TABLE appointment_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    is_available BOOLEAN DEFAULT true,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider_id, start_time)
);

-- Provider blocked times (vacation, breaks, etc)
CREATE TABLE provider_blocked_times (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_provider_schedules_provider ON provider_schedules(provider_id);
CREATE INDEX idx_appointment_slots_provider_date ON appointment_slots(provider_id, appointment_date);
CREATE INDEX idx_appointment_slots_available ON appointment_slots(is_available, appointment_date);
CREATE INDEX idx_blocked_times_provider ON provider_blocked_times(provider_id);

-- Function to generate available slots based on provider schedule
CREATE OR REPLACE FUNCTION generate_available_slots(
    p_provider_id UUID,
    p_date DATE,
    p_duration_minutes INT DEFAULT 30
)
RETURNS TABLE (
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_day_of_week INT;
    v_schedule RECORD;
    v_slot_start TIMESTAMP WITH TIME ZONE;
    v_slot_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get day of week for the requested date
    v_day_of_week := EXTRACT(DOW FROM p_date);
    
    -- Get provider's schedule for this day
    FOR v_schedule IN 
        SELECT * FROM provider_schedules 
        WHERE provider_id = p_provider_id 
        AND day_of_week = v_day_of_week 
        AND is_active = true
    LOOP
        -- Generate slots for the day
        v_slot_start := p_date + v_schedule.start_time;
        
        WHILE v_slot_start + (p_duration_minutes || ' minutes')::INTERVAL <= p_date + v_schedule.end_time LOOP
            v_slot_end := v_slot_start + (p_duration_minutes || ' minutes')::INTERVAL;
            
            -- Check if slot is not blocked
            IF NOT EXISTS (
                SELECT 1 FROM provider_blocked_times
                WHERE provider_id = p_provider_id
                AND (
                    (start_time <= v_slot_start AND end_time > v_slot_start) OR
                    (start_time < v_slot_end AND end_time >= v_slot_end) OR
                    (start_time >= v_slot_start AND end_time <= v_slot_end)
                )
            ) AND NOT EXISTS (
                SELECT 1 FROM appointment_slots
                WHERE provider_id = p_provider_id
                AND start_time = v_slot_start
                AND is_available = false
            ) THEN
                RETURN QUERY SELECT v_slot_start, v_slot_end;
            END IF;
            
            v_slot_start := v_slot_start + (p_duration_minutes || ' minutes')::INTERVAL;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update appointments table to link with slots
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES appointment_slots(id);