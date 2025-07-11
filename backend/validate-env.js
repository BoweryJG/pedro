#!/usr/bin/env node

import { validateEnvironment, formatValidationResults, getEnvironmentSchema } from './src/utils/envValidator.js';

// Parse command line arguments
const args = process.argv.slice(2);
const showSchema = args.includes('--schema');
const jsonOutput = args.includes('--json');

if (showSchema) {
  // Show environment variable schema
  const schema = getEnvironmentSchema();
  
  if (jsonOutput) {
    console.log(JSON.stringify(schema, null, 2));
  } else {
    console.log('\n=== Environment Variable Schema ===\n');
    
    console.log('📋 REQUIRED VARIABLES:');
    console.log('─'.repeat(50));
    schema.required.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.variable}`);
      console.log(`   Description: ${item.description}`);
      console.log(`   Example: ${item.example}`);
    });
    
    console.log('\n\n📋 OPTIONAL VARIABLES:');
    console.log('─'.repeat(50));
    schema.optional.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.variable}`);
      console.log(`   Description: ${item.description}`);
      console.log(`   Example: ${item.example}`);
      if (item.default) {
        console.log(`   Default: ${item.default}`);
      }
    });
    
    console.log('\n');
  }
} else {
  // Run validation
  const results = validateEnvironment();
  
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(formatValidationResults(results));
  }
  
  // Exit with error code if validation failed
  process.exit(results.valid ? 0 : 1);
}