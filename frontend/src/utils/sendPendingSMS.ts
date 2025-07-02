import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tsmtaarwgodklafqlbhm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbXRhYXJ3Z29ka2xhZnFsYmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NTIzNTIsImV4cCI6MjA1MTMyODM1Mn0.qKtWF3SQ9rVevhqVZGX3V_SdW1OFrBvaSrV4S9OU-0w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendPendingSMS() {
  try {
    // Get pending SMS messages
    const { data: pendingMessages, error } = await supabase
      .from('sms_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching pending SMS:', error);
      return;
    }

    console.log(`Found ${pendingMessages?.length || 0} pending SMS messages`);

    // Process each message
    for (const msg of pendingMessages || []) {
      try {
        console.log(`Sending SMS to ${msg.phone}...`);
        
        // Call the Edge Function
        const { data, error: sendError } = await supabase.functions.invoke('send-appointment-sms', {
          body: {
            appointmentId: msg.appointment_id,
            phone: msg.phone,
            message: msg.message
          }
        });

        if (sendError || data?.error) {
          console.error(`Failed to send SMS ${msg.id}:`, sendError || data?.error);
          
          // Update status to failed
          await supabase
            .from('sms_queue')
            .update({ 
              status: 'failed', 
              error: sendError?.message || data?.error || 'Unknown error'
            })
            .eq('id', msg.id);
        } else {
          console.log(`SMS sent successfully: ${data?.sid}`);
          
          // Update status to sent
          await supabase
            .from('sms_queue')
            .update({ 
              status: 'sent', 
              sent_at: new Date().toISOString() 
            })
            .eq('id', msg.id);
        }
      } catch (err) {
        console.error(`Error processing SMS ${msg.id}:`, err);
      }
    }

    console.log('Finished processing SMS queue');
  } catch (err) {
    console.error('Error in sendPendingSMS:', err);
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).sendPendingSMS = sendPendingSMS;
}