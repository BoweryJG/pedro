import { createClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

class ErrorMonitoringService {
  constructor() {
    this.supabase = null;
    this.initializeSupabase();
  }

  initializeSupabase() {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      this.supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
    }
  }

  /**
   * Get error statistics for a given time period
   */
  async getErrorStats(startDate, endDate) {
    if (!this.supabase) {
      logger.warn('Supabase not configured for error monitoring');
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('error_logs')
        .select('status_code, environment, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) throw error;

      // Calculate statistics
      const stats = {
        totalErrors: data.length,
        errorsByStatusCode: {},
        errorsByEnvironment: {},
        errorsByHour: {},
        criticalErrors: 0
      };

      data.forEach(error => {
        // Count by status code
        stats.errorsByStatusCode[error.status_code] = 
          (stats.errorsByStatusCode[error.status_code] || 0) + 1;

        // Count by environment
        stats.errorsByEnvironment[error.environment] = 
          (stats.errorsByEnvironment[error.environment] || 0) + 1;

        // Count by hour
        const hour = new Date(error.created_at).getHours();
        stats.errorsByHour[hour] = (stats.errorsByHour[hour] || 0) + 1;

        // Count critical errors (5xx)
        if (error.status_code >= 500) {
          stats.criticalErrors++;
        }
      });

      return stats;
    } catch (error) {
      logger.error('Failed to get error statistics', error);
      return null;
    }
  }

  /**
   * Get most frequent errors
   */
  async getFrequentErrors(limit = 10, days = 7) {
    if (!this.supabase) return null;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('error_logs')
        .select('message, status_code, method, path')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      // Group and count errors
      const errorCounts = {};
      data.forEach(error => {
        const key = `${error.status_code}:${error.method}:${error.path}:${error.message}`;
        errorCounts[key] = (errorCounts[key] || 0) + 1;
      });

      // Sort by frequency and return top N
      return Object.entries(errorCounts)
        .map(([key, count]) => {
          const [status_code, method, path, message] = key.split(':');
          return { status_code, method, path, message, count };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      logger.error('Failed to get frequent errors', error);
      return null;
    }
  }

  /**
   * Get errors by user
   */
  async getErrorsByUser(userId, limit = 50) {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase
        .from('error_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to get errors by user', error);
      return null;
    }
  }

  /**
   * Get error trends
   */
  async getErrorTrends(days = 30) {
    if (!this.supabase) return null;

    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await this.supabase
        .from('error_logs')
        .select('created_at, status_code')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by day
      const trends = {};
      data.forEach(error => {
        const date = new Date(error.created_at).toISOString().split('T')[0];
        if (!trends[date]) {
          trends[date] = { total: 0, client: 0, server: 0 };
        }
        trends[date].total++;
        if (error.status_code >= 400 && error.status_code < 500) {
          trends[date].client++;
        } else if (error.status_code >= 500) {
          trends[date].server++;
        }
      });

      return trends;
    } catch (error) {
      logger.error('Failed to get error trends', error);
      return null;
    }
  }

  /**
   * Alert on critical errors
   */
  async checkCriticalErrors() {
    if (!this.supabase) return;

    try {
      // Check for errors in the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const { data, error } = await this.supabase
        .from('error_logs')
        .select('*')
        .gte('created_at', fiveMinutesAgo.toISOString())
        .gte('status_code', 500);

      if (error) throw error;

      if (data.length > 5) {
        // More than 5 critical errors in 5 minutes
        logger.error(`CRITICAL: ${data.length} server errors in the last 5 minutes!`);
        
        // Send alerts (integrate with your alerting system)
        if (process.env.ALERT_WEBHOOK_URL) {
          await fetch(process.env.ALERT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alert: 'Critical Error Spike',
              message: `${data.length} server errors detected in the last 5 minutes`,
              severity: 'critical',
              errors: data.slice(0, 5), // Include first 5 errors
              timestamp: new Date().toISOString()
            })
          });
        }
      }
    } catch (error) {
      logger.error('Failed to check critical errors', error);
    }
  }

  /**
   * Clean up old error logs
   */
  async cleanupOldLogs(daysToKeep = 90) {
    if (!this.supabase) return;

    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { error } = await this.supabase
        .from('error_logs')
        .delete()
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      logger.info(`Cleaned up error logs older than ${daysToKeep} days`);
    } catch (error) {
      logger.error('Failed to cleanup old error logs', error);
    }
  }

  /**
   * Generate error report
   */
  async generateErrorReport(startDate, endDate) {
    const [stats, frequentErrors, trends] = await Promise.all([
      this.getErrorStats(startDate, endDate),
      this.getFrequentErrors(10, 7),
      this.getErrorTrends(7)
    ]);

    return {
      period: { startDate, endDate },
      statistics: stats,
      frequentErrors,
      trends,
      generatedAt: new Date().toISOString()
    };
  }
}

// Export singleton instance
export default new ErrorMonitoringService();