import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testMaleVoices() {
  console.log('🎤 Testing confident male voices...\n');
  
  try {
    // First, get all available voices
    const tts = new ElevenLabsTTS();
    console.log('Fetching all male voices from ElevenLabs...\n');
    
    const voices = await tts.getVoices();
    console.log('Available male voices:');
    voices.forEach(voice => {
      if (voice.labels && voice.labels.gender === 'male') {
        console.log(`- ${voice.name}: ${voice.description || 'No description'}`);
        console.log(`  Voice ID: ${voice.voice_id}`);
      }
    });
    console.log('\n');
    
    // Test some confident male voices
    const testText = "Good afternoon! Welcome to Dr. Pedro's office. I'm here to help you get the smile you deserve. We've got the best technology in Staten Island, and I know we can take great care of you. What brings you in today?";
    
    const maleVoices = [
      {
        name: 'Josh',
        voiceId: 'TxGEqnHWrfWFTfGW9XjX',
        description: 'Young American male'
      },
      {
        name: 'Arnold',
        voiceId: 'VR6AewLTigWG4xSOukaG',
        description: 'American male'
      },
      {
        name: 'Adam',
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        description: 'Deep American male'
      },
      {
        name: 'Sam',
        voiceId: 'yoZ06aMxZJJ28mfd3POQ',
        description: 'Young American male'
      },
      {
        name: 'Drew',
        voiceId: '29vD33N1CtxCmqQRPOHJ',
        description: 'American male'
      }
    ];
    
    console.log('Testing confident male voices...\n');
    
    for (const voice of maleVoices) {
      console.log(`🗣️  Testing ${voice.name.toUpperCase()}:`);
      console.log(`   ${voice.description}`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.4
        });
        
        const audioData = await voiceTTS.textToSpeech(testText);
        const filename = `male_voice_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...\n');
          await new Promise(resolve => setTimeout(resolve, 4000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback\n');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }
    
    console.log('✨ Male voice testing complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMaleVoices();