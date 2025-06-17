import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BackgroundOption, BACKGROUND_OPTIONS, DEFAULT_BACKGROUND, getBackgroundById } from '@/config/backgrounds';

interface BackgroundContextType {
  currentBackground: BackgroundOption;
  setBackground: (backgroundId: string) => void;
  availableBackgrounds: BackgroundOption[];
  preloadNextBackground: (backgroundId: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

const STORAGE_KEY = 'policy-calculator-background';

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [currentBackgroundId, setCurrentBackgroundId] = useState<string>(() => {
    // Load from localStorage or use default
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_BACKGROUND;
    }
    return DEFAULT_BACKGROUND;
  });

  const currentBackground = getBackgroundById(currentBackgroundId) || getBackgroundById(DEFAULT_BACKGROUND)!;
  
  const setBackground = (backgroundId: string) => {
    const newBackground = getBackgroundById(backgroundId);
    if (newBackground) {
      setCurrentBackgroundId(backgroundId);
      localStorage.setItem(STORAGE_KEY, backgroundId);
      
      // Apply CSS class to document body for global background
      document.body.className = document.body.className
        .replace(/\b\w+-bg\b/g, '') // Remove existing background classes
        .trim();
      document.body.classList.add(newBackground.cssClass);
    }
  };

  const preloadNextBackground = (backgroundId: string) => {
    const background = getBackgroundById(backgroundId);
    if (background && background.imagePath) {
      // Preload the image for smooth transitions
      const img = new Image();
      img.src = background.imagePath;
    }
  };

  // Apply initial background class on mount
  useEffect(() => {
    document.body.classList.add(currentBackground.cssClass);
    
    return () => {
      // Cleanup: remove background classes on unmount
      document.body.className = document.body.className
        .replace(/\b\w+-bg\b/g, '')
        .trim();
    };
  }, [currentBackground.cssClass]);

  return (
    <BackgroundContext.Provider
      value={{
        currentBackground,
        setBackground,
        availableBackgrounds: BACKGROUND_OPTIONS,
        preloadNextBackground,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}