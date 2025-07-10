import { Transform } from 'stream';
import { ElevenLabsTTS as ElevenLabsBase } from '../../services/elevenLabsTTS.js';

/**
 * ElevenLabs TTS Stream for Voice Agent Pipeline
 * Provides real-time, streaming TTS with ultra-low latency
 */
export class ElevenLabsTTS extends Transform {
  constructor(options = {}) {
    super({ objectMode: true });
    
    // Initialize base ElevenLabs service with Julie's voice
    this.tts = new ElevenLabsBase({
      voiceId: options.voiceId || 'rachel', // Professional female voice
      modelId: options.modelId || 'eleven_turbo_v2',
      stability: options.stability || 0.5,
      similarityBoost: options.similarityBoost || 0.75,
      style: options.style || 0.0,
      outputFormat: 'pcm_48000' // 48kHz for WebRTC
    });
    
    this.isProcessing = false;
    this.queue = [];
    this.stopped = false;
    
    // WebSocket streaming for ultra-low latency
    this.useWebSocketStream = options.useWebSocketStream || true;
    this.wsInitialized = false;
    
    // Sentence splitting for incremental TTS
    this.enableSentenceSplitting = options.enableSentenceSplitting || true;
    this.partialBuffer = '';
    
    console.log('ElevenLabs TTS Stream initialized with voice:', options.voiceId || 'rachel');
  }
  
  async initializeWebSocket() {
    if (this.wsInitialized || !this.useWebSocketStream) return;
    
    try {
      await this.tts.initializeWebSocketStream(
        (audioChunk) => this.handleAudioChunk(audioChunk),
        (error) => this.emit('error', error)
      );
      this.wsInitialized = true;
      console.log('ElevenLabs WebSocket stream initialized');
    } catch (error) {
      console.error('Failed to initialize WebSocket stream:', error);
      this.useWebSocketStream = false;
    }
  }
  
  _transform(chunk, encoding, callback) {
    if (chunk.type === 'llm_response' && chunk.text) {
      if (this.enableSentenceSplitting) {
        // Process text incrementally for faster response
        this.processIncrementalText(chunk.text);
      } else {
        // Process full text
        this.queue.push(chunk.text);
        this.processQueue();
      }
    }
    callback();
  }
  
  processIncrementalText(text) {
    this.partialBuffer += text;
    
    // Split by sentence endings
    const sentenceEndings = /[.!?]+\s+/g;
    const sentences = this.partialBuffer.split(sentenceEndings);
    
    // Keep the last incomplete sentence in buffer
    if (sentences.length > 1) {
      this.partialBuffer = sentences.pop();
      
      // Process complete sentences
      sentences.forEach(sentence => {
        if (sentence.trim()) {
          this.queue.push(sentence.trim());
        }
      });
      
      this.processQueue();
    }
  }
  
  async processQueue() {
    if (this.isProcessing || this.queue.length === 0 || this.stopped) {
      return;
    }
    
    this.isProcessing = true;
    const text = this.queue.shift();
    
    try {
      if (this.useWebSocketStream && this.wsInitialized) {
        // Use WebSocket for ultra-low latency
        this.tts.sendTextToStream(text);
      } else {
        // Use REST API streaming
        const audioStream = await this.tts.textToSpeechStream(text, {
          optimizeLatency: 4 // Maximum latency optimization
        });
        
        audioStream.on('data', (chunk) => {
          this.handleAudioChunk(chunk);
        });
        
        await new Promise((resolve, reject) => {
          audioStream.on('end', resolve);
          audioStream.on('error', reject);
        });
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error);
      this.emit('error', error);
    } finally {
      this.isProcessing = false;
      // Process next item in queue
      setImmediate(() => this.processQueue());
    }
  }
  
  handleAudioChunk(audioData) {
    if (!this.stopped) {
      this.push({
        type: 'audio',
        data: audioData,
        format: 'pcm_48000',
        sampleRate: 48000,
        timestamp: Date.now()
      });
    }
  }
  
  // Flush any remaining partial text
  flush() {
    if (this.partialBuffer.trim()) {
      this.queue.push(this.partialBuffer.trim());
      this.partialBuffer = '';
      this.processQueue();
    }
  }
  
  stop() {
    this.stopped = true;
    this.queue = [];
    this.partialBuffer = '';
    if (this.useWebSocketStream && this.wsInitialized) {
      this.tts.closeStream();
      this.wsInitialized = false;
    }
  }
  
  resume() {
    this.stopped = false;
    if (this.useWebSocketStream && !this.wsInitialized) {
      this.initializeWebSocket();
    }
    this.processQueue();
  }
  
  // Voice customization for different scenarios
  setVoicePreset(preset) {
    const presets = ElevenLabsBase.getJulieVoicePresets();
    
    if (presets[preset]) {
      const settings = presets[preset];
      this.tts.voiceId = this.tts.voices[settings.voiceId] || settings.voiceId;
      this.tts.modelId = settings.modelId;
      this.tts.voiceSettings = settings.voiceSettings;
      
      console.log(`Voice preset changed to: ${preset}`);
      
      // Reinitialize WebSocket if needed
      if (this.useWebSocketStream && this.wsInitialized) {
        this.tts.closeStream();
        this.wsInitialized = false;
        this.initializeWebSocket();
      }
    }
  }
  
  // Get available voices
  static async getAvailableVoices() {
    try {
      const tts = new ElevenLabsBase();
      return await tts.getVoices();
    } catch (error) {
      console.error('Failed to get available voices:', error);
      return [];
    }
  }
}

export default ElevenLabsTTS;