#!/usr/bin/env node

import { spawn } from 'child_process';
import { validateEnvironment, formatValidationResults } from '../src/utils/envValidator.js';

console.log('🚀 Starting Pedro Backend Server...\n');

// Run environment validation
const results = validateEnvironment();
console.log(formatValidationResults(results));

if (!results.valid) {
  console.error('💥 Cannot start server due to environment configuration errors.\n');
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