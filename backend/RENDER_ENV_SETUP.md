# Render Environment Variable Setup

## Add CORS Configuration to pedrobackend

### Steps to Add Environment Variable:

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com/web/srv-d0n79tgdl3ps739uovig
   - Or navigate to the `pedrobackend` service

2. **Navigate to Environment**
   - Click on "Environment" in the left sidebar
   - You'll see the environment variables section

3. **Add New Environment Variable**
   - Click "Add Environment Variable"
   - Enter the following:
   
   **Key:** `ALLOWED_ORIGINS`
   
   **Value:** 
   ```
   https://gregpedromd.com,https://www.gregpedromd.com,https://tmj.gregpedromd.com,https://implants.gregpedromd.com,https://robotic.gregpedromd.com,https://medspa.gregpedromd.com,https://aboutface.gregpedromd.com
   ```

4. **Save Changes**
   - Click "Save Changes"
   - This will trigger a new deployment automatically

## Other Required Environment Variables

Make sure these are also set (if not already):

- `NODE_ENV`: `production`
- `PORT`: `10000` (or leave unset, Render provides this)
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `HUGGINGFACE_TOKEN`: Your Huggingface token (for voice services)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `TWILIO_ACCOUNT_SID`: Your Twilio account SID (if using SMS)
- `TWILIO_AUTH_TOKEN`: Your Twilio auth token (if using SMS)
- `TWILIO_PHONE_NUMBER`: Your Twilio phone number (if using SMS)

## Verify Deployment

After adding the environment variable:
1. Check the "Events" tab to see the deployment progress
2. Once deployed, test the voice functionality using the debug tool
3. Check logs if there are any issues

## Direct Link to Environment Variables
https://dashboard.render.com/web/srv-d0n79tgdl3ps739uovig/env