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
    const { subscriber, provider, payerId, serviceType } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('pVerify API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify insurance',
        isActive: false
      }),
    };
  }
};