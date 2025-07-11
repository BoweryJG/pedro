import { body, param, query, validationResult, matchedData } from 'express-validator';

/**
 * Comprehensive Input Validation and Sanitization Middleware
 * Provides protection against:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - NoSQL Injection
 * - Command Injection
 * - Path Traversal
 * - Invalid data types
 * - Malformed inputs
 */

// Common sanitization chains
const sanitizeString = (field) => 
  field
    .trim()
    .escape() // Escapes HTML entities to prevent XSS
    .stripLow() // Removes ASCII control characters
    .blacklist('`<>'); // Additional XSS protection

const sanitizeEmail = (field) =>
  field
    .trim()
    .normalizeEmail()
    .isEmail().withMessage('Invalid email format')
    .isLength({ max: 255 }).withMessage('Email too long');

const sanitizePhone = (field) =>
  field
    .trim()
    .isMobilePhone('any').withMessage('Invalid phone number')
    .customSanitizer(value => value.replace(/[^\d+()-]/g, '')); // Keep only valid phone chars

const sanitizeUrl = (field) =>
  field
    .trim()
    .isURL({ 
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    }).withMessage('Invalid URL format');

const sanitizeId = (field) =>
  field
    .trim()
    .isUUID().withMessage('Invalid ID format')
    .escape();

const sanitizeNumber = (field, min = 0, max = Number.MAX_SAFE_INTEGER) =>
  field
    .isNumeric().withMessage('Must be a number')
    .toInt()
    .isInt({ min, max }).withMessage(`Number must be between ${min} and ${max}`);

const sanitizeBoolean = (field) =>
  field
    .isBoolean().withMessage('Must be a boolean')
    .toBoolean();

const sanitizeDate = (field) =>
  field
    .isISO8601().withMessage('Invalid date format')
    .toDate();

// Prevent SQL Injection in string fields
const preventSQLInjection = (field) =>
  field.custom(value => {
    if (typeof value !== 'string') return true;
    
    // Check for common SQL injection patterns
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|<script|javascript:|onerror|onload)\b)/gi,
      /(--|\/\*|\*\/|xp_|sp_|@@|@)/gi,
      /(\bor\b\s*\d+\s*=\s*\d+|\band\b\s*\d+\s*=\s*\d+)/gi,
      /(['";])\s*(or|and|union|select|insert|update|delete|drop)\s*/gi
    ];
    
    for (const pattern of sqlPatterns) {
      if (pattern.test(value)) {
        throw new Error('Potentially malicious input detected');
      }
    }
    return true;
  });

// Prevent NoSQL Injection
const preventNoSQLInjection = (field) =>
  field.custom(value => {
    if (typeof value === 'object' && value !== null) {
      // Check for MongoDB operators
      const dangerousKeys = ['$where', '$ne', '$gt', '$gte', '$lt', '$lte', '$regex'];
      const checkObject = (obj) => {
        for (const key in obj) {
          if (dangerousKeys.includes(key)) {
            throw new Error('NoSQL injection attempt detected');
          }
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            checkObject(obj[key]);
          }
        }
      };
      checkObject(value);
    }
    return true;
  });

// Prevent Path Traversal
const preventPathTraversal = (field) =>
  field.custom(value => {
    if (typeof value !== 'string') return true;
    
    const pathTraversalPatterns = [
      /\.\./g,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
      /%2e%2e/gi,
      /\.\.\\/g
    ];
    
    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(value)) {
        throw new Error('Path traversal attempt detected');
      }
    }
    return true;
  });

// Validation error handler middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  // Extract only validated data
  req.validatedData = matchedData(req, { includeOptionals: false });
  next();
};

// Validation rules for different endpoints

// Authentication validations
export const validateLogin = [
  body('email')
    .exists().withMessage('Email is required')
    .custom(value => sanitizeEmail(body(value)))
    .custom(value => preventSQLInjection(body(value))),
  body('password')
    .exists().withMessage('Password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Invalid password length')
    .custom(value => preventSQLInjection(body(value))),
  handleValidationErrors
];

export const validateRegister = [
  body('email')
    .custom(value => sanitizeEmail(body(value)))
    .custom(value => preventSQLInjection(body(value))),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('name')
    .exists().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .custom(value => sanitizeString(body(value)))
    .custom(value => preventSQLInjection(body(value))),
  body('role')
    .exists().withMessage('Role is required')
    .isIn(['super_admin', 'admin', 'doctor', 'staff', 'patient'])
    .withMessage('Invalid role'),
  body('clinic_id')
    .optional()
    .custom(value => sanitizeId(body(value))),
  handleValidationErrors
];

export const validateChangePassword = [
  body('currentPassword')
    .exists().withMessage('Current password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Invalid password length'),
  body('newPassword')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from current password'),
  handleValidationErrors
];

// Chat endpoint validation
export const validateChat = [
  body('messages')
    .exists().withMessage('Messages are required')
    .isArray().withMessage('Messages must be an array')
    .custom(value => {
      if (!Array.isArray(value)) return false;
      for (const msg of value) {
        if (!msg.role || !msg.content) {
          throw new Error('Each message must have role and content');
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          throw new Error('Invalid message role');
        }
        if (typeof msg.content !== 'string' || msg.content.length > 10000) {
          throw new Error('Message content must be a string under 10000 characters');
        }
      }
      return true;
    })
    .custom(value => preventNoSQLInjection(body(value))),
  body('systemPrompt')
    .exists().withMessage('System prompt is required')
    .isString().withMessage('System prompt must be a string')
    .isLength({ min: 1, max: 5000 }).withMessage('System prompt must be 1-5000 characters')
    .custom(value => preventSQLInjection(body(value))),
  handleValidationErrors
];

// Voice configuration validation
export const validateVoiceConfig = [
  body('voiceId')
    .exists().withMessage('Voice ID is required')
    .isString().withMessage('Voice ID must be a string')
    .isLength({ max: 100 }).withMessage('Voice ID too long')
    .custom(value => sanitizeString(body(value))),
  body('agentName')
    .exists().withMessage('Agent name is required')
    .isString().withMessage('Agent name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Agent name must be 2-50 characters')
    .custom(value => sanitizeString(body(value))),
  body('agentRole')
    .exists().withMessage('Agent role is required')
    .isString().withMessage('Agent role must be a string')
    .isLength({ max: 100 }).withMessage('Agent role too long')
    .custom(value => sanitizeString(body(value))),
  body('personality')
    .optional()
    .isString().withMessage('Personality must be a string')
    .isLength({ max: 500 }).withMessage('Personality description too long')
    .custom(value => sanitizeString(body(value))),
  handleValidationErrors
];

// Financing validations
export const validateSunbitFinancing = [
  body('applicant')
    .exists().withMessage('Applicant information is required')
    .isObject().withMessage('Applicant must be an object')
    .custom(value => preventNoSQLInjection(body(value))),
  body('applicant.firstName')
    .exists().withMessage('First name is required')
    .custom(value => sanitizeString(body(value))),
  body('applicant.lastName')
    .exists().withMessage('Last name is required')
    .custom(value => sanitizeString(body(value))),
  body('applicant.email')
    .custom(value => sanitizeEmail(body(value))),
  body('applicant.phone')
    .custom(value => sanitizePhone(body(value))),
  body('transaction')
    .exists().withMessage('Transaction information is required')
    .isObject().withMessage('Transaction must be an object'),
  body('transaction.amount')
    .custom(value => sanitizeNumber(body(value), 1, 100000)),
  handleValidationErrors
];

export const validateCherryFinancing = [
  body('patient')
    .exists().withMessage('Patient information is required')
    .isObject().withMessage('Patient must be an object')
    .custom(value => preventNoSQLInjection(body(value))),
  body('practice')
    .optional()
    .isObject().withMessage('Practice must be an object'),
  body('amount')
    .custom(value => sanitizeNumber(body(value), 1, 100000)),
  handleValidationErrors
];

// Insurance validations
export const validateInsuranceVerification = [
  body('subscriber')
    .exists().withMessage('Subscriber information is required')
    .isObject().withMessage('Subscriber must be an object')
    .custom(value => preventNoSQLInjection(body(value))),
  body('provider')
    .exists().withMessage('Provider information is required')
    .isObject().withMessage('Provider must be an object'),
  body('payerId')
    .exists().withMessage('Payer ID is required')
    .isString().withMessage('Payer ID must be a string')
    .isLength({ max: 50 }).withMessage('Payer ID too long')
    .custom(value => sanitizeString(body(value))),
  body('serviceType')
    .exists().withMessage('Service type is required')
    .isString().withMessage('Service type must be a string')
    .custom(value => sanitizeString(body(value))),
  handleValidationErrors
];

// SMS validations
export const validateSendSMS = [
  body('to')
    .exists().withMessage('Recipient phone number is required')
    .custom(value => sanitizePhone(body(value))),
  body('message')
    .exists().withMessage('Message is required')
    .isString().withMessage('Message must be a string')
    .isLength({ min: 1, max: 1600 }).withMessage('Message must be 1-1600 characters')
    .custom(value => sanitizeString(body(value)))
    .custom(value => preventSQLInjection(body(value))),
  handleValidationErrors
];

// Webhook validations
export const validateWebhookSMS = [
  body('from')
    .exists().withMessage('From number is required')
    .custom(value => sanitizePhone(body(value))),
  body('message')
    .exists().withMessage('Message is required')
    .isString().withMessage('Message must be a string')
    .isLength({ max: 5000 }).withMessage('Message too long')
    .custom(value => sanitizeString(body(value))),
  body('id')
    .optional()
    .isString().withMessage('ID must be a string')
    .custom(value => sanitizeString(body(value))),
  handleValidationErrors
];

export const validateConfigureWebhook = [
  body('webhookUrl')
    .exists().withMessage('Webhook URL is required')
    .custom(value => sanitizeUrl(body(value)))
    .custom(value => preventPathTraversal(body(value))),
  handleValidationErrors
];

// Query parameter validations
export const validatePaginationQuery = [
  query('limit')
    .optional()
    .custom(value => sanitizeNumber(query(value), 1, 1000)),
  query('offset')
    .optional()
    .custom(value => sanitizeNumber(query(value), 0)),
  query('page')
    .optional()
    .custom(value => sanitizeNumber(query(value), 1)),
  handleValidationErrors
];

export const validateDateRangeQuery = [
  query('startDate')
    .optional()
    .custom(value => sanitizeDate(query(value))),
  query('endDate')
    .optional()
    .custom(value => sanitizeDate(query(value)))
    .custom((value, { req }) => {
      if (req.query.startDate && value) {
        const start = new Date(req.query.startDate);
        const end = new Date(value);
        if (end < start) {
          throw new Error('End date must be after start date');
        }
      }
      return true;
    }),
  query('dateFrom')
    .optional()
    .custom(value => sanitizeDate(query(value))),
  query('dateTo')
    .optional()
    .custom(value => sanitizeDate(query(value)))
    .custom((value, { req }) => {
      if (req.query.dateFrom && value) {
        const start = new Date(req.query.dateFrom);
        const end = new Date(value);
        if (end < start) {
          throw new Error('Date to must be after date from');
        }
      }
      return true;
    }),
  handleValidationErrors
];

// ID parameter validations
export const validateIdParam = [
  param('id')
    .custom(value => sanitizeId(param(value))),
  handleValidationErrors
];

export const validateCallSidParam = [
  param('callSid')
    .exists().withMessage('Call SID is required')
    .isString().withMessage('Call SID must be a string')
    .matches(/^CA[0-9a-fA-F]{32}$/).withMessage('Invalid Call SID format')
    .custom(value => sanitizeString(param(value))),
  handleValidationErrors
];

export const validateRecordingIdParam = [
  param('recordingId')
    .exists().withMessage('Recording ID is required')
    .isString().withMessage('Recording ID must be a string')
    .matches(/^RE[0-9a-fA-F]{32}$/).withMessage('Invalid Recording ID format')
    .custom(value => sanitizeString(param(value))),
  handleValidationErrors
];

// Call history validations
export const validateCallHistoryQuery = [
  query('callSid')
    .optional()
    .matches(/^CA[0-9a-fA-F]{32}$/).withMessage('Invalid Call SID format')
    .custom(value => sanitizeString(query(value))),
  ...validateDateRangeQuery
];

// Transcript validations
export const validateTranscriptQuery = [
  query('limit')
    .optional()
    .custom(value => sanitizeNumber(query(value), 1, 100)),
  query('client_id')
    .optional()
    .custom(value => sanitizeId(query(value))),
  handleValidationErrors
];

// TTS validation
export const validateTTSRequest = [
  body('text')
    .optional()
    .isString().withMessage('Text must be a string')
    .isLength({ min: 1, max: 5000 }).withMessage('Text must be 1-5000 characters')
    .custom(value => sanitizeString(body(value)))
    .custom(value => preventSQLInjection(body(value))),
  handleValidationErrors
];

// Generic object validation for preventing injection in JSON bodies
export const validateGenericObject = (fieldName) => [
  body(fieldName)
    .exists().withMessage(`${fieldName} is required`)
    .isObject().withMessage(`${fieldName} must be an object`)
    .custom(value => preventNoSQLInjection(body(value)))
    .custom(value => {
      // Additional check for nested SQL injection attempts
      const checkNestedStrings = (obj) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string') {
            preventSQLInjection(body(obj[key]));
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            checkNestedStrings(obj[key]);
          }
        }
      };
      checkNestedStrings(value);
      return true;
    }),
  handleValidationErrors
];

// Custom middleware for sanitizing all string inputs globally
export const globalSanitizer = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      // Remove null bytes
      value = value.replace(/\0/g, '');
      // Trim whitespace
      value = value.trim();
      // Remove non-printable characters
      value = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    } else if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    } else if (value !== null && typeof value === 'object') {
      const sanitized = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  
  next();
};

// Export all validations
export default {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validateChangePassword,
  validateChat,
  validateVoiceConfig,
  validateSunbitFinancing,
  validateCherryFinancing,
  validateInsuranceVerification,
  validateSendSMS,
  validateWebhookSMS,
  validateConfigureWebhook,
  validatePaginationQuery,
  validateDateRangeQuery,
  validateIdParam,
  validateCallSidParam,
  validateRecordingIdParam,
  validateCallHistoryQuery,
  validateTranscriptQuery,
  validateTTSRequest,
  validateGenericObject,
  globalSanitizer
};