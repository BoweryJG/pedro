// Watch Metrics Types
export interface WatchMetrics {
  appointments: AppointmentMetrics;
  patients: PatientMetrics;
  services: ServiceMetrics;
  performance: PerformanceMetrics;
}

export interface AppointmentMetrics {
  todayCount: number;
  weeklyUpcoming: number;
  completionRate: number;
  averageDuration: number;
  nextAppointment: Date | null;
}

export interface PatientMetrics {
  totalActive: number;
  newThisMonth: number;
  satisfactionAverage: number;
  returningPercentage: number;
  patientOfTheDay: string;
}

export interface ServiceMetrics {
  totalServices: number;
  yomiProcedures: number;
  revenuePerService: number;
  popularService: string;
  bookingTrends: number;
}

export interface PerformanceMetrics {
  dailyRevenue: number;
  weeklyTarget: number;
  staffProductivity: number;
  testimonialRating: number;
  performanceStatus: string;
}

// Data Mode Type
export type DataMode = 'appointments' | 'patients' | 'services' | 'performance';

// Watch Component Props
export interface WatchComponentProps {
  model: 'chronomat' | 'windrider';
  size: 'small' | 'medium' | 'large';
  dataMode: DataMode;
  realTimeUpdates: boolean;
  interactiveMode: boolean;
  onModeChange?: (mode: DataMode) => void;
}

// Watch Time Types
export interface WatchTime {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export interface ChronometerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  lapTimes: number[];
}

export interface WatchHandPositions {
  hours: number;
  minutes: number;
  seconds: number;
  chronoMinutes: number;
  chronoSeconds: number;
  chronoHours: number;
}

// Supabase Data Types
export interface Appointment {
  id: string;
  patient_id: string;
  service_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  services?: Service;
}

export interface Patient {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  medical_history?: any;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  estimated_duration?: string;
  price_range?: any;
  image_url?: string;
  is_yomi_technology: boolean;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  specialization?: string;
  bio?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}