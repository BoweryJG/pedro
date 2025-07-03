import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

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
      chat: 'OpenRouter AI'
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
    
    // Use OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || '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'}`,
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
      chat: { status: 'operational' }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Note: Main functionality is handled by Supabase');
});