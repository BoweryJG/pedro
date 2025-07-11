#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { hashPassword } from '../src/middleware/auth.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateSecurePassword() {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
  let password = '';
  
  // Ensure we have at least one of each required character type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%^&*()_+=-'[Math.floor(Math.random() * 14)]; // Special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

async function setupAuth() {
  console.log('=== Pedro Dental Authentication Setup ===\n');
  
  try {
    // Check if we need to generate a JWT secret
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
      console.log('⚠️  WARNING: JWT_SECRET not properly configured!');
      console.log('Generated secure JWT secret:');
      console.log(`JWT_SECRET=${crypto.randomBytes(64).toString('hex')}`);
      console.log('\nAdd this to your .env file!\n');
    }
    
    // Check for existing admin user
    const { data: existingAdmin, error: checkError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', 'admin@gregpedromd.com')
      .single();
    
    if (existingAdmin) {
      console.log('✓ Default admin user already exists');
      console.log('  Email: admin@gregpedromd.com');
      console.log('  ⚠️  Make sure you have changed the default password!\n');
    } else {
      console.log('Creating default admin user...');
      
      // Generate secure password
      const adminPassword = await generateSecurePassword();
      const passwordHash = await hashPassword(adminPassword);
      
      // Create admin user
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert({
          email: 'admin@gregpedromd.com',
          password_hash: passwordHash,
          name: 'System Administrator',
          role: 'super_admin',
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating admin user:', createError);
        return;
      }
      
      console.log('\n✓ Admin user created successfully!');
      console.log('=====================================');
      console.log('Email: admin@gregpedromd.com');
      console.log(`Password: ${adminPassword}`);
      console.log('=====================================');
      console.log('⚠️  SAVE THIS PASSWORD - IT WILL NOT BE SHOWN AGAIN!\n');
    }
    
    // Prompt to create additional user
    const createAnother = await question('Would you like to create another user? (y/n): ');
    
    if (createAnother.toLowerCase() === 'y') {
      const email = await question('Email: ');
      const name = await question('Name: ');
      console.log('\nAvailable roles:');
      console.log('1. super_admin - Full system access');
      console.log('2. admin - Clinic administration');
      console.log('3. doctor - Medical professional');
      console.log('4. staff - Office staff');
      console.log('5. patient - Patient portal');
      
      const roleChoice = await question('Select role (1-5): ');
      const roles = ['super_admin', 'admin', 'doctor', 'staff', 'patient'];
      const role = roles[parseInt(roleChoice) - 1];
      
      if (!role) {
        console.log('Invalid role selection');
        return;
      }
      
      const password = await generateSecurePassword();
      const passwordHash = await hashPassword(password);
      
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: email.toLowerCase(),
          password_hash: passwordHash,
          name,
          role,
          is_active: true
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }
      
      console.log('\n✓ User created successfully!');
      console.log('=====================================');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log(`Role: ${role}`);
      console.log('=====================================\n');
    }
    
    // Create sample API key
    const createApiKey = await question('Would you like to create an API key for webhooks? (y/n): ');
    
    if (createApiKey.toLowerCase() === 'y') {
      const keyName = await question('API Key name (e.g., "Twilio Webhooks"): ');
      
      const apiKey = `sk_live_${crypto.randomBytes(32).toString('hex')}`;
      const keyHash = await hashPassword(apiKey);
      
      const { data: apiKeyRecord, error: keyError } = await supabase
        .from('api_keys')
        .insert({
          name: keyName,
          key_hash: keyHash,
          key_prefix: apiKey.substring(0, 12) + '...',
          permissions: ['webhook:receive'],
          rate_limit: 500,
          is_active: true
        })
        .select()
        .single();
      
      if (keyError) {
        console.error('Error creating API key:', keyError);
        return;
      }
      
      console.log('\n✓ API Key created successfully!');
      console.log('=====================================');
      console.log(`API Key: ${apiKey}`);
      console.log('=====================================');
      console.log('⚠️  SAVE THIS KEY - IT WILL NOT BE SHOWN AGAIN!');
      console.log('\nUse this key in webhook headers:');
      console.log('X-API-Key: ' + apiKey + '\n');
    }
    
    console.log('\n✅ Authentication setup complete!');
    console.log('\nNext steps:');
    console.log('1. Update your .env file with the JWT_SECRET if needed');
    console.log('2. Test login with: POST /api/auth/login');
    console.log('3. Change any default passwords immediately');
    console.log('4. Configure webhook endpoints with API keys\n');
    
  } catch (error) {
    console.error('Setup error:', error);
  } finally {
    rl.close();
  }
}

// Run setup
setupAuth();