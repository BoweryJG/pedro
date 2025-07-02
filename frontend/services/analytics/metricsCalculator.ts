import { supabase } from '@/lib/supabase';
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from 'date-fns';

export interface MetricResult {
  value: number;
  previousValue?: number;
  change?: number;
  changePercent?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}

export interface DashboardMetrics {
  financial: {
    dailyProduction: MetricResult;
    monthlyProduction: MetricResult;
    collectionRate: MetricResult;
    caseAcceptance: MetricResult;
    averageTransactionValue: MetricResult;
    outstandingBalance: MetricResult;
  };
  patient: {
    activePatients: MetricResult;
    newPatients: MetricResult;
    retentionRate: MetricResult;
    satisfactionScore: MetricResult;
    referralRate: MetricResult;
    reactivationRate: MetricResult;
  };
  operational: {
    chairUtilization: MetricResult;
    staffProductivity: MetricResult;
    noShowRate: MetricResult;
    appointmentEfficiency: MetricResult;
    avgWaitTime: MetricResult;
    scheduleAdherence: MetricResult;
  };
  subdomain: {
    tmj: {
      outcomeScore: MetricResult;
      treatmentSuccess: MetricResult;
      avgTreatmentDuration: MetricResult;
    };
    implant: {
      successRate: MetricResult;
      osseointergrationRate: MetricResult;
      complicationRate: MetricResult;
    };
    ortho: {
      avgTreatmentTime: MetricResult;
      complianceRate: MetricResult;
      refinementRate: MetricResult;
    };
  };
}

export class MetricsCalculator {
  private practiceId: string;

  constructor(practiceId: string) {
    this.practiceId = practiceId;
  }

  async calculateAllMetrics(date: Date = new Date()): Promise<DashboardMetrics> {
    const [financial, patient, operational, subdomain] = await Promise.all([
      this.calculateFinancialMetrics(date),
      this.calculatePatientMetrics(date),
      this.calculateOperationalMetrics(date),
      this.calculateSubdomainMetrics(date)
    ]);

    return { financial, patient, operational, subdomain };
  }

  private async calculateFinancialMetrics(date: Date) {
    const today = startOfDay(date);
    const yesterday = startOfDay(subDays(date, 1));
    const monthStart = startOfMonth(date);
    const lastMonthStart = startOfMonth(subDays(date, 30));

    // Daily Production
    const dailyProduction = await this.calculateDailyProduction(today);
    const yesterdayProduction = await this.calculateDailyProduction(yesterday);

    // Monthly Production
    const monthlyProduction = await this.calculateMonthlyProduction(monthStart);
    const lastMonthProduction = await this.calculateMonthlyProduction(lastMonthStart);

    // Collection Rate
    const collectionRate = await this.calculateCollectionRate(monthStart);
    const lastMonthCollectionRate = await this.calculateCollectionRate(lastMonthStart);

    // Case Acceptance
    const caseAcceptance = await this.calculateCaseAcceptance(monthStart);
    const lastMonthCaseAcceptance = await this.calculateCaseAcceptance(lastMonthStart);

    // Average Transaction Value
    const avgTransactionValue = await this.calculateAverageTransactionValue(monthStart);
    const lastMonthAvgTransaction = await this.calculateAverageTransactionValue(lastMonthStart);

    // Outstanding Balance
    const outstandingBalance = await this.calculateOutstandingBalance();

    return {
      dailyProduction: this.createMetricResult(dailyProduction, yesterdayProduction, '$'),
      monthlyProduction: this.createMetricResult(monthlyProduction, lastMonthProduction, '$'),
      collectionRate: this.createMetricResult(collectionRate, lastMonthCollectionRate, '%'),
      caseAcceptance: this.createMetricResult(caseAcceptance, lastMonthCaseAcceptance, '%'),
      averageTransactionValue: this.createMetricResult(avgTransactionValue, lastMonthAvgTransaction, '$'),
      outstandingBalance: this.createMetricResult(outstandingBalance, null, '$')
    };
  }

  private async calculateDailyProduction(date: Date): Promise<number> {
    const { data, error } = await supabase
      .from('appointments')
      .select('treatments(price)')
      .eq('practice_id', this.practiceId)
      .gte('date', startOfDay(date).toISOString())
      .lte('date', endOfDay(date).toISOString())
      .eq('status', 'completed');

    if (error) throw error;

    return data?.reduce((sum, apt) => {
      const treatments = Array.isArray(apt.treatments) ? apt.treatments : [];
      return sum + treatments.reduce((tSum, t) => tSum + (t.price || 0), 0);
    }, 0) || 0;
  }

  private async calculateMonthlyProduction(monthStart: Date): Promise<number> {
    const { data, error } = await supabase
      .from('appointments')
      .select('treatments(price)')
      .eq('practice_id', this.practiceId)
      .gte('date', monthStart.toISOString())
      .lte('date', endOfMonth(monthStart).toISOString())
      .eq('status', 'completed');

    if (error) throw error;

    return data?.reduce((sum, apt) => {
      const treatments = Array.isArray(apt.treatments) ? apt.treatments : [];
      return sum + treatments.reduce((tSum, t) => tSum + (t.price || 0), 0);
    }, 0) || 0;
  }

  private async calculateCollectionRate(monthStart: Date): Promise<number> {
    const { data: billings } = await supabase
      .from('billings')
      .select('amount_due, amount_paid')
      .eq('practice_id', this.practiceId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', endOfMonth(monthStart).toISOString());

    if (!billings || billings.length === 0) return 0;

    const totalDue = billings.reduce((sum, b) => sum + b.amount_due, 0);
    const totalPaid = billings.reduce((sum, b) => sum + b.amount_paid, 0);

    return totalDue > 0 ? (totalPaid / totalDue) * 100 : 0;
  }

  private async calculateCaseAcceptance(monthStart: Date): Promise<number> {
    const { data: proposals } = await supabase
      .from('treatment_plans')
      .select('status')
      .eq('practice_id', this.practiceId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', endOfMonth(monthStart).toISOString());

    if (!proposals || proposals.length === 0) return 0;

    const accepted = proposals.filter(p => p.status === 'accepted').length;
    return (accepted / proposals.length) * 100;
  }

  private async calculateAverageTransactionValue(monthStart: Date): Promise<number> {
    const { data: transactions } = await supabase
      .from('billings')
      .select('amount_paid')
      .eq('practice_id', this.practiceId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', endOfMonth(monthStart).toISOString())
      .gt('amount_paid', 0);

    if (!transactions || transactions.length === 0) return 0;

    return transactions.reduce((sum, t) => sum + t.amount_paid, 0) / transactions.length;
  }

  private async calculateOutstandingBalance(): Promise<number> {
    const { data } = await supabase
      .from('billings')
      .select('amount_due, amount_paid')
      .eq('practice_id', this.practiceId)
      .eq('status', 'pending');

    if (!data) return 0;

    return data.reduce((sum, b) => sum + (b.amount_due - b.amount_paid), 0);
  }

  private async calculatePatientMetrics(date: Date) {
    const monthStart = startOfMonth(date);
    const lastMonthStart = startOfMonth(subDays(date, 30));

    // Active Patients
    const activePatients = await this.calculateActivePatients();
    const lastMonthActivePatients = await this.calculateActivePatients(subDays(date, 30));

    // New Patients
    const newPatients = await this.calculateNewPatients(monthStart);
    const lastMonthNewPatients = await this.calculateNewPatients(lastMonthStart);

    // Retention Rate
    const retentionRate = await this.calculateRetentionRate();
    const lastMonthRetentionRate = await this.calculateRetentionRate(subDays(date, 30));

    // Satisfaction Score
    const satisfactionScore = await this.calculateSatisfactionScore();

    // Referral Rate
    const referralRate = await this.calculateReferralRate(monthStart);
    const lastMonthReferralRate = await this.calculateReferralRate(lastMonthStart);

    // Reactivation Rate
    const reactivationRate = await this.calculateReactivationRate(monthStart);

    return {
      activePatients: this.createMetricResult(activePatients, lastMonthActivePatients),
      newPatients: this.createMetricResult(newPatients, lastMonthNewPatients),
      retentionRate: this.createMetricResult(retentionRate, lastMonthRetentionRate, '%'),
      satisfactionScore: this.createMetricResult(satisfactionScore, null, '/5'),
      referralRate: this.createMetricResult(referralRate, lastMonthReferralRate, '%'),
      reactivationRate: this.createMetricResult(reactivationRate, null, '%')
    };
  }

  private async calculateActivePatients(beforeDate?: Date): Promise<number> {
    const sixMonthsAgo = subDays(beforeDate || new Date(), 180);
    
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', this.practiceId)
      .gte('last_visit', sixMonthsAgo.toISOString());

    return count || 0;
  }

  private async calculateNewPatients(monthStart: Date): Promise<number> {
    const { count } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
      .eq('practice_id', this.practiceId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', endOfMonth(monthStart).toISOString());

    return count || 0;
  }

  private async calculateRetentionRate(beforeDate?: Date): Promise<number> {
    const oneYearAgo = subDays(beforeDate || new Date(), 365);
    const twoYearsAgo = subDays(beforeDate || new Date(), 730);

    const { data: cohortPatients } = await supabase
      .from('patients')
      .select('id')
      .eq('practice_id', this.practiceId)
      .gte('created_at', twoYearsAgo.toISOString())
      .lte('created_at', oneYearAgo.toISOString());

    if (!cohortPatients || cohortPatients.length === 0) return 0;

    const patientIds = cohortPatients.map(p => p.id);
    
    const { count: retainedCount } = await supabase
      .from('appointments')
      .select('patient_id', { count: 'exact', head: true })
      .eq('practice_id', this.practiceId)
      .in('patient_id', patientIds)
      .gte('date', oneYearAgo.toISOString());

    return ((retainedCount || 0) / cohortPatients.length) * 100;
  }

  private async calculateSatisfactionScore(): Promise<number> {
    const { data: reviews } = await supabase
      .from('patient_reviews')
      .select('rating')
      .eq('practice_id', this.practiceId)
      .gte('created_at', subDays(new Date(), 90).toISOString());

    if (!reviews || reviews.length === 0) return 0;

    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }

  private async calculateReferralRate(monthStart: Date): Promise<number> {
    const { data: newPatients } = await supabase
      .from('patients')
      .select('referral_source')
      .eq('practice_id', this.practiceId)
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', endOfMonth(monthStart).toISOString());

    if (!newPatients || newPatients.length === 0) return 0;

    const referrals = newPatients.filter(p => p.referral_source === 'patient_referral').length;
    return (referrals / newPatients.length) * 100;
  }

  private async calculateReactivationRate(monthStart: Date): Promise<number> {
    const { data: reactivated } = await supabase
      .from('patient_reactivations')
      .select('*')
      .eq('practice_id', this.practiceId)
      .gte('reactivated_at', monthStart.toISOString())
      .lte('reactivated_at', endOfMonth(monthStart).toISOString());

    const { data: inactive } = await supabase
      .from('patients')
      .select('*')
      .eq('practice_id', this.practiceId)
      .eq('status', 'inactive')
      .gte('last_visit', subDays(monthStart, 365).toISOString())
      .lte('last_visit', subDays(monthStart, 180).toISOString());

    if (!inactive || inactive.length === 0) return 0;

    return ((reactivated?.length || 0) / inactive.length) * 100;
  }

  private async calculateOperationalMetrics(date: Date) {
    const today = startOfDay(date);
    const monthStart = startOfMonth(date);

    // Chair Utilization
    const chairUtilization = await this.calculateChairUtilization(today);
    const yesterdayUtilization = await this.calculateChairUtilization(subDays(today, 1));

    // Staff Productivity
    const staffProductivity = await this.calculateStaffProductivity(today);
    const yesterdayProductivity = await this.calculateStaffProductivity(subDays(today, 1));

    // No-Show Rate
    const noShowRate = await this.calculateNoShowRate(monthStart);
    const lastMonthNoShowRate = await this.calculateNoShowRate(startOfMonth(subDays(date, 30)));

    // Appointment Efficiency
    const appointmentEfficiency = await this.calculateAppointmentEfficiency(today);

    // Average Wait Time
    const avgWaitTime = await this.calculateAverageWaitTime(today);
    const yesterdayWaitTime = await this.calculateAverageWaitTime(subDays(today, 1));

    // Schedule Adherence
    const scheduleAdherence = await this.calculateScheduleAdherence(today);

    return {
      chairUtilization: this.createMetricResult(chairUtilization, yesterdayUtilization, '%'),
      staffProductivity: this.createMetricResult(staffProductivity, yesterdayProductivity, '$'),
      noShowRate: this.createMetricResult(noShowRate, lastMonthNoShowRate, '%'),
      appointmentEfficiency: this.createMetricResult(appointmentEfficiency, null, '%'),
      avgWaitTime: this.createMetricResult(avgWaitTime, yesterdayWaitTime, 'min'),
      scheduleAdherence: this.createMetricResult(scheduleAdherence, null, '%')
    };
  }

  private async calculateChairUtilization(date: Date): Promise<number> {
    const { data: chairs } = await supabase
      .from('operatories')
      .select('id')
      .eq('practice_id', this.practiceId)
      .eq('status', 'active');

    if (!chairs || chairs.length === 0) return 0;

    const totalAvailableHours = chairs.length * 8; // Assuming 8-hour workday

    const { data: appointments } = await supabase
      .from('appointments')
      .select('duration_minutes')
      .eq('practice_id', this.practiceId)
      .gte('date', startOfDay(date).toISOString())
      .lte('date', endOfDay(date).toISOString())
      .in('status', ['completed', 'in_progress']);

    const totalUsedMinutes = appointments?.reduce((sum, apt) => sum + (apt.duration_minutes || 0), 0) || 0;
    const totalUsedHours = totalUsedMinutes / 60;

    return (totalUsedHours / totalAvailableHours) * 100;
  }

  private async calculateStaffProductivity(date: Date): Promise<number> {
    const { data: staff } = await supabase
      .from('staff')
      .select('id')
      .eq('practice_id', this.practiceId)
      .eq('status', 'active');

    if (!staff || staff.length === 0) return 0;

    const production = await this.calculateDailyProduction(date);
    return production / staff.length;
  }

  private async calculateNoShowRate(monthStart: Date): Promise<number> {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('status')
      .eq('practice_id', this.practiceId)
      .gte('date', monthStart.toISOString())
      .lte('date', endOfMonth(monthStart).toISOString());

    if (!appointments || appointments.length === 0) return 0;

    const noShows = appointments.filter(a => a.status === 'no_show').length;
    return (noShows / appointments.length) * 100;
  }

  private async calculateAppointmentEfficiency(date: Date): Promise<number> {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('scheduled_duration, actual_duration')
      .eq('practice_id', this.practiceId)
      .gte('date', startOfDay(date).toISOString())
      .lte('date', endOfDay(date).toISOString())
      .eq('status', 'completed');

    if (!appointments || appointments.length === 0) return 100;

    const efficiencies = appointments.map(apt => {
      if (!apt.actual_duration || !apt.scheduled_duration) return 100;
      return Math.min(100, (apt.scheduled_duration / apt.actual_duration) * 100);
    });

    return efficiencies.reduce((sum, e) => sum + e, 0) / efficiencies.length;
  }

  private async calculateAverageWaitTime(date: Date): Promise<number> {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('scheduled_time, actual_start_time')
      .eq('practice_id', this.practiceId)
      .gte('date', startOfDay(date).toISOString())
      .lte('date', endOfDay(date).toISOString())
      .eq('status', 'completed')
      .not('actual_start_time', 'is', null);

    if (!appointments || appointments.length === 0) return 0;

    const waitTimes = appointments.map(apt => {
      const scheduled = new Date(apt.scheduled_time).getTime();
      const actual = new Date(apt.actual_start_time).getTime();
      return Math.max(0, (actual - scheduled) / 60000); // Convert to minutes
    });

    return waitTimes.reduce((sum, w) => sum + w, 0) / waitTimes.length;
  }

  private async calculateScheduleAdherence(date: Date): Promise<number> {
    const { data: appointments } = await supabase
      .from('appointments')
      .select('scheduled_time, actual_start_time')
      .eq('practice_id', this.practiceId)
      .gte('date', startOfDay(date).toISOString())
      .lte('date', endOfDay(date).toISOString())
      .in('status', ['completed', 'in_progress'])
      .not('actual_start_time', 'is', null);

    if (!appointments || appointments.length === 0) return 100;

    const onTime = appointments.filter(apt => {
      const scheduled = new Date(apt.scheduled_time).getTime();
      const actual = new Date(apt.actual_start_time).getTime();
      const diffMinutes = Math.abs(actual - scheduled) / 60000;
      return diffMinutes <= 5; // Within 5 minutes is considered on-time
    }).length;

    return (onTime / appointments.length) * 100;
  }

  private async calculateSubdomainMetrics(date: Date) {
    const monthStart = startOfMonth(date);

    return {
      tmj: {
        outcomeScore: await this.calculateTMJOutcomeScore(monthStart),
        treatmentSuccess: await this.calculateTMJSuccessRate(monthStart),
        avgTreatmentDuration: await this.calculateTMJDuration(monthStart)
      },
      implant: {
        successRate: await this.calculateImplantSuccessRate(),
        osseointergrationRate: await this.calculateOsseointegrationRate(),
        complicationRate: await this.calculateImplantComplicationRate()
      },
      ortho: {
        avgTreatmentTime: await this.calculateOrthoTreatmentTime(),
        complianceRate: await this.calculateOrthoComplianceRate(monthStart),
        refinementRate: await this.calculateOrthoRefinementRate()
      }
    };
  }

  private async calculateTMJOutcomeScore(monthStart: Date): Promise<MetricResult> {
    const { data: outcomes } = await supabase
      .from('tmj_outcomes')
      .select('pain_reduction, function_improvement')
      .eq('practice_id', this.practiceId)
      .gte('assessment_date', monthStart.toISOString());

    if (!outcomes || outcomes.length === 0) {
      return this.createMetricResult(0, null, '/10');
    }

    const avgScore = outcomes.reduce((sum, o) => {
      const score = (o.pain_reduction + o.function_improvement) / 2;
      return sum + score;
    }, 0) / outcomes.length;

    return this.createMetricResult(avgScore, null, '/10');
  }

  private async calculateTMJSuccessRate(monthStart: Date): Promise<MetricResult> {
    const { data: treatments } = await supabase
      .from('tmj_treatments')
      .select('outcome_status')
      .eq('practice_id', this.practiceId)
      .gte('completed_at', monthStart.toISOString());

    if (!treatments || treatments.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const successful = treatments.filter(t => t.outcome_status === 'successful').length;
    const rate = (successful / treatments.length) * 100;

    return this.createMetricResult(rate, null, '%');
  }

  private async calculateTMJDuration(monthStart: Date): Promise<MetricResult> {
    const { data: treatments } = await supabase
      .from('tmj_treatments')
      .select('start_date, end_date')
      .eq('practice_id', this.practiceId)
      .gte('end_date', monthStart.toISOString())
      .not('end_date', 'is', null);

    if (!treatments || treatments.length === 0) {
      return this.createMetricResult(0, null, 'days');
    }

    const durations = treatments.map(t => {
      const start = new Date(t.start_date).getTime();
      const end = new Date(t.end_date).getTime();
      return (end - start) / (1000 * 60 * 60 * 24); // Convert to days
    });

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    return this.createMetricResult(avgDuration, null, 'days');
  }

  private async calculateImplantSuccessRate(): Promise<MetricResult> {
    const { data: implants } = await supabase
      .from('implant_cases')
      .select('status')
      .eq('practice_id', this.practiceId)
      .gte('placed_date', subDays(new Date(), 365).toISOString());

    if (!implants || implants.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const successful = implants.filter(i => i.status === 'integrated').length;
    const rate = (successful / implants.length) * 100;

    return this.createMetricResult(rate, null, '%');
  }

  private async calculateOsseointegrationRate(): Promise<MetricResult> {
    const { data: implants } = await supabase
      .from('implant_cases')
      .select('osseointegration_confirmed')
      .eq('practice_id', this.practiceId)
      .gte('placed_date', subDays(new Date(), 180).toISOString())
      .lte('placed_date', subDays(new Date(), 90).toISOString());

    if (!implants || implants.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const integrated = implants.filter(i => i.osseointegration_confirmed).length;
    const rate = (integrated / implants.length) * 100;

    return this.createMetricResult(rate, null, '%');
  }

  private async calculateImplantComplicationRate(): Promise<MetricResult> {
    const { data: implants } = await supabase
      .from('implant_cases')
      .select('complications')
      .eq('practice_id', this.practiceId)
      .gte('placed_date', subDays(new Date(), 365).toISOString());

    if (!implants || implants.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const withComplications = implants.filter(i => i.complications && i.complications.length > 0).length;
    const rate = (withComplications / implants.length) * 100;

    return this.createMetricResult(rate, null, '%');
  }

  private async calculateOrthoTreatmentTime(): Promise<MetricResult> {
    const { data: cases } = await supabase
      .from('ortho_cases')
      .select('start_date, completion_date')
      .eq('practice_id', this.practiceId)
      .not('completion_date', 'is', null)
      .gte('completion_date', subDays(new Date(), 180).toISOString());

    if (!cases || cases.length === 0) {
      return this.createMetricResult(0, null, 'months');
    }

    const durations = cases.map(c => {
      const start = new Date(c.start_date).getTime();
      const end = new Date(c.completion_date).getTime();
      return (end - start) / (1000 * 60 * 60 * 24 * 30); // Convert to months
    });

    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;

    return this.createMetricResult(avgDuration, null, 'months');
  }

  private async calculateOrthoComplianceRate(monthStart: Date): Promise<MetricResult> {
    const { data: checkups } = await supabase
      .from('ortho_checkups')
      .select('compliance_score')
      .eq('practice_id', this.practiceId)
      .gte('date', monthStart.toISOString());

    if (!checkups || checkups.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const avgCompliance = checkups.reduce((sum, c) => sum + (c.compliance_score || 0), 0) / checkups.length;

    return this.createMetricResult(avgCompliance, null, '%');
  }

  private async calculateOrthoRefinementRate(): Promise<MetricResult> {
    const { data: cases } = await supabase
      .from('ortho_cases')
      .select('required_refinements')
      .eq('practice_id', this.practiceId)
      .not('completion_date', 'is', null)
      .gte('completion_date', subDays(new Date(), 365).toISOString());

    if (!cases || cases.length === 0) {
      return this.createMetricResult(0, null, '%');
    }

    const withRefinements = cases.filter(c => c.required_refinements).length;
    const rate = (withRefinements / cases.length) * 100;

    return this.createMetricResult(rate, null, '%');
  }

  private createMetricResult(
    value: number,
    previousValue: number | null,
    unit?: string
  ): MetricResult {
    const result: MetricResult = { value, unit };

    if (previousValue !== null) {
      result.previousValue = previousValue;
      result.change = value - previousValue;
      result.changePercent = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
      result.trend = value > previousValue ? 'up' : value < previousValue ? 'down' : 'stable';
    }

    return result;
  }

  // Real-time metric calculation for specific KPIs
  async calculateRealTimeMetric(metricType: string): Promise<MetricResult> {
    switch (metricType) {
      case 'dailyProduction':
        return this.createMetricResult(await this.calculateDailyProduction(new Date()), null, '$');
      case 'chairUtilization':
        return this.createMetricResult(await this.calculateChairUtilization(new Date()), null, '%');
      case 'activePatients':
        return this.createMetricResult(await this.calculateActivePatients(), null);
      default:
        throw new Error(`Unknown metric type: ${metricType}`);
    }
  }
}