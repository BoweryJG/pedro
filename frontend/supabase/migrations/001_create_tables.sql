-- Create tables for Dr. Pedro's dental practice

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  insurance_provider VARCHAR(100),
  insurance_member_id VARCHAR(50),
  insurance_group_number VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID,
  title VARCHAR(20),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  specialization VARCHAR(200),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  duration INTEGER DEFAULT 30, -- in minutes
  price DECIMAL(10, 2),
  is_yomi_technology BOOLEAN DEFAULT false,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration INTERVAL DEFAULT '30 minutes',
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  confirmation_code VARCHAR(20),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create provider_time_slots table
CREATE TABLE IF NOT EXISTS provider_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(staff_id, date, start_time)
);

-- Create financial_transactions table (for dashboard metrics)
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) CHECK (transaction_type IN ('payment', 'refund', 'adjustment')),
  payment_method VARCHAR(50),
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_staff ON appointments(staff_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_provider_slots_staff ON provider_time_slots(staff_id);
CREATE INDEX idx_provider_slots_date ON provider_time_slots(date);
CREATE INDEX idx_transactions_patient ON financial_transactions(patient_id);
CREATE INDEX idx_transactions_date ON financial_transactions(transaction_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
  v_start_time TIME := '09:00:00';
  v_end_time TIME := '17:00:00';
  v_current_time TIME;
BEGIN
  v_current_time := v_start_time;
  
  WHILE v_current_time < v_end_time LOOP
    RETURN QUERY
    SELECT 
      v_current_time as start_time,
      v_current_time + p_slot_duration as end_time,
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

-- Insert sample data
INSERT INTO services (name, description, duration, price, category, is_yomi_technology) VALUES
  ('General Checkup', 'Comprehensive oral examination and cleaning', 60, 200.00, 'General', false),
  ('Dental Implant Consultation', 'Initial consultation for dental implant procedure', 45, 150.00, 'Implants', false),
  ('YOMI Robotic Implant Surgery', 'Computer-guided robotic dental implant placement', 120, 5000.00, 'Implants', true),
  ('TMJ Treatment Consultation', 'Evaluation and treatment planning for TMJ disorders', 45, 250.00, 'TMJ', false),
  ('EmFace Treatment', 'Non-invasive facial rejuvenation treatment', 30, 400.00, 'MedSpa', false),
  ('Teeth Whitening', 'Professional teeth whitening treatment', 90, 350.00, 'Cosmetic', false),
  ('Root Canal Therapy', 'Endodontic treatment', 90, 1200.00, 'General', false),
  ('Dental Crown', 'Porcelain crown placement', 60, 1500.00, 'Restorative', false);

INSERT INTO staff (title, first_name, last_name, email, specialization) VALUES
  ('Dr.', 'Gregory', 'Pedro', 'drpedro@gregpedromd.com', 'General Dentistry, Implantology, YOMI Technology'),
  ('Dr.', 'Sarah', 'Johnson', 'sjohnson@gregpedromd.com', 'Endodontics'),
  ('Dr.', 'Michael', 'Chen', 'mchen@gregpedromd.com', 'Periodontics, TMJ Specialist'),
  ('RDH', 'Emily', 'Williams', 'ewilliams@gregpedromd.com', 'Dental Hygienist');

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;