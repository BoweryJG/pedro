export class MetricsCalculator {
  // Convert metrics to watch hand values based on data mode
  static metricsToWatchValues(metrics: any, dataMode: string): {
    hours: number;
    minutes: number;
    seconds: number;
    mainDial: number;
    subdial1: number;
    subdial2: number;
    subdial3: number;
  } {
    // Safe number helper
    const safeNumber = (value: any, defaultValue: number = 0): number => {
      const num = Number(value);
      return isNaN(num) || !isFinite(num) ? defaultValue : num;
    };

    if (!metrics) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        mainDial: 0,
        subdial1: 0,
        subdial2: 0,
        subdial3: 0
      };
    }

    let value = 0;
    let max = 100;
    let subdial1Value = 0;
    let subdial2Value = 0;
    let subdial3Value = 0;

    switch (dataMode) {
      case 'appointments':
        value = safeNumber(metrics.appointments?.todayCount, 0);
        max = 20; // Max 20 appointments per day
        subdial1Value = safeNumber(metrics.appointments?.weeklyUpcoming, 0);
        subdial2Value = safeNumber(metrics.appointments?.averageDuration, 60);
        subdial3Value = safeNumber(metrics.appointments?.completionRate, 0);
        break;
      case 'patients':
        value = safeNumber(metrics.patients?.newThisMonth, 0);
        max = 10; // Max 10 new patients per day
        subdial1Value = safeNumber(metrics.patients?.totalActive, 0);
        subdial2Value = safeNumber(metrics.patients?.satisfactionAverage, 0) * 20; // Convert 0-5 to 0-100
        subdial3Value = safeNumber(metrics.patients?.returningPercentage, 0);
        break;
      case 'services':
        value = safeNumber(metrics.services?.totalServices, 0);
        max = 30; // Max 30 services per day
        subdial1Value = safeNumber(metrics.services?.yomiProcedures, 0);
        subdial2Value = safeNumber(metrics.services?.revenuePerService, 0) / 10; // Scale down for display
        subdial3Value = safeNumber(metrics.services?.bookingTrends, 0);
        break;
      case 'performance':
        value = safeNumber(metrics.performance?.dailyRevenue, 0);
        max = 10000; // Max $10,000 daily revenue
        subdial1Value = (safeNumber(metrics.performance?.dailyRevenue, 0) / safeNumber(metrics.performance?.weeklyTarget, 15000)) * 100;
        subdial2Value = safeNumber(metrics.performance?.staffProductivity, 0);
        subdial3Value = safeNumber(metrics.performance?.testimonialRating, 0) * 20; // Convert 0-5 to 0-100
        break;
    }

    // Convert to 12-hour format with safe calculations
    const percentage = Math.min(safeNumber(value / max, 0), 1);
    const totalMinutes = safeNumber(percentage * 720, 0); // 12 hours = 720 minutes
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    const mainDial = safeNumber(percentage * 12, 0); // 0-12 position

    return { 
      hours: safeNumber(hours, 0), 
      minutes: safeNumber(minutes, 0), 
      seconds: safeNumber(seconds, 0),
      mainDial: safeNumber(mainDial, 0),
      subdial1: safeNumber(subdial1Value, 0),
      subdial2: safeNumber(subdial2Value, 0),
      subdial3: safeNumber(subdial3Value, 0)
    };
  }
  // Calculate production metrics
  static calculateDailyProduction(appointments: any[]): number {
    return appointments.reduce((total, apt) => total + (apt.production || 0), 0);
  }

  static calculateMonthlyProduction(appointments: any[]): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return appointments
      .filter(apt => new Date(apt.date) >= thirtyDaysAgo)
      .reduce((total, apt) => total + (apt.production || 0), 0);
  }

  // Calculate collection metrics
  static calculateCollectionRate(collected: number, production: number): number {
    if (production === 0) return 0;
    return (collected / production) * 100;
  }

  // Calculate patient metrics
  static calculateNewPatientRate(patients: any[]): number {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newPatients = patients.filter(p => 
      new Date(p.created_at) >= thirtyDaysAgo
    );
    
    return newPatients.length;
  }

  static calculatePatientRetentionRate(patients: any[], appointments: any[]): number {
    const activePatients = new Set(appointments.map(a => a.patient_id));
    const totalPatients = patients.length;
    
    if (totalPatients === 0) return 0;
    return (activePatients.size / totalPatients) * 100;
  }

  // Calculate appointment metrics
  static calculateNoShowRate(appointments: any[]): number {
    const completedOrNoShow = appointments.filter(a => 
      a.status === 'completed' || a.status === 'no-show'
    );
    
    if (completedOrNoShow.length === 0) return 0;
    
    const noShows = completedOrNoShow.filter(a => a.status === 'no-show');
    return (noShows.length / completedOrNoShow.length) * 100;
  }

  static calculateScheduleFillRate(appointments: any[], totalSlots: number): number {
    if (totalSlots === 0) return 0;
    return (appointments.length / totalSlots) * 100;
  }

  // Calculate case acceptance rate
  static calculateCaseAcceptanceRate(proposed: number, accepted: number): number {
    if (proposed === 0) return 0;
    return (accepted / proposed) * 100;
  }

  // Calculate average production per patient
  static calculateAverageProductionPerPatient(production: number, patientCount: number): number {
    if (patientCount === 0) return 0;
    return production / patientCount;
  }

  // Format currency
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Format percentage
  static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  // Calculate watch hand positions (0-360 degrees)
  static calculateHandPosition(value: number, max: number): number {
    return (value / max) * 360;
  }

  // Get performance indicator
  static getPerformanceIndicator(value: number, target: number): 'excellent' | 'good' | 'needs-improvement' {
    const percentage = (value / target) * 100;
    if (percentage >= 95) return 'excellent';
    if (percentage >= 80) return 'good';
    return 'needs-improvement';
  }

  // Calculate all metrics
  static calculateAllMetrics(appointments: any[], patients: any[], services: any[], staff: any[]): any {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const todayAppointments = appointments.filter(apt => 
      apt.appointment_date === todayStr
    );

    const newPatientsThisMonth = patients.filter(p => {
      const createdDate = new Date(p.created_at);
      return createdDate.getMonth() === today.getMonth() && 
             createdDate.getFullYear() === today.getFullYear();
    });

    return {
      appointments: {
        todayCount: todayAppointments.length,
        weeklyUpcoming: appointments.filter(apt => new Date(apt.appointment_date) > today).length,
        completionRate: 95,
        averageDuration: 60,
        nextAppointment: appointments.length > 0 ? new Date(appointments[0].appointment_date) : null
      },
      patients: {
        totalActive: patients.length,
        newThisMonth: newPatientsThisMonth.length,
        satisfactionAverage: 4.8,
        returningPercentage: 85,
        patientOfTheDay: patients.length > 0 ? `${patients[0].first_name} ${patients[0].last_name}` : 'No patients yet'
      },
      services: {
        totalServices: services.length,
        yomiProcedures: services.filter(s => s.is_yomi_technology).length,
        revenuePerService: 450,
        popularService: services.length > 0 ? services[0].name : 'No services yet',
        bookingTrends: 15
      },
      performance: {
        dailyRevenue: todayAppointments.length * 450,
        weeklyTarget: 15000,
        staffProductivity: 88,
        testimonialRating: 4.9,
        performanceStatus: 'Excellent'
      }
    };
  }
}