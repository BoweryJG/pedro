-- Setup script for secure SMS authentication
-- This script helps you configure the necessary components for secure SMS sending
-- without hardcoding JWT tokens in your SQL files

-- 1. Enable the Vault extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vault;

-- 2. Enable the HTTP extension (required for pg_net)
CREATE EXTENSION IF NOT EXISTS http;

-- 3. Store your Supabase keys securely in the vault
-- Replace 'your-actual-service-role-key' and 'your-actual-anon-key' with your real keys
-- You can find these keys in your Supabase project settings

-- Store service role key (used in fix_automatic_sms.sql)
INSERT INTO vault.secrets (name, secret) 
VALUES ('service_role_key', 'your-actual-service-role-key')
ON CONFLICT (name) 
DO UPDATE SET secret = EXCLUDED.secret;

-- Store anon key (used in fix_sms_sending.sql)
INSERT INTO vault.secrets (name, secret) 
VALUES ('anon_key', 'your-actual-anon-key')
ON CONFLICT (name) 
DO UPDATE SET secret = EXCLUDED.secret;

-- 4. Set the Supabase URL as a database configuration parameter
-- Replace 'your-project' with your actual Supabase project reference
ALTER DATABASE postgres SET app.supabase_url = 'https://your-project.supabase.co';

-- 5. Verify the setup
DO $$
DECLARE
    v_service_role_key TEXT;
    v_anon_key TEXT;
    v_supabase_url TEXT;
BEGIN
    -- Check if keys are stored
    SELECT decrypted_secret INTO v_service_role_key
    FROM vault.decrypted_secrets
    WHERE name = 'service_role_key';
    
    SELECT decrypted_secret INTO v_anon_key
    FROM vault.decrypted_secrets
    WHERE name = 'anon_key';
    
    -- Check if URL is configured
    SELECT current_setting('app.supabase_url', true) INTO v_supabase_url;
    
    -- Raise notices about the setup status
    IF v_service_role_key IS NOT NULL AND v_service_role_key != 'your-actual-service-role-key' THEN
        RAISE NOTICE 'Service role key is properly configured';
    ELSE
        RAISE WARNING 'Service role key needs to be configured with your actual key';
    END IF;
    
    IF v_anon_key IS NOT NULL AND v_anon_key != 'your-actual-anon-key' THEN
        RAISE NOTICE 'Anon key is properly configured';
    ELSE
        RAISE WARNING 'Anon key needs to be configured with your actual key';
    END IF;
    
    IF v_supabase_url IS NOT NULL AND v_supabase_url != 'https://your-project.supabase.co' THEN
        RAISE NOTICE 'Supabase URL is properly configured: %', v_supabase_url;
    ELSE
        RAISE WARNING 'Supabase URL needs to be configured with your actual project URL';
    END IF;
END $$;

-- Note: After running this setup script, you can safely run fix_automatic_sms.sql 
-- and fix_sms_sending.sql without any hardcoded tokens