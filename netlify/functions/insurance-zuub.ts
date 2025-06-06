import { Handler } from '@netlify/functions';

// Simulated insurance data for common providers
const mockInsuranceData = {
  'delta dental': {
    coveragePercentage: 80,
    deductible: 50,
    annualMaximum: 1500,
    implantCoverage: 50,
    majorCoverage: 50
  },
  'cigna': {
    coveragePercentage: 80,
    deductible: 75,
    annualMaximum: 1000,
    implantCoverage: 0, // Often not covered
    majorCoverage: 50
  },
  'aetna': {
    coveragePercentage: 70,
    deductible: 100,
    annualMaximum: 2000,
    implantCoverage: 50,
    majorCoverage: 50
  },
  'united healthcare': {
    coveragePercentage: 80,
    deductible: 50,
    annualMaximum: 1500,
    implantCoverage: 0,
    majorCoverage: 50
  }
};

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
    const { patient, provider, procedureCode } = JSON.parse(event.body || '{}');

    // Simulate insurance verification
    const providerLower = provider.toLowerCase();
    const insuranceInfo = mockInsuranceData[providerLower] || {
      coveragePercentage: 70,
      deductible: 100,
      annualMaximum: 1000,
      implantCoverage: 0,
      majorCoverage: 50
    };

    // Determine coverage based on procedure code
    let applicableCoverage = insuranceInfo.coveragePercentage;
    let limitations = [];
    let waitingPeriod = false;

    if (procedureCode?.startsWith('D6')) { // Implant codes
      applicableCoverage = insuranceInfo.implantCoverage;
      if (applicableCoverage === 0) {
        limitations.push('Dental implants not covered under this plan');
      }
      waitingPeriod = true; // Most plans have waiting periods for major work
    } else if (procedureCode?.startsWith('D7') || procedureCode?.startsWith('D8')) {
      // Oral surgery or orthodontics
      applicableCoverage = insuranceInfo.majorCoverage;
      limitations.push('Subject to plan limitations and medical necessity');
    }

    // Simulate random deductible met amount
    const deductibleMet = Math.floor(Math.random() * insuranceInfo.deductible);
    
    // Simulate benefits used
    const usedBenefits = Math.floor(Math.random() * insuranceInfo.annualMaximum * 0.3);
    const remainingBenefits = insuranceInfo.annualMaximum - usedBenefits;

    const response = {
      eligible: true,
      payerName: provider,
      coveragePercentage: applicableCoverage,
      deductible: insuranceInfo.deductible,
      deductibleMet,
      annualMaximum: insuranceInfo.annualMaximum,
      usedBenefits,
      remainingBenefits,
      copay: 0, // Most dental plans use coinsurance, not copays
      limitations,
      waitingPeriod,
      verificationDate: new Date().toISOString(),
      disclaimer: 'Benefits are subject to eligibility at time of service'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Insurance verification error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify insurance',
        eligible: false
      }),
    };
  }
};