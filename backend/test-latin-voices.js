import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testLatinVoices() {
  console.log('🌎 Testing Latin American immigrant voices - fluent English with strong accents...\n');
  
  try {
    // Latin American English - grammatically fluent but with pronunciation patterns
    const latinTexts = {
      // Dominican receptionist - uses "mami/papi", drops some H sounds
      dominican: "Ay, mami, welcome to Dr. Pedro office! You know what? He is the best dentist in all Staten Island, I promise you. My cousin, she come here with the teeth all broken, verdad? Now she look like a model! You want I make appointment for you? We have opening Thursday, is perfect day.",
      
      // Mexican dental assistant - uses "no?" for confirmation, Spanish word order
      mexican: "Hello, my friend! Is so good you are here! Dr. Pedro, he help so many people, you know? The robot we have, ay Dios mio, is incredible! Is like magic how it work. You don't feel nothing, I swear. My whole family, they all come here now. You want to see? Come, I show you everything, no?",
      
      // Colombian office manager - very formal but with accent, uses "my love"
      colombian: "Good morning, my love, how are you today? Please, take a seat, Dr. Pedro will be with you very soon. You know, I work here ten years already, and every day I see miracle. The technology we have here, uf, is something beautiful. You are nervous? Don't worry, everybody here, we take care of you like family.",
      
      // Puerto Rican scheduler - mixes some Spanish, very animated
      puertorican: "Oye, you finally made it! Que bueno! Listen, Dr. Pedro is like... como te digo... he's the real deal, okay? The YOMI robot? Eso es next level, papa! My mother-in-law, she was scared like you wouldn't believe. But after? She telling everybody - go see Dr. Pedro! So what day is good for you?",
      
      // Venezuelan coordinator - professional but accent, emphasizes differently
      venezuelan: "Welcome to our clinic! I am so happy to help you today. Dr. Pedro is extraordinary doctor, really. In my country, I never see technology like this. Is amazing what he can do. Many patient, they come here with big problem, but they leave with beautiful smile. I help you with everything you need, okay?",
      
      // Ecuadorian assistant - soft spoken but enthusiastic
      ecuadorian: "Hello! Oh, you want to know about the implant? Si, si, I explain you everything! Dr. Pedro, he do this procedure maybe thousand time already. Is so precise with the robot, you know? Like watching artist. My brother, he get three implant last year. Now he eat whatever he want! Is beautiful thing, de verdad."
    };
    
    // Using voices that can handle accented English
    const latinVoices = [
      {
        name: 'Carmen_Dominican',
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah adjusted
        text: latinTexts.dominican,
        settings: { 
          stability: 0.45,  // Natural speech patterns
          similarity_boost: 0.5,  // Less "perfect" 
          style: 0.85,  // Expressive Latin warmth
          use_speaker_boost: false
        }
      },
      {
        name: 'Rosa_Mexican',
        voiceId: 'XrExE9yKIg1WjnnlVkGX', // Matilda adjusted
        text: latinTexts.mexican,
        settings: { 
          stability: 0.4,
          similarity_boost: 0.45,  // More accent
          style: 0.9  // Very animated
        }
      },
      {
        name: 'Isabella_Colombian',
        voiceId: '9BWtsMINqrJLrRacOk9x', // Aria adjusted
        text: latinTexts.colombian,
        settings: { 
          stability: 0.5,  // Formal but accented
          similarity_boost: 0.55,
          style: 0.75
        }
      }
    ];
    
    // Male Latin voices
    const latinMaleVoices = [
      {
        name: 'Miguel_PuertoRican',
        voiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh adjusted
        text: latinTexts.puertorican,
        settings: { 
          stability: 0.35,  // Very animated
          similarity_boost: 0.45,
          style: 0.95  // Maximum expression
        }
      },
      {
        name: 'Carlos_Venezuelan',
        voiceId: 'nPczCjzI2devNBz1zQrb', // Brian adjusted
        text: latinTexts.venezuelan,
        settings: { 
          stability: 0.45,
          similarity_boost: 0.5,
          style: 0.8
        }
      },
      {
        name: 'Diego_Ecuadorian',
        voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Sam adjusted
        text: latinTexts.ecuadorian,
        settings: { 
          stability: 0.4,
          similarity_boost: 0.48,
          style: 0.85
        }
      }
    ];
    
    console.log('🌴 FEMALE LATIN VOICES:\n');
    console.log('Settings adjusted for:');
    console.log('- Lower similarity (more accent)');
    console.log('- Higher style (Latin expressiveness)');
    console.log('- Natural speech patterns\n');
    
    for (const voice of latinVoices) {
      console.log(`\n🌺 ${voice.name.toUpperCase()}:`);
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
        
        const filename = `latin_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Generated in ${duration}ms`);
        console.log(`   💾 Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing Latin queen...');
          await new Promise(resolve => setTimeout(resolve, 6000));
        } catch (playError) {
          console.log('   ℹ️  Saved for playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n🌴 MALE LATIN VOICES:\n');
    
    for (const voice of latinMaleVoices) {
      console.log(`\n🌵 ${voice.name.toUpperCase()}:`);
      console.log(`   "${voice.text.substring(0, 100)}..."`);
      
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: voice.voiceId,
          modelId: 'eleven_turbo_v2',
          ...voice.settings
        });
        
        const audioData = await voiceTTS.textToSpeech(voice.text);
        const filename = `latin_${voice.name.toLowerCase()}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`   ✅ Saved to ${filename}`);
        
        try {
          await execAsync(`afplay ${filename}`);
          console.log('   🔊 Playing Latin king...');
          await new Promise(resolve => setTimeout(resolve, 6000));
        } catch (playError) {
          console.log('   ℹ️  Saved for playback');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n\n🌎 Latin American voice testing complete!');
    console.log('\n🌮 The Team:');
    console.log('\nFEMALE:');
    console.log('   - Carmen (Dominican): Warm receptionist, uses "mami"');
    console.log('   - Rosa (Mexican): Friendly assistant, says "no?" a lot');
    console.log('   - Isabella (Colombian): Formal manager, calls everyone "my love"');
    console.log('\nMALE:');
    console.log('   - Miguel (Puerto Rican): Animated scheduler, mixes Spanish');
    console.log('   - Carlos (Venezuelan): Professional coordinator');
    console.log('   - Diego (Ecuadorian): Enthusiastic assistant');
    console.log('\n   All fluent but with beautiful accents! 🏝️');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLatinVoices();