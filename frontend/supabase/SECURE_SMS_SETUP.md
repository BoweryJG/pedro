# Secure SMS Authentication Setup

This document explains how to configure secure authentication for SMS sending without hardcoding JWT tokens in SQL files.

## Overview

The SMS sending functionality has been updated to use secure authentication methods instead of hardcoded JWT tokens. This improves security by:

1. Storing sensitive keys in Supabase Vault
2. Using database configuration parameters for URLs
3. Retrieving keys dynamically at runtime

## Files Updated

- `fix_automatic_sms.sql` - Now uses vault-stored service role key
- `fix_sms_sending.sql` - Now uses vault-stored anon key
- `setup_secure_sms_auth.sql` - New setup script for configuring secure authentication

## Setup Instructions

### 1. Run the Setup Script

First, run the setup script to configure the necessary components:

```sql
-- Connect to your database and run:
\i setup_secure_sms_auth.sql
```

### 2. Configure Your Keys

The setup script will create placeholder entries. You need to update them with your actual keys:

```sql
-- Update with your actual service role key
UPDATE vault.secrets 
SET secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
WHERE name = 'service_role_key';

-- Update with your actual anon key
UPDATE vault.secrets 
SET secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' 
WHERE name = 'anon_key';
```

### 3. Configure Your Supabase URL

Update the database configuration with your actual Supabase project URL:

```sql
ALTER DATABASE postgres SET app.supabase_url = 'https://tsmtaarwgodklafqlbhm.supabase.co';
```

### 4. Run the SMS Scripts

After setup is complete, you can run the SMS configuration scripts:

```sql
\i fix_automatic_sms.sql
\i fix_sms_sending.sql
```

## Security Benefits

1. **No Hardcoded Secrets**: JWT tokens are no longer exposed in SQL files
2. **Centralized Key Management**: All keys are stored securely in Supabase Vault
3. **Easy Key Rotation**: Keys can be updated in one place without modifying SQL files
4. **Environment Separation**: Different keys can be used for different environments

## Troubleshooting

### Vault Extension Not Available

If you get an error about the vault extension, ensure it's enabled in your Supabase project:

```sql
CREATE EXTENSION IF NOT EXISTS vault;
```

### Keys Not Found

If the functions can't find the keys, verify they're properly stored:

```sql
SELECT name, created_at FROM vault.secrets;
```

### URL Configuration Issues

Check if the URL is properly configured:

```sql
SHOW app.supabase_url;
```

## Alternative Approaches

If you cannot use Supabase Vault, consider these alternatives:

1. **Environment Variables**: Pass keys as parameters to the functions
2. **Secure Tables**: Create a dedicated secure configuration table with RLS
3. **External Key Management**: Use external services like AWS Secrets Manager

## Migration from Hardcoded Tokens

If you're migrating from the old hardcoded approach:

1. Backup your database
2. Run the setup script
3. Update the SMS SQL files
4. Test SMS sending functionality
5. Remove any old scripts containing hardcoded tokens

## Best Practices

1. Never commit JWT tokens to version control
2. Use different keys for different environments
3. Rotate keys regularly
4. Monitor key usage through Supabase logs
5. Restrict vault access to necessary roles only