import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all MP3 files in the current directory
const files = fs.readdirSync(__dirname)
  .filter(file => file.endsWith('.mp3'))
  .sort();

console.log(`Found ${files.length} voice samples to play:\n`);

// Group files by category for better organization
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

// Display organized list
Object.entries(categories).forEach(([category, categoryFiles]) => {
  if (categoryFiles.length > 0) {
    console.log(`\n${category} Voices:`);
    categoryFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`);
    });
  }
});

console.log('\nStarting playback...\n');

let currentIndex = 0;

function playNext() {
  if (currentIndex >= files.length) {
    console.log('\n✅ All voice samples played!');
    process.exit(0);
  }

  const file = files[currentIndex];
  const filePath = path.join(__dirname, file);
  
  console.log(`\n🎵 Playing ${currentIndex + 1}/${files.length}: ${file}`);
  
  // Use afplay on macOS to play the audio
  const player = exec(`afplay "${filePath}"`, (error) => {
    if (error) {
      console.error(`Error playing ${file}:`, error.message);
    }
    currentIndex++;
    // Play next file after current one finishes
    playNext();
  });
}

// Start playing
playNext();

console.log('\nPress Ctrl+C to stop playback at any time.');