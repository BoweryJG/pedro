# VoIP Service Integration Documentation

## Overview

The Pedro backend now includes comprehensive VoIP service integration with VoIP.ms, providing SMS handling with auto-responses, call recording, transcription capabilities, and integration with the Supabase database.

## Features

### 1. SMS Handling
- **Inbound SMS Processing**: Automatically processes incoming SMS messages
- **Auto-Response System**: Intelligent keyword-based auto-responses for common queries
- **SMS Conversation Tracking**: Maintains conversation threads in the database
- **Twilio Backup**: Falls back to Twilio for SMS sending when needed

### 2. Call Recording & Transcription
- **Call Recording Management**: Downloads and stores call recordings from VoIP.ms
- **Multi-Service Transcription**: Supports transcription via:
  - OpenAI Whisper API
  - Google Speech-to-Text
  - Hugging Face Whisper models
- **Key Information Extraction**: AI-powered extraction of important details from transcriptions
- **Call Summary Generation**: Automatic summaries of phone conversations

### 3. Database Integration
- **Phone Calls Table**: Stores all call records with metadata
- **SMS Conversations Table**: Tracks SMS conversation threads
- **SMS Messages Table**: Individual messages within conversations
- **Full-Text Search**: Searchable transcriptions and message content

### 4. Scheduled Jobs
- **Hourly Call Sync**: Syncs call history from VoIP.ms
- **SMS Check (15 min)**: Checks for new SMS messages
- **Daily Analytics**: Generates communication analytics

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# VoIP.ms Configuration
VOIPMS_USERNAME=your_voipms_username
VOIPMS_PASSWORD=your_voipms_api_password
VOIPMS_DID=your_voipms_phone_number

# Optional: Transcription Services
OPENAI_API_KEY=sk-...  # For Whisper transcription
GOOGLE_APPLICATION_CREDENTIALS=/path/to/google-credentials.json
HUGGINGFACE_TOKEN=hf_...

# Enable transcription
ENABLE_TRANSCRIPTION=true
```

### Database Setup

The phone system tables are already created via the migration file. The schema includes:
- `phone_calls` - Call records with transcriptions
- `sms_conversations` - SMS conversation threads
- `sms_messages` - Individual SMS messages

## API Endpoints

### SMS Endpoints

#### Send SMS
```http
POST /api/voip/sms/send
Content-Type: application/json

{
  "to": "+1234567890",
  "message": "Your appointment is confirmed for tomorrow at 2 PM"
}
```

#### Get SMS Conversations
```http
GET /api/voip/sms/conversations?limit=50
```

#### SMS Webhook (for VoIP.ms)
```http
POST /api/voip/sms/webhook
Content-Type: application/json

{
  "from": "+1234567890",
  "message": "I need to schedule an appointment",
  "id": "sms_123"
}
```

### Call Management Endpoints

#### Get Call History
```http
GET /api/voip/calls/history?dateFrom=2024-01-01&dateTo=2024-01-31
```

#### Get Call Recordings
```http
GET /api/voip/calls/recordings?callId=call_123
```

#### Download Specific Recording
```http
GET /api/voip/calls/recording/rec_123?callSid=call_123
```

### Administrative Endpoints

#### Sync Call History
```http
POST /api/voip/sync
```

#### Get Analytics
```http
GET /api/voip/analytics?startDate=2024-01-01&endDate=2024-01-31
```

#### Configure VoIP.ms Webhook
```http
POST /api/voip/configure-webhook
Content-Type: application/json

{
  "webhookUrl": "https://yourdomain.com/api/voip/sms/webhook"
}
```

## Auto-Response Configuration

The system includes pre-configured auto-responses for common queries:

1. **Appointment Requests**: Keywords: appointment, schedule, book, available
2. **Emergency**: Keywords: emergency, urgent, pain, bleeding
3. **Office Hours**: Keywords: hours, open, closed, time
4. **Location**: Keywords: location, address, where, directions
5. **Insurance**: Keywords: insurance, coverage, accept, plan

Customize these in `src/services/voipService.js` in the `autoResponses` object.

## Usage Examples

### Processing Incoming SMS

When an SMS is received, the system:
1. Stores the message in the database
2. Analyzes content for keywords
3. Sends appropriate auto-response
4. Flags for review if no auto-response matches

### Transcribing Call Recordings

```javascript
// The system automatically transcribes recordings when syncing
// Manual transcription can be triggered via API
GET /api/voip/calls/recording/rec_123?callSid=call_123
```

### Analytics Dashboard Data

```javascript
// Get comprehensive communication analytics
const analytics = await fetch('/api/voip/analytics?startDate=2024-01-01&endDate=2024-01-31');

// Returns:
{
  "analytics": {
    "calls": {
      "total": 150,
      "inbound": 120,
      "outbound": 30,
      "averageDuration": 180,
      "completionRate": 0.85
    },
    "sms": {
      "total": 300,
      "sent": 180,
      "received": 120,
      "deliveryRate": 0.95
    }
  }
}
```

## Security Considerations

1. **API Authentication**: All VoIP.ms credentials are stored securely in environment variables
2. **Rate Limiting**: Strict rate limits on sensitive endpoints
3. **Database Security**: Row-level security policies ensure data isolation
4. **Webhook Validation**: Implement webhook signature validation for production

## Troubleshooting

### Common Issues

1. **SMS Not Sending**
   - Verify VoIP.ms credentials
   - Check account balance
   - Ensure DID is SMS-enabled

2. **Transcription Failing**
   - Check API keys for transcription services
   - Verify audio file format compatibility
   - Monitor API quotas

3. **Webhook Not Receiving**
   - Confirm webhook URL is publicly accessible
   - Check VoIP.ms webhook configuration
   - Review server logs for incoming requests

### Monitoring

Monitor the following for system health:
- VoIP.ms API response times
- Transcription service availability
- Database query performance
- Scheduled job execution logs

## Future Enhancements

1. **Voice Mail System**: Implement voicemail transcription and email notifications
2. **Call Routing**: Intelligent call routing based on caller history
3. **SMS Templates**: Pre-defined message templates for common responses
4. **Advanced Analytics**: Machine learning for call pattern analysis
5. **Multi-Language Support**: Transcription and auto-responses in multiple languages