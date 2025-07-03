# 🚨 Production Deployment Guide - CRITICAL SECURITY STEPS

## ⚠️ IMMEDIATE ACTIONS REQUIRED

### 1. **Rotate ALL Exposed Credentials** (DO THIS FIRST!)

The following credentials have been exposed and MUST be rotated immediately:

#### Twilio
1. Log into [Twilio Console](https://console.twilio.com)
2. Go to Account → API Keys & Tokens
3. **Regenerate** your Auth Token
4. Update in Render: `TWILIO_AUTH_TOKEN=new_token_here`

#### Supabase
1. Log into [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to Settings → API
3. **Regenerate** Service Role Key
4. Update in Render: `SUPABASE_SERVICE_ROLE_KEY=new_key_here`

#### OpenRouter
1. Log into [OpenRouter](https://openrouter.ai)
2. Go to Keys → Create New Key
3. **Delete** the old key
4. Update in Netlify: `OPENROUTER_API_KEY=new_key_here`

#### Huggingface
1. Log into [Huggingface](https://huggingface.co/settings/tokens)
2. **Revoke** the exposed token
3. Create a new token
4. Update in Render: `HUGGINGFACE_TOKEN=new_token_here`

---

## 📋 Production Deployment Checklist

### Backend (Render)

1. **Environment Variables to Set:**
   ```bash
   # Supabase
   SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_new_regenerated_key
   
   # APIs (use new keys)
   ANTHROPIC_API_KEY=your_anthropic_key
   OPENROUTER_API_KEY=your_new_openrouter_key
   HUGGINGFACE_TOKEN=your_new_huggingface_token
   
   # Twilio (with new auth token)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_new_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   
   # Facebook/Instagram
   FACEBOOK_APP_ID=959139930338809
   FACEBOOK_APP_SECRET=your_facebook_app_secret
   FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
   FACEBOOK_WEBHOOK_VERIFY_TOKEN=pedro_dental_2025_secure
   INSTAGRAM_PAGE_ID=your_instagram_page_id
   
   # Security
   ALLOWED_ORIGINS=https://gregpedromd.com,https://www.gregpedromd.com
   NODE_ENV=production
   
   # Practice Info
   PRACTICE_NAME="Dr. Pedro Advanced Dental Care"
   PRACTICE_PHONE="(929) 242-4535"
   PRACTICE_EMAIL="info@gregpedromd.com"
   ```

2. **Render Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/`
   - Auto-Deploy: ON (from main branch)

### Frontend (Netlify)

1. **Environment Variables:**
   ```bash
   VITE_OPENAI_API_KEY=your_openai_key
   VITE_BACKEND_URL=https://your-render-app.onrender.com
   VITE_SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Netlify Functions Environment:**
   ```bash
   OPENROUTER_API_KEY=your_new_openrouter_key
   ```

3. **Build Settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

---

## 🔒 Security Verification

### 1. **Test CORS is Working**
```bash
# This should fail (unauthorized domain)
curl -X POST https://your-backend.onrender.com/api/test \
  -H "Origin: https://evil-site.com" \
  -H "Content-Type: application/json"
```

### 2. **Test Rate Limiting**
```bash
# Run this 101 times - should get rate limited after 100
for i in {1..101}; do
  curl https://your-backend.onrender.com/api/status
done
```

### 3. **Verify Headers**
```bash
curl -I https://your-backend.onrender.com
# Should see security headers like X-Frame-Options, X-Content-Type-Options
```

---

## 🚀 Deployment Steps

### 1. **Backend Deployment**
```bash
# 1. Push code to GitHub
git add -A
git commit -m "Production security updates"
git push origin main

# 2. Render will auto-deploy
# 3. Check logs: https://dashboard.render.com
```

### 2. **Frontend Deployment**
```bash
# 1. Build locally first to test
cd frontend
npm run build

# 2. Push to GitHub - Netlify auto-deploys
# 3. Check build logs: https://app.netlify.com
```

### 3. **Post-Deployment Verification**
- [ ] Test chat functionality
- [ ] Test voice calling
- [ ] Test Instagram webhooks
- [ ] Verify no console errors
- [ ] Check network tab for failed requests
- [ ] Test appointment booking flow

---

## 🔍 Monitoring

### Add These Services:

1. **Sentry** (Error Tracking)
   ```javascript
   // Add to frontend and backend
   import * as Sentry from "@sentry/node";
   Sentry.init({ dsn: "your-sentry-dsn" });
   ```

2. **LogDNA/Datadog** (Log Aggregation)
   - Connect Render logs
   - Set up alerts for errors

3. **Uptime Monitoring**
   - Use Render's health checks
   - Add external monitor (UptimeRobot)

---

## 📱 Instagram Webhook Setup

1. **Update Webhook URL** in Facebook App:
   ```
   https://your-backend.onrender.com/api/instagram/webhook
   ```

2. **Verify Token**: `pedro_dental_2025_secure`

3. **Subscribe to Webhooks**:
   - messages
   - messaging_postbacks
   - messaging_optins

---

## 🆘 Emergency Procedures

### If You Get Hacked:
1. **Immediately** rotate all API keys
2. Check Supabase logs for unauthorized access
3. Review Render/Netlify access logs
4. Enable 2FA on all services

### If Services Go Down:
1. Check Render status page
2. Check Supabase status
3. Verify API keys are valid
4. Check rate limit wasn't hit

---

## 📞 Support Contacts

- **Render Support**: support@render.com
- **Netlify Support**: https://www.netlify.com/support/
- **Supabase Support**: support@supabase.io
- **Twilio Support**: https://support.twilio.com

---

## ✅ Final Checklist

Before going live:
- [ ] All API keys rotated
- [ ] Environment variables set in Render/Netlify
- [ ] CORS configured for production domains only
- [ ] Rate limiting enabled
- [ ] Security headers active
- [ ] Logs not exposing sensitive data
- [ ] SSL certificates active
- [ ] Monitoring set up
- [ ] Backup plan documented
- [ ] Team knows emergency procedures

**Remember**: Security is an ongoing process. Schedule monthly security reviews!