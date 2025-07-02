import React from 'react';
import type { WatchMetrics, DataMode } from '../../../../types/watch.types';

interface DataDisplayProps {
  metrics: WatchMetrics;
  dataMode: DataMode;
  onModeSwitch: () => void;
  interactiveMode: boolean;
}

const DataDisplay: React.FC<DataDisplayProps> = ({
  metrics,
  dataMode,
  onModeSwitch,
  interactiveMode
}) => {
  const getModeDisplayData = () => {
    switch (dataMode) {
      case 'appointments':
        return {
          title: 'APPOINTMENTS',
          primaryValue: metrics.appointments.todayCount,
          primaryLabel: "Today's Appointments",
          subdials: [
            { label: 'Weekly Upcoming', value: metrics.appointments.weeklyUpcoming },
            { label: 'Completion Rate', value: `${metrics.appointments.completionRate}%` },
            { label: 'Avg Duration', value: `${metrics.appointments.averageDuration}min` }
          ],
          digitalDisplay: metrics.appointments.nextAppointment 
            ? new Date(metrics.appointments.nextAppointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'No upcoming'
        };

      case 'patients':
        return {
          title: 'PATIENTS',
          primaryValue: metrics.patients.totalActive,
          primaryLabel: 'Total Active Patients',
          subdials: [
            { label: 'New This Month', value: metrics.patients.newThisMonth },
            { label: 'Satisfaction', value: `${metrics.patients.satisfactionAverage}/5` },
            { label: 'Returning Rate', value: `${metrics.patients.returningPercentage}%` }
          ],
          digitalDisplay: metrics.patients.patientOfTheDay
        };

      case 'services':
        return {
          title: 'SERVICES',
          primaryValue: metrics.services.totalServices,
          primaryLabel: 'Total Services',
          subdials: [
            { label: 'YOMI Procedures', value: metrics.services.yomiProcedures },
            { label: 'Revenue/Service', value: `$${metrics.services.revenuePerService}` },
            { label: 'Growth Trend', value: `+${metrics.services.bookingTrends}%` }
          ],
          digitalDisplay: metrics.services.popularService
        };

      case 'performance':
        return {
          title: 'PERFORMANCE',
          primaryValue: `$${metrics.performance.dailyRevenue}`,
          primaryLabel: "Today's Revenue",
          subdials: [
            { label: 'Weekly Target', value: `$${metrics.performance.weeklyTarget}` },
            { label: 'Staff Productivity', value: `${metrics.performance.staffProductivity}%` },
            { label: 'Testimonials', value: `${metrics.performance.testimonialRating}/5` }
          ],
          digitalDisplay: metrics.performance.performanceStatus
        };

      default:
        return {
          title: 'DATA',
          primaryValue: 0,
          primaryLabel: 'No Data',
          subdials: [
            { label: 'Subdial 1', value: 0 },
            { label: 'Subdial 2', value: 0 },
            { label: 'Subdial 3', value: 0 }
          ],
          digitalDisplay: 'Select Mode'
        };
    }
  };

  const displayData = getModeDisplayData();

  return (
    <div className="data-display-overlay">
      {/* Mode Indicator and Switcher */}
      <div className="mode-indicator" style={{
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: '#22c55e',
        padding: '2px 8px',
        borderRadius: '3px',
        fontSize: '8px',
        fontWeight: 'bold',
        border: '1px solid #374151',
        cursor: interactiveMode ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
      onClick={interactiveMode ? onModeSwitch : undefined}
      title={interactiveMode ? 'Click to switch mode' : ''}
      >
        {displayData.title}
        {interactiveMode && <span style={{ marginLeft: '4px' }}>↻</span>}
      </div>

      {/* Primary Metric Display */}
      <div className="primary-metric" style={{
        position: 'absolute',
        top: '140px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: '#ffffff',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}>
        <div style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '2px'
        }}>
          {displayData.primaryValue}
        </div>
        <div style={{
          fontSize: '8px',
          opacity: 0.8
        }}>
          {displayData.primaryLabel}
        </div>
      </div>

      {/* Subdial Labels */}
      <div className="subdial-labels">
        {/* Left Subdial (9 o'clock) */}
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '180px',
          fontSize: '7px',
          color: '#64748b',
          textAlign: 'center',
          width: '60px'
        }}>
          <div style={{ fontWeight: 'bold' }}>{displayData.subdials[0].value}</div>
          <div style={{ opacity: 0.8 }}>{displayData.subdials[0].label}</div>
        </div>

        {/* Bottom Subdial (6 o'clock) */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '7px',
          color: '#64748b',
          textAlign: 'center',
          width: '60px'
        }}>
          <div style={{ fontWeight: 'bold' }}>{displayData.subdials[1].value}</div>
          <div style={{ opacity: 0.8 }}>{displayData.subdials[1].label}</div>
        </div>

        {/* Right Subdial (3 o'clock) */}
        <div style={{
          position: 'absolute',
          right: '20px',
          top: '180px',
          fontSize: '7px',
          color: '#64748b',
          textAlign: 'center',
          width: '60px'
        }}>
          <div style={{ fontWeight: 'bold' }}>{displayData.subdials[2].value}</div>
          <div style={{ opacity: 0.8 }}>{displayData.subdials[2].label}</div>
        </div>
      </div>

      {/* Digital Information Display */}
      <div className="digital-info" style={{
        position: 'absolute',
        bottom: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#22c55e',
        padding: '3px 6px',
        borderRadius: '3px',
        fontSize: '9px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        border: '1px solid #374151',
        maxWidth: '120px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {displayData.digitalDisplay}
      </div>

      {/* Data Quality Indicator */}
      <div className="data-quality" style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: metrics ? '#22c55e' : '#ef4444',
        boxShadow: '0 0 4px rgba(34, 197, 94, 0.5)'
      }}
      title={metrics ? 'Data Connected' : 'No Data'}
      />

      {/* Mode Switch Instructions */}
      {interactiveMode && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          fontSize: '6px',
          color: '#64748b',
          opacity: 0.7
        }}>
          Click mode to switch
        </div>
      )}

      <style>{`
        .mode-indicator:hover {
          background: rgba(34, 197, 94, 0.2) !important;
          border-color: #22c55e !important;
        }
        
        .data-display-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .mode-indicator {
          pointer-events: ${interactiveMode ? 'auto' : 'none'};
        }
      `}</style>
    </div>
  );
};

export default DataDisplay;
