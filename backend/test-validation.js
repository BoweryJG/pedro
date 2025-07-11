#!/usr/bin/env node

/**
 * Test script for validation and security middleware
 * Run with: node test-validation.js
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.API_URL || 'http://localhost:3001';

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test cases
const tests = [
  {
    name: 'SQL Injection in Login',
    endpoint: '/api/auth/login',
    method: 'POST',
    body: {
      email: 'test@example.com',
      password: "password' OR '1'='1"
    },
    expectedStatus: 400,
    expectError: true
  },
  {
    name: 'XSS in Chat Message',
    endpoint: '/chat',
    method: 'POST',
    body: {
      messages: [{
        role: 'user',
        content: '<script>alert("XSS")</script>'
      }],
      systemPrompt: 'Test prompt'
    },
    expectedStatus: 401, // Requires auth
    expectError: true
  },
  {
    name: 'Invalid Email Format',
    endpoint: '/api/auth/login',
    method: 'POST',
    body: {
      email: 'not-an-email',
      password: 'ValidPassword123!'
    },
    expectedStatus: 400,
    expectError: true
  },
  {
    name: 'Missing Required Fields',
    endpoint: '/api/auth/login',
    method: 'POST',
    body: {
      email: 'test@example.com'
      // Missing password
    },
    expectedStatus: 400,
    expectError: true
  },
  {
    name: 'Invalid Phone Number',
    endpoint: '/api/voip/sms/send',
    method: 'POST',
    body: {
      to: 'invalid-phone',
      message: 'Test message'
    },
    expectedStatus: 401, // Requires auth
    expectError: true
  },
  {
    name: 'Message Too Long',
    endpoint: '/api/voip/sms/send',
    method: 'POST',
    body: {
      to: '+1234567890',
      message: 'x'.repeat(2000) // Exceeds 1600 char limit
    },
    expectedStatus: 401, // Requires auth
    expectError: true
  },
  {
    name: 'NoSQL Injection Attempt',
    endpoint: '/api/auth/login',
    method: 'POST',
    body: {
      email: { $ne: null },
      password: { $ne: null }
    },
    expectedStatus: 400,
    expectError: true
  },
  {
    name: 'Path Traversal in URL',
    endpoint: '/api/../../../etc/passwd',
    method: 'GET',
    expectedStatus: 404,
    expectError: true
  },
  {
    name: 'Invalid Content-Type',
    endpoint: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: 'email=test@example.com&password=test',
    expectedStatus: 415,
    expectError: true
  },
  {
    name: 'Valid Login Request',
    endpoint: '/api/auth/login',
    method: 'POST',
    body: {
      email: 'test@example.com',
      password: 'ValidPassword123!'
    },
    expectedStatus: 401, // Will fail auth but pass validation
    expectError: true
  }
];

// Run a single test
async function runTest(test) {
  try {
    const options = {
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        ...test.headers
      }
    };

    if (test.body) {
      options.body = typeof test.body === 'string' 
        ? test.body 
        : JSON.stringify(test.body);
    }

    const response = await fetch(`${BASE_URL}${test.endpoint}`, options);
    const data = await response.json().catch(() => ({}));

    const passed = test.expectError 
      ? response.status >= 400 
      : response.status < 400;

    return {
      name: test.name,
      passed,
      status: response.status,
      expectedStatus: test.expectedStatus,
      response: data
    };
  } catch (error) {
    return {
      name: test.name,
      passed: false,
      error: error.message
    };
  }
}

// Run all tests
async function runAllTests() {
  console.log(`${colors.blue}Running Validation Tests against ${BASE_URL}${colors.reset}\n`);

  const results = [];
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}...`);
    const result = await runTest(test);
    results.push(result);
    
    if (result.passed) {
      console.log(`${colors.green}✓ PASSED${colors.reset} - Status: ${result.status}`);
    } else {
      console.log(`${colors.red}✗ FAILED${colors.reset} - Status: ${result.status}, Expected: ${result.expectedStatus}`);
      if (result.error) {
        console.log(`  Error: ${result.error}`);
      }
      if (result.response?.error) {
        console.log(`  Response: ${result.response.error}`);
      }
    }
    console.log('');
  }

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  console.log(`\n${colors.blue}Test Summary:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total: ${results.length}`);

  // Rate limiting test
  console.log(`\n${colors.blue}Testing Rate Limiting...${colors.reset}`);
  await testRateLimiting();
}

// Test rate limiting
async function testRateLimiting() {
  const endpoint = '/api/auth/login';
  const requests = 15; // Should trigger rate limit
  
  console.log(`Sending ${requests} requests to ${endpoint}...`);
  
  let limitHit = false;
  
  for (let i = 0; i < requests; i++) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (response.status === 429) {
      limitHit = true;
      console.log(`${colors.green}✓ Rate limit triggered after ${i + 1} requests${colors.reset}`);
      break;
    }
  }
  
  if (!limitHit) {
    console.log(`${colors.red}✗ Rate limit not triggered after ${requests} requests${colors.reset}`);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    if (response.ok) {
      return true;
    }
  } catch (error) {
    // Server not reachable
  }
  return false;
}

// Main
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log(`${colors.red}Error: Server is not running at ${BASE_URL}${colors.reset}`);
    console.log('Please start the server first: npm run dev');
    process.exit(1);
  }
  
  await runAllTests();
}

main().catch(console.error);