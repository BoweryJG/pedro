# Redis Sessions and Database Connection Pooling Setup

This document describes the Redis session management and PostgreSQL connection pooling infrastructure implemented for the Pedro backend.

## Overview

The implementation provides:
- **Redis-based session storage** for scalable session management
- **PostgreSQL connection pooling** for efficient database access
- **Health monitoring** for both Redis and database connections
- **Graceful shutdown** handling
- **Automatic fallbacks** for development environments

## Files Created

### 1. Redis Configuration (`/src/config/redis.js`)
- Redis client setup with production-ready settings
- Automatic reconnection with exponential backoff
- Connection pooling and pipelining enabled
- Cache helper functions for easy key-value operations
- Session store configuration for Express

### 2. Database Configuration (`/src/config/database.js`)
- PostgreSQL connection pool using pg-pool
- Automatic Supabase URL parsing
- Connection lifecycle management
- Query helpers with automatic client management
- Transaction support with rollback
- Batch insert operations

### 3. Session Middleware (`/src/middleware/session.js`)
- Express session configuration with Redis store
- Automatic session regeneration for security
- Session helper functions for authentication
- Activity tracking and security features
- Fallback to memory store if Redis unavailable

### 4. Initialization Module (`/src/config/init.js`)
- Centralized connection initialization
- Health check implementation
- Graceful shutdown handling
- Process signal management

### 5. Health Check Routes (`/src/routes/health.js`)
- `/api/health` - Basic health status
- `/api/health/detailed` - Detailed service information
- `/api/health/live` - Kubernetes liveness probe
- `/api/health/ready` - Kubernetes readiness probe

## Environment Variables

### Redis Configuration
```env
# Redis server configuration
REDIS_HOST=localhost          # Redis server host
REDIS_PORT=6379              # Redis server port
REDIS_PASSWORD=              # Redis password (optional)
REDIS_USERNAME=              # Redis username (optional)
REDIS_DB=0                   # Redis database number
REDIS_REQUIRED=false         # Whether Redis is required to start

# Session configuration
SESSION_SECRET=your-secret-key-here  # Session encryption secret
SESSION_NAME=pedro.sid              # Session cookie name
```

### Database Pool Configuration
```env
# PostgreSQL connection
DATABASE_URL=postgres://...   # Direct PostgreSQL URL (optional)
SUPABASE_DB_PASSWORD=        # Supabase DB password (if different from service key)

# Connection pool settings
DB_POOL_MAX=20               # Maximum pool size
DB_POOL_MIN=2                # Minimum pool size
DB_IDLE_TIMEOUT=30000        # Idle connection timeout (ms)
DB_CONNECTION_TIMEOUT=10000   # Connection timeout (ms)
DB_STATEMENT_TIMEOUT=30000    # Statement timeout (ms)
DB_QUERY_TIMEOUT=30000        # Query timeout (ms)
APP_NAME=pedro-backend        # Application name for debugging
```

## Installation

1. Install the new dependencies:
```bash
cd backend
npm install --legacy-peer-deps
```

2. Set up Redis locally (optional for development):
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

3. Configure environment variables in `.env`

## Integration Steps

### 1. Update your main `index.js`:

```javascript
import { initializeConnections } from './src/config/init.js';
import { createSessionMiddleware } from './src/middleware/session.js';
import healthRoutes from './src/routes/health.js';

// After environment validation
const connections = await initializeConnections();

// After creating Express app
if (connections.redis) {
  const sessionMiddleware = await createSessionMiddleware();
  app.use(sessionMiddleware);
}

// Add health routes
app.use('/api', healthRoutes);
```

### 2. Use Database Pool Instead of Supabase Client:

```javascript
import { query, transaction } from './src/config/database.js';

// Simple query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
const user = result.rows[0];

// Transaction
const appointment = await transaction(async (client) => {
  const appt = await client.query(
    'INSERT INTO appointments (...) VALUES (...) RETURNING *',
    [...]
  );
  await client.query('UPDATE patients SET ...', [...]);
  return appt.rows[0];
});
```

### 3. Use Redis Cache:

```javascript
import { cache } from './src/config/redis.js';

// Set cache
await cache.set('user:123', userData, 3600); // TTL in seconds

// Get cache
const cachedUser = await cache.get('user:123');

// Delete cache
await cache.del('user:123');

// Clear pattern
await cache.clearPattern('user:*');
```

### 4. Use Session Helpers:

```javascript
import { sessionHelpers } from './src/middleware/session.js';

// Set user authentication
await sessionHelpers.setAuthenticated(req, userId, { 
  email: user.email,
  role: user.role 
});

// Check authentication
if (sessionHelpers.isAuthenticated(req)) {
  // User is logged in
}

// Logout
await sessionHelpers.clearAuthentication(req);
```

## Production Deployment

### Redis Setup

1. **Redis Cloud** (recommended):
   - Sign up at https://redis.com/try-free/
   - Create a database
   - Copy connection details to environment variables

2. **Render Redis**:
   - Add Redis service in Render dashboard
   - Connect to your backend service
   - Environment variables auto-configured

3. **Self-hosted**:
   - Deploy Redis with persistent storage
   - Enable authentication
   - Configure SSL/TLS for production

### Database Connection Pool

The connection pool automatically:
- Parses Supabase URLs
- Manages connection lifecycle
- Handles connection failures
- Provides health monitoring

### Monitoring

Monitor these metrics:
- Redis connection status
- Database pool statistics (total, idle, waiting)
- Session creation/destruction rates
- Cache hit/miss ratios
- Query response times

## Troubleshooting

### Redis Connection Issues
```bash
# Test Redis connection
redis-cli -h $REDIS_HOST -p $REDIS_PORT ping

# Check Redis logs
redis-cli monitor
```

### Database Pool Issues
- Check `DATABASE_URL` or `SUPABASE_URL` format
- Verify `SUPABASE_DB_PASSWORD` is set
- Monitor pool statistics in `/api/health/detailed`
- Adjust pool size based on load

### Session Issues
- Verify `SESSION_SECRET` is set
- Check Redis connection in health endpoint
- Clear browser cookies if session format changes
- Monitor session creation in Redis

## Performance Tips

1. **Cache Strategy**:
   - Cache frequently accessed data
   - Use appropriate TTLs
   - Implement cache warming for critical data
   - Monitor cache memory usage

2. **Database Pool Tuning**:
   - Start with default settings
   - Monitor pool statistics
   - Increase max connections for high load
   - Use read replicas for scaling

3. **Session Optimization**:
   - Store minimal data in sessions
   - Use cache for user data instead
   - Enable session touch sparingly
   - Implement session cleanup jobs

## Security Considerations

1. **Redis Security**:
   - Always use authentication in production
   - Enable SSL/TLS for remote connections
   - Restrict network access
   - Regular security updates

2. **Session Security**:
   - Strong session secrets (32+ characters)
   - HTTPS-only cookies in production
   - Regular session regeneration
   - Implement session timeouts

3. **Database Security**:
   - Use connection pooling to limit connections
   - Implement query timeouts
   - Use prepared statements (already implemented)
   - Monitor for long-running queries