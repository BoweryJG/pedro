import { useState, useEffect, useRef } from 'react';

export const useWatchTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Update time every 50ms for smooth second hand movement
    intervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 50);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return currentTime;
};

export const useChronometer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsedTime);
      setIsRunning(true);
    }
  };

  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
    setLapTimes([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const lap = () => {
    if (isRunning && elapsedTime > 0) {
      setLapTimes(prev => [...prev, elapsedTime]);
    }
  };

  const toggle = () => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  };

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  return {
    isRunning,
    elapsedTime,
    lapTimes,
    start,
    stop,
    reset,
    lap,
    toggle
  };
};

export const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);
  
  return {
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: ms.toString().padStart(2, '0'),
    formatted: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  };
};

export const calculateHandAngles = (time: Date) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();

  // Calculate angles (0 degrees = 12 o'clock, clockwise)
  const hourAngle = (hours * 30) + (minutes * 0.5) + (seconds * 0.00833);
  const minuteAngle = (minutes * 6) + (seconds * 0.1) + (milliseconds * 0.0001);
  const secondAngle = (seconds * 6) + (milliseconds * 0.006);

  return {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle
  };
};

export const getHandCoordinates = (
  angle: number, 
  length: number, 
  centerX: number = 200, 
  centerY: number = 200
) => {
  const radian = (angle - 90) * (Math.PI / 180);
  return {
    x: centerX + length * Math.cos(radian),
    y: centerY + length * Math.sin(radian)
  };
};
