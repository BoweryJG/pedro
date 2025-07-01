import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type NavigationMode = 'minimal' | 'exploring' | 'center-focused' | 'emergency';
type CenterType = 'tmj' | 'implants' | 'robotic' | 'medspa' | 'aboutface' | null;

interface AdaptiveNavigationContextType {
  mode: NavigationMode;
  setMode: (mode: NavigationMode) => void;
  currentCenter: CenterType;
  setCurrentCenter: (center: CenterType) => void;
  showCenterSelector: boolean;
  setShowCenterSelector: (show: boolean) => void;
  userJourneyPath: string[];
  addToJourneyPath: (path: string) => void;
  resetJourney: () => void;
}

const AdaptiveNavigationContext = createContext<AdaptiveNavigationContextType | undefined>(undefined);

export const useAdaptiveNavigation = () => {
  const context = useContext(AdaptiveNavigationContext);
  if (!context) {
    throw new Error('useAdaptiveNavigation must be used within AdaptiveNavigationProvider');
  }
  return context;
};

interface AdaptiveNavigationProviderProps {
  children: ReactNode;
}

export const AdaptiveNavigationProvider: React.FC<AdaptiveNavigationProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<NavigationMode>('minimal');
  const [currentCenter, setCurrentCenter] = useState<CenterType>(null);
  const [showCenterSelector, setShowCenterSelector] = useState(false);
  const [userJourneyPath, setUserJourneyPath] = useState<string[]>([]);

  const addToJourneyPath = useCallback((path: string) => {
    setUserJourneyPath(prev => [...prev, path]);
  }, []);

  const resetJourney = useCallback(() => {
    setMode('minimal');
    setCurrentCenter(null);
    setShowCenterSelector(false);
    setUserJourneyPath([]);
  }, []);

  const value = {
    mode,
    setMode,
    currentCenter,
    setCurrentCenter,
    showCenterSelector,
    setShowCenterSelector,
    userJourneyPath,
    addToJourneyPath,
    resetJourney,
  };

  return (
    <AdaptiveNavigationContext.Provider value={value}>
      {children}
    </AdaptiveNavigationContext.Provider>
  );
};