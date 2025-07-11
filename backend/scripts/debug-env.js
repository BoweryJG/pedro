#!/usr/bin/env node

console.log('🔍 Debugging Environment Variables\n');
console.log('Current NODE_ENV:', process.env.NODE_ENV);
console.log('Current working directory:', process.cwd());
console.log('\n📋 Required Environment Variables Status:\n');

const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'OPENROUTER_API_KEY',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_PHONE_NUMBER',
  'NODE_ENV'
];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Show first and last 4 characters for security
    const masked = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '***hidden***';
    console.log(`✅ ${varName}: ${masked}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n📋 All Environment Variables:\n');
Object.keys(process.env).sort().forEach(key => {
  if (key.includes('PASSWORD') || key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN')) {
    console.log(`${key}: ***hidden***`);
  } else {
    console.log(`${key}: ${process.env[key]}`);
  }
});