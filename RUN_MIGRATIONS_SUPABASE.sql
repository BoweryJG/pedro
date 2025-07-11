-- SUPABASE MIGRATION SCRIPT
-- Run these migrations in order in your Supabase SQL editor

-- ============================================
-- STEP 1: CREATE AUTHENTICATION TABLES
-- ============================================
-- Run the authentication tables migration first
-- This creates users, roles, permissions, and audit tables

-- Copy and paste the contents of this file:
-- backend/migrations/001_auth_tables.sql

-- ============================================
-- STEP 2: APPLY HIPAA-COMPLIANT RLS POLICIES
-- ============================================
-- This updates all Row Level Security policies to be HIPAA compliant
-- and restricts access to sensitive data

-- First, check current policies (optional):
-- Copy and paste from: backend/migrations/check_current_rls_policies.sql

-- Then apply the new policies:
-- Copy and paste from: backend/migrations/hipaa_compliant_rls_policies.sql

-- ============================================
-- STEP 3: CREATE ERROR LOGS TABLE
-- ============================================
-- This creates a table for storing application errors

-- Copy and paste from: backend/migrations/create_error_logs_table.sql

-- ============================================
-- STEP 4: SETUP SECURE SMS AUTHENTICATION
-- ============================================
-- This sets up the Supabase Vault for secure JWT token storage

-- Copy and paste from: frontend/supabase/setup_secure_sms_auth.sql

-- ============================================
-- STEP 5: UPDATE SMS TRIGGER FUNCTIONS
-- ============================================
-- These have already been updated to use secure token retrieval

-- The following files have been updated but don't need to be re-run
-- unless you want to update existing triggers:
-- - frontend/supabase/fix_automatic_sms.sql
-- - frontend/supabase/fix_sms_sending.sql

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify authentication tables were created:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'refresh_tokens', 'api_keys', 'audit_logs')
ORDER BY table_name;

-- Verify RLS policies are in place:
SELECT tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('patients', 'appointments', 'financial_transactions')
ORDER BY tablename, policyname;

-- Check if vault secrets are configured:
SELECT id, name, created_at 
FROM vault.secrets 
WHERE name IN ('supabase_service_role_key', 'supabase_anon_key');

-- ============================================
-- POST-MIGRATION SETUP
-- ============================================

-- 1. After running migrations, update the vault secrets:
--    Go to Settings > Vault in your Supabase dashboard
--    Add these secrets:
--    - supabase_service_role_key: [Your service role key]
--    - supabase_anon_key: [Your anon key]

-- 2. Create an admin user by running the setup script:
--    cd backend && node scripts/setup-auth.js

-- 3. Test the authentication:
--    The default admin credentials are:
--    Email: admin@gregpedromd.com
--    Password: ChangeMe123! (change immediately)

-- ============================================
-- IMPORTANT NOTES
-- ============================================

-- 1. These migrations implement strict access controls.
--    Make sure your application uses authentication tokens.

-- 2. Anonymous users can still book appointments but cannot
--    view other patients' data.

-- 3. All financial and communication data now requires
--    proper authentication to access.

-- 4. If you need to rollback, use:
--    backend/migrations/rollback_hipaa_rls_policies.sql