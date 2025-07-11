#!/usr/bin/env node

import { spawn } from 'child_process';
import { validateEnvironment, formatValidationResults } from '../src/utils/envValidator.js';

console.log('🚀 Starting Pedro Backend Server...\n');

// Run environment validation
const results = validateEnvironment();
console.log(formatValidationResults(results));

if (!results.valid) {
  console.error('💥 Cannot start server due to environment configuration errors.\n');
  
  // In production on Render, provide specific guidance
  if (process.env.RENDER) {
    console.error('🔧 You are running on Render. Please add the missing environment variables in your Render dashboard:\n');
    console.error('   1. Go to https://dashboard.render.com/');
    console.error('   2. Select your service');
    console.error('   3. Go to the "Environment" tab');
    console.error('   4. Add the missing variables listed above\n');
  }
  
  console.error('Please fix the errors above and try again.\n');
  process.exit(1);
}

// If validation passed, start the server
console.log('🎯 Starting server with validated configuration...\n');

const serverProcess = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: { ...process.env, ...results.config }
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