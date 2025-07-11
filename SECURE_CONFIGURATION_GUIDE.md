# Secure Configuration Guide

This guide documents all environment variables required for the Dr. Pedro platform and how to securely configure them.

## Overview

All sensitive data has been removed from the codebase and replaced with environment variable references. This ensures that sensitive information like API keys, phone numbers, and practice details are not exposed in the repository.

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example`:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Facebook/Instagram Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_custom_webhook_verify_token_here
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
INSTAGRAM_PAGE_ID=your_instagram_page_id_here

# Practice Information
PRACTICE_NAME="Your Practice Name"
PRACTICE_PHONE="(xxx) xxx-xxxx"
PRACTICE_EMAIL="info@yourpractice.com"
PRACTICE_ADDRESS="Your Practice Address"

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI Service Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Twilio Configuration (SMS/Voice)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx

# Deepgram Configuration (Voice AI)
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# ElevenLabs Configuration (Voice AI)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# LiveKit Configuration (Voice Calls)
LIVEKIT_API_KEY=your_livekit_api_key_here
LIVEKIT_API_SECRET=your_livekit_api_secret_here
LIVEKIT_URL=wss://your-livekit-url.com

# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your_google_calendar_id_here
GOOGLE_CLIENT_EMAIL=your_google_service_account_email_here
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_google_private_key_here\n-----END PRIVATE KEY-----"

# Additional Configuration
ADMIN_API_KEY=your_admin_api_key_here
INTERNAL_API_KEY=your_internal_api_key_here
```

### Frontend Environment Variables

Create `.env.local` files in each subdomain directory:

```bash
# Public Environment Variables (safe for frontend)
NEXT_PUBLIC_PRACTICE_NAME="Your Practice Name"
NEXT_PUBLIC_PRACTICE_PHONE="(xxx) xxx-xxxx"
NEXT_PUBLIC_PRACTICE_PHONE_NUMBER="+1xxxxxxxxxx"
NEXT_PUBLIC_PRACTICE_EMAIL="info@yourpractice.com"
NEXT_PUBLIC_PRACTICE_ADDRESS="Your Full Address"
NEXT_PUBLIC_BACKEND_URL="https://your-backend-url.onrender.com"
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_FACEBOOK_APP_ID="your_facebook_app_id"
NEXT_PUBLIC_ENABLE_CHAT="true"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
```

## Deployment Configuration

### Render.com

When deploying to Render.com, add all environment variables through the Render dashboard:

1. Go to your service in Render
2. Navigate to "Environment" tab
3. Add each environment variable from the `.env` file
4. Save and redeploy

### Security Best Practices

1. **Never commit `.env` files** - Always use `.gitignore` to exclude them
2. **Use strong, unique values** for tokens and secrets
3. **Rotate credentials regularly** - Update API keys and tokens periodically
4. **Use different values for different environments** - Don't use production credentials in development
5. **Limit access** - Only give team members access to the credentials they need
6. **Use secret management tools** - Consider using tools like:
   - AWS Secrets Manager
   - Google Secret Manager
   - HashiCorp Vault
   - Doppler

### Client Configuration

For agency clients, create a separate configuration file based on `backend/config/clients.example.json`:

```json
{
  "clients": {
    "client_name": {
      "name": "Dr. ClientName",
      "practice_name": "{{PRACTICE_NAME}}",
      "deployment_url": "{{DEPLOYMENT_URL}}",
      "instagram_username": "@{{INSTAGRAM_USERNAME}}",
      "facebook_page_name": "{{FACEBOOK_PAGE_NAME}}",
      "status": "active"
    }
  }
}
```

## Validation

The backend includes an environment validator that checks for required variables on startup:

```bash
npm run validate-env
```

This will verify all required environment variables are set before starting the application.

## Updates Required

After setting up environment variables, update the following:

1. **render.yaml** - Remove any hardcoded values
2. **Configuration files** - Replace hardcoded values with env var references
3. **Component files** - Update any components using hardcoded phone numbers or addresses
4. **Documentation** - Update any documentation that references specific values

## Support

For questions about configuration or security, contact the development team.