-- Combined SQL setup script for Dr. Pedro's booking system
-- Run this in your Supabase SQL editor

-- 1. First, run the initial schema
-- Enable UUIDs extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a custom type for appointment status
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled');

-- Create a table for patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    date_of_birth DATE,
    address TEXT,
    medical_history JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for services offered at the dental practice
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    estimated_duration INTERVAL,
    price_range JSONB,
    image_url TEXT,
    is_yomi_technology BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for appointments
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for staff members
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT NOT NULL,
    specialization TEXT,
    bio TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for Yomi technology features
CREATE TABLE yomi_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits JSONB,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
-- Enable RLS on tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE yomi_features ENABLE ROW LEVEL SECURITY;

-- Create policies for patients (patients can only view and edit their own data)
CREATE POLICY patient_select_policy ON patients 
    FOR SELECT USING (auth.uid() = auth_user_id);
    
CREATE POLICY patient_update_policy ON patients 
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Create policies for appointments (patients can only view and modify their own appointments)
CREATE POLICY appointment_select_policy ON appointments 
    FOR SELECT USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY appointment_insert_policy ON appointments 
    FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY appointment_update_policy ON appointments 
    FOR UPDATE USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY appointment_delete_policy ON appointments 
    FOR DELETE USING (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Allow anyone to view services, staff, and yomi features information
CREATE POLICY service_select_policy ON services 
    FOR SELECT USING (true);
    
CREATE POLICY staff_select_policy ON staff 
    FOR SELECT USING (true);
    
CREATE POLICY yomi_features_select_policy ON yomi_features 
    FOR SELECT USING (true);

-- Only allow patients to view approved testimonials or their own
CREATE POLICY testimonial_select_policy ON testimonials 
    FOR SELECT USING (is_approved = true OR patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));
    
CREATE POLICY testimonial_insert_policy ON testimonials 
    FOR INSERT WITH CHECK (patient_id IN (SELECT id FROM patients WHERE auth_user_id = auth.uid()));

-- Create functions and triggers for timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_yomi_features_updated_at
    BEFORE UPDATE ON yomi_features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- 2. Now run the booking system enhancements
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

-- 3. Insert seed data
-- Insert sample services
INSERT INTO services (name, description, category, estimated_duration, is_yomi_technology) VALUES
('Yomi Robotic Dental Implants', 'Advanced robotic-guided dental implant surgery for precise placement', 'Implants', '90 minutes', true),
('TMJ/TMD Treatment', 'Comprehensive treatment for jaw pain and temporomandibular disorders', 'Specialized', '60 minutes', false),
('Professional Cleaning', 'Thorough dental cleaning and oral health assessment', 'Preventive', '60 minutes', false),
('Dental Consultation', 'Initial consultation and treatment planning', 'General', '30 minutes', false),
('Emface Facial Rejuvenation', 'Non-invasive facial muscle toning and skin tightening', 'Cosmetic', '45 minutes', false);

-- Insert sample staff members
INSERT INTO staff (first_name, last_name, title, specialization, bio) VALUES
('Gregory', 'Pedro', 'Dr.', 'Oral Surgeon & Implant Specialist', 'Lead surgeon specializing in Yomi robotic implants'),
('Sarah', 'Johnson', 'Dr.', 'General Dentist', 'Experienced general dentist with focus on preventive care'),
('Michael', 'Chen', 'Dr.', 'TMJ Specialist', 'Expert in TMJ/TMD treatment and facial pain management');

-- Get staff IDs and insert availability
DO $$
DECLARE
    v_dr_pedro_id UUID;
    v_dr_johnson_id UUID;
    v_dr_chen_id UUID;
BEGIN
    SELECT id INTO v_dr_pedro_id FROM staff WHERE last_name = 'Pedro' LIMIT 1;
    SELECT id INTO v_dr_johnson_id FROM staff WHERE last_name = 'Johnson' LIMIT 1;
    SELECT id INTO v_dr_chen_id FROM staff WHERE last_name = 'Chen' LIMIT 1;

    -- Insert provider availability for Dr. Pedro (Monday-Friday 9-5)
    INSERT INTO provider_availability (staff_id, day_of_week, start_time, end_time)
    VALUES 
        (v_dr_pedro_id, 1, '09:00', '17:00'), -- Monday
        (v_dr_pedro_id, 2, '09:00', '17:00'), -- Tuesday
        (v_dr_pedro_id, 3, '09:00', '17:00'), -- Wednesday
        (v_dr_pedro_id, 4, '09:00', '17:00'), -- Thursday
        (v_dr_pedro_id, 5, '09:00', '17:00')  -- Friday
    ON CONFLICT (staff_id, day_of_week, start_time) DO NOTHING;

    -- Insert provider availability for Dr. Johnson (Monday-Thursday 8-6)
    INSERT INTO provider_availability (staff_id, day_of_week, start_time, end_time)
    VALUES 
        (v_dr_johnson_id, 1, '08:00', '18:00'), -- Monday
        (v_dr_johnson_id, 2, '08:00', '18:00'), -- Tuesday
        (v_dr_johnson_id, 3, '08:00', '18:00'), -- Wednesday
        (v_dr_johnson_id, 4, '08:00', '18:00')  -- Thursday
    ON CONFLICT (staff_id, day_of_week, start_time) DO NOTHING;

    -- Insert provider availability for Dr. Chen (Tuesday, Thursday, Friday 10-4)
    INSERT INTO provider_availability (staff_id, day_of_week, start_time, end_time)
    VALUES 
        (v_dr_chen_id, 2, '10:00', '16:00'), -- Tuesday
        (v_dr_chen_id, 4, '10:00', '16:00'), -- Thursday
        (v_dr_chen_id, 5, '10:00', '16:00')  -- Friday
    ON CONFLICT (staff_id, day_of_week, start_time) DO NOTHING;

    -- Insert sample blocked dates (holidays)
    INSERT INTO blocked_dates (date, reason, is_full_day)
    VALUES 
        ('2025-07-04', 'Independence Day', true),
        ('2025-09-01', 'Labor Day', true),
        ('2025-11-27', 'Thanksgiving', true),
        ('2025-11-28', 'Day after Thanksgiving', true),
        ('2025-12-25', 'Christmas Day', true),
        ('2025-12-31', 'New Years Eve - Closing Early', false)
    ON CONFLICT DO NOTHING;

    -- For New Years Eve, set specific hours
    UPDATE blocked_dates 
    SET start_time = '14:00', end_time = '18:00'
    WHERE date = '2025-12-31';

END $$;

-- Done! Your database is now set up for the booking system.