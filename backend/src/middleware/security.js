/**
 * Additional security middleware for comprehensive protection
 */

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { validationRules } from '../config/validationRules.js';

// Enhanced security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openrouter.ai", "https://api.anthropic.com", "wss:", "https://api.elevenlabs.io"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
      reportUri: '/api/security/csp-report',
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
  frameguard: { action: 'deny' },
  dnsPrefetchControl: { allow: false }
});

// Request size limiting middleware
export const requestSizeLimiter = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request entity too large',
      code: 'PAYLOAD_TOO_LARGE',
      maxSize: `${maxSize / 1024 / 1024}MB`
    });
  }
  
  next();
};

// IP-based rate limiting with different tiers
export const createRateLimiter = (options = {}) => {
  const defaults = validationRules.rateLimits.default;
  
  return rateLimit({
    windowMs: options.windowMs || defaults.windowMs,
    max: options.max || defaults.max,
    message: options.message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: res.getHeader('Retry-After')
      });
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health' || req.path === '/';
    }
  });
};

// Specific rate limiters
export const authRateLimiter = createRateLimiter(validationRules.rateLimits.auth);
export const strictRateLimiter = createRateLimiter(validationRules.rateLimits.strict);
export const apiRateLimiter = createRateLimiter(validationRules.rateLimits.api);

// Request ID middleware for tracking
export const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
};

// Security logging middleware
export const securityLogger = (req, res, next) => {
  // Log security-relevant events
  const securityEvent = {
    timestamp: new Date().toISOString(),
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    userId: req.user?.id,
    securityHeaders: {
      hasAuth: !!req.headers.authorization,
      hasApiKey: !!req.headers['x-api-key'],
      contentType: req.headers['content-type']
    }
  };

  // Log suspicious patterns
  if (req.path.includes('..') || req.path.includes('//')) {
    console.warn('Security: Suspicious path detected', securityEvent);
  }

  // Log large payloads
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 5 * 1024 * 1024) { // 5MB
    console.warn('Security: Large payload detected', { ...securityEvent, contentLength });
  }

  next();
};

// Input normalization middleware
export const normalizeInput = (req, res, next) => {
  // Normalize common fields
  if (req.body) {
    // Normalize email addresses
    if (req.body.email && typeof req.body.email === 'string') {
      req.body.email = req.body.email.toLowerCase().trim();
    }
    
    // Normalize phone numbers
    if (req.body.phone && typeof req.body.phone === 'string') {
      req.body.phone = req.body.phone.replace(/\s+/g, '');
    }
    
    // Trim all string fields
    const trimStrings = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        } else if (obj[key] !== null && typeof obj[key] === 'object') {
          trimStrings(obj[key]);
        }
      }
    };
    
    trimStrings(req.body);
  }
  
  next();
};

// MongoDB query sanitization for Supabase/PostgreSQL JSON queries
export const sanitizeQuery = (req, res, next) => {
  const sanitizeObject = (obj) => {
    const cleaned = {};
    
    for (const key in obj) {
      // Remove keys starting with $ (MongoDB operators)
      if (key.startsWith('$')) {
        console.warn(`Security: Removed potentially malicious key: ${key}`);
        continue;
      }
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        cleaned[key] = sanitizeObject(obj[key]);
      } else {
        cleaned[key] = obj[key];
      }
    }
    
    return cleaned;
  };
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

// Content type validation
export const validateContentType = (allowedTypes = ['application/json']) => {
  return (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.headers['content-type'];
      
      if (!contentType) {
        return res.status(400).json({
          error: 'Content-Type header is required',
          code: 'MISSING_CONTENT_TYPE'
        });
      }
      
      const baseContentType = contentType.split(';')[0].trim();
      
      if (!allowedTypes.includes(baseContentType)) {
        return res.status(415).json({
          error: 'Unsupported media type',
          code: 'UNSUPPORTED_MEDIA_TYPE',
          allowedTypes
        });
      }
    }
    
    next();
  };
};

// CSRF protection for state-changing operations
export const csrfProtection = (req, res, next) => {
  // Skip CSRF for webhook endpoints
  if (req.path.includes('/webhook') || req.path.includes('/voice/')) {
    return next();
  }
  
  // For state-changing operations, verify origin
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.headers.origin || req.headers.referer;
    
    // Use same domains as CORS
    const productionDomains = [
      'https://gregpedromd.com',
      'https://www.gregpedromd.com',
      'https://tmj.gregpedromd.com',
      'https://implants.gregpedromd.com',
      'https://robotic.gregpedromd.com',
      'https://medspa.gregpedromd.com',
      'https://aboutface.gregpedromd.com',
      'https://gregpedromd.netlify.app',
      'https://pedro-dental.netlify.app',
      'https://pedrotmj.netlify.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || productionDomains;
    
    if (origin && !allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return res.status(403).json({
        error: 'Cross-site request forbidden',
        code: 'CSRF_VIOLATION'
      });
    }
  }
  
  next();
};

// Export all middleware
export default {
  securityHeaders,
  requestSizeLimiter,
  createRateLimiter,
  authRateLimiter,
  strictRateLimiter,
  apiRateLimiter,
  requestIdMiddleware,
  securityLogger,
  normalizeInput,
  sanitizeQuery,
  validateContentType,
  csrfProtection
};