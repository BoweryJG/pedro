// supabase/functions/_shared/cors.ts

// Get allowed origins from environment variable or use default whitelist
const getAllowedOrigins = (): string[] => {
  const envOrigins = Deno.env.get('ALLOWED_ORIGINS');
  if (envOrigins) {
    return envOrigins.split(',').map(origin => origin.trim());
  }
  
  // Default production domains whitelist
  return [
    'https://drgregpedro.com',
    'https://www.drgregpedro.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
  ];
};

// Function to get CORS headers based on request origin
export const getCorsHeaders = (requestOrigin: string | null): HeadersInit => {
  const allowedOrigins = getAllowedOrigins();
  const headers: HeadersInit = {
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Check if the request origin is in the allowed list
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    headers['Access-Control-Allow-Origin'] = requestOrigin;
  } else if (allowedOrigins.length > 0) {
    // Fallback to the first allowed origin if request origin is not in the list
    headers['Access-Control-Allow-Origin'] = allowedOrigins[0];
  }

  return headers;
};

// Legacy export for backward compatibility
// This will use the first allowed origin as default
export const corsHeaders = getCorsHeaders(null);
