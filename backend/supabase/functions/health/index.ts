// supabase/functions/health/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getCorsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Get the origin from the request headers
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 })
  }

  try {
    const healthStatus = {
      status: 'online',
      timestamp: new Date().toISOString(),
      environment: Deno.env.get('ENVIRONMENT') || 'development',
      api_version: '1.0.0',
      message: 'Dr. Greg Pedro Dental Backend API is running'
    }

    return new Response(
      JSON.stringify(healthStatus),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
