import { createClient } from 'redis';
import logger from '../utils/logger.js';

// Redis configuration with production-ready settings
const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1', // Use IPv4 instead of localhost
    port: parseInt(process.env.REDIS_PORT) || 6379,
    family: 4, // Force IPv4
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis: Max reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      // Exponential backoff: wait 2^retries * 100ms, max 30 seconds
      const delay = Math.min(Math.pow(2, retries) * 100, 30000);
      logger.info(`Redis: Reconnecting in ${delay}ms (attempt ${retries + 1})`);
      return delay;
    },
    connectTimeout: 10000,
    commandTimeout: 5000,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  username: process.env.REDIS_USERNAME || undefined,
  database: parseInt(process.env.REDIS_DB) || 0,
  // Enable auto-pipelining for better performance
  enableAutoPipelining: true,
  // Connection pool settings
  poolSize: 10,
  // Enable offline queue
  enableOfflineQueue: true,
  lazyConnect: true,
};

// Create Redis client
const redisClient = createClient(redisConfig);

// Error handling
redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis: Connecting...');
});

redisClient.on('ready', () => {
  logger.info('Redis: Connection established and ready');
});

redisClient.on('end', () => {
  logger.warn('Redis: Connection closed');
});

redisClient.on('reconnecting', () => {
  logger.info('Redis: Reconnecting...');
});

// Connection management functions
export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      logger.info('Redis: Successfully connected');
      
      // Test the connection
      await redisClient.ping();
      logger.info('Redis: Connection test successful');
    }
    return redisClient;
  } catch (error) {
    logger.error('Redis: Connection failed:', error);
    throw error;
  }
};

export const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info('Redis: Disconnected gracefully');
    }
  } catch (error) {
    logger.error('Redis: Error during disconnect:', error);
    await redisClient.disconnect();
  }
};

// Health check function
export const checkRedisHealth = async () => {
  try {
    if (!redisClient.isOpen) {
      return { healthy: false, message: 'Redis client not connected' };
    }
    
    const startTime = Date.now();
    await redisClient.ping();
    const responseTime = Date.now() - startTime;
    
    return {
      healthy: true,
      message: 'Redis is healthy',
      responseTime: `${responseTime}ms`
    };
  } catch (error) {
    return {
      healthy: false,
      message: 'Redis health check failed',
      error: error.message
    };
  }
};

// Session store configuration for connect-redis
export const getSessionStoreConfig = () => ({
  client: redisClient,
  prefix: 'sess:',
  ttl: 86400, // 24 hours in seconds
  disableTouch: false,
  // Serialization handled by connect-redis by default
});

// Cache helper functions
export const cache = {
  // Get value with automatic JSON parsing
  get: async (key) => {
    try {
      const value = await redisClient.get(key);
      if (value) {
        try {
          return JSON.parse(value);
        } catch {
          return value; // Return as-is if not JSON
        }
      }
      return null;
    } catch (error) {
      logger.error(`Redis cache get error for key ${key}:`, error);
      return null;
    }
  },

  // Set value with automatic JSON stringification
  set: async (key, value, ttlSeconds = 3600) => {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds) {
        await redisClient.setEx(key, ttlSeconds, serialized);
      } else {
        await redisClient.set(key, serialized);
      }
      return true;
    } catch (error) {
      logger.error(`Redis cache set error for key ${key}:`, error);
      return false;
    }
  },

  // Delete key
  del: async (key) => {
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      logger.error(`Redis cache delete error for key ${key}:`, error);
      return false;
    }
  },

  // Clear all keys with a pattern
  clearPattern: async (pattern) => {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return keys.length;
    } catch (error) {
      logger.error(`Redis cache clear pattern error for ${pattern}:`, error);
      return 0;
    }
  },

  // Check if key exists
  exists: async (key) => {
    try {
      return await redisClient.exists(key) === 1;
    } catch (error) {
      logger.error(`Redis cache exists error for key ${key}:`, error);
      return false;
    }
  },

  // Get remaining TTL for a key
  ttl: async (key) => {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`Redis cache TTL error for key ${key}:`, error);
      return -1;
    }
  }
};

export default redisClient;