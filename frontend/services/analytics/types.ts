// Type definitions for analytics services

export interface Appointment {
  id: string;
  practice_id: string;
  patient_id: string;
  date: string;
  scheduled_time: string;
  actual_start_time?: string;
  status: 'scheduled' | 'checked-in' | 'in_progress' | 'completed' | 'no_show' | 'cancelled';
  duration_minutes?: number;
  scheduled_duration?: number;
  actual_duration?: number;
  treatments?: Treatment[];
}

export interface Treatment {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
}

export interface Billing {
  id: string;
  practice_id: string;
  patient_id: string;
  amount_due: number;
  amount_paid: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

export interface Patient {
  id: string;
  practice_id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at: string;
  last_visit?: string;
  status: 'active' | 'inactive';
  insurance_status?: 'good' | 'complex' | 'none';
  age?: number;
  referral_source?: string;
  last_review_score?: number;
}

export interface OperatoryStatus {
  id: string;
  practice_id: string;
  operatory_id: string;
  status: 'available' | 'occupied' | 'maintenance';
  updated_at: string;
}

export interface HistoricalData {
  production: Array<{
    date: string;
    total_production: number;
  }>;
  appointments: Appointment[];
}

export interface PatientData {
  patient: Patient;
  appointments: Appointment[];
  treatments: TreatmentPlan[];
  billings: Billing[];
}

export interface TreatmentPlan {
  id: string;
  patient_id: string;
  treatment_type: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
}

export interface AlertData {
  rate?: number;
  threshold?: number;
  message: string;
  [key: string]: unknown;
}

export interface SchedulingFeatures {
  appointments: Appointment[];
  avgNoShowsPerDay: number;
  avgChairCount: number;
  historicalProduction: number;
}

export interface TimeSlot {
  time: string;
  appointments: Appointment[];
  avgDuration: number;
  avgWaitTime: number;
  utilizationRate: number;
  scheduledDuration?: number;
  noShowRate?: number;
}

import { BenchmarkData } from './benchmarkService';

export interface BenchmarkReportData {
  strengths: BenchmarkData[];
  opportunities: Array<{
    metric: string;
    currentValue: number;
    targetValue: number;
    potentialImpact: number;
    recommendedActions: string[];
  }>;
}