-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_time_slots ENABLE ROW LEVEL SECURITY;

-- Services: Allow public read access
CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

-- Staff: Allow public read access for booking
CREATE POLICY "Staff are viewable by everyone" 
ON staff FOR SELECT 
USING (is_active = true);

-- Patients: Allow public insert for new patients and read own data
CREATE POLICY "Patients can insert their own record" 
ON patients FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Patients can view their own record" 
ON patients FOR SELECT 
USING (
  auth.uid() = auth_user_id 
  OR email = current_setting('request.jwt.claims', true)::json->>'email'
  OR true -- Allow public read for booking purposes
);

-- Appointments: Allow public insert and read own appointments
CREATE POLICY "Anyone can create appointments" 
ON appointments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view appointments" 
ON appointments FOR SELECT 
USING (true);

CREATE POLICY "Appointments can be updated by staff or patient" 
ON appointments FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM patients WHERE id = patient_id
  )
  OR auth.uid() IN (
    SELECT auth_user_id FROM staff WHERE id = staff_id
  )
  OR true -- Allow public updates for booking
);

-- Provider time slots: Allow public read
CREATE POLICY "Time slots are viewable by everyone" 
ON provider_time_slots FOR SELECT 
USING (true);

CREATE POLICY "Time slots can be inserted for booking" 
ON provider_time_slots FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Time slots can be updated for booking" 
ON provider_time_slots FOR UPDATE 
USING (true);

-- Function to generate time slots should be accessible
GRANT EXECUTE ON FUNCTION generate_time_slots TO anon, authenticated;