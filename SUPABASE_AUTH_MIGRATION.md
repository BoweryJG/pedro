# Supabase Authentication Migration Guide

## Overview

The pedro project has been updated to use Supabase authentication from the bowerycreativeagency project. This provides a more robust and secure authentication system with Google OAuth support.

## Key Changes

### 1. Frontend Authentication
- **Supabase Client**: Configured in `/frontend/src/lib/supabase.ts` with the project URL and anon key
- **Auth Context**: Already uses Supabase for Google OAuth and magic link authentication
- **API Service**: Updated to use Supabase JWT tokens in Authorization headers

### 2. Backend Authentication
- **Middleware**: Updated `/backend/src/middleware/auth.js` to validate Supabase JWT tokens
- **Auth Routes**: Deprecated legacy login/logout/refresh endpoints in favor of Supabase Auth
- **Token Validation**: Backend now validates tokens using Supabase's `getUser()` method

### 3. Environment Variables
Updated `.env.example` with:
```env
# Frontend
VITE_SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend
SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
SUPABASE_SERVICE_ROLE_KEY=# Get from Supabase dashboard

# Authorized emails
VITE_AUTHORIZED_EMAILS=drpedro@gregpedromd.com,info@gregpedromd.com
AUTHORIZED_EMAILS=drpedro@gregpedromd.com,info@gregpedromd.com
```

## Authentication Flow

1. **Login**: Users sign in via Google OAuth or magic link through Supabase
2. **Token Management**: Supabase handles all token generation and refresh
3. **API Calls**: Frontend automatically includes Supabase JWT in Authorization headers
4. **Backend Validation**: API endpoints validate tokens using Supabase

## Setting Up Google OAuth

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials
4. Configure redirect URLs for your domain

## API Integration

All API calls now use the format:
```javascript
Authorization: Bearer <supabase_jwt_token>
```

The token is automatically retrieved from the current Supabase session.

## User Roles and Permissions

- Authorized users (based on email list) get ADMIN role
- Other authenticated users get PATIENT role
- Role-based permissions are enforced in backend middleware

## Migration Checklist

- [x] Update Supabase client configuration
- [x] Update API service to use Supabase tokens
- [x] Update backend auth middleware
- [x] Deprecate legacy auth endpoints
- [x] Update environment variables
- [ ] Get and configure SUPABASE_SERVICE_ROLE_KEY from dashboard
- [ ] Test Google OAuth flow
- [ ] Test magic link authentication
- [ ] Verify API authentication works

## Removed Legacy Code

- Backend JWT generation/validation (now handled by Supabase)
- Local password storage and validation
- Refresh token management
- Login/logout/refresh endpoints

## Security Notes

1. Never expose the service role key in frontend code
2. Always validate tokens on the backend
3. Keep authorized email list updated
4. Monitor Supabase dashboard for authentication events

## Troubleshooting

- **401 Errors**: Check if token is being sent correctly
- **Invalid Token**: Ensure using correct Supabase project
- **User Not Found**: User profile may need to be created on first login