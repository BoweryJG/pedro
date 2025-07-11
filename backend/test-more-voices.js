import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testMoreVoices() {
  console.log('🎤 Testing 5 new warm, professional voices for Julie...\n');
  
  try {
    // Professional dental office greeting
    const testText = "Good morning! Thanks for calling Dr. Pedro's office. I'm Julie, your personal care coordinator. I hear you're interested in learning more about our services - that's wonderful! We have some great options available. What specific concerns can I help address for you today?";
    
    // New voice configurations - warm, professional, mature
    const voiceConfigs = [
      {
        name: 'Dorothy',
        voiceId: 'ThT5KcBeYPX3keUQqHPh',
        description: 'Pleasant British accent, very warm',
        settings: { stability: 0.65, similarity_boost: 0.65, style: 0.4 }
      },
      {
        name: 'Grace',
        voiceId: 'oWAxZDx7w5VEj9dCyTzz',
        description: 'American, conversational and friendly',
        settings: { stability: 0.6, similarity_boost: 0.7, style: 0.45 }
      },
      {
        name: 'Charlotte',
        voiceId: 'XB0fDUnXU5powFXDhCwa',
        description: 'Mature, seductive but professional',
        settings: { stability: 0.7, similarity_boost: 0.6, style: 0.3 }
      },
      {
        name: 'Lily',
        voiceId: 'pFZP5JQG7iQjIQuC4Bku',
        description: 'Natural American accent, friendly',
        settings: { stability: 0.6, similarity_boost: 0.75, style: 0.5 }
      },
      {
        name: 'Aria',
        voiceId: '9BWtsMINqrJLrRacOk9x',
        description: 'Middle-aged American woman, calm with rasp',
        settings: { stability: 0.65, similarity_boost: 0.7, style: 0.35 }
      }
    ];
    
    console.log('Testing warm, professional voices with New York friendly vibe...\n');
    
    // Test each voice
    for (const config of voiceConfigs) {
      console.log(`🗣️  Testing ${config.name.toUpperCase()}:`);
      console.log(`   ${config.description}`);
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
        
        const filename = `julie_${config.name.toLowerCase()}_sample.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        // Play the audio
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...\n');
          // Wait between samples
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback\n');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }
    
    // Also test some with different emotional settings
    console.log('\n🎭 Testing Sarah and Matilda with warmer emotional settings...\n');
    
    const emotionalConfigs = [
      {
        name: 'Sarah_Warmer',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        settings: { stability: 0.55, similarity_boost: 0.65, style: 0.6 }
      },
      {
        name: 'Matilda_Friendlier', 
        voiceId: 'XrExE9yKIg1WjnnlVkGX',
        settings: { stability: 0.5, similarity_boost: 0.7, style: 0.55 }
      }
    ];
    
    for (const config of emotionalConfigs) {
      console.log(`🗣️  Testing ${config.name}:`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: config.voiceId,
          modelId: 'eleven_turbo_v2',
          ...config.settings
        });
        
        const audioData = await voiceTTS.textToSpeech(testText);
        const filename = `julie_${config.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...\n');
          await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback\n');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }
    
    console.log('\n✨ Voice testing complete!');
    console.log('\n📝 Quick Reference:');
    console.log('   - Dorothy: British accent (might work if subtle)');
    console.log('   - Grace: American, conversational');
    console.log('   - Charlotte: Mature and professional');
    console.log('   - Lily: Natural American, friendly');
    console.log('   - Aria: Middle-aged American, calm');
    console.log('   - Sarah_Warmer: Previous favorite with more emotion');
    console.log('   - Matilda_Friendlier: Professional with more warmth');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testMoreVoices();