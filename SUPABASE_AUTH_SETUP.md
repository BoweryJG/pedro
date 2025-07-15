# Supabase Authentication Setup for Pedro

This document describes the Supabase authentication integration for the Pedro dental practice application.

## Overview

The Pedro application uses Supabase for authentication and authorization. Both the frontend and backend are configured to work with the same Supabase project.

## Supabase Project Details

- **Project URL**: `https://fiozmyoedptukpkzuhqm.supabase.co`
- **Project Name**: bowerycreativeagency

## Configuration

### Frontend Configuration

1. **Environment Variables** (`.env`):
   ```env
   VITE_SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Supabase Client** (`src/lib/supabase.ts`):
   - Initializes Supabase client with URL and anon key
   - Handles missing credentials gracefully
   - Provides type definitions for database tables

3. **API Service** (`src/services/api.ts`):
   - Automatically includes Supabase JWT token in all API requests
   - Uses axios interceptors to add `Authorization: Bearer <token>` header
   - Handles 401 responses by signing out and redirecting to login

4. **Auth Context** (`src/contexts/AuthContext.tsx`):
   - Manages user authentication state
   - Provides Google OAuth sign-in
   - Checks authorized email list for dashboard access

### Backend Configuration

1. **Environment Variables** (`.env`):
   ```env
   SUPABASE_URL=https://fiozmyoedptukpkzuhqm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Authentication Middleware** (`src/middleware/auth.js`):
   - Validates Supabase JWT tokens
   - Extracts user from Supabase auth
   - Creates user profiles if they don't exist
   - Implements role-based access control (RBAC)
   - Supports multiple authentication methods (JWT, API keys)

3. **CORS Configuration**:
   - Allows `Authorization` header
   - Supports credentials
   - Configured for production domains and localhost

## Authentication Flow

1. **User Sign In**:
   - User signs in via Supabase (email/password or Google OAuth)
   - Supabase returns JWT access token
   - Token is stored in Supabase client session

2. **API Requests**:
   - Frontend automatically includes JWT in `Authorization` header
   - Backend validates JWT with Supabase
   - User profile is loaded/created as needed
   - Request proceeds with user context

3. **Protected Routes**:
   - Frontend uses `AuthContext` to check authentication
   - Backend uses `authenticate` middleware for protected endpoints
   - Role-based permissions are enforced

## Integration with Agentbackend

The Pedro backend acts as a proxy for agentbackend requests:

1. **Frontend** → **Pedro Backend** → **Agentbackend**
2. JWT validation happens at Pedro backend
3. Pedro backend forwards authenticated requests to agentbackend

### Agentbackend API Service

Created `src/services/agentbackendApi.ts` for direct agentbackend integration:
- Automatically includes Supabase JWT tokens
- Provides typed API methods for agents and chat
- Handles authentication errors

## User Roles

The system supports multiple user roles:
- `super_admin`: Full system access
- `admin`: Administrative access
- `doctor`: Medical professional access
- `staff`: Staff member access
- `patient`: Patient access
- `api_client`: External API access

## Testing Authentication

Use the provided test script to verify authentication:

```bash
node test-supabase-auth.js
```

This script will:
1. Sign in with test credentials
2. Test backend API with JWT token
3. Test authenticated endpoints
4. Test agentbackend integration
5. Test chat functionality

## Security Considerations

1. **Service Role Key**: Only used on backend, never exposed to frontend
2. **Anon Key**: Safe to use in frontend, limited permissions
3. **JWT Validation**: All tokens verified with Supabase
4. **HTTPS Only**: All API calls use HTTPS
5. **CORS Protection**: Strict origin validation
6. **Rate Limiting**: Different limits based on user role

## Troubleshooting

1. **401 Unauthorized**:
   - Check if user is signed in
   - Verify JWT token is being sent
   - Check if user has required permissions

2. **CORS Errors**:
   - Verify origin is in allowed list
   - Check if credentials are included

3. **Invalid Token**:
   - Token may be expired
   - User may need to sign in again

## Next Steps

1. Set up proper user management UI
2. Implement password reset flow
3. Add two-factor authentication
4. Set up audit logging
5. Configure session timeout policies