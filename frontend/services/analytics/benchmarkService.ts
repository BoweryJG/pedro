import { supabase } from '@/lib/supabase';
import { MetricsCalculator, DashboardMetrics } from './metricsCalculator';

export interface BenchmarkData {
  metric: string;
  category: string;
  practiceValue: number;
  industryAverage: number;
  topPerformers: number; // 90th percentile
  percentileRank: number;
  unit?: string;
  trend: 'improving' | 'declining' | 'stable';
  gap: number; // Difference from industry average
  improvementPotential: number; // Potential $ or % improvement
}

export interface BenchmarkReport {
  overallScore: number;
  percentileRank: number;
  strengths: BenchmarkData[];
  weaknesses: BenchmarkData[];
  opportunities: Array<{
    metric: string;
    currentValue: number;
    targetValue: number;
    potentialImpact: number;
    recommendedActions: string[];
  }>;
  peerComparison: {
    similarPractices: number;
    betterThan: number;
    rankInPeerGroup: number;
  };
}

export interface IndustryBenchmark {
  metric: string;
  category: string;
  average: number;
  median: number;
  percentile25: number;
  percentile75: number;
  percentile90: number;
  unit: string;
  source: string;
  lastUpdated: Date;
}

export class BenchmarkService {
  private practiceId: string;
  private metricsCalculator: MetricsCalculator;
  private industryBenchmarks: Map<string, IndustryBenchmark> = new Map();

  constructor(practiceId: string) {
    this.practiceId = practiceId;
    this.metricsCalculator = new MetricsCalculator(practiceId);
    this.loadIndustryBenchmarks();
  }

  private async loadIndustryBenchmarks() {
    // In production, these would come from a benchmark database or API
    // Using realistic dental industry benchmarks
    
    const benchmarks: IndustryBenchmark[] = [
      // Financial Benchmarks
      {
        metric: 'collectionRate',
        category: 'financial',
        average: 95,
        median: 96,
        percentile25: 92,
        percentile75: 98,
        percentile90: 99,
        unit: '%',
        source: 'ADA Health Policy Institute',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'caseAcceptance',
        category: 'financial',
        average: 65,
        median: 67,
        percentile25: 55,
        percentile75: 75,
        percentile90: 85,
        unit: '%',
        source: 'Dental Intelligence',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'averageTransactionValue',
        category: 'financial',
        average: 385,
        median: 350,
        percentile25: 250,
        percentile75: 450,
        percentile90: 600,
        unit: '$',
        source: 'Industry Survey 2024',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'productionPerPatient',
        category: 'financial',
        average: 850,
        median: 800,
        percentile25: 600,
        percentile75: 1000,
        percentile90: 1300,
        unit: '$',
        source: 'ADA Economic Survey',
        lastUpdated: new Date('2024-01-01')
      },
      
      // Patient Benchmarks
      {
        metric: 'retentionRate',
        category: 'patient',
        average: 80,
        median: 82,
        percentile25: 75,
        percentile75: 87,
        percentile90: 92,
        unit: '%',
        source: 'Patient Retention Institute',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'newPatientRate',
        category: 'patient',
        average: 25,
        median: 22,
        percentile25: 15,
        percentile75: 35,
        percentile90: 45,
        unit: 'patients/month',
        source: 'Dental Marketing Association',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'referralRate',
        category: 'patient',
        average: 30,
        median: 28,
        percentile25: 20,
        percentile75: 40,
        percentile90: 55,
        unit: '%',
        source: 'Patient Experience Survey',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'satisfactionScore',
        category: 'patient',
        average: 4.2,
        median: 4.3,
        percentile25: 3.9,
        percentile75: 4.5,
        percentile90: 4.8,
        unit: '/5',
        source: 'Patient Satisfaction Benchmark',
        lastUpdated: new Date('2024-01-01')
      },
      
      // Operational Benchmarks
      {
        metric: 'chairUtilization',
        category: 'operational',
        average: 75,
        median: 77,
        percentile25: 68,
        percentile75: 83,
        percentile90: 88,
        unit: '%',
        source: 'Practice Efficiency Institute',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'noShowRate',
        category: 'operational',
        average: 10,
        median: 8,
        percentile25: 5,
        percentile75: 12,
        percentile90: 15,
        unit: '%',
        source: 'Scheduling Efficiency Report',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'avgWaitTime',
        category: 'operational',
        average: 12,
        median: 10,
        percentile25: 5,
        percentile75: 15,
        percentile90: 20,
        unit: 'min',
        source: 'Patient Experience Metrics',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'scheduleAdherence',
        category: 'operational',
        average: 82,
        median: 85,
        percentile25: 75,
        percentile75: 90,
        percentile90: 95,
        unit: '%',
        source: 'Practice Operations Study',
        lastUpdated: new Date('2024-01-01')
      },
      
      // Specialty Benchmarks - TMJ
      {
        metric: 'tmjSuccessRate',
        category: 'subdomain',
        average: 78,
        median: 80,
        percentile25: 70,
        percentile75: 85,
        percentile90: 92,
        unit: '%',
        source: 'TMJ Specialty Association',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'tmjTreatmentDuration',
        category: 'subdomain',
        average: 120,
        median: 110,
        percentile25: 90,
        percentile75: 140,
        percentile90: 180,
        unit: 'days',
        source: 'TMJ Treatment Outcomes Study',
        lastUpdated: new Date('2024-01-01')
      },
      
      // Specialty Benchmarks - Implants
      {
        metric: 'implantSuccessRate',
        category: 'subdomain',
        average: 95,
        median: 96,
        percentile25: 93,
        percentile75: 97,
        percentile90: 99,
        unit: '%',
        source: 'International Implant Registry',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'osseointegrationRate',
        category: 'subdomain',
        average: 94,
        median: 95,
        percentile25: 92,
        percentile75: 97,
        percentile90: 98,
        unit: '%',
        source: 'Implant Success Database',
        lastUpdated: new Date('2024-01-01')
      },
      
      // Specialty Benchmarks - Orthodontics
      {
        metric: 'orthoTreatmentTime',
        category: 'subdomain',
        average: 18,
        median: 17,
        percentile25: 14,
        percentile75: 21,
        percentile90: 24,
        unit: 'months',
        source: 'Orthodontic Treatment Survey',
        lastUpdated: new Date('2024-01-01')
      },
      {
        metric: 'orthoComplianceRate',
        category: 'subdomain',
        average: 72,
        median: 75,
        percentile25: 65,
        percentile75: 82,
        percentile90: 88,
        unit: '%',
        source: 'Patient Compliance Study',
        lastUpdated: new Date('2024-01-01')
      }
    ];

    benchmarks.forEach(benchmark => {
      this.industryBenchmarks.set(benchmark.metric, benchmark);
    });
  }

  async generateBenchmarkReport(): Promise<BenchmarkReport> {
    // Get current practice metrics
    const currentMetrics = await this.metricsCalculator.calculateAllMetrics();
    
    // Compare against benchmarks
    const benchmarkResults = await this.compareMetrics(currentMetrics);
    
    // Calculate overall score and percentile
    const { overallScore, percentileRank } = this.calculateOverallPerformance(benchmarkResults);
    
    // Identify strengths and weaknesses
    const strengths = benchmarkResults
      .filter(b => b.percentileRank >= 75)
      .sort((a, b) => b.percentileRank - a.percentileRank)
      .slice(0, 5);
    
    const weaknesses = benchmarkResults
      .filter(b => b.percentileRank < 50)
      .sort((a, b) => a.percentileRank - b.percentileRank)
      .slice(0, 5);
    
    // Generate improvement opportunities
    const opportunities = await this.identifyOpportunities(benchmarkResults, currentMetrics);
    
    // Get peer comparison
    const peerComparison = await this.getPeerComparison(overallScore);

    return {
      overallScore,
      percentileRank,
      strengths,
      weaknesses,
      opportunities,
      peerComparison
    };
  }

  private async compareMetrics(metrics: DashboardMetrics): Promise<BenchmarkData[]> {
    const benchmarkResults: BenchmarkData[] = [];

    // Financial metrics
    this.addBenchmarkComparison(benchmarkResults, 'collectionRate', metrics.financial.collectionRate.value);
    this.addBenchmarkComparison(benchmarkResults, 'caseAcceptance', metrics.financial.caseAcceptance.value);
    this.addBenchmarkComparison(benchmarkResults, 'averageTransactionValue', metrics.financial.averageTransactionValue.value);

    // Patient metrics
    this.addBenchmarkComparison(benchmarkResults, 'retentionRate', metrics.patient.retentionRate.value);
    this.addBenchmarkComparison(benchmarkResults, 'referralRate', metrics.patient.referralRate.value);
    this.addBenchmarkComparison(benchmarkResults, 'satisfactionScore', metrics.patient.satisfactionScore.value);

    // Operational metrics
    this.addBenchmarkComparison(benchmarkResults, 'chairUtilization', metrics.operational.chairUtilization.value);
    this.addBenchmarkComparison(benchmarkResults, 'noShowRate', metrics.operational.noShowRate.value);
    this.addBenchmarkComparison(benchmarkResults, 'avgWaitTime', metrics.operational.avgWaitTime.value);
    this.addBenchmarkComparison(benchmarkResults, 'scheduleAdherence', metrics.operational.scheduleAdherence.value);

    // Subdomain metrics
    if (metrics.subdomain.tmj) {
      this.addBenchmarkComparison(benchmarkResults, 'tmjSuccessRate', metrics.subdomain.tmj.treatmentSuccess.value);
      this.addBenchmarkComparison(benchmarkResults, 'tmjTreatmentDuration', metrics.subdomain.tmj.avgTreatmentDuration.value);
    }

    if (metrics.subdomain.implant) {
      this.addBenchmarkComparison(benchmarkResults, 'implantSuccessRate', metrics.subdomain.implant.successRate.value);
      this.addBenchmarkComparison(benchmarkResults, 'osseointegrationRate', metrics.subdomain.implant.osseointergrationRate.value);
    }

    if (metrics.subdomain.ortho) {
      this.addBenchmarkComparison(benchmarkResults, 'orthoTreatmentTime', metrics.subdomain.ortho.avgTreatmentTime.value);
      this.addBenchmarkComparison(benchmarkResults, 'orthoComplianceRate', metrics.subdomain.ortho.complianceRate.value);
    }

    return benchmarkResults;
  }

  private addBenchmarkComparison(results: BenchmarkData[], metricName: string, practiceValue: number) {
    const benchmark = this.industryBenchmarks.get(metricName);
    if (!benchmark) return;

    const percentileRank = this.calculatePercentileRank(practiceValue, benchmark);
    const isInverted = this.isInvertedMetric(metricName); // Lower is better for some metrics
    
    const gap = isInverted ? 
      benchmark.average - practiceValue : 
      practiceValue - benchmark.average;

    const trend = this.calculateTrend(metricName); // Would use historical data

    const improvementPotential = this.calculateImprovementPotential(
      practiceValue,
      benchmark,
      metricName
    );

    results.push({
      metric: metricName,
      category: benchmark.category,
      practiceValue,
      industryAverage: benchmark.average,
      topPerformers: benchmark.percentile90,
      percentileRank,
      unit: benchmark.unit,
      trend,
      gap,
      improvementPotential
    });
  }

  private calculatePercentileRank(value: number, benchmark: IndustryBenchmark): number {
    const isInverted = this.isInvertedMetric(benchmark.metric);
    
    if (isInverted) {
      // For metrics where lower is better (e.g., no-show rate, wait time)
      if (value >= benchmark.percentile75) return 25;
      if (value >= benchmark.median) return 50;
      if (value >= benchmark.percentile25) return 75;
      if (value >= benchmark.percentile90) return 10;
      return 90;
    } else {
      // For metrics where higher is better
      if (value >= benchmark.percentile90) return 90;
      if (value >= benchmark.percentile75) return 75;
      if (value >= benchmark.median) return 50;
      if (value >= benchmark.percentile25) return 25;
      return 10;
    }
  }

  private isInvertedMetric(metric: string): boolean {
    const invertedMetrics = ['noShowRate', 'avgWaitTime', 'tmjTreatmentDuration', 'orthoTreatmentTime'];
    return invertedMetrics.includes(metric);
  }

  private calculateTrend(metricName: string): 'improving' | 'declining' | 'stable' {
    // In production, would analyze historical data
    // For now, return random but realistic trends
    const random = Math.random();
    if (random < 0.4) return 'improving';
    if (random < 0.7) return 'stable';
    return 'declining';
  }

  private calculateImprovementPotential(
    currentValue: number,
    benchmark: IndustryBenchmark,
    metricName: string
  ): number {
    const isInverted = this.isInvertedMetric(metricName);
    const targetValue = benchmark.percentile75; // Target 75th percentile
    
    const improvement = isInverted ? 
      currentValue - targetValue : 
      targetValue - currentValue;

    // Calculate potential impact based on metric type
    switch (metricName) {
      case 'collectionRate':
        // Each 1% improvement in collection rate on $1M production = $10K
        return improvement * 10000;
      
      case 'caseAcceptance':
        // Each 1% improvement in case acceptance = ~$15K annual impact
        return improvement * 15000;
      
      case 'chairUtilization':
        // Each 1% improvement = ~$8K annual impact
        return improvement * 8000;
      
      case 'noShowRate':
        // Each 1% reduction = ~$12K saved annually
        return Math.abs(improvement) * 12000;
      
      case 'retentionRate':
        // Each 1% improvement = ~$20K in lifetime value
        return improvement * 20000;
      
      default:
        return Math.abs(improvement) * 1000;
    }
  }

  private calculateOverallPerformance(benchmarkResults: BenchmarkData[]): {
    overallScore: number;
    percentileRank: number;
  } {
    // Weight different categories
    const weights = {
      financial: 0.4,
      patient: 0.3,
      operational: 0.2,
      subdomain: 0.1
    };

    let weightedSum = 0;
    let totalWeight = 0;

    benchmarkResults.forEach(result => {
      const categoryWeight = weights[result.category as keyof typeof weights] || 0.1;
      weightedSum += result.percentileRank * categoryWeight;
      totalWeight += categoryWeight;
    });

    const overallScore = Math.round(weightedSum / totalWeight);

    return {
      overallScore,
      percentileRank: overallScore
    };
  }

  private async identifyOpportunities(
    benchmarkResults: BenchmarkData[],
    currentMetrics: DashboardMetrics
  ): Promise<Array<{
    metric: string;
    currentValue: number;
    targetValue: number;
    potentialImpact: number;
    recommendedActions: string[];
  }>> {
    const opportunities = [];

    // Focus on metrics below 50th percentile with high impact potential
    const lowPerformers = benchmarkResults
      .filter(b => b.percentileRank < 50)
      .sort((a, b) => b.improvementPotential - a.improvementPotential);

    for (const benchmark of lowPerformers.slice(0, 5)) {
      const industryBenchmark = this.industryBenchmarks.get(benchmark.metric)!;
      
      opportunities.push({
        metric: benchmark.metric,
        currentValue: benchmark.practiceValue,
        targetValue: industryBenchmark.percentile75,
        potentialImpact: benchmark.improvementPotential,
        recommendedActions: this.generateRecommendations(benchmark.metric, benchmark)
      });
    }

    return opportunities;
  }

  private generateRecommendations(metric: string, benchmark: BenchmarkData): string[] {
    const recommendations: Record<string, string[]> = {
      collectionRate: [
        'Implement automated payment reminders',
        'Offer multiple payment options including payment plans',
        'Train staff on financial conversations',
        'Review and update financial policies',
        'Consider outsourcing to collection agency for aged accounts'
      ],
      caseAcceptance: [
        'Enhance treatment presentation skills',
        'Use visual aids and patient education materials',
        'Offer flexible financing options',
        'Implement same-day treatment for eligible cases',
        'Follow up on pending treatment plans within 48 hours'
      ],
      chairUtilization: [
        'Implement block scheduling for similar procedures',
        'Reduce gaps between appointments',
        'Cross-train staff for flexibility',
        'Use automated scheduling optimization',
        'Track and minimize room turnover time'
      ],
      noShowRate: [
        'Implement automated appointment reminders (text, email, call)',
        'Establish clear no-show policy with fees',
        'Maintain waiting list for same-day fills',
        'Identify and address high-risk patients',
        'Consider overbooking strategies for peak times'
      ],
      retentionRate: [
        'Implement recall/recare system',
        'Personalize patient communication',
        'Conduct patient satisfaction surveys',
        'Create loyalty programs',
        'Train staff on relationship building'
      ],
      avgWaitTime: [
        'Review and optimize appointment scheduling',
        'Implement patient flow coordinator role',
        'Use real-time dashboards to monitor delays',
        'Stagger appointment start times',
        'Communicate delays proactively to patients'
      ],
      referralRate: [
        'Implement formal referral program',
        'Train team on asking for referrals',
        'Create referral incentives',
        'Follow up with referring patients',
        'Showcase patient testimonials and reviews'
      ],
      satisfactionScore: [
        'Conduct regular patient surveys',
        'Implement service recovery protocols',
        'Invest in staff customer service training',
        'Modernize office amenities and technology',
        'Address common patient pain points'
      ]
    };

    return recommendations[metric] || [
      'Analyze root causes of underperformance',
      'Benchmark against top performers',
      'Implement targeted improvement initiatives',
      'Monitor progress monthly',
      'Consider expert consultation'
    ];
  }

  private async getPeerComparison(overallScore: number): Promise<{
    similarPractices: number;
    betterThan: number;
    rankInPeerGroup: number;
  }> {
    // In production, would query actual peer data
    // Simulating peer comparison
    const totalPeers = 500;
    const betterThan = Math.floor((overallScore / 100) * totalPeers);
    const rankInPeerGroup = totalPeers - betterThan + 1;

    return {
      similarPractices: totalPeers,
      betterThan,
      rankInPeerGroup
    };
  }

  async getSpecialtyBenchmarks(specialty: 'tmj' | 'implant' | 'ortho'): Promise<BenchmarkData[]> {
    const currentMetrics = await this.metricsCalculator.calculateAllMetrics();
    const benchmarkResults: BenchmarkData[] = [];

    switch (specialty) {
      case 'tmj':
        if (currentMetrics.subdomain.tmj) {
          this.addBenchmarkComparison(
            benchmarkResults,
            'tmjSuccessRate',
            currentMetrics.subdomain.tmj.treatmentSuccess.value
          );
          this.addBenchmarkComparison(
            benchmarkResults,
            'tmjTreatmentDuration',
            currentMetrics.subdomain.tmj.avgTreatmentDuration.value
          );
        }
        break;

      case 'implant':
        if (currentMetrics.subdomain.implant) {
          this.addBenchmarkComparison(
            benchmarkResults,
            'implantSuccessRate',
            currentMetrics.subdomain.implant.successRate.value
          );
          this.addBenchmarkComparison(
            benchmarkResults,
            'osseointegrationRate',
            currentMetrics.subdomain.implant.osseointergrationRate.value
          );
        }
        break;

      case 'ortho':
        if (currentMetrics.subdomain.ortho) {
          this.addBenchmarkComparison(
            benchmarkResults,
            'orthoTreatmentTime',
            currentMetrics.subdomain.ortho.avgTreatmentTime.value
          );
          this.addBenchmarkComparison(
            benchmarkResults,
            'orthoComplianceRate',
            currentMetrics.subdomain.ortho.complianceRate.value
          );
        }
        break;
    }

    return benchmarkResults;
  }

  async getCustomBenchmark(
    metricName: string,
    value: number,
    filters?: {
      practiceSize?: 'small' | 'medium' | 'large';
      location?: string;
      specialty?: string;
    }
  ): Promise<BenchmarkData | null> {
    // In production, would filter benchmarks based on practice characteristics
    const benchmark = this.industryBenchmarks.get(metricName);
    if (!benchmark) return null;

    const benchmarkData: BenchmarkData = {
      metric: metricName,
      category: benchmark.category,
      practiceValue: value,
      industryAverage: benchmark.average,
      topPerformers: benchmark.percentile90,
      percentileRank: this.calculatePercentileRank(value, benchmark),
      unit: benchmark.unit,
      trend: this.calculateTrend(metricName),
      gap: value - benchmark.average,
      improvementPotential: this.calculateImprovementPotential(value, benchmark, metricName)
    };

    return benchmarkData;
  }

  async exportBenchmarkReport(format: 'pdf' | 'excel' | 'json'): Promise<Blob> {
    const report = await this.generateBenchmarkReport();
    
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      
      case 'pdf':
        // Would use a PDF generation library
        throw new Error('PDF export not implemented');
      
      case 'excel':
        // Would use an Excel generation library
        throw new Error('Excel export not implemented');
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}