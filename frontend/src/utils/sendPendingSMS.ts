import { supabase } from '../lib/supabase';

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