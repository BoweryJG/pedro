# 🚀 Instagram DM Automation - Production Deployment

## Quick Start (5 minutes)

### 1. Get Your Instagram Info
Since you have the Instagram account, I need these details:

**Instagram Business Account**:
- Instagram username: `@your_instagram_handle`
- Is it converted to Business account? (Settings → Account → Switch to Professional)
- Connected Facebook Page name?

### 2. Facebook Developer Setup
```bash
# Go to: https://developers.facebook.com/apps/create/
App Type: Business
App Name: "Dr Pedro Dental Bot"
```

### 3. Get API Keys (I'll help you find these)

**From Facebook App Dashboard**:
- App ID: `Settings → Basic`
- App Secret: `Settings → Basic` (I'll help generate)
- Page Access Token: `Messenger → Settings → Access Tokens`

### 4. Deploy Backend (Automatic)

I'll configure Render deployment:

```bash
# This will auto-deploy from your GitHub repo
Service Type: Web Service
Repository: BoweryJG/pedro
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### 5. Get Anthropic API Key

```bash
# Go to: https://console.anthropic.com/
# Create API key for Claude 3.5 Sonnet
# Copy the key: sk-ant-api03-...
```

### 6. Configure Webhook (Automatic)

Once deployed, your webhook URL will be:
`https://pedro-dental-bot.onrender.com/api/instagram/webhook`

## 📱 Test Instagram DM

1. Send message to your Instagram: "Hi, I need an appointment"
2. Should get Claude AI response within 5 seconds
3. Check dashboard at: `https://your-site.netlify.app/instagram-dashboard`

## 🔧 Environment Variables

I'll help you set these in Render:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role key)
ANTHROPIC_API_KEY=sk-ant-api03-... (Claude API key)
FACEBOOK_APP_SECRET=... (from Facebook app)
FACEBOOK_PAGE_ACCESS_TOKEN=... (from Facebook page)
FACEBOOK_WEBHOOK_VERIFY_TOKEN=pedro_dental_2025
INSTAGRAM_PAGE_ID=... (your Instagram business ID)
```

## ⚡ Next Steps

What's your Instagram handle? I'll help you:

1. **Find your Facebook Page ID**
2. **Generate the access tokens**
3. **Set up the webhook automatically**
4. **Deploy to production in 5 minutes**
5. **Test the first automated response**

Just share your Instagram username and I'll configure everything else! 🦷✨