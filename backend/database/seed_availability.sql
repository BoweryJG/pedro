-- Sample provider schedule data for testing
-- Replace with actual provider IDs in production

-- Create a sample provider ID (in production, this would be your actual provider's ID)
DO $$
DECLARE
    v_provider_id UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
BEGIN
    -- Insert weekly schedule for the provider
    -- Monday to Friday: 9 AM - 5 PM with lunch break
    INSERT INTO provider_schedules (provider_id, day_of_week, start_time, end_time, is_active) VALUES
    (v_provider_id, 1, '09:00:00', '12:00:00', true), -- Monday morning
    (v_provider_id, 1, '13:00:00', '17:00:00', true), -- Monday afternoon
    (v_provider_id, 2, '09:00:00', '12:00:00', true), -- Tuesday morning
    (v_provider_id, 2, '13:00:00', '17:00:00', true), -- Tuesday afternoon
    (v_provider_id, 3, '09:00:00', '12:00:00', true), -- Wednesday morning
    (v_provider_id, 3, '13:00:00', '17:00:00', true), -- Wednesday afternoon
    (v_provider_id, 4, '09:00:00', '12:00:00', true), -- Thursday morning
    (v_provider_id, 4, '13:00:00', '17:00:00', true), -- Thursday afternoon
    (v_provider_id, 5, '09:00:00', '12:00:00', true), -- Friday morning
    (v_provider_id, 5, '13:00:00', '16:00:00', true); -- Friday afternoon (early close)
    
    -- Add some blocked times (vacation days, etc.)
    INSERT INTO provider_blocked_times (provider_id, start_time, end_time, reason) VALUES
    -- Block next Monday afternoon for a meeting
    (v_provider_id, 
     (CURRENT_DATE + INTERVAL '7 days' - EXTRACT(DOW FROM CURRENT_DATE)::INT + 1 || ' days')::DATE + TIME '13:00:00',
     (CURRENT_DATE + INTERVAL '7 days' - EXTRACT(DOW FROM CURRENT_DATE)::INT + 1 || ' days')::DATE + TIME '15:00:00',
     'Staff Meeting'),
    -- Block a vacation day next month
    (v_provider_id,
     (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' + INTERVAL '15 days')::DATE + TIME '00:00:00',
     (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' + INTERVAL '15 days')::DATE + TIME '23:59:59',
     'Personal Day Off');
     
    -- Pre-generate some appointment slots for the next 2 weeks
    -- This is optional - the generate_available_slots function can create them on demand
    WITH date_series AS (
        SELECT generate_series(
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '14 days',
            '1 day'::INTERVAL
        )::DATE AS slot_date
    )
    INSERT INTO appointment_slots (provider_id, appointment_date, start_time, end_time, duration_minutes, is_available)
    SELECT 
        v_provider_id,
        slot_date,
        slot_start,
        slot_start + INTERVAL '30 minutes',
        30,
        true
    FROM date_series
    CROSS JOIN LATERAL generate_available_slots(v_provider_id, slot_date, 30) AS slots(slot_start, slot_end)
    ON CONFLICT (provider_id, start_time) DO NOTHING;
    
END $$;

-- Update .env.example with the sample provider ID
-- DEFAULT_PROVIDER_ID=a1b2c3d4-e5f6-7890-abcd-ef1234567890