import React from 'react';
import type { WatchMetrics, DataMode } from '../../../../types/watch.types';
import { MetricsCalculator } from '../../../../services/analytics/metricsCalculator';

interface WatchHandsProps {
  currentTime: Date;
  chronoElapsed: number;
  isChronoRunning: boolean;
  metrics: WatchMetrics;
  dataMode: DataMode;
}

const WatchHands: React.FC<WatchHandsProps> = ({
  currentTime,
  chronoElapsed,
  isChronoRunning,
  metrics,
  dataMode
}) => {
  const center = 200; // Assuming medium size as default
  const radius = 180;

  // Calculate time-based hand positions
  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();
  const milliseconds = currentTime.getMilliseconds();

  // Convert to angles (0 degrees = 12 o'clock, clockwise)
  const hourAngle = (hours * 30) + (minutes * 0.5);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const secondAngle = (seconds * 6) + (milliseconds * 0.006);

  // Calculate chronometer hand positions
  const chronoSeconds = Math.floor(chronoElapsed / 1000) % 60;
  const chronoMinutes = Math.floor(chronoElapsed / 60000) % 30;
  const chronoHours = Math.floor(chronoElapsed / 3600000) % 12;

  const chronoSecondAngle = chronoSeconds * 6;
  const chronoMinuteAngle = chronoMinutes * 12;
  const chronoHourAngle = chronoHours * 30;

  // Get data-driven hand positions
  const dataValues = MetricsCalculator.metricsToWatchValues(metrics, dataMode);

  // Convert angles to coordinates
  const getHandCoordinates = (angle: number, length: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + length * Math.cos(radian),
      y: center + length * Math.sin(radian)
    };
  };

  const hourHand = getHandCoordinates(hourAngle, radius * 0.5);
  const minuteHand = getHandCoordinates(minuteAngle, radius * 0.7);
  const secondHand = getHandCoordinates(secondAngle, radius * 0.8);

  // Subdial coordinates
  const subdial1Center = { x: center - radius * 0.6, y: center }; // 9 o'clock
  const subdial2Center = { x: center, y: center + radius * 0.6 }; // 6 o'clock
  const subdial3Center = { x: center + radius * 0.6, y: center }; // 3 o'clock

  // Chronometer hands
  const chronoSecondHand = getHandCoordinates(chronoSecondAngle, radius * 0.85);

  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      className="watch-hands-svg"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <linearGradient id="chronoHandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.4"/>
        </filter>
      </defs>

      {/* Main Time Hands */}
      {/* Hour Hand */}
      <line
        x1={center}
        y1={center}
        x2={hourHand.x}
        y2={hourHand.y}
        stroke="url(#handGradient)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#handShadow)"
        style={{
          transition: 'all 0.5s ease-in-out',
          transformOrigin: `${center}px ${center}px`
        }}
      />

      {/* Minute Hand */}
      <line
        x1={center}
        y1={center}
        x2={minuteHand.x}
        y2={minuteHand.y}
        stroke="url(#handGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        filter="url(#handShadow)"
        style={{
          transition: 'all 0.5s ease-in-out',
          transformOrigin: `${center}px ${center}px`
        }}
      />

      {/* Second Hand (also serves as chronometer hand when running) */}
      <line
        x1={center}
        y1={center}
        x2={isChronoRunning ? chronoSecondHand.x : secondHand.x}
        y2={isChronoRunning ? chronoSecondHand.y : secondHand.y}
        stroke={isChronoRunning ? "url(#chronoHandGradient)" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        filter="url(#handShadow)"
        style={{
          transition: isChronoRunning ? 'none' : 'all 0.1s ease-out',
          transformOrigin: `${center}px ${center}px`
        }}
      />

      {/* Data-driven Main Dial Hand (shows primary metric) */}
      {dataValues && (
        <line
          x1={center}
          y1={center}
          x2={center + (radius * 0.6) * Math.cos((dataValues.mainDial * 30 - 90) * Math.PI / 180)}
          y2={center + (radius * 0.6) * Math.sin((dataValues.mainDial * 30 - 90) * Math.PI / 180)}
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
          style={{
            transition: 'all 1s ease-in-out',
            transformOrigin: `${center}px ${center}px`
          }}
        />
      )}

      {/* Subdial Hands */}
      {/* 30-minute Chronometer Hand (9 o'clock) - Data Subdial 1 */}
      <line
        x1={subdial1Center.x}
        y1={subdial1Center.y}
        x2={subdial1Center.x + (radius * 0.15) * Math.cos((chronoMinuteAngle - 90) * Math.PI / 180)}
        y2={subdial1Center.y + (radius * 0.15) * Math.sin((chronoMinuteAngle - 90) * Math.PI / 180)}
        stroke={isChronoRunning ? "url(#chronoHandGradient)" : "#64748b"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transition: 'all 0.3s ease-in-out',
          transformOrigin: `${subdial1Center.x}px ${subdial1Center.y}px`
        }}
      />

      {/* Running Seconds Hand (6 o'clock) */}
      <line
        x1={subdial2Center.x}
        y1={subdial2Center.y}
        x2={subdial2Center.x + (radius * 0.18) * Math.cos((secondAngle - 90) * Math.PI / 180)}
        y2={subdial2Center.y + (radius * 0.18) * Math.sin((secondAngle - 90) * Math.PI / 180)}
        stroke="#64748b"
        strokeWidth="1.5"
        strokeLinecap="round"
        style={{
          transition: 'all 0.1s ease-out',
          transformOrigin: `${subdial2Center.x}px ${subdial2Center.y}px`
        }}
      />

      {/* 12-hour Chronometer Hand (3 o'clock) - Data Subdial 3 */}
      <line
        x1={subdial3Center.x}
        y1={subdial3Center.y}
        x2={subdial3Center.x + (radius * 0.15) * Math.cos((chronoHourAngle - 90) * Math.PI / 180)}
        y2={subdial3Center.y + (radius * 0.15) * Math.sin((chronoHourAngle - 90) * Math.PI / 180)}
        stroke={isChronoRunning ? "url(#chronoHandGradient)" : "#64748b"}
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          transition: 'all 0.3s ease-in-out',
          transformOrigin: `${subdial3Center.x}px ${subdial3Center.y}px`
        }}
      />

      {/* Data-driven Subdial Hands */}
      {dataValues && (
        <>
          {/* Subdial 1 Data Hand */}
          <line
            x1={subdial1Center.x}
            y1={subdial1Center.y}
            x2={subdial1Center.x + (radius * 0.16) * Math.cos((dataValues.subdial1 * 6 - 90) * Math.PI / 180)}
            y2={subdial1Center.y + (radius * 0.16) * Math.sin((dataValues.subdial1 * 6 - 90) * Math.PI / 180)}
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            style={{
              transition: 'all 1s ease-in-out',
              transformOrigin: `${subdial1Center.x}px ${subdial1Center.y}px`
            }}
          />

          {/* Subdial 3 Data Hand */}
          <line
            x1={subdial3Center.x}
            y1={subdial3Center.y}
            x2={subdial3Center.x + (radius * 0.16) * Math.cos((dataValues.subdial3 * 6 - 90) * Math.PI / 180)}
            y2={subdial3Center.y + (radius * 0.16) * Math.sin((dataValues.subdial3 * 6 - 90) * Math.PI / 180)}
            stroke="#16a34a"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
            style={{
              transition: 'all 1s ease-in-out',
              transformOrigin: `${subdial3Center.x}px ${subdial3Center.y}px`
            }}
          />
        </>
      )}

      {/* Center Caps for subdials */}
      <circle
        cx={subdial1Center.x}
        cy={subdial1Center.y}
        r="2"
        fill="#64748b"
      />
      <circle
        cx={subdial2Center.x}
        cy={subdial2Center.y}
        r="2"
        fill="#64748b"
      />
      <circle
        cx={subdial3Center.x}
        cy={subdial3Center.y}
        r="2"
        fill="#64748b"
      />

      {/* Main center cap */}
      <circle
        cx={center}
        cy={center}
        r="4"
        fill="#ffffff"
        stroke="#22c55e"
        strokeWidth="1"
      />
    </svg>
  );
};

export default WatchHands;
