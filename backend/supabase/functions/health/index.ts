// supabase/functions/health/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 200 })
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
          'Content-Type': 'application/json',
        },
      },
    )
  }
})
