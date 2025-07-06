# Pedro AI Voice Agent

A WebRTC-based AI voice assistant for Dr. Pedro's Advanced Dental Care & MedSpa, powered by Pipecat, LiveKit, and open-source AI models.

## Features

- **WebRTC-Based**: No phone numbers required - patients connect directly through their browser
- **Human-like Voice**: Uses Coqui TTS for natural-sounding voices with customizable accents
- **Specialized Knowledge**: Trained on:
  - Yomi Robotic Implants (FDA-approved dental robot)
  - EmFace by BTL Aesthetics (non-invasive facial treatments)
  - TMJ treatments (Dr. Pedro's specialty)
  - General dental and aesthetic procedures
- **Real-time Conversation**: Low-latency voice interactions with interruption handling
- **Appointment Booking**: Integrated with existing scheduling system
- **HIPAA Compliant**: Secure, encrypted communications

## Technology Stack

- **Pipecat**: Voice agent orchestration framework
- **LiveKit**: WebRTC infrastructure for real-time communication
- **Whisper**: OpenAI's speech-to-text model
- **GPT-4**: Language model for conversation
- **Coqui TTS**: Open-source text-to-speech with voice cloning
- **Node.js/Express**: Backend integration
- **React**: Frontend WebRTC interface

## Setup

1. **Install Dependencies**
   ```bash
   cd backend/voice-agent
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **LiveKit Setup**
   - Option 1: Use LiveKit Cloud (recommended for production)
     - Sign up at https://livekit.io
     - Create a project and get your API keys
   - Option 2: Self-host LiveKit server
     - Follow instructions at https://docs.livekit.io/self-hosting/

4. **Start the Voice Agent**
   ```bash
   npm start
   ```

## Integration with Existing Backend

The voice agent is integrated into the main backend at `/api/voice-agent/*` endpoints:

- `POST /api/voice-agent/token` - Generate LiveKit token for client
- `POST /api/voice-agent/start-session` - Start a voice session
- `POST /api/voice-agent/end-session` - End a voice session
- `GET /api/voice-agent/session/:sessionId` - Get session status

## Frontend Integration

Add the WebRTCVoiceAgent component to any page:

```jsx
import WebRTCVoiceAgent from './components/WebRTCVoiceAgent';

function App() {
  return (
    <WebRTCVoiceAgent 
      onSessionEnd={(sessionId) => console.log('Session ended:', sessionId)}
    />
  );
}
```

## Voice Customization

### Available Voices (Coqui TTS)
- **Thalia** (default): Warm, professional female voice
- **Orion**: Clear, authoritative male voice
- **Luna**: Friendly, approachable female voice
- **Stella**: Clear, articulate female voice

### Customizing the System Prompt

Edit the system prompt in `services/pipecatService.js`:

```javascript
getMedicalSystemPrompt() {
  return `Your custom prompt here...`;
}
```

## Conversation Flows

The AI agent handles:

1. **Appointment Booking**
   - Checks availability
   - Collects patient information
   - Confirms booking

2. **Procedure Information**
   - Yomi robotic implants details
   - EmFace treatment explanation
   - TMJ treatment options
   - General dental services

3. **Directions & Contact**
   - Office location: 4300 Hylan Blvd, Staten Island, NY
   - Hours of operation
   - Parking information

4. **Financing**
   - Insurance verification
   - Payment plan options
   - Cost estimates

## Deployment

### On Render (Recommended)

1. Add voice agent to existing backend deployment
2. Set environment variables in Render dashboard
3. The voice agent will be available at your backend URL

### Standalone Deployment

```bash
NODE_ENV=production npm start
```

## Monitoring

- Active sessions: `GET /api/voice-agent/sessions`
- Health check: `GET /api/voice-agent/health`
- Logs are written to console and can be monitored via Render logs

## Security

- All WebRTC connections are encrypted
- LiveKit handles media routing securely
- No call recordings are stored by default
- HIPAA compliance through encrypted transport

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check LiveKit credentials
   - Verify CORS settings
   - Ensure WebSocket connections are allowed

2. **Poor Audio Quality**
   - Check network bandwidth
   - Verify echo cancellation is enabled
   - Adjust audio bitrate in config

3. **Agent Not Responding**
   - Check OpenAI API key
   - Verify Supabase connection
   - Review system logs

## Support

For issues or questions, contact the development team or check the logs in Render dashboard.