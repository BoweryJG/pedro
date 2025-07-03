# Voice AI Integration Setup Guide

## Overview
This guide explains how to set up and configure the AI voice assistant for phone calls using Twilio Media Streams, Whisper STT, OpenRouter LLM, and TTS.

## Architecture Components

1. **Twilio Media Streams**: Handles incoming phone calls and audio streaming
2. **WebSocket Server**: Real-time bidirectional audio communication
3. **Whisper STT**: Converts speech to text via Huggingface API
4. **OpenRouter LLM**: Generates conversational responses
5. **Coqui TTS**: Converts text back to speech
6. **Voice Activity Detection**: Manages turn-taking in conversation

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file or Render environment:

```bash
# Required
OPENROUTER_API_KEY=your_openrouter_key
HUGGINGFACE_TOKEN=your_huggingface_token

# Optional (defaults provided)
NODE_ENV=production
PORT=3001
```

### 2. Twilio Configuration

1. Log into your Twilio Console
2. Buy a phone number or use an existing one
3. Configure the phone number:
   - **Voice Configuration**:
     - When a call comes in: `Webhook`
     - URL: `https://pedrobackend.onrender.com/voice/incoming`
     - HTTP Method: `POST`
   - **Status Callback URL**: `https://pedrobackend.onrender.com/voice/status`
   - **HTTP Method**: `POST`

### 3. Deploy to Render

The backend is already configured for Render deployment with WebSocket support:

1. Ensure your Render service has:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Add the environment variables above

2. Render automatically supports WebSocket connections, no additional configuration needed

### 4. Testing

#### Local Testing with ngrok:
```bash
# Install ngrok
npm install -g ngrok

# Start backend locally
npm run dev

# In another terminal, expose your local server
ngrok http 3001

# Update Twilio webhook to ngrok URL
# Example: https://abc123.ngrok.io/voice/incoming
```

#### Test Call Flow:
1. Call your Twilio number
2. You'll hear: "Please wait while I connect you to our AI assistant"
3. Then: "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?"
4. Have a natural conversation!

## Features

### Conversation Capabilities:
- **General Questions**: Office hours, services, pricing
- **Appointment Booking**: Collects name, phone, preferred time, concern
- **Emergency Handling**: Directs to ER or schedules urgent appointments
- **Insurance Questions**: Basic coverage information
- **Rescheduling**: Handle existing appointment changes

### Technical Features:
- **Low Latency**: <1 second response time
- **Natural Speech**: Includes fillers and conversational patterns
- **Context Awareness**: Maintains conversation history
- **Voice Activity Detection**: Natural turn-taking
- **Error Recovery**: Graceful handling of connection issues

## Monitoring

### Logs to Monitor:
```javascript
// Connection logs
"New WebSocket connection for voice"
"Stream [streamSid] started for call [callSid]"

// Conversation logs
"Transcript: [user speech]"
"Call status: [status] for call: [callSid]"

// Error logs
"STT Error:", "LLM Error:", "TTS Error:"
```

### Health Checks:
- WebSocket connections: Check active connection count
- API response times: Monitor STT/TTS/LLM latencies
- Audio quality: Monitor VAD detection rates

## Troubleshooting

### Common Issues:

1. **No audio received**:
   - Check Twilio webhook URL is correct
   - Verify WebSocket URL uses `wss://` for HTTPS
   - Check firewall/security group allows WebSocket connections

2. **High latency**:
   - Monitor Huggingface API response times
   - Consider implementing response caching
   - Optimize audio buffer sizes

3. **Poor speech recognition**:
   - Ensure audio quality settings in Twilio
   - Adjust VAD threshold for better detection
   - Consider noise reduction preprocessing

4. **WebSocket disconnections**:
   - Implement reconnection logic
   - Monitor connection stability
   - Check for memory leaks in long calls

## Cost Optimization

### API Usage:
- **Huggingface**: Free tier allows 30,000 requests/month
- **OpenRouter**: $0.002 per 1K tokens
- **Twilio**: ~$0.015/minute for incoming calls

### Optimization Tips:
1. Cache common responses
2. Use shorter system prompts
3. Implement call duration limits
4. Monitor API usage regularly

## Security Considerations

1. **API Keys**: Never commit keys to repository
2. **Call Validation**: Verify Twilio request signatures
3. **Rate Limiting**: Implement per-number rate limits
4. **PII Handling**: Don't log sensitive patient information
5. **HTTPS Only**: Ensure all endpoints use TLS

## Future Enhancements

1. **Multi-language Support**: Add Spanish language option
2. **Call Transfers**: Transfer to human staff when needed
3. **SMS Follow-up**: Send appointment confirmations via SMS
4. **Analytics**: Track call metrics and conversation success rates
5. **Custom Voices**: Train custom TTS voices for branding

## Support

For issues or questions:
- Check Render logs for error messages
- Monitor Twilio debugger for call issues
- Test with the local ngrok setup for debugging
- Contact support with call SIDs for investigation