import logger from '../utils/logger.js';

// Middleware to track response time
export const responseTimeTracker = (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.end to calculate response time
  const originalEnd = res.end;
  res.end = function(...args) {
    res.responseTime = Date.now() - startTime;
    originalEnd.apply(res, args);
  };
  
  next();
};

// Middleware to log requests
export const requestLogger = (req, res, next) => {
  // Log incoming request
  logger.logRequest(req, {
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined,
    query: req.query
  });
  
  // Log response when it's finished
  res.on('finish', () => {
    logger.logResponse(req, res, {
      responseTime: res.responseTime
    });
  });
  
  next();
};

// Middleware to sanitize sensitive data from logs
export const sanitizeRequestData = (req, res, next) => {
  // List of sensitive fields to exclude from logs
  const sensitiveFields = [
    'password',
    'token',
    'authorization',
    'api_key',
    'apiKey',
    'secret',
    'credit_card',
    'creditCard',
    'ssn',
    'socialSecurityNumber'
  ];
  
  // Function to recursively sanitize object
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field.toLowerCase()))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          sanitized[key] = sanitize(obj[key]);
        } else {
          sanitized[key] = obj[key];
        }
      }
    }
    
    return sanitized;
  };
  
  // Store original values
  req._originalBody = req.body;
  req._originalQuery = req.query;
  req._originalHeaders = req.headers;
  
  // Create sanitized versions for logging
  req.sanitizedBody = sanitize(req.body);
  req.sanitizedQuery = sanitize(req.query);
  req.sanitizedHeaders = sanitize(req.headers);
  
  next();
};

export default {
  responseTimeTracker,
  requestLogger,
  sanitizeRequestData
};