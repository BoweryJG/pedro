import { Room, RoomEvent, LocalParticipant, Track, createLocalTracks } from 'livekit-client';
import { PassThrough } from 'stream';
import { EventEmitter } from 'events';

export class LiveKitTransport extends EventEmitter {
  constructor(options = {}) {
    super();
    
    this.options = {
      roomName: options.roomName,
      participantName: options.participantName || 'AI_Assistant',
      serverUrl: process.env.LIVEKIT_URL || options.serverUrl,
      token: options.token
    };
    
    this.room = null;
    this.audioTrack = null;
    this.audioInput = new PassThrough({ objectMode: true });
    this.audioOutput = new PassThrough({ objectMode: true });
    this.isConnected = false;
  }

  async connect(token) {
    try {
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up room event handlers
      this.setupRoomEventHandlers();

      // Connect to the room
      await this.room.connect(this.options.serverUrl, token || this.options.token);
      this.isConnected = true;

      console.log(`Connected to LiveKit room: ${this.options.roomName}`);

      // Create local audio track for AI responses
      await this.setupLocalAudioTrack();

    } catch (error) {
      console.error('Failed to connect to LiveKit:', error);
      throw error;
    }
  }

  setupRoomEventHandlers() {
    // Handle when a participant joins
    this.room.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`Participant joined: ${participant.identity}`);
      this.subscribeToParticipantTracks(participant);
    });

    // Handle when a participant leaves
    this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`Participant left: ${participant.identity}`);
    });

    // Handle track subscriptions
    this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (track.kind === Track.Kind.Audio) {
        console.log(`Subscribed to audio from ${participant.identity}`);
        this.handleIncomingAudio(track);
      }
    });

    // Handle connection quality changes
    this.room.on(RoomEvent.ConnectionQualityChanged, (quality, participant) => {
      console.log(`Connection quality for ${participant.identity}: ${quality}`);
    });

    // Handle room disconnection
    this.room.on(RoomEvent.Disconnected, () => {
      console.log('Disconnected from room');
      this.isConnected = false;
      this.emit('disconnected');
    });
  }

  subscribeToParticipantTracks(participant) {
    // Subscribe to all tracks from the participant
    participant.tracks.forEach((publication) => {
      if (publication.kind === Track.Kind.Audio && !publication.isSubscribed) {
        publication.setSubscribed(true);
      }
    });
  }

  handleIncomingAudio(audioTrack) {
    const audioElement = audioTrack.attach();
    
    // Create audio context for processing
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(audioElement.srcObject);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      const audioData = e.inputBuffer.getChannelData(0);
      
      // Convert Float32Array to Buffer for pipeline
      const buffer = Buffer.from(audioData.buffer);
      
      // Push audio data to the pipeline
      this.audioInput.push({
        type: 'audio_chunk',
        data: buffer,
        sampleRate: audioContext.sampleRate,
        timestamp: Date.now()
      });
    };

    source.connect(processor);
    processor.connect(audioContext.destination);
  }

  async setupLocalAudioTrack() {
    // Create a silent audio track initially
    // Will be replaced with TTS output
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Set gain to 0 for silence
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    // Create media stream from audio context
    const destination = audioContext.createMediaStreamDestination();
    gainNode.connect(destination);

    // Create LiveKit audio track
    const [audioTrack] = await createLocalTracks({
      audio: {
        source: destination.stream.getAudioTracks()[0]
      }
    });

    this.audioTrack = audioTrack;

    // Publish the track
    await this.room.localParticipant.publishTrack(audioTrack);

    // Set up audio output handling
    this.setupAudioOutput();
  }

  setupAudioOutput() {
    // Process TTS output and send to LiveKit
    this.audioOutput.on('data', async (chunk) => {
      if (chunk.type === 'audio' && chunk.data && this.audioTrack) {
        // In a real implementation, you would:
        // 1. Convert the audio data to the appropriate format
        // 2. Stream it through the audio track
        // This is a simplified version
        
        try {
          // Process and send audio
          await this.streamAudioData(chunk.data);
        } catch (error) {
          console.error('Error streaming audio:', error);
        }
      }
    });
  }

  async streamAudioData(audioData) {
    // This would involve proper audio streaming to LiveKit
    // Implementation depends on the specific audio format and LiveKit SDK capabilities
    console.log('Streaming audio data to LiveKit, size:', audioData.length);
  }

  audioInput() {
    return this.audioInput;
  }

  audioOutput() {
    return this.audioOutput;
  }

  async disconnect() {
    if (this.room) {
      await this.room.disconnect();
      this.room = null;
      this.audioTrack = null;
      this.isConnected = false;
    }
  }

  getConnectionState() {
    return {
      isConnected: this.isConnected,
      roomName: this.options.roomName,
      participantCount: this.room ? this.room.participants.size : 0,
      connectionQuality: this.room?.localParticipant?.connectionQuality || 'unknown'
    };
  }
}