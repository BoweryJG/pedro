# 🚀 Deploy Instagram DM Bot - Step by Step

## Phase 1: Add Messenger to Your Facebook App (5 minutes)

1. **Go to your app**: https://developers.facebook.com/apps/959139930338809/
2. **Add Product** → Find "Messenger" → Click **"Set up"**
3. **In Messenger Settings**:
   - Generate Page Access Token for your Instagram-connected Facebook page
   - Copy the token (starts with `EAA...`)

## Phase 2: Deploy Backend to Render (10 minutes)

### Option A: Deploy from GitHub (Recommended)
1. **Go to**: https://render.com/
2. **Connect GitHub** → Select repository: `BoweryJG/pedro`
3. **Create Web Service**:
   - Name: `pedro-instagram-bot`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

### Option B: Manual Deploy
```bash
cd backend
git add .
git commit -m "Configure for Robotic Ai Facebook app"
git push origin main
```

## Phase 3: Set Environment Variables in Render (5 minutes)

In your Render service dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=3001
FACEBOOK_APP_ID=959139930338809
FACEBOOK_APP_SECRET=[GET FROM FACEBOOK APP → SETTINGS → BASIC]
FACEBOOK_PAGE_ACCESS_TOKEN=[GET FROM MESSENGER → SETTINGS]
FACEBOOK_WEBHOOK_VERIFY_TOKEN=pedro_dental_2025
SUPABASE_URL=[YOUR SUPABASE PROJECT URL]
SUPABASE_SERVICE_ROLE_KEY=[YOUR SUPABASE SERVICE ROLE KEY]
ANTHROPIC_API_KEY=[GET FROM https://console.anthropic.com/]
PRACTICE_NAME=Dr. Pedro Advanced Dental Care
PRACTICE_PHONE=(718) 555-0123
PRACTICE_EMAIL=info@drpedrodental.com
```

## Phase 4: Configure Webhook in Facebook (5 minutes)

1. **In your Facebook app → Messenger → Settings**
2. **Webhooks section**:
   - Callback URL: `https://your-render-url.onrender.com/api/instagram/webhook`
   - Verify Token: `pedro_dental_2025`
   - Subscribe to: `messages`, `messaging_postbacks`, `message_deliveries`

## Phase 5: Test Instagram DM (2 minutes)

1. **Send test message** to your Instagram business account
2. **Check Render logs** for webhook received
3. **Verify Claude AI response** in Instagram

## 🔑 Quick API Key Setup

### Anthropic (Claude AI)
- Go to: https://console.anthropic.com/
- Create API key → Copy `sk-ant-api03-...`

### Supabase 
- Go to your Supabase project → Settings → API
- Copy Project URL and Service Role Key

## ⚡ Webhook Test Command

Once deployed, test your webhook:

```bash
curl -X GET "https://your-render-url.onrender.com/api/instagram/webhook?hub.verify_token=pedro_dental_2025&hub.challenge=test123&hub.mode=subscribe"
```

Should return: `test123`

## 🎯 Expected Result

After setup:
1. **Patient sends Instagram DM**: "Hi, I need an appointment"
2. **Claude AI responds instantly**: "Hi! I'd be happy to help you schedule an appointment with Dr. Pedro..."
3. **Dashboard shows conversation**: Visit `/instagram-dashboard` to manage
4. **Analytics track performance**: Response times, booking requests, sentiment

Ready to deploy? Let's start with Phase 1! 🚀