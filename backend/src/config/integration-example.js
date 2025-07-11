/**
 * Integration Example for Redis Sessions and Database Connection Pooling
 * 
 * This file demonstrates how to integrate the new Redis and database pooling
 * infrastructure into your main application (index.js)
 */

import express from 'express';
import { initializeConnections } from './init.js';
import { createSessionMiddleware } from '../middleware/session.js';
import { query, transaction } from './database.js';
import { cache } from './redis.js';
import healthRoutes from '../routes/health.js';
import logger from '../utils/logger.js';

// Example of initializing the application with new infrastructure
export async function initializeApp() {
  const app = express();
  
  try {
    // 1. Initialize connections (Redis + Database)
    logger.info('Initializing connections...');
    const connections = await initializeConnections();
    
    if (!connections.database) {
      throw new Error('Database connection is required');
    }
    
    // 2. Set up session middleware with Redis
    if (connections.redis) {
      const sessionMiddleware = await createSessionMiddleware();
      app.use(sessionMiddleware);
      logger.info('Session middleware configured with Redis store');
    } else {
      logger.warn('Redis not available, sessions will use memory store');
    }
    
    // 3. Add health check routes
    app.use('/api', healthRoutes);
    
    // 4. Example route using database pool
    app.get('/api/users/:id', async (req, res) => {
      try {
        // Check cache first
        const cacheKey = `user:${req.params.id}`;
        const cached = await cache.get(cacheKey);
        
        if (cached) {
          logger.debug(`Cache hit for user ${req.params.id}`);
          return res.json({ source: 'cache', data: cached });
        }
        
        // Query database using pool
        const result = await query(
          'SELECT * FROM users WHERE id = $1',
          [req.params.id]
        );
        
        if (result.rows.length > 0) {
          // Cache the result
          await cache.set(cacheKey, result.rows[0], 300); // 5 minutes
          res.json({ source: 'database', data: result.rows[0] });
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      } catch (error) {
        logger.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
    
    // 5. Example route using transactions
    app.post('/api/appointments', async (req, res) => {
      try {
        const result = await transaction(async (client) => {
          // Insert appointment
          const appointmentResult = await client.query(
            `INSERT INTO appointments (patient_id, date, time, service) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.body.patientId, req.body.date, req.body.time, req.body.service]
          );
          
          // Update patient last visit
          await client.query(
            'UPDATE patients SET last_visit = $1 WHERE id = $2',
            [new Date(), req.body.patientId]
          );
          
          return appointmentResult.rows[0];
        });
        
        // Invalidate related cache
        await cache.del(`patient:${req.body.patientId}`);
        
        res.status(201).json(result);
      } catch (error) {
        logger.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
      }
    });
    
    return app;
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    throw error;
  }
}

// Example of how to update your main index.js file:
/*
// Add these imports at the top of index.js:
import { initializeConnections } from './src/config/init.js';
import { createSessionMiddleware } from './src/middleware/session.js';
import healthRoutes from './src/routes/health.js';

// After validating environment variables, add:
// Initialize connections
const connections = await initializeConnections();

// After creating the Express app, add:
// Set up session middleware
if (connections.redis) {
  const sessionMiddleware = await createSessionMiddleware();
  app.use(sessionMiddleware);
}

// Add health routes
app.use('/api', healthRoutes);

// The graceful shutdown is already handled by the init.js module
*/

// Example of using cache in existing routes:
export async function cacheExample(key, fetchFunction, ttl = 3600) {
  // Try to get from cache
  const cached = await cache.get(key);
  if (cached) {
    return { source: 'cache', data: cached };
  }
  
  // Fetch fresh data
  const data = await fetchFunction();
  
  // Store in cache
  await cache.set(key, data, ttl);
  
  return { source: 'fresh', data };
}

// Example of migrating from Supabase client to connection pool:
/*
// Before (using Supabase client):
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

// After (using connection pool):
const result = await query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
const data = result.rows[0];
*/