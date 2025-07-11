#!/usr/bin/env node

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('🚀 Starting Pedro Backend Server in Production Mode...\n');

// In production, load .env.production if it exists (for local overrides)
const prodEnvPath = join(dirname(__dirname), '.env.production');
if (existsSync(prodEnvPath)) {
  console.log('📄 Loading .env.production file...\n');
  dotenv.config({ path: prodEnvPath });
}

// Display current environment info
console.log('🌍 Environment Information:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   PORT: ${process.env.PORT || '3001'}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Node Version: ${process.version}`);
console.log(`   Working Directory: ${process.cwd()}\n`);

// Check critical environment variables
const criticalVars = {
  'SUPABASE_URL': 'Supabase URL',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Key',
  'TWILIO_ACCOUNT_SID': 'Twilio Account SID',
  'TWILIO_AUTH_TOKEN': 'Twilio Auth Token',
  'TWILIO_PHONE_NUMBER': 'Twilio Phone Number'
};

console.log('🔍 Checking Critical Environment Variables:');
let missingVars = [];

for (const [varName, description] of Object.entries(criticalVars)) {
  if (process.env[varName]) {
    console.log(`   ✅ ${description} is set`);
  } else {
    console.log(`   ❌ ${description} is NOT set`);
    missingVars.push(varName);
  }
}

// Check AI service availability
console.log('\n🤖 Checking AI Service Configuration:');
const aiServices = {
  'ANTHROPIC_API_KEY': 'Anthropic (Claude)',
  'OPENROUTER_API_KEY': 'OpenRouter',
  'OPENAI_API_KEY': 'OpenAI'
};

let hasAIService = false;
for (const [varName, service] of Object.entries(aiServices)) {
  if (process.env[varName]) {
    console.log(`   ✅ ${service} is configured`);
    hasAIService = true;
  } else {
    console.log(`   ⚠️  ${service} is not configured`);
  }
}

if (!hasAIService) {
  console.log('\n⚠️  WARNING: No AI service is configured. AI features will not work.');
  missingVars.push('At least one AI service (ANTHROPIC_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY)');
}

// If critical variables are missing, provide guidance
if (missingVars.length > 0) {
  console.log('\n❌ Missing critical environment variables!');
  console.log('\n📋 Please add these variables in your Render dashboard:');
  console.log('   1. Go to your Render dashboard');
  console.log('   2. Select your service');
  console.log('   3. Go to the "Environment" tab');
  console.log('   4. Add the following variables:\n');
  
  missingVars.forEach(varName => {
    console.log(`      - ${varName}`);
  });
  
  console.log('\n💡 For local testing, you can create a .env file in the backend directory');
  console.log('   with these variables. See .env.example for the complete list.\n');
  
  // In production, we'll try to start anyway but with limited functionality
  console.log('⚠️  Starting server with limited functionality...\n');
}

// Start the server regardless (it may have fallback behavior)
console.log('🎯 Starting server...\n');

const serverProcess = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  serverProcess.kill('SIGTERM');
});

serverProcess.on('exit', (code) => {
  process.exit(code);
});