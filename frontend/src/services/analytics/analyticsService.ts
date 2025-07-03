import { supabase } from '../../lib/supabase';
import { MetricsCalculator } from './metricsCalculator';
import { RealtimeAggregator } from './realtimeAggregator';
import { PredictiveAnalytics } from './predictiveAnalytics';
import { BenchmarkService } from './benchmarkService';
import { InsightsGenerator } from './insightsGenerator';

export class AnalyticsService {
  private supabase: any;
  private practiceId: string;
  private metricsCalculator: MetricsCalculator;
  private realtimeAggregator: RealtimeAggregator;
  private predictiveAnalytics: PredictiveAnalytics;
  private benchmarkService: BenchmarkService;
  private insightsGenerator: InsightsGenerator;
  private subscriptions: any[] = [];

  constructor(practiceId: string) {
    this.practiceId = practiceId;
    
    // Use shared Supabase client
    this.supabase = supabase;

    // Initialize services
    this.metricsCalculator = new MetricsCalculator(this.supabase, practiceId);
    this.realtimeAggregator = new RealtimeAggregator(this.supabase, practiceId);
    this.predictiveAnalytics = new PredictiveAnalytics(this.supabase, practiceId);
    this.benchmarkService = new BenchmarkService(this.supabase, practiceId);
    this.insightsGenerator = new InsightsGenerator(this.supabase, practiceId);
  }

  async getMetrics() {
    return await this.metricsCalculator.calculateAllMetrics();
  }

  async startRealtimeTracking() {
    await this.realtimeAggregator.startAggregation();
  }

  async stopRealtimeTracking() {
    await this.realtimeAggregator.stopAggregation();
  }

  subscribeToMetric(metricName: string, callback: (metric: any) => void) {
    const subscription = this.realtimeAggregator.subscribeToMetric(metricName, callback);
    this.subscriptions.push(subscription);
    return subscription;
  }

  async predictScheduling(date: Date) {
    return await this.predictiveAnalytics.predictSchedulingOptimization(date);
  }

  async predictPatientBehavior(patientId: string) {
    return await this.predictiveAnalytics.predictPatientBehavior(patientId);
  }

  async getBenchmarkReport() {
    return await this.benchmarkService.generateBenchmarkReport();
  }

  async getInsights() {
    const metrics = await this.getMetrics();
    const benchmarks = await this.getBenchmarkReport();
    const predictions = await this.predictiveAnalytics.generateFinancialForecast();
    
    return await this.insightsGenerator.generateInsights(metrics, benchmarks, predictions);
  }

  async getSubdomainMetrics(subdomain: string) {
    const { data, error } = await this.supabase
      .from('subdomain_analytics')
      .select('*')
      .eq('subdomain', subdomain)
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getDashboardData() {
    const [metrics, insights, benchmarks] = await Promise.all([
      this.getMetrics(),
      this.getInsights(),
      this.getBenchmarkReport()
    ]);

    return {
      metrics,
      insights,
      benchmarks,
      lastUpdated: new Date()
    };
  }

  cleanup() {
    // Cleanup all subscriptions
    this.subscriptions.forEach(sub => {
      if (sub && typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      }
    });
    this.stopRealtimeTracking();
  }
}