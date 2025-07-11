import { connectRedis, checkRedisHealth, disconnectRedis } from './redis.js';
import { connectDatabase, checkDatabaseHealth, disconnectDatabase } from './database.js';
import logger from '../utils/logger.js';

// Initialize all connections
export const initializeConnections = async () => {
  const results = {
    redis: false,
    database: false,
    errors: []
  };

  // Initialize Redis
  try {
    // Skip Redis initialization if not configured
    if (!process.env.REDIS_HOST && process.env.NODE_ENV === 'production') {
      logger.info('Redis not configured, skipping initialization');
      results.redis = false;
    } else {
      logger.info('Initializing Redis connection...');
      await connectRedis();
      const redisHealth = await checkRedisHealth();
      if (redisHealth.healthy) {
        results.redis = true;
        logger.info('Redis initialized successfully');
      } else {
        throw new Error(redisHealth.message);
      }
    }
  } catch (error) {
    logger.error('Failed to initialize Redis:', error);
    results.errors.push({ service: 'redis', error: error.message });
    
    // Redis is optional, continue with startup
    if (process.env.REDIS_REQUIRED === 'true') {
      throw new Error('Redis is required but failed to initialize');
    }
  }

  // Initialize Database
  try {
    logger.info('Initializing database connection pool...');
    await connectDatabase();
    const dbHealth = await checkDatabaseHealth();
    if (dbHealth.healthy) {
      results.database = true;
      logger.info('Database connection pool initialized successfully');
    } else {
      throw new Error(dbHealth.message);
    }
  } catch (error) {
    logger.error('Failed to initialize database:', error);
    results.errors.push({ service: 'database', error: error.message });
    
    // Database is critical, throw error
    throw new Error('Database is required but failed to initialize');
  }

  return results;
};

// Graceful shutdown handler
export const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}, starting graceful shutdown...`);
  
  const shutdownTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timeout, forcing exit');
    process.exit(1);
  }, 30000); // 30 second timeout

  try {
    // Close Redis connection
    logger.info('Closing Redis connection...');
    await disconnectRedis();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis:', error);
  }

  try {
    // Close database pool
    logger.info('Closing database connection pool...');
    await disconnectDatabase();
    logger.info('Database connection pool closed');
  } catch (error) {
    logger.error('Error closing database:', error);
  }

  clearTimeout(shutdownTimeout);
  logger.info('Graceful shutdown completed');
  process.exit(0);
};

// Health check endpoint data
export const getHealthStatus = async () => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };

  // Check Redis (optional - not required for operation)
  try {
    const redisHealth = await checkRedisHealth();
    health.services.redis = redisHealth;
    // Don't degrade health status for Redis since it's not used
  } catch (error) {
    health.services.redis = {
      healthy: false,
      message: 'Redis not configured (optional)',
      error: error.message
    };
    // Don't change health status - Redis is optional
  }

  // Check Database
  try {
    const dbHealth = await checkDatabaseHealth();
    health.services.database = dbHealth;
    if (!dbHealth.healthy) {
      health.status = 'unhealthy';
    }
  } catch (error) {
    health.services.database = {
      healthy: false,
      message: 'Database health check failed',
      error: error.message
    };
    health.status = 'unhealthy';
  }

  // Add memory usage
  const memUsage = process.memoryUsage();
  health.services.memory = {
    healthy: true,
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`
  };

  // Add uptime
  health.uptime = `${Math.round(process.uptime())} seconds`;

  return health;
};

// Register shutdown handlers
const registerShutdownHandlers = () => {
  // Handle different termination signals
  ['SIGTERM', 'SIGINT', 'SIGUSR2'].forEach(signal => {
    process.on(signal, () => gracefulShutdown(signal));
  });

  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });
};

// Auto-register handlers on module load
registerShutdownHandlers();

export default {
  initializeConnections,
  gracefulShutdown,
  getHealthStatus
};