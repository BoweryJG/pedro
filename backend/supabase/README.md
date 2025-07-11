# Supabase Database Setup for Backend

## Required Tables

The backend scheduled jobs require these tables to exist in your Supabase database:

1. **phone_calls** - Stores Twilio call records
2. **appointments** - Already exists in frontend schema

## Setup Instructions

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `create_phone_calls_table.sql`
4. Click "Run" to execute the SQL

### Option 2: Using Supabase CLI

```bash
# If you have supabase CLI installed
supabase db push create_phone_calls_table.sql
```

### Option 3: Using MCP Supabase Tool

If you have the Supabase MCP tool configured in Claude Desktop, you can run:

```
Execute the SQL from create_phone_calls_table.sql
```

## Verification

After creating the table, verify it exists:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'phone_calls';
```

## Troubleshooting

If you continue to see "Error fetching phone calls: Invalid API key", check:

1. Your SUPABASE_SERVICE_ROLE_KEY has proper permissions
2. The table was created in the correct schema (public)
3. RLS policies are correctly applied

The error won't affect core functionality - it only impacts the analytics scheduled job.