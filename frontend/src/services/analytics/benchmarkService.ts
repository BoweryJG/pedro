export class BenchmarkService {
  // Industry benchmarks for dental practices
  private static benchmarks = {
    production: {
      dailyPerProvider: 3500,
      monthlyPerProvider: 77000,
      annualPerProvider: 924000
    },
    collection: {
      rate: 98, // percentage
      daysOutstanding: 30
    },
    appointments: {
      noShowRate: 5, // percentage
      cancellationRate: 8, // percentage
      scheduleFillRate: 85, // percentage
      newPatientRate: 25 // per month
    },
    patient: {
      retentionRate: 85, // percentage
      acceptanceRate: 70, // percentage
      averageProductionPerPatient: 1500
    },
    operational: {
      overheadPercentage: 65,
      staffProductivityRate: 85,
      chairUtilizationRate: 80
    },
    specialty: {
      tmj: {
        caseAcceptanceRate: 60,
        averageCaseValue: 5000,
        treatmentSuccessRate: 85
      },
      implants: {
        caseAcceptanceRate: 50,
        averageCaseValue: 4500,
        successRate: 95
      },
      yomi: {
        caseAcceptanceRate: 70,
        averageCaseValue: 6000,
        precisionImprovement: 30 // percentage over traditional
      },
      medspa: {
        clientRetentionRate: 75,
        averageTicket: 350,
        treatmentFrequency: 6 // visits per year
      }
    }
  };

  // Compare practice metrics to benchmarks
  static compareToBenchmark(metric: string, value: number, category: string = 'general'): {
    value: number;
    benchmark: number;
    performance: 'above' | 'at' | 'below';
    percentageDiff: number;
  } {
    let benchmark = 0;
    
    // Get the appropriate benchmark
    if (category === 'general') {
      if (metric.includes('production')) {
        benchmark = this.benchmarks.production.monthlyPerProvider;
      } else if (metric.includes('collection')) {
        benchmark = this.benchmarks.collection.rate;
      } else if (metric.includes('noShow')) {
        benchmark = this.benchmarks.appointments.noShowRate;
      } else if (metric.includes('retention')) {
        benchmark = this.benchmarks.patient.retentionRate;
      }
    } else if (this.benchmarks.specialty[category]) {
      const specialtyBenchmarks = this.benchmarks.specialty[category];
      if (metric.includes('acceptance')) {
        benchmark = specialtyBenchmarks.caseAcceptanceRate;
      } else if (metric.includes('value') || metric.includes('ticket')) {
        benchmark = specialtyBenchmarks.averageCaseValue || specialtyBenchmarks.averageTicket;
      }
    }
    
    // Calculate performance
    const percentageDiff = ((value - benchmark) / benchmark) * 100;
    let performance: 'above' | 'at' | 'below';
    
    if (percentageDiff > 5) {
      performance = 'above';
    } else if (percentageDiff < -5) {
      performance = 'below';
    } else {
      performance = 'at';
    }
    
    // For metrics where lower is better (like no-show rate)
    if (metric.includes('noShow') || metric.includes('cancellation') || metric.includes('overhead')) {
      if (value < benchmark) performance = 'above';
      else if (value > benchmark) performance = 'below';
    }
    
    return {
      value,
      benchmark,
      performance,
      percentageDiff
    };
  }

  // Get performance summary
  static getPerformanceSummary(metrics: {
    monthlyProduction: number;
    collectionRate: number;
    noShowRate: number;
    newPatients: number;
    caseAcceptanceRate: number;
  }): {
    overall: 'excellent' | 'good' | 'needs-improvement';
    strengths: string[];
    improvements: string[];
    score: number;
  } {
    const comparisons = [
      this.compareToBenchmark('production', metrics.monthlyProduction),
      this.compareToBenchmark('collection', metrics.collectionRate),
      this.compareToBenchmark('noShow', metrics.noShowRate),
      this.compareToBenchmark('newPatients', metrics.newPatients),
      this.compareToBenchmark('acceptance', metrics.caseAcceptanceRate)
    ];
    
    const strengths: string[] = [];
    const improvements: string[] = [];
    let score = 0;
    
    comparisons.forEach((comp, index) => {
      const metricNames = ['Production', 'Collection Rate', 'No-Show Rate', 'New Patients', 'Case Acceptance'];
      
      if (comp.performance === 'above') {
        strengths.push(metricNames[index]);
        score += 20;
      } else if (comp.performance === 'at') {
        score += 15;
      } else {
        improvements.push(metricNames[index]);
        score += 10;
      }
    });
    
    let overall: 'excellent' | 'good' | 'needs-improvement';
    if (score >= 90) overall = 'excellent';
    else if (score >= 70) overall = 'good';
    else overall = 'needs-improvement';
    
    return {
      overall,
      strengths,
      improvements,
      score
    };
  }

  // Get improvement recommendations
  static getRecommendations(metrics: any): string[] {
    const recommendations: string[] = [];
    
    // Production recommendations
    if (metrics.monthlyProduction < this.benchmarks.production.monthlyPerProvider) {
      recommendations.push('Consider adding high-value procedures like implants or TMJ treatments');
      recommendations.push('Review fee schedule to ensure competitive pricing');
    }
    
    // Collection recommendations
    if (metrics.collectionRate < this.benchmarks.collection.rate) {
      recommendations.push('Implement automated payment reminders');
      recommendations.push('Offer flexible payment plans to improve collections');
    }
    
    // Appointment recommendations
    if (metrics.noShowRate > this.benchmarks.appointments.noShowRate) {
      recommendations.push('Implement SMS appointment reminders 24-48 hours before appointments');
      recommendations.push('Consider overbooking high-risk time slots');
    }
    
    // New patient recommendations
    if (metrics.newPatients < this.benchmarks.appointments.newPatientRate) {
      recommendations.push('Increase digital marketing efforts');
      recommendations.push('Implement patient referral program');
    }
    
    return recommendations;
  }
}