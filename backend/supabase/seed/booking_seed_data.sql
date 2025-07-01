-- Seed data for booking system

-- Insert sample staff members if not exists
INSERT INTO staff (first_name, last_name, title, specialization, bio)
SELECT 'Gregory', 'Pedro', 'Dr.', 'Oral Surgeon & Implant Specialist', 'Lead surgeon specializing in Yomi robotic implants'
WHERE NOT EXISTS (SELECT 1 FROM staff WHERE first_name = 'Gregory' AND last_name = 'Pedro');

INSERT INTO staff (first_name, last_name, title, specialization, bio)
SELECT 'Sarah', 'Johnson', 'Dr.', 'General Dentist', 'Experienced general dentist with focus on preventive care'
WHERE NOT EXISTS (SELECT 1 FROM staff WHERE first_name = 'Sarah' AND last_name = 'Johnson');

INSERT INTO staff (first_name, last_name, title, specialization, bio)
SELECT 'Michael', 'Chen', 'Dr.', 'TMJ Specialist', 'Expert in TMJ/TMD treatment and facial pain management'
WHERE NOT EXISTS (SELECT 1 FROM staff WHERE first_name = 'Michael' AND last_name = 'Chen');

-- Get staff IDs
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

-- Update services with estimated durations if not set
UPDATE services 
SET estimated_duration = CASE 
    WHEN name LIKE '%Implant%' THEN INTERVAL '90 minutes'
    WHEN name LIKE '%TMJ%' THEN INTERVAL '60 minutes'
    WHEN name LIKE '%Cleaning%' THEN INTERVAL '60 minutes'
    WHEN name LIKE '%Consultation%' THEN INTERVAL '30 minutes'
    WHEN name LIKE '%Emface%' THEN INTERVAL '45 minutes'
    ELSE INTERVAL '60 minutes'
END
WHERE estimated_duration IS NULL;