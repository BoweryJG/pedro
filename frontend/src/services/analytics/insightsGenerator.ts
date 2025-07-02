export class InsightsGenerator {
  // Generate insights based on current metrics
  static generateInsights(metrics: any): {
    type: 'success' | 'warning' | 'info' | 'opportunity';
    title: string;
    description: string;
    action?: string;
  }[] {
    const insights = [];
    
    // Production insights
    if (metrics.dailyProduction > metrics.dailyProductionGoal * 1.1) {
      insights.push({
        type: 'success' as const,
        title: 'Exceptional Production Day',
        description: `Today's production is ${Math.round((metrics.dailyProduction / metrics.dailyProductionGoal - 1) * 100)}% above goal!`,
        action: 'Share success factors with team'
      });
    } else if (metrics.dailyProduction < metrics.dailyProductionGoal * 0.8) {
      insights.push({
        type: 'warning' as const,
        title: 'Production Below Target',
        description: 'Consider same-day treatment opportunities or follow up on pending treatment plans',
        action: 'Review schedule for openings'
      });
    }
    
    // No-show insights
    if (metrics.noShowRate > 10) {
      insights.push({
        type: 'warning' as const,
        title: 'High No-Show Rate Detected',
        description: `${metrics.noShowRate.toFixed(1)}% no-show rate is impacting productivity`,
        action: 'Implement confirmation calls for high-risk patients'
      });
    }
    
    // New patient insights
    if (metrics.newPatientsThisWeek > metrics.averageNewPatientsPerWeek * 1.5) {
      insights.push({
        type: 'success' as const,
        title: 'New Patient Surge',
        description: 'New patient flow is 50% above average this week',
        action: 'Ensure exceptional first visit experience'
      });
    }
    
    // Schedule insights
    if (metrics.tomorrowOpenSlots > 3) {
      insights.push({
        type: 'opportunity' as const,
        title: 'Schedule Openings Tomorrow',
        description: `${metrics.tomorrowOpenSlots} appointment slots available`,
        action: 'Contact patients on ASAP list'
      });
    }
    
    // Financial insights
    if (metrics.outstandingBalance > metrics.monthlyProduction * 0.5) {
      insights.push({
        type: 'warning' as const,
        title: 'High Outstanding Balances',
        description: 'Collections need attention to maintain cash flow',
        action: 'Review aged receivables report'
      });
    }
    
    // Specialty insights
    if (metrics.tmjCaseAcceptance < 50) {
      insights.push({
        type: 'info' as const,
        title: 'TMJ Case Presentation Opportunity',
        description: 'Consider reviewing TMJ presentation materials with team',
        action: 'Schedule TMJ case presentation training'
      });
    }
    
    if (metrics.yomiUtilization < 60) {
      insights.push({
        type: 'opportunity' as const,
        title: 'Yomi Robot Underutilized',
        description: 'Increase ROI by scheduling more robotic implant cases',
        action: 'Identify implant candidates for Yomi'
      });
    }
    
    return insights;
  }

  // Generate trend insights
  static generateTrendInsights(historicalData: any[]): {
    metric: string;
    trend: 'improving' | 'declining' | 'stable';
    change: number;
    insight: string;
  }[] {
    const insights = [];
    
    // Analyze last 30 days vs previous 30 days
    const midPoint = Math.floor(historicalData.length / 2);
    const recentData = historicalData.slice(midPoint);
    const olderData = historicalData.slice(0, midPoint);
    
    // Production trend
    const recentProduction = recentData.reduce((sum, d) => sum + d.production, 0) / recentData.length;
    const olderProduction = olderData.reduce((sum, d) => sum + d.production, 0) / olderData.length;
    const productionChange = ((recentProduction - olderProduction) / olderProduction) * 100;
    
    insights.push({
      metric: 'Production',
      trend: productionChange > 5 ? 'improving' : productionChange < -5 ? 'declining' : 'stable',
      change: productionChange,
      insight: productionChange > 0 
        ? `Production has increased ${productionChange.toFixed(1)}% over the last 30 days`
        : `Production has decreased ${Math.abs(productionChange).toFixed(1)}% - review schedule optimization`
    });
    
    // Patient flow trend
    const recentPatients = recentData.reduce((sum, d) => sum + d.newPatients, 0);
    const olderPatients = olderData.reduce((sum, d) => sum + d.newPatients, 0);
    const patientChange = ((recentPatients - olderPatients) / olderPatients) * 100;
    
    insights.push({
      metric: 'New Patients',
      trend: patientChange > 5 ? 'improving' : patientChange < -5 ? 'declining' : 'stable',
      change: patientChange,
      insight: patientChange > 0
        ? `New patient flow is up ${patientChange.toFixed(1)}% - marketing efforts are working`
        : `New patient flow needs attention - down ${Math.abs(patientChange).toFixed(1)}%`
    });
    
    return insights;
  }

  // Generate action items
  static generateActionItems(metrics: any, insights: any[]): {
    priority: 'high' | 'medium' | 'low';
    task: string;
    deadline: string;
    assignee?: string;
  }[] {
    const actionItems = [];
    
    // High priority items based on warnings
    insights
      .filter(i => i.type === 'warning')
      .forEach(insight => {
        actionItems.push({
          priority: 'high' as const,
          task: insight.action || `Address: ${insight.title}`,
          deadline: 'Today',
          assignee: 'Office Manager'
        });
      });
    
    // Medium priority opportunities
    insights
      .filter(i => i.type === 'opportunity')
      .forEach(insight => {
        actionItems.push({
          priority: 'medium' as const,
          task: insight.action || `Explore: ${insight.title}`,
          deadline: 'This Week',
          assignee: 'Treatment Coordinator'
        });
      });
    
    // Routine items based on metrics
    if (metrics.scheduleFillRate < 80) {
      actionItems.push({
        priority: 'medium' as const,
        task: 'Review and optimize block scheduling',
        deadline: 'This Week',
        assignee: 'Front Desk'
      });
    }
    
    if (metrics.overdueRecalls > 50) {
      actionItems.push({
        priority: 'low' as const,
        task: `Contact ${metrics.overdueRecalls} patients overdue for recall`,
        deadline: 'This Month',
        assignee: 'Hygiene Coordinator'
      });
    }
    
    return actionItems;
  }
}