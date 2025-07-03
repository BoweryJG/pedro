# Twilio Voice Configuration

## Quick Setup

Your Twilio phone number needs to be configured with these URLs:

### Voice Configuration
- **When a call comes in**: `https://pedrobackend.onrender.com/voice/incoming`
- **HTTP Method**: POST
- **Status Callback URL**: `https://pedrobackend.onrender.com/voice/status`
- **HTTP Method**: POST

## Setup Steps

1. Go to [Twilio Console](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Click on your phone number: **+1 (929) 242-4535**
3. In the "Voice Configuration" section:
   - Set "A call comes in" to: Webhook
   - URL: `https://pedrobackend.onrender.com/voice/incoming`
   - HTTP: POST
4. In the "Call Status Changes" section:
   - URL: `https://pedrobackend.onrender.com/voice/status`
   - HTTP: POST
5. Click "Save configuration"

## Testing

1. Call your Twilio number: **(929) 242-4535**
2. You should hear: "Please wait while I connect you to our AI assistant"
3. Then Julie will greet you: "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?"

## Test the API

Check if the voice service is running:
```bash
curl https://pedrobackend.onrender.com/voice/test
```

Expected response:
```json
{
  "status": "operational",
  "tests": {
    "tts": "passed",
    "websocket": "ready",
    "connections": 0
  },
  "endpoints": {
    "incoming": "/voice/incoming",
    "websocket": "/voice-websocket",
    "status": "/voice/status"
  }
}
```

## Monitoring

View active connections and health:
```bash
curl https://pedrobackend.onrender.com/health
```

## Troubleshooting

If calls aren't working:
1. Check Render logs for WebSocket connections
2. Verify environment variables are set in Render
3. Check Twilio debugger for webhook errors
4. Test locally with ngrok first

## Environment Variables Needed in Render

Make sure these are set:
- `OPENROUTER_API_KEY` - Already in .env
- `HUGGINGFACE_TOKEN` - Already in .env
- `NODE_ENV=production`
- `PORT=3001` (or let Render auto-assign)