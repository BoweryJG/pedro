import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import dotenv from 'dotenv';
import VoiceService from './voiceService.js';
import WebRTCVoiceService from './webrtcVoiceService.js';
import DeepgramVoiceService from './deepgramVoiceService.js';
import VoIPService from './src/services/voipService.js';
import ScheduledJobsService from './src/services/scheduledJobs.js';
import julieAI from './services/julieAI.js';
import webhookRoutes from './src/routes/webhooks.js';
import phoneNumberRoutes from './routes/phoneNumbers.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const server = createServer(app);

// Production domains configuration
const productionDomains = [
  // Main domain
  'https://gregpedromd.com',
  'https://www.gregpedromd.com',
  
  // Subdomains
  'https://tmj.gregpedromd.com',
  'https://implants.gregpedromd.com',
  'https://robotic.gregpedromd.com',
  'https://medspa.gregpedromd.com',
  'https://aboutface.gregpedromd.com',
  
  // Development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:3001'
];

// WebSocket origin validation function
const verifyWebSocketClient = (info) => {
  const origin = info.origin;
  
  // Allow connections with no origin (server-to-server)
  if (!origin) return true;
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : productionDomains;
  
  // Check if origin is in allowed list
  if (allowedOrigins.includes(origin)) {
    return true;
  }
  
  // Check for Netlify/Vercel preview deployments
  if (origin.match(/https:\/\/.*\.(netlify|vercel)\.app$/)) {
    return true;
  }
  
  console.warn(`WebSocket: Rejected origin ${origin}`);
  return false;
};

// Initialize WebSocket server for Twilio Media Streams
const wss = new WebSocketServer({ 
  server,
  path: '/voice-websocket',
  verifyClient: verifyWebSocketClient
});

// Initialize WebSocket server for WebRTC signaling
const webrtcWss = new WebSocketServer({ 
  server,
  path: '/webrtc-voice',
  verifyClient: verifyWebSocketClient
});

// Initialize voice services
const voiceService = new DeepgramVoiceService(); // Using Deepgram for phone calls
const webrtcVoiceService = new WebRTCVoiceService();
const voipService = new VoIPService();
const scheduledJobs = new ScheduledJobsService();

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
      : productionDomains;
    
    // Check exact match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check for Netlify/Vercel preview deployments
    if (origin.match(/https:\/\/.*\.(netlify|vercel)\.app$/)) {
      return callback(null, true);
    }
    
    console.warn(`CORS: Rejected origin ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openrouter.ai", "https://api.anthropic.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs for sensitive endpoints
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Apply middlewares
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter);

// Health check endpoint (no rate limit)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Dr. Pedro Dental Backend Server',
    version: '1.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'operational',
    services: {
      appointments: 'handled by Supabase',
      sms: 'VoIP.ms + Twilio backup',
      voip: {
        sms: 'VoIP.ms API with auto-responses',
        calls: 'Call recording and transcription',
        transcription: 'OpenAI Whisper, Google Speech, Hugging Face'
      },
      database: 'Supabase PostgreSQL',
      chat: 'OpenRouter AI',
      voice: 'Twilio Media Streams + Whisper STT + TTS',
      scheduledJobs: process.env.NODE_ENV === 'production' ? 'active' : 'disabled'
    }
  });
});

// Chat endpoint for Julie AI assistant
app.post('/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    
    if (!messages || !systemPrompt) {
      return res.status(400).json({ 
        error: 'Missing required fields: messages and systemPrompt' 
      });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured' 
      });
    }
    
    // Use OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    res.json({
      response: data.choices[0].message.content
    });
    
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'operational' },
      chat: { status: 'operational' },
      voice: { 
        status: 'operational',
        activeConnections: voiceService.connections.size,
        websocket: wss ? 'ready' : 'not initialized'
      },
      webrtcVoice: {
        status: 'operational',
        activeConnections: webrtcVoiceService.webrtcConnections.size,
        websocket: webrtcWss ? 'ready' : 'not initialized'
      }
    }
  });
});

// Financing - Sunbit endpoint
app.post('/financing/sunbit', async (req, res) => {
  try {
    const { applicant, transaction } = req.body;

    // In production, this would call the actual Sunbit API
    // For now, simulate approval logic based on Sunbit's 85% approval rate
    
    const random = Math.random();
    const approved = random < 0.85; // 85% approval rate
    
    // Simulate credit decision
    let approvalAmount = 0;
    let monthlyPayment = 0;
    let term = 12;
    
    if (approved) {
      // Sunbit typically approves amounts from $200 to $20,000
      approvalAmount = Math.min(transaction.amount * 1.2, 20000);
      approvalAmount = Math.round(approvalAmount / 100) * 100; // Round to nearest $100
      
      // Calculate monthly payment (0% APR for promotional period)
      monthlyPayment = Math.round((approvalAmount / term) * 100) / 100;
    }

    const response = {
      approved,
      approvalAmount,
      monthlyPayment,
      term,
      apr: 0, // Sunbit often offers 0% promotional rates
      preQualificationId: approved ? `SB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : null,
      expirationDate: approved ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      message: approved 
        ? 'Pre-qualification successful! This offer is valid for 30 days.'
        : 'Unable to pre-qualify at this time. Other financing options may be available.'
    };

    res.json(response);
  } catch (error) {
    console.error('Sunbit API error:', error);
    res.status(500).json({ 
      error: 'Failed to process financing request',
      message: 'Please try again or contact our office for assistance.'
    });
  }
});

// Financing - Cherry endpoint
app.post('/financing/cherry', async (req, res) => {
  try {
    const { patient, practice, amount } = req.body;

    // Simulate Cherry approval logic
    // Cherry also has high approval rates for lower credit scores
    const random = Math.random();
    const approved = random < 0.75; // 75% approval rate
    
    let creditLimit = 0;
    let term = 24; // Default 24 months
    let apr = 0;
    
    if (approved) {
      // Cherry typically offers various term lengths
      if (amount <= 1000) {
        term = 6;
        apr = 0; // 0% for short terms
      } else if (amount <= 5000) {
        term = 12;
        apr = 0;
      } else {
        term = 24;
        apr = 9.99; // Some APR for longer terms
      }
      
      creditLimit = Math.min(amount * 1.1, 10000);
      creditLimit = Math.round(creditLimit / 50) * 50; // Round to nearest $50
    }

    const response = {
      approved,
      creditLimit,
      term,
      apr,
      applicationId: approved ? `CH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : null,
      expirationDate: approved ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() : null,
      message: approved 
        ? `Approved for ${term}-month payment plan!`
        : 'Not approved for Cherry at this time.'
    };

    res.json(response);
  } catch (error) {
    console.error('Cherry API error:', error);
    res.status(500).json({ 
      error: 'Failed to process financing request'
    });
  }
});

// Insurance - pVerify endpoint
app.post('/insurance/pverify', async (req, res) => {
  try {
    const { subscriber, provider, payerId, serviceType } = req.body;

    // Simulate pVerify response
    // In production, this would call the actual pVerify API
    
    const isActive = Math.random() > 0.1; // 90% have active insurance
    
    const response = {
      isActive,
      planName: `${payerId} Dental PPO`,
      coinsurancePercentage: isActive ? Math.floor(Math.random() * 30) + 50 : 0, // 50-80%
      deductibleAmount: isActive ? [50, 75, 100, 150][Math.floor(Math.random() * 4)] : 0,
      deductibleRemaining: isActive ? Math.floor(Math.random() * 100) : 0,
      benefitMax: isActive ? [1000, 1500, 2000, 2500][Math.floor(Math.random() * 4)] : 0,
      benefitUsed: 0, // Would be calculated based on claims
      benefitRemaining: 0, // Set below
      copayAmount: 0, // Most dental uses coinsurance
      serviceRestrictions: [],
      hasWaitingPeriod: Math.random() > 0.7, // 30% have waiting periods
      verificationDate: new Date().toISOString()
    };
    
    if (response.isActive) {
      response.benefitUsed = Math.floor(Math.random() * response.benefitMax * 0.4);
      response.benefitRemaining = response.benefitMax - response.benefitUsed;
      
      // Add restrictions for major work
      if (serviceType === '39') { // Dental
        response.serviceRestrictions = [
          'Major services subject to 12-month waiting period',
          'Implants may require pre-authorization',
          'Cosmetic procedures not covered'
        ];
      }
    }

    res.json(response);
  } catch (error) {
    console.error('pVerify API error:', error);
    res.status(500).json({ 
      error: 'Failed to verify insurance',
      isActive: false
    });
  }
});

// Insurance - Zuub endpoint (placeholder for future implementation)
app.post('/insurance/zuub', async (req, res) => {
  try {
    // Zuub integration would go here
    // For now, return a placeholder response
    res.json({
      status: 'not_implemented',
      message: 'Zuub integration coming soon'
    });
  } catch (error) {
    console.error('Zuub API error:', error);
    res.status(500).json({ 
      error: 'Zuub integration not yet available'
    });
  }
});

// WebSocket connection handler for Twilio Media Streams
wss.on('connection', async (ws, req) => {
  console.log('New WebSocket connection for voice');
  
  // Extract call SID from query params or headers
  const url = new URL(req.url, `http://${req.headers.host}`);
  const callSid = url.searchParams.get('callSid') || `call_${Date.now()}`;
  
  let deepgramConnection = null;
  
  // Handle Twilio Media Stream messages
  ws.on('message', async (message) => {
    const msg = JSON.parse(message);
    
    switch (msg.event) {
      case 'start':
        console.log('Twilio Media Stream started', msg.start);
        // Initialize Deepgram connection
        deepgramConnection = await voiceService.handleIncomingCall(
          callSid,
          msg.start.customParameters.from || 'Unknown',
          msg.start.customParameters.to || voiceService.twilioPhoneNumber,
          ws // Pass Twilio WebSocket for sending audio back
        );
        // Store streamSid for sending audio back
        if (deepgramConnection) {
          deepgramConnection.streamSid = msg.start.streamSid;
        }
        voiceService.startKeepAlive(callSid);
        break;
        
      case 'media':
        // Forward audio to Deepgram
        if (deepgramConnection && msg.media.payload) {
          const audioData = Buffer.from(msg.media.payload, 'base64');
          await voiceService.streamAudio(callSid, audioData);
        }
        break;
        
      case 'stop':
        console.log('Twilio Media Stream stopped');
        voiceService.stopKeepAlive(callSid);
        await voiceService.endCall(callSid);
        break;
    }
  });
  
  ws.on('close', () => {
    console.log('Twilio WebSocket closed');
    voiceService.stopKeepAlive(callSid);
    voiceService.endCall(callSid);
  });
  
  ws.on('error', (error) => {
    console.error('Twilio WebSocket error:', error);
  });
});

// WebRTC Voice connection handler - No phone numbers needed!
webrtcWss.on('connection', (ws, req) => {
  console.log('New WebRTC voice connection from browser');
  
  ws.on('message', (message) => {
    webrtcVoiceService.handleSignaling(ws, message.toString());
  });
  
  ws.on('close', () => {
    console.log('WebRTC voice connection closed');
  });
  
  ws.on('error', (error) => {
    console.error('WebRTC connection error:', error);
  });
  
  // Send ready signal
  ws.send(JSON.stringify({ type: 'ready' }));
});

// Twilio voice webhook endpoint
app.post('/voice/incoming', (req, res) => {
  // Determine protocol based on environment
  const protocol = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling Dr. Pedro's office. Let me connect you with Julie, who can help schedule appointments, answer questions about our services, and provide information about financing options.</Say>
  <Connect>
    <Stream url="${protocol}://${host}/voice-websocket?callSid=${req.body.CallSid}">
      <Parameter name="callSid" value="${req.body.CallSid}" />
    </Stream>
  </Connect>
</Response>`;

  res.type('text/xml');
  res.send(twiml);
});

// Twilio voice status callback
app.post('/voice/status', (req, res) => {
  console.log('Call status:', req.body.CallStatus, 'for call:', req.body.CallSid);
  res.sendStatus(200);
});

// Voice service test endpoint
app.get('/voice/test', async (req, res) => {
  try {
    // Test TTS
    const testText = "Hello, this is a test of the voice system.";
    const audioData = await voiceService.textToSpeech(testText);
    
    res.json({
      status: 'operational',
      tests: {
        tts: audioData && audioData.length > 0 ? 'passed' : 'failed',
        websocket: wss ? 'ready' : 'not initialized',
        connections: voiceService.connections.size
      },
      endpoints: {
        incoming: '/voice/incoming',
        websocket: '/voice-websocket',
        status: '/voice/status'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// VoIP.ms SMS webhook endpoint
app.post('/api/voip/sms/webhook', async (req, res) => {
  try {
    const { from, message, id } = req.body;
    
    if (!from || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Process incoming SMS
    await voipService.processIncomingSMS(from, message, id);
    
    res.json({ status: 'success' });
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
});

// Send SMS endpoint
app.post('/api/voip/sms/send', strictLimiter, async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }
    
    const result = await voipService.sendSMS(to, message);
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

// Get SMS conversations
app.get('/api/voip/sms/conversations', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const messages = await voipService.getSMSMessages(null, null, parseInt(limit));
    res.json({ messages });
  } catch (error) {
    console.error('Get SMS error:', error);
    res.status(500).json({ error: 'Failed to get SMS messages' });
  }
});

// Get call recordings
app.get('/api/voip/calls/recordings', async (req, res) => {
  try {
    const { callId } = req.query;
    const recordings = await voipService.getCallRecordings(callId);
    res.json({ recordings });
  } catch (error) {
    console.error('Get recordings error:', error);
    res.status(500).json({ error: 'Failed to get recordings' });
  }
});

// Download specific recording
app.get('/api/voip/calls/recording/:recordingId', async (req, res) => {
  try {
    const { recordingId } = req.params;
    const { callSid } = req.query;
    
    if (!callSid) {
      return res.status(400).json({ error: 'Missing callSid parameter' });
    }
    
    const recordingUrl = await voipService.downloadRecording(recordingId, callSid);
    res.json({ recordingUrl });
  } catch (error) {
    console.error('Download recording error:', error);
    res.status(500).json({ error: 'Failed to download recording' });
  }
});

// Get call history
app.get('/api/voip/calls/history', async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    if (!dateFrom || !dateTo) {
      return res.status(400).json({ error: 'Missing date range parameters' });
    }
    
    const calls = await voipService.getCallRecords(dateFrom, dateTo);
    res.json({ calls });
  } catch (error) {
    console.error('Get call history error:', error);
    res.status(500).json({ error: 'Failed to get call history' });
  }
});

// Sync call history (admin endpoint)
app.post('/api/voip/sync', strictLimiter, async (req, res) => {
  try {
    await voipService.syncCallHistory();
    res.json({ status: 'success', message: 'Call history sync initiated' });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Failed to sync call history' });
  }
});

// Get VoIP analytics
app.get('/api/voip/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Missing date range parameters' });
    }
    
    const analytics = await voipService.getAnalytics(startDate, endDate);
    res.json({ analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// Configure VoIP.ms webhook
app.post('/api/voip/configure-webhook', strictLimiter, async (req, res) => {
  try {
    const { webhookUrl } = req.body;
    
    if (!webhookUrl) {
      return res.status(400).json({ error: 'Missing webhookUrl' });
    }
    
    const result = await voipService.setupSMSWebhook(webhookUrl);
    res.json({ status: 'success', result });
  } catch (error) {
    console.error('Configure webhook error:', error);
    res.status(500).json({ error: 'Failed to configure webhook' });
  }
});

// Julie AI Voice Assistant Endpoints

// Twilio voice webhook endpoint for Julie AI
app.post('/voice/julie/incoming', async (req, res) => {
  try {
    const { CallSid, From, To } = req.body;
    
    // Start Julie AI session
    await julieAI.startSession(CallSid, From);
    
    // Determine protocol based on environment
    const protocol = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling Dr. Pedro's office. One moment please.</Say>
  <Connect>
    <Stream url="${protocol}://${host}/voice/julie/websocket?callSid=${CallSid}">
      <Parameter name="callSid" value="${CallSid}" />
      <Parameter name="phoneNumber" value="${From}" />
    </Stream>
  </Connect>
</Response>`;

    res.type('text/xml');
    res.send(twiml);
  } catch (error) {
    console.error('Julie AI incoming call error:', error);
    
    const fallbackTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>I apologize, but I'm having technical difficulties. Please call back in a few minutes or press 1 to leave a voicemail.</Say>
  <Gather numDigits="1" action="/voice/fallback">
    <Pause length="5"/>
  </Gather>
  <Say>Goodbye.</Say>
</Response>`;
    
    res.type('text/xml');
    res.send(fallbackTwiml);
  }
});

// Julie AI WebSocket handler
const julieWss = new WebSocketServer({ 
  noServer: true,
  path: '/voice/julie/websocket'
});

julieWss.on('connection', async (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const callSid = url.searchParams.get('callSid');
  const phoneNumber = url.searchParams.get('phoneNumber');
  
  console.log(`Julie AI WebSocket connected for call ${callSid}`);
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.event) {
        case 'media':
          // Convert Twilio mulaw to PCM and send to Julie AI
          const audioChunk = Buffer.from(data.media.payload, 'base64');
          await julieAI.handleIncomingAudio(callSid, audioChunk);
          break;
          
        case 'stop':
          console.log(`Julie AI call ended: ${callSid}`);
          await julieAI.endSession(callSid);
          break;
      }
    } catch (error) {
      console.error('Julie AI WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    console.log(`Julie AI WebSocket closed for call ${callSid}`);
    julieAI.endSession(callSid);
  });
  
  ws.on('error', (error) => {
    console.error(`Julie AI WebSocket error for call ${callSid}:`, error);
  });
});

// Upgrade Julie AI WebSocket connections
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  
  if (pathname === '/voice/julie/websocket') {
    julieWss.handleUpgrade(request, socket, head, (ws) => {
      julieWss.emit('connection', ws, request);
    });
  }
});

// Julie AI status callback
app.post('/voice/julie/status', async (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log(`Julie AI call status: ${CallStatus} for call: ${CallSid}`);
  
  if (CallStatus === 'completed' || CallStatus === 'failed') {
    await julieAI.endSession(CallSid);
  }
  
  res.sendStatus(200);
});

// Get active Julie AI sessions
app.get('/api/julie/sessions', async (req, res) => {
  try {
    const sessions = julieAI.getActiveSessions();
    res.json({ sessions });
  } catch (error) {
    console.error('Get Julie sessions error:', error);
    res.status(500).json({ error: 'Failed to get active sessions' });
  }
});

// Julie AI health check
app.get('/api/julie/health', async (req, res) => {
  try {
    const activeSessions = julieAI.getActiveSessions();
    
    res.json({
      status: 'operational',
      version: '1.0.0',
      features: {
        realTimeVoice: true,
        appointmentBooking: true,
        emergencyRouting: true,
        humanHandoff: true
      },
      activeSessions: activeSessions.length,
      moshiConnection: process.env.MOSHI_API_KEY ? 'configured' : 'not configured',
      openRouterConnection: process.env.OPENROUTER_API_KEY ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Call transcripts API endpoint
app.get('/api/voice/transcripts', async (req, res) => {
  try {
    const { limit = 50, client_id } = req.query;
    
    // Create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Build query
    let query = supabase
      .from('call_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));
    
    // Filter by client if specified
    if (client_id) {
      query = query.eq('client_id', client_id);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transcripts:', error);
      return res.status(500).json({ error: 'Failed to fetch transcripts' });
    }
    
    // Parse transcription JSON strings back to objects
    const transcripts = data.map(call => ({
      ...call,
      transcription: call.transcription ? JSON.parse(call.transcription) : null
    }));
    
    res.json({ transcripts });
  } catch (error) {
    console.error('Transcript API error:', error);
    res.status(500).json({ error: 'Failed to fetch transcripts' });
  }
});

// Single call transcript API endpoint
app.get('/api/voice/transcripts/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    
    // Create Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Supabase not configured' });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('call_sid', callSid)
      .single();
    
    if (error) {
      console.error('Error fetching transcript:', error);
      return res.status(404).json({ error: 'Call not found' });
    }
    
    // Parse transcription JSON string back to object
    const transcript = {
      ...data,
      transcription: data.transcription ? JSON.parse(data.transcription) : null
    };
    
    res.json({ transcript });
  } catch (error) {
    console.error('Single transcript API error:', error);
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// Mount webhook routes
app.use('/webhooks', webhookRoutes);

// Mount phone number management routes
app.use('/api/phone-numbers', phoneNumberRoutes);

// Mount AI voice agent routes
import { voiceAgentApp } from './voice-agent/index.js';
app.use('/api/voice-agent', voiceAgentApp);

server.listen(PORT, () => {
  console.log(`Backend server with WebSocket support running on port ${PORT}`);
  console.log(`Twilio WebSocket: ws://localhost:${PORT}/voice-websocket`);
  console.log(`WebRTC Voice: ws://localhost:${PORT}/webrtc-voice`);
  console.log(`Julie AI Voice: ws://localhost:${PORT}/voice/julie/websocket`);
  console.log('Voice webhook endpoint: /voice/incoming');
  console.log('Julie AI webhook endpoint: /voice/julie/incoming');
  console.log('WebRTC voice ready - no phone numbers needed!');
  console.log('Julie AI with Moshi integration ready for real-time conversations!');
  
  // Start scheduled jobs only in production
  if (process.env.NODE_ENV === 'production') {
    scheduledJobs.start();
    console.log('Scheduled jobs started');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  scheduledJobs.stop();
  server.close(() => {
    console.log('HTTP server closed');
  });
});