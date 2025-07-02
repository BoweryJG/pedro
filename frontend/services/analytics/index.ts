// Analytics Service Exports
export { MetricsCalculator } from './metricsCalculator';
export type { MetricResult, DashboardMetrics } from './metricsCalculator';

export { RealtimeAggregator } from './realtimeAggregator';
export type { RealtimeMetric, AggregationRule } from './realtimeAggregator';

export { PredictiveAnalytics } from './predictiveAnalytics';
export type { PredictionResult, SchedulingPrediction, PatientRiskScore } from './predictiveAnalytics';

export { BenchmarkService } from './benchmarkService';
export type { BenchmarkData, BenchmarkReport, IndustryBenchmark } from './benchmarkService';

export { InsightsGenerator } from './insightsGenerator';
export type { Insight, InsightRule } from './insightsGenerator';

// Unified Analytics Service
export class AnalyticsService {
  private metricsCalculator: MetricsCalculator;
  private realtimeAggregator: RealtimeAggregator;
  private predictiveAnalytics: PredictiveAnalytics;
  private benchmarkService: BenchmarkService;
  private insightsGenerator: InsightsGenerator;

  constructor(practiceId: string) {
    this.metricsCalculator = new MetricsCalculator(practiceId);
    this.realtimeAggregator = new RealtimeAggregator(practiceId);
    this.predictiveAnalytics = new PredictiveAnalytics(practiceId);
    this.benchmarkService = new BenchmarkService(practiceId);
    this.insightsGenerator = new InsightsGenerator(practiceId);
  }

  // Metrics
  async getMetrics() {
    return this.metricsCalculator.calculateAllMetrics();
  }

  async getRealtimeMetric(metricId: string) {
    return this.realtimeAggregator.getLatestMetric(metricId);
  }

  // Real-time subscriptions
  async startRealtimeTracking() {
    await this.realtimeAggregator.startRealtimeSubscriptions();
  }

  stopRealtimeTracking() {
    this.realtimeAggregator.stopRealtimeSubscriptions();
  }

  subscribeToMetric(metricId: string, callback: (metric: any) => void) {
    this.realtimeAggregator.subscribeToMetric(metricId, callback);
  }

  // Predictions
  async predictScheduling(date: Date) {
    return this.predictiveAnalytics.predictSchedulingOptimization(date);
  }

  async predictPatientBehavior(patientId: string) {
    return this.predictiveAnalytics.predictPatientBehavior(patientId);
  }

  async forecastFinancials(days: number = 30) {
    return this.predictiveAnalytics.forecastFinancialMetrics(days);
  }

  // Benchmarks
  async getBenchmarkReport() {
    return this.benchmarkService.generateBenchmarkReport();
  }

  async getSpecialtyBenchmarks(specialty: 'tmj' | 'implant' | 'ortho') {
    return this.benchmarkService.getSpecialtyBenchmarks(specialty);
  }

  // Insights
  async getInsights() {
    return this.insightsGenerator.generateInsights();
  }

  async subscribeToInsights(callback: (insights: any[]) => void) {
    return this.insightsGenerator.subscribeToInsights(callback);
  }

  async dismissInsight(insightId: string) {
    return this.insightsGenerator.dismissInsight(insightId);
  }

  // Cleanup
  dispose() {
    this.stopRealtimeTracking();
    this.predictiveAnalytics.dispose();
  }
}