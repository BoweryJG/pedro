import winston from 'winston';
import { v4 as uuidv4 } from 'uuid';

// Configure Winston logger for error tracking
const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'pedro-backend' },
  transports: [
    // Write all error logs to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Also log to console in development
if (process.env.NODE_ENV !== 'production') {
  errorLogger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Custom error classes
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, fields = {}) {
    super(message, 400);
    this.fields = fields;
    this.type = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.type = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.type = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.type = 'RateLimitError';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service, message) {
    super(`External service error: ${service} - ${message}`, 503);
    this.service = service;
    this.type = 'ExternalServiceError';
  }
}

// Error monitoring integration points
const errorMonitoringIntegrations = {
  // Sentry integration point
  sentry: (error, errorInfo) => {
    if (process.env.SENTRY_DSN) {
      // This would be imported from @sentry/node if Sentry is used
      // Sentry.captureException(error, {
      //   extra: errorInfo,
      //   tags: {
      //     errorId: errorInfo.errorId,
      //     environment: process.env.NODE_ENV
      //   }
      // });
    }
  },
  
  // Datadog integration point
  datadog: (error, errorInfo) => {
    if (process.env.DATADOG_API_KEY) {
      // This would use datadog-metrics or dd-trace
      // datadogMetrics.increment('errors', 1, [
      //   `error_type:${error.constructor.name}`,
      //   `status_code:${errorInfo.statusCode}`
      // ]);
    }
  },
  
  // New Relic integration point
  newRelic: (error, errorInfo) => {
    if (process.env.NEW_RELIC_LICENSE_KEY) {
      // This would use newrelic module
      // newrelic.noticeError(error, errorInfo);
    }
  },
  
  // Custom webhook integration point
  webhook: async (error, errorInfo) => {
    if (process.env.ERROR_WEBHOOK_URL) {
      try {
        await fetch(process.env.ERROR_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...errorInfo,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
          })
        });
      } catch (webhookError) {
        errorLogger.error('Failed to send error to webhook', webhookError);
      }
    }
  },
  
  // Supabase error logging integration
  supabase: async (error, errorInfo) => {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        );
        
        await supabase.from('error_logs').insert({
          error_id: errorInfo.errorId,
          message: error.message,
          stack: error.stack,
          status_code: errorInfo.statusCode,
          method: errorInfo.method,
          path: errorInfo.path,
          user_id: errorInfo.userId,
          ip_address: errorInfo.ipAddress,
          user_agent: errorInfo.userAgent,
          environment: process.env.NODE_ENV,
          metadata: errorInfo.metadata
        });
      } catch (dbError) {
        errorLogger.error('Failed to log error to Supabase', dbError);
      }
    }
  }
};

// Async error handler wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Request error logger middleware
export const requestErrorLogger = (err, req, res, next) => {
  const errorId = uuidv4();
  
  // Collect request information
  const errorInfo = {
    errorId,
    message: err.message,
    statusCode: err.statusCode || 500,
    method: req.method,
    path: req.path,
    query: req.query,
    body: req.body,
    headers: {
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip']
    },
    userId: req.user?.id || null,
    ipAddress: req.ip || req.connection?.remoteAddress,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    stack: err.stack,
    metadata: {
      isOperational: err.isOperational || false,
      type: err.type || err.constructor.name
    }
  };
  
  // Log error with Winston
  errorLogger.error({
    ...errorInfo,
    error: err
  });
  
  // Send to monitoring integrations
  Object.values(errorMonitoringIntegrations).forEach(integration => {
    try {
      integration(err, errorInfo);
    } catch (integrationError) {
      errorLogger.error('Error monitoring integration failed', integrationError);
    }
  });
  
  // Attach error ID to request for response
  req.errorId = errorId;
  next(err);
};

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  // If response was already sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorId = req.errorId || uuidv4();
  
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errorResponse = {
    error: {
      message,
      errorId,
      timestamp: new Date().toISOString()
    }
  };
  
  // Handle different error types
  if (err.name === 'ValidationError' || err.type === 'ValidationError') {
    statusCode = 400;
    errorResponse.error.type = 'ValidationError';
    if (err.fields) {
      errorResponse.error.fields = err.fields;
    }
  } else if (err.name === 'CastError' || err.name === 'TypeError') {
    statusCode = 400;
    message = 'Invalid request data';
    errorResponse.error.message = message;
    errorResponse.error.type = 'BadRequest';
  } else if (err.name === 'UnauthorizedError' || err.type === 'AuthenticationError') {
    statusCode = 401;
    errorResponse.error.type = 'AuthenticationError';
  } else if (err.type === 'AuthorizationError') {
    statusCode = 403;
    errorResponse.error.type = 'AuthorizationError';
  } else if (err.type === 'NotFoundError') {
    statusCode = 404;
    errorResponse.error.type = 'NotFoundError';
  } else if (err.code === 11000 || err.type === 'ConflictError') {
    statusCode = 409;
    message = 'Resource already exists';
    errorResponse.error.message = message;
    errorResponse.error.type = 'ConflictError';
  } else if (err.type === 'RateLimitError') {
    statusCode = 429;
    errorResponse.error.type = 'RateLimitError';
    errorResponse.error.retryAfter = err.retryAfter;
  } else if (err.type === 'ExternalServiceError') {
    statusCode = 503;
    errorResponse.error.type = 'ExternalServiceError';
    errorResponse.error.service = err.service;
  }
  
  // Add development-specific error details
  if (isDevelopment) {
    errorResponse.error.stack = err.stack;
    errorResponse.error.details = {
      originalError: err.name,
      code: err.code,
      ...err
    };
  } else {
    // Sanitize error messages in production
    if (statusCode === 500) {
      errorResponse.error.message = 'An unexpected error occurred. Please try again later.';
    }
    
    // Add helpful information for production errors
    errorResponse.error.help = {
      documentation: 'https://api.gregpedromd.com/docs/errors',
      support: 'support@gregpedromd.com'
    };
  }
  
  // Add correlation ID for tracking
  res.setHeader('X-Error-ID', errorId);
  
  // Send error response
  res.status(statusCode).json(errorResponse);
};

// 404 handler for undefined routes
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  next(error);
};

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  errorLogger.error('Unhandled Rejection', {
    reason,
    promise,
    timestamp: new Date().toISOString()
  });
  
  // In production, you might want to gracefully shutdown
  if (process.env.NODE_ENV === 'production') {
    // Give time for error to be logged
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  errorLogger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  
  // Gracefully shutdown in production
  if (process.env.NODE_ENV === 'production') {
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  asyncHandler,
  requestErrorLogger,
  globalErrorHandler,
  notFoundHandler,
  errorLogger
};