# Twilio SMS Setup for Supabase

## Your Twilio Information
- Phone Number: +19292424535
- SID: PN2792d68811a25032423085ab02a05c8f

## Setting Environment Variables in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/tsmtaarwgodklafqlbhm

2. Navigate to: **Edge Functions** → **send-sms** → **Secrets**

3. Add these environment variables:
   ```
   TWILIO_ACCOUNT_SID=AC[your_account_sid]
   TWILIO_AUTH_TOKEN=[your_auth_token]
   TWILIO_PHONE_NUMBER=+19292424535
   ```

4. You need to get your Account SID and Auth Token from your Twilio Console:
   - Go to https://console.twilio.com
   - Your Account SID and Auth Token are on the dashboard
   - The Account SID starts with "AC"

## Testing

Once you've set the environment variables:

1. Go to http://localhost:5173
2. Click "Book Appointment"
3. Fill out all the steps including a valid phone number
4. After booking, you should receive an SMS confirmation

## Troubleshooting

If SMS doesn't send:
1. Check the browser console for errors
2. Check Supabase Edge Function logs: Dashboard → Edge Functions → send-sms → Logs
3. Verify your Twilio account has SMS credits
4. Make sure the phone number is in E.164 format (+1XXXXXXXXXX)

## SMS Message Format

The current message format is:
```
Hi [FirstName], your appointment for [Service] with [Provider] on [Date] at [Time] has been confirmed. Confirmation code: [Code]. Call (718) 720-5600 if you need to reschedule.
```

You can customize this in `/frontend/src/services/appointmentService.ts`