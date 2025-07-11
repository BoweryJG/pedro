import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testAllVoices() {
  console.log('🎤 Testing all available voices for Julie...\n');
  
  try {
    // Test text that shows personality
    const testText = "Hi there! Welcome to Dr. Pedro's office. I'm Julie, and I'm here to help you get the smile you've always wanted. We've got appointments available this week - what works best for you?";
    
    // Voice configurations to try
    const voiceConfigs = [
      {
        name: 'Sarah',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        settings: { stability: 0.65, similarity_boost: 0.7, style: 0.4 }
      },
      {
        name: 'Laura', 
        voiceId: 'FGY2WhTYpPnrIDTdsKH5',
        settings: { stability: 0.6, similarity_boost: 0.75, style: 0.5 }
      },
      {
        name: 'Jessica',
        voiceId: 'cgSgspJ2msm6clMCkdW9',
        settings: { stability: 0.55, similarity_boost: 0.8, style: 0.4 }
      },
      {
        name: 'Matilda',
        voiceId: 'XrExE9yKIg1WjnnlVkGX',
        settings: { stability: 0.6, similarity_boost: 0.7, style: 0.3 }
      },
      {
        name: 'Domi (warmer settings)',
        voiceId: 'AZnzlk1XvdvUeBnXmlld',
        settings: { stability: 0.7, similarity_boost: 0.6, style: 0.6 }
      }
    ];
    
    console.log('Testing voices with warmer, more natural settings...\n');
    
    // First, get available voices from API
    const tts = new ElevenLabsTTS();
    console.log('Fetching all available voices from ElevenLabs...\n');
    
    try {
      const voices = await tts.getVoices();
      console.log('Available voices that might work:');
      voices.forEach(voice => {
        if (voice.labels && 
            (voice.labels.accent === 'american' || voice.labels.accent === 'american-northeast') &&
            voice.labels.gender === 'female' &&
            (voice.labels.age === 'middle_aged' || voice.labels.age === 'young')) {
          console.log(`- ${voice.name}: ${voice.description}`);
          console.log(`  Voice ID: ${voice.voice_id}`);
        }
      });
      console.log('\n');
    } catch (error) {
      console.log('Could not fetch voice list\n');
    }
    
    // Test each voice configuration
    for (const config of voiceConfigs) {
      console.log(`🗣️  Testing ${config.name.toUpperCase()}:`);
      console.log(`   Voice ID: ${config.voiceId}`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: config.voiceId,
          modelId: 'eleven_turbo_v2',
          ...config.settings
        });
        
        const startTime = Date.now();
        const audioData = await voiceTTS.textToSpeech(testText);
        const duration = Date.now() - startTime;
        
        const filename = `julie_voice_${config.name.toLowerCase().replace(' ', '_')}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        // Play the audio
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...\n');
          // Wait a bit between samples
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (playError) {
          console.log('   ℹ️  Could not auto-play\n');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }
    
    console.log('\n✨ Voice testing complete!');
    console.log('   Listen to the samples and pick the one that sounds:');
    console.log('   - Warm and friendly (not robotic)');
    console.log('   - Professional but approachable');
    console.log('   - Like a helpful New Yorker in her 40s');
    console.log('   - Natural and conversational');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAllVoices();