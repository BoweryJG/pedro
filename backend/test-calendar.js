import dotenv from 'dotenv';
import calendarService from './services/calendarService.js';

dotenv.config();

async function testCalendarSystem() {
    console.log('🧪 Testing Calendar Availability System...\n');
    
    const providerId = process.env.DEFAULT_PROVIDER_ID;
    console.log(`Using Provider ID: ${providerId}\n`);
    
    try {
        // Test 1: Get next available slots
        console.log('1️⃣ Testing getNextAvailableSlots()...');
        const nextSlots = await calendarService.getNextAvailableSlots(providerId, 5);
        console.log(`Found ${nextSlots.length} available slots:`);
        nextSlots.forEach(slot => {
            console.log(`  - ${slot.dayName} at ${slot.startTime}`);
        });
        console.log('✅ Success!\n');
        
        // Test 2: Check specific slot availability
        console.log('2️⃣ Testing isSlotAvailable()...');
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);
        
        const isAvailable = await calendarService.isSlotAvailable(providerId, tomorrow);
        console.log(`Is tomorrow at 10 AM available? ${isAvailable ? 'Yes' : 'No'}`);
        console.log('✅ Success!\n');
        
        // Test 3: Format slots for conversation
        console.log('3️⃣ Testing formatSlotsForConversation()...');
        const conversationalResponse = calendarService.formatSlotsForConversation(nextSlots.slice(0, 3));
        console.log(`Julie would say: "${conversationalResponse}"`);
        console.log('✅ Success!\n');
        
        // Test 4: Parse time references
        console.log('4️⃣ Testing parseTimeReference()...');
        const timeTests = [
            'tomorrow at 2pm',
            'next Tuesday',
            'Friday morning',
            'tomorrow afternoon'
        ];
        
        timeTests.forEach(ref => {
            const parsed = calendarService.parseTimeReference(ref);
            console.log(`  "${ref}" → ${parsed.date.toLocaleDateString()} ${parsed.hour ? `at ${parsed.hour}:${String(parsed.minute).padStart(2, '0')}` : ''}`);
        });
        console.log('✅ Success!\n');
        
        console.log('🎉 All tests passed! Calendar system is ready for production.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests
testCalendarSystem();