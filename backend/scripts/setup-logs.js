#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Created logs directory:', logsDir);
} else {
  console.log('✅ Logs directory already exists:', logsDir);
}

// Create .gitignore in logs directory to prevent log files from being committed
const gitignorePath = path.join(logsDir, '.gitignore');
const gitignoreContent = `# Ignore all log files
*.log
*.txt

# But keep this file
!.gitignore
`;

fs.writeFileSync(gitignorePath, gitignoreContent);
console.log('✅ Created .gitignore in logs directory');

console.log('✅ Log directory setup complete!');