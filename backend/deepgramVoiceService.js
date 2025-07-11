import WebSocket from 'ws';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import VoiceService from './voiceService.js';

// Deepgram Voice Agent Service
class DeepgramVoiceService extends VoiceService {
  constructor() {
    super();
    this.deepgramApiKey = process.env.DEEPGRAM_API_KEY || '4beb44e547c8ef520a575d343315b9d0dae38549';
    this.connections = new Map();
    
    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tsmtaarwgodklafqlbhm.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
    
    // Initialize Twilio client
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (twilioAccountSid && twilioAuthToken) {
      this.twilioClient = twilio(twilioAccountSid, twilioAuthToken);
      console.log('Twilio initialized with phone number:', this.twilioPhoneNumber);
    } else {
      console.warn('Twilio credentials not found');
    }
  }

  // Initialize Deepgram Voice Agent connection
  async initializeDeepgramAgent(callSid) {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket('wss://api.deepgram.com/v1/agent', {
        headers: {
          'Authorization': `Token ${this.deepgramApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const connection = {
        ws,
        callSid,
        conversationManager: new this.ConversationManager(),
        isConnected: false,
        audioQueue: [],
        startTime: Date.now(),
        transcript: []
      };

      ws.on('open', () => {
        console.log(`Deepgram Voice Agent connected for call ${callSid}`);
        
        // Send configuration
        ws.send(JSON.stringify({
          type: 'config',
          config: {
            audio: {
              input: {
                encoding: 'mulaw',
                sample_rate: 8000,
                channels: 1
              },
              output: {
                encoding: 'mulaw',
                sample_rate: 8000,
                channels: 1,
                container: 'none'
              }
            },
            agent: {
              think: {
                provider: {
                  type: 'open_ai',
                  model: 'gpt-4o-mini' // Deepgram's built-in, already optimized
                },
                instructions: this.getAgentInstructions()
              },
              speak: {
                model: 'aura-2-thalia-en'
              }
            }
          }
        }));

        connection.isConnected = true;
        this.connections.set(callSid, connection);
        resolve(connection);
      });

      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data);
          await this.handleDeepgramMessage(connection, message);
        } catch (error) {
          console.error('Error parsing Deepgram message:', error);
        }
      });

      ws.on('error', (error) => {
        console.error(`Deepgram WebSocket error for ${callSid}:`, error);
        reject(error);
      });

      ws.on('close', () => {
        console.log(`Deepgram connection closed for ${callSid}`);
        connection.isConnected = false;
        this.connections.delete(callSid);
      });
    });
  }

  // Handle messages from Deepgram
  async handleDeepgramMessage(connection, message) {
    switch (message.type) {
      case 'welcome':
        console.log('Deepgram agent ready');
        // Send initial greeting
        setTimeout(() => {
          this.sendGreeting(connection);
        }, 500);
        break;
        
      case 'conversation.text':
        // Handle transcribed text
        if (message.role === 'user') {
          connection.transcript.push({
            role: 'user',
            text: message.text,
            timestamp: Date.now()
          });
          
          // Extract appointment info if in booking stage
          if (connection.conversationManager.state.stage === 'appointment_booking') {
            const info = connection.conversationManager.extractAppointmentInfo(message.text);
            connection.conversationManager.updatePatientInfo(info);
            connection.conversationManager.updateAppointmentDetails(info);
          }
        } else if (message.role === 'assistant') {
          connection.transcript.push({
            role: 'assistant',
            text: message.text,
            timestamp: Date.now()
          });
          
          // Check if appointment was confirmed
          if (message.text.toLowerCase().includes('booked your appointment') || 
              message.text.toLowerCase().includes('confirmed your appointment')) {
            await this.bookAppointment(connection);
          }
        }
        break;
        
      case 'audio':
        // Handle audio output from Deepgram
        if (message.data && connection.twilioWs) {
          // Send audio back to Twilio
          this.sendAudioToTwilio(connection, message.data);
        }
        break;
        
      case 'agent.thinking':
        console.log('Agent is thinking...');
        break;
        
      case 'agent.speaking':
        console.log('Agent is speaking...');
        break;
        
      case 'error':
        console.error('Deepgram error:', message.error);
        break;
    }
    
    // Update database with transcript
    if (connection.dbRecordId && this.supabase) {
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

  // Send greeting message
  sendGreeting(connection, greetingMessage = null) {
    if (connection.ws.readyState === WebSocket.OPEN) {
      const defaultGreeting = "Thank you for calling. This is Julie. How can I help you today?";
      connection.ws.send(JSON.stringify({
        type: 'conversation.inject',
        conversation: {
          text: greetingMessage || defaultGreeting,
          role: 'assistant'
        }
      }));
    }
  }

  // Handle incoming Twilio call
  async handleIncomingCall(callSid, from, to, twilioWs) {
    try {
      console.log(`Incoming call from ${from} to ${to}`);
      
      // Get phone number settings from database
      let voiceSettings = {
        voiceModel: 'aura-2-thalia-en',
        greetingMessage: "Thank you for calling. This is Julie. How can I help you today?",
        personality: 'professional',
        enableAppointments: true
      };
      
      let clientId = null;
      let clientName = null;
      
      if (this.supabase) {
        // Get phone number configuration
        const { data: phoneData } = await this.supabase
          .from('phone_numbers')
          .select('voice_settings, client_name, client_id')
          .eq('phone_number', to)
          .eq('status', 'active')
          .single();
        
        if (phoneData) {
          if (phoneData.voice_settings) {
            voiceSettings = { ...voiceSettings, ...phoneData.voice_settings };
          }
          clientId = phoneData.client_id;
          clientName = phoneData.client_name;
          
          // Personalize greeting with client name
          if (clientName && !voiceSettings.greetingMessage.includes(clientName)) {
            voiceSettings.greetingMessage = voiceSettings.greetingMessage.replace(
              'Thank you for calling',
              `Thank you for calling ${clientName}`
            );
          }
        }
      }
      
      // Create database record
      let dbRecordId = null;
      if (this.supabase) {
        const { data, error } = await this.supabase
          .from('call_logs')
          .insert({
            call_sid: callSid,
            from_number: from,
            to_number: to,
            direction: 'inbound',
            status: 'in_progress',
            client_id: clientId,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (data) {
          dbRecordId = data.id;
        }
        if (error) console.error('Error creating call record:', error);
      }
      
      // Initialize Deepgram connection
      const connection = await this.initializeDeepgramAgent(callSid);
      connection.dbRecordId = dbRecordId;
      connection.fromNumber = from;
      connection.clientId = clientId;
      connection.clientName = clientName;
      connection.voiceSettings = voiceSettings;
      connection.twilioWs = twilioWs; // Store Twilio WebSocket for sending audio back
      
      // Send customized greeting after connection is established
      setTimeout(() => {
        this.sendGreeting(connection, voiceSettings.greetingMessage);
      }, 1000);
      
      return connection;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      throw error;
    }
  }

  // Stream audio from Twilio to Deepgram
  async streamAudio(callSid, audioData) {
    const connection = this.connections.get(callSid);
    if (connection && connection.isConnected) {
      // Forward mulaw audio directly to Deepgram
      connection.ws.send(audioData);
    }
  }

  // Handle call end
  async endCall(callSid) {
    const connection = this.connections.get(callSid);
    if (connection) {
      const duration = Math.floor((Date.now() - connection.startTime) / 1000);
      console.log(`Call ended. Duration: ${duration}s`);
      
      // Update database
      if (this.supabase && connection.dbRecordId) {
        try {
          const summary = this.generateCallSummary(connection);
          
          await this.supabase
            .from('call_logs')
            .update({
              ended_at: new Date().toISOString(),
              duration: duration,
              status: 'completed',
              transcription: JSON.stringify(connection.transcript),
              ai_summary: summary
            })
            .eq('id', connection.dbRecordId);
        } catch (err) {
          console.error('Error updating call record:', err);
        }
      }
      
      // Close WebSocket
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.ws.close();
      }
      
      this.connections.delete(callSid);
    }
  }

  // Get agent instructions for Deepgram
  getAgentInstructions() {
    return `You are Julie, Dr. Pedro's warm and professional dental office AI assistant handling phone calls.
You speak naturally and conversationally, as if you're a real person on the phone.

Your primary responsibilities:
1. Answer questions about dental services and pricing
2. Book new appointments or reschedule existing ones
3. Collect patient information (name, phone, insurance, concern)
4. Provide emergency guidance
5. Connect patients with live team members when requested

Important behaviors:
- Keep responses brief and conversational (2-3 sentences max)
- Ask one question at a time
- Confirm important details by repeating them back
- Use natural speech patterns with fillers like "um", "let me see", "one moment"
- If emergency, immediately ask: "This sounds urgent. Do you need to go to the emergency room, or would you like me to connect you with Dr. Pedro right away?"

For appointment booking:
1. Collect: name, phone number, preferred date/time, dental concern
2. Offer available slots: "I have openings tomorrow at 10 AM or 2 PM, or Thursday at 3 PM. Which works better for you?"
3. Confirm: "Perfect! Let me confirm: [appointment details]. Shall I book this for you?"
4. After confirmation: "Wonderful! I've booked your appointment. You'll receive a text confirmation shortly."

If patient asks for human/doctor/live person:
"I'd be happy to connect you with our team right away. Dr. Pedro or one of our specialists will call you back within 5 minutes. What's the best number to reach you?"

Office information:
- Location: Houston, TX
- Hours: Monday-Friday 8 AM - 5 PM, Saturday 9 AM - 2 PM
- Emergency line available 24/7
- Services: General dentistry, implants, TMJ treatment, cosmetic dentistry, robotic surgery

Always be warm, empathetic, and professional. Remember you're the first impression of Dr. Pedro's practice.`;
  }

  // Generate call summary
  generateCallSummary(connection) {
    const { patientInfo, appointmentDetails, stage } = connection.conversationManager.state;
    let summary = `Call duration: ${Math.floor((Date.now() - connection.startTime) / 1000)}s. `;
    
    if (patientInfo.name) {
      summary += `Patient: ${patientInfo.name}. `;
    }
    
    if (appointmentDetails && appointmentDetails.confirmed) {
      summary += `Appointment booked for ${appointmentDetails.date} at ${appointmentDetails.time}. `;
    }
    
    if (stage === 'emergency') {
      summary += `Emergency call - patient was advised appropriately. `;
    }
    
    summary += `Total exchanges: ${connection.transcript.length}.`;
    
    return summary;
  }

  // Send audio back to Twilio
  sendAudioToTwilio(connection, audioData) {
    if (connection.twilioWs && connection.twilioWs.readyState === WebSocket.OPEN) {
      // Deepgram sends base64 audio, send it to Twilio
      const twilioMessage = {
        event: 'media',
        streamSid: connection.streamSid,
        media: {
          payload: audioData // Already base64 encoded mulaw from Deepgram
        }
      };
      
      connection.twilioWs.send(JSON.stringify(twilioMessage));
    }
  }

  // Book appointment (reuse from parent)
  async bookAppointment(connection) {
    const details = connection.conversationManager.state.appointmentDetails;
    if (!details || !details.patientName || !details.phoneNumber) {
      console.error('Missing appointment details');
      return;
    }
    
    try {
      // Send SMS confirmation
      if (this.twilioClient) {
        const message = `Hi ${details.patientName}, this is Dr. Pedro's office confirming your appointment on ${details.date} at ${details.time}. ` +
                        `Reply YES to confirm or call ${this.twilioPhoneNumber} to reschedule. Thank you!`;
        
        await this.twilioClient.messages.create({
          body: message,
          from: this.twilioPhoneNumber,
          to: `+1${details.phoneNumber}`
        });
        
        console.log(`SMS confirmation sent to ${details.phoneNumber}`);
      }
      
      // Update appointment confirmed status
      connection.conversationManager.state.appointmentDetails.confirmed = true;
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  }

  // Keep alive signal
  startKeepAlive(callSid) {
    const connection = this.connections.get(callSid);
    if (connection) {
      connection.keepAliveInterval = setInterval(() => {
        if (connection.ws.readyState === WebSocket.OPEN) {
          connection.ws.send(JSON.stringify({ type: 'keep-alive' }));
        }
      }, 5000);
    }
  }

  // Stop keep alive
  stopKeepAlive(callSid) {
    const connection = this.connections.get(callSid);
    if (connection && connection.keepAliveInterval) {
      clearInterval(connection.keepAliveInterval);
    }
  }
}

export default DeepgramVoiceService;