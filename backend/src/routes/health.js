import express from 'express';
import { getHealthStatus } from '../config/init.js';
import { getPoolStats } from '../config/database.js';
import { cache } from '../config/redis.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Basic health check
router.get('/', async (req, res) => {
  try {
    const health = await getHealthStatus();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Detailed health check (protected endpoint)
router.get('/detailed', async (req, res) => {
  try {
    // Get basic health status
    const health = await getHealthStatus();
    
    // Add database pool stats
    health.services.database.pool = getPoolStats();
    
    // Test Redis operations if available
    if (health.services.redis?.healthy) {
      try {
        const redisTestKey = 'health:test';
        const redisTestValue = { timestamp: new Date().toISOString() };
        const redisWriteSuccess = await cache.set(redisTestKey, redisTestValue, 60);
        const redisReadValue = await cache.get(redisTestKey);
        
        health.services.redis.operations = {
          write: redisWriteSuccess,
          read: redisReadValue !== null,
          match: JSON.stringify(redisReadValue) === JSON.stringify(redisTestValue)
        };
      } catch (error) {
        health.services.redis.operations = {
          write: false,
          read: false,
          match: false,
          error: error.message
        };
      }
    }
    
    // Add environment info
    health.environment = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV || 'development'
    };
    
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Detailed health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Liveness probe (for Kubernetes/container orchestration)
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  });
});

// Readiness probe (checks if service is ready to handle requests)
router.get('/ready', async (req, res) => {
  try {
    const health = await getHealthStatus();
    
    // Service is ready only if all critical services are healthy
    const isReady = health.services.database?.healthy === true;
    
    if (isReady) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        services: health.services
      });
    }
  } catch (error) {
    logger.error('Readiness check error:', error);
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;