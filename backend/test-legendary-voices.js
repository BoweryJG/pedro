import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testLegendaryVoices() {
  console.log('⚔️ Testing LEGENDARY male voices - warriors, kings, legends...\n');
  
  try {
    // Epic dental office greeting - confident, powerful, reassuring
    const testText = "Welcome to Dr. Pedro's practice. I've seen thousands of patients walk through these doors with pain and leave with confidence. Trust me when I say - you're in the right place. We don't just fix teeth here, we transform lives.";
    
    const legendaryVoices = [
      {
        name: 'Carter_Mountain_King',
        voiceId: 'qNkzaJoHLLdpvgh5tISm',
        description: 'Deep, rich, rugged - Voice of the Mountain',
        settings: { stability: 0.7, similarity_boost: 0.8, style: 0.3 }
      },
      {
        name: 'Magnus_Authoritative',
        voiceId: 'h6jhtnd8goqWbVME1Cxr',
        description: 'Deep, powerful, hypnotizing - psychologically commanding',
        settings: { stability: 0.75, similarity_boost: 0.85, style: 0.2 }
      },
      {
        name: 'Daniel_Broadcaster',
        voiceId: 'onwK4e9ZLuTAKqWW03F9',
        description: 'Strong professional broadcaster voice',
        settings: { stability: 0.65, similarity_boost: 0.75, style: 0.35 }
      },
      {
        name: 'Brian_Resonant',
        voiceId: 'nPczCjzI2devNBz1zQrb',
        description: 'Middle-aged, resonant and comforting',
        settings: { stability: 0.6, similarity_boost: 0.7, style: 0.4 }
      },
      {
        name: 'Adam_Deep',
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        description: 'Deep American male - commanding presence',
        settings: { stability: 0.7, similarity_boost: 0.8, style: 0.25 }
      }
    ];
    
    console.log('Testing voices of LEGENDS...\n');
    
    for (const voice of legendaryVoices) {
      console.log(`\n⚔️  ${voice.name.toUpperCase()}:`);
      console.log(`   ${voice.description}`);
      console.log(`   Voice ID: ${voice.voiceId}`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          ...voice.settings
        });
        
        const startTime = Date.now();
        const audioData = await voiceTTS.textToSpeech(testText);
        const duration = Date.now() - startTime;
        
        const filename = `legendary_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing the voice of a LEGEND...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Also test with more epic/warrior style text
    console.log('\n\n⚔️ Testing with WARRIOR style messaging...\n');
    
    const warriorText = "Listen carefully. I've been in this game for decades. Seen every challenge, conquered every obstacle. When I tell you Dr. Pedro is the best in the business, I mean it. This isn't just dentistry - it's precision, it's art, it's victory over pain. Are you ready to win?";
    
    // Test the top 2 most legendary voices with warrior text
    const topVoices = legendaryVoices.slice(0, 2);
    
    for (const voice of topVoices) {
      console.log(`\n🛡️  ${voice.name} - WARRIOR MODE:`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          stability: voice.settings.stability - 0.1, // Even more gravitas
          similarityBoost: voice.settings.similarity_boost,
          style: voice.settings.style + 0.1 // Slightly more dramatic
        });
        
        const audioData = await voiceTTS.textToSpeech(warriorText);
        const filename = `warrior_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing WARRIOR voice...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n🏆 LEGENDARY voice testing complete!');
    console.log('\n📜 The Champions:');
    console.log('   - Carter the Mountain King: Deep, rich, rugged');
    console.log('   - Magnus Authoritative: Powerful, hypnotizing');
    console.log('   - Daniel: Strong broadcaster presence');
    console.log('   - Brian: Resonant and commanding');
    console.log('   - Adam: Deep American authority');
    console.log('\n   These are voices that have won 10,000 battles! 🗡️');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLegendaryVoices();