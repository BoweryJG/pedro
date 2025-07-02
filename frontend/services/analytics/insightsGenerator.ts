import { supabase } from '@/lib/supabase';
import { MetricsCalculator, DashboardMetrics, MetricResult } from './metricsCalculator';
import { PredictiveAnalytics } from './predictiveAnalytics';
import { BenchmarkService, BenchmarkData } from './benchmarkService';
import { format, subDays, startOfMonth } from 'date-fns';

export interface Insight {
  id: string;
  type: 'alert' | 'opportunity' | 'trend' | 'achievement' | 'recommendation';
  priority: 'high' | 'medium' | 'low';
  category: 'financial' | 'patient' | 'operational' | 'clinical';
  title: string;
  description: string;
  impact: string;
  metrics: Array<{
    name: string;
    value: number;
    unit: string;
    change?: number;
  }>;
  actions: Array<{
    text: string;
    type: 'primary' | 'secondary';
    link?: string;
  }>;
  timestamp: Date;
  expiresAt?: Date;
  visual?: {
    type: 'chart' | 'gauge' | 'comparison';
    data: any;
  };
}

export interface InsightRule {
  id: string;
  name: string;
  condition: (metrics: DashboardMetrics, historical?: any) => boolean;
  generator: (metrics: DashboardMetrics, historical?: any) => Insight | null;
  frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  enabled: boolean;
}

export class InsightsGenerator {
  private practiceId: string;
  private metricsCalculator: MetricsCalculator;
  private predictiveAnalytics: PredictiveAnalytics;
  private benchmarkService: BenchmarkService;
  private insightRules: Map<string, InsightRule> = new Map();
  private generatedInsights: Map<string, Insight> = new Map();

  constructor(practiceId: string) {
    this.practiceId = practiceId;
    this.metricsCalculator = new MetricsCalculator(practiceId);
    this.predictiveAnalytics = new PredictiveAnalytics(practiceId);
    this.benchmarkService = new BenchmarkService(practiceId);
    this.initializeInsightRules();
  }

  private initializeInsightRules() {
    // Financial Insights
    this.addRule({
      id: 'low_collection_rate',
      name: 'Low Collection Rate Alert',
      condition: (metrics) => metrics.financial.collectionRate.value < 90,
      generator: (metrics) => this.generateLowCollectionRateInsight(metrics),
      frequency: 'daily',
      enabled: true
    });

    this.addRule({
      id: 'declining_case_acceptance',
      name: 'Declining Case Acceptance',
      condition: (metrics) => 
        metrics.financial.caseAcceptance.trend === 'down' && 
        metrics.financial.caseAcceptance.changePercent! < -5,
      generator: (metrics) => this.generateDecliningCaseAcceptanceInsight(metrics),
      frequency: 'daily',
      enabled: true
    });

    this.addRule({
      id: 'production_milestone',
      name: 'Production Milestone Achievement',
      condition: (metrics) => 
        metrics.financial.monthlyProduction.value > 100000 &&
        metrics.financial.monthlyProduction.changePercent! > 10,
      generator: (metrics) => this.generateProductionMilestoneInsight(metrics),
      frequency: 'daily',
      enabled: true
    });

    // Patient Insights
    this.addRule({
      id: 'high_no_show_rate',
      name: 'High No-Show Rate',
      condition: (metrics) => metrics.operational.noShowRate.value > 15,
      generator: (metrics) => this.generateHighNoShowInsight(metrics),
      frequency: 'hourly',
      enabled: true
    });

    this.addRule({
      id: 'patient_retention_drop',
      name: 'Patient Retention Drop',
      condition: (metrics) => 
        metrics.patient.retentionRate.value < 75 ||
        (metrics.patient.retentionRate.trend === 'down' && metrics.patient.retentionRate.changePercent! < -3),
      generator: (metrics) => this.generateRetentionDropInsight(metrics),
      frequency: 'weekly',
      enabled: true
    });

    this.addRule({
      id: 'new_patient_surge',
      name: 'New Patient Surge',
      condition: (metrics) => 
        metrics.patient.newPatients.changePercent! > 25 &&
        metrics.patient.newPatients.value > 30,
      generator: (metrics) => this.generateNewPatientSurgeInsight(metrics),
      frequency: 'daily',
      enabled: true
    });

    // Operational Insights
    this.addRule({
      id: 'low_chair_utilization',
      name: 'Low Chair Utilization',
      condition: (metrics) => metrics.operational.chairUtilization.value < 65,
      generator: (metrics) => this.generateLowUtilizationInsight(metrics),
      frequency: 'hourly',
      enabled: true
    });

    this.addRule({
      id: 'scheduling_inefficiency',
      name: 'Scheduling Inefficiency',
      condition: (metrics) => 
        metrics.operational.scheduleAdherence.value < 80 ||
        metrics.operational.avgWaitTime.value > 15,
      generator: (metrics) => this.generateSchedulingInsight(metrics),
      frequency: 'hourly',
      enabled: true
    });

    // Clinical Insights (Subdomain specific)
    this.addRule({
      id: 'tmj_outcomes_improvement',
      name: 'TMJ Treatment Outcomes',
      condition: (metrics) => 
        metrics.subdomain.tmj.outcomeScore.value > 8 &&
        metrics.subdomain.tmj.treatmentSuccess.value > 85,
      generator: (metrics) => this.generateTMJSuccessInsight(metrics),
      frequency: 'weekly',
      enabled: true
    });

    this.addRule({
      id: 'implant_success_benchmark',
      name: 'Implant Success Benchmark',
      condition: (metrics) => metrics.subdomain.implant.successRate.value > 97,
      generator: (metrics) => this.generateImplantSuccessInsight(metrics),
      frequency: 'weekly',
      enabled: true
    });
  }

  private addRule(rule: InsightRule) {
    this.insightRules.set(rule.id, rule);
  }

  async generateInsights(): Promise<Insight[]> {
    const metrics = await this.metricsCalculator.calculateAllMetrics();
    const historicalData = await this.getHistoricalData();
    const benchmarks = await this.benchmarkService.generateBenchmarkReport();
    
    const insights: Insight[] = [];

    // Run all enabled rules
    for (const rule of this.insightRules.values()) {
      if (!rule.enabled) continue;

      try {
        if (rule.condition(metrics, historicalData)) {
          const insight = rule.generator(metrics, historicalData);
          if (insight && !this.isDuplicateInsight(insight)) {
            insights.push(insight);
            this.generatedInsights.set(insight.id, insight);
          }
        }
      } catch (error) {
        console.error(`Error generating insight ${rule.id}:`, error);
      }
    }

    // Add predictive insights
    const predictiveInsights = await this.generatePredictiveInsights();
    insights.push(...predictiveInsights);

    // Add benchmark insights
    const benchmarkInsights = this.generateBenchmarkInsights(benchmarks);
    insights.push(...benchmarkInsights);

    // Sort by priority and timestamp
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  }

  private generateLowCollectionRateInsight(metrics: DashboardMetrics): Insight {
    const collectionRate = metrics.financial.collectionRate;
    const outstandingBalance = metrics.financial.outstandingBalance;

    return {
      id: `collection_rate_${Date.now()}`,
      type: 'alert',
      priority: 'high',
      category: 'financial',
      title: 'Collection Rate Below Target',
      description: `Your collection rate is currently ${collectionRate.value.toFixed(1)}%, which is below the recommended 95% threshold. This represents ${this.formatCurrency(outstandingBalance.value)} in outstanding balances.`,
      impact: `Improving collection rate to 95% could recover approximately ${this.formatCurrency(outstandingBalance.value * 0.2)} in the next 30 days.`,
      metrics: [
        {
          name: 'Collection Rate',
          value: collectionRate.value,
          unit: '%',
          change: collectionRate.changePercent
        },
        {
          name: 'Outstanding Balance',
          value: outstandingBalance.value,
          unit: '$'
        }
      ],
      actions: [
        {
          text: 'Review Aging Report',
          type: 'primary',
          link: '/reports/aging'
        },
        {
          text: 'Update Collection Procedures',
          type: 'secondary',
          link: '/settings/billing'
        }
      ],
      timestamp: new Date(),
      visual: {
        type: 'gauge',
        data: {
          value: collectionRate.value,
          target: 95,
          min: 0,
          max: 100,
          thresholds: [
            { value: 90, color: 'red' },
            { value: 95, color: 'yellow' },
            { value: 98, color: 'green' }
          ]
        }
      }
    };
  }

  private generateDecliningCaseAcceptanceInsight(metrics: DashboardMetrics): Insight {
    const caseAcceptance = metrics.financial.caseAcceptance;
    const potentialRevenue = 50000; // Estimated based on average case value

    return {
      id: `case_acceptance_${Date.now()}`,
      type: 'opportunity',
      priority: 'high',
      category: 'financial',
      title: 'Case Acceptance Rate Declining',
      description: `Case acceptance has dropped ${Math.abs(caseAcceptance.changePercent!).toFixed(1)}% to ${caseAcceptance.value.toFixed(1)}%. This trend could impact revenue growth.`,
      impact: `Each 5% improvement in case acceptance could generate an additional ${this.formatCurrency(potentialRevenue)} annually.`,
      metrics: [
        {
          name: 'Case Acceptance',
          value: caseAcceptance.value,
          unit: '%',
          change: caseAcceptance.changePercent
        },
        {
          name: 'Previous Rate',
          value: caseAcceptance.previousValue!,
          unit: '%'
        }
      ],
      actions: [
        {
          text: 'Schedule Team Training',
          type: 'primary',
          link: '/training/case-presentation'
        },
        {
          text: 'Review Financing Options',
          type: 'secondary',
          link: '/settings/financing'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateProductionMilestoneInsight(metrics: DashboardMetrics): Insight {
    const production = metrics.financial.monthlyProduction;

    return {
      id: `production_milestone_${Date.now()}`,
      type: 'achievement',
      priority: 'medium',
      category: 'financial',
      title: 'Production Milestone Achieved! 🎉',
      description: `Congratulations! Monthly production reached ${this.formatCurrency(production.value)}, a ${production.changePercent!.toFixed(1)}% increase from last month.`,
      impact: `At this growth rate, annual production could reach ${this.formatCurrency(production.value * 12 * 1.1)}.`,
      metrics: [
        {
          name: 'Monthly Production',
          value: production.value,
          unit: '$',
          change: production.changePercent
        }
      ],
      actions: [
        {
          text: 'Share with Team',
          type: 'primary'
        },
        {
          text: 'View Detailed Report',
          type: 'secondary',
          link: '/reports/production'
        }
      ],
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    };
  }

  private generateHighNoShowInsight(metrics: DashboardMetrics): Insight {
    const noShowRate = metrics.operational.noShowRate;
    const estimatedLoss = noShowRate.value * 250 * 20; // Avg appointment value * daily appointments

    return {
      id: `no_show_${Date.now()}`,
      type: 'alert',
      priority: 'high',
      category: 'operational',
      title: 'No-Show Rate Exceeds Threshold',
      description: `No-show rate has reached ${noShowRate.value.toFixed(1)}%, significantly above the 10% industry average.`,
      impact: `Current no-shows are costing approximately ${this.formatCurrency(estimatedLoss)} per month in lost production.`,
      metrics: [
        {
          name: 'No-Show Rate',
          value: noShowRate.value,
          unit: '%',
          change: noShowRate.changePercent
        }
      ],
      actions: [
        {
          text: 'Configure Reminder Settings',
          type: 'primary',
          link: '/settings/reminders'
        },
        {
          text: 'View No-Show Patients',
          type: 'secondary',
          link: '/patients/no-shows'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateRetentionDropInsight(metrics: DashboardMetrics): Insight {
    const retention = metrics.patient.retentionRate;
    const activePatients = metrics.patient.activePatients;
    const atRiskPatients = Math.round(activePatients.value * (1 - retention.value / 100));

    return {
      id: `retention_${Date.now()}`,
      type: 'alert',
      priority: 'high',
      category: 'patient',
      title: 'Patient Retention Needs Attention',
      description: `Patient retention rate is ${retention.value.toFixed(1)}%, with approximately ${atRiskPatients} patients at risk of becoming inactive.`,
      impact: `Improving retention by 5% could preserve ${this.formatCurrency(atRiskPatients * 850)} in annual revenue.`,
      metrics: [
        {
          name: 'Retention Rate',
          value: retention.value,
          unit: '%',
          change: retention.changePercent
        },
        {
          name: 'At-Risk Patients',
          value: atRiskPatients,
          unit: 'patients'
        }
      ],
      actions: [
        {
          text: 'Launch Reactivation Campaign',
          type: 'primary',
          link: '/campaigns/reactivation'
        },
        {
          text: 'Review Inactive Patients',
          type: 'secondary',
          link: '/patients/inactive'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateNewPatientSurgeInsight(metrics: DashboardMetrics): Insight {
    const newPatients = metrics.patient.newPatients;

    return {
      id: `new_patients_${Date.now()}`,
      type: 'opportunity',
      priority: 'medium',
      category: 'patient',
      title: 'New Patient Growth Surge',
      description: `New patient acquisitions increased ${newPatients.changePercent!.toFixed(1)}% with ${newPatients.value} new patients this month.`,
      impact: `Maintaining this growth rate could add ${Math.round(newPatients.value * 12 * 850)} in annual production.`,
      metrics: [
        {
          name: 'New Patients',
          value: newPatients.value,
          unit: 'patients',
          change: newPatients.changePercent
        }
      ],
      actions: [
        {
          text: 'Optimize Onboarding',
          type: 'primary',
          link: '/settings/onboarding'
        },
        {
          text: 'Schedule Additional Staff',
          type: 'secondary',
          link: '/schedule/staff'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateLowUtilizationInsight(metrics: DashboardMetrics): Insight {
    const utilization = metrics.operational.chairUtilization;
    const potentialSlots = Math.round((85 - utilization.value) / 100 * 40); // Daily slots

    return {
      id: `utilization_${Date.now()}`,
      type: 'opportunity',
      priority: 'medium',
      category: 'operational',
      title: 'Chair Utilization Below Optimal',
      description: `Current chair utilization is ${utilization.value.toFixed(1)}%, leaving approximately ${potentialSlots} appointment slots unfilled daily.`,
      impact: `Reaching 85% utilization could generate an additional ${this.formatCurrency(potentialSlots * 250 * 20)} monthly.`,
      metrics: [
        {
          name: 'Chair Utilization',
          value: utilization.value,
          unit: '%',
          change: utilization.changePercent
        }
      ],
      actions: [
        {
          text: 'Review Schedule Blocks',
          type: 'primary',
          link: '/schedule/optimization'
        },
        {
          text: 'Enable Online Booking',
          type: 'secondary',
          link: '/settings/online-booking'
        }
      ],
      timestamp: new Date(),
      visual: {
        type: 'chart',
        data: {
          type: 'line',
          labels: ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM'],
          datasets: [{
            label: 'Utilization',
            data: [0, 45, 78, 82, 35],
            target: 85
          }]
        }
      }
    };
  }

  private generateSchedulingInsight(metrics: DashboardMetrics): Insight {
    const adherence = metrics.operational.scheduleAdherence;
    const waitTime = metrics.operational.avgWaitTime;

    return {
      id: `scheduling_${Date.now()}`,
      type: 'recommendation',
      priority: 'medium',
      category: 'operational',
      title: 'Scheduling Efficiency Can Be Improved',
      description: `Schedule adherence is ${adherence.value.toFixed(1)}% with average wait times of ${waitTime.value} minutes.`,
      impact: 'Better scheduling could improve patient satisfaction and allow for 2-3 additional appointments daily.',
      metrics: [
        {
          name: 'Schedule Adherence',
          value: adherence.value,
          unit: '%'
        },
        {
          name: 'Avg Wait Time',
          value: waitTime.value,
          unit: 'min'
        }
      ],
      actions: [
        {
          text: 'Analyze Bottlenecks',
          type: 'primary',
          link: '/analytics/scheduling'
        },
        {
          text: 'Adjust Time Slots',
          type: 'secondary',
          link: '/settings/appointments'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateTMJSuccessInsight(metrics: DashboardMetrics): Insight {
    const tmj = metrics.subdomain.tmj;

    return {
      id: `tmj_success_${Date.now()}`,
      type: 'achievement',
      priority: 'low',
      category: 'clinical',
      title: 'Excellent TMJ Treatment Outcomes',
      description: `TMJ treatment success rate of ${tmj.treatmentSuccess.value.toFixed(1)}% with outcome scores averaging ${tmj.outcomeScore.value.toFixed(1)}/10.`,
      impact: 'These exceptional results position the practice as a leader in TMJ treatment.',
      metrics: [
        {
          name: 'Success Rate',
          value: tmj.treatmentSuccess.value,
          unit: '%'
        },
        {
          name: 'Outcome Score',
          value: tmj.outcomeScore.value,
          unit: '/10'
        }
      ],
      actions: [
        {
          text: 'Share Success Stories',
          type: 'primary',
          link: '/marketing/testimonials'
        },
        {
          text: 'Update Website',
          type: 'secondary'
        }
      ],
      timestamp: new Date()
    };
  }

  private generateImplantSuccessInsight(metrics: DashboardMetrics): Insight {
    const implant = metrics.subdomain.implant;

    return {
      id: `implant_success_${Date.now()}`,
      type: 'achievement',
      priority: 'low',
      category: 'clinical',
      title: 'Implant Success Rate Exceeds Industry Standards',
      description: `Achieving ${implant.successRate.value.toFixed(1)}% implant success rate, well above the 95% industry benchmark.`,
      impact: 'This excellence in implant procedures can attract more complex cases and referrals.',
      metrics: [
        {
          name: 'Success Rate',
          value: implant.successRate.value,
          unit: '%'
        },
        {
          name: 'Osseointegration',
          value: implant.osseointergrationRate.value,
          unit: '%'
        }
      ],
      actions: [
        {
          text: 'Request Reviews',
          type: 'primary',
          link: '/patients/reviews'
        },
        {
          text: 'Update Credentials',
          type: 'secondary'
        }
      ],
      timestamp: new Date()
    };
  }

  private async generatePredictiveInsights(): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Schedule optimization prediction
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const schedulePrediction = await this.predictiveAnalytics.predictSchedulingOptimization(tomorrow);
    
    if (schedulePrediction.predictedNoShows > 2) {
      insights.push({
        id: `predict_noshows_${Date.now()}`,
        type: 'recommendation',
        priority: 'medium',
        category: 'operational',
        title: 'No-Shows Predicted for Tomorrow',
        description: `ML model predicts ${schedulePrediction.predictedNoShows} no-shows for ${format(tomorrow, 'EEEE, MMM d')}.`,
        impact: `Consider overbooking ${schedulePrediction.optimalOverbooking} slots to maintain production.`,
        metrics: [
          {
            name: 'Predicted No-Shows',
            value: schedulePrediction.predictedNoShows,
            unit: 'patients'
          },
          {
            name: 'Recommended Overbooks',
            value: schedulePrediction.optimalOverbooking,
            unit: 'slots'
          }
        ],
        actions: [
          {
            text: 'Adjust Tomorrow\'s Schedule',
            type: 'primary',
            link: '/schedule/tomorrow'
          }
        ],
        timestamp: new Date()
      });
    }

    // Financial forecast
    const financialForecast = await this.predictiveAnalytics.forecastFinancialMetrics(7);
    const nextWeekProduction = financialForecast.reduce((sum, f) => sum + f.production.value, 0);
    
    insights.push({
      id: `forecast_production_${Date.now()}`,
      type: 'trend',
      priority: 'low',
      category: 'financial',
      title: '7-Day Production Forecast',
      description: `Next week's production is forecasted at ${this.formatCurrency(nextWeekProduction)} based on current scheduling and historical patterns.`,
      impact: 'Use this forecast to set weekly goals and adjust staffing if needed.',
      metrics: [
        {
          name: 'Forecasted Production',
          value: nextWeekProduction,
          unit: '$'
        }
      ],
      actions: [
        {
          text: 'View Detailed Forecast',
          type: 'primary',
          link: '/analytics/forecast'
        }
      ],
      timestamp: new Date(),
      visual: {
        type: 'chart',
        data: {
          type: 'bar',
          labels: financialForecast.map(f => format(f.date, 'EEE')),
          datasets: [{
            label: 'Forecasted Production',
            data: financialForecast.map(f => f.production.value)
          }]
        }
      }
    });

    return insights;
  }

  private generateBenchmarkInsights(benchmarkReport: any): Insight[] {
    const insights: Insight[] = [];

    // Top performing metrics
    benchmarkReport.strengths.slice(0, 2).forEach((strength: BenchmarkData) => {
      insights.push({
        id: `benchmark_strength_${strength.metric}_${Date.now()}`,
        type: 'achievement',
        priority: 'low',
        category: this.mapBenchmarkCategory(strength.category),
        title: `Leading in ${this.formatMetricName(strength.metric)}`,
        description: `Your ${this.formatMetricName(strength.metric)} of ${strength.practiceValue}${strength.unit} ranks in the ${strength.percentileRank}th percentile.`,
        impact: `You're outperforming ${strength.percentileRank}% of similar practices.`,
        metrics: [
          {
            name: this.formatMetricName(strength.metric),
            value: strength.practiceValue,
            unit: strength.unit
          },
          {
            name: 'Industry Average',
            value: strength.industryAverage,
            unit: strength.unit
          }
        ],
        actions: [
          {
            text: 'Share Achievement',
            type: 'primary'
          }
        ],
        timestamp: new Date()
      });
    });

    // Improvement opportunities
    benchmarkReport.opportunities.slice(0, 2).forEach((opportunity: any) => {
      insights.push({
        id: `benchmark_opp_${opportunity.metric}_${Date.now()}`,
        type: 'opportunity',
        priority: opportunity.potentialImpact > 50000 ? 'high' : 'medium',
        category: this.mapBenchmarkCategory(opportunity.metric),
        title: `Opportunity: Improve ${this.formatMetricName(opportunity.metric)}`,
        description: `Reaching the 75th percentile in ${this.formatMetricName(opportunity.metric)} could generate ${this.formatCurrency(opportunity.potentialImpact)} annually.`,
        impact: opportunity.recommendedActions[0],
        metrics: [
          {
            name: 'Current',
            value: opportunity.currentValue,
            unit: '%'
          },
          {
            name: 'Target',
            value: opportunity.targetValue,
            unit: '%'
          }
        ],
        actions: opportunity.recommendedActions.slice(0, 2).map((action: string, index: number) => ({
          text: action,
          type: index === 0 ? 'primary' : 'secondary' as 'primary' | 'secondary'
        })),
        timestamp: new Date()
      });
    });

    return insights;
  }

  private async getHistoricalData() {
    // Fetch historical data for comparison
    const thirtyDaysAgo = subDays(new Date(), 30);
    
    const { data: historicalProduction } = await supabase
      .from('daily_production_summary')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('date', thirtyDaysAgo.toISOString())
      .order('date', { ascending: true });

    const { data: historicalAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('date', thirtyDaysAgo.toISOString());

    return {
      production: historicalProduction || [],
      appointments: historicalAppointments || []
    };
  }

  private isDuplicateInsight(insight: Insight): boolean {
    // Check if similar insight was generated recently
    for (const [id, existing] of this.generatedInsights.entries()) {
      if (
        existing.type === insight.type &&
        existing.category === insight.category &&
        existing.title === insight.title &&
        existing.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000 // Within 24 hours
      ) {
        return true;
      }
    }
    return false;
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  private formatMetricName(metric: string): string {
    const nameMap: Record<string, string> = {
      collectionRate: 'Collection Rate',
      caseAcceptance: 'Case Acceptance',
      chairUtilization: 'Chair Utilization',
      noShowRate: 'No-Show Rate',
      retentionRate: 'Patient Retention',
      avgWaitTime: 'Average Wait Time',
      scheduleAdherence: 'Schedule Adherence',
      newPatients: 'New Patients',
      monthlyProduction: 'Monthly Production',
      implantSuccessRate: 'Implant Success Rate',
      tmjSuccessRate: 'TMJ Treatment Success'
    };
    
    return nameMap[metric] || metric;
  }

  private mapBenchmarkCategory(category: string): 'financial' | 'patient' | 'operational' | 'clinical' {
    if (category === 'subdomain') return 'clinical';
    return category as 'financial' | 'patient' | 'operational' | 'clinical';
  }

  async subscribeToInsights(callback: (insights: Insight[]) => void) {
    // Set up real-time subscription for new insights
    const intervalId = setInterval(async () => {
      const insights = await this.generateInsights();
      callback(insights);
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }

  async dismissInsight(insightId: string) {
    this.generatedInsights.delete(insightId);
    
    // Store dismissal in database
    await supabase
      .from('dismissed_insights')
      .insert({
        practice_id: this.practiceId,
        insight_id: insightId,
        dismissed_at: new Date().toISOString()
      });
  }

  async getInsightHistory(days: number = 30): Promise<Insight[]> {
    const startDate = subDays(new Date(), days);
    
    const { data } = await supabase
      .from('insight_history')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  }

  // Watch subdial styling for dashboard integration
  getInsightStyles(type: Insight['type']): {
    backgroundColor: string;
    borderColor: string;
    iconColor: string;
    icon: string;
  } {
    const styles = {
      alert: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#DC2626',
        iconColor: '#DC2626',
        icon: '⚠️'
      },
      opportunity: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#2563EB',
        iconColor: '#2563EB',
        icon: '💡'
      },
      trend: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: '#7C3AED',
        iconColor: '#7C3AED',
        icon: '📈'
      },
      achievement: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#16A34A',
        iconColor: '#16A34A',
        icon: '🏆'
      },
      recommendation: {
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        borderColor: '#EA580C',
        iconColor: '#EA580C',
        icon: '💭'
      }
    };

    return styles[type];
  }
}