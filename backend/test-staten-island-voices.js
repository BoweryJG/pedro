import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testStatenIslandVoices() {
  console.log('🗽 Testing 6 voices with REAL Staten Island personality...\n');
  
  try {
    // Staten Island style texts - authentic, local, some edgy
    const siTexts = {
      professional: "Listen sweetie, I been working at Dr. Pedro's for like fifteen years, okay? This man's a freakin' genius with teeth. You want that Hollywood smile? He's your guy. We got appointments Tuesday - you want it or what?",
      
      edgy: "Oh, you're scared of the dentist? Please. My nonna's tougher than our procedures. Dr. Pedro's got this robot - it's sick, I'm tellin' ya. Makes everything stupid easy. Stop being a baby and book already.",
      
      warm: "Honey, I know exactly what you're going through - my whole family's got bad teeth, it's genetic or whatever. But Dr. Pedro? He fixed my brother Joey, my cousin Tina, even my mother-in-law! And trust me, that woman's mouth was a disaster.",
      
      confident: "Look, I don't got time for BS, alright? You need dental work, we're the best on the island. Period. Dr. Pedro's the only one with the YOMI robot. You can shop around if you want, waste your time - or you can get it done right the first time.",
      
      friendly: "Ay, welcome to Dr. Pedro's! You from around here? Yeah, I could tell - you got that Staten Island look, you know what I mean? So what's goin' on with your teeth? Don't be shy, we seen everything here.",
      
      excited: "Yo, no way! You're finally coming in? I been tellin' your wife for months - Dr. Pedro's the man! Remember when Sal came in with that jacked up grill? Look at him now! Come on, let's get you hooked up."
    };
    
    // 3 Female voices with Staten Island settings
    const femaleVoices = [
      {
        name: 'Maria_Professional',
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah
        text: siTexts.professional,
        settings: { 
          stability: 0.35,  // Natural variation
          similarity_boost: 0.55, 
          style: 0.85  // Very expressive
        }
      },
      {
        name: 'Gina_Edgy',
        voiceId: '9BWtsMINqrJLrRacOk9x', // Aria
        text: siTexts.edgy,
        settings: { 
          stability: 0.3,  // More variation
          similarity_boost: 0.5, 
          style: 0.9  // Maximum attitude
        }
      },
      {
        name: 'Teresa_Warm',
        voiceId: 'XrExE9yKIg1WjnnlVkGX', // Matilda
        text: siTexts.warm,
        settings: { 
          stability: 0.4, 
          similarity_boost: 0.6, 
          style: 0.8
        }
      }
    ];
    
    // 3 Male voices with Staten Island settings
    const maleVoices = [
      {
        name: 'Tony_Confident',
        voiceId: 'nPczCjzI2devNBz1zQrb', // Brian
        text: siTexts.confident,
        settings: { 
          stability: 0.35, 
          similarity_boost: 0.55, 
          style: 0.85
        }
      },
      {
        name: 'Vinny_Friendly',
        voiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh
        text: siTexts.friendly,
        settings: { 
          stability: 0.3, 
          similarity_boost: 0.5, 
          style: 0.9
        }
      },
      {
        name: 'Joey_Excited',
        voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam
        text: siTexts.excited,
        settings: { 
          stability: 0.25,  // Very animated
          similarity_boost: 0.45, 
          style: 0.95  // Maximum expression
        }
      }
    ];
    
    console.log('🍕 FEMALE VOICES - Staten Island Style:\n');
    
    for (const voice of femaleVoices) {
      console.log(`\n👩 ${voice.name.toUpperCase()}:`);
      console.log(`   "${voice.text.substring(0, 100)}..."`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          ...voice.settings
        });
        
        const startTime = Date.now();
        const audioData = await voiceTTS.textToSpeech(voice.text);
        const duration = Date.now() - startTime;
        
        const filename = `si_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing Staten Island queen...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (playError) {
          console.log('   ℹ️  Saved for playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n🍕 MALE VOICES - Staten Island Style:\n');
    
    for (const voice of maleVoices) {
      console.log(`\n👨 ${voice.name.toUpperCase()}:`);
      console.log(`   "${voice.text.substring(0, 100)}..."`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          ...voice.settings
        });
        
        const audioData = await voiceTTS.textToSpeech(voice.text);
        const filename = `si_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing Staten Island guy...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (playError) {
          console.log('   ℹ️  Saved for playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n🗽 Staten Island voice testing complete!');
    console.log('\n🍕 The Cast:');
    console.log('\nFEMALE:');
    console.log('   - Maria: Professional but real');
    console.log('   - Gina: Edgy, no-nonsense attitude');
    console.log('   - Teresa: Warm neighborhood mom energy');
    console.log('\nMALE:');
    console.log('   - Tony: Confident, straight-talking');
    console.log('   - Vinny: Friendly neighborhood guy');
    console.log('   - Joey: Excited, enthusiastic buddy');
    console.log('\n   All with authentic Staten Island flavor! 🌉');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testStatenIslandVoices();