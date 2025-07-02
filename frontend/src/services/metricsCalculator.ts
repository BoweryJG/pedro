import { format, startOfDay, endOfDay, startOfMonth, startOfWeek } from 'date-fns';
import { 
  Appointment, 
  Patient, 
  Service, 
  Staff, 
  WatchMetrics,
  AppointmentMetrics,
  PatientMetrics,
  ServiceMetrics,
  PerformanceMetrics
} from '../types/watch.types';

export class MetricsCalculator {
  static calculateAppointmentMetrics(appointments: Appointment[]): AppointmentMetrics {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = startOfWeek(today);

    // Today's appointments
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= todayStart && aptDate <= todayEnd;
    });

    // Upcoming appointments this week
    const weeklyUpcoming = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= today && aptDate >= weekStart;
    });

    // Completion rate calculation
    const completedAppointments = appointments.filter(apt => apt.status === 'completed');
    const completionRate = appointments.length > 0 
      ? (completedAppointments.length / appointments.length) * 100 
      : 0;

    // Average duration calculation (mock - would need actual duration data)
    const averageDuration = 60; // minutes

    // Next appointment
    const futureAppointments = appointments
      .filter(apt => new Date(apt.appointment_date) > today)
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
    
    const nextAppointment = futureAppointments.length > 0 
      ? new Date(futureAppointments[0].appointment_date) 
      : null;

    return {
      todayCount: todayAppointments.length,
      weeklyUpcoming: weeklyUpcoming.length,
      completionRate: Math.round(completionRate),
      averageDuration,
      nextAppointment,
    };
  }

  static calculatePatientMetrics(patients: Patient[], appointments: Appointment[]): PatientMetrics {
    const monthStart = startOfMonth(new Date());
    
    // New patients this month
    const newThisMonth = patients.filter(patient => {
      const createdDate = new Date(patient.created_at);
      return createdDate >= monthStart;
    }).length;

    // Patient satisfaction average (mock - in real app would come from reviews)
    const satisfactionAverage = 4.8;

    // Returning patient percentage (mock calculation)
    const returningPercentage = 85; // Would need actual data tracking

    // Patient of the day (mock)
    const patientOfTheDay = patients.length > 0 
      ? `${patients[0].first_name} ${patients[0].last_name}`
      : 'No patients';

    return {
      totalActive: patients.length,
      newThisMonth,
      satisfactionAverage: Math.round(satisfactionAverage * 10) / 10,
      returningPercentage,
      patientOfTheDay,
    };
  }

  static calculateServiceMetrics(services: Service[], appointments: Appointment[]): ServiceMetrics {
    // Yomi procedures count
    const yomiProcedures = appointments.filter(apt =>
      apt.services && apt.services.is_yomi_technology
    ).length;

    // Revenue per service (mock calculation based on price ranges)
    const totalRevenue = services.reduce((sum, service) => {
      if (service.price_range && service.price_range.min) {
        return sum + service.price_range.min;
      }
      return sum;
    }, 0);
    
    const revenuePerService = services.length > 0 ? totalRevenue / services.length : 0;

    // Most popular service
    const serviceBookings: { [key: string]: number } = {};
    appointments.forEach(apt => {
      if (apt.services) {
        serviceBookings[apt.services.name] = (serviceBookings[apt.services.name] || 0) + 1;
      }
    });

    const popularService = Object.keys(serviceBookings).reduce((a, b) => 
      serviceBookings[a] > serviceBookings[b] ? a : b, 'Dental Cleaning'
    );

    // Booking trends (weekly growth percentage - mock)
    const bookingTrends = 12; // percentage growth

    return {
      totalServices: services.length,
      yomiProcedures,
      revenuePerService: Math.round(revenuePerService),
      popularService,
      bookingTrends,
    };
  }

  static calculatePerformanceMetrics(
    appointments: Appointment[], 
    staff: Staff[]
  ): PerformanceMetrics {
    const today = new Date();
    const weekStart = startOfWeek(today);

    // Daily revenue (mock calculation)
    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return format(aptDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
    });
    
    const dailyRevenue = todayAppointments.length * 250; // Average service price

    // Weekly target (mock)
    const weeklyTarget = 15000;

    // Staff productivity (mock calculation based on appointments)
    const weeklyAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date);
      return aptDate >= weekStart;
    });
    
    const staffProductivity = Math.min(100, (weeklyAppointments.length / 50) * 100);

    // Mock rating average (in real app, this would come from reviews/feedback)
    const testimonialRating = 4.9;

    // Performance status
    const revenueProgress = (dailyRevenue / (weeklyTarget / 7)) * 100;
    let performanceStatus = 'Excellent';
    if (revenueProgress < 80) performanceStatus = 'Good';
    if (revenueProgress < 60) performanceStatus = 'Fair';
    if (revenueProgress < 40) performanceStatus = 'Needs Improvement';

    return {
      dailyRevenue,
      weeklyTarget,
      staffProductivity: Math.round(staffProductivity),
      testimonialRating: Math.round(testimonialRating * 10) / 10,
      performanceStatus,
    };
  }

  static calculateAllMetrics(
    appointments: Appointment[],
    patients: Patient[],
    services: Service[],
    staff: Staff[]
  ): WatchMetrics {
    return {
      appointments: this.calculateAppointmentMetrics(appointments),
      patients: this.calculatePatientMetrics(patients, appointments),
      services: this.calculateServiceMetrics(services, appointments),
      performance: this.calculatePerformanceMetrics(appointments, staff),
    };
  }

  // Convert metrics to watch display values (0-12 for hour positions, 0-60 for minute positions)
  static metricsToWatchValues(metrics: WatchMetrics, mode: string) {
    switch (mode) {
      case 'appointments':
        return {
          mainDial: Math.min(12, metrics.appointments.todayCount),
          subdial1: Math.min(60, metrics.appointments.weeklyUpcoming * 5),
          subdial2: Math.min(60, metrics.appointments.completionRate * 0.6),
          subdial3: Math.min(60, metrics.appointments.averageDuration),
        };
      
      case 'patients':
        return {
          mainDial: Math.min(12, Math.floor(metrics.patients.totalActive / 10)),
          subdial1: Math.min(60, metrics.patients.newThisMonth * 4),
          subdial2: Math.min(60, metrics.patients.satisfactionAverage * 12),
          subdial3: Math.min(60, metrics.patients.returningPercentage * 0.6),
        };

      case 'services':
        return {
          mainDial: Math.min(12, Math.floor(metrics.services.totalServices / 2)),
          subdial1: Math.min(60, metrics.services.yomiProcedures * 3),
          subdial2: Math.min(60, Math.floor(metrics.services.revenuePerService / 10)),
          subdial3: Math.min(60, metrics.services.bookingTrends * 5),
        };

      case 'performance':
        return {
          mainDial: Math.min(12, Math.floor(metrics.performance.dailyRevenue / 500)),
          subdial1: Math.min(60, Math.floor(metrics.performance.weeklyTarget / 500)),
          subdial2: Math.min(60, metrics.performance.staffProductivity * 0.6),
          subdial3: Math.min(60, metrics.performance.testimonialRating * 12),
        };

      default:
        return {
          mainDial: 0,
          subdial1: 0,
          subdial2: 0,
          subdial3: 0,
        };
    }
  }
}
