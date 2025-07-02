import express from 'express';
import cors from 'cors';

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
      database: 'Supabase PostgreSQL'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log('Note: Main functionality is handled by Supabase');
});