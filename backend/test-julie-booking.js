import dotenv from 'dotenv';
import julieAI from './services/julieAI.js';

dotenv.config();

async function testJulieBooking() {
    console.log('🤖 Testing Julie AI Appointment Booking...\n');
    
    // Create a mock connection object
    const mockConnection = {
        id: 'test-connection',
        context: {
            patientInfo: {
                name: 'John Doe',
                phone: '555-1234',
                email: 'john@example.com',
                concern: 'teeth cleaning',
                dayPreference: 'tomorrow',
                timePreference: 'afternoon'
            },
            messages: [],
            isAppointmentReady() {
                return this.patientInfo.name && 
                       this.patientInfo.phone && 
                       this.patientInfo.dayPreference;
            },
            getMissingInfo() {
                const required = ['name', 'phone number', 'reason for visit'];
                const missing = [];
                if (!this.patientInfo.name) missing.push('name');
                if (!this.patientInfo.phone) missing.push('phone number');
                if (!this.patientInfo.concern) missing.push('reason for visit');
                return missing;
            },
            detectIntent(transcript) {
                if (transcript.toLowerCase().includes('appointment')) {
                    return 'appointment';
                }
                return 'inquiry';
            },
            addMessage(role, content) {
                this.messages.push({ role, content });
            },
            extractPatientInfo(transcript) {
                // Mock extraction
            },
            getSystemPrompt() {
                return "You are Julie, a friendly dental office assistant.";
            }
        }
    };
    
    // julieAI is already instantiated as a singleton
    
    try {
        console.log('1️⃣ Testing appointment booking flow...');
        console.log('Patient info:', mockConnection.context.patientInfo);
        
        // Test the appointment booking handler
        const response = await julieAI.handleAppointmentBooking(mockConnection);
        console.log('\n📞 Julie would say:');
        console.log(`"${response}"`);
        
        // Test getting available slots
        console.log('\n2️⃣ Testing available slots retrieval...');
        const slots = await julieAI.getAvailableSlots();
        console.log('Available slots format:', typeof slots);
        console.log('Slots response:', slots);
        
        console.log('\n✅ Julie AI integration test complete!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
    
    // Exit the process
    process.exit(0);
}

// Run test
testJulieBooking();