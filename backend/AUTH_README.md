# Authentication & Authorization System

## Overview

This document describes the authentication and authorization system implemented for the Pedro Dental Backend. The system uses JWT tokens for authentication and role-based access control (RBAC) for authorization.

## Key Features

- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Permission-based authorization
- API key authentication for external services
- Audit logging for sensitive operations
- Rate limiting based on user roles
- Resource ownership verification
- Password security requirements

## User Roles

1. **super_admin** - Full system access
2. **admin** - Clinic administration access
3. **doctor** - Medical professional access
4. **staff** - Office staff access
5. **patient** - Patient portal access
6. **api_client** - External API access

## Authentication Flow

### 1. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "staff",
    "clinic_id": "uuid"
  }
}
```

### 2. Using Authentication
Include the JWT token in the Authorization header:
```bash
Authorization: Bearer eyJhbGc...
```

### 3. Refresh Token
```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

### 4. Logout
```bash
POST /api/auth/logout
Authorization: Bearer eyJhbGc...
```

## API Key Authentication

For external services and webhooks:

### Creating an API Key (Admin only)
```bash
POST /api/keys/create
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "name": "External Service API Key",
  "permissions": ["read:public_data", "webhook:receive"],
  "rate_limit": 200
}
```

### Using API Keys
Include the API key in the header:
```bash
X-API-Key: sk_live_abc123...
```

## Protected Endpoints

### Patient Data Endpoints
- `GET /api/patients` - Requires `read:patients` permission
- `POST /api/patients` - Requires `write:patients` permission
- `GET /api/patients/:id` - Requires ownership verification

### SMS & Communication
- `POST /api/voip/sms/send` - Requires `manage:sms` permission
- `GET /api/voip/sms/conversations` - Requires `manage:sms` permission

### Voice Calls
- `GET /api/voip/calls/recordings` - Requires `manage:voice_calls` permission
- `GET /api/voice/transcripts` - Requires `manage:voice_calls` permission
- `POST /voice/config` - Requires doctor or admin role

### Financial Information
- `POST /financing/sunbit` - Requires `read:billing` permission
- `POST /financing/cherry` - Requires `read:billing` permission

### Analytics
- `GET /api/voip/analytics` - Requires `view:analytics` permission

### Admin Operations
- `POST /api/voip/sync` - Admin/Super Admin only
- `POST /api/voip/configure-webhook` - Admin/Super Admin only
- API Key management - Admin/Super Admin only

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase and lowercase letters
- Must contain at least one number
- Must contain at least one special character

### Rate Limiting by Role
- Super Admin: 1000 requests/15 min
- Admin: 500 requests/15 min
- Doctor/Staff: 300 requests/15 min
- Patient: 100 requests/15 min
- API Client: 200 requests/15 min

### Audit Logging
Sensitive operations are logged with:
- User ID
- Action performed
- Resource affected
- IP address
- Timestamp
- Request/response details

## Database Setup

Run the migration to create authentication tables:
```bash
psql -U postgres -d your_database -f migrations/001_auth_tables.sql
```

## Environment Variables

Add these to your `.env` file:
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Default Admin (change password immediately)
DEFAULT_ADMIN_EMAIL=admin@gregpedromd.com
DEFAULT_ADMIN_PASSWORD=ChangeMe123!
```

## Initial Setup

1. Run the database migration
2. Login with default admin credentials:
   - Email: `admin@gregpedromd.com`
   - Password: `ChangeMe123!`
3. **IMMEDIATELY** change the admin password:
   ```bash
   POST /api/auth/change-password
   Authorization: Bearer eyJhbGc...
   {
     "currentPassword": "ChangeMe123!",
     "newPassword": "YourNewSecurePassword123!"
   }
   ```

## Error Codes

- `AUTH_HEADER_MISSING` - No Authorization header
- `AUTH_FORMAT_INVALID` - Invalid Authorization format
- `TOKEN_EXPIRED` - JWT token has expired
- `TOKEN_INVALID` - Invalid JWT token
- `USER_NOT_FOUND` - User doesn't exist
- `USER_DEACTIVATED` - User account is disabled
- `INSUFFICIENT_PERMISSIONS` - User lacks required role
- `PERMISSION_DENIED` - User lacks required permission
- `RESOURCE_ACCESS_DENIED` - User cannot access resource

## Testing Authentication

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gregpedromd.com","password":"ChangeMe123!"}'
```

### Test Protected Endpoint
```bash
curl -X GET http://localhost:3001/api/voice/transcripts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test API Key
```bash
curl -X GET http://localhost:3001/webhooks/health \
  -H "X-API-Key: sk_live_your_api_key"
```

## Best Practices

1. **Never expose JWT secret** - Keep it secure and rotate regularly
2. **Use HTTPS in production** - All authentication must be over TLS
3. **Implement token rotation** - Use refresh tokens, don't extend JWT expiry
4. **Monitor failed logins** - Check login_attempts table for suspicious activity
5. **Regular security audits** - Review audit_logs table
6. **Principle of least privilege** - Assign minimum required permissions
7. **Secure password storage** - Passwords are hashed with bcrypt (12 rounds)

## Troubleshooting

### "Token expired" errors
- Implement automatic token refresh in your client
- Use the refresh token endpoint before the access token expires

### "Permission denied" errors
- Check user's role and permissions
- Verify the endpoint's required permissions
- Check if resource ownership verification is needed

### API Key issues
- Ensure API key is active and not expired
- Check rate limits for the API key
- Verify API key has required permissions

## Support

For authentication issues or questions, contact the system administrator.