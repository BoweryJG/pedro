import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import dotenv from 'dotenv';
import PipecatService from './services/pipecatService.js';
import { generateToken } from './config/livekit.config.js';
import winston from 'winston';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Middleware
app.use(cors());
app.use(express.json());

// Pipecat service instance
const pipecatService = new PipecatService();

// REST Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'pedro-voice-agent',
    version: '1.0.0' 
  });
});

// Generate LiveKit token for client
app.post('/api/voice/token', async (req, res) => {
  try {
    const { name = 'Patient', roomName = 'medical-consultation' } = req.body;
    
    const token = generateToken(name, false);
    
    res.json({
      token,
      serverUrl: process.env.LIVEKIT_URL,
      roomName
    });
  } catch (error) {
    logger.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Start voice session
app.post('/api/voice/start-session', async (req, res) => {
  try {
    const { sessionId, roomName } = req.body;
    
    // Generate token for AI agent
    const agentToken = generateToken('AI_Assistant_Julie', true);
    
    // Start the voice agent pipeline
    await pipecatService.handleVoiceInteraction(sessionId, roomName);
    
    res.json({
      success: true,
      sessionId,
      message: 'Voice agent started successfully'
    });
  } catch (error) {
    logger.error('Error starting voice session:', error);
    res.status(500).json({ error: 'Failed to start voice session' });
  }
});

// End voice session
app.post('/api/voice/end-session', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    await pipecatService.stopPipeline(sessionId);
    
    res.json({
      success: true,
      message: 'Voice session ended'
    });
  } catch (error) {
    logger.error('Error ending voice session:', error);
    res.status(500).json({ error: 'Failed to end voice session' });
  }
});

// Get session status
app.get('/api/voice/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const pipeline = pipecatService.activePipelines.get(sessionId);
    
    res.json({
      sessionId,
      active: !!pipeline,
      status: pipeline ? 'active' : 'inactive'
    });
  } catch (error) {
    logger.error('Error getting session status:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

// WebSocket connection for real-time communication
wss.on('connection', (ws) => {
  logger.info('New WebSocket connection established');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'start_session':
          const { sessionId, roomName } = data;
          await pipecatService.handleVoiceInteraction(sessionId, roomName);
          ws.send(JSON.stringify({
            type: 'session_started',
            sessionId
          }));
          break;
          
        case 'end_session':
          await pipecatService.stopPipeline(data.sessionId);
          ws.send(JSON.stringify({
            type: 'session_ended',
            sessionId: data.sessionId
          }));
          break;
          
        default:
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Unknown message type'
          }));
      }
    } catch (error) {
      logger.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message
      }));
    }
  });
  
  ws.on('close', () => {
    logger.info('WebSocket connection closed');
  });
});

// Mount this as a sub-app in the main backend
export const voiceAgentApp = app;