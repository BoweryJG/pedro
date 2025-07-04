import React from 'react';
import type { WatchMetrics, DataMode } from '../../../../types/watch.types';
import { MetricsCalculator } from '../../../../services/analytics/metricsCalculator';

interface WatchHandsProps {
  currentTime: Date;
  chronoElapsed: number;
  isChronoRunning: boolean;
  metrics: WatchMetrics;
  dataMode: DataMode;
  size: 'small' | 'medium' | 'large';
}

const WatchHands: React.FC<WatchHandsProps> = ({ 
  currentTime, 
  chronoElapsed, 
  isChronoRunning,
  metrics,
  dataMode,
  size 
}) => {
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  const sizeMap = {
    small: 300,
    medium: 400,
    large: 500
  };
  
  const diameter = sizeMap[size];
  const radius = diameter / 2;
  const center = radius;

  // Calculate angles for time hands
  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + milliseconds / 1000) * 6;

  // Calculate chronometer positions
  const chronoSeconds = (chronoElapsed / 1000) % 60;
  const chronoMinutes = Math.floor(chronoElapsed / 60000) % 30;
  const chronoHours = Math.floor(chronoElapsed / 3600000) % 12;

  const chronoSecondAngle = chronoSeconds * 6;
  const chronoMinuteAngle = chronoMinutes * 12;
  const chronoHourAngle = chronoHours * 30;

  // Get data-driven values
  const dataValues = MetricsCalculator.metricsToWatchValues(metrics, dataMode);

  // Convert angles to coordinates with safety check
  const getHandCoordinates = (angle: number, length: number) => {
    const safeAngle = isNaN(angle) ? 0 : angle;
    const radian = (safeAngle - 90) * (Math.PI / 180);
    return {
      x: center + length * Math.cos(radian),
      y: center + length * Math.sin(radian)
    };
  };

  // Main hands
  const hourHand = getHandCoordinates(hourAngle, radius * 0.5);
  const minuteHand = getHandCoordinates(minuteAngle, radius * 0.65);
  const secondHand = getHandCoordinates(secondAngle, radius * 0.75);

  // Subdial positions (matching WatchFace layout)
  const subdialPositions = [
    { cx: center - radius * 0.5, cy: center - radius * 0.2 }, // Left subdial
    { cx: center + radius * 0.5, cy: center - radius * 0.2 }, // Right subdial
    { cx: center, cy: center + radius * 0.45 } // Bottom subdial
  ];

  // Data hands for subdials
  const subdialRadius = radius * 0.25;
  const getSubdialHand = (value: number, max: number, subdialCenter: { cx: number; cy: number }) => {
    const percentage = Math.min(value / max, 1);
    const angle = percentage * 270 - 135; // -135 to 135 degrees
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: subdialCenter.cx + (subdialRadius * 0.7) * Math.cos(radian),
      y: subdialCenter.cy + (subdialRadius * 0.7) * Math.sin(radian)
    };
  };

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      className="watch-hands-svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Elegant hand gradients */}
        <linearGradient id="elegantHandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Glowing green gradient for real-time indicators */}
        <linearGradient id="glowingGreenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        {/* Electric blue gradient for data */}
        <linearGradient id="electricBlueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Hand shadow filter */}
        <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.3"/>
        </filter>

        {/* Glow filter */}
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Main Time Hands */}
      
      {/* Hour Hand - Elegant mechanical style */}
      <g filter="url(#handShadow)">
        <line
          x1={center}
          y1={center}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke="url(#elegantHandGradient)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx={hourHand.x} cy={hourHand.y} r="3" fill="#f8fafc" />
      </g>

      {/* Minute Hand - Sleek and precise */}
      <g filter="url(#handShadow)">
        <line
          x1={center}
          y1={center}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke="url(#elegantHandGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx={minuteHand.x} cy={minuteHand.y} r="2" fill="#f8fafc" />
      </g>

      {/* Second Hand - Glowing green real-time indicator */}
      <g filter="url(#glowFilter)">
        {/* Thicker base section */}
        <line
          x1={center}
          y1={center}
          x2={center + (secondHand.x - center) * 0.2}
          y2={center + (secondHand.y - center) * 0.2}
          stroke="url(#glowingGreenGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Main needle section */}
        <line
          x1={center + (secondHand.x - center) * 0.15}
          y1={center + (secondHand.y - center) * 0.15}
          x2={secondHand.x}
          y2={secondHand.y}
          stroke="url(#glowingGreenGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Small counterweight */}
        <line
          x1={center}
          y1={center}
          x2={center - (secondHand.x - center) * 0.15}
          y2={center - (secondHand.y - center) * 0.15}
          stroke="url(#glowingGreenGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>

      {/* Subdial Hands */}
      
      {/* Left Subdial - Upcoming Appointments */}
      {dataValues && (
        <g>
          <line
            x1={subdialPositions[0].cx}
            y1={subdialPositions[0].cy}
            x2={getSubdialHand(dataValues.subdial1, 10, subdialPositions[0]).x}
            y2={getSubdialHand(dataValues.subdial1, 10, subdialPositions[0]).y}
            stroke="url(#electricBlueGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />
          <text
            x={subdialPositions[0].cx}
            y={subdialPositions[0].cy + 5}
            textAnchor="middle"
            fill="#0ea5e9"
            fontSize="16"
            fontWeight="bold"
            fontFamily="'Helvetica Neue', sans-serif"
          >
            {Math.round(dataValues.subdial1)}
          </text>
        </g>
      )}

      {/* Right Subdial - Average Duration */}
      {dataValues && (
        <g>
          <line
            x1={subdialPositions[1].cx}
            y1={subdialPositions[1].cy}
            x2={getSubdialHand(dataValues.subdial2, 120, subdialPositions[1]).x}
            y2={getSubdialHand(dataValues.subdial2, 120, subdialPositions[1]).y}
            stroke="url(#electricBlueGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />
          <text
            x={subdialPositions[1].cx}
            y={subdialPositions[1].cy + 5}
            textAnchor="middle"
            fill="#0ea5e9"
            fontSize="16"
            fontWeight="bold"
            fontFamily="'Helvetica Neue', sans-serif"
          >
            {Math.round(dataValues.subdial2)}m
          </text>
        </g>
      )}

      {/* Bottom Subdial - Completion Percentage */}
      {dataValues && (
        <g>
          <line
            x1={subdialPositions[2].cx}
            y1={subdialPositions[2].cy}
            x2={getSubdialHand(dataValues.subdial3, 100, subdialPositions[2]).x}
            y2={getSubdialHand(dataValues.subdial3, 100, subdialPositions[2]).y}
            stroke="url(#glowingGreenGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            filter="url(#glowFilter)"
          />
          <text
            x={subdialPositions[2].cx}
            y={subdialPositions[2].cy + 5}
            textAnchor="middle"
            fill="#22c55e"
            fontSize="16"
            fontWeight="bold"
            fontFamily="'Helvetica Neue', sans-serif"
          >
            {Math.round(dataValues.subdial3)}%
          </text>
        </g>
      )}

      {/* Center cap with luxury finish */}
      <g filter="url(#handShadow)">
        <circle cx={center} cy={center} r="10" fill="#374151" />
        <circle cx={center} cy={center} r="8" fill="#1f2937" />
        <circle cx={center} cy={center} r="4" fill="#00ff88" filter="url(#glowFilter)" />
      </g>

      {/* Chrono indicator (if running) */}
      {isChronoRunning && (
        <circle
          cx={center}
          cy={center - radius * 0.85}
          r="3"
          fill="#ef4444"
          filter="url(#glowFilter)"
          className="pulse-animation"
        />
      )}
    </svg>
  );
};

export default WatchHands;