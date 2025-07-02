import React from 'react';
import { DataMode } from '../../../../types/watch.types';

interface WatchFaceProps {
  size: 'small' | 'medium' | 'large';
  dataMode: DataMode;
  interactiveMode: boolean;
}

const WatchFace: React.FC<WatchFaceProps> = ({ size, dataMode, interactiveMode }) => {
  const sizeMap = {
    small: { width: 300, height: 300 },
    medium: { width: 400, height: 400 },
    large: { width: 500, height: 500 }
  };

  const dimensions = sizeMap[size];
  const center = dimensions.width / 2;
  const radius = dimensions.width * 0.45;
  const bezelRadius = dimensions.width * 0.48;

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className="watch-face-svg"
    >
      <defs>
        {/* Gradients for realistic metallic effects */}
        <radialGradient id="caseGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#f8f9fa" />
          <stop offset="30%" stopColor="#e9ecef" />
          <stop offset="70%" stopColor="#adb5bd" />
          <stop offset="100%" stopColor="#6c757d" />
        </radialGradient>

        <radialGradient id="bezelGradient" cx="0.3" cy="0.3">
          <stop offset="0%" stopColor="#f1f3f4" />
          <stop offset="50%" stopColor="#dee2e6" />
          <stop offset="100%" stopColor="#9ca3af" />
        </radialGradient>

        <radialGradient id="dialGradient" cx="0.5" cy="0.3">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>

        <linearGradient id="subdialGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>

        {/* Filter for realistic shadows */}
        <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>

        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="1" dy="1" result="offset"/>
          <feFlood floodColor="#000000" floodOpacity="0.2"/>
          <feComposite in2="offset" operator="in"/>
        </filter>
      </defs>

      {/* Watch Case */}
      <circle
        cx={center}
        cy={center}
        r={bezelRadius}
        fill="url(#caseGradient)"
        stroke="#6c757d"
        strokeWidth="2"
        filter="url(#dropShadow)"
      />

      {/* Tachymeter Bezel */}
      <circle
        cx={center}
        cy={center}
        r={bezelRadius - 10}
        fill="url(#bezelGradient)"
        stroke="#495057"
        strokeWidth="1"
      />

      {/* Tachymeter Scale Markings */}
      {[...Array(60)].map((_, i) => {
        const angle = (i * 6) * (Math.PI / 180);
        const innerR = bezelRadius - 20;
        const outerR = bezelRadius - 15;
        const x1 = center + innerR * Math.cos(angle - Math.PI / 2);
        const y1 = center + innerR * Math.sin(angle - Math.PI / 2);
        const x2 = center + outerR * Math.cos(angle - Math.PI / 2);
        const y2 = center + outerR * Math.sin(angle - Math.PI / 2);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#343a40"
            strokeWidth={i % 5 === 0 ? "2" : "1"}
          />
        );
      })}

      {/* Tachymeter Numbers */}
      {[500, 400, 300, 250, 200, 180, 150, 120, 100, 90, 80, 75, 70, 65, 60].map((num, i) => {
        const angle = (i * 24) * (Math.PI / 180);
        const textR = bezelRadius - 25;
        const x = center + textR * Math.cos(angle - Math.PI / 2);
        const y = center + textR * Math.sin(angle - Math.PI / 2);

        return (
          <text
            key={num}
            x={x}
            y={y + 4}
            textAnchor="middle"
            fontSize="8"
            fill="#343a40"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            {num}
          </text>
        );
      })}

      {/* Main Dial */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="url(#dialGradient)"
        stroke="#15803d"
        strokeWidth="1"
        filter="url(#innerShadow)"
      />

      {/* Hour Markers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const markerLength = i % 3 === 0 ? 20 : 15;
        const innerR = radius - markerLength;
        const outerR = radius - 5;
        const x1 = center + innerR * Math.cos(angle - Math.PI / 2);
        const y1 = center + innerR * Math.sin(angle - Math.PI / 2);
        const x2 = center + outerR * Math.cos(angle - Math.PI / 2);
        const y2 = center + outerR * Math.sin(angle - Math.PI / 2);

        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#ffffff"
            strokeWidth={i % 3 === 0 ? "4" : "2"}
            strokeLinecap="round"
          />
        );
      })}

      {/* Hour Numbers */}
      {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const textR = radius - 35;
        const x = center + textR * Math.cos(angle - Math.PI / 2);
        const y = center + textR * Math.sin(angle - Math.PI / 2);

        return (
          <text
            key={num}
            x={x}
            y={y + 6}
            textAnchor="middle"
            fontSize="16"
            fill="#ffffff"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            {num}
          </text>
        );
      })}

      {/* Subdials */}
      {/* 30-minute Chronometer (9 o'clock) */}
      <circle
        cx={center - radius * 0.6}
        cy={center}
        r={radius * 0.25}
        fill="url(#subdialGradient)"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Running Seconds (6 o'clock) */}
      <circle
        cx={center}
        cy={center + radius * 0.6}
        r={radius * 0.25}
        fill="url(#subdialGradient)"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* 12-hour Chronometer (3 o'clock) */}
      <circle
        cx={center + radius * 0.6}
        cy={center}
        r={radius * 0.25}
        fill="url(#subdialGradient)"
        stroke="#cbd5e1"
        strokeWidth="1"
      />

      {/* Subdial Markings */}
      {/* 30-minute subdial markings */}
      {[...Array(30)].map((_, i) => {
        const angle = (i * 12) * (Math.PI / 180);
        const subdialCenter = { x: center - radius * 0.6, y: center };
        const subdialRadius = radius * 0.25;
        const innerR = subdialRadius - 8;
        const outerR = subdialRadius - 3;
        const x1 = subdialCenter.x + innerR * Math.cos(angle - Math.PI / 2);
        const y1 = subdialCenter.y + innerR * Math.sin(angle - Math.PI / 2);
        const x2 = subdialCenter.x + outerR * Math.cos(angle - Math.PI / 2);
        const y2 = subdialCenter.y + outerR * Math.sin(angle - Math.PI / 2);

        return (
          <line
            key={`chrono30-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#64748b"
            strokeWidth={i % 5 === 0 ? "2" : "1"}
          />
        );
      })}

      {/* Breitling Logo */}
      <text
        x={center}
        y={center - radius * 0.3}
        textAnchor="middle"
        fontSize="12"
        fill="#ffffff"
        fontFamily="serif"
        fontWeight="bold"
      >
        BREITLING
      </text>

      <text
        x={center}
        y={center - radius * 0.2}
        textAnchor="middle"
        fontSize="8"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
      >
        CHRONOMAT
      </text>

      {/* Data Mode Indicator */}
      <text
        x={center}
        y={center + radius * 0.2}
        textAnchor="middle"
        fontSize="10"
        fill="#ffffff"
        fontFamily="Arial, sans-serif"
        className={`mode-indicator ${dataMode}`}
      >
        {dataMode.toUpperCase()}
      </text>

      {/* Date Window */}
      <rect
        x={center + radius * 0.3}
        y={center - 8}
        width="24"
        height="16"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="1"
        rx="2"
      />

      <text
        x={center + radius * 0.3 + 12}
        y={center + 4}
        textAnchor="middle"
        fontSize="10"
        fill="#1f2937"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        {new Date().getDate()}
      </text>

      {/* Crown */}
      <rect
        x={center + bezelRadius}
        y={center - 6}
        width="8"
        height="12"
        fill="url(#caseGradient)"
        stroke="#6c757d"
        strokeWidth="1"
        rx="2"
        className={interactiveMode ? "interactive-crown" : ""}
      />

      {/* Pushers */}
      <rect
        x={center + bezelRadius}
        y={center - 25}
        width="6"
        height="8"
        fill="url(#caseGradient)"
        stroke="#6c757d"
        strokeWidth="1"
        rx="2"
        className={interactiveMode ? "interactive-pusher" : ""}
      />

      <rect
        x={center + bezelRadius}
        y={center + 17}
        width="6"
        height="8"
        fill="url(#caseGradient)"
        stroke="#6c757d"
        strokeWidth="1"
        rx="2"
        className={interactiveMode ? "interactive-pusher" : ""}
      />

      {/* Center Dot */}
      <circle
        cx={center}
        cy={center}
        r="3"
        fill="#ffffff"
        stroke="#22c55e"
        strokeWidth="1"
      />
    </svg>
  );
};

export default WatchFace;
