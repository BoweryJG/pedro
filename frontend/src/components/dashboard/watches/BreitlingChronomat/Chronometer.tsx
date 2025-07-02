import React from 'react';

interface ChronometerProps {
  isRunning: boolean;
  elapsedTime: number;
  onStart: () => void;
  onReset: () => void;
  interactiveMode: boolean;
}

const Chronometer: React.FC<ChronometerProps> = ({
  isRunning,
  elapsedTime,
  onStart,
  onReset,
  interactiveMode
}) => {
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0')
    };
  };

  const time = formatTime(elapsedTime);

  return (
    <div className="chronometer-overlay">
      {/* Chronometer Controls */}
      {interactiveMode && (
        <>
          {/* Start/Stop Pusher (2 o'clock position) */}
          <button
            className="chrono-pusher start-stop-pusher"
            onClick={onStart}
            style={{
              position: 'absolute',
              right: '10px',
              top: '120px',
              width: '20px',
              height: '30px',
              background: 'linear-gradient(45deg, #e2e8f0, #94a3b8)',
              border: '1px solid #64748b',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
              boxShadow: isRunning ? 'inset 2px 2px 4px rgba(0,0,0,0.3)' : '2px 2px 4px rgba(0,0,0,0.2)'
            }}
            title={isRunning ? 'Stop' : 'Start'}
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#374151',
              fontWeight: 'bold'
            }}>
              {isRunning ? '⏸' : '▶'}
            </div>
          </button>

          {/* Reset Pusher (4 o'clock position) */}
          <button
            className="chrono-pusher reset-pusher"
            onClick={onReset}
            style={{
              position: 'absolute',
              right: '10px',
              top: '250px',
              width: '20px',
              height: '30px',
              background: 'linear-gradient(45deg, #e2e8f0, #94a3b8)',
              border: '1px solid #64748b',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
            title="Reset"
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#374151',
              fontWeight: 'bold'
            }}>
              🔄
            </div>
          </button>
        </>
      )}

      {/* Digital Time Display */}
      <div className="chrono-display" style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#22c55e',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        border: '1px solid #374151',
        minWidth: '80px',
        textAlign: 'center'
      }}>
        {time.minutes}:{time.seconds}.{time.milliseconds}
      </div>

      {/* Status Indicator */}
      {isRunning && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '8px',
          height: '8px',
          background: '#ef4444',
          borderRadius: '50%',
          animation: 'pulse 1s infinite'
        }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .chrono-pusher:hover {
          transform: translateY(1px);
          box-shadow: 1px 1px 2px rgba(0,0,0,0.3) !important;
        }
        
        .chrono-pusher:active {
          transform: translateY(2px);
          box-shadow: inset 2px 2px 4px rgba(0,0,0,0.4) !important;
        }
      `}</style>
    </div>
  );
};

export default Chronometer;
