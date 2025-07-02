import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse Twilio webhook data
    const formData = await req.formData()
    const from = formData.get('From') as string
    const body = (formData.get('Body') as string || '').toLowerCase().trim()
    const twilioSignature = req.headers.get('X-Twilio-Signature')
    
    console.log(`Incoming SMS from ${from}: ${body}`)
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Clean phone number
    const cleanPhone = from.replace(/\D/g, '').replace(/^1/, '')
    
    // Parse the message
    let responseMessage = ''
    
    if (body.includes('cancel') || body.includes('c')) {
      // Handle cancellation
      const confirmationCode = extractConfirmationCode(body)
      
      if (confirmationCode) {
        // Find appointment
        const { data: appointment } = await supabase
          .from('appointments')
          .select('*, patients!inner(*), services(*), staff(*)')
          .eq('confirmation_code', confirmationCode.toUpperCase())
          .eq('status', 'scheduled')
          .single()
        
        if (appointment && appointment.patients.phone.includes(cleanPhone)) {
          // Cancel the appointment
          await supabase
            .from('appointments')
            .update({ 
              status: 'cancelled',
              cancelled_at: new Date().toISOString(),
              cancellation_reason: 'Cancelled via SMS'
            })
            .eq('id', appointment.id)
          
          responseMessage = `Your appointment on ${formatDate(appointment.appointment_date)} at ${formatTime(appointment.appointment_time)} has been cancelled. Call (929) 242-4535 if you need help.`
        } else {
          responseMessage = 'Appointment not found. Please check your confirmation code or call (929) 242-4535.'
        }
      } else {
        responseMessage = 'To cancel, reply with: CANCEL [confirmation code]. Example: CANCEL ABC123'
      }
      
    } else if (body.includes('reschedule') || body.includes('r')) {
      responseMessage = 'To reschedule, please call (929) 242-4535 or visit gregpedromd.com/booking'
      
    } else if (body.includes('confirm') || body.includes('y')) {
      responseMessage = 'Thank you for confirming your appointment. We look forward to seeing you!'
      
    } else {
      // Default help message
      responseMessage = 'Reply with:\n- CANCEL [code] to cancel\n- RESCHEDULE to get rescheduling info\n- Or call (929) 242-4535'
    }
    
    // Send response via Twilio
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')!
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')!
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER') || '+19292424535'
    
    const credentials = btoa(`${accountSid}:${authToken}`)
    
    await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'To': from,
          'From': fromNumber,
          'Body': responseMessage
        })
      }
    )
    
    // Log the interaction
    await supabase
      .from('sms_interactions')
      .insert({
        phone: from,
        incoming_message: body,
        outgoing_message: responseMessage,
        action_taken: body.includes('cancel') ? 'cancellation' : 'info',
        created_at: new Date().toISOString()
      })
    
    // Return empty response for Twilio
    return new Response('', { status: 200 })
    
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('', { status: 500 })
  }
})

function extractConfirmationCode(message: string): string | null {
  // Look for patterns like "cancel ABC123" or "c ABC123"
  const patterns = [
    /cancel\s+([A-Z0-9]{6})/i,
    /c\s+([A-Z0-9]{6})/i,
    /([A-Z0-9]{6})/i // Just the code
  ]
  
  for (const pattern of patterns) {
    const match = message.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

function formatDate(date: string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}