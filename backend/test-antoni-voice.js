import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testAntoniVoice() {
  console.log('🎤 Testing Antoni - Confident Professional Male Voice...\n');
  
  try {
    const tts = new ElevenLabsTTS({
      voiceId: 'antoni', // This maps to 'ErXwobaYiN019PkySvjV' in the voices object
      modelId: 'eleven_turbo_v2',
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0.3
    });
    
    const samples = [
      {
        name: 'greeting',
        text: "Good morning! Welcome to Dr. Pedro's Advanced Dental Care. I'm Jules, your personal care coordinator. How can I help you achieve your best smile today?"
      },
      {
        name: 'professional',
        text: "I understand your concerns about the procedure. Dr. Pedro has performed over 500 successful YOMI robotic implants with a 99.5% success rate. You're in excellent hands."
      },
      {
        name: 'appointment',
        text: "I can definitely help you schedule that consultation. Dr. Pedro has availability this Thursday at 2 PM or next Monday at 10 AM. Which would work better for your schedule?"
      },
      {
        name: 'ny_style',
        text: "Listen, I've been with Dr. Pedro's practice for years - this is the real deal. State-of-the-art technology, best team in Staten Island. We'll take great care of you, guaranteed."
      }
    ];
    
    console.log('Generating Antoni voice samples...\n');
    
    for (const sample of samples) {
      console.log(`🗣️  ${sample.name.toUpperCase()}:`);
      console.log(`   "${sample.text}"`);
      
      const startTime = Date.now();
      const audioData = await tts.textToSpeech(sample.text);
      const duration = Date.now() - startTime;
      
      const filename = `antoni_${sample.name}.mp3`;
      await fs.writeFile(filename, audioData);
      
      console.log(`   ✅ Generated in ${duration}ms`);
      console.log(`   💾 Saved to ${filename}`);
      
      try {
        await execAsync(`afplay ${filename}`);
        console.log('   🔊 Playing...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (playError) {
        console.log('   ℹ️  Could not auto-play\n');
      }
    }
    
    console.log('✨ Antoni voice test complete!');
    console.log('   Professional male voice - confident and trustworthy');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAntoniVoice();