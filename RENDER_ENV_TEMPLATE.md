# Render Environment Variables Template

Copy and paste these into your Render dashboard under Environment Variables.

## Required Variables (MUST be set for the app to start)

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key

# AI Services (at least one required)
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-key
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-twilio-auth-token-32-chars-min
TWILIO_PHONE_NUMBER=+17185551234

# Server Configuration
NODE_ENV=production
PORT=3001
```

## Optional but Recommended Variables

```bash
# Voice Services
ELEVENLABS_API_KEY=your-elevenlabs-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
HUGGINGFACE_TOKEN=hf_your-huggingface-token

# Security
JWT_SECRET=generate-a-random-32-character-string-here
SESSION_SECRET=generate-another-random-32-character-string
ALLOWED_ORIGINS=https://gregpedromd.com,https://www.gregpedromd.com

# Facebook/Instagram Integration
FACEBOOK_APP_ID=123456789012345
FACEBOOK_APP_SECRET=your-32-character-app-secret
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxx
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your-custom-verify-token
INSTAGRAM_PAGE_ID=17841444444444444

# Practice Information
PRACTICE_NAME=Dr. Pedro Dental Practice
PRACTICE_PHONE=(718) 555-0123
PRACTICE_EMAIL=info@gregpedromd.com

# Additional Services
OPENAI_API_KEY=sk-your-openai-key
WEBHOOK_BASE_URL=https://your-render-backend-url.onrender.com
```

## To Update in Render:

1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click on "Environment" in the left sidebar
4. Add each variable as a key-value pair
5. Click "Save Changes"
6. The service will automatically redeploy

## Important Notes:

- Do NOT include quotes around the values in Render
- Make sure there are no trailing spaces
- The service will restart automatically after saving
- Check the logs after restart to ensure all variables are loaded correctly