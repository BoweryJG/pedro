# Webhook Testing Guide

This guide provides comprehensive testing procedures for VoIP.ms and Twilio webhook integrations.

## Prerequisites

1. **Environment Setup**
   ```bash
   # Install dependencies
   cd pedro/backend
   npm install
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Required Tools**
   - ngrok (for local testing)
   - Postman or curl (for manual testing)
   - Twilio CLI (optional)

## Local Testing Setup

### 1. Start Backend Server

```bash
# Development mode with hot reload
npm run dev

# Or production mode
npm start
```

### 2. Create Public Tunnel with ngrok

```bash
# Install ngrok if not already installed
npm install -g ngrok

# Create tunnel to your local server
ngrok http 3001

# You'll see output like:
# Forwarding https://abc123.ngrok.io -> http://localhost:3001
```

### 3. Update Webhook URLs

Use the ngrok URL for testing:
- Replace `http://localhost:3001` with `https://abc123.ngrok.io`

## Testing Twilio Webhooks

### 1. Voice Call Status Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/twilio/voice/status \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "CallSid=CA1234567890abcdef" \
  -d "CallStatus=completed" \
  -d "CallDuration=45" \
  -d "From=+1234567890" \
  -d "To=+0987654321" \
  -d "Direction=inbound"
```

**Test with Twilio CLI:**
```bash
twilio api:core:calls:create \
  --from="+1234567890" \
  --to="+0987654321" \
  --url="http://demo.twilio.com/docs/voice.xml" \
  --status-callback="https://abc123.ngrok.io/webhooks/twilio/voice/status" \
  --status-callback-event="initiated ringing answered completed"
```

### 2. SMS Incoming Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MessageSid=SM1234567890abcdef" \
  -d "From=+1234567890" \
  -d "To=+0987654321" \
  -d "Body=I need to schedule an appointment"
```

**Expected Response (XML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for your interest in scheduling an appointment! Please visit our website at gregpedromd.com or call us at (954) 456-1627 during business hours. Our team will be happy to assist you.</Message>
</Response>
```

### 3. SMS Status Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/status \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "MessageSid=SM1234567890abcdef" \
  -d "MessageStatus=delivered" \
  -d "To=+1234567890"
```

### 4. Recording Status Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/twilio/recording/status \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "RecordingSid=RE1234567890abcdef" \
  -d "RecordingUrl=https://api.twilio.com/recording.mp3" \
  -d "RecordingStatus=completed" \
  -d "RecordingDuration=45" \
  -d "CallSid=CA1234567890abcdef"
```

## Testing VoIP.ms Webhooks

### 1. SMS Incoming Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/voipms/sms/incoming \
  -H "Content-Type: application/json" \
  -d '{
    "from": "1234567890",
    "to": "0987654321",
    "message": "What are your office hours?",
    "id": "123456",
    "date": "2024-01-01 10:00:00"
  }'
```

**Expected Response:**
```json
{
  "status": "success"
}
```

### 2. Call CDR Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/voipms/call/cdr \
  -H "Content-Type: application/json" \
  -d '{
    "callid": "123456",
    "callerid": "1234567890",
    "destination": "0987654321",
    "description": "Incoming call",
    "account": "100000_DID",
    "disposition": "answered",
    "duration": "00:01:23",
    "seconds": "83",
    "date": "2024-01-01 10:00:00",
    "uniqueid": "1234567890.123",
    "total": "0.0150"
  }'
```

### 3. Recording Ready Webhook

**Test with curl:**
```bash
curl -X POST https://abc123.ngrok.io/webhooks/voipms/recording/ready \
  -H "Content-Type: application/json" \
  -d '{
    "recording_id": "rec_123456",
    "call_id": "1234567890.123",
    "recording_url": "https://voip.ms/recording/123456.mp3",
    "duration": "83"
  }'
```

## Testing Auto-Responses

### Test Different Message Types

1. **Appointment Request:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
     -d "From=+1234567890" \
     -d "Body=I want to schedule an appointment for next week"
   ```

2. **Emergency Message:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
     -d "From=+1234567890" \
     -d "Body=I have severe tooth pain and need urgent help"
   ```

3. **Hours Inquiry:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
     -d "From=+1234567890" \
     -d "Body=What time do you open tomorrow?"
   ```

4. **Location Question:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
     -d "From=+1234567890" \
     -d "Body=Where is your office located?"
   ```

5. **Insurance Query:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/sms/incoming \
     -d "From=+1234567890" \
     -d "Body=Do you accept Delta Dental insurance?"
   ```

## Database Verification

### Check Stored Messages

```sql
-- Check SMS conversations
SELECT * FROM sms_conversations 
ORDER BY created_at DESC 
LIMIT 10;

-- Check phone calls
SELECT * FROM phone_calls 
ORDER BY created_at DESC 
LIMIT 10;

-- Check auto-responses
SELECT * FROM sms_conversations 
WHERE metadata->>'auto_response' = 'true'
ORDER BY created_at DESC;
```

## Load Testing

### Test Webhook Performance

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test SMS webhook with 100 requests, 10 concurrent
ab -n 100 -c 10 -p sms_data.txt -T application/x-www-form-urlencoded \
  https://abc123.ngrok.io/webhooks/twilio/sms/incoming

# Create sms_data.txt with:
MessageSid=SM1234567890abcdef&From=+1234567890&To=+0987654321&Body=Test+message
```

## Monitoring and Debugging

### 1. Enable Debug Logging

Add to your `.env`:
```bash
DEBUG=webhooks:*
LOG_LEVEL=debug
```

### 2. Monitor Webhook Logs

```bash
# Watch backend logs
tail -f logs/webhook.log

# Filter for specific webhook type
tail -f logs/webhook.log | grep "twilio/sms"
```

### 3. ngrok Web Interface

- Open http://localhost:4040
- View all webhook requests and responses
- Replay failed requests

## Error Scenarios

### Test Error Handling

1. **Invalid Signature (Twilio):**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/twilio/voice/status \
     -H "X-Twilio-Signature: invalid_signature" \
     -d "CallSid=CA1234567890abcdef"
   ```

2. **Missing Required Fields:**
   ```bash
   curl -X POST https://abc123.ngrok.io/webhooks/voipms/sms/incoming \
     -H "Content-Type: application/json" \
     -d '{"from": "1234567890"}'
   ```

3. **Database Connection Error:**
   - Temporarily disconnect database
   - Send webhook request
   - Verify error handling

## Production Testing

### 1. Staging Environment

Before deploying to production:
1. Set up staging environment with production-like configuration
2. Use real phone numbers for testing
3. Test all webhook endpoints
4. Verify database writes
5. Check error logging

### 2. Smoke Tests

After production deployment:
```bash
# Health check
curl https://your-domain.com/health

# Webhook endpoints should return 403 without proper auth
curl -X POST https://your-domain.com/webhooks/twilio/sms/incoming
```

### 3. Production Monitoring

Set up monitoring for:
- Webhook response times
- Error rates
- Database write failures
- Auto-response delivery rates

## Troubleshooting Common Issues

### 1. Webhook Not Receiving Data

- Check ngrok is running
- Verify URL is correct in provider dashboard
- Check firewall settings
- Ensure server is running

### 2. Auto-Response Not Sent

- Check SMS sending credentials
- Verify phone number format
- Check rate limits
- Review error logs

### 3. Database Not Updated

- Check Supabase connection
- Verify table permissions
- Check data format
- Review error logs

### 4. Transcription Not Working

- Verify ENABLE_TRANSCRIPTION=true
- Check recording URL is accessible
- Verify transcription service credentials
- Check audio format compatibility