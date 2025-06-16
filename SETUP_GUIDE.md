# Instagram DM Automation Setup Guide

## 🔧 Required Credentials

You'll need to gather these API keys and IDs:

### Facebook App Settings
1. **App ID**: Found in App Dashboard → Settings → Basic
2. **App Secret**: Found in App Dashboard → Settings → Basic
3. **Webhook Verify Token**: Create a random string (e.g., "pedro_dental_2025")

### Facebook Page & Instagram
1. **Facebook Page ID**: Go to your Facebook Page → About → Page ID
2. **Instagram Account ID**: We'll get this via API once connected
3. **Page Access Token**: Generate in App Dashboard → Messenger → Settings

### Production URLs
- **Webhook URL**: `https://your-backend-url.onrender.com/api/instagram/webhook`
- **Redirect URI**: `https://your-backend-url.onrender.com/auth/callback`

## 📋 Step-by-Step Configuration

### Step 1: Facebook App Permissions
Request these permissions in App Review:
- `instagram_basic`
- `instagram_manage_messages` ⚠️ (Requires business verification)
- `pages_messaging`
- `pages_read_engagement`
- `pages_manage_posts`

### Step 2: Business Verification
Submit these documents:
- Business license or incorporation documents
- Tax ID number
- Business website (your dental practice site)
- Phone number verification

### Step 3: Instagram Permissions
1. Go to Instagram Basic Display → User Token Generator
2. Generate token for your Instagram Business account
3. Exchange for long-lived token (60 days)

### Step 4: Webhook Configuration
1. App Dashboard → Webhooks → Create Subscription
2. Object: `page`
3. Callback URL: `https://your-backend-url.onrender.com/api/instagram/webhook`
4. Verify Token: `pedro_dental_2025` (or your chosen token)
5. Fields: `messages`, `messaging_postbacks`, `message_deliveries`

## 🚀 Quick Deploy Commands

Once you have the credentials:

```bash
# 1. Deploy backend to Render
cd backend
git add .
git commit -m "Deploy Instagram automation backend"
git push

# 2. Set environment variables in Render dashboard
ANTHROPIC_API_KEY=your_claude_api_key
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token
FACEBOOK_WEBHOOK_VERIFY_TOKEN=pedro_dental_2025
INSTAGRAM_PAGE_ID=your_instagram_id
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# 3. Test webhook
curl -X GET "https://your-backend-url.onrender.com/api/instagram/webhook?hub.verify_token=pedro_dental_2025&hub.challenge=test&hub.mode=subscribe"
```

## 🧪 Testing Flow

1. **Send a test DM** to your Instagram business account
2. **Check webhook logs** in Render dashboard
3. **Verify response** from Claude AI
4. **Monitor dashboard** at `/instagram-dashboard`

## ⚠️ Common Issues

- **Business verification takes 1-7 days**
- **Instagram messaging permissions require manual review**
- **Webhook must use HTTPS (not HTTP)**
- **Page access tokens expire every 60 days**

## 💡 Pro Tips

- Use Instagram Creator Studio to manage business account
- Set up automatic responses for when AI is offline
- Monitor webhook delivery in Facebook App Dashboard
- Test with multiple message types (text, emojis, questions)