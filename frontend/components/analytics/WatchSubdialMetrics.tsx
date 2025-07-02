import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsService, DashboardMetrics, RealtimeMetric, Insight } from '@/services/analytics';

interface SubdialProps {
  title: string;
  value: number;
  unit: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  min?: number;
  max?: number;
  thresholds?: Array<{ value: number; color: string }>;
  size?: 'small' | 'medium' | 'large';
}

const WatchSubdial: React.FC<SubdialProps> = ({
  title,
  value,
  unit,
  change,
  trend,
  min = 0,
  max = 100,
  thresholds = [],
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64'
  };

  const normalizedValue = ((value - min) / (max - min)) * 100;
  const rotation = (normalizedValue / 100) * 270 - 135; // -135 to 135 degrees

  const getColor = () => {
    for (const threshold of thresholds.reverse()) {
      if (value >= threshold.value) return threshold.color;
    }
    return '#6B7280'; // Default gray
  };

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full bg-gray-900 border-4 border-gray-800 shadow-2xl`}>
      {/* Background dial markings */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Major tick marks */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const angle = (percent / 100) * 270 - 135;
          const radian = (angle * Math.PI) / 180;
          const x1 = 50 + 40 * Math.cos(radian);
          const y1 = 50 + 40 * Math.sin(radian);
          const x2 = 50 + 35 * Math.cos(radian);
          const y2 = 50 + 35 * Math.sin(radian);
          
          return (
            <line
              key={percent}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#4B5563"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Arc background */}
        <path
          d="M 20 70 A 35 35 0 1 1 80 70"
          fill="none"
          stroke="#374151"
          strokeWidth="6"
          strokeLinecap="round"
        />
        
        {/* Colored arc */}
        <motion.path
          d="M 20 70 A 35 35 0 1 1 80 70"
          fill="none"
          stroke={getColor()}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="165"
          animate={{ strokeDashoffset: 165 - (normalizedValue / 100) * 165 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: rotation }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="w-1 h-12 bg-white rounded-full shadow-lg transform -translate-y-4" />
      </motion.div>

      {/* Center cap */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 bg-gray-700 rounded-full border-2 border-gray-600" />
      </div>

      {/* Value display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="text-xs text-gray-400 uppercase tracking-wider mt-8">{title}</div>
        <div className="text-2xl font-bold">
          {value.toFixed(unit === '$' ? 0 : 1)}
          <span className="text-sm text-gray-400">{unit}</span>
        </div>
        {change !== undefined && (
          <div className={`text-xs flex items-center gap-1 ${
            trend === 'up' ? 'text-green-400' : 
            trend === 'down' ? 'text-red-400' : 
            'text-gray-400'
          }`}>
            {trend === 'up' && '↑'}
            {trend === 'down' && '↓'}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
};

interface ComplicationProps {
  insight: Insight;
  onDismiss: () => void;
}

const WatchComplication: React.FC<ComplicationProps> = ({ insight, onDismiss }) => {
  const styles = {
    alert: 'bg-red-900/20 border-red-600',
    opportunity: 'bg-blue-900/20 border-blue-600',
    trend: 'bg-purple-900/20 border-purple-600',
    achievement: 'bg-green-900/20 border-green-600',
    recommendation: 'bg-orange-900/20 border-orange-600'
  };

  const icons = {
    alert: '⚠️',
    opportunity: '💡',
    trend: '📈',
    achievement: '🏆',
    recommendation: '💭'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-xl border-2 ${styles[insight.type]} backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{icons[insight.type]}</span>
          <div>
            <h4 className="text-white font-semibold">{insight.title}</h4>
            <p className="text-gray-300 text-sm mt-1">{insight.description}</p>
            {insight.impact && (
              <p className="text-gray-400 text-xs mt-2">{insight.impact}</p>
            )}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          ×
        </button>
      </div>
      {insight.actions.length > 0 && (
        <div className="flex gap-2 mt-3 ml-11">
          {insight.actions.map((action, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                action.type === 'primary'
                  ? 'bg-white/10 text-white hover:bg-white/20'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {action.text}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const WatchSubdialMetrics: React.FC<{ practiceId: string }> = ({ practiceId }) => {
  const [analytics] = useState(() => new AnalyticsService(practiceId));
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [realtimeMetrics, setRealtimeMetrics] = useState<Map<string, RealtimeMetric>>(new Map());

  useEffect(() => {
    // Load initial metrics
    analytics.getMetrics().then(setMetrics);
    analytics.getInsights().then(setInsights);

    // Start real-time tracking
    analytics.startRealtimeTracking();

    // Subscribe to real-time updates
    const subscriptions = [
      'daily_production',
      'chair_occupancy',
      'current_wait_time',
      'patient_throughput'
    ];

    subscriptions.forEach(metricId => {
      analytics.subscribeToMetric(metricId, (metric) => {
        setRealtimeMetrics(prev => new Map(prev).set(metricId, metric));
      });
    });

    // Subscribe to insights
    const unsubscribeInsights = analytics.subscribeToInsights(setInsights);

    return () => {
      analytics.dispose();
      unsubscribeInsights();
    };
  }, [analytics]);

  if (!metrics) return <div>Loading analytics...</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Main metrics display - styled like luxury watch face */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Practice Analytics Dashboard</h1>
        
        {/* Primary subdials */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <WatchSubdial
            title="Daily Production"
            value={realtimeMetrics.get('daily_production')?.value || metrics.financial.dailyProduction.value}
            unit="$"
            change={metrics.financial.dailyProduction.changePercent}
            trend={metrics.financial.dailyProduction.trend}
            min={0}
            max={10000}
            thresholds={[
              { value: 3000, color: '#EF4444' },
              { value: 5000, color: '#F59E0B' },
              { value: 7000, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Chair Utilization"
            value={realtimeMetrics.get('chair_occupancy')?.value || metrics.operational.chairUtilization.value}
            unit="%"
            change={metrics.operational.chairUtilization.changePercent}
            trend={metrics.operational.chairUtilization.trend}
            thresholds={[
              { value: 60, color: '#EF4444' },
              { value: 75, color: '#F59E0B' },
              { value: 85, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Collection Rate"
            value={metrics.financial.collectionRate.value}
            unit="%"
            change={metrics.financial.collectionRate.changePercent}
            trend={metrics.financial.collectionRate.trend}
            thresholds={[
              { value: 85, color: '#EF4444' },
              { value: 92, color: '#F59E0B' },
              { value: 95, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Wait Time"
            value={realtimeMetrics.get('current_wait_time')?.value || metrics.operational.avgWaitTime.value}
            unit="min"
            change={metrics.operational.avgWaitTime.changePercent}
            trend={metrics.operational.avgWaitTime.trend}
            min={0}
            max={30}
            thresholds={[
              { value: 20, color: '#10B981' },
              { value: 15, color: '#F59E0B' },
              { value: 10, color: '#EF4444' }
            ]}
          />
        </div>

        {/* Secondary subdials */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-12">
          <WatchSubdial
            title="No-Show"
            value={metrics.operational.noShowRate.value}
            unit="%"
            size="small"
            min={0}
            max={20}
            thresholds={[
              { value: 15, color: '#10B981' },
              { value: 10, color: '#F59E0B' },
              { value: 5, color: '#EF4444' }
            ]}
          />
          
          <WatchSubdial
            title="New Patients"
            value={metrics.patient.newPatients.value}
            unit=""
            size="small"
            min={0}
            max={50}
            thresholds={[
              { value: 15, color: '#EF4444' },
              { value: 25, color: '#F59E0B' },
              { value: 35, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Retention"
            value={metrics.patient.retentionRate.value}
            unit="%"
            size="small"
            thresholds={[
              { value: 70, color: '#EF4444' },
              { value: 80, color: '#F59E0B' },
              { value: 90, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Case Accept"
            value={metrics.financial.caseAcceptance.value}
            unit="%"
            size="small"
            thresholds={[
              { value: 50, color: '#EF4444' },
              { value: 65, color: '#F59E0B' },
              { value: 80, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Satisfaction"
            value={metrics.patient.satisfactionScore.value}
            unit="/5"
            size="small"
            min={0}
            max={5}
            thresholds={[
              { value: 3.5, color: '#EF4444' },
              { value: 4.0, color: '#F59E0B' },
              { value: 4.5, color: '#10B981' }
            ]}
          />
          
          <WatchSubdial
            title="Productivity"
            value={metrics.operational.staffProductivity.value}
            unit="$"
            size="small"
            min={0}
            max={2000}
            thresholds={[
              { value: 800, color: '#EF4444' },
              { value: 1200, color: '#F59E0B' },
              { value: 1500, color: '#10B981' }
            ]}
          />
        </div>

        {/* Insights complications */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Insights & Alerts</h2>
          {insights.slice(0, 5).map((insight) => (
            <WatchComplication
              key={insight.id}
              insight={insight}
              onDismiss={() => analytics.dismissInsight(insight.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};