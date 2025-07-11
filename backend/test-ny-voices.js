import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testNYVoices() {
  console.log('🗽 Testing voices with New York/Staten Island vibe...\n');
  
  try {
    // Staten Island style greeting - more casual, local flavor
    const testTexts = [
      "Hey there! Welcome to Dr. Pedro's on Richmond Avenue. I'm Julie. Listen, we got appointments available this week if you need to come in. What's going on with you?",
      "Oh honey, I totally get it - tooth pain is the worst! Dr. Pedro's gonna take real good care of you. We can get you in tomorrow morning if that works for you.",
      "Yeah, so the YOMI robot - it's incredible, seriously. Dr. Pedro's the only one in Staten Island who's got it. My cousin just had her implants done and she's thrilled!"
    ];
    
    // Voices that might have that NY edge
    const voiceConfigs = [
      {
        name: 'Aria_NY',
        voiceId: '9BWtsMINqrJLrRacOk9x',
        description: 'Middle-aged American with natural rasp',
        settings: { 
          stability: 0.45,  // Less stable = more natural variation
          similarity_boost: 0.65, 
          style: 0.7  // Higher style = more expressive
        }
      },
      {
        name: 'Sarah_Brooklyn',
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        description: 'Confident mature woman - NY settings',
        settings: { 
          stability: 0.4, 
          similarity_boost: 0.6, 
          style: 0.75,
          use_speaker_boost: true
        }
      },
      {
        name: 'Matilda_SI',
        voiceId: 'XrExE9yKIg1WjnnlVkGX',
        description: 'Professional alto - Staten Island style',
        settings: { 
          stability: 0.35, 
          similarity_boost: 0.55, 
          style: 0.8 
        }
      },
      {
        name: 'Grace_Local',
        voiceId: 'oWAxZDx7w5VEj9dCyTzz',
        description: 'American conversational - NY edge',
        settings: { 
          stability: 0.4, 
          similarity_boost: 0.6, 
          style: 0.85 
        }
      },
      {
        name: 'Charlotte_Tough',
        voiceId: 'XB0fDUnXU5powFXDhCwa',
        description: 'Mature confident - Brooklyn tough',
        settings: { 
          stability: 0.3,  // Very natural/varied
          similarity_boost: 0.5, 
          style: 0.9  // Maximum expression
        }
      }
    ];
    
    console.log('Testing with Staten Island dental office personality...\n');
    console.log('Settings adjusted for:');
    console.log('- Lower stability (more natural speech variation)');
    console.log('- Higher style (more expressive/emotional)');
    console.log('- Local conversational tone\n');
    
    // Test each voice with different texts
    for (const config of voiceConfigs) {
      console.log(`\n🗽 Testing ${config.name}:`);
      console.log(`   ${config.description}`);
      
      // Pick a random text for variety
      const textIndex = Math.floor(Math.random() * testTexts.length);
      const testText = testTexts[textIndex];
      console.log(`   Text: "${testText}"`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: config.voiceId,
          modelId: 'eleven_turbo_v2',
          ...config.settings
        });
        
        const startTime = Date.now();
        const audioData = await voiceTTS.textToSpeech(testText);
        const duration = Date.now() - startTime;
        
        const filename = `julie_${config.name.toLowerCase()}_ny.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        // Play the audio
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...');
          await new Promise(resolve => setTimeout(resolve, 4000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Try some preset voices that might have NY character
    console.log('\n\n🌉 Testing additional character voices that might work...\n');
    
    const characterVoices = [
      {
        name: 'Jessie_Streetwise',
        voiceId: 'cjVigY5qzO86Huf0OWal',
        description: 'Confident American female',
        settings: { stability: 0.4, similarity_boost: 0.6, style: 0.8 }
      },
      {
        name: 'Elli_Direct',
        voiceId: 'MF3mGyEYCl7XYWbV9V6O',
        description: 'Clear female - adjusted for NY directness',
        settings: { stability: 0.35, similarity_boost: 0.55, style: 0.85 }
      }
    ];
    
    for (const config of characterVoices) {
      console.log(`\n🗽 Testing ${config.name}:`);
      console.log(`   ${config.description}`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: config.voiceId,
          modelId: 'eleven_turbo_v2',
          ...config.settings
        });
        
        // Use a very NY style text
        const nyText = "Look, I've been doing this for fifteen years - Dr. Pedro's practice is the real deal. You want the best? You got it. We'll take care of everything, don't even worry about it.";
        
        const audioData = await voiceTTS.textToSpeech(nyText);
        const filename = `julie_${config.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing...');
          await new Promise(resolve => setTimeout(resolve, 4000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n✨ NY Voice testing complete!');
    console.log('\n📝 Notes:');
    console.log('   - Lower stability = more natural speech patterns');
    console.log('   - Higher style = more emotional expression');
    console.log('   - Listen for: confidence, warmth, local feel');
    console.log('   - Should sound like a helpful Staten Island local');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNYVoices();