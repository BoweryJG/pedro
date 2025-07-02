# Setting Supabase Edge Function Secrets

You need to set these environment variables for your Edge Functions in Supabase:

## Required Environment Variables

1. **TWILIO_ACCOUNT_SID**
   - Your Twilio Account SID
   - Found in Twilio Console

2. **TWILIO_AUTH_TOKEN**
   - Your Twilio Auth Token
   - Found in Twilio Console

3. **TWILIO_PHONE_NUMBER**
   - Your Twilio phone number
   - Format: +19292424535

## How to Set Them

### Option 1: Supabase Dashboard
1. Go to your project dashboard
2. Navigate to Edge Functions
3. Click on the function (send-appointment-sms or twilio-webhook)
4. Go to "Secrets" tab
5. Add each environment variable

### Option 2: Supabase CLI
```bash
supabase secrets set TWILIO_ACCOUNT_SID=your_account_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_auth_token
supabase secrets set TWILIO_PHONE_NUMBER=+19292424535
```

## Important
- Never commit these credentials to git
- Keep them secure in Supabase's secret management
- The Edge Functions won't work without these being set