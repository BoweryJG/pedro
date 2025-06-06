import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Add CORS headers
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
    const { applicant, transaction } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Sunbit API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process financing request',
        message: 'Please try again or contact our office for assistance.'
      }),
    };
  }
};