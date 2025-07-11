import session from 'express-session';
import RedisStore from 'connect-redis';
import { connectRedis, getSessionStoreConfig } from '../config/redis.js';
import logger from '../utils/logger.js';

// Session configuration
const sessionConfig = {
  name: process.env.SESSION_NAME || 'pedro.sid',
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'your-session-secret-key',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset expiry on activity
  proxy: process.env.NODE_ENV === 'production', // Trust proxy in production
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/'
  }
};

// Create session middleware with Redis store
export const createSessionMiddleware = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    logger.info('Session: Redis connection established');
    
    // Create Redis store
    const redisStore = new RedisStore(getSessionStoreConfig());
    
    // Add store to session config
    sessionConfig.store = redisStore;
    
    // Create session middleware
    const sessionMiddleware = session(sessionConfig);
    
    logger.info('Session: Middleware configured with Redis store');
    
    return sessionMiddleware;
  } catch (error) {
    logger.error('Session: Failed to create middleware with Redis:', error);
    
    // Fallback to memory store if Redis fails
    logger.warn('Session: Falling back to memory store');
    return session(sessionConfig);
  }
};

// Session helper functions
export const sessionHelpers = {
  // Regenerate session ID (for security after login)
  regenerate: (req) => {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          logger.error('Session: Regeneration failed:', err);
          reject(err);
        } else {
          logger.debug('Session: ID regenerated successfully');
          resolve();
        }
      });
    });
  },

  // Save session data
  save: (req) => {
    return new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          logger.error('Session: Save failed:', err);
          reject(err);
        } else {
          logger.debug('Session: Data saved successfully');
          resolve();
        }
      });
    });
  },

  // Destroy session
  destroy: (req) => {
    return new Promise((resolve, reject) => {
      const sessionId = req.sessionID;
      req.session.destroy((err) => {
        if (err) {
          logger.error('Session: Destruction failed:', err);
          reject(err);
        } else {
          logger.debug(`Session: ${sessionId} destroyed successfully`);
          // Clear cookie
          req.res.clearCookie(sessionConfig.name);
          resolve();
        }
      });
    });
  },

  // Touch session (update expiry)
  touch: (req) => {
    return new Promise((resolve, reject) => {
      req.session.touch((err) => {
        if (err) {
          logger.error('Session: Touch failed:', err);
          reject(err);
        } else {
          logger.debug('Session: Expiry updated');
          resolve();
        }
      });
    });
  },

  // Get session data
  get: (req, key) => {
    return req.session[key];
  },

  // Set session data
  set: async (req, key, value) => {
    req.session[key] = value;
    await sessionHelpers.save(req);
  },

  // Remove session data
  remove: async (req, key) => {
    delete req.session[key];
    await sessionHelpers.save(req);
  },

  // Check if session is authenticated
  isAuthenticated: (req) => {
    return req.session && req.session.userId && req.session.authenticated === true;
  },

  // Set user authentication
  setAuthenticated: async (req, userId, userData = {}) => {
    await sessionHelpers.regenerate(req);
    req.session.userId = userId;
    req.session.authenticated = true;
    req.session.user = userData;
    req.session.loginTime = new Date().toISOString();
    await sessionHelpers.save(req);
  },

  // Clear authentication
  clearAuthentication: async (req) => {
    await sessionHelpers.destroy(req);
  }
};

// Session cleanup middleware (for logout)
export const sessionCleanup = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      // Log the logout
      logger.info(`Session: User ${req.session.userId} logging out`);
      
      // Clear session
      await sessionHelpers.clearAuthentication(req);
      
      // Clear any other auth cookies
      res.clearCookie('token');
      res.clearCookie('refreshToken');
    } catch (error) {
      logger.error('Session: Cleanup error:', error);
    }
  }
  next();
};

// Session security middleware
export const sessionSecurity = (req, res, next) => {
  // Regenerate session ID periodically for security
  if (req.session && req.session.userId) {
    const loginTime = new Date(req.session.loginTime || 0);
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    // Regenerate session ID every 6 hours
    if (hoursSinceLogin > 6) {
      sessionHelpers.regenerate(req)
        .then(() => {
          req.session.loginTime = now.toISOString();
          return sessionHelpers.save(req);
        })
        .then(() => next())
        .catch(next);
      return;
    }
  }
  next();
};

// Session validation middleware
export const validateSession = (req, res, next) => {
  if (!req.session) {
    logger.error('Session: No session object found on request');
    return res.status(500).json({ error: 'Session not initialized' });
  }
  next();
};

// Session activity tracking
export const trackSessionActivity = (req, res, next) => {
  if (req.session && req.session.userId) {
    req.session.lastActivity = new Date().toISOString();
    req.session.activityCount = (req.session.activityCount || 0) + 1;
  }
  next();
};

export default createSessionMiddleware;