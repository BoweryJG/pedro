#!/usr/bin/env node

import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
config();

// Frontend environment configuration
const ENV_CONFIG = {
  required: {
    VITE_API_URL: {
      description: 'Backend API URL',
      example: 'http://localhost:3001/api',
      default: 'http://localhost:3001/api',
      validate: (value) => value.startsWith('http')
    }
  },
  optional: {
    VITE_SUNBIT_API_KEY: {
      description: 'Sunbit API key for patient financing',
      example: 'your_sunbit_api_key_here'
    },
    VITE_CHERRY_API_KEY: {
      description: 'Cherry API key for patient financing',
      example: 'your_cherry_api_key_here'
    },
    VITE_ZUUB_API_KEY: {
      description: 'Zuub API key for insurance verification',
      example: 'your_zuub_api_key_here'
    },
    VITE_PVERIFY_API_KEY: {
      description: 'pVerify API key for insurance verification',
      example: 'your_pverify_api_key_here'
    },
    VITE_GA_MEASUREMENT_ID: {
      description: 'Google Analytics Measurement ID',
      example: 'G-XXXXXXXXXX'
    }
  }
};

function validateEnvironment() {
  const errors = [];
  const warnings = [];
  
  // Check for .env file
  const envPath = join(__dirname, '.env');
  if (!existsSync(envPath) && process.env.NODE_ENV !== 'production') {
    warnings.push({
      message: 'No .env file found. Using defaults or environment variables.',
      path: envPath
    });
  }
  
  // Check required variables
  for (const [key, config] of Object.entries(ENV_CONFIG.required)) {
    const value = process.env[key];
    
    if (!value || value.trim() === '') {
      if (config.default) {
        warnings.push({
          variable: key,
          message: `Using default value: ${config.default}`,
          description: config.description
        });
      } else {
        errors.push({
          variable: key,
          message: `Missing required environment variable`,
          description: config.description,
          example: config.example
        });
      }
    } else if (config.validate && !config.validate(value)) {
      errors.push({
        variable: key,
        message: `Invalid value`,
        description: config.description,
        example: config.example
      });
    }
  }
  
  // Check optional variables
  for (const [key, config] of Object.entries(ENV_CONFIG.optional)) {
    const value = process.env[key];
    
    if (!value && process.env.NODE_ENV === 'production') {
      warnings.push({
        variable: key,
        message: `Optional variable not set (may affect features)`,
        description: config.description
      });
    }
  }
  
  return { errors, warnings };
}

// Run validation
const { errors, warnings } = validateEnvironment();

console.log('\n=== Frontend Environment Validation ===\n');

if (errors.length === 0) {
  console.log('✅ All required environment variables are configured!\n');
} else {
  console.log('❌ Environment validation failed!\n');
  console.log('ERRORS:');
  errors.forEach((error, index) => {
    console.log(`\n${index + 1}. ${error.variable}`);
    console.log(`   ${error.message}`);
    console.log(`   Description: ${error.description}`);
    console.log(`   Example: ${error.example}`);
  });
}

if (warnings.length > 0) {
  console.log('\nWARNINGS:');
  warnings.forEach((warning, index) => {
    console.log(`\n${index + 1}. ${warning.variable || 'General'}`);
    console.log(`   ${warning.message}`);
    if (warning.description) {
      console.log(`   Description: ${warning.description}`);
    }
  });
}

if (errors.length > 0) {
  console.log('\n📝 To fix:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Fill in the required values');
  console.log('3. Run this script again\n');
  process.exit(1);
}

console.log('\n✨ Frontend environment is properly configured!\n');
process.exit(0);