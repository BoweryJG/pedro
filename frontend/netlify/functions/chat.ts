import { Handler } from '@netlify/functions';

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { messages, systemPrompt } = JSON.parse(event.body || '{}');

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required' }),
      };
    }

    // Prepare messages for OpenAI
    const openAIMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages,
    ];

    // Call OpenRouter API
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://drpedro.com',
        'X-Title': 'Dr. Pedro Dental Practice'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4',
        messages: openAIMessages,
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const completion = await response.json();

    const responseContent = completion.choices[0]?.message?.content || 
      "I apologize, I'm having trouble responding right now. How can I help you learn about our dental services?";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        response: responseContent,
        usage: completion.usage 
      }),
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process chat request',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
