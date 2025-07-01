-- Enhanced booking system schema for Dr. Pedro's dental practice

-- Create provider availability table
CREATE TABLE provider_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, day_of_week, start_time)
);

-- Create provider time slots table for granular availability
CREATE TABLE provider_time_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    appointment_id UUID REFERENCES appointments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(staff_id, date, start_time)
);

-- Create blocked dates table (holidays, vacations, etc.)
CREATE TABLE blocked_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID REFERENCES staff(id), -- NULL means applies to all staff
    date DATE NOT NULL,
    reason TEXT,
    is_full_day BOOLEAN DEFAULT true,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add staff_id to appointments table
ALTER TABLE appointments 
ADD COLUMN staff_id UUID REFERENCES staff(id),
ADD COLUMN duration INTERVAL,
ADD COLUMN confirmation_code TEXT,
ADD COLUMN reminder_sent BOOLEAN DEFAULT false,
ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN cancellation_reason TEXT;

-- Create appointment reminders table
CREATE TABLE appointment_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) NOT NULL,
    reminder_type TEXT NOT NULL CHECK (reminder_type IN ('email', 'sms', 'both')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create waiting list table
CREATE TABLE waiting_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    preferred_dates JSONB, -- Array of preferred dates/times
    flexibility TEXT CHECK (flexibility IN ('specific', 'flexible', 'urgent')),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add insurance information to patients
ALTER TABLE patients
ADD COLUMN insurance_provider TEXT,
ADD COLUMN insurance_member_id TEXT,
ADD COLUMN insurance_group_number TEXT;

-- Create function to generate time slots
CREATE OR REPLACE FUNCTION generate_time_slots(
    p_staff_id UUID,
    p_date DATE,
    p_slot_duration INTERVAL DEFAULT '30 minutes'
) RETURNS TABLE (
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN
) AS $$
DECLARE
    v_day_of_week INTEGER;
    v_availability RECORD;
    v_current_time TIME;
    v_slot_end TIME;
BEGIN
    -- Get day of week (0=Sunday, 6=Saturday)
    v_day_of_week := EXTRACT(DOW FROM p_date);
    
    -- Get provider's availability for this day
    FOR v_availability IN 
        SELECT pa.start_time, pa.end_time
        FROM provider_availability pa
        WHERE pa.staff_id = p_staff_id 
        AND pa.day_of_week = v_day_of_week
        AND pa.is_active = true
    LOOP
        v_current_time := v_availability.start_time;
        
        WHILE v_current_time < v_availability.end_time LOOP
            v_slot_end := v_current_time + p_slot_duration;
            
            -- Only return slot if it fits within availability window
            IF v_slot_end <= v_availability.end_time THEN
                -- Check if slot is available
                RETURN QUERY
                SELECT 
                    v_current_time as start_time,
                    v_slot_end as end_time,
                    NOT EXISTS (
                        SELECT 1 FROM provider_time_slots pts
                        WHERE pts.staff_id = p_staff_id
                        AND pts.date = p_date
                        AND pts.start_time = v_current_time
                        AND pts.is_available = false
                    ) AND NOT EXISTS (
                        SELECT 1 FROM blocked_dates bd
                        WHERE bd.date = p_date
                        AND (bd.staff_id = p_staff_id OR bd.staff_id IS NULL)
                        AND (
                            bd.is_full_day = true 
                            OR (v_current_time >= bd.start_time AND v_current_time < bd.end_time)
                        )
                    ) as is_available;
            END IF;
            
            v_current_time := v_slot_end;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to book appointment
CREATE OR REPLACE FUNCTION book_appointment(
    p_patient_id UUID,
    p_service_id UUID,
    p_staff_id UUID,
    p_date DATE,
    p_time TIME,
    p_duration INTERVAL,
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_appointment_id UUID;
    v_confirmation_code TEXT;
BEGIN
    -- Generate confirmation code
    v_confirmation_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Create appointment
    INSERT INTO appointments (
        patient_id,
        service_id,
        staff_id,
        appointment_date,
        appointment_time,
        duration,
        notes,
        confirmation_code,
        status
    ) VALUES (
        p_patient_id,
        p_service_id,
        p_staff_id,
        p_date,
        p_time,
        p_duration,
        p_notes,
        v_confirmation_code,
        'scheduled'
    ) RETURNING id INTO v_appointment_id;
    
    -- Mark time slot as unavailable
    INSERT INTO provider_time_slots (
        staff_id,
        date,
        start_time,
        end_time,
        is_available,
        appointment_id
    ) VALUES (
        p_staff_id,
        p_date,
        p_time,
        p_time + p_duration,
        false,
        v_appointment_id
    );
    
    -- Schedule reminders (24 hours and 2 hours before)
    INSERT INTO appointment_reminders (appointment_id, reminder_type, scheduled_at)
    VALUES 
        (v_appointment_id, 'email', p_date + p_time - INTERVAL '24 hours'),
        (v_appointment_id, 'email', p_date + p_time - INTERVAL '2 hours');
    
    RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiting_list ENABLE ROW LEVEL SECURITY;

-- Create policies for provider availability (public read, admin write)
CREATE POLICY provider_availability_select_policy ON provider_availability 
    FOR SELECT USING (true);

-- Create policies for provider time slots (public read, admin write)
CREATE POLICY provider_time_slots_select_policy ON provider_time_slots 
    FOR SELECT USING (true);

-- Create policies for blocked dates (public read, admin write)
CREATE POLICY blocked_dates_select_policy ON blocked_dates 
    FOR SELECT USING (true);

-- Create policies for appointment reminders (patients can view their own)
CREATE POLICY appointment_reminders_select_policy ON appointment_reminders 
    FOR SELECT USING (
        appointment_id IN (
            SELECT a.id FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE p.auth_user_id = auth.uid()
        )
    );

-- Create policies for waiting list (patients can manage their own)
CREATE POLICY waiting_list_select_policy ON waiting_list 
    FOR SELECT USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY waiting_list_insert_policy ON waiting_list 
    FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY waiting_list_update_policy ON waiting_list 
    FOR UPDATE USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY waiting_list_delete_policy ON waiting_list 
    FOR DELETE USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Create triggers for new tables
CREATE TRIGGER update_provider_availability_updated_at
    BEFORE UPDATE ON provider_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_provider_time_slots_updated_at
    BEFORE UPDATE ON provider_time_slots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blocked_dates_updated_at
    BEFORE UPDATE ON blocked_dates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_waiting_list_updated_at
    BEFORE UPDATE ON waiting_list
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Create indexes for performance
CREATE INDEX idx_provider_availability_staff_day ON provider_availability(staff_id, day_of_week);
CREATE INDEX idx_provider_time_slots_staff_date ON provider_time_slots(staff_id, date);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, appointment_time);
CREATE INDEX idx_appointments_staff_date ON appointments(staff_id, appointment_date);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(date);
CREATE INDEX idx_waiting_list_patient_service ON waiting_list(patient_id, service_id);