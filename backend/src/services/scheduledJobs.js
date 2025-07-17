import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';

class ScheduledJobsService {
  constructor() {
    // Initialize Twilio client
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Initialize Supabase
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    this.jobs = new Map();
  }

  // Start all scheduled jobs
  start() {
    console.log('Starting scheduled jobs...');
    
    // Sync Twilio call history every hour
    this.scheduleJob('twilio-call-sync', 60 * 60 * 1000, async () => {
      console.log('Running Twilio call sync job...');
      try {
        const calls = await this.twilioClient.calls.list({
          limit: 100,
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        });
        
        // Store calls in Supabase
        for (const call of calls) {
          const { error } = await this.supabase
            .from('phone_calls')
            .upsert({
              call_sid: call.sid,
              account_sid: call.accountSid || process.env.TWILIO_ACCOUNT_SID,
              from_number: call.from,
              to_number: call.to,
              status: call.status,
              direction: call.direction,
              duration_seconds: parseInt(call.duration),
              started_at: call.startTime,
              ended_at: call.endTime
            }, { onConflict: 'call_sid' });
            
          if (error) console.error('Error storing call:', error);
        }
        
        console.log(`Synced ${calls.length} Twilio calls`);
      } catch (error) {
        console.error('Twilio call sync job failed:', error.message);
      }
    });

    // Check for unanswered Twilio SMS messages every 15 minutes
    this.scheduleJob('twilio-sms-check', 15 * 60 * 1000, async () => {
      console.log('Checking for new Twilio SMS messages...');
      try {
        const messages = await this.twilioClient.messages.list({
          to: process.env.TWILIO_PHONE_NUMBER,
          limit: 20,
          dateSentAfter: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        });
        
        // Store SMS in Supabase
        for (const message of messages) {
          const { data: existing } = await this.supabase
            .from('sms_messages')
            .select('id')
            .eq('message_sid', message.sid)
            .single();
            
          if (!existing) {
            const { error } = await this.supabase
              .from('sms_messages')
              .insert({
                message_sid: message.sid,
                from_number: message.from,
                to_number: message.to,
                body: message.body,
                status: message.status,
                direction: message.direction,
                created_at: message.dateCreated
              });
              
            if (error) console.error('Error storing SMS:', error);
          }
        }
        
        console.log(`Processed ${messages.length} Twilio SMS messages`);
      } catch (error) {
        console.error('Twilio SMS check job failed:', error.message);
      }
    });

    // Generate daily analytics report
    this.scheduleJob('daily-analytics', 24 * 60 * 60 * 1000, async () => {
      console.log('Generating daily analytics...');
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startDate = yesterday.toISOString().split('T')[0] + 'T00:00:00Z';
        const endDate = yesterday.toISOString().split('T')[0] + 'T23:59:59Z';
        
        // Get analytics from Supabase instead
        const { data: calls, error: callsError } = await this.supabase
          .from('phone_calls')
          .select('*')
          .gte('started_at', startDate)
          .lte('started_at', endDate);
        
        if (callsError) {
          console.error('Error fetching phone calls:', callsError.message);
          return;
        }
        
        const { data: appointments, error: apptError } = await this.supabase
          .from('appointments')
          .select('*')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
        
        if (apptError) {
          console.error('Error fetching appointments:', apptError.message);
          return;
        }
        
        const analytics = {
          totalCalls: calls?.length || 0,
          totalAppointments: appointments?.length || 0,
          date: yesterday.toISOString().split('T')[0]
        };
        
        console.log('Daily analytics:', analytics);
      } catch (error) {
        console.error('Analytics job failed:', error);
      }
    });
  }

  // Schedule a job with interval
  scheduleJob(name, intervalMs, callback) {
    // Clear existing job if any
    if (this.jobs.has(name)) {
      clearInterval(this.jobs.get(name));
    }

    // Run immediately on start
    callback();

    // Schedule for future runs
    const intervalId = setInterval(callback, intervalMs);
    this.jobs.set(name, intervalId);
    
    console.log(`Scheduled job '${name}' to run every ${intervalMs / 1000} seconds`);
  }

  // Stop all scheduled jobs
  stop() {
    console.log('Stopping scheduled jobs...');
    for (const [name, intervalId] of this.jobs) {
      clearInterval(intervalId);
      console.log(`Stopped job '${name}'`);
    }
    this.jobs.clear();
  }

  // Stop a specific job
  stopJob(name) {
    if (this.jobs.has(name)) {
      clearInterval(this.jobs.get(name));
      this.jobs.delete(name);
      console.log(`Stopped job '${name}'`);
    }
  }

  // Get status of all jobs
  getStatus() {
    const status = {};
    for (const [name, intervalId] of this.jobs) {
      status[name] = {
        running: true,
        intervalId: intervalId
      };
    }
    return status;
  }
}

export default ScheduledJobsService;