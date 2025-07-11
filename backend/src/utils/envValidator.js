import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Define required and optional environment variables
const ENV_CONFIG = {
  required: {
    // Supabase Configuration
    SUPABASE_URL: {
      description: 'Supabase project URL',
      example: 'https://your-project.supabase.co',
      validate: (value) => {
        // Accept any HTTPS URL that could be a Supabase URL
        // This includes .supabase.co domains and custom domains
        return value.startsWith('https://') && value.length > 10;
      }
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      description: 'Supabase service role key for backend operations',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      validate: (value) => value.length > 50
    },

    // AI Services
    ANTHROPIC_API_KEY: {
      description: 'Anthropic Claude API key',
      example: 'sk-ant-api03-xxxxxxxxxxxxx',
      validate: (value) => value.length > 20
    },
    OPENROUTER_API_KEY: {
      description: 'OpenRouter API key for AI chat',
      example: 'sk-or-v1-xxxxxxxxxxxxx',
      validate: (value) => value.startsWith('sk-or-')
    },

    // Twilio Configuration
    TWILIO_ACCOUNT_SID: {
      description: 'Twilio account SID',
      example: 'ACxxxxxxxxxxxxx',
      validate: (value) => value.startsWith('AC') && value.length === 34
    },
    TWILIO_AUTH_TOKEN: {
      description: 'Twilio authentication token',
      example: 'your_twilio_auth_token',
      validate: (value) => value.length >= 32
    },
    TWILIO_PHONE_NUMBER: {
      description: 'Twilio phone number for voice/SMS',
      example: '+1234567890',
      validate: (value) => /^\+1\d{10}$/.test(value)
    },

    // Server Configuration
    NODE_ENV: {
      description: 'Node environment (development/production)',
      example: 'production',
      validate: (value) => ['development', 'production', 'test'].includes(value)
    }
  },

  optional: {
    // Server Port
    PORT: {
      description: 'Server port',
      example: '3001',
      default: '3001',
      validate: (value) => !isNaN(parseInt(value)) && parseInt(value) > 0
    },

    // Facebook/Instagram API (optional but needed for Instagram DM features)
    FACEBOOK_APP_ID: {
      description: 'Facebook App ID for Instagram integration',
      example: '123456789012345',
      validate: (value) => /^\d+$/.test(value)
    },
    FACEBOOK_APP_SECRET: {
      description: 'Facebook App Secret',
      example: 'your_facebook_app_secret',
      validate: (value) => value.length === 32
    },
    FACEBOOK_PAGE_ACCESS_TOKEN: {
      description: 'Facebook Page Access Token',
      example: 'EAAxxxxxxxxxxxxx',
      validate: (value) => value.startsWith('EAA')
    },
    FACEBOOK_WEBHOOK_VERIFY_TOKEN: {
      description: 'Custom webhook verification token',
      example: 'your_custom_webhook_verify_token',
      validate: (value) => value.length >= 10
    },
    INSTAGRAM_PAGE_ID: {
      description: 'Instagram Business Page ID',
      example: '17841444444444444',
      validate: (value) => /^\d+$/.test(value)
    },

    // Voice Services
    HUGGINGFACE_TOKEN: {
      description: 'Hugging Face API token for voice AI',
      example: 'hf_xxxxxxxxxxxxx',
      validate: (value) => value.startsWith('hf_')
    },
    ELEVENLABS_API_KEY: {
      description: 'ElevenLabs API key for text-to-speech',
      example: 'your_elevenlabs_api_key',
      validate: (value) => value.length > 20
    },
    DEEPGRAM_API_KEY: {
      description: 'Deepgram API key for speech-to-text',
      example: 'your_deepgram_api_key',
      validate: (value) => value.length > 20
    },

    // Practice Information
    PRACTICE_NAME: {
      description: 'Your practice name',
      example: 'Dr. Pedro Dental Practice',
      default: 'Dr. Pedro Dental Practice'
    },
    PRACTICE_PHONE: {
      description: 'Practice phone number',
      example: '(718) 555-0123',
      default: '(718) 555-0123'
    },
    PRACTICE_EMAIL: {
      description: 'Practice email address',
      example: 'info@gregpedromd.com',
      default: 'info@gregpedromd.com'
    },

    // Security Settings
    ALLOWED_ORIGINS: {
      description: 'Comma-separated list of allowed CORS origins',
      example: 'https://gregpedromd.com,https://www.gregpedromd.com',
      validate: (value) => value.split(',').every(origin => origin.startsWith('http'))
    },
    SESSION_SECRET: {
      description: 'Session secret for security',
      example: 'generate_a_random_string_here',
      validate: (value) => value.length >= 32
    },
    JWT_SECRET: {
      description: 'JWT secret for token generation',
      example: 'generate_another_random_string_here',
      validate: (value) => value.length >= 32
    },

    // Webhook Configuration
    WEBHOOK_BASE_URL: {
      description: 'Base URL for webhooks',
      example: 'https://your-backend-domain.com',
      validate: (value) => value.startsWith('http')
    },
    ENABLE_TRANSCRIPTION: {
      description: 'Enable call transcription',
      example: 'true',
      default: 'true',
      validate: (value) => ['true', 'false'].includes(value.toLowerCase())
    },

    // Additional Transcription Services
    OPENAI_API_KEY: {
      description: 'OpenAI API key for Whisper transcription',
      example: 'sk-xxxxxxxxxxxxx',
      validate: (value) => value.startsWith('sk-')
    },
    GOOGLE_APPLICATION_CREDENTIALS: {
      description: 'Path to Google Cloud credentials JSON',
      example: '/path/to/google-credentials.json',
      validate: (value) => value.endsWith('.json')
    },
    ASSEMBLY_AI_API_KEY: {
      description: 'AssemblyAI API key for transcription',
      example: 'your_assembly_ai_key',
      validate: (value) => value.length > 20
    },

    // Patient Financing APIs
    CHERRY_API_KEY: {
      description: 'Cherry financing API key',
      example: 'your_cherry_api_key_here',
      validate: (value) => value.length > 10
    },
    CHERRY_PRACTICE_ID: {
      description: 'Cherry practice ID',
      example: 'your_cherry_practice_id_here',
      validate: (value) => value.length > 5
    },
    SUNBIT_API_KEY: {
      description: 'Sunbit financing API key',
      example: 'your_sunbit_api_key_here',
      validate: (value) => value.length > 10
    },
    SUNBIT_MERCHANT_ID: {
      description: 'Sunbit merchant ID',
      example: 'your_sunbit_merchant_id_here',
      validate: (value) => value.length > 5
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
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      errors.push({
        variable: key,
        message: `Missing required environment variable: ${key}`,
        description: config.description,
        example: config.example
      });
    } else if (config.validate && !config.validate(value)) {
      errors.push({
        variable: key,
        message: `Invalid value for ${key}`,
        description: config.description,
        example: config.example,
        currentValue: value.substring(0, 10) + '...' // Show only first 10 chars for security
      });
    } else {
      validatedConfig[key] = value;
    }
  }

  // Check optional variables
  for (const [key, config] of Object.entries(ENV_CONFIG.optional)) {
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      if (config.default) {
        validatedConfig[key] = config.default;
        warnings.push({
          variable: key,
          message: `Using default value for ${key}: ${config.default}`,
          description: config.description
        });
      } else {
        warnings.push({
          variable: key,
          message: `Optional variable ${key} not set`,
          description: config.description,
          example: config.example
        });
      }
    } else if (config.validate && !config.validate(value)) {
      warnings.push({
        variable: key,
        message: `Invalid value for optional variable ${key}`,
        description: config.description,
        example: config.example,
        currentValue: value.substring(0, 10) + '...'
      });
    } else {
      validatedConfig[key] = value;
    }
  }

  // Check for .env file existence
  const envPath = join(dirname(dirname(__dirname)), '.env');
  if (!existsSync(envPath) && process.env.NODE_ENV !== 'production') {
    warnings.push({
      message: 'No .env file found. Make sure to copy .env.example to .env and fill in your values.',
      path: envPath
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    config: validatedConfig
  };
}

// Format validation results for console output
export function formatValidationResults(results) {
  const { valid, errors, warnings } = results;
  let output = '\n=== Environment Variable Validation ===\n\n';

  if (valid) {
    output += '✅ All required environment variables are properly configured!\n\n';
  } else {
    output += '❌ Environment validation failed!\n\n';
  }

  if (errors.length > 0) {
    output += '🚨 ERRORS (must be fixed):\n';
    output += '─'.repeat(50) + '\n';
    errors.forEach((error, index) => {
      output += `\n${index + 1}. ${error.variable}\n`;
      output += `   Error: ${error.message}\n`;
      output += `   Description: ${error.description}\n`;
      output += `   Example: ${error.example}\n`;
      if (error.currentValue) {
        output += `   Current value: ${error.currentValue}\n`;
      }
    });
    output += '\n';
  }

  if (warnings.length > 0) {
    output += '⚠️  WARNINGS (optional but recommended):\n';
    output += '─'.repeat(50) + '\n';
    warnings.forEach((warning, index) => {
      output += `\n${index + 1}. ${warning.variable || 'General'}\n`;
      output += `   Warning: ${warning.message}\n`;
      if (warning.description) {
        output += `   Description: ${warning.description}\n`;
      }
      if (warning.example) {
        output += `   Example: ${warning.example}\n`;
      }
      if (warning.path) {
        output += `   Path: ${warning.path}\n`;
      }
    });
    output += '\n';
  }

  if (!valid) {
    output += '\n📝 Quick Setup Guide:\n';
    output += '─'.repeat(50) + '\n';
    output += '1. Copy backend/.env.example to backend/.env\n';
    output += '2. Fill in all required values\n';
    output += '3. Restart the server\n\n';
    output += 'For detailed setup instructions, see the README.md file.\n';
  }

  return output;
}

// Export configuration schema for documentation
export function getEnvironmentSchema() {
  return {
    required: Object.entries(ENV_CONFIG.required).map(([key, config]) => ({
      variable: key,
      description: config.description,
      example: config.example
    })),
    optional: Object.entries(ENV_CONFIG.optional).map(([key, config]) => ({
      variable: key,
      description: config.description,
      example: config.example,
      default: config.default
    }))
  };
}

// Validate and exit if invalid (for use in server startup)
export function validateAndExit() {
  const results = validateEnvironment();
  console.log(formatValidationResults(results));
  
  if (!results.valid) {
    console.error('\n💥 Server startup aborted due to missing environment variables.\n');
    process.exit(1);
  }
  
  return results.config;
}