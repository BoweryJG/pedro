// supabase/functions/auth/index.ts
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
    const { action, ...body } = await req.json();

    // Create response object
    let data
    let error

    switch (action) {
      case 'signup':
        // Handle sign up
        const { email, password, first_name, last_name, phone } = body
        
        // Step 1: Create the auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name,
              last_name,
              phone,
            },
          },
        })

        if (authError) {
          error = authError
          break
        }

        // Step 2: If auth user creation successful, create a patient record
        if (authData?.user?.id) {
          const { error: patientError } = await supabase
            .from('patients')
            .insert({
              auth_user_id: authData.user.id,
              first_name,
              last_name,
              email,
              phone,
            })

          if (patientError) {
            error = patientError
            break
          }
        }

        data = authData
        break

      case 'signin':
        // Handle sign in
        const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
          email: body.email,
          password: body.password,
        })

        data = signinData
        error = signinError
        break

      case 'signout':
        // Handle sign out
        const { error: signoutError } = await supabase.auth.signOut()
        error = signoutError
        break

      case 'reset':
        // Handle password reset request
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(body.email, {
          redirectTo: body.redirectUrl,
        })
        error = resetError
        break

      case 'update':
        // Handle password update
        const { error: updateError } = await supabase.auth.updateUser({
          password: body.password,
        })
        error = updateError
        break

      case 'user':
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userData?.user) {
          // Also fetch patient data
          const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .select('*')
            .eq('auth_user_id', userData.user.id)
            .single()
            
          if (!patientError && patientData) {
            data = {
              user: userData.user,
              patient: patientData,
            }
          } else {
            data = { user: userData.user }
          }
          
        } else {
          error = userError
        }
        break

      default:
        error = { message: 'Invalid action' }
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
