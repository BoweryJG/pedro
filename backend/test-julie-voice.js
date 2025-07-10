import dotenv from 'dotenv';
import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

dotenv.config();

const execAsync = promisify(exec);

/**
 * Test script for Julie's ElevenLabs voice
 */
async function testJulieVoice() {
  console.log('🎤 Testing Julie\'s Voice with ElevenLabs...\n');
  
  try {
    // Initialize ElevenLabs TTS
    const tts = new ElevenLabsTTS({
      voiceId: 'rachel',
      modelId: 'eleven_turbo_v2'
    });
    
    // Test phrases for Julie
    const testPhrases = [
      {
        scenario: 'Greeting',
        text: 'Good morning! Thank you for calling Dr. Pedro\'s Advanced Dental Care and MedSpa. This is Julie. How can I help you today?'
      },
      {
        scenario: 'Appointment Booking',
        text: 'I\'d be happy to help you schedule an appointment. We have openings tomorrow at 10 AM or Thursday at 2 PM. Which would work better for you?'
      },
      {
        scenario: 'Emergency Response',
        text: 'I understand you\'re in pain. Let me help you right away. Can you describe where the pain is located and how severe it is on a scale of 1 to 10?'
      },
      {
        scenario: 'Service Information',
        text: 'Dr. Pedro specializes in YOMI robotic dental implants, which offer 99.5% precision and 50% faster healing time. Would you like to schedule a consultation to learn more?'
      },
      {
        scenario: 'Closing',
        text: 'Perfect! I\'ve scheduled your appointment for Thursday at 2 PM. You\'ll receive a text confirmation shortly. Is there anything else I can help you with today?'
      }
    ];
    
    // Get available voices
    console.log('📋 Fetching available voices...');
    const voices = await tts.getVoices();
    console.log(`Found ${voices.length} voices\n`);
    
    // Find female voices
    const femaleVoices = voices.filter(v => 
      v.labels && (v.labels.gender === 'female' || v.name.toLowerCase().includes('female'))
    );
    
    console.log('👩 Available female voices for Julie:');
    femaleVoices.slice(0, 5).forEach(voice => {
      console.log(`  - ${voice.name}: ${voice.description || 'No description'}`);
    });
    console.log();
    
    // Test each phrase
    for (const { scenario, text } of testPhrases) {
      console.log(`\n🗣️  Testing ${scenario}:`);
      console.log(`   "${text}"`);
      
      try {
        // Generate audio
        console.log('   Generating audio...');
        const startTime = Date.now();
        const audioData = await tts.textToSpeech(text);
        const generationTime = Date.now() - startTime;
        
        console.log(`   ✅ Audio generated in ${generationTime}ms`);
        
        // Save to file
        const filename = `julie_${scenario.toLowerCase().replace(/\s+/g, '_')}.mp3`;
        await fs.writeFile(filename, audioData);
        console.log(`   💾 Saved to ${filename}`);
        
        // Get file size
        const stats = await fs.stat(filename);
        console.log(`   📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
        
        // Play audio on macOS (optional)
        if (process.platform === 'darwin') {
          try {
            await execAsync(`afplay ${filename}`);
            console.log('   🔊 Audio played successfully');
          } catch (playError) {
            console.log('   ⚠️  Could not play audio (afplay not available)');
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
      }
    }
    
    // Test streaming
    console.log('\n\n🚀 Testing Streaming TTS (Ultra-Low Latency)...');
    const streamText = 'This is a test of ElevenLabs streaming capability for real-time conversation.';
    
    try {
      console.log('   Starting stream...');
      const startTime = Date.now();
      const stream = await tts.textToSpeechStream(streamText, {
        optimizeLatency: 4
      });
      
      const chunks = [];
      let firstChunkTime = null;
      
      stream.on('data', (chunk) => {
        if (!firstChunkTime) {
          firstChunkTime = Date.now() - startTime;
          console.log(`   ⚡ First audio chunk received in ${firstChunkTime}ms`);
        }
        chunks.push(chunk);
      });
      
      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });
      
      const totalTime = Date.now() - startTime;
      console.log(`   ✅ Streaming completed in ${totalTime}ms`);
      console.log(`   📦 Received ${chunks.length} chunks`);
      
      // Save streamed audio
      const streamedAudio = Buffer.concat(chunks);
      await fs.writeFile('julie_streaming_test.mp3', streamedAudio);
      console.log('   💾 Saved streaming test to julie_streaming_test.mp3');
      
    } catch (error) {
      console.error(`   ❌ Streaming error: ${error.message}`);
    }
    
    // Test voice presets
    console.log('\n\n🎨 Testing Voice Presets...');
    const presets = ElevenLabsTTS.getJulieVoicePresets();
    
    for (const [presetName, settings] of Object.entries(presets)) {
      console.log(`\n   Preset: ${presetName}`);
      console.log(`   Voice: ${settings.voiceId}`);
      console.log(`   Settings:`, settings.voiceSettings);
    }
    
    console.log('\n\n✨ Julie\'s voice testing complete!');
    console.log('   Audio files have been saved to the current directory.');
    console.log('   Review them to ensure Julie sounds professional and welcoming.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('   Make sure ELEVENLABS_API_KEY is set in your .env file');
  }
}

// Run the test
testJulieVoice().catch(console.error);