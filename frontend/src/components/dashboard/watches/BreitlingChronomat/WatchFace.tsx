import React from 'react';
import type { DataMode } from '../../../../types/watch.types';

interface WatchFaceProps {
  size: 'small' | 'medium' | 'large';
  dataMode: DataMode;
  interactiveMode: boolean;
}

const WatchFace: React.FC<WatchFaceProps> = ({ size, dataMode, interactiveMode }) => {
  const sizeMap = {
    small: 300,
    medium: 400,
    large: 500
  };

  const diameter = sizeMap[size];
  const radius = diameter / 2;
  const center = radius;

  // Define subdial positions (floating symmetrically)
  const subdialRadius = radius * 0.25;
  const subdialPositions = [
    { cx: center - radius * 0.5, cy: center - radius * 0.2, label: 'UPCOMING' }, // Left subdial
    { cx: center + radius * 0.5, cy: center - radius * 0.2, label: 'DURATION' }, // Right subdial
    { cx: center, cy: center + radius * 0.45, label: 'COMPLETION' } // Bottom subdial
  ];

  return (
    <svg
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      className="watch-face-svg"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        {/* Dark navy gradient background */}
        <radialGradient id="bgGradient">
          <stop offset="0%" stopColor="#1a2942" />
          <stop offset="70%" stopColor="#0f1824" />
          <stop offset="100%" stopColor="#050a12" />
        </radialGradient>

        {/* Brushed steel texture effect */}
        <pattern id="brushedSteel" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="1" fill="#d1d5db" opacity="0.1" />
          <rect y="2" width="4" height="1" fill="#e5e7eb" opacity="0.05" />
        </pattern>

        {/* Soft glow filter */}
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* LED ring glow */}
        <filter id="ledGlow">
          <feGaussianBlur stdDeviation="2" result="glow"/>
          <feFlood floodColor="#00ff88" floodOpacity="0.6"/>
          <feComposite in2="glow" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Glass reflection */}
        <linearGradient id="glassReflection" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.2" />
          <stop offset="50%" stopColor="white" stopOpacity="0.05" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main background with soft glow edges */}
      <circle
        cx={center}
        cy={center}
        r={radius - 5}
        fill="url(#bgGradient)"
        filter="url(#softGlow)"
      />

      {/* Outer bezel with micro-screws */}
      <g className="bezel">
        {/* Beveled outer ring */}
        <circle
          cx={center}
          cy={center}
          r={radius - 2}
          fill="none"
          stroke="#434956"
          strokeWidth="4"
          opacity="0.8"
        />
        <circle
          cx={center}
          cy={center}
          r={radius - 8}
          fill="none"
          stroke="#2a3140"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Micro-screws at cardinal points */}
        {[0, 90, 180, 270].map((angle) => {
          const screwX = center + (radius - 12) * Math.cos((angle - 90) * Math.PI / 180);
          const screwY = center + (radius - 12) * Math.sin((angle - 90) * Math.PI / 180);
          return (
            <g key={angle} className="bezel-screw">
              <circle cx={screwX} cy={screwY} r="3" fill="#6b7280" />
              <circle cx={screwX} cy={screwY} r="2" fill="#374151" />
              <line
                x1={screwX - 1.5}
                y1={screwY}
                x2={screwX + 1.5}
                y2={screwY}
                stroke="#1f2937"
                strokeWidth="0.5"
              />
            </g>
          );
        })}
      </g>

      {/* Main dial with brushed steel texture */}
      <circle
        cx={center}
        cy={center}
        r={radius - 20}
        fill="url(#brushedSteel)"
        opacity="0.3"
      />

      {/* Hour markers with luminous effect */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const isCardinal = i % 3 === 0;
        const markerLength = isCardinal ? radius * 0.08 : radius * 0.05;
        const innerRadius = radius - 30;
        const outerRadius = innerRadius - markerLength;

        return (
          <g key={i}>
            <line
              x1={center + innerRadius * Math.cos(angle)}
              y1={center + innerRadius * Math.sin(angle)}
              x2={center + outerRadius * Math.cos(angle)}
              y2={center + outerRadius * Math.sin(angle)}
              stroke={isCardinal ? "#00ff88" : "#e5e7eb"}
              strokeWidth={isCardinal ? "3" : "1.5"}
              strokeLinecap="round"
              filter={isCardinal ? "url(#ledGlow)" : "none"}
              opacity={isCardinal ? 0.9 : 0.6}
            />
            {/* Luminous dots for cardinal points */}
            {isCardinal && (
              <circle
                cx={center + (outerRadius - 5) * Math.cos(angle)}
                cy={center + (outerRadius - 5) * Math.sin(angle)}
                r="2"
                fill="#00ff88"
                filter="url(#ledGlow)"
              />
            )}
          </g>
        );
      })}

      {/* Subdials with LED rings */}
      {subdialPositions.map((subdial, index) => (
        <g key={index} className="floating-subdial">
          {/* LED ring background */}
          <circle
            cx={subdial.cx}
            cy={subdial.cy}
            r={subdialRadius + 3}
            fill="none"
            stroke="#00ff88"
            strokeWidth="1"
            opacity="0.2"
            filter="url(#ledGlow)"
          />
          
          {/* Subdial background */}
          <circle
            cx={subdial.cx}
            cy={subdial.cy}
            r={subdialRadius}
            fill="#0a0f1a"
            stroke="#2a3140"
            strokeWidth="1"
          />

          {/* Subdial markers */}
          {[0, 90, 180, 270].map((angle) => {
            const markerAngle = (angle - 90) * (Math.PI / 180);
            const innerR = subdialRadius - 5;
            const outerR = subdialRadius - 10;
            return (
              <line
                key={angle}
                x1={subdial.cx + innerR * Math.cos(markerAngle)}
                y1={subdial.cy + innerR * Math.sin(markerAngle)}
                x2={subdial.cx + outerR * Math.cos(markerAngle)}
                y2={subdial.cy + outerR * Math.sin(markerAngle)}
                stroke="#4ade80"
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}

          {/* Subdial label */}
          <text
            x={subdial.cx}
            y={subdial.cy + subdialRadius + 15}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontFamily="'Helvetica Neue', sans-serif"
            fontWeight="300"
            letterSpacing="1.5"
          >
            {subdial.label}
          </text>
        </g>
      ))}

      {/* Digital chrono-timer at 6 o'clock */}
      <g className="digital-display digital-timer">
        <rect
          x={center - 40}
          y={center + radius * 0.15}
          width="80"
          height="25"
          rx="3"
          fill="#0a0f1a"
          stroke="#2a3140"
          strokeWidth="1"
        />
        <text
          x={center}
          y={center + radius * 0.15 + 17}
          textAnchor="middle"
          fill="#00ff88"
          fontSize="14"
          fontFamily="monospace"
          fontWeight="bold"
          filter="url(#ledGlow)"
        >
          {new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
          })}
        </text>
      </g>

      {/* Center pivot with beveled effect */}
      <circle cx={center} cy={center} r="8" fill="#374151" />
      <circle cx={center} cy={center} r="6" fill="#1f2937" />
      <circle cx={center} cy={center} r="3" fill="#00ff88" filter="url(#ledGlow)" />

      {/* Glass overlay with reflection */}
      <circle
        cx={center}
        cy={center}
        r={radius - 25}
        fill="url(#glassReflection)"
        opacity="0.3"
        pointerEvents="none"
      />

      {/* Data mode indicator */}
      <text
        x={center}
        y={center - radius * 0.5}
        textAnchor="middle"
        fill="#64748b"
        fontSize="11"
        fontFamily="'Helvetica Neue', sans-serif"
        fontWeight="500"
        letterSpacing="2"
        opacity="0.8"
      >
        {dataMode.toUpperCase()}
      </text>

      {/* Interactive mode indicator */}
      {interactiveMode && (
        <circle
          cx={center + radius * 0.7}
          cy={center - radius * 0.7}
          r="5"
          fill="#00ff88"
          filter="url(#ledGlow)"
          className="pulse-animation"
        />
      )}
    </svg>
  );
};

export default WatchFace;