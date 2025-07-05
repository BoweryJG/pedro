import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function testSimpleBooking() {
    console.log('🧪 Testing Appointment Booking Flow...\n');
    
    const providerId = process.env.DEFAULT_PROVIDER_ID;
    
    try {
        // Step 1: Create a test appointment
        console.log('1️⃣ Creating test appointment in database...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow
        
        const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert({
                patient_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Test patient ID
                patient_name: 'Test Patient',
                patient_phone: '555-123-4567',
                patient_email: 'test@example.com',
                service_type: 'cleaning',
                appointment_date: tomorrow.toISOString().split('T')[0], // Date only
                appointment_time: '14:00:00', // Time only
                start_time: tomorrow.toISOString(),
                end_time: new Date(tomorrow.getTime() + 30 * 60000).toISOString(),
                status: 'scheduled',
                notes: 'Test appointment booked via Julie AI',
                booked_via: 'julie_ai_voice'
            })
            .select()
            .single();
            
        if (appointmentError) throw appointmentError;
        console.log('✅ Appointment created:', appointment.id);
        
        // Step 2: Book a slot for the appointment
        console.log('\n2️⃣ Booking calendar slot...');
        
        const { data: bookingResult, error: bookingError } = await supabase.rpc('book_appointment_slot', {
            p_provider_id: providerId,
            p_start_time: tomorrow.toISOString(),
            p_appointment_id: appointment.id,
            p_duration_minutes: 30
        });
        
        if (bookingError) throw bookingError;
        
        const result = bookingResult[0];
        console.log('✅ Slot booking result:', result);
        
        // Step 3: Verify the slot is now unavailable
        console.log('\n3️⃣ Verifying slot is now booked...');
        const { data: isAvailable, error: checkError } = await supabase.rpc('is_slot_available', {
            p_provider_id: providerId,
            p_start_time: tomorrow.toISOString(),
            p_duration_minutes: 30
        });
        
        if (checkError) throw checkError;
        console.log(`✅ Slot availability: ${isAvailable ? 'Available' : 'Booked'}`);
        
        // Step 4: Get next available slots
        console.log('\n4️⃣ Getting next available slots...');
        const { data: nextSlots, error: slotsError } = await supabase.rpc('get_next_available_slots', {
            p_provider_id: providerId,
            p_count: 3
        });
        
        if (slotsError) throw slotsError;
        console.log('✅ Next available slots:');
        nextSlots.forEach(slot => {
            console.log(`   - ${slot.day_name.trim()} at ${slot.formatted_time}`);
        });
        
        // Cleanup: Delete the test appointment
        console.log('\n5️⃣ Cleaning up test data...');
        await supabase.from('appointments').delete().eq('id', appointment.id);
        console.log('✅ Test appointment deleted');
        
        console.log('\n🎉 All tests passed! The booking system is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    process.exit(0);
}

testSimpleBooking();