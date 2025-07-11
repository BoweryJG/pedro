console.log('Environment Test - Raw Output');
console.log('============================');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY);
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY);
console.log('\nTotal env vars:', Object.keys(process.env).length);
console.log('All keys:', Object.keys(process.env).sort().join(', '));