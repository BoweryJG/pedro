# Julie AI Quick Setup Guide

## Prerequisites

1. **Kyutai Moshi API Access**
   - Sign up at https://kyutai.org/moshi
   - Get your API key from the dashboard
   - Note: Moshi provides ultra-low latency voice processing

2. **OpenRouter Account**
   - Sign up at https://openrouter.ai
   - Add credits to your account
   - Get your API key

3. **Supabase Database**
   - Your Supabase project should already be set up
   - Run the migration script to create Julie AI tables

4. **Twilio Phone Number** (optional, for phone calls)
   - A Twilio phone number with voice capabilities
   - Media Streams enabled on your account

## Step 1: Environment Variables

Add these to your `.env` file:

```bash
# Kyutai Moshi Configuration
MOSHI_API_URL=wss://moshi.kyutai.org/api/v1/stream
MOSHI_API_KEY=your_moshi_api_key_here

# OpenRouter for AI responses
OPENROUTER_API_KEY=your_openrouter_key_here

# Existing Supabase config (should already be set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## Step 2: Database Setup

Run the migration to create Julie AI tables:

```bash
# From the backend directory
psql $DATABASE_URL < migrations/julie_ai_tables.sql

# Or using Supabase CLI
supabase db push
```

## Step 3: Configure Twilio (for phone integration)

1. Log into Twilio Console
2. Go to your phone number settings
3. Configure webhooks:
   - **Voice webhook**: `https://your-domain.com/voice/julie/incoming`
   - **Status callback**: `https://your-domain.com/voice/julie/status`
   - **Method**: POST for both

## Step 4: Test the Service

1. **Start the backend**:
   ```bash
   npm start
   ```

2. **Check health endpoint**:
   ```bash
   curl http://localhost:3001/api/julie/health
   ```

   You should see:
   ```json
   {
     "status": "operational",
     "version": "1.0.0",
     "features": {
       "realTimeVoice": true,
       "appointmentBooking": true,
       "emergencyRouting": true,
       "humanHandoff": true
     },
     "moshiConnection": "configured",
     "openRouterConnection": "configured"
   }
   ```

3. **Make a test call** (if Twilio is configured):
   - Call your Twilio number
   - You should hear Julie's greeting
   - Try booking an appointment or asking questions

## Step 5: Monitor Performance

### Check Active Sessions
```bash
curl http://localhost:3001/api/julie/sessions
```

### View Logs
Julie AI logs include:
- Call start/end events
- Transcripts (in debug mode)
- Error messages
- Performance metrics

### Database Queries

Check recent calls:
```sql
SELECT * FROM voice_calls 
ORDER BY created_at DESC 
LIMIT 10;
```

Check emergency calls:
```sql
SELECT * FROM emergency_calls 
WHERE created_at > NOW() - INTERVAL '24 hours';
```

Check callback requests:
```sql
SELECT * FROM callback_requests 
WHERE status = 'pending';
```

## Common Issues & Solutions

### 1. "Technical difficulties" message
**Cause**: API keys not configured or invalid
**Solution**: 
- Verify MOSHI_API_KEY and OPENROUTER_API_KEY are set
- Check API key validity
- Look for error logs

### 2. Poor audio quality
**Cause**: Network issues or encoding problems
**Solution**:
- Ensure stable internet connection
- Check Twilio Media Streams configuration
- Verify audio encoding settings match Moshi requirements

### 3. Appointments not booking
**Cause**: Database permissions or schema issues
**Solution**:
- Verify appointments table exists
- Check Supabase service key permissions
- Review error logs for database errors

### 4. Slow response times
**Cause**: API latency or processing delays
**Solution**:
- Check Moshi API status
- Monitor OpenRouter response times
- Consider upgrading to faster LLM model

## Production Checklist

- [ ] SSL certificate configured (HTTPS required)
- [ ] Environment variables set in production
- [ ] Database migrations completed
- [ ] Twilio webhooks pointing to production URL
- [ ] Error monitoring configured (e.g., Sentry)
- [ ] Performance monitoring set up
- [ ] Backup phone number configured for fallback
- [ ] Staff trained on callback procedures
- [ ] HIPAA compliance verified
- [ ] Rate limiting configured for API endpoints

## Support

For issues specific to:
- **Moshi API**: Contact Kyutai support
- **OpenRouter**: Check their status page
- **Twilio**: Use Twilio debugger
- **Database**: Check Supabase logs

For Julie AI specific issues, check:
1. Backend logs
2. Database query results
3. API response times
4. WebSocket connection stability