# Error Handling System Documentation

## Overview

This document describes the comprehensive error handling system implemented in the Dr. Pedro Dental Backend Server. The system provides:

- Global error catching and logging
- Sanitized error responses for clients
- Different error handling for development vs production
- Error monitoring integration points
- Detailed error analytics

## Components

### 1. Error Handler Middleware (`src/middleware/errorHandler.js`)

#### Custom Error Classes

- `AppError`: Base error class for operational errors
- `ValidationError`: For request validation failures (400)
- `AuthenticationError`: For authentication failures (401)
- `AuthorizationError`: For authorization failures (403)
- `NotFoundError`: For resource not found errors (404)
- `ConflictError`: For resource conflicts (409)
- `RateLimitError`: For rate limit exceeded (429)
- `ExternalServiceError`: For third-party service failures (503)

#### Key Functions

- `asyncHandler`: Wraps async route handlers to automatically catch errors
- `requestErrorLogger`: Logs detailed error information before response
- `globalErrorHandler`: Formats and sends error responses to clients
- `notFoundHandler`: Handles 404 errors for undefined routes

### 2. Logger Configuration (`src/utils/logger.js`)

Provides structured logging with Winston:

- Different log levels: error, warn, info, http, verbose, debug, silly
- File rotation (5MB max file size, 5 files kept)
- Console output in development
- JSON format in production
- Specialized logging methods for different events

### 3. Request Logger (`src/middleware/requestLogger.js`)

- `responseTimeTracker`: Tracks response times
- `requestLogger`: Logs all incoming requests and responses
- `sanitizeRequestData`: Removes sensitive data from logs

### 4. Error Monitoring Service (`src/services/errorMonitoring.js`)

Provides error analytics and monitoring:

- Error statistics by time period
- Most frequent errors
- Error trends over time
- User-specific error tracking
- Critical error alerts
- Automatic cleanup of old logs

### 5. Error Analytics API (`src/routes/errorAnalytics.js`)

Admin-only endpoints for error analysis:

- `GET /api/errors/stats`: Error statistics
- `GET /api/errors/frequent`: Most frequent errors
- `GET /api/errors/trends`: Error trends over time
- `GET /api/errors/user/:userId`: User-specific errors
- `GET /api/errors/report`: Comprehensive error report
- `POST /api/errors/cleanup`: Clean up old logs
- `POST /api/errors/check-critical`: Check for critical errors

## Usage

### Basic Setup

1. Import error handling components in your main server file:

```javascript
import {
  requestErrorLogger,
  globalErrorHandler,
  notFoundHandler,
  asyncHandler
} from './src/middleware/errorHandler.js';
```

2. Apply middleware in correct order:

```javascript
// Early in middleware stack
app.use(responseTimeTracker);
app.use(requestLogger);

// Your routes here...

// At the end (order matters!)
app.use(notFoundHandler);
app.use(requestErrorLogger);
app.use(globalErrorHandler);
```

### Using Custom Error Classes

```javascript
import { ValidationError, NotFoundError } from './middleware/errorHandler.js';

// In your route handler
app.get('/api/users/:id', asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User not found');
  }
  
  res.json(user);
}));
```

### Environment Variables

Configure error handling behavior with these environment variables:

- `NODE_ENV`: Set to 'production' for sanitized errors
- `LOG_LEVEL`: Set logging level (default: 'info' in production, 'debug' in development)
- `SENTRY_DSN`: Enable Sentry integration
- `DATADOG_API_KEY`: Enable Datadog integration
- `NEW_RELIC_LICENSE_KEY`: Enable New Relic integration
- `ERROR_WEBHOOK_URL`: Send errors to custom webhook
- `ALERT_WEBHOOK_URL`: Send critical error alerts

### Error Response Format

#### Development
```json
{
  "error": {
    "message": "Detailed error message",
    "errorId": "uuid-v4-error-id",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "type": "ValidationError",
    "stack": "Full stack trace...",
    "details": {
      "originalError": "Error",
      "code": "ERROR_CODE"
    }
  }
}
```

#### Production
```json
{
  "error": {
    "message": "Sanitized error message",
    "errorId": "uuid-v4-error-id",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "type": "ValidationError",
    "help": {
      "documentation": "https://api.gregpedromd.com/docs/errors",
      "support": "support@gregpedromd.com"
    }
  }
}
```

## Monitoring Integration Points

The system includes integration points for popular monitoring services:

1. **Sentry**: Error tracking and performance monitoring
2. **Datadog**: Metrics and APM
3. **New Relic**: Application performance monitoring
4. **Custom Webhooks**: Send errors to any HTTP endpoint
5. **Supabase**: Store errors in database for analytics

## Database Schema

The system includes a Supabase table for storing error logs:

```sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY,
  error_id VARCHAR(255),
  message TEXT,
  stack TEXT,
  status_code INTEGER,
  method VARCHAR(10),
  path TEXT,
  user_id UUID,
  ip_address INET,
  environment VARCHAR(50),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE
);
```

## Best Practices

1. **Always use asyncHandler** for async route handlers
2. **Throw custom error classes** instead of generic errors
3. **Include meaningful error messages** in development
4. **Never expose sensitive information** in production errors
5. **Monitor error trends** regularly using the analytics API
6. **Set up alerts** for critical error thresholds
7. **Clean up old logs** periodically to manage storage

## Maintenance

### Setting Up Logs Directory

Run the setup script after installation:

```bash
node scripts/setup-logs.js
```

### Running Migrations

Apply the error logs table migration:

```bash
supabase db push
```

### Monitoring Health

Check error system health:

```bash
curl http://localhost:3001/health
```

### Viewing Error Analytics

Access error analytics (requires admin authentication):

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3001/api/errors/stats?startDate=2024-01-01&endDate=2024-12-31
```

## Troubleshooting

### Logs Not Being Created

1. Ensure logs directory exists: `node scripts/setup-logs.js`
2. Check file permissions
3. Verify Winston is properly configured

### Errors Not Being Caught

1. Ensure asyncHandler is used for async routes
2. Check middleware order (error handlers must be last)
3. Verify error is thrown, not just logged

### Performance Impact

1. Use appropriate log levels in production
2. Implement log rotation
3. Clean up old logs regularly
4. Consider async logging for high-traffic applications