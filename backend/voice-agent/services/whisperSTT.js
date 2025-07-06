import { Transform } from 'stream';
import OpenAI from 'openai';

export class WhisperSTT extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.options = {
      model: options.model || 'whisper-1',
      language: options.language || 'en',
      temperature: options.temperature || 0.0,
      prompt: options.prompt || 'Medical consultation at a dental office.'
    };
    
    this.audioBuffer = [];
    this.processing = false;
    this.silenceTimeout = null;
    this.silenceThreshold = 1000; // 1 second of silence
  }

  _transform(chunk, encoding, callback) {
    // Accumulate audio chunks
    this.audioBuffer.push(chunk);
    
    // Reset silence timer
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
    }
    
    // Set new silence timer
    this.silenceTimeout = setTimeout(() => {
      this.processAudio();
    }, this.silenceThreshold);
    
    callback();
  }

  async processAudio() {
    if (this.processing || this.audioBuffer.length === 0) {
      return;
    }
    
    this.processing = true;
    const audioData = Buffer.concat(this.audioBuffer);
    this.audioBuffer = [];
    
    try {
      // Create a temporary file for the audio (Whisper requires file input)
      const audioFile = new File([audioData], 'audio.webm', { type: 'audio/webm' });
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: audioFile,
        model: this.options.model,
        language: this.options.language,
        temperature: this.options.temperature,
        prompt: this.options.prompt
      });
      
      if (transcription.text && transcription.text.trim()) {
        // Emit transcribed text
        this.push({
          type: 'transcription',
          text: transcription.text.trim(),
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Whisper STT error:', error);
      this.emit('error', error);
    } finally {
      this.processing = false;
    }
  }

  _flush(callback) {
    // Process any remaining audio
    this.processAudio().then(() => callback());
  }
}