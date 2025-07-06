import { Transform } from 'stream';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const execAsync = promisify(exec);

export class CoquiTTS extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    
    this.options = {
      voice: options.voice || 'aura-2-thalia-en',
      speed: options.speed || 1.0,
      pitch: options.pitch || 1.0,
      emotion: options.emotion || 'neutral'
    };
    
    this.tempDir = '/tmp/coqui-tts';
    this.isProcessing = false;
    this.queue = [];
    this.stopped = false;
    
    this.initializeTTS();
  }

  async initializeTTS() {
    // Create temp directory for audio files
    await fs.mkdir(this.tempDir, { recursive: true });
    
    // Initialize Coqui TTS model
    // In production, you'd load the actual Coqui model here
    console.log('Initializing Coqui TTS with voice:', this.options.voice);
  }

  _transform(chunk, encoding, callback) {
    if (chunk.type === 'llm_response' && chunk.text) {
      this.queue.push(chunk.text);
      this.processQueue();
    }
    callback();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || this.stopped) {
      return;
    }
    
    this.isProcessing = true;
    const text = this.queue.shift();
    
    try {
      const audioData = await this.synthesizeSpeech(text);
      
      if (!this.stopped) {
        this.push({
          type: 'audio',
          data: audioData,
          format: 'wav',
          sampleRate: 48000,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Coqui TTS error:', error);
      this.emit('error', error);
    } finally {
      this.isProcessing = false;
      // Process next item in queue
      setImmediate(() => this.processQueue());
    }
  }

  async synthesizeSpeech(text) {
    // Clean text for TTS
    const cleanedText = this.cleanTextForTTS(text);
    
    // Generate unique filename
    const filename = `${uuidv4()}.wav`;
    const filepath = path.join(this.tempDir, filename);
    
    // In a real implementation, you would use the Coqui TTS Python API
    // For now, we'll simulate it with a placeholder
    // In production, integrate with actual Coqui TTS:
    // https://github.com/coqui-ai/TTS
    
    try {
      // Simulated Coqui TTS command
      // In reality: python -m TTS.api --text "..." --model_name "..." --out_path "..."
      const command = `echo "Synthesizing: ${cleanedText}" > ${filepath}`;
      await execAsync(command);
      
      // Read the generated audio file
      const audioData = await fs.readFile(filepath);
      
      // Clean up temp file
      await fs.unlink(filepath).catch(() => {});
      
      return audioData;
    } catch (error) {
      throw new Error(`TTS synthesis failed: ${error.message}`);
    }
  }

  cleanTextForTTS(text) {
    // Remove special characters and clean up for TTS
    return text
      .replace(/[*_~`]/g, '') // Remove markdown
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  stop() {
    this.stopped = true;
    this.queue = [];
  }

  resume() {
    this.stopped = false;
    this.processQueue();
  }

  // Voice customization presets
  static getVoicePresets() {
    return {
      'aura-2-thalia-en': {
        name: 'Thalia',
        gender: 'female',
        description: 'Warm and professional female voice',
        languages: ['en']
      },
      'aura-2-orion-en': {
        name: 'Orion',
        gender: 'male',
        description: 'Clear and authoritative male voice',
        languages: ['en']
      },
      'aura-2-luna-en': {
        name: 'Luna',
        gender: 'female',
        description: 'Friendly and approachable female voice',
        languages: ['en']
      },
      'aura-2-stella-en': {
        name: 'Stella',
        gender: 'female',
        description: 'Clear and articulate female voice',
        languages: ['en']
      }
    };
  }
}