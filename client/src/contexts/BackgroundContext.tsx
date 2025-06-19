import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BACKGROUND_REGISTRY, 
  DEFAULT_BACKGROUND_ID, 
  getAllCategories, 
  getBackgroundById,
  getBackgroundsByCategory,
  type BackgroundAsset 
} from '../config/backgrounds';
import { getImagePath } from '../utils/image-loader';

interface BackgroundContextType {
  currentBackground: BackgroundAsset;
  setBackground: (background: BackgroundAsset) => void;
  backgroundAssets: BackgroundAsset[];
  categories: BackgroundAsset['category'][];
  getBackgroundsByCategory: (category: BackgroundAsset['category']) => BackgroundAsset[];
  preloadBackground: (background: BackgroundAsset) => Promise<void>;
  backgroundLuminance: number;
  isLightBackground: boolean;
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

  const [backgroundLuminance, setBackgroundLuminance] = useState<number>(0.3); // Default to dark
  const [isLightBackground, setIsLightBackground] = useState<boolean>(false);

  const categories = getAllCategories();

  // Calculate background luminance for adaptive contrast
  const calculateLuminance = async (imagePath: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(0.3); // Default to dark
            return;
          }

          canvas.width = 100; // Sample size for performance
          canvas.height = 100;
          ctx.drawImage(img, 0, 0, 100, 100);
          
          const imageData = ctx.getImageData(0, 0, 100, 100);
          const data = imageData.data;
          
          let totalLuminance = 0;
          const pixelCount = data.length / 4;
          
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            
            // Calculate relative luminance using sRGB formula
            const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            totalLuminance += luminance;
          }
          
          const avgLuminance = totalLuminance / pixelCount;
          resolve(avgLuminance);
        } catch (error) {
          console.warn('Could not calculate luminance, using default');
          resolve(0.3);
        }
      };
      
      img.onerror = () => resolve(0.3);
      img.src = imagePath;
    });
  };

  const setBackground = async (background: BackgroundAsset) => {
    setCurrentBackground(background);
    localStorage.setItem('selectedBackground', JSON.stringify(background));
    
    // Calculate luminance for adaptive theming
    const imagePath = getImagePath(background.path);
    const luminance = await calculateLuminance(imagePath);
    setBackgroundLuminance(luminance);
    setIsLightBackground(luminance > 0.5);
  };

  const preloadBackground = async (background: BackgroundAsset): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Could not preload background: ${background.name}. Continuing anyway.`);
        resolve(); // Resolve instead of reject to prevent blocking
      };
      
      img.src = getImagePath(background.path);
    });
  };

  // Apply background and adaptive styles to document root
  useEffect(() => {
    const applyBackground = async () => {
      const root = document.documentElement;
      const imagePath = getImagePath(currentBackground.path);
      
      // Calculate luminance if not already done
      if (backgroundLuminance === 0.3) {
        const luminance = await calculateLuminance(imagePath);
        setBackgroundLuminance(luminance);
        setIsLightBackground(luminance > 0.5);
      }
      
      // Apply background with CSS custom properties
      root.style.setProperty('--background-image', `url('${imagePath}')`);
      root.style.setProperty('--background-name', `"${currentBackground.name}"`);
      root.style.setProperty('--background-luminance', backgroundLuminance.toString());
      
      // Adaptive contrast variables
      if (isLightBackground) {
        // Light background - use dark text and stronger glass
        root.style.setProperty('--adaptive-text-color', '#1a1a1a');
        root.style.setProperty('--adaptive-text-shadow', '0 1px 3px rgba(255, 255, 255, 0.8)');
        root.style.setProperty('--adaptive-glass-bg', 'rgba(255, 255, 255, 0.25)');
        root.style.setProperty('--adaptive-glass-border', 'rgba(255, 255, 255, 0.4)');
        root.style.setProperty('--adaptive-glass-blur', '16px');
        root.classList.add('light-background');
        root.classList.remove('dark-background');
      } else {
        // Dark background - use light text and subtle glass
        root.style.setProperty('--adaptive-text-color', '#ffffff');
        root.style.setProperty('--adaptive-text-shadow', '0 2px 8px rgba(0, 0, 0, 0.8)');
        root.style.setProperty('--adaptive-glass-bg', 'rgba(255, 255, 255, 0.08)');
        root.style.setProperty('--adaptive-glass-border', 'rgba(255, 255, 255, 0.15)');
        root.style.setProperty('--adaptive-glass-blur', '20px');
        root.classList.add('dark-background');
        root.classList.remove('light-background');
      }
      
      // Add background class to body for CSS targeting
      document.body.className = document.body.className.replace(/bg-\w+/g, '');
      document.body.classList.add(`bg-${currentBackground.category}`);
    };

    applyBackground();
  }, [currentBackground, backgroundLuminance, isLightBackground]);

  const value: BackgroundContextType = {
    currentBackground,
    setBackground,
    backgroundAssets: BACKGROUND_REGISTRY,
    categories,
    getBackgroundsByCategory,
    preloadBackground,
    backgroundLuminance,
    isLightBackground
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