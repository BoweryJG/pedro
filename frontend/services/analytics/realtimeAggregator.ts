import { supabase } from '@/lib/supabase';
import { MetricsCalculator, MetricResult } from './metricsCalculator';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface RealtimeMetric {
  id: string;
  name: string;
  value: number;
  unit?: string;
  timestamp: Date;
  category: 'financial' | 'patient' | 'operational' | 'subdomain';
  subCategory?: string;
}

export interface AggregationRule {
  metricId: string;
  aggregationType: 'sum' | 'average' | 'count' | 'last' | 'max' | 'min';
  timeWindow: number; // in minutes
  refreshInterval: number; // in seconds
}

export class RealtimeAggregator {
  private practiceId: string;
  private metricsCalculator: MetricsCalculator;
  private channels: Map<string, RealtimeChannel> = new Map();
  private aggregationRules: Map<string, AggregationRule> = new Map();
  private metricCache: Map<string, RealtimeMetric[]> = new Map();
  private updateCallbacks: Map<string, (metric: RealtimeMetric) => void> = new Map();
  private refreshTimers: Map<string, NodeJS.Timer> = new Map();

  constructor(practiceId: string) {
    this.practiceId = practiceId;
    this.metricsCalculator = new MetricsCalculator(practiceId);
    this.initializeDefaultRules();
  }

  private initializeDefaultRules() {
    // Financial metrics
    this.addAggregationRule({
      metricId: 'daily_production',
      aggregationType: 'sum',
      timeWindow: 1440, // 24 hours
      refreshInterval: 300 // 5 minutes
    });

    this.addAggregationRule({
      metricId: 'hourly_production',
      aggregationType: 'sum',
      timeWindow: 60,
      refreshInterval: 60 // 1 minute
    });

    // Patient flow metrics
    this.addAggregationRule({
      metricId: 'patient_throughput',
      aggregationType: 'count',
      timeWindow: 60,
      refreshInterval: 30
    });

    this.addAggregationRule({
      metricId: 'new_patient_registrations',
      aggregationType: 'count',
      timeWindow: 1440,
      refreshInterval: 300
    });

    // Operational metrics
    this.addAggregationRule({
      metricId: 'current_wait_time',
      aggregationType: 'average',
      timeWindow: 30,
      refreshInterval: 60
    });

    this.addAggregationRule({
      metricId: 'chair_occupancy',
      aggregationType: 'last',
      timeWindow: 5,
      refreshInterval: 30
    });
  }

  addAggregationRule(rule: AggregationRule) {
    this.aggregationRules.set(rule.metricId, rule);
  }

  async startRealtimeSubscriptions() {
    // Subscribe to appointment changes
    const appointmentChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `practice_id=eq.${this.practiceId}`
        },
        (payload) => this.handleAppointmentChange(payload)
      )
      .subscribe();

    this.channels.set('appointments', appointmentChannel);

    // Subscribe to billing changes
    const billingChannel = supabase
      .channel('billing-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'billings',
          filter: `practice_id=eq.${this.practiceId}`
        },
        (payload) => this.handleBillingChange(payload)
      )
      .subscribe();

    this.channels.set('billings', billingChannel);

    // Subscribe to patient changes
    const patientChannel = supabase
      .channel('patient-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients',
          filter: `practice_id=eq.${this.practiceId}`
        },
        (payload) => this.handlePatientChange(payload)
      )
      .subscribe();

    this.channels.set('patients', patientChannel);

    // Subscribe to operatory status changes
    const operatoryChannel = supabase
      .channel('operatory-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'operatory_status',
          filter: `practice_id=eq.${this.practiceId}`
        },
        (payload) => this.handleOperatoryChange(payload)
      )
      .subscribe();

    this.channels.set('operatories', operatoryChannel);

    // Start refresh timers for aggregated metrics
    this.startRefreshTimers();
  }

  private async handleAppointmentChange(payload: RealtimePostgresChangesPayload<any>) {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    // Update production metrics
    if (eventType === 'UPDATE' && newRecord.status === 'completed' && oldRecord.status !== 'completed') {
      await this.updateProductionMetrics(newRecord);
    }

    // Update patient flow metrics
    if (eventType === 'UPDATE' && newRecord.status === 'in_progress' && oldRecord.status === 'scheduled') {
      await this.updatePatientFlowMetrics(newRecord);
    }

    // Update wait time metrics
    if (eventType === 'UPDATE' && newRecord.actual_start_time && !oldRecord.actual_start_time) {
      await this.updateWaitTimeMetrics(newRecord);
    }

    // Update no-show metrics
    if (eventType === 'UPDATE' && newRecord.status === 'no_show') {
      await this.updateNoShowMetrics(newRecord);
    }
  }

  private async handleBillingChange(payload: RealtimePostgresChangesPayload<any>) {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'INSERT' || eventType === 'UPDATE') {
      // Update collection metrics
      await this.updateCollectionMetrics(newRecord);
      
      // Update outstanding balance
      await this.updateOutstandingBalance();
    }
  }

  private async handlePatientChange(payload: RealtimePostgresChangesPayload<any>) {
    const { eventType, new: newRecord } = payload;

    if (eventType === 'INSERT') {
      // New patient registration
      await this.updateNewPatientMetrics(newRecord);
    }

    if (eventType === 'UPDATE' && newRecord.status === 'active' && payload.old.status === 'inactive') {
      // Patient reactivation
      await this.updateReactivationMetrics(newRecord);
    }
  }

  private async handleOperatoryChange(payload: RealtimePostgresChangesPayload<any>) {
    const { new: newRecord } = payload;

    // Update chair utilization metrics
    await this.updateChairUtilizationMetrics(newRecord);
  }

  private async updateProductionMetrics(appointment: any) {
    const production = await this.calculateAppointmentProduction(appointment.id);
    
    this.addMetricToCache({
      id: `production_${appointment.id}`,
      name: 'appointment_production',
      value: production,
      unit: '$',
      timestamp: new Date(),
      category: 'financial'
    });

    // Trigger aggregation for daily and hourly production
    await this.aggregateMetric('daily_production');
    await this.aggregateMetric('hourly_production');
  }

  private async updatePatientFlowMetrics(appointment: any) {
    this.addMetricToCache({
      id: `flow_${appointment.id}`,
      name: 'patient_started',
      value: 1,
      timestamp: new Date(),
      category: 'operational'
    });

    await this.aggregateMetric('patient_throughput');
  }

  private async updateWaitTimeMetrics(appointment: any) {
    const scheduledTime = new Date(appointment.scheduled_time);
    const actualTime = new Date(appointment.actual_start_time);
    const waitMinutes = (actualTime.getTime() - scheduledTime.getTime()) / 60000;

    this.addMetricToCache({
      id: `wait_${appointment.id}`,
      name: 'wait_time',
      value: Math.max(0, waitMinutes),
      unit: 'min',
      timestamp: new Date(),
      category: 'operational'
    });

    await this.aggregateMetric('current_wait_time');
  }

  private async updateNoShowMetrics(appointment: any) {
    this.addMetricToCache({
      id: `noshow_${appointment.id}`,
      name: 'no_show',
      value: 1,
      timestamp: new Date(),
      category: 'operational'
    });

    // Trigger real-time alert if no-show rate exceeds threshold
    const noShowRate = await this.calculateRecentNoShowRate();
    if (noShowRate > 15) { // 15% threshold
      this.triggerAlert('high_no_show_rate', {
        rate: noShowRate,
        threshold: 15,
        message: `No-show rate has exceeded 15% (current: ${noShowRate.toFixed(1)}%)`
      });
    }
  }

  private async updateCollectionMetrics(billing: any) {
    if (billing.amount_paid > 0) {
      this.addMetricToCache({
        id: `collection_${billing.id}`,
        name: 'payment_collected',
        value: billing.amount_paid,
        unit: '$',
        timestamp: new Date(),
        category: 'financial'
      });
    }
  }

  private async updateOutstandingBalance() {
    const balance = await this.metricsCalculator.calculateRealTimeMetric('outstandingBalance');
    
    this.addMetricToCache({
      id: 'outstanding_balance',
      name: 'outstanding_balance',
      value: balance.value,
      unit: '$',
      timestamp: new Date(),
      category: 'financial'
    });
  }

  private async updateNewPatientMetrics(patient: any) {
    this.addMetricToCache({
      id: `new_patient_${patient.id}`,
      name: 'new_patient',
      value: 1,
      timestamp: new Date(),
      category: 'patient'
    });

    await this.aggregateMetric('new_patient_registrations');
  }

  private async updateReactivationMetrics(patient: any) {
    this.addMetricToCache({
      id: `reactivation_${patient.id}`,
      name: 'patient_reactivated',
      value: 1,
      timestamp: new Date(),
      category: 'patient'
    });
  }

  private async updateChairUtilizationMetrics(operatoryStatus: any) {
    const utilization = await this.calculateCurrentChairUtilization();
    
    this.addMetricToCache({
      id: 'chair_utilization',
      name: 'chair_utilization',
      value: utilization,
      unit: '%',
      timestamp: new Date(),
      category: 'operational'
    });

    await this.aggregateMetric('chair_occupancy');
  }

  private async calculateAppointmentProduction(appointmentId: string): Promise<number> {
    const { data } = await supabase
      .from('appointments')
      .select('treatments(price)')
      .eq('id', appointmentId)
      .single();

    if (!data || !data.treatments) return 0;

    const treatments = Array.isArray(data.treatments) ? data.treatments : [];
    return treatments.reduce((sum, t) => sum + (t.price || 0), 0);
  }

  private async calculateRecentNoShowRate(): Promise<number> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const { data: appointments } = await supabase
      .from('appointments')
      .select('status')
      .eq('practice_id', this.practiceId)
      .gte('date', oneHourAgo.toISOString())
      .lte('date', new Date().toISOString());

    if (!appointments || appointments.length === 0) return 0;

    const noShows = appointments.filter(a => a.status === 'no_show').length;
    return (noShows / appointments.length) * 100;
  }

  private async calculateCurrentChairUtilization(): Promise<number> {
    const { data: operatories } = await supabase
      .from('operatory_status')
      .select('status')
      .eq('practice_id', this.practiceId);

    if (!operatories || operatories.length === 0) return 0;

    const occupied = operatories.filter(o => o.status === 'occupied').length;
    return (occupied / operatories.length) * 100;
  }

  private addMetricToCache(metric: RealtimeMetric) {
    const cacheKey = `${metric.category}_${metric.name}`;
    
    if (!this.metricCache.has(cacheKey)) {
      this.metricCache.set(cacheKey, []);
    }

    const cache = this.metricCache.get(cacheKey)!;
    cache.push(metric);

    // Clean old entries based on longest time window
    const maxWindow = Math.max(...Array.from(this.aggregationRules.values()).map(r => r.timeWindow));
    const cutoffTime = new Date(Date.now() - maxWindow * 60 * 1000);
    
    const cleanedCache = cache.filter(m => m.timestamp > cutoffTime);
    this.metricCache.set(cacheKey, cleanedCache);

    // Notify subscribers
    const callback = this.updateCallbacks.get(cacheKey);
    if (callback) {
      callback(metric);
    }
  }

  private async aggregateMetric(metricId: string): Promise<RealtimeMetric | null> {
    const rule = this.aggregationRules.get(metricId);
    if (!rule) return null;

    const cutoffTime = new Date(Date.now() - rule.timeWindow * 60 * 1000);
    const relevantMetrics: RealtimeMetric[] = [];

    // Collect relevant metrics from cache
    for (const [key, metrics] of this.metricCache.entries()) {
      const filtered = metrics.filter(m => 
        m.timestamp > cutoffTime &&
        this.isRelevantForAggregation(m, metricId)
      );
      relevantMetrics.push(...filtered);
    }

    if (relevantMetrics.length === 0) return null;

    let aggregatedValue: number;

    switch (rule.aggregationType) {
      case 'sum':
        aggregatedValue = relevantMetrics.reduce((sum, m) => sum + m.value, 0);
        break;
      case 'average':
        aggregatedValue = relevantMetrics.reduce((sum, m) => sum + m.value, 0) / relevantMetrics.length;
        break;
      case 'count':
        aggregatedValue = relevantMetrics.length;
        break;
      case 'last':
        aggregatedValue = relevantMetrics[relevantMetrics.length - 1].value;
        break;
      case 'max':
        aggregatedValue = Math.max(...relevantMetrics.map(m => m.value));
        break;
      case 'min':
        aggregatedValue = Math.min(...relevantMetrics.map(m => m.value));
        break;
      default:
        aggregatedValue = 0;
    }

    const aggregatedMetric: RealtimeMetric = {
      id: metricId,
      name: metricId,
      value: aggregatedValue,
      unit: relevantMetrics[0]?.unit,
      timestamp: new Date(),
      category: this.getMetricCategory(metricId)
    };

    // Store aggregated metric
    this.addMetricToCache(aggregatedMetric);

    return aggregatedMetric;
  }

  private isRelevantForAggregation(metric: RealtimeMetric, aggregationId: string): boolean {
    // Define relevance rules for each aggregation
    const relevanceMap: Record<string, string[]> = {
      'daily_production': ['appointment_production', 'payment_collected'],
      'hourly_production': ['appointment_production'],
      'patient_throughput': ['patient_started'],
      'new_patient_registrations': ['new_patient'],
      'current_wait_time': ['wait_time'],
      'chair_occupancy': ['chair_utilization']
    };

    const relevantNames = relevanceMap[aggregationId] || [];
    return relevantNames.includes(metric.name);
  }

  private getMetricCategory(metricId: string): 'financial' | 'patient' | 'operational' | 'subdomain' {
    if (metricId.includes('production') || metricId.includes('collection')) return 'financial';
    if (metricId.includes('patient')) return 'patient';
    if (metricId.includes('chair') || metricId.includes('wait') || metricId.includes('throughput')) return 'operational';
    return 'operational';
  }

  private startRefreshTimers() {
    for (const [metricId, rule] of this.aggregationRules.entries()) {
      const timer = setInterval(async () => {
        await this.aggregateMetric(metricId);
      }, rule.refreshInterval * 1000);

      this.refreshTimers.set(metricId, timer);
    }
  }

  subscribeToMetric(metricId: string, callback: (metric: RealtimeMetric) => void) {
    this.updateCallbacks.set(metricId, callback);
  }

  unsubscribeFromMetric(metricId: string) {
    this.updateCallbacks.delete(metricId);
  }

  private triggerAlert(alertType: string, data: any) {
    // Emit alert through event system or notification service
    console.warn(`ALERT [${alertType}]:`, data);
    
    // In production, this would integrate with your notification system
    // Example: notificationService.sendAlert(alertType, data);
  }

  async getLatestMetric(metricId: string): Promise<RealtimeMetric | null> {
    const metrics = this.metricCache.get(metricId);
    if (!metrics || metrics.length === 0) {
      // Try to aggregate if it's an aggregation metric
      return await this.aggregateMetric(metricId);
    }
    return metrics[metrics.length - 1];
  }

  async getMetricHistory(metricId: string, minutes: number): Promise<RealtimeMetric[]> {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    const metrics = this.metricCache.get(metricId) || [];
    return metrics.filter(m => m.timestamp > cutoffTime);
  }

  stopRealtimeSubscriptions() {
    // Unsubscribe from all channels
    for (const channel of this.channels.values()) {
      channel.unsubscribe();
    }
    this.channels.clear();

    // Clear all timers
    for (const timer of this.refreshTimers.values()) {
      clearInterval(timer);
    }
    this.refreshTimers.clear();

    // Clear caches
    this.metricCache.clear();
    this.updateCallbacks.clear();
  }
}