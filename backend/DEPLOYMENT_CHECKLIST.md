# Deployment Checklist for Voice AI

## 1. Environment Variables in Render

Add these to your Render backend service environment:

```bash
# Required (from backend/.env)
OPENROUTER_API_KEY=your_openrouter_key_here
HUGGINGFACE_TOKEN=your_huggingface_token_here

# Optional but recommended
NODE_ENV=production
```

## 2. Twilio Phone Number Configuration

1. Log into [Twilio Console](https://console.twilio.com)
2. Navigate to Phone Numbers > Manage > Active Numbers
3. Click on your number: **+1 (929) 242-4535**
4. Update Voice Configuration:
   - **A call comes in**: Webhook
   - **URL**: `https://pedrobackend.onrender.com/voice/incoming`
   - **HTTP**: POST
   - **Primary Handler Fails**: Leave default
   - **Call Status Changes**: 
     - **URL**: `https://pedrobackend.onrender.com/voice/status`
     - **HTTP**: POST
5. Save configuration

## 3. Deploy Backend to Render

```bash
cd backend
git add -A
git commit -m "Deploy voice AI to production"
git push origin main
```

Render will automatically:
- Install dependencies including WebSocket support
- Start the server with `npm start`
- Enable WebSocket connections

## 4. Verify Deployment

### Check Voice Service Status:
```bash
curl https://pedrobackend.onrender.com/voice/test
```

Should return:
```json
{
  "status": "operational",
  "tests": {
    "tts": "passed",
    "websocket": "ready",
    "connections": 0
  }
}
```

### Check Overall Health:
```bash
curl https://pedrobackend.onrender.com/health
```

## 5. Test Voice AI

1. Call **(929) 242-4535**
2. You'll hear: "Please wait while I connect you to our AI assistant"
3. Then Julie greets: "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?"

### Test Scenarios:
- "I need to book an appointment"
- "What services do you offer?"
- "I have a toothache" (emergency)
- "What are your hours?"
- "Do you accept my insurance?"

## 6. Monitor Logs

In Render Dashboard:
1. Go to your backend service
2. Click "Logs" tab
3. Look for:
   - `Backend server with WebSocket support running on port [PORT]`
   - `New WebSocket connection for voice`
   - `Stream [id] started for call [id]`
   - `Transcript: [user speech]`

## 7. Troubleshooting

### No Audio/Connection:
- Check Render logs for WebSocket errors
- Verify environment variables are set
- Check Twilio webhook is using HTTPS (not HTTP)

### High Latency:
- Monitor Huggingface API response times
- Check Render service location (should be US)
- Consider upgrading Render instance

### Call Drops:
- Check for memory issues in Render metrics
- Monitor WebSocket stability
- Review error logs

## 8. Production Optimizations

Consider for production:
1. Add Redis for response caching
2. Implement call recording for quality
3. Add analytics tracking
4. Set up alerts for failures
5. Configure auto-scaling

## Current Status

✅ Voice AI code implemented
✅ WebSocket server configured
✅ Audio processing pipeline ready
✅ STT/TTS integration complete
✅ Conversation management built
⏳ Twilio webhook configuration needed
⏳ Production environment variables needed
⏳ Live testing required