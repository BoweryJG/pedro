# Netlify Deployment Guide for Dr. Pedro's Multi-Domain Architecture

## Current Status

✅ **Main domain**: https://gregpedromd.com  
✅ **Path-based subdomain access** (no DNS required):
- TMJ: https://gregpedromd.com/tmj
- Implants: https://gregpedromd.com/implants
- Robotic: https://gregpedromd.com/robotic
- MedSpa: https://gregpedromd.com/medspa
- AboutFace: https://gregpedromd.com/aboutface

## Deployment Process

### Automatic Deployment (via GitHub)
Every push to the `main` branch triggers an automatic deployment on Netlify.

### Manual Deployment with Netlify CLI

1. **Install Netlify CLI** (if not already installed):
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Link your project** (first time only):
```bash
netlify link
```

4. **Deploy to production**:
```bash
# Build and deploy in one command
netlify deploy --prod --build

# Or build locally first, then deploy
./build-all.sh
netlify deploy --prod --dir dist
```

5. **Deploy a preview** (for testing):
```bash
netlify deploy --build
```

## Verifying Deployment

### 1. Check Build Status
Visit your Netlify dashboard or run:
```bash
netlify status
```

### 2. Test Path-Based URLs
After deployment completes (usually 2-3 minutes), test these URLs:
- https://gregpedromd.com/tmj
- https://gregpedromd.com/implants
- https://gregpedromd.com/robotic
- https://gregpedromd.com/medspa
- https://gregpedromd.com/aboutface

### 3. Run Deployment Check Script
```bash
node check-deployment.js
```

## Setting Up DNS Records (When Ready)

Once you're satisfied with the deployment, set up DNS records for true subdomain access:

### In Your Domain Registrar (GoDaddy, Namecheap, etc.)

Add these CNAME records:

| Type | Name | Value |
|------|------|-------|
| CNAME | tmj | gregpedromd.netlify.app |
| CNAME | implants | gregpedromd.netlify.app |
| CNAME | robotic | gregpedromd.netlify.app |
| CNAME | medspa | gregpedromd.netlify.app |
| CNAME | aboutface | gregpedromd.netlify.app |

### In Netlify Dashboard

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Add each subdomain:
   - tmj.gregpedromd.com
   - implants.gregpedromd.com
   - robotic.gregpedromd.com
   - medspa.gregpedromd.com
   - aboutface.gregpedromd.com

## Troubleshooting

### Build Failures
```bash
# Check build logs
netlify logs:function

# Run build locally to debug
./build-all.sh
```

### Path-based URLs Not Working
1. Ensure the latest `netlify.toml` is deployed
2. Clear browser cache
3. Check Netlify deployment logs

### Subdomain DNS Not Working
1. DNS propagation can take up to 48 hours
2. Use `nslookup` to verify DNS records:
```bash
nslookup tmj.gregpedromd.com
```

## Environment Variables

Ensure these are set in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_NETLIFY_FUNCTIONS_URL`

## Build Configuration

Current `netlify.toml` settings:
- **Build command**: `./build-all.sh`
- **Publish directory**: `dist`
- **Functions directory**: `frontend/netlify/functions`
- **Node version**: 20

## Next Steps

1. ✅ Push code to trigger deployment
2. ⏳ Wait for build to complete (check Netlify dashboard)
3. 🧪 Test path-based URLs
4. 📋 When ready, configure DNS records
5. 🎉 Enjoy your multi-domain architecture!
