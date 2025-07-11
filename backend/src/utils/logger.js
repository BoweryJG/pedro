import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray'
};

// Tell winston about our colors
winston.addColors(colors);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../../logs');

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  levels,
  format: fileFormat,
  defaultMeta: { 
    service: 'pedro-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Write all logs with importance level of 'error' and below to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    // Write all logs with importance level of 'info' and below to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  // Handle exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  // Handle rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  }));
} else {
  // In production, still log to console but with a simpler format
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }));
}

// Create a stream object with a 'write' function that will be used by morgan
logger.stream = {
  write: (message) => {
    // Use the 'http' log level so the output will be picked up by both transports
    logger.http(message.trim());
  }
};

// Helper functions for structured logging
logger.logRequest = (req, additionalInfo = {}) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    ...additionalInfo
  });
};

logger.logResponse = (req, res, additionalInfo = {}) => {
  logger.info('HTTP Response', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: res.responseTime,
    userId: req.user?.id,
    ...additionalInfo
  });
};

logger.logDatabaseQuery = (query, params, duration) => {
  logger.debug('Database Query', {
    query,
    params,
    duration,
    timestamp: new Date().toISOString()
  });
};

logger.logExternalAPICall = (service, endpoint, method, duration, status) => {
  logger.info('External API Call', {
    service,
    endpoint,
    method,
    duration,
    status,
    timestamp: new Date().toISOString()
  });
};

logger.logSecurityEvent = (event, userId, details) => {
  logger.warn('Security Event', {
    event,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

logger.logBusinessEvent = (event, userId, details) => {
  logger.info('Business Event', {
    event,
    userId,
    details,
    timestamp: new Date().toISOString()
  });
};

export default logger;