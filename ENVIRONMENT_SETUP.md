# Environment Variables Setup

## Quick Start

The booking system requires Supabase credentials to function. Without them, the booking button will default to showing the phone number for manual booking.

## Frontend Environment Variables

### For Local Development

1. Copy the example file:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### For Production (Render.com)

1. Go to your Render dashboard
2. Select your web service
3. Go to "Environment" tab
4. Add the following environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key

### For Production (Netlify)

1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site settings" → "Environment variables"
4. Add the same variables as above

## Getting Supabase Credentials

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to "Settings" → "API"
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public key → `VITE_SUPABASE_ANON_KEY`

## Optional: Running Without Supabase

The site will work without Supabase credentials, but the booking functionality will be disabled. Instead:
- The booking button will show a phone number alert
- Users can call to book appointments
- All other features of the site will work normally

## Backend Environment Variables (If using backend services)

Create `.env` in the backend directory:
```
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
```

## Security Notes

- Never commit `.env` or `.env.local` files
- The anon key is safe to use in frontend code (it's meant to be public)
- Keep your service key secret (backend only)
- Use environment-specific variables for different deployments