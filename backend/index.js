import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import VoiceService from './voiceService.js';

const app = express();
const PORT = process.env.PORT || 3001;
const server = createServer(app);

// Initialize WebSocket server for Twilio Media Streams
const wss = new WebSocketServer({ 
  server,
  path: '/voice-websocket'
});

// Initialize voice service
const voiceService = new VoiceService();

app.use(cors());
app.use(express.json());

// Health check endpoint
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
      sms: 'handled by Supabase Edge Functions + Twilio',
      database: 'Supabase PostgreSQL',
      chat: 'OpenRouter AI',
      voice: 'Twilio Media Streams + Whisper STT + TTS'
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
    
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenRouter API key not configured' 
      });
    }
    
    // Use OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gregpedromd.com',
        'X-Title': 'Dr Pedro Dental Assistant'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
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
      throw new Error(data.error?.message || 'OpenRouter API error');
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
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection for voice');
  
  // Extract call SID from query params or headers
  const url = new URL(req.url, `http://${req.headers.host}`);
  const callSid = url.searchParams.get('callSid') || `call_${Date.now()}`;
  
  voiceService.handleConnection(ws, callSid);
});

// Twilio voice webhook endpoint
app.post('/voice/incoming', (req, res) => {
  // Determine protocol based on environment
  const protocol = req.headers['x-forwarded-proto'] === 'https' || process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Please wait while I connect you to our AI assistant.</Say>
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

server.listen(PORT, () => {
  console.log(`Backend server with WebSocket support running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/voice-websocket`);
  console.log('Voice webhook endpoint: /voice/incoming');
});