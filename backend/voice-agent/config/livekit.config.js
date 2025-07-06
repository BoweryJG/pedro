import { AccessToken } from 'livekit-server-sdk';

export const livekitConfig = {
  // LiveKit server URL - can use cloud or self-hosted
  serverUrl: process.env.LIVEKIT_URL || 'wss://your-project.livekit.cloud',
  apiKey: process.env.LIVEKIT_API_KEY,
  apiSecret: process.env.LIVEKIT_API_SECRET,
  
  // Room configuration
  roomOptions: {
    name: 'medical-consultation',
    emptyTimeout: 300, // 5 minutes
    maxParticipants: 2, // Agent + Patient
    metadata: JSON.stringify({
      purpose: 'medical_consultation',
      practice: 'Dr. Pedro Advanced Dental Care'
    })
  },
  
  // Audio configuration for high quality voice
  audioOptions: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    bitrate: 64000, // 64kbps for clear voice
    sampleRate: 48000
  }
};

// Generate access token for participants
export function generateToken(participantName, isAgent = false) {
  const at = new AccessToken(
    livekitConfig.apiKey,
    livekitConfig.apiSecret,
    {
      identity: participantName,
      metadata: JSON.stringify({
        role: isAgent ? 'agent' : 'patient'
      })
    }
  );

  at.addGrant({
    roomJoin: true,
    room: livekitConfig.roomOptions.name,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true
  });

  return at.toJwt();
}

// WebRTC configuration for optimal performance
export const webrtcConfig = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302'
      ]
    }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};