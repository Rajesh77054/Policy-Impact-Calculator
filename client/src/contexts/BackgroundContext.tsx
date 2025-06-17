import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BACKGROUND_REGISTRY, 
  DEFAULT_BACKGROUND_ID, 
  getAllCategories, 
  getBackgroundById,
  getBackgroundsByCategory,
  type BackgroundAsset 
} from '../config/backgrounds';

interface BackgroundContextType {
  currentBackground: BackgroundAsset;
  setBackground: (background: BackgroundAsset) => void;
  backgroundAssets: BackgroundAsset[];
  categories: BackgroundAsset['category'][];
  getBackgroundsByCategory: (category: BackgroundAsset['category']) => BackgroundAsset[];
  preloadBackground: (background: BackgroundAsset) => Promise<void>;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: React.ReactNode;
  defaultBackground?: string; // background id
}

export function BackgroundProvider({ children, defaultBackground = DEFAULT_BACKGROUND_ID }: BackgroundProviderProps) {
  const [currentBackground, setCurrentBackground] = useState<BackgroundAsset>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('selectedBackground');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = getBackgroundById(parsed.id);
        if (found) return found;
      } catch {
        // Fall through to default
      }
    }
    // Default background
    return getBackgroundById(defaultBackground) || BACKGROUND_REGISTRY[0];
  });

  const categories = getAllCategories();

  const setBackground = (background: BackgroundAsset) => {
    setCurrentBackground(background);
    localStorage.setItem('selectedBackground', JSON.stringify(background));
  };

  const preloadBackground = async (background: BackgroundAsset): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load background: ${background.name}`));
      
      img.src = background.path;
    });
  };

  // Apply background to document root
  useEffect(() => {
    const applyBackground = () => {
      const root = document.documentElement;
      const imagePath = currentBackground.path;
      
      // Apply background with CSS custom properties
      root.style.setProperty('--background-image', `url('${imagePath}')`);
      root.style.setProperty('--background-name', `"${currentBackground.name}"`);
      
      // Add background class to body for CSS targeting
      document.body.className = document.body.className.replace(/bg-\w+/g, '');
      document.body.classList.add(`bg-${currentBackground.category}`);
    };

    applyBackground();
  }, [currentBackground]);

  const value: BackgroundContextType = {
    currentBackground,
    setBackground,
    backgroundAssets: BACKGROUND_REGISTRY,
    categories,
    getBackgroundsByCategory,
    preloadBackground
  };

  return (
    <BackgroundContext.Provider value={value}>
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