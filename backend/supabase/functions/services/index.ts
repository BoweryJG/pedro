// supabase/functions/services/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase/mod.ts";
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Get the origin from the request headers
  const origin = req.headers.get('Origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action } = await req.json();
    let data
    let error

    if (action === 'services') {
      // Get all services
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true })

      data = services
      error = servicesError
    } 
    else if (action === 'yomi-features') {
      // Get yomi technology features
      const { data: yomiFeatures, error: yomiError } = await supabase
        .from('yomi_features')
        .select('*')

      data = yomiFeatures
      error = yomiError
    }
    else if (action === 'staff') {
      // Get staff information
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('last_name', { ascending: true })

      data = staff
      error = staffError
    }
    else if (action === 'testimonials') {
      // Get approved testimonials
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('testimonials')
        .select(`
          id,
          rating,
          comment,
          created_at,
          patients (
            first_name,
            last_name
          ),
          services (
            name,
            category
          )
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })

      data = testimonials
      error = testimonialsError
    }
    else {
      // Get specific service by ID
      const serviceId = action
      const { data: service, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()

      data = service
      error = serviceError
    }

    return new Response(
      JSON.stringify({
        data,
        error,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: error ? 400 : 200,
      },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})
