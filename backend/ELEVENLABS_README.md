# Eleven Labs Text-to-Speech Integration

## Overview

This project integrates Eleven Labs' advanced text-to-speech (TTS) technology to power Julie AI, Dr. Pedro's dental office virtual assistant. The integration provides natural, low-latency voice synthesis for phone conversations, appointment booking, and patient support.

## Architecture

### Core Components

1. **ElevenLabsTTS Service** (`backend/services/elevenLabsTTS.js`)
   - Main TTS implementation with REST API and WebSocket support
   - Audio format conversion for multiple platforms
   - Intelligent caching system for repeated phrases
   - Multiple voice presets optimized for conversational AI

2. **Voice Service** (`backend/voiceService.js`)
   - Real-time phone call handling via Twilio
   - Voice Activity Detection (VAD) for natural conversations
   - Integration with speech-to-text (Whisper) and LLM (Claude)
   - Audio buffer management and processing

3. **Julie AI Service** (`backend/services/julieAI.js`)
   - Conversational AI for patient interactions
   - Intent detection and conversation flow management
   - Appointment booking integration
   - Emergency call handling

## Features

### Available Voices

The system includes 6 pre-configured professional voices:

| Voice ID | Name | Description | Use Case |
|----------|------|-------------|----------|
| `rachel` | Rachel | Professional female | Default business voice |
| `nicole` | Nicole | Friendly female | Julie AI primary voice |
| `domi` | Domi | Warm female | Alternative friendly option |
| `bella` | Bella | Natural female | Casual conversations |
| `antoni` | Antoni | Professional male | Male voice option |
| `elli` | Elli | Clear female | High clarity voice |

### Voice Configuration

Each voice can be customized with these parameters:
- **Stability** (0.0-1.0): Controls consistency of voice generation
- **Similarity Boost** (0.0-1.0): Enhances voice matching accuracy
- **Style** (0.0-1.0): Adjusts speaking style and emotion
- **Speaker Boost**: Enhances voice clarity and presence

### Models

- **eleven_turbo_v2**: Low-latency model for real-time conversations
- **eleven_monolingual_v1**: Standard quality model
- **eleven_multilingual_v2**: Multi-language support

## Setup Instructions

### 1. Environment Configuration

Add your Eleven Labs API key to `.env`:

```bash
ELEVENLABS_API_KEY=your_api_key_here
```

### 2. Installation

```bash
cd backend
npm install
```

### 3. Basic Usage

```javascript
import { ElevenLabsTTS } from './services/elevenLabsTTS.js';

// Initialize with default settings
const tts = new ElevenLabsTTS({
  voiceId: 'nicole',
  modelId: 'eleven_turbo_v2'
});

// Convert text to speech
const audioBuffer = await tts.textToSpeech("Hello, how can I help you today?");

// Stream audio for low latency
const audioStream = await tts.textToSpeechStream("Welcome to Dr. Pedro's office", {
  optimizeLatency: 4 // Maximum optimization
});
```

## API Reference

### ElevenLabsTTS Class

#### Constructor Options
```javascript
{
  voiceId: string,        // Voice ID or name (default: 'rachel')
  modelId: string,        // Model ID (default: 'eleven_turbo_v2')
  stability: number,      // 0.0-1.0 (default: 0.5)
  similarityBoost: number, // 0.0-1.0 (default: 0.75)
  style: number,          // 0.0-1.0 (default: 0.0)
  outputFormat: string    // Audio format (default: 'pcm_16000')
}
```

#### Methods

##### `getVoices()`
Fetches available voices from Eleven Labs API.

##### `textToSpeech(text, options)`
Converts text to speech with caching support.

##### `textToSpeechStream(text, options)`
Streams audio for ultra-low latency applications.

##### `initializeWebSocketStream(onAudioData, onError)`
Establishes WebSocket connection for real-time streaming.

##### `convertAudioFormat(audioData, fromFormat, toFormat)`
Converts between audio formats (PCM, mulaw, etc.).

## Phone Integration

### Twilio Setup

The system integrates with Twilio for phone calls:

1. Audio arrives as 8kHz μ-law from Twilio
2. Converted to 16kHz PCM for processing
3. TTS generates 16kHz PCM audio
4. Converted back to 8kHz μ-law for Twilio

### Voice Activity Detection

```javascript
const vad = new VAD(
  0.01,    // Threshold
  1000     // Silence duration (ms)
);

const { isSpeaking, endOfSpeech } = vad.detect(audioBuffer);
```

## Julie AI Integration

### Conversation Flow

1. **Greeting Stage**: Initial welcome and intent detection
2. **Information Gathering**: Collecting patient details
3. **Appointment Booking**: Checking availability and scheduling
4. **Closing**: Confirmation and follow-up

### System Prompts

Julie AI uses context-aware prompts that include:
- Current conversation stage
- Collected patient information
- Available appointment slots
- Emergency protocols

## Testing

### Voice Testing Scripts

Test individual voices:
```bash
node test-nicole-voice.js
node test-all-voices.js
```

### Integration Testing

Test full conversation flow:
```bash
node test-julie-booking.js
```

### Web Interface Testing

Open `backend/public/test-julie-voice.html` in a browser for interactive testing.

## Performance Optimization

### Caching

The system caches frequently used phrases:
- Maximum cache size: 100 entries
- LRU (Least Recently Used) eviction
- Automatic cache key generation

### Latency Optimization

For real-time applications:
```javascript
{
  optimizeLatency: 4,     // 0-4, higher = lower latency
  modelId: 'eleven_turbo_v2',
  chunk_length_schedule: [50] // 50ms chunks
}
```

### Audio Streaming

- WebSocket streaming for minimal latency
- Chunked audio delivery (20ms chunks)
- Parallel processing pipeline

## Error Handling

### Fallback Mechanism

If Eleven Labs fails, the system automatically falls back to:
1. Coqui TTS (via Hugging Face)
2. Basic text responses (last resort)

### Error Recovery

```javascript
try {
  const audio = await tts.textToSpeechStream(text);
} catch (elevenLabsError) {
  console.error('ElevenLabs failed, using fallback:', elevenLabsError);
  // Fallback to Coqui TTS
}
```

## Monitoring

### Health Check Endpoint

```javascript
GET /api/health/tts

Response:
{
  "status": "healthy",
  "elevenLabs": true,
  "fallbackAvailable": true,
  "activeSessions": 2,
  "cacheHitRate": 0.85
}
```

### Logging

All TTS operations are logged with:
- Request/response times
- Cache hit/miss statistics
- Error details with fallback actions
- Audio format conversions

## Cost Optimization

### Best Practices

1. **Use Caching**: Repeated phrases are cached automatically
2. **Optimize Text**: Keep responses concise for phone conversations
3. **Model Selection**: Use `eleven_turbo_v2` for best latency/cost ratio
4. **Batch Processing**: Group similar requests when possible

### Usage Tracking

Monitor API usage through Eleven Labs dashboard or implement custom tracking:
```javascript
const usage = await tts.getUsageStats();
console.log(`Characters used: ${usage.charactersUsed}`);
```

## Security

### API Key Protection

- Store API keys in environment variables
- Never commit `.env` files
- Use secure key rotation practices

### Audio Data Handling

- Audio streams are not persisted by default
- Patient conversations are logged securely in Supabase
- Implement data retention policies

## Troubleshooting

### Common Issues

1. **API Key Invalid**
   - Verify key in Eleven Labs dashboard
   - Check for whitespace in `.env` file

2. **Voice Not Found**
   - Use `getVoices()` to list available voices
   - Verify voice ID matches exactly

3. **High Latency**
   - Switch to `eleven_turbo_v2` model
   - Increase `optimizeLatency` parameter
   - Check network connectivity

4. **Audio Format Issues**
   - Verify Twilio expects 8kHz μ-law
   - Check audio conversion functions
   - Test with different output formats

### Debug Mode

Enable detailed logging:
```javascript
const tts = new ElevenLabsTTS({
  debug: true,
  logLevel: 'verbose'
});
```

## Future Enhancements

### Planned Features

1. **Multi-language Support**: Spanish voice options for bilingual support
2. **Emotion Detection**: Adjust voice tone based on conversation context
3. **Voice Cloning**: Custom voice for Dr. Pedro
4. **Advanced Caching**: Redis integration for distributed caching

### Integration Roadmap

- WhatsApp voice messages
- Video consultation audio
- IVR system enhancement
- Voice analytics dashboard

## Support

### Resources

- [Eleven Labs Documentation](https://docs.elevenlabs.io/)
- [API Reference](https://api.elevenlabs.io/docs)
- [Voice Library](https://elevenlabs.io/voice-library)

### Contact

For issues or questions:
- Create an issue in the project repository
- Contact Eleven Labs support for API issues
- Review logs in `backend/logs/tts-errors.log`

## License

This integration is part of Dr. Pedro's dental practice management system. Ensure compliance with Eleven Labs' terms of service and HIPAA regulations for patient data handling.