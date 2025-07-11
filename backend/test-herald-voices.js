import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testHeraldVoices() {
  console.log('🎺 Testing HERALD voices - excited to introduce you to the king (Dr. Pedro)...\n');
  
  try {
    // Herald/Ambassador style - excited, proud, welcoming
    const heraldTexts = [
      "Oh, you're here to see Dr. Pedro? Fantastic! You've made the right choice, my friend. He's absolutely brilliant - wait till you see what he can do with that YOMI robot. Come on, let me tell you all about it!",
      "Welcome, welcome! You're about to meet the best dentist in Staten Island - no, scratch that - in all of New York! Dr. Pedro has transformed thousands of smiles. I've seen miracles happen in this office, I'm telling you!",
      "This is exciting! First time here? Oh, you're in for a treat. Dr. Pedro isn't just a dentist - he's an artist, a perfectionist. I've worked with him for years and I'm still amazed every single day. Let's get you scheduled!"
    ];
    
    // Voices with more energy and enthusiasm
    const heraldVoices = [
      {
        name: 'Josh_Enthusiastic',
        voiceId: 'TxGEqnHWrfWFTfGW9XjX',
        description: 'Young American - adjusted for excitement',
        settings: { stability: 0.4, similarity_boost: 0.6, style: 0.8 }
      },
      {
        name: 'Sam_Energetic',
        voiceId: 'yoZ06aMxZJJ28mfd3POQ',
        description: 'Young American - high energy',
        settings: { stability: 0.35, similarity_boost: 0.65, style: 0.85 }
      },
      {
        name: 'Liam_Warm',
        voiceId: 'TX3LPaxmHKxFdv7VOQHJ',
        description: 'Young adult with energy and warmth',
        settings: { stability: 0.45, similarity_boost: 0.7, style: 0.75 }
      },
      {
        name: 'Chris_Natural',
        voiceId: 'iP95p4xoKVk53GoZ742B',
        description: 'Natural and real - adjusted for enthusiasm',
        settings: { stability: 0.4, similarity_boost: 0.65, style: 0.8 }
      },
      {
        name: 'Will_Friendly',
        voiceId: 'bIHbv24MWmeRgasZH58o',
        description: 'Conversational and laid back - but excited',
        settings: { stability: 0.38, similarity_boost: 0.68, style: 0.82 }
      },
      {
        name: 'Eric_Smooth',
        voiceId: 'cjVigY5qzO86Huf0OWal',
        description: 'Smooth tenor in 40s - professional excitement',
        settings: { stability: 0.5, similarity_boost: 0.7, style: 0.7 }
      }
    ];
    
    console.log('Testing voices of the HERALD - proud ambassadors of Dr. Pedro...\n');
    console.log('Settings optimized for:');
    console.log('- High energy and enthusiasm');
    console.log('- Genuine excitement about Dr. Pedro');
    console.log('- Warm, welcoming tone\n');
    
    for (let i = 0; i < heraldVoices.length; i++) {
      const voice = heraldVoices[i];
      const text = heraldTexts[i % heraldTexts.length]; // Rotate through texts
      
      console.log(`\n🎺 ${voice.name.toUpperCase()}:`);
      console.log(`   ${voice.description}`);
      console.log(`   Text: "${text.substring(0, 80)}..."`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          ...voice.settings
        });
        
        const startTime = Date.now();
        const audioData = await voiceTTS.textToSpeech(text);
        const duration = Date.now() - startTime;
        
        const filename = `herald_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing the HERALD\'s voice...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (playError) {
          console.log('   ℹ️  Saved for manual playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Try Brian (the one you liked) with herald energy
    console.log('\n\n🎺 Special test: BRIAN as an excited herald...\n');
    
    const brianHerald = {
      name: 'Brian_Herald',
      voiceId: 'nPczCjzI2devNBz1zQrb',
      settings: { 
        stability: 0.45,  // Less stable = more animated
        similarity_boost: 0.65, 
        style: 0.75  // Higher style = more expressive
      }
    };
    
    const excitedText = "I've been with Dr. Pedro for ten years, and let me tell you - this man is a genius! Just yesterday, we had a patient who hadn't smiled in five years. Five years! After one visit with Dr. Pedro and the YOMI robot? She couldn't stop smiling! That's the magic that happens here every single day!";
    
    try {
      const voiceTTS = new ElevenLabsTTS({
        voiceId: brianHerald.voiceId,
        modelId: 'eleven_turbo_v2',
        ...brianHerald.settings
      });
      
      const audioData = await voiceTTS.textToSpeech(excitedText);
      await fs.writeFile('brian_excited_herald.mp3', audioData);
      
      console.log(`✅ Generated Brian as excited herald`);
      console.log(`💾 Saved to brian_excited_herald.mp3`);
      
      try {
        await execAsync(`afplay brian_excited_herald.mp3`);
        console.log('🔊 Playing Brian with herald energy...');
      } catch (playError) {
        console.log('ℹ️  Saved for manual playback');
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n\n👑 HERALD voice testing complete!');
    console.log('\n📜 The voices represent:');
    console.log('   - Loyal team members excited about Dr. Pedro');
    console.log('   - Genuine enthusiasm and pride');
    console.log('   - "Let me tell you about our amazing doctor!"');
    console.log('   - Not the king, but his proud ambassador! 🎺');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testHeraldVoices();