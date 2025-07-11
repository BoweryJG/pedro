-- Script to check current RLS policies before migration
-- Run this to see what policies exist and need to be updated

-- Check which tables have RLS enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN (
        'patients', 'appointments', 'services', 'staff', 
        'financial_transactions', 'provider_time_slots',
        'phone_calls', 'voice_calls', 'sms_conversations', 
        'sms_messages', 'sms_interactions', 'webhook_logs',
        'system_settings', 'audit_log'
    )
ORDER BY tablename;

-- List all current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check current permissions granted to roles
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
    AND grantee IN ('anon', 'authenticated', 'service_role')
ORDER BY grantee, table_name, privilege_type;

-- Check if auth schema exists and has users table
SELECT 
    table_schema,
    table_name
FROM information_schema.tables
WHERE table_schema = 'auth'
    AND table_name = 'users';

-- Check for auth_user_id columns in tables
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND column_name IN ('auth_user_id', 'user_id')
ORDER BY table_name;