import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testNicoleVoice() {
  console.log('🎤 Testing Nicole\'s voice for Dr. Pedro\'s office...\n');
  
  try {
    const tts = new ElevenLabsTTS({
      voiceId: 'nicole',
      modelId: 'eleven_turbo_v2',
      stability: 0.5,
      similarityBoost: 0.7,
      style: 0.3 // More friendly/expressive
    });
    
    const samples = [
      {
        name: 'greeting',
        text: "Hi! Welcome to Dr. Pedro's Advanced Dental Care and MedSpa. I'm Julie, and I'm here to help you achieve your perfect smile! How can I assist you today?"
      },
      {
        name: 'appointment',
        text: "I'd love to help you schedule a consultation with Dr. Pedro! We have appointments available this week. Would Tuesday at 2 PM or Thursday at 10 AM work better for you?"
      },
      {
        name: 'yomi_robot',
        text: "That's a great question about our YOMI robotic implant system! Dr. Pedro is Staten Island's only YOMI-certified dentist. The robot gives us 99.5% precision, which means faster healing and better results for you!"
      },
      {
        name: 'tmj_care',
        text: "I understand how frustrating TMJ pain can be. Dr. Pedro specializes in TMJ treatment, and many of our patients find relief after just one visit. Would you like me to schedule a TMJ evaluation for you?"
      },
      {
        name: 'insurance',
        text: "We work with most major insurance plans, and we also offer fantastic financing options starting at just $89 per month. Let me check what would work best for your situation!"
      },
      {
        name: 'closing',
        text: "Perfect! I've scheduled your appointment with Dr. Pedro for Thursday at 10 AM. You'll receive a text confirmation shortly. We're located at 1520 Richmond Avenue in Staten Island. We can't wait to see you!"
      }
    ];
    
    console.log('Generating samples with Nicole\'s friendly voice...\n');
    
    for (const sample of samples) {
      console.log(`🗣️  ${sample.name.toUpperCase()}:`);
      console.log(`   "${sample.text}"`);
      console.log('   Generating audio...');
      
      const startTime = Date.now();
      const audioData = await tts.textToSpeech(sample.text);
      const duration = Date.now() - startTime;
      
      const filename = `nicole_${sample.name}.mp3`;
      await fs.writeFile(filename, audioData);
      
      console.log(`   ✅ Audio generated in ${duration}ms`);
      console.log(`   💾 Saved to ${filename}`);
      console.log(`   📊 File size: ${(audioData.length / 1024).toFixed(2)} KB`);
      
      // Play the audio
      try {
        await execAsync(`afplay ${filename}`);
        console.log('   🔊 Audio played successfully\n');
      } catch (playError) {
        console.log('   ℹ️  Could not auto-play audio\n');
      }
    }
    
    console.log('✨ Nicole voice test complete!');
    console.log('   Review the audio files to hear how friendly and approachable Julie sounds.');
    console.log('   Nicole\'s voice is perfect for making patients feel comfortable and welcome!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testNicoleVoice();