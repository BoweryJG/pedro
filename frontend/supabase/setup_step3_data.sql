-- Step 3: Insert sample data
-- Run this after creating tables and functions

-- Insert services
INSERT INTO services (name, description, duration, price, category, is_yomi_technology) VALUES
  ('General Checkup', 'Comprehensive oral examination and cleaning', 60, 200.00, 'General', false),
  ('Dental Implant Consultation', 'Initial consultation for dental implant procedure', 45, 150.00, 'Implants', false),
  ('YOMI Robotic Implant Surgery', 'Computer-guided robotic dental implant placement', 120, 5000.00, 'Implants', true),
  ('TMJ Treatment Consultation', 'Evaluation and treatment planning for TMJ disorders', 45, 250.00, 'TMJ', false),
  ('EmFace Treatment', 'Non-invasive facial rejuvenation treatment', 30, 400.00, 'MedSpa', false),
  ('Teeth Whitening', 'Professional teeth whitening treatment', 90, 350.00, 'Cosmetic', false),
  ('Root Canal Therapy', 'Endodontic treatment', 90, 1200.00, 'General', false),
  ('Dental Crown', 'Porcelain crown placement', 60, 1500.00, 'Restorative', false)
ON CONFLICT (name) DO NOTHING;

-- Insert staff
INSERT INTO staff (title, first_name, last_name, email, specialization) VALUES
  ('Dr.', 'Gregory', 'Pedro', 'drpedro@gregpedromd.com', 'General Dentistry, Implantology, YOMI Technology'),
  ('Dr.', 'Sarah', 'Johnson', 'sjohnson@gregpedromd.com', 'Endodontics'),
  ('Dr.', 'Michael', 'Chen', 'mchen@gregpedromd.com', 'Periodontics, TMJ Specialist'),
  ('RDH', 'Emily', 'Williams', 'ewilliams@gregpedromd.com', 'Dental Hygienist')
ON CONFLICT (email) DO NOTHING;