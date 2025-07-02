-- Step 2: Create functions and triggers
-- Run this after creating tables

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate time slots
CREATE OR REPLACE FUNCTION generate_time_slots(
  p_staff_id UUID,
  p_date DATE,
  p_slot_duration INTERVAL DEFAULT '30 minutes'
)
RETURNS TABLE (
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN
) AS $$
DECLARE
  v_start_time TIME := TIME '09:00:00';
  v_end_time TIME := TIME '17:00:00';
  v_current_time TIME;
BEGIN
  v_current_time := v_start_time;
  
  WHILE v_current_time < v_end_time LOOP
    RETURN QUERY
    SELECT 
      v_current_time as start_time,
      (v_current_time + p_slot_duration) as end_time,
      NOT EXISTS (
        SELECT 1 
        FROM provider_time_slots pts
        WHERE pts.staff_id = p_staff_id
        AND pts.date = p_date
        AND pts.start_time <= v_current_time
        AND pts.end_time > v_current_time
        AND pts.is_available = false
      ) as is_available;
    
    v_current_time := v_current_time + p_slot_duration;
  END LOOP;
END;
$$ LANGUAGE plpgsql;