import { supabase } from '@/lib/supabase';
import { addDays, format, startOfDay, endOfDay, subMonths, isWeekend } from 'date-fns';
import * as tf from '@tensorflow/tfjs';

export interface PredictionResult {
  value: number;
  confidence: number;
  range: { min: number; max: number };
  factors: Array<{ name: string; impact: number }>;
}

export interface SchedulingPrediction {
  date: Date;
  predictedNoShows: number;
  optimalOverbooking: number;
  chairUtilization: number;
  productionForecast: number;
}

export interface PatientRiskScore {
  patientId: string;
  noShowRisk: number;
  churnRisk: number;
  treatmentAcceptanceProb: number;
  lifetimeValue: number;
  riskFactors: Array<{ factor: string; weight: number }>;
}

export class PredictiveAnalytics {
  private practiceId: string;
  private models: Map<string, tf.LayersModel> = new Map();
  private modelCache: Map<string, any> = new Map();

  constructor(practiceId: string) {
    this.practiceId = practiceId;
    this.initializeModels();
  }

  private async initializeModels() {
    // Initialize TensorFlow models
    // In production, these would be pre-trained models loaded from storage
    
    // No-show prediction model
    const noShowModel = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [10], units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 1, activation: 'sigmoid' })
      ]
    });
    
    noShowModel.compile({
      optimizer: 'adam',
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });
    
    this.models.set('noShow', noShowModel);

    // Production forecast model
    const productionModel = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [15], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });
    
    productionModel.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError',
      metrics: ['mae']
    });
    
    this.models.set('production', productionModel);
  }

  async predictSchedulingOptimization(targetDate: Date): Promise<SchedulingPrediction> {
    // Gather historical data
    const historicalData = await this.gatherHistoricalSchedulingData(targetDate);
    
    // Extract features
    const features = this.extractSchedulingFeatures(targetDate, historicalData);
    
    // Predict no-shows
    const noShowPrediction = await this.predictNoShows(features);
    
    // Calculate optimal overbooking
    const optimalOverbooking = this.calculateOptimalOverbooking(
      noShowPrediction.value,
      historicalData.avgChairCount
    );
    
    // Predict chair utilization
    const chairUtilization = await this.predictChairUtilization(features, optimalOverbooking);
    
    // Forecast production
    const productionForecast = await this.forecastDailyProduction(targetDate, features);

    return {
      date: targetDate,
      predictedNoShows: Math.round(noShowPrediction.value),
      optimalOverbooking,
      chairUtilization: chairUtilization.value,
      productionForecast: productionForecast.value
    };
  }

  async predictPatientBehavior(patientId: string): Promise<PatientRiskScore> {
    // Gather patient data
    const patientData = await this.gatherPatientData(patientId);
    
    // Calculate risk scores
    const noShowRisk = await this.calculateNoShowRisk(patientData);
    const churnRisk = await this.calculateChurnRisk(patientData);
    const treatmentAcceptance = await this.predictTreatmentAcceptance(patientData);
    const lifetimeValue = await this.calculatePatientLifetimeValue(patientData);

    return {
      patientId,
      noShowRisk: noShowRisk.value,
      churnRisk: churnRisk.value,
      treatmentAcceptanceProb: treatmentAcceptance.value,
      lifetimeValue: lifetimeValue.value,
      riskFactors: [
        ...noShowRisk.factors,
        ...churnRisk.factors
      ].sort((a, b) => b.weight - a.weight).slice(0, 5)
    };
  }

  async forecastFinancialMetrics(days: number = 30): Promise<Array<{
    date: Date;
    production: PredictionResult;
    collections: PredictionResult;
    newPatients: PredictionResult;
  }>> {
    const forecasts = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
      const targetDate = addDays(today, i);
      
      const production = await this.forecastDailyProduction(targetDate);
      const collections = await this.forecastCollections(targetDate);
      const newPatients = await this.forecastNewPatients(targetDate);

      forecasts.push({
        date: targetDate,
        production,
        collections,
        newPatients
      });
    }

    return forecasts;
  }

  async predictTreatmentOutcomes(treatmentPlanId: string): Promise<{
    successProbability: number;
    estimatedDuration: number;
    complicationRisk: number;
    patientSatisfactionScore: number;
  }> {
    const treatmentData = await this.gatherTreatmentData(treatmentPlanId);
    
    // Use historical outcomes to predict success
    const similarCases = await this.findSimilarTreatmentCases(treatmentData);
    
    const successRate = similarCases.filter(c => c.outcome === 'successful').length / similarCases.length;
    const avgDuration = similarCases.reduce((sum, c) => sum + c.duration, 0) / similarCases.length;
    const complicationRate = similarCases.filter(c => c.hadComplications).length / similarCases.length;
    const avgSatisfaction = similarCases.reduce((sum, c) => sum + (c.satisfactionScore || 4), 0) / similarCases.length;

    return {
      successProbability: successRate,
      estimatedDuration: avgDuration,
      complicationRisk: complicationRate,
      patientSatisfactionScore: avgSatisfaction
    };
  }

  async identifySchedulingBottlenecks(): Promise<Array<{
    timeSlot: string;
    bottleneckScore: number;
    causes: string[];
    recommendations: string[];
  }>> {
    const scheduleData = await this.analyzeSchedulePatterns();
    const bottlenecks = [];

    for (const slot of scheduleData.timeSlots) {
      const bottleneckScore = this.calculateBottleneckScore(slot);
      
      if (bottleneckScore > 0.7) {
        bottlenecks.push({
          timeSlot: slot.time,
          bottleneckScore,
          causes: this.identifyBottleneckCauses(slot),
          recommendations: this.generateSchedulingRecommendations(slot)
        });
      }
    }

    return bottlenecks.sort((a, b) => b.bottleneckScore - a.bottleneckScore);
  }

  private async gatherHistoricalSchedulingData(targetDate: Date) {
    const sixMonthsAgo = subMonths(targetDate, 6);
    
    // Get appointments from similar days (same day of week)
    const dayOfWeek = targetDate.getDay();
    
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('date', sixMonthsAgo.toISOString())
      .lte('date', targetDate.toISOString());

    const similarDayAppointments = appointments?.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDay() === dayOfWeek;
    }) || [];

    // Calculate metrics
    const totalDays = Math.floor(similarDayAppointments.length / 10); // Approximate
    const noShows = similarDayAppointments.filter(a => a.status === 'no_show').length;
    const noShowRate = totalDays > 0 ? noShows / totalDays : 0;

    const { data: operatories } = await supabase
      .from('operatories')
      .select('*')
      .eq('practice_id', this.practiceId)
      .eq('status', 'active');

    return {
      appointments: similarDayAppointments,
      avgNoShowsPerDay: noShowRate,
      avgChairCount: operatories?.length || 0,
      historicalProduction: await this.calculateHistoricalProduction(similarDayAppointments)
    };
  }

  private extractSchedulingFeatures(date: Date, historicalData: any): number[] {
    const dayOfWeek = date.getDay();
    const month = date.getMonth();
    const isWeekendVal = isWeekend(date) ? 1 : 0;
    const isHoliday = this.isHoliday(date) ? 1 : 0;
    
    // Weather impact (would integrate with weather API)
    const weatherImpact = 0.5; // Placeholder
    
    // Seasonal factors
    const seasonalFactor = this.getSeasonalFactor(month);
    
    // Historical patterns
    const avgNoShows = historicalData.avgNoShowsPerDay;
    const chairCount = historicalData.avgChairCount;
    
    // Day of week encoding (one-hot)
    const dayEncoding = new Array(7).fill(0);
    dayEncoding[dayOfWeek] = 1;

    return [
      ...dayEncoding,
      month / 11, // Normalize month
      isWeekendVal,
      isHoliday,
      weatherImpact,
      seasonalFactor,
      avgNoShows,
      chairCount / 10 // Normalize chair count
    ];
  }

  private async predictNoShows(features: number[]): Promise<PredictionResult> {
    const model = this.models.get('noShow');
    if (!model) throw new Error('No-show model not initialized');

    const prediction = model.predict(tf.tensor2d([features])) as tf.Tensor;
    const value = (await prediction.data())[0] * 10; // Scale to actual number

    // Calculate confidence based on historical accuracy
    const confidence = 0.85; // Placeholder - would be calculated from model validation

    return {
      value,
      confidence,
      range: {
        min: Math.max(0, value - 2),
        max: value + 2
      },
      factors: [
        { name: 'Day of Week', impact: 0.3 },
        { name: 'Historical Pattern', impact: 0.4 },
        { name: 'Season', impact: 0.2 },
        { name: 'Weather', impact: 0.1 }
      ]
    };
  }

  private calculateOptimalOverbooking(expectedNoShows: number, chairCount: number): number {
    // Conservative overbooking strategy
    const overbookingFactor = 0.7; // Only overbook 70% of expected no-shows
    const maxOverbooking = Math.ceil(chairCount * 0.1); // Max 10% overbooking
    
    return Math.min(
      Math.floor(expectedNoShows * overbookingFactor),
      maxOverbooking
    );
  }

  private async predictChairUtilization(features: number[], overbooking: number): Promise<PredictionResult> {
    // Simplified prediction - in production would use ML model
    const baseUtilization = 0.75;
    const overbookingImpact = overbooking * 0.05;
    
    const utilization = Math.min(0.95, baseUtilization + overbookingImpact);

    return {
      value: utilization * 100,
      confidence: 0.8,
      range: {
        min: (utilization - 0.1) * 100,
        max: Math.min(95, (utilization + 0.1) * 100)
      },
      factors: [
        { name: 'Base Schedule', impact: 0.6 },
        { name: 'Overbooking', impact: 0.3 },
        { name: 'No-show Prediction', impact: 0.1 }
      ]
    };
  }

  private async forecastDailyProduction(date: Date, features?: number[]): Promise<PredictionResult> {
    const historicalAvg = await this.getHistoricalAverageProduction(date);
    const seasonalMultiplier = this.getSeasonalFactor(date.getMonth());
    const dayOfWeekMultiplier = this.getDayOfWeekMultiplier(date.getDay());
    
    const baseProduction = historicalAvg * seasonalMultiplier * dayOfWeekMultiplier;
    
    // Add some randomness for realism
    const variance = baseProduction * 0.15;
    const production = baseProduction + (Math.random() - 0.5) * variance;

    return {
      value: Math.round(production),
      confidence: 0.75,
      range: {
        min: Math.round(production - variance),
        max: Math.round(production + variance)
      },
      factors: [
        { name: 'Historical Average', impact: 0.5 },
        { name: 'Seasonal Trends', impact: 0.2 },
        { name: 'Day of Week', impact: 0.2 },
        { name: 'Schedule Density', impact: 0.1 }
      ]
    };
  }

  private async getHistoricalAverageProduction(date: Date): Promise<number> {
    const dayOfWeek = date.getDay();
    const threeMonthsAgo = subMonths(date, 3);
    
    const { data } = await supabase
      .from('daily_production_summary')
      .select('total_production, date')
      .eq('practice_id', this.practiceId)
      .gte('date', threeMonthsAgo.toISOString())
      .lte('date', date.toISOString());

    if (!data || data.length === 0) return 5000; // Default

    const sameDayProduction = data.filter(d => 
      new Date(d.date).getDay() === dayOfWeek
    );

    if (sameDayProduction.length === 0) return 5000;

    return sameDayProduction.reduce((sum, d) => sum + d.total_production, 0) / sameDayProduction.length;
  }

  private async calculateHistoricalProduction(appointments: any[]): Promise<number> {
    // Simplified calculation - would need to join with treatment data
    return appointments.length * 250; // Average appointment value
  }

  private getSeasonalFactor(month: number): number {
    // Dental practice seasonal patterns
    const seasonalFactors = [
      0.9,  // Jan - Post holiday slowdown
      0.95, // Feb
      1.1,  // Mar - Spring appointments
      1.05, // Apr
      1.0,  // May
      0.95, // Jun - Summer slowdown begins
      0.85, // Jul - Summer vacation
      0.85, // Aug - Summer vacation
      1.1,  // Sep - Back to school
      1.15, // Oct - Year-end benefits
      1.2,  // Nov - Year-end benefits rush
      1.1   // Dec - Holiday rush
    ];
    
    return seasonalFactors[month];
  }

  private getDayOfWeekMultiplier(dayOfWeek: number): number {
    const multipliers = [
      0.6,  // Sunday
      1.1,  // Monday
      1.15, // Tuesday
      1.15, // Wednesday
      1.1,  // Thursday
      1.0,  // Friday
      0.7   // Saturday
    ];
    
    return multipliers[dayOfWeek];
  }

  private isHoliday(date: Date): boolean {
    // Simplified holiday check - would use proper holiday calendar
    const holidays = [
      '01-01', // New Year's Day
      '07-04', // Independence Day
      '12-25', // Christmas
      // Add more holidays
    ];
    
    const dateStr = format(date, 'MM-dd');
    return holidays.includes(dateStr);
  }

  private async gatherPatientData(patientId: string) {
    const { data: patient } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();

    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId)
      .order('date', { ascending: false })
      .limit(20);

    const { data: treatments } = await supabase
      .from('treatment_plans')
      .select('*')
      .eq('patient_id', patientId);

    const { data: billings } = await supabase
      .from('billings')
      .select('*')
      .eq('patient_id', patientId);

    return {
      patient,
      appointments: appointments || [],
      treatments: treatments || [],
      billings: billings || []
    };
  }

  private async calculateNoShowRisk(patientData: any): Promise<{
    value: number;
    factors: Array<{ factor: string; weight: number }>;
  }> {
    const factors = [];
    let riskScore = 0;

    // Calculate no-show history
    const totalAppointments = patientData.appointments.length;
    const noShows = patientData.appointments.filter((a: any) => a.status === 'no_show').length;
    const noShowRate = totalAppointments > 0 ? noShows / totalAppointments : 0;
    
    if (noShowRate > 0.2) {
      riskScore += 0.4;
      factors.push({ factor: 'High no-show history', weight: 0.4 });
    }

    // Check appointment frequency
    if (patientData.appointments.length > 1) {
      const daysSinceLastAppointment = Math.floor(
        (new Date().getTime() - new Date(patientData.appointments[0].date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastAppointment > 180) {
        riskScore += 0.2;
        factors.push({ factor: 'Long time since last visit', weight: 0.2 });
      }
    }

    // Check outstanding balance
    const outstandingBalance = patientData.billings.reduce((sum: number, b: any) => 
      sum + (b.amount_due - b.amount_paid), 0
    );
    
    if (outstandingBalance > 500) {
      riskScore += 0.3;
      factors.push({ factor: 'High outstanding balance', weight: 0.3 });
    }

    // Insurance complexity
    if (patientData.patient.insurance_status === 'complex') {
      riskScore += 0.1;
      factors.push({ factor: 'Complex insurance', weight: 0.1 });
    }

    return {
      value: Math.min(1, riskScore),
      factors: factors.sort((a, b) => b.weight - a.weight)
    };
  }

  private async calculateChurnRisk(patientData: any): Promise<{
    value: number;
    factors: Array<{ factor: string; weight: number }>;
  }> {
    const factors = [];
    let churnScore = 0;

    // Time since last visit
    if (patientData.appointments.length > 0) {
      const daysSinceLastVisit = Math.floor(
        (new Date().getTime() - new Date(patientData.appointments[0].date).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastVisit > 365) {
        churnScore += 0.5;
        factors.push({ factor: 'Over 1 year since last visit', weight: 0.5 });
      } else if (daysSinceLastVisit > 180) {
        churnScore += 0.3;
        factors.push({ factor: 'Over 6 months since last visit', weight: 0.3 });
      }
    }

    // Treatment plan rejection
    const rejectedPlans = patientData.treatments.filter((t: any) => t.status === 'rejected').length;
    if (rejectedPlans > 0) {
      churnScore += 0.2;
      factors.push({ factor: 'Rejected treatment plans', weight: 0.2 });
    }

    // Satisfaction indicators (would use actual review data)
    if (patientData.patient.last_review_score && patientData.patient.last_review_score < 3) {
      churnScore += 0.3;
      factors.push({ factor: 'Low satisfaction score', weight: 0.3 });
    }

    return {
      value: Math.min(1, churnScore),
      factors: factors.sort((a, b) => b.weight - a.weight)
    };
  }

  private async predictTreatmentAcceptance(patientData: any): Promise<PredictionResult> {
    const acceptedPlans = patientData.treatments.filter((t: any) => t.status === 'accepted').length;
    const totalPlans = patientData.treatments.length;
    
    const historicalAcceptance = totalPlans > 0 ? acceptedPlans / totalPlans : 0.5;
    
    // Factors affecting acceptance
    let acceptanceProbability = historicalAcceptance;
    
    // Insurance coverage impact
    if (patientData.patient.insurance_status === 'good') {
      acceptanceProbability += 0.1;
    }
    
    // Financial history
    const paymentHistory = patientData.billings.filter((b: any) => b.status === 'paid').length / 
                          (patientData.billings.length || 1);
    acceptanceProbability = (acceptanceProbability + paymentHistory) / 2;

    return {
      value: Math.min(1, acceptanceProbability),
      confidence: 0.7,
      range: {
        min: Math.max(0, acceptanceProbability - 0.2),
        max: Math.min(1, acceptanceProbability + 0.2)
      },
      factors: [
        { name: 'Historical Acceptance', impact: 0.4 },
        { name: 'Insurance Coverage', impact: 0.3 },
        { name: 'Payment History', impact: 0.3 }
      ]
    };
  }

  private async calculatePatientLifetimeValue(patientData: any): Promise<PredictionResult> {
    // Historical value
    const historicalRevenue = patientData.billings.reduce((sum: number, b: any) => 
      sum + b.amount_paid, 0
    );
    
    // Average annual value
    const patientAge = patientData.patient.created_at ? 
      (new Date().getTime() - new Date(patientData.patient.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365) : 1;
    
    const annualValue = historicalRevenue / Math.max(1, patientAge);
    
    // Predict remaining years (simplified)
    const patientAgeYears = patientData.patient.age || 40;
    const expectedRemainingYears = Math.max(0, 75 - patientAgeYears) * 0.5; // Assume 50% retention
    
    const projectedLifetimeValue = historicalRevenue + (annualValue * expectedRemainingYears);

    return {
      value: Math.round(projectedLifetimeValue),
      confidence: 0.6,
      range: {
        min: Math.round(projectedLifetimeValue * 0.7),
        max: Math.round(projectedLifetimeValue * 1.3)
      },
      factors: [
        { name: 'Historical Revenue', impact: 0.4 },
        { name: 'Visit Frequency', impact: 0.3 },
        { name: 'Treatment Acceptance', impact: 0.2 },
        { name: 'Age Factor', impact: 0.1 }
      ]
    };
  }

  private async gatherTreatmentData(treatmentPlanId: string) {
    const { data: treatmentPlan } = await supabase
      .from('treatment_plans')
      .select('*, patient:patients(*)')
      .eq('id', treatmentPlanId)
      .single();

    return treatmentPlan;
  }

  private async findSimilarTreatmentCases(treatmentData: any) {
    // Find similar cases based on treatment type, patient age, etc.
    const { data: similarCases } = await supabase
      .from('completed_treatments')
      .select('*')
      .eq('practice_id', this.practiceId)
      .eq('treatment_type', treatmentData.treatment_type)
      .gte('patient_age', (treatmentData.patient.age || 40) - 10)
      .lte('patient_age', (treatmentData.patient.age || 40) + 10)
      .limit(50);

    return similarCases || [];
  }

  private async analyzeSchedulePatterns() {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('date', subMonths(new Date(), 3).toISOString())
      .order('date', { ascending: true });

    // Group by time slots
    const timeSlots: any = {};
    
    appointments?.forEach(apt => {
      const hour = new Date(apt.date).getHours();
      const timeSlot = `${hour}:00`;
      
      if (!timeSlots[timeSlot]) {
        timeSlots[timeSlot] = {
          time: timeSlot,
          appointments: [],
          avgDuration: 0,
          avgWaitTime: 0,
          utilizationRate: 0
        };
      }
      
      timeSlots[timeSlot].appointments.push(apt);
    });

    // Calculate metrics for each time slot
    Object.values(timeSlots).forEach((slot: any) => {
      const durations = slot.appointments
        .filter((a: any) => a.actual_duration)
        .map((a: any) => a.actual_duration);
      
      slot.avgDuration = durations.length > 0 ? 
        durations.reduce((sum: number, d: number) => sum + d, 0) / durations.length : 0;
      
      // Calculate other metrics...
    });

    return { timeSlots: Object.values(timeSlots) };
  }

  private calculateBottleneckScore(timeSlot: any): number {
    let score = 0;
    
    // High average wait time
    if (timeSlot.avgWaitTime > 15) {
      score += 0.3;
    }
    
    // Appointments running over scheduled time
    if (timeSlot.avgDuration > timeSlot.scheduledDuration * 1.2) {
      score += 0.3;
    }
    
    // High utilization (over 90%)
    if (timeSlot.utilizationRate > 0.9) {
      score += 0.4;
    }
    
    return score;
  }

  private identifyBottleneckCauses(timeSlot: any): string[] {
    const causes = [];
    
    if (timeSlot.avgWaitTime > 15) {
      causes.push('Long patient wait times');
    }
    
    if (timeSlot.avgDuration > timeSlot.scheduledDuration * 1.2) {
      causes.push('Appointments running over scheduled time');
    }
    
    if (timeSlot.utilizationRate > 0.9) {
      causes.push('Over-scheduled time slot');
    }
    
    if (timeSlot.noShowRate > 0.15) {
      causes.push('High no-show rate affecting flow');
    }
    
    return causes;
  }

  private generateSchedulingRecommendations(timeSlot: any): string[] {
    const recommendations = [];
    
    if (timeSlot.avgWaitTime > 15) {
      recommendations.push('Add buffer time between appointments');
      recommendations.push('Consider staggered scheduling');
    }
    
    if (timeSlot.avgDuration > timeSlot.scheduledDuration * 1.2) {
      recommendations.push('Increase appointment duration for complex procedures');
      recommendations.push('Review procedure time estimates');
    }
    
    if (timeSlot.utilizationRate > 0.9) {
      recommendations.push('Distribute appointments more evenly');
      recommendations.push('Consider adding staff during peak hours');
    }
    
    return recommendations;
  }

  private async forecastCollections(targetDate: Date): Promise<PredictionResult> {
    const production = await this.forecastDailyProduction(targetDate);
    const historicalCollectionRate = await this.getHistoricalCollectionRate();
    
    const collections = production.value * historicalCollectionRate;

    return {
      value: Math.round(collections),
      confidence: 0.7,
      range: {
        min: Math.round(collections * 0.85),
        max: Math.round(collections * 1.15)
      },
      factors: [
        { name: 'Production Forecast', impact: 0.5 },
        { name: 'Collection Rate', impact: 0.3 },
        { name: 'Payment Terms', impact: 0.2 }
      ]
    };
  }

  private async forecastNewPatients(targetDate: Date): Promise<PredictionResult> {
    const dayOfWeek = targetDate.getDay();
    const month = targetDate.getMonth();
    
    // Historical average
    const { data } = await supabase
      .from('daily_new_patients')
      .select('count')
      .eq('practice_id', this.practiceId)
      .gte('date', subMonths(targetDate, 3).toISOString());

    const avgNewPatients = data && data.length > 0 ?
      data.reduce((sum, d) => sum + d.count, 0) / data.length : 2;

    // Apply seasonal and day-of-week factors
    const seasonalFactor = this.getSeasonalFactor(month);
    const dayFactor = this.getDayOfWeekMultiplier(dayOfWeek) * 0.8; // Less variation for new patients
    
    const predictedNewPatients = avgNewPatients * seasonalFactor * dayFactor;

    return {
      value: Math.round(predictedNewPatients),
      confidence: 0.65,
      range: {
        min: Math.max(0, Math.round(predictedNewPatients - 2)),
        max: Math.round(predictedNewPatients + 2)
      },
      factors: [
        { name: 'Historical Average', impact: 0.5 },
        { name: 'Marketing Campaigns', impact: 0.2 },
        { name: 'Seasonal Trends', impact: 0.2 },
        { name: 'Referral Activity', impact: 0.1 }
      ]
    };
  }

  private async getHistoricalCollectionRate(): Promise<number> {
    const { data } = await supabase
      .from('monthly_collections_summary')
      .select('production, collections')
      .eq('practice_id', this.practiceId)
      .gte('month', subMonths(new Date(), 6).toISOString())
      .order('month', { ascending: false })
      .limit(6);

    if (!data || data.length === 0) return 0.85; // Default 85%

    const totalProduction = data.reduce((sum, d) => sum + d.production, 0);
    const totalCollections = data.reduce((sum, d) => sum + d.collections, 0);

    return totalProduction > 0 ? totalCollections / totalProduction : 0.85;
  }

  // Cleanup method
  dispose() {
    // Dispose of TensorFlow models
    for (const model of this.models.values()) {
      model.dispose();
    }
    this.models.clear();
    this.modelCache.clear();
  }
}