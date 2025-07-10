# ElevenLabs TTS Setup for Julie AI

This guide explains how to set up and use ElevenLabs Text-to-Speech for Julie, Dr. Pedro's AI assistant.

## Overview

We've integrated ElevenLabs to provide an incredible, natural-sounding voice for Julie. The integration includes:
- Ultra-low latency streaming for real-time conversation
- Professional female voice (Rachel) that sounds warm and approachable
- Fallback to Coqui TTS if ElevenLabs is unavailable
- WebSocket streaming for the lowest possible latency

## Setup Instructions

### 1. Get Your ElevenLabs API Key

1. Sign up at [ElevenLabs](https://elevenlabs.io)
2. Go to your Profile Settings
3. Copy your API key

### 2. Set Environment Variable

Add to your `.env` file:
```bash
ELEVENLABS_API_KEY=your_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

## Voice Configuration

Julie uses the **Rachel** voice by default, which is a professional, warm female voice perfect for a medical receptionist. 

Available voice options:
- **Rachel** (default) - Professional female, warm and clear
- **Domi** - Warm female, slightly deeper tone
- **Nicole** - Friendly female, approachable
- **Elli** - Clear female, articulate

## Features

### 1. Ultra-Low Latency
- Uses `eleven_turbo_v2` model for fastest response
- WebSocket streaming for real-time audio
- Sentence splitting for incremental responses

### 2. Natural Conversation
- Voice settings optimized for natural speech:
  - Stability: 0.5 (balanced)
  - Similarity Boost: 0.75 (consistent voice)
  - Style: 0.0 (professional tone)

### 3. Automatic Fallback
- If ElevenLabs fails, automatically falls back to Coqui TTS
- Ensures Julie is always available to help patients

## Usage

### In Voice Service (Twilio)
The voice service automatically uses ElevenLabs when available:
```javascript
// Automatically initialized in voiceService.js
const voiceService = new VoiceService();
// Uses ElevenLabs for TTS with automatic fallback
```

### In Voice Agent (WebRTC/LiveKit)
The voice agent pipeline uses ElevenLabs for real-time streaming:
```javascript
// Automatically configured in pipecatService.js
const pipeline = await pipecatService.createVoiceAgentPipeline(sessionId, roomName);
// Uses ElevenLabs with WebSocket streaming
```

## Customization

### Change Voice
To use a different voice, update the configuration:
```javascript
// In elevenLabsTTS.js constructor
voiceId: 'domi', // Change to desired voice
```

### Adjust Voice Settings
Fine-tune the voice characteristics:
```javascript
voiceSettings: {
  stability: 0.6,        // 0-1, higher = more consistent
  similarity_boost: 0.8, // 0-1, higher = more like original voice
  style: 0.2,           // 0-1, higher = more expressive
  use_speaker_boost: true
}
```

### Voice Presets
Use predefined voice presets for different scenarios:
```javascript
// Professional (default)
tts.setVoicePreset('professional');

// Warm and empathetic
tts.setVoicePreset('warm');

// Friendly and approachable
tts.setVoicePreset('friendly');

// Clear and articulate
tts.setVoicePreset('clear');
```

## Monitoring and Debugging

### Check API Usage
Monitor your ElevenLabs usage at: https://elevenlabs.io/usage

### Debug Logs
Enable debug logging by setting:
```javascript
console.log('ElevenLabs TTS initialized successfully');
```

### Common Issues

1. **API Key Not Set**
   - Error: `ELEVENLABS_API_KEY environment variable is required`
   - Solution: Add the API key to your .env file

2. **Rate Limiting**
   - Error: `429 Too Many Requests`
   - Solution: Upgrade your ElevenLabs plan or implement request throttling

3. **WebSocket Connection Failed**
   - Falls back to REST API automatically
   - Check firewall settings for WebSocket connections

## Cost Optimization

1. **Use Caching**: Common phrases are cached automatically
2. **Sentence Splitting**: Reduces character count by processing incrementally
3. **Model Selection**: `eleven_turbo_v2` balances quality and cost

## Testing

Test Julie's voice:
```bash
# Test voice service
node test-julie-voice.js

# Test specific phrases
curl -X POST http://localhost:3000/api/voice/test-tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is Julie from Dr. Pedro's office. How can I help you today?"}'
```

## Support

For issues or questions:
1. Check ElevenLabs documentation: https://docs.elevenlabs.io
2. Review error logs in the console
3. Contact ElevenLabs support for API issues

Julie's voice is now powered by ElevenLabs for the most natural, professional patient interactions!