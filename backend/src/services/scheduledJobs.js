import VoIPService from './voipService.js';

class ScheduledJobsService {
  constructor() {
    this.voipService = new VoIPService();
    this.jobs = new Map();
  }

  // Start all scheduled jobs
  start() {
    console.log('Starting scheduled jobs...');
    
    // Sync VoIP call history every hour
    this.scheduleJob('voip-sync', 60 * 60 * 1000, async () => {
      console.log('Running VoIP sync job...');
      try {
        await this.voipService.syncCallHistory();
      } catch (error) {
        console.error('VoIP sync job failed:', error);
      }
    });

    // Check for unanswered SMS messages every 15 minutes
    this.scheduleJob('sms-check', 15 * 60 * 1000, async () => {
      console.log('Checking for new SMS messages...');
      try {
        const messages = await this.voipService.getSMSMessages();
        // Process any new messages
        for (const message of messages) {
          if (message.direction === 'in' && !message.processed) {
            await this.voipService.processIncomingSMS(
              message.from,
              message.message,
              message.id
            );
          }
        }
      } catch (error) {
        console.error('SMS check job failed:', error);
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
        
        const analytics = await this.voipService.getAnalytics(startDate, endDate);
        console.log('Daily analytics:', analytics);
        
        // You could store this in database or send email report
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