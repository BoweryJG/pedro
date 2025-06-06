import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { patient, practice, amount } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Cherry API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process financing request'
      }),
    };
  }
};