# Input Validation and Security Middleware Documentation

## Overview

This document describes the comprehensive input validation and security middleware system implemented for the Dr. Pedro Dental Backend. The system provides multiple layers of protection against common web vulnerabilities.

## Security Features

### 1. Input Validation (express-validator)

All API endpoints use express-validator for input validation with the following protections:

- **Type Validation**: Ensures fields are of the correct data type
- **Length Validation**: Enforces minimum and maximum lengths
- **Format Validation**: Validates emails, URLs, phone numbers, UUIDs, etc.
- **Pattern Matching**: Uses regex patterns for complex validation
- **Sanitization**: Automatically cleans and normalizes input data

### 2. SQL Injection Protection

- String fields are checked against common SQL injection patterns
- Parameterized queries are enforced through validation
- Special characters are escaped or rejected
- Common SQL keywords in unexpected places trigger validation errors

### 3. XSS (Cross-Site Scripting) Protection

- HTML entities are automatically escaped using `.escape()`
- Script tags and JavaScript URLs are stripped
- Event handlers (onclick, onerror, etc.) are removed
- Content Security Policy headers prevent inline scripts

### 4. NoSQL Injection Protection

- MongoDB operators ($where, $ne, etc.) are detected and rejected
- Object depth is limited to prevent prototype pollution
- JSON payloads are validated for malicious patterns

### 5. Path Traversal Protection

- File paths containing `..` or encoded variants are rejected
- URL paths are normalized and validated
- Directory traversal attempts are logged and blocked

### 6. Rate Limiting

Different rate limits for different endpoint types:

- **Default**: 100 requests per 15 minutes
- **Strict**: 10 requests per 15 minutes (for sensitive operations)
- **Auth**: 5 requests per 15 minutes (for login attempts)
- **API**: 60 requests per minute (for general API calls)

### 7. Security Headers

Comprehensive security headers via Helmet:

- **Content Security Policy**: Restricts resource loading
- **HSTS**: Forces HTTPS connections
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Additional XSS protection
- **Referrer Policy**: Controls referrer information

### 8. CSRF Protection

- Origin validation for state-changing operations
- Webhook endpoints are exempted
- Cross-origin requests are validated against whitelist

## Validation Rules by Endpoint

### Authentication Endpoints

#### POST /api/auth/login
```javascript
- email: Required, valid email format, normalized
- password: Required, 8-128 characters
```

#### POST /api/auth/register
```javascript
- email: Required, valid email format, normalized
- password: Required, 8-128 chars, must contain uppercase, lowercase, number, special char
- name: Required, 2-100 characters, sanitized
- role: Required, must be one of: super_admin, admin, doctor, staff, patient
- clinic_id: Optional, valid UUID
```

#### POST /api/auth/change-password
```javascript
- currentPassword: Required, 8-128 characters
- newPassword: Required, 8-128 chars, complexity requirements, different from current
```

### Chat Endpoints

#### POST /chat
```javascript
- messages: Required array, each message must have:
  - role: Required, one of: user, assistant, system
  - content: Required string, max 10,000 characters
- systemPrompt: Required string, 1-5,000 characters
```

### Voice Configuration

#### POST /voice/config
```javascript
- voiceId: Required string, max 100 characters
- agentName: Required string, 2-50 characters
- agentRole: Required string, max 100 characters
- personality: Optional string, max 500 characters
```

### Financing Endpoints

#### POST /financing/sunbit
```javascript
- applicant: Required object with:
  - firstName: Required, sanitized string
  - lastName: Required, sanitized string
  - email: Required, valid email
  - phone: Required, valid phone number
- transaction: Required object with:
  - amount: Required number, 1-100,000
```

#### POST /financing/cherry
```javascript
- patient: Required object
- practice: Optional object
- amount: Required number, 1-100,000
```

### SMS Endpoints

#### POST /api/voip/sms/send
```javascript
- to: Required, valid phone number
- message: Required string, 1-1,600 characters
```

### Webhook Endpoints

#### POST /api/voip/sms/webhook
```javascript
- from: Required, valid phone number
- message: Required string, max 5,000 characters
- id: Optional string
```

## Usage Examples

### Basic Validation

```javascript
import { validateLogin } from './src/middleware/validation.js';

router.post('/login', validateLogin, async (req, res) => {
  // Access validated data
  const { email, password } = req.validatedData;
  // ... handle login
});
```

### Custom Validation

```javascript
import { body, validationResult } from 'express-validator';

const customValidation = [
  body('customField')
    .exists().withMessage('Field is required')
    .isLength({ min: 5, max: 50 }).withMessage('Must be 5-50 characters')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Only alphanumeric allowed'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
```

### Error Response Format

Validation errors return a consistent format:

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ]
}
```

## Security Best Practices

1. **Always validate input**: Never trust user input
2. **Use validated data**: Access `req.validatedData` instead of `req.body`
3. **Whitelist over blacklist**: Define what's allowed rather than what's forbidden
4. **Layer security**: Multiple validation layers provide defense in depth
5. **Log suspicious activity**: Security events are logged for monitoring
6. **Keep dependencies updated**: Regularly update express-validator and other security packages

## Monitoring and Alerts

Security events are logged with the following information:

- Timestamp
- Request ID
- IP address
- User agent
- User ID (if authenticated)
- Suspicious patterns detected

Monitor logs for:
- Multiple validation failures from same IP
- SQL injection attempts
- Path traversal attempts
- Rate limit violations

## Testing Validation

Test validation rules with various inputs:

```bash
# Test SQL injection
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password OR 1=1"}'

# Test XSS
curl -X POST http://localhost:3001/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "<script>alert(1)</script>"}], "systemPrompt": "test"}'

# Test rate limiting
for i in {1..20}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "password": "password"}'
done
```

## Maintenance

Regular maintenance tasks:

1. Review validation rules quarterly
2. Update security patterns based on new threats
3. Monitor false positive rates
4. Adjust rate limits based on usage patterns
5. Update dependencies monthly
6. Review security logs weekly

## Contact

For security concerns or questions about validation:
- Security Team: security@gregpedromd.com
- Developer Support: dev@gregpedromd.com