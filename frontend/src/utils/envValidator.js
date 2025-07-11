// Frontend Environment Variable Validator
// Note: Vite exposes env variables prefixed with VITE_ to the client

const ENV_CONFIG = {
  required: {
    // Backend API URL is required for API calls
    VITE_API_URL: {
      description: 'Backend API URL',
      example: 'http://localhost:3001',
      default: 'http://localhost:3001',
      validate: (value) => value.startsWith('http')
    }
  },
  optional: {
    // Patient Financing APIs (Optional - for production)
    VITE_SUNBIT_API_KEY: {
      description: 'Sunbit API key for patient financing',
      example: 'your_sunbit_api_key_here',
      validate: (value) => value.length > 10
    },
    VITE_CHERRY_API_KEY: {
      description: 'Cherry API key for patient financing',
      example: 'your_cherry_api_key_here',
      validate: (value) => value.length > 10
    },
    VITE_ZUUB_API_KEY: {
      description: 'Zuub API key for insurance verification',
      example: 'your_zuub_api_key_here',
      validate: (value) => value.length > 10
    },
    VITE_PVERIFY_API_KEY: {
      description: 'pVerify API key for insurance verification',
      example: 'your_pverify_api_key_here',
      validate: (value) => value.length > 10
    },

    // Analytics
    VITE_GA_MEASUREMENT_ID: {
      description: 'Google Analytics Measurement ID',
      example: 'G-XXXXXXXXXX',
      validate: (value) => /^G-[A-Z0-9]+$/.test(value)
    },

    // Feature Flags
    VITE_ENABLE_VOICE_CHAT: {
      description: 'Enable voice chat feature',
      example: 'true',
      default: 'true',
      validate: (value) => ['true', 'false'].includes(value.toLowerCase())
    },
    VITE_ENABLE_FINANCING: {
      description: 'Enable financing options',
      example: 'true',
      default: 'true',
      validate: (value) => ['true', 'false'].includes(value.toLowerCase())
    },
    VITE_ENABLE_INSURANCE: {
      description: 'Enable insurance verification',
      example: 'true',
      default: 'true',
      validate: (value) => ['true', 'false'].includes(value.toLowerCase())
    }
  }
};

// Validation function
export function validateEnvironment() {
  const errors = [];
  const warnings = [];
  const validatedConfig = {};

  // Check required variables
  for (const [key, config] of Object.entries(ENV_CONFIG.required)) {
    const value = import.meta.env[key];
    
    if (!value || value.trim() === '') {
      if (config.default) {
        validatedConfig[key] = config.default;
        warnings.push({
          variable: key,
          message: `Using default value for ${key}: ${config.default}`,
          description: config.description
        });
      } else {
        errors.push({
          variable: key,
          message: `Missing required environment variable: ${key}`,
          description: config.description,
          example: config.example
        });
      }
    } else if (config.validate && !config.validate(value)) {
      errors.push({
        variable: key,
        message: `Invalid value for ${key}`,
        description: config.description,
        example: config.example,
        currentValue: value.substring(0, 20) + '...'
      });
    } else {
      validatedConfig[key] = value;
    }
  }

  // Check optional variables
  for (const [key, config] of Object.entries(ENV_CONFIG.optional)) {
    const value = import.meta.env[key];
    
    if (!value || value.trim() === '') {
      if (config.default) {
        validatedConfig[key] = config.default;
      }
      // Don't warn about optional variables in frontend
    } else if (config.validate && !config.validate(value)) {
      warnings.push({
        variable: key,
        message: `Invalid value for optional variable ${key}`,
        description: config.description,
        example: config.example
      });
    } else {
      validatedConfig[key] = value;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config: validatedConfig
  };
}

// Initialize environment validation
export function initializeEnvironment() {
  const results = validateEnvironment();
  
  if (!results.valid && import.meta.env.DEV) {
    console.error('❌ Frontend Environment Validation Failed!');
    console.error('─'.repeat(50));
    
    results.errors.forEach((error, index) => {
      console.error(`${index + 1}. ${error.variable}`);
      console.error(`   ${error.message}`);
      console.error(`   Example: ${error.example}`);
    });
    
    console.error('\n📝 Quick Fix:');
    console.error('1. Copy frontend/.env.example to frontend/.env');
    console.error('2. Fill in the required values');
    console.error('3. Restart the development server\n');
  }
  
  if (results.warnings.length > 0 && import.meta.env.DEV) {
    console.warn('⚠️  Frontend Environment Warnings:');
    results.warnings.forEach((warning) => {
      console.warn(`- ${warning.variable}: ${warning.message}`);
    });
  }
  
  // Return validated config for use in the app
  return results.config;
}

// Get API configuration with fallbacks
export function getApiConfig() {
  const config = initializeEnvironment();
  
  return {
    apiUrl: config.VITE_API_URL || 'http://localhost:3001',
    enableVoiceChat: config.VITE_ENABLE_VOICE_CHAT !== 'false',
    enableFinancing: config.VITE_ENABLE_FINANCING !== 'false',
    enableInsurance: config.VITE_ENABLE_INSURANCE !== 'false',
    gaId: config.VITE_GA_MEASUREMENT_ID,
    financing: {
      sunbit: config.VITE_SUNBIT_API_KEY,
      cherry: config.VITE_CHERRY_API_KEY
    },
    insurance: {
      zuub: config.VITE_ZUUB_API_KEY,
      pverify: config.VITE_PVERIFY_API_KEY
    }
  };
}

// Check if a feature is enabled
export function isFeatureEnabled(feature) {
  const config = initializeEnvironment();
  
  switch (feature) {
    case 'voice':
      return config.VITE_ENABLE_VOICE_CHAT !== 'false';
    case 'financing':
      return config.VITE_ENABLE_FINANCING !== 'false';
    case 'insurance':
      return config.VITE_ENABLE_INSURANCE !== 'false';
    default:
      return true;
  }
}