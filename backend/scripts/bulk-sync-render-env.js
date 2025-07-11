#!/usr/bin/env node

import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env file
const envPath = join(dirname(__dirname), '.env');
const envConfig = dotenv.parse(readFileSync(envPath, 'utf8'));

// Get service name from command line or environment
const serviceName = process.argv[2] || process.env.RENDER_SERVICE_NAME;

if (!serviceName) {
  console.error('❌ Error: Please provide the Render service name');
  console.error('Usage: node scripts/bulk-sync-render-env.js <service-name>');
  console.error('Or set RENDER_SERVICE_NAME environment variable');
  process.exit(1);
}

console.log(`🚀 Syncing environment variables to Render service: ${serviceName}\n`);

// Add required variables that might not be in .env
const additionalVars = {
  NODE_ENV: 'production'
};

// Combine all variables
const allVars = { ...envConfig, ...additionalVars };

// Create env file content for bulk update
const envFileContent = Object.entries(allVars)
  .map(([key, value]) => `${key}="${value}"`)
  .join('\n');

// Write to temporary file
const tempFile = '/tmp/render-env-sync.env';
require('fs').writeFileSync(tempFile, envFileContent);

try {
  // Use render CLI to sync all variables at once
  console.log('📤 Uploading environment variables...\n');
  execSync(`render env set --service ${serviceName} --env-file ${tempFile}`, {
    stdio: 'inherit'
  });
  
  console.log('\n✅ Environment variables synced successfully!');
  console.log('🔄 Your service will redeploy automatically with the new variables.');
} catch (error) {
  console.error('❌ Error syncing environment variables:', error.message);
  process.exit(1);
} finally {
  // Clean up temp file
  try {
    require('fs').unlinkSync(tempFile);
  } catch (e) {
    // Ignore cleanup errors
  }
}