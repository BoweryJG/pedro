# Julie AI Voice Assistant - Complete Setup Guide

## Overview
Julie is an AI-powered voice assistant that handles patient calls, books appointments, and sends SMS confirmations - all without requiring traditional phone lines thanks to WebRTC technology.

## Features
- 🎙️ **WebRTC Voice Calls**: Browser-based calling, no phone numbers needed
- 🤖 **AI Conversations**: Natural language understanding powered by GPT-3.5
- 📅 **Real Appointment Booking**: Creates appointments in Supabase database
- 💬 **SMS Confirmations**: Sends text confirmations via Twilio
- 🎯 **Smart Call Routing**: Can transfer to human staff when requested
- 📊 **Call Transcripts**: All conversations saved to database

## How Julie Works

### Voice Technology Stack
- **Speech-to-Text**: Whisper (via Huggingface)
- **AI Brain**: OpenRouter GPT-3.5-turbo
- **Text-to-Speech**: Coqui TTS (via Huggingface)
- **Voice Transport**: WebRTC (no phone lines!)

### Conversation Flow
1. Patient clicks "Talk to Julie" button
2. WebRTC connection established directly to your server
3. Julie greets: "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?"
4. Patient speaks naturally about their needs
5. Julie extracts information and books appointments
6. SMS confirmation sent automatically

## What Julie Can Do

### Appointment Booking
Julie naturally extracts:
- Patient name
- Phone number
- Preferred date/time
- Dental concern

Example conversation:
```
Patient: "I'd like to book an appointment"
Julie: "I'd be happy to help! What's your name?"
Patient: "John Smith"
Julie: "Thank you, John. What day works best for you?"
Patient: "How about tomorrow afternoon?"
Julie: "I have openings tomorrow at 2 PM or 4 PM. Which would you prefer?"
Patient: "2 PM is perfect"
Julie: "Great! And what's the best phone number to reach you?"
Patient: "929-555-1234"
Julie: "Perfect! Let me confirm: Tomorrow at 2 PM for John Smith. Shall I book this for you?"
Patient: "Yes please"
Julie: "Wonderful! I've booked your appointment. You'll receive a text confirmation shortly."
```

### Natural Language Understanding
Julie understands:
- "tomorrow", "next Tuesday", "Monday morning"
- "2 PM", "afternoon", "morning"
- Various ways to express needs: "tooth pain", "cleaning", "check-up"

### Human Handoff
If patient asks for a human:
```
Patient: "Can I speak to someone?"
Julie: "I'd be happy to connect you with our team right away. Dr. Pedro or one of our specialists will call you back within 5 minutes. What's the best number to reach you?"
```

## Database Structure

### voice_calls table
```sql
- id: UUID
- session_id: Text (unique session identifier)
- call_type: Text ('webrtc' or 'twilio')
- transcript: JSONB (array of messages)
- patient_info: JSONB (extracted patient details)
- appointment_booked: Boolean
- appointment_details: JSONB (booking information)
- started_at: Timestamp
- ended_at: Timestamp
- duration_seconds: Integer
- summary: Text
```

### appointments table
```sql
- id: UUID
- patient_id: UUID (references patients)
- service_id: UUID (references services)
- appointment_date: Date
- appointment_time: Time
- status: Enum ('scheduled', 'completed', 'cancelled')
- notes: Text
```

## Configuration

### Environment Variables (.env)
```env
# AI Services
OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACE_TOKEN=your_huggingface_token

# Twilio (for SMS only)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+19292424535

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Note**: The actual values are configured in your `.env` file. Never commit real API keys to GitHub.

### Voice Configuration
To change Julie's voice or personality:

1. **Voice Model** (in `voiceService.js`):
```javascript
// Line 234 - Change TTS model
'https://api-inference.huggingface.co/models/coqui/XTTS-v2'
```

2. **AI Model** (in `voiceService.js`):
```javascript
// Line 204 - Change to GPT-4 or other models
model: 'openai/gpt-3.5-turbo',
```

3. **System Prompt** (in `webrtcVoiceService.js`):
```javascript
// Line 348 - Customize Julie's personality
getSystemPrompt() {
  return `You are Julie, Dr. Pedro's warm and professional dental office AI assistant...`
}
```

## SMS Notifications

Despite Twilio A2P 10DLC warnings, SMS works for transactional messages:
- Appointment confirmations
- Appointment reminders  
- Rescheduling notifications

Format:
```
Hi John, this is Dr. Pedro's office confirming your appointment on 
March 15 at 2:00 PM. Reply YES to confirm or call (929) 242-4535 
to reschedule. Thank you!
```

## Troubleshooting

### Voice Issues
- **No audio**: Check browser microphone permissions
- **Can't hear Julie**: Check speaker/volume settings
- **Poor quality**: Ensure stable internet connection

### SMS Issues
- **Not receiving texts**: Verify phone number format (+1XXXXXXXXXX)
- **Twilio errors**: Check Twilio console for credits/balance
- **A2P warnings**: These don't affect transactional SMS

### Booking Issues
- **Appointment not created**: Check Supabase logs
- **Wrong time zone**: Verify server timezone settings
- **Patient not found**: New patients are auto-created

## Running the System

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
Run in Supabase SQL editor:
```sql
-- Add appointment_details column if missing
ALTER TABLE voice_calls 
ADD COLUMN IF NOT EXISTS appointment_details JSONB DEFAULT NULL;
```

## Why WebRTC Instead of Twilio Voice?

We built WebRTC calling because:
1. Twilio blocked voice configuration due to A2P 10DLC requirements
2. No phone number restrictions or compliance issues
3. Better audio quality (no phone compression)
4. Works internationally without toll charges
5. Direct browser-to-server connection

## Future Enhancements

- [ ] Multi-language support
- [ ] Video consultations
- [ ] Insurance verification
- [ ] Calendar integration
- [ ] Appointment reminders
- [ ] Post-appointment surveys

## Support

For issues or questions:
- Check browser console for errors
- Review backend logs
- Verify all environment variables are set
- Ensure Supabase tables exist

Julie handles thousands of conversations, books real appointments, and saves your staff hours every day - all without traditional phone lines!