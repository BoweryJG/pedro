export class PredictiveAnalytics {
  // Predict no-show probability
  static predictNoShowProbability(patient: any, appointment: any): number {
    let riskScore = 0;
    
    // Factors that increase no-show risk
    if (patient.noShowCount > 2) riskScore += 30;
    else if (patient.noShowCount > 0) riskScore += 15;
    
    // Time of day factor
    const hour = parseInt(appointment.time.split(':')[0]);
    if (hour < 9 || hour > 16) riskScore += 10;
    
    // Day of week factor
    const dayOfWeek = new Date(appointment.date).getDay();
    if (dayOfWeek === 1 || dayOfWeek === 5) riskScore += 5; // Monday or Friday
    
    // Advance notice factor
    const daysUntilAppointment = Math.floor(
      (new Date(appointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilAppointment > 14) riskScore += 10;
    
    return Math.min(riskScore, 100);
  }

  // Predict optimal scheduling
  static predictOptimalScheduleTime(patientHistory: any[]): string[] {
    const timePreferences: { [key: string]: number } = {};
    
    // Analyze past appointments
    patientHistory.forEach(apt => {
      if (apt.status === 'completed') {
        const time = apt.time;
        timePreferences[time] = (timePreferences[time] || 0) + 1;
      }
    });
    
    // Sort by preference
    const sortedTimes = Object.entries(timePreferences)
      .sort(([, a], [, b]) => b - a)
      .map(([time]) => time);
    
    // If no history, suggest standard times
    if (sortedTimes.length === 0) {
      return ['10:00', '14:00', '15:30'];
    }
    
    return sortedTimes.slice(0, 3);
  }

  // Predict treatment acceptance
  static predictTreatmentAcceptance(patient: any, treatmentCost: number): number {
    let acceptanceProbability = 70; // Base probability
    
    // Insurance factor
    if (patient.hasInsurance) acceptanceProbability += 15;
    
    // Past treatment history
    if (patient.completedTreatments > 3) acceptanceProbability += 10;
    
    // Cost factor
    if (treatmentCost < 1000) acceptanceProbability += 10;
    else if (treatmentCost > 5000) acceptanceProbability -= 20;
    
    // Payment plan availability
    if (patient.eligibleForPaymentPlan) acceptanceProbability += 15;
    
    return Math.min(Math.max(acceptanceProbability, 0), 100);
  }

  // Predict revenue trends
  static predictMonthlyRevenue(historicalData: number[]): {
    prediction: number;
    trend: 'up' | 'down' | 'stable';
    confidence: number;
  } {
    if (historicalData.length < 3) {
      return { prediction: 0, trend: 'stable', confidence: 0 };
    }
    
    // Simple moving average
    const recentAvg = historicalData.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const overallAvg = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
    
    // Calculate trend
    const trend = recentAvg > overallAvg * 1.05 ? 'up' : 
                  recentAvg < overallAvg * 0.95 ? 'down' : 'stable';
    
    // Simple linear regression for prediction
    const n = historicalData.length;
    const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
    const sumY = historicalData.reduce((a, b) => a + b, 0);
    const sumXY = historicalData.reduce((sum, y, i) => sum + i * y, 0);
    const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    const prediction = slope * n + intercept;
    
    // Calculate confidence based on variance
    const variance = historicalData.reduce((sum, y) => {
      const predicted = slope * historicalData.indexOf(y) + intercept;
      return sum + Math.pow(y - predicted, 2);
    }, 0) / n;
    
    const confidence = Math.max(0, Math.min(100, 100 - (variance / overallAvg) * 100));
    
    return { prediction, trend, confidence };
  }

  // Predict busy periods
  static predictBusyPeriods(historicalAppointments: any[]): {
    dayOfWeek: string;
    timeSlot: string;
    utilization: number;
  }[] {
    const utilization: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};
    
    historicalAppointments.forEach(apt => {
      const date = new Date(apt.date);
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      const hour = parseInt(apt.time.split(':')[0]);
      const timeSlot = hour < 12 ? 'Morning' : hour < 15 ? 'Midday' : 'Afternoon';
      
      const key = `${dayOfWeek}-${timeSlot}`;
      utilization[key] = (utilization[key] || 0) + 1;
      counts[key] = (counts[key] || 0) + 1;
    });
    
    // Convert to array and calculate percentages
    const busyPeriods = Object.entries(utilization).map(([key, count]) => {
      const [dayOfWeek, timeSlot] = key.split('-');
      return {
        dayOfWeek,
        timeSlot,
        utilization: (count / (counts[key] || 1)) * 100
      };
    });
    
    // Sort by utilization
    return busyPeriods.sort((a, b) => b.utilization - a.utilization);
  }
}