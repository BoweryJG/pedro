-- Seed data for the dental practice backend

-- Insert services
INSERT INTO services (name, description, category, estimated_duration, price_range, image_url, is_yomi_technology)
VALUES
    ('Dental Cleaning', 'Comprehensive cleaning and polishing of teeth to remove plaque and tartar.', 'preventative', '1 hour', '{"min": 100, "max": 150}', 'https://example.com/images/cleaning.jpg', false),
    ('Dental Implants', 'Artificial tooth roots placed in the jaw to hold a replacement tooth.', 'surgical', '2 hours', '{"min": 1500, "max": 3000}', 'https://example.com/images/implants.jpg', false),
    ('Teeth Whitening', 'Professional whitening to remove stains and discoloration.', 'cosmetic', '1 hour', '{"min": 200, "max": 500}', 'https://example.com/images/whitening.jpg', false),
    ('Root Canal', 'Treatment to repair and save a severely damaged or infected tooth.', 'general', '1.5 hours', '{"min": 800, "max": 1200}', 'https://example.com/images/rootcanal.jpg', false),
    ('Yomi Implant Surgery', 'Robotic-assisted dental implant surgery using Yomi technology.', 'yomi', '1.5 hours', '{"min": 2000, "max": 4000}', 'https://example.com/images/yomi-implant.jpg', true),
    ('Yomi Guided Wisdom Teeth Extraction', 'Precision extraction of wisdom teeth with robotic assistance.', 'yomi', '2 hours', '{"min": 1800, "max": 3500}', 'https://example.com/images/yomi-wisdom.jpg', true);

-- Insert staff members
INSERT INTO staff (first_name, last_name, title, specialization, bio, image_url)
VALUES
    ('Greg', 'Pedro', 'DDS, Lead Dentist', 'Implant Specialist', 'Dr. Greg Pedro is a highly skilled dentist specializing in advanced dental implant procedures using the latest Yomi robotic technology. With over 15 years of experience, he provides exceptional care with a gentle touch.', 'https://example.com/images/dr-pedro.jpg'),
    ('Sarah', 'Johnson', 'DDS', 'Cosmetic Dentistry', 'Dr. Johnson specializes in cosmetic procedures that enhance your smile. She combines artistic vision with dental expertise to create beautiful, natural-looking results.', 'https://example.com/images/dr-johnson.jpg'),
    ('Michael', 'Lee', 'DMD', 'Oral Surgery', 'Dr. Lee is an experienced oral surgeon who works closely with Dr. Pedro on complex surgical cases, especially those utilizing Yomi robotic assistance.', 'https://example.com/images/dr-lee.jpg'),
    ('Lisa', 'Williams', 'Dental Hygienist', 'Preventative Care', 'Lisa has been a dental hygienist for over 10 years and is passionate about helping patients maintain optimal oral health.', 'https://example.com/images/lisa-hygienist.jpg'),
    ('James', 'Rodriguez', 'Dental Assistant', 'Yomi Technology Specialist', 'James is specially trained in assisting with Yomi robotic procedures and ensures everything runs smoothly during implant surgeries.', 'https://example.com/images/james-assistant.jpg');

-- Insert Yomi technology features
INSERT INTO yomi_features (title, description, benefits, image_url)
VALUES
    ('Robotic Precision', 'Yomi technology provides robotic guidance for dental implant procedures with sub-millimeter accuracy.', '["Enhanced accuracy compared to freehand surgery", "Consistent results across procedures", "Real-time visual feedback for surgeons"]', 'https://example.com/images/yomi-precision.jpg'),
    ('Minimally Invasive', 'Allows for flapless procedures which reduce tissue disruption and preserve bone.', '["Less pain post-procedure", "Reduced swelling", "Faster healing times"]', 'https://example.com/images/yomi-minimally-invasive.jpg'),
    ('Real-time Adaptation', 'The robotic system adapts to patient movement during the procedure, maintaining accuracy throughout.', '["Patient comfort", "No rigid fixation required", "Continuous monitoring"]', 'https://example.com/images/yomi-adaptation.jpg'),
    ('3D Treatment Planning', 'Comprehensive pre-procedure planning using 3D imaging for optimal implant placement.', '["Personalized treatment planning", "Better aesthetic outcomes", "Avoids anatomical structures"]', 'https://example.com/images/yomi-planning.jpg'),
    ('Faster Recovery', 'The precision and minimally invasive nature of Yomi procedures leads to faster recovery times.', '["Return to normal activities sooner", "Less post-operative discomfort", "Reduced need for pain medication"]', 'https://example.com/images/yomi-recovery.jpg');
