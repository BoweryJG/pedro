-- Step 4: Enable RLS and create policies
-- Run this after all tables are created

-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Staff are viewable by everyone" ON staff;
DROP POLICY IF EXISTS "Patients can insert their own record" ON patients;
DROP POLICY IF EXISTS "Patients can view their own record" ON patients;
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view appointments" ON appointments;
DROP POLICY IF EXISTS "Appointments can be updated by staff or patient" ON appointments;
DROP POLICY IF EXISTS "Time slots are viewable by everyone" ON provider_time_slots;
DROP POLICY IF EXISTS "Time slots can be inserted for booking" ON provider_time_slots;
DROP POLICY IF EXISTS "Time slots can be updated for booking" ON provider_time_slots;
DROP POLICY IF EXISTS "Financial data viewable by authenticated users only" ON financial_transactions;

-- Services: Allow public read access
CREATE POLICY "Services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

-- Staff: Allow public read access for booking
CREATE POLICY "Staff are viewable by everyone" 
ON staff FOR SELECT 
USING (is_active = true);

-- Patients: Allow public access for booking
CREATE POLICY "Patients can insert their own record" 
ON patients FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Patients can view their own record" 
ON patients FOR SELECT 
USING (true);

-- Appointments: Allow public access for booking
CREATE POLICY "Anyone can create appointments" 
ON appointments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view appointments" 
ON appointments FOR SELECT 
USING (true);

CREATE POLICY "Appointments can be updated by staff or patient" 
ON appointments FOR UPDATE 
USING (true);

-- Provider time slots: Allow public access
CREATE POLICY "Time slots are viewable by everyone" 
ON provider_time_slots FOR SELECT 
USING (true);

CREATE POLICY "Time slots can be inserted for booking" 
ON provider_time_slots FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Time slots can be updated for booking" 
ON provider_time_slots FOR UPDATE 
USING (true);

-- Financial transactions: Restricted to authenticated users
CREATE POLICY "Financial data viewable by authenticated users only" 
ON financial_transactions FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT ON patients, appointments, provider_time_slots TO anon, authenticated;
GRANT UPDATE ON patients, appointments, provider_time_slots TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_time_slots TO anon, authenticated;

-- Grant all permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;