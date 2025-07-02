# Next Steps for Production Setup

## 1. Configure Twilio Webhook (For SMS Cancellations)

### In your Twilio Console:
1. Go to https://console.twilio.com
2. Navigate to **Phone Numbers** → **Manage** → **Active Numbers**
3. Click on your phone number: **+1 (929) 242-4535**
4. In the **Messaging** section, find "A message comes in"
5. Set the webhook URL to:
   ```
   https://tsmtaarwgodklafqlbhm.supabase.co/functions/v1/twilio-webhook
   ```
6. Set Method to: **HTTP POST**
7. Click **Save**

## 2. Set Supabase Edge Function Secrets

### In your Supabase Dashboard:
1. Go to https://app.supabase.com/project/tsmtaarwgodklafqlbhm
2. Navigate to **Edge Functions** in the left sidebar
3. Click on **send-appointment-sms** function
4. Go to the **Secrets** tab
5. Add these environment variables:
   - `TWILIO_ACCOUNT_SID` = Your Twilio Account SID
   - `TWILIO_AUTH_TOKEN` = Your Twilio Auth Token
   - `TWILIO_PHONE_NUMBER` = +19292424535

6. Do the same for **twilio-webhook** function

## 3. Deploy to Production

### Option A: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
cd /Users/jasonsmacbookpro2022/pedro/frontend
vercel

# Follow prompts to:
# - Link to existing project or create new
# - Set environment variables during setup
```

### Option B: Deploy to Netlify
```bash
# Build the project
npm run build

# Drag the 'dist' folder to Netlify dashboard
# Or use Netlify CLI:
netlify deploy --prod --dir=dist
```

## 4. Set Production Environment Variables

Wherever you deploy, set these environment variables:
```
VITE_SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTIzNTIsImV4cCI6MjA1MTMyODM1Mn0.qKtWF3SQ9rVevhqVZGX3V_SdW1OFrBvaSrV4S9OU-0w
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 5. Test Everything

### Test SMS Flow:
1. Book an appointment on the live site
2. Verify you receive SMS confirmation
3. Reply "CANCEL [confirmation code]" to test cancellation
4. Check if appointment status updates in database

### Test Julie:
1. Click "Chat with Julie" on homepage
2. Test these scenarios:
   - "I need to book an appointment"
   - "What insurance do you accept?"
   - "Tell me about financing options"
   - "I need to cancel my appointment"

## 6. Production Database Setup

If you need to populate with real data:
```sql
-- Add real services
UPDATE services SET 
  price = 3500,
  description = 'State-of-the-art robotic dental implant surgery'
WHERE name LIKE '%YOMI%';

-- Add real staff
INSERT INTO staff (title, first_name, last_name, specialization, email, phone) 
VALUES 
  ('Dr.', 'Gregory', 'Pedro', 'Robotic Implant Surgery', 'dr.pedro@example.com', '718-720-5600'),
  ('Dr.', 'Sarah', 'Johnson', 'TMJ Specialist', 'dr.johnson@example.com', '718-720-5601');
```

## 7. Monitor & Optimize

### Check Analytics:
- Supabase Dashboard → Database → Tables → appointments
- Monitor SMS queue for failed messages
- Check sms_interactions for patient cancellations

### Julie Performance:
- Monitor chat conversations
- Adjust system prompts based on patient feedback
- Track booking conversion rates

## Need Help?

- **Supabase Issues**: Check logs in Dashboard → Logs
- **SMS Not Sending**: Verify Twilio credentials in Edge Functions
- **Julie Not Responding**: Check OpenAI API key in environment variables
- **Booking Errors**: Check browser console for API errors

## Quick Wins for Launch:

1. **Add Google Analytics** to track conversions
2. **Set up Twilio Alert** for appointment bookings
3. **Create Admin Dashboard** to view appointments
4. **Enable Supabase Backups** for data safety
5. **Set up Domain** (gregpedromd.com) to point to your deployment