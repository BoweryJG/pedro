// Test script to check if OPENROUTER_API_KEY is set and working
const fetch = require('node-fetch');

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY || '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';
  
  console.log('Testing OpenRouter API...');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 20)}...` : 'NOT SET');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gregpedromd.com',
        'X-Title': 'Julie AI Assistant'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello' }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenRouter API Error:', response.status, data);
    } else {
      console.log('OpenRouter API Success!');
      console.log('Response:', data.choices[0].message.content);
    }
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

// Test direct call to the backend
async function testBackend() {
  console.log('\nTesting Pedro Backend...');
  
  try {
    const response = await fetch('https://pedrobackend.onrender.com/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello' }],
        systemPrompt: 'You are Julie, the dental assistant.'
      })
    });

    const data = await response.json();
    console.log('Backend Response:', response.status, data);
  } catch (error) {
    console.error('Backend Error:', error.message);
  }
}

async function main() {
  await testOpenRouter();
  await testBackend();
}

main();