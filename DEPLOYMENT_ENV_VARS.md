# Deployment Environment Variables

## For Render.com

Add these environment variables to your Render web service:

```
VITE_SUPABASE_URL=https://tsmtaarwgodklafqlbhm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTM2MjAsImV4cCI6MjA2MzQyOTYyMH0.AT_9RXVrI82-oSbvUACmtRgFCm2k-rx4hEozKqMa1Ds
```

## For Netlify

Add the same variables to your Netlify site settings.

## Next Steps

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/tsmtaarwgodklafqlbhm
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire contents of `setup-database.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute all the migrations

This will:
- Create all necessary tables
- Set up security policies
- Create booking functions
- Add sample data (services, staff, availability)

## Testing

After running the migrations, test by:
1. Visiting your site
2. Clicking "Book Appointment"
3. You should see services and be able to select dates/times