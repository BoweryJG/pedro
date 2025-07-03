import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import VoiceService from './voiceService.js';

// WebRTC Voice Service - No phone numbers needed!
class WebRTCVoiceService extends VoiceService {
  constructor() {
    super();
    this.webrtcConnections = new Map();
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tsmtaarwgodklafqlbhm.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn('Supabase credentials not found - transcripts will not be saved');
    }
  }

  // Handle WebRTC signaling
  handleSignaling(ws, message) {
    const data = JSON.parse(message);
    const { type, sessionId, signal } = data;

    switch (type) {
      case 'start-call':
        this.startCall(ws, sessionId);
        break;
      
      case 'signal':
        this.handleWebRTCSignal(ws, sessionId, signal);
        break;
        
      case 'audio-data':
        this.processAudioData(sessionId, data.audio);
        break;
        
      case 'end-call':
        this.endCall(sessionId);
        break;
    }
  }

  // Start a new WebRTC call session
  async startCall(ws, sessionId) {
    const connection = {
      ws,
      sessionId: sessionId || uuidv4(),
      audioBuffer: [],
      vad: new this.VAD(),
      conversationManager: new this.ConversationManager(),
      isProcessing: false,
      startTime: Date.now(),
      transcript: [],
      dbRecordId: null
    };
    
    this.webrtcConnections.set(connection.sessionId, connection);
    
    // Create database record
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('voice_calls')
          .insert({
            session_id: connection.sessionId,
            call_type: 'webrtc',
            transcript: []
          })
          .select()
          .single();
          
        if (data) {
          connection.dbRecordId = data.id;
        }
        if (error) console.error('Error creating voice call record:', error);
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }
    
    // Send session ready
    ws.send(JSON.stringify({
      type: 'session-ready',
      sessionId: connection.sessionId
    }));
    
    // Send initial greeting after short delay
    setTimeout(async () => {
      const greeting = "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?";
      await this.sendTextResponse(connection, greeting);
      await this.sendAudioResponse(connection, greeting);
    }, 500);
    
    console.log(`WebRTC voice session started: ${connection.sessionId}`);
  }

  // Process incoming audio data from browser
  async processAudioData(sessionId, audioDataBase64) {
    const connection = this.webrtcConnections.get(sessionId);
    if (!connection || connection.isProcessing) return;
    
    try {
      // Decode base64 audio data
      const audioBuffer = Buffer.from(audioDataBase64, 'base64');
      
      // Convert from browser's PCM format to our processing format
      const pcm16 = new Int16Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.length / 2);
      
      // Add to buffer
      connection.audioBuffer.push(...pcm16);
      
      // Check VAD
      const vadResult = connection.vad.detect(pcm16);
      
      if (vadResult.endOfSpeech && connection.audioBuffer.length > 8000) {
        await this.processAudioBuffer(connection);
      }
      
      // Prevent buffer overflow
      if (connection.audioBuffer.length > 160000) {
        connection.audioBuffer = connection.audioBuffer.slice(-80000);
      }
    } catch (error) {
      console.error('Audio processing error:', error);
    }
  }

  // Process accumulated audio buffer (reuse from parent class)
  async processAudioBuffer(connection) {
    if (connection.isProcessing || connection.audioBuffer.length < 8000) return;
    
    connection.isProcessing = true;
    
    try {
      // Convert buffer to proper format
      const audioData = new Int16Array(connection.audioBuffer);
      
      // Clear buffer
      connection.audioBuffer = [];
      
      // Speech to text
      const transcript = await this.speechToText(audioData);
      console.log('Transcript:', transcript);
      
      if (transcript && transcript.trim().length > 0) {
        // Send transcript to frontend for display
        this.sendTextResponse(connection, transcript, 'user');
        
        // Generate response
        const response = await this.generateResponse(
          connection.conversationManager,
          transcript
        );
        
        // Send text response for display
        await this.sendTextResponse(connection, response, 'assistant');
        
        // Send audio response
        await this.sendAudioResponse(connection, response);
      }
    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      connection.isProcessing = false;
    }
  }

  // Send text response to frontend and save to database
  async sendTextResponse(connection, text, role = 'assistant') {
    const timestamp = Date.now();
    
    // Add to connection transcript
    connection.transcript.push({ role, text, timestamp });
    
    // Send to frontend
    if (connection.ws.readyState === 1) { // WebSocket.OPEN
      connection.ws.send(JSON.stringify({
        type: 'transcript',
        role,
        text,
        timestamp
      }));
    }
    
    // Update database
    if (this.supabase && connection.dbRecordId) {
      try {
        await this.supabase
          .from('voice_calls')
          .update({
            transcript: connection.transcript,
            patient_info: connection.conversationManager.state.patientInfo
          })
          .eq('id', connection.dbRecordId);
      } catch (err) {
        console.error('Error updating transcript:', err);
      }
    }
  }

  // Send audio response to browser
  async sendAudioResponse(connection, text) {
    try {
      // Convert text to speech
      const audioData = await this.textToSpeech(text);
      
      // Convert mulaw to PCM for browser playback
      const pcm16 = this.mulawToLinear16(audioData);
      
      // Convert to base64 for transmission
      const audioBase64 = Buffer.from(pcm16.buffer).toString('base64');
      
      // Send audio data to browser
      if (connection.ws.readyState === 1) {
        connection.ws.send(JSON.stringify({
          type: 'audio-response',
          audio: audioBase64,
          sampleRate: 8000
        }));
      }
    } catch (error) {
      console.error('Send audio error:', error);
    }
  }

  // End call and cleanup
  async endCall(sessionId) {
    const connection = this.webrtcConnections.get(sessionId);
    if (connection) {
      const duration = Math.floor((Date.now() - connection.startTime) / 1000);
      console.log(`Call ended. Session: ${sessionId}, Duration: ${duration}s`);
      
      // Update database with final info
      if (this.supabase && connection.dbRecordId) {
        try {
          // Generate summary
          const summary = this.generateCallSummary(connection);
          
          await this.supabase
            .from('voice_calls')
            .update({
              ended_at: new Date().toISOString(),
              duration_seconds: duration,
              transcript: connection.transcript,
              patient_info: connection.conversationManager.state.patientInfo,
              summary,
              appointment_booked: connection.conversationManager.state.appointmentDetails !== null
            })
            .eq('id', connection.dbRecordId);
        } catch (err) {
          console.error('Error updating final call record:', err);
        }
      }
      
      // Send call ended confirmation
      if (connection.ws.readyState === 1) {
        connection.ws.send(JSON.stringify({
          type: 'call-ended',
          duration
        }));
      }
      
      this.webrtcConnections.delete(sessionId);
    }
  }
  
  // Generate call summary
  generateCallSummary(connection) {
    const { patientInfo, appointmentDetails, stage } = connection.conversationManager.state;
    let summary = `Call duration: ${Math.floor((Date.now() - connection.startTime) / 1000)}s. `;
    
    if (patientInfo.name) {
      summary += `Patient: ${patientInfo.name}. `;
    }
    
    if (appointmentDetails) {
      summary += `Appointment booked for ${appointmentDetails.date} at ${appointmentDetails.time}. `;
    }
    
    if (stage === 'emergency') {
      summary += `Emergency call - patient was advised appropriately. `;
    }
    
    summary += `Total messages: ${connection.transcript.length}.`;
    
    return summary;
  }

  // Inherit VAD and ConversationManager from parent
  get VAD() {
    // Return the VAD class from parent
    return class VAD {
      constructor(threshold = 0.01, silenceDuration = 1000) {
        this.threshold = threshold;
        this.silenceDuration = silenceDuration;
        this.lastSpeechTime = Date.now();
        this.isSpeaking = false;
      }

      detect(audioBuffer) {
        const rms = Math.sqrt(audioBuffer.reduce((sum, val) => sum + val * val, 0) / audioBuffer.length) / 32768;
        const now = Date.now();
        
        if (rms > this.threshold) {
          this.lastSpeechTime = now;
          this.isSpeaking = true;
          return { isSpeaking: true, endOfSpeech: false };
        }
        
        const silenceTime = now - this.lastSpeechTime;
        if (this.isSpeaking && silenceTime > this.silenceDuration) {
          this.isSpeaking = false;
          return { isSpeaking: false, endOfSpeech: true };
        }
        
        return { isSpeaking: false, endOfSpeech: false };
      }
    };
  }

  get ConversationManager() {
    // Return the ConversationManager class from parent
    return class ConversationManager {
      constructor() {
        this.state = {
          context: [],
          patientInfo: {},
          appointmentDetails: null,
          stage: 'greeting'
        };
      }

      addMessage(role, content) {
        this.state.context.push({ role, content });
        if (this.state.context.length > 10) {
          this.state.context = this.state.context.slice(-10);
        }
      }

      updatePatientInfo(info) {
        this.state.patientInfo = { ...this.state.patientInfo, ...info };
      }

      getSystemPrompt() {
        return `You are Julie, Dr. Pedro's warm and professional dental office AI assistant handling voice conversations. 
You speak naturally and conversationally.
Keep responses concise and natural for voice conversation.

Current conversation stage: ${this.state.stage}

Patient information collected so far:
${JSON.stringify(this.state.patientInfo, null, 2)}

Your capabilities:
- Answer questions about dental services and pricing
- Book new appointments or reschedule existing ones
- Collect patient information (name, phone, insurance, concern)
- Provide emergency guidance
- Connect patients with live team members when they request it

Important: If a patient asks to speak with a human, doctor, or live person, say:
"I'd be happy to connect you with our team right away. Dr. Pedro or one of our specialists will call you back within 5 minutes. What's the best number to reach you?"

Always:
- Be warm, empathetic, and professional
- Keep responses brief and conversational (2-3 sentences max)
- Ask one question at a time
- Confirm important details
- Use natural speech patterns
- If emergency, immediately ask if they need to go to ER

For appointment booking:
- Collect: name, phone number, preferred date/time, dental concern
- Offer available slots (pretend to check calendar)
- Confirm all details before booking`;
      }

      determineStage(transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        if (lowerTranscript.includes('emergency') || lowerTranscript.includes('pain') || lowerTranscript.includes('bleeding')) {
          this.state.stage = 'emergency';
        } else if (lowerTranscript.includes('appointment') || lowerTranscript.includes('book') || lowerTranscript.includes('schedule')) {
          this.state.stage = 'appointment_booking';
        } else if (this.state.context.length > 8) {
          this.state.stage = 'closing';
        }
      }
    };
  }

  // Convert mulaw to PCM16
  mulawToLinear16(mulaw) {
    const MULAW_BIAS = 33;
    const pcm16 = new Int16Array(mulaw.length);
    
    for (let i = 0; i < mulaw.length; i++) {
      let byte = ~mulaw[i];
      let sign = byte & 0x80;
      let exponent = (byte & 0x70) >> 4;
      let mantissa = byte & 0x0F;
      let sample = mantissa << (exponent + 3);
      sample += MULAW_BIAS << (exponent + 2);
      if (sign === 0) sample = -sample;
      pcm16[i] = sample;
    }
    
    return pcm16;
  }
}

export default WebRTCVoiceService;