// Test the webhook locally before deploying
import express from 'express';

const app = express();
const PORT = 3001;

// Simple webhook verification
app.get('/api/instagram/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification:', { mode, token, challenge });

  if (mode === 'subscribe' && token === 'pedro_dental_2025') {
    console.log('✅ Verification successful!');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Verification failed');
    res.status(403).send('Failed');
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test with: curl "http://localhost:${PORT}/api/instagram/webhook?hub.mode=subscribe&hub.verify_token=pedro_dental_2025&hub.challenge=test123"`);
});