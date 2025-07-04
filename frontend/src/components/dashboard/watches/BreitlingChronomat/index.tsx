import React, { useState, useEffect } from 'react';
import type { WatchComponentProps, WatchMetrics } from '../../../../types/watch.types';
import WatchFace from './WatchFace';
import WatchHands from './WatchHands';
import Chronometer from './Chronometer';
import DataDisplay from './DataDisplay';
import './styles.css';

interface BreitlingChronomatProps extends WatchComponentProps {
  metrics: WatchMetrics;
  currentTime: Date;
}

const BreitlingChronomat: React.FC<BreitlingChronomatProps> = ({
  model,
  size = 'medium',
  dataMode,
  realTimeUpdates,
  interactiveMode,
  onModeChange,
  metrics,
  currentTime
}) => {
  const [isChronoRunning, setIsChronoRunning] = useState(false);
  const [chronoStartTime, setChronoStartTime] = useState<number | null>(null);
  const [chronoElapsed, setChronoElapsed] = useState(0);

  const handleChronoStart = () => {
    if (!isChronoRunning) {
      setChronoStartTime(Date.now() - chronoElapsed);
      setIsChronoRunning(true);
    } else {
      setIsChronoRunning(false);
    }
  };

  const handleChronoReset = () => {
    setIsChronoRunning(false);
    setChronoStartTime(null);
    setChronoElapsed(0);
  };

  const handleModeSwitch = () => {
    const modes = ['appointments', 'patients', 'services', 'performance'] as const;
    const currentIndex = modes.indexOf(dataMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onModeChange?.(nextMode);
  };

  // Update chronometer display
  useEffect(() => {
    if (isChronoRunning && chronoStartTime) {
      const interval = setInterval(() => {
        setChronoElapsed(Date.now() - chronoStartTime);
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isChronoRunning, chronoStartTime]);

  return (
    <div className={`breitling-chronomat ${size} ${dataMode}-mode`}>
      <div className="watch-container">
        <WatchFace 
          size={size}
          dataMode={dataMode}
          interactiveMode={interactiveMode}
        />
        
        <WatchHands
          currentTime={currentTime}
          chronoElapsed={chronoElapsed}
          isChronoRunning={isChronoRunning}
          metrics={metrics}
          dataMode={dataMode}
          size={size}
        />

        <Chronometer
          isRunning={isChronoRunning}
          elapsedTime={chronoElapsed}
          onStart={handleChronoStart}
          onReset={handleChronoReset}
          interactiveMode={interactiveMode}
        />

        <DataDisplay
          metrics={metrics}
          dataMode={dataMode}
          onModeSwitch={handleModeSwitch}
          interactiveMode={interactiveMode}
          size={size}
        />
      </div>
    </div>
  );
};

export default BreitlingChronomat;
