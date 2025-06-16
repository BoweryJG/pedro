-- Create schema for dental practice backend

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
