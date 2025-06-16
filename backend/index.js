import express from 'express';
import cors from 'cors';
import instagramWebhookRouter from './src/routes/instagram-webhook.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());

// IMPORTANT: Raw body for webhook signature verification
app.use('/api/instagram/webhook', express.raw({ type: 'application/json' }));

// Regular JSON parsing for other routes
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Dr. Pedro Instagram DM Automation Backend',
    timestamp: new Date().toISOString(),
    endpoints: {
      webhook: '/api/instagram/webhook',
      conversations: '/api/instagram/conversations',
      analytics: '/api/instagram/analytics'
    }
  });
});

// Instagram webhook routes
app.use('/api/instagram', instagramWebhookRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Dr. Pedro Instagram DM Automation Backend`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌐 Webhook URL: https://pedrobackend.onrender.com/api/instagram/webhook`);
  console.log(`✅ Ready to receive Instagram DMs!`);
});

// Keep-alive for Render
const keepAlive = () => {
  console.log(`[${new Date().toISOString()}] Service is active`);
  setTimeout(keepAlive, 300000); // Every 5 minutes
};

keepAlive();