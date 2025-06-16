// supabase/functions/appointments/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase/mod.ts";
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // Create a Supabase client with the user's token
    const userSupabase = supabase.auth.api.setAuthHeader(authHeader)

    // Get the current user
    const { data: { user }, error: userError } = await userSupabase.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Get the patient ID associated with this user
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    if (patientError || !patientData) {
      throw new Error('Patient record not found')
    }

    const patientId = patientData.id
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()
    
    let data
    let error

    switch (req.method) {
      case 'GET':
        // Fetch appointments
        if (action === 'upcoming') {
          const { data: appointments, error: appointmentError } = await supabase
            .from('appointments')
            .select(`
              id,
              appointment_date,
              appointment_time,
              status,
              notes,
              services (
                name,
                description,
                category,
                estimated_duration,
                is_yomi_technology
              )
            `)
            .eq('patient_id', patientId)
            .gte('appointment_date', new Date().toISOString().split('T')[0])
            .order('appointment_date', { ascending: true })
            .order('appointment_time', { ascending: true })

          data = appointments
          error = appointmentError
        } else if (action === 'history') {
          const { data: appointments, error: appointmentError } = await supabase
            .from('appointments')
            .select(`
              id,
              appointment_date,
              appointment_time,
              status,
              notes,
              services (
                name,
                description,
                category,
                estimated_duration,
                is_yomi_technology
              )
            `)
            .eq('patient_id', patientId)
            .lt('appointment_date', new Date().toISOString().split('T')[0])
            .order('appointment_date', { ascending: false })
            .order('appointment_time', { ascending: true })

          data = appointments
          error = appointmentError
        } else {
          // Fetch a specific appointment
          const appointmentId = action
          const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .select(`
              id,
              appointment_date,
              appointment_time,
              status,
              notes,
              services (
                name,
                description,
                category,
                estimated_duration,
                is_yomi_technology
              )
            `)
            .eq('id', appointmentId)
            .eq('patient_id', patientId)
            .single()

          data = appointment
          error = appointmentError
        }
        break

      case 'POST':
        // Create a new appointment
        const body = await req.json()
        const { service_id, appointment_date, appointment_time, notes } = body

        const { data: newAppointment, error: createError } = await supabase
          .from('appointments')
          .insert({
            patient_id: patientId,
            service_id,
            appointment_date,
            appointment_time,
            notes,
            status: 'scheduled'
          })
          .select()

        data = newAppointment
        error = createError
        break

      case 'PUT':
        // Update an existing appointment
        const updateBody = await req.json()
        const appointmentId = action
        
        // Verify the appointment belongs to this patient
        const { data: existingAppointment, error: findError } = await supabase
          .from('appointments')
          .select('id')
          .eq('id', appointmentId)
          .eq('patient_id', patientId)
          .single()
          
        if (findError || !existingAppointment) {
          error = { message: 'Appointment not found or access denied' }
          break
        }
        
        const { data: updatedAppointment, error: updateError } = await supabase
          .from('appointments')
          .update({
            service_id: updateBody.service_id,
            appointment_date: updateBody.appointment_date,
            appointment_time: updateBody.appointment_time,
            notes: updateBody.notes,
            status: updateBody.status
          })
          .eq('id', appointmentId)
          .eq('patient_id', patientId)
          .select()

        data = updatedAppointment
        error = updateError
        break

      case 'DELETE':
        // Cancel an appointment
        const appointmentIdToCancel = action
        
        // Verify the appointment belongs to this patient
        const { data: appointmentToCancel, error: cancelFindError } = await supabase
          .from('appointments')
          .select('id')
          .eq('id', appointmentIdToCancel)
          .eq('patient_id', patientId)
          .single()
          
        if (cancelFindError || !appointmentToCancel) {
          error = { message: 'Appointment not found or access denied' }
          break
        }
        
        // Instead of deleting, update the status to cancelled
        const { data: cancelledAppointment, error: cancelError } = await supabase
          .from('appointments')
          .update({
            status: 'cancelled'
          })
          .eq('id', appointmentIdToCancel)
          .eq('patient_id', patientId)
          .select()

        data = cancelledAppointment
        error = cancelError
        break

      default:
        error = { message: 'Method not allowed' }
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
