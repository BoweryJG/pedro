# Webhook Configuration Guide

This guide explains how to configure webhooks for VoIP.ms and Twilio integration with Pedro's backend.

## Overview

The webhook endpoints handle:
- **Incoming Calls**: Call status updates, recordings, and transcriptions
- **SMS Messages**: Incoming messages with auto-responses
- **Call Recordings**: Recording completion notifications and transcription triggers
- **Call Detail Records (CDR)**: Call history and analytics

## Webhook Endpoints

### Base URL
```
Production: https://your-backend-domain.com
Development: http://localhost:3001
```

### Twilio Webhooks

1. **Voice Webhooks**
   - Incoming Call: `POST /voice/incoming` (existing)
   - Julie AI: `POST /voice/julie/incoming` (existing)
   - Call Status: `POST /webhooks/twilio/voice/status`
   - Recording Status: `POST /webhooks/twilio/recording/status`

2. **SMS Webhooks**
   - Incoming SMS: `POST /webhooks/twilio/sms/incoming`
   - SMS Status: `POST /webhooks/twilio/sms/status`

### VoIP.ms Webhooks

1. **SMS Webhook**
   - Incoming SMS: `POST /api/voip/sms/webhook` (existing)
   - Alternative: `POST /webhooks/voipms/sms/incoming`

2. **Call Webhooks**
   - CDR Notification: `POST /webhooks/voipms/call/cdr`
   - Recording Ready: `POST /webhooks/voipms/recording/ready`

## Configuration Steps

### Twilio Configuration

1. **Phone Number Configuration**
   - Log into Twilio Console
   - Navigate to Phone Numbers > Manage > Active Numbers
   - Select your phone number
   - Configure webhooks:

   ```
   Voice & Fax:
   - When a call comes in: POST https://your-domain.com/voice/julie/incoming
   - Call status callback: POST https://your-domain.com/webhooks/twilio/voice/status
   
   Messaging:
   - When a message comes in: POST https://your-domain.com/webhooks/twilio/sms/incoming
   - Status callback: POST https://your-domain.com/webhooks/twilio/sms/status
   ```

2. **Recording Configuration**
   - In your TwiML applications or phone number settings
   - Set recording status callback:
   ```
   POST https://your-domain.com/webhooks/twilio/recording/status
   ```

3. **Webhook Security**
   - The backend validates all Twilio webhooks using X-Twilio-Signature
   - Ensure your TWILIO_AUTH_TOKEN is set in .env

### VoIP.ms Configuration

1. **SMS Configuration**
   - Log into VoIP.ms portal
   - Navigate to DID Numbers > Manage DID
   - Select your number
   - Configure SMS settings:

   ```
   SMS/MMS Settings:
   - Enable SMS: Yes
   - SMS URL Callback: https://your-domain.com/api/voip/sms/webhook
   - URL Callback Retry: Yes
   ```

2. **Call Recording Configuration**
   - Navigate to DID Numbers > Call Recording
   - Enable call recording for your DID
   - Set webhook URL:
   ```
   Recording Ready Callback: https://your-domain.com/webhooks/voipms/recording/ready
   ```

3. **CDR Webhook Configuration**
   - Navigate to Main Menu > API
   - Configure CDR Push:
   ```
   CDR Push URL: https://your-domain.com/webhooks/voipms/call/cdr
   CDR Push Method: POST
   ```

4. **IP Whitelisting**
   - Add VoIP.ms server IPs to your environment:
   ```
   VOIPMS_ALLOWED_IPS=184.75.214.0/24,184.75.215.0/24
   ```

## Environment Variables

Add these to your `.env` file:

```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# VoIP.ms Configuration
VOIPMS_USERNAME=your_username
VOIPMS_PASSWORD=your_api_password
VOIPMS_DID=1234567890
VOIPMS_ALLOWED_IPS=184.75.214.0/24,184.75.215.0/24

# Transcription Settings
ENABLE_TRANSCRIPTION=true

# Webhook URLs (for reference)
WEBHOOK_BASE_URL=https://your-domain.com
```

## Auto-Response Configuration

The system automatically responds to common SMS queries:

1. **Appointment Requests**
   - Keywords: appointment, schedule, book, available, availability
   - Response: Directs to website or phone

2. **Emergency Messages**
   - Keywords: emergency, urgent, pain, bleeding, swelling
   - Response: Emergency contact information

3. **Hours Inquiries**
   - Keywords: hours, open, closed, time, when
   - Response: Office hours

4. **Location Questions**
   - Keywords: location, address, where, directions
   - Response: Office address and directions

5. **Insurance Queries**
   - Keywords: insurance, coverage, accept, plan
   - Response: Insurance information

## Testing Webhooks

### Local Testing with ngrok

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your backend:
   ```bash
   npm run dev
   ```

3. Create tunnel:
   ```bash
   ngrok http 3001
   ```

4. Use the ngrok URL for webhook configuration during testing

### Webhook Testing Tools

1. **Twilio Test Calls**
   ```javascript
   const client = twilio(accountSid, authToken);
   
   client.calls.create({
     url: 'http://demo.twilio.com/docs/voice.xml',
     to: '+1234567890',
     from: '+0987654321',
     statusCallback: 'https://your-domain.com/webhooks/twilio/voice/status',
     statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
     statusCallbackMethod: 'POST'
   });
   ```

2. **VoIP.ms Test SMS**
   - Use the VoIP.ms portal to send test SMS
   - Check webhook logs in your backend

## Monitoring and Debugging

1. **Webhook Logs**
   - All webhook requests are logged to console
   - Check logs for incoming webhook data:
   ```bash
   tail -f logs/webhook.log
   ```

2. **Database Verification**
   - Check Supabase tables:
   - `phone_calls` - Call records
   - `sms_conversations` - SMS messages

3. **Error Handling**
   - Failed webhooks return appropriate HTTP status codes
   - Twilio and VoIP.ms will retry failed webhooks

## Security Best Practices

1. **HTTPS Only**
   - Always use HTTPS in production
   - Webhooks contain sensitive data

2. **Signature Validation**
   - Twilio webhooks are validated using X-Twilio-Signature
   - VoIP.ms uses IP whitelisting

3. **Rate Limiting**
   - Webhook endpoints have rate limiting
   - Prevents abuse and DDoS attacks

4. **Environment Variables**
   - Never commit credentials to git
   - Use environment variables for all sensitive data

## Troubleshooting

### Common Issues

1. **Webhook Not Receiving Data**
   - Verify URL is correct and accessible
   - Check firewall/security group settings
   - Ensure HTTPS certificate is valid

2. **Signature Validation Failures**
   - Verify TWILIO_AUTH_TOKEN is correct
   - Check if URL in signature matches exactly
   - Ensure no proxy is modifying headers

3. **Database Errors**
   - Check Supabase connection
   - Verify table schema matches expected format
   - Check service role key permissions

4. **Auto-Response Not Working**
   - Verify SMS webhook is configured
   - Check auto-response patterns match
   - Ensure response SMS sending is working

## Webhook Payload Examples

### Twilio Voice Status
```json
{
  "CallSid": "CA1234567890abcdef",
  "CallStatus": "completed",
  "CallDuration": "45",
  "From": "+1234567890",
  "To": "+0987654321",
  "Direction": "inbound",
  "RecordingUrl": "https://api.twilio.com/recording.mp3"
}
```

### VoIP.ms SMS
```json
{
  "from": "1234567890",
  "to": "0987654321",
  "message": "Hello, I need an appointment",
  "id": "123456",
  "date": "2024-01-01 10:00:00"
}
```

### VoIP.ms CDR
```json
{
  "callid": "123456",
  "callerid": "1234567890",
  "destination": "0987654321",
  "disposition": "answered",
  "duration": "00:01:23",
  "seconds": "83",
  "date": "2024-01-01 10:00:00",
  "total": "0.0150"
}
```