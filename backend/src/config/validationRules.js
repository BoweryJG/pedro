/**
 * Centralized validation rules configuration
 * Defines validation rules for all API endpoints
 */

export const validationRules = {
  // Common field rules
  common: {
    email: {
      type: 'email',
      maxLength: 255,
      normalize: true,
      lowercase: true
    },
    phone: {
      type: 'phone',
      formats: ['any'],
      sanitize: /[^\d+()-]/g
    },
    password: {
      minLength: 8,
      maxLength: 128,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'Password must contain uppercase, lowercase, number and special character'
    },
    uuid: {
      type: 'uuid',
      version: 4
    },
    url: {
      type: 'url',
      protocols: ['http', 'https'],
      requireProtocol: true
    },
    date: {
      type: 'iso8601',
      format: 'YYYY-MM-DD'
    },
    datetime: {
      type: 'iso8601',
      format: 'YYYY-MM-DDTHH:mm:ss.sssZ'
    }
  },

  // Rate limiting rules per endpoint
  rateLimits: {
    default: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100
    },
    strict: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5,
      skipSuccessfulRequests: true
    },
    api: {
      windowMs: 1 * 60 * 1000, // 1 minute
      max: 60
    }
  },

  // Content size limits
  contentLimits: {
    json: '10mb',
    urlencoded: '10mb',
    text: '1mb',
    file: '50mb'
  },

  // Sanitization patterns
  sanitization: {
    // SQL injection patterns
    sqlPatterns: [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|<script|javascript:|onerror|onload)\b)/gi,
      /(--|\/\*|\*\/|xp_|sp_|@@|@)/gi,
      /(\bor\b\s*\d+\s*=\s*\d+|\band\b\s*\d+\s*=\s*\d+)/gi,
      /(['";])\s*(or|and|union|select|insert|update|delete|drop)\s*/gi
    ],
    
    // NoSQL injection patterns
    noSqlOperators: ['$where', '$ne', '$gt', '$gte', '$lt', '$lte', '$regex', '$in', '$nin', '$exists'],
    
    // Path traversal patterns
    pathTraversalPatterns: [
      /\.\./g,
      /\.\.%2f/gi,
      /\.\.%5c/gi,
      /%2e%2e/gi,
      /\.\.\\/g
    ],
    
    // XSS patterns
    xssPatterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<img[^>]*onerror\s*=/gi
    ]
  },

  // Field length limits
  fieldLimits: {
    name: { min: 2, max: 100 },
    message: { min: 1, max: 1600 },
    description: { min: 0, max: 500 },
    url: { max: 2048 },
    transcription: { max: 65000 },
    systemPrompt: { min: 1, max: 5000 },
    chatMessage: { max: 10000 }
  },

  // Allowed values for enums
  allowedValues: {
    roles: ['super_admin', 'admin', 'doctor', 'staff', 'patient'],
    callStatus: ['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled'],
    messageStatus: ['queued', 'sending', 'sent', 'failed', 'delivered', 'undelivered', 'receiving', 'received'],
    direction: ['inbound', 'outbound-api', 'outbound-dial'],
    serviceTypes: ['01', '02', '03', '04', '05', '11', '12', '13', '14', '15', '21', '39'], // Healthcare service types
    httpMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },

  // Twilio-specific patterns
  twilioPatterns: {
    callSid: /^CA[0-9a-fA-F]{32}$/,
    messageSid: /^(SM|MM)[0-9a-fA-F]{32}$/,
    recordingSid: /^RE[0-9a-fA-F]{32}$/,
    accountSid: /^AC[0-9a-fA-F]{32}$/
  },

  // Custom validators
  customValidators: {
    // Validate US phone numbers specifically
    usPhoneNumber: (value) => {
      const cleaned = value.replace(/\D/g, '');
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1');
    },
    
    // Validate business hours format
    businessHours: (value) => {
      const pattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return pattern.test(value);
    },
    
    // Validate JSON string
    jsonString: (value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    },
    
    // Validate base64 string
    base64: (value) => {
      const pattern = /^[A-Za-z0-9+/]*={0,2}$/;
      return pattern.test(value) && value.length % 4 === 0;
    }
  },

  // Error messages
  errorMessages: {
    required: '{field} is required',
    invalid: '{field} is invalid',
    tooShort: '{field} must be at least {min} characters',
    tooLong: '{field} must not exceed {max} characters',
    pattern: '{field} does not match the required pattern',
    enum: '{field} must be one of: {values}',
    malicious: 'Potentially malicious input detected in {field}'
  }
};