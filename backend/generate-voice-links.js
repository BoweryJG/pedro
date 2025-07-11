import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub repository info
const GITHUB_USER = 'BoweryJG';
const REPO_NAME = 'pedro';
const BRANCH = 'main';

// Get all MP3 files in the current directory
const files = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.mp3'))
  .sort();

// Group files by category
const categories = {
  'Antoni': files.filter(f => f.startsWith('antoni_')),
  'Herald': files.filter(f => f.startsWith('herald_') || f.includes('herald')),
  'Julie/NY': files.filter(f => f.startsWith('julie_')),
  'Latin': files.filter(f => f.startsWith('latin_')),
  'Legendary': files.filter(f => f.startsWith('legendary_')),
  'Male': files.filter(f => f.startsWith('male_')),
  'Nicole': files.filter(f => f.startsWith('nicole_')),
  'Staten Island': files.filter(f => f.startsWith('si_')),
  'Spanish': files.filter(f => f.startsWith('spanish_'))
};

// Generate the message with links
let message = '🎵 Voice Samples for Dr. Greg Pedro Website\n\n';
message += 'Click any link to listen:\n\n';

Object.entries(categories).forEach(([category, categoryFiles]) => {
  if (categoryFiles.length > 0) {
    message += `${category} Voices:\n`;
    categoryFiles.forEach((file) => {
      const cleanName = file.replace('.mp3', '').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
      const url = `https://github.com/${GITHUB_USER}/${REPO_NAME}/raw/${BRANCH}/backend/${encodeURIComponent(file)}`;
      message += `• ${cleanName}: ${url}\n`;
    });
    message += '\n';
  }
});

// Save to file
const outputPath = path.join(__dirname, 'voice-samples-links.txt');
fs.writeFileSync(outputPath, message);

console.log('✅ Voice sample links generated!');
console.log(`📄 Saved to: ${outputPath}`);
console.log('\n📱 You can copy the contents of this file and send via iMessage.');
console.log('\nPreview:');
console.log('=====================================');
console.log(message.substring(0, 500) + '...');