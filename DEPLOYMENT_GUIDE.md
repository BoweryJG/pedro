# Deployment Guide for Dr. Pedro Dental Website

## Overview
This project consists of two parts that need to be deployed separately:
1. **Frontend** - React/Vite static site
2. **Backend** - Node.js API server (minimal, mainly for health checks)

## Render Deployment

### Frontend Service (Static Site)
1. Create a new **Static Site** on Render
2. Connect to GitHub repo: `BoweryJG/pedro`
3. Configure build settings:
   - **Build Command**: `npm install && npm run build:frontend`
   - **Publish Directory**: `frontend/dist`
   
4. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTM2MjAsImV4cCI6MjA2MzQyOTYyMH0.AT_9RXVrI82-oSbvUACmtRgFCm2k-rx4hEozKqMa1Ds
   ```

### Backend Service (Web Service)
1. Create a new **Web Service** on Render
2. Connect to GitHub repo: `BoweryJG/pedro`
3. Configure build settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
4. Environment Variables (optional):
   ```
   NODE_ENV=production
   PORT=3001
   ```

## Important Notes

### Frontend is the Main Application
- The React app handles all user interactions
- Booking system uses Supabase directly from frontend
- SMS notifications are handled by Supabase Edge Functions

### Backend is Minimal
- Only provides health check endpoints
- Not required for booking functionality
- Main purpose is to satisfy deployment requirements

### SMS Configuration
- Twilio credentials are stored in Supabase Edge Functions
- No need to add Twilio credentials to Render
- Edge Function name: `send-appointment-sms`

## Accessing the Site

### Frontend URLs
- Render Static Site: `https://your-site-name.onrender.com`
- Booking Page: `https://your-site-name.onrender.com/booking`

### Backend URLs (if deployed)
- Health Check: `https://your-backend.onrender.com/`
- Status: `https://your-backend.onrender.com/api/status`

## Troubleshooting

### "Supabase credentials not found"
- Ensure environment variables are added to the FRONTEND service
- Trigger a new deploy after adding variables

### Booking page not working
- Check browser console for errors
- Verify Supabase project is active
- Ensure Edge Functions are deployed

### SMS not sending
- Check Supabase Edge Function logs
- Verify Twilio credentials in Edge Function
- Ensure both phone numbers are in Messaging Service pool