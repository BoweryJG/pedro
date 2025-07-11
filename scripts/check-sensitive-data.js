#!/usr/bin/env node

/**
 * Script to check for potentially sensitive data in the codebase
 * Run this before committing to ensure no sensitive data is exposed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Patterns to search for sensitive data
const sensitivePatterns = [
  // Phone numbers
  { pattern: /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, name: 'Phone numbers', exclude: ['xxx', '000'] },
  
  // Specific known values that should be removed
  { pattern: /959139930338809/, name: 'Facebook App ID' },
  { pattern: /pedro_dental_2025/, name: 'Webhook verify token' },
  { pattern: /718[-.\s]?356[-.\s]?9700/, name: 'Specific phone number' },
  { pattern: /718[-.\s]?948[-.\s]?0870/, name: 'Specific phone number' },
  { pattern: /929[-.\s]?242[-.\s]?4535/, name: 'Specific phone number' },
  { pattern: /718[-.\s]?555[-.\s]?0123/, name: 'Test phone number' },
  
  // Addresses
  { pattern: /4300\s+Hyland\s+Blvd/i, name: 'Practice address' },
  { pattern: /2656\s+Hylan\s+Bou?le?vard/i, name: 'Practice address' },
  
  // Email patterns (excluding example domains)
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)/i, name: 'Email addresses', exclude: ['example.com', 'test.com'] },
  
  // API keys and secrets (generic patterns)
  { pattern: /api[_-]?key['":\s]*['"]\w{20,}['"]/, name: 'API keys' },
  { pattern: /secret['":\s]*['"]\w{20,}['"]/, name: 'Secret keys' },
  
  // Hardcoded practice names
  { pattern: /Dr\.\s*Pedro\s*Advanced\s*Dental\s*Care/, name: 'Practice name' },
];

// Files and directories to exclude from scanning
const excludePaths = [
  'node_modules',
  '.git',
  '.next',
  'build',
  'dist',
  '.env',
  '.env.local',
  '.env.example',
  '*.log',
  'package-lock.json',
  'yarn.lock',
  'SECURE_CONFIGURATION_GUIDE.md',
  'scripts/check-sensitive-data.js'
];

// File extensions to scan
const includeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.yaml', '.yml', '.md'];

function shouldScanFile(filePath) {
  // Check if path should be excluded
  for (const exclude of excludePaths) {
    if (filePath.includes(exclude)) return false;
  }
  
  // Check if file has valid extension
  const ext = path.extname(filePath);
  return includeExtensions.includes(ext);
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];
  
  for (const { pattern, name, exclude = [] } of sensitivePatterns) {
    const matches = content.match(new RegExp(pattern, 'g')) || [];
    
    for (const match of matches) {
      // Check if match should be excluded
      let shouldExclude = false;
      for (const excludePattern of exclude) {
        if (match.includes(excludePattern)) {
          shouldExclude = true;
          break;
        }
      }
      
      if (!shouldExclude) {
        // Find line number
        const lines = content.split('\n');
        let lineNumber = 0;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match)) {
            lineNumber = i + 1;
            break;
          }
        }
        
        findings.push({
          file: filePath,
          line: lineNumber,
          type: name,
          value: match
        });
      }
    }
  }
  
  return findings;
}

function scanDirectory(dir, findings = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    // Skip if in exclude list
    if (excludePaths.some(exclude => fullPath.includes(exclude))) {
      continue;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, findings);
    } else if (stat.isFile() && shouldScanFile(fullPath)) {
      const fileFindings = scanFile(fullPath);
      findings.push(...fileFindings);
    }
  }
  
  return findings;
}

// Main execution
console.log('🔍 Scanning for sensitive data...\n');

const projectRoot = path.resolve(__dirname, '..');
const findings = scanDirectory(projectRoot);

if (findings.length === 0) {
  console.log('✅ No sensitive data found!');
  process.exit(0);
} else {
  console.log(`⚠️  Found ${findings.length} potential sensitive data instances:\n`);
  
  // Group findings by type
  const groupedFindings = {};
  for (const finding of findings) {
    if (!groupedFindings[finding.type]) {
      groupedFindings[finding.type] = [];
    }
    groupedFindings[finding.type].push(finding);
  }
  
  // Display findings
  for (const [type, items] of Object.entries(groupedFindings)) {
    console.log(`\n${type}:`);
    for (const item of items) {
      console.log(`  ${item.file}:${item.line} - "${item.value}"`);
    }
  }
  
  console.log('\n❌ Please replace these values with environment variables before committing.');
  process.exit(1);
}