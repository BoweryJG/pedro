# CORS Configuration Guide

## Overview
This document outlines the CORS (Cross-Origin Resource Sharing) configuration for the Dr. Pedro backend server.

## Allowed Origins

### Production Domains
- `https://gregpedromd.com` - Main website
- `https://www.gregpedromd.com` - Main website with www
- `https://tmj.gregpedromd.com` - TMJ subdomain
- `https://implants.gregpedromd.com` - Implants subdomain
- `https://robotic.gregpedromd.com` - Robotic surgery subdomain
- `https://medspa.gregpedromd.com` - MedSpa subdomain
- `https://aboutface.gregpedromd.com` - AboutFace subdomain

### Development Domains
- `http://localhost:5173` - Vite dev server
- `http://localhost:5174` - Vite dev server (alternate)
- `http://localhost:3000` - React dev server
- `http://localhost:3001` - Backend dev server

### Preview Deployments
- `https://*.netlify.app` - Netlify preview deployments
- `https://*.vercel.app` - Vercel preview deployments

## Configuration

### Environment Variable
Set the `ALLOWED_ORIGINS` environment variable in Render dashboard:
```
ALLOWED_ORIGINS=https://gregpedromd.com,https://www.gregpedromd.com,https://tmj.gregpedromd.com,https://implants.gregpedromd.com,https://robotic.gregpedromd.com,https://medspa.gregpedromd.com,https://aboutface.gregpedromd.com
```

### CORS Options
- **Credentials**: Enabled (cookies/auth)
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization, X-Requested-With
- **Max Age**: 86400 seconds (24 hours)

### WebSocket CORS
WebSocket connections use the same origin validation:
- Checks against allowed origins list
- Allows preview deployments
- Logs rejected origins for debugging

## Testing CORS

### Using curl
```bash
# Test API endpoint
curl -H "Origin: https://gregpedromd.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://pedrobackend.onrender.com/api/status

# Test WebSocket endpoint
curl -H "Origin: https://gregpedromd.com" \
     -H "Connection: Upgrade" \
     -H "Upgrade: websocket" \
     https://pedrobackend.onrender.com/webrtc-voice
```

### Browser Console
```javascript
// Test from browser console
fetch('https://pedrobackend.onrender.com/api/status', {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error('CORS Error:', err));
```

## Troubleshooting

### Common Issues
1. **"Not allowed by CORS" error**
   - Check that origin is in allowed list
   - Verify no trailing slashes in origins
   - Check for http vs https mismatch

2. **WebSocket connection fails**
   - Ensure using `wss://` for HTTPS sites
   - Check WebSocket origin validation
   - Verify SSL certificates

3. **Credentials not sent**
   - Ensure `credentials: 'include'` in fetch
   - Check cookie settings
   - Verify same-site policies

### Debug Logging
The server logs rejected origins:
- `CORS: Rejected origin [origin]` - HTTP requests
- `WebSocket: Rejected origin [origin]` - WebSocket connections

## Security Notes
- Never use `origin: '*'` in production
- Always validate origins against whitelist
- Use HTTPS for all production domains
- Regularly review and update allowed origins
- Remove unused domains from whitelist