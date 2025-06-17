import React, { createContext, useContext, useState, useEffect } from 'react';

// Background configuration interface
export interface BackgroundAsset {
  id: string;
  name: string;
  path: string;
  category: 'cyberpunk' | 'nature' | 'abstract' | 'space' | 'minimal';
  description?: string;
}

// Available background assets from your attached_assets folder
export const BACKGROUND_ASSETS: BackgroundAsset[] = [
  {
    id: 'cyberpunk-dream',
    name: 'Cyberpunk Dream',
    path: '/cyberpunk-dream.png',
    category: 'cyberpunk',
    description: 'Neon-lit cyberpunk cityscape'
  },
  {
    id: 'img-9246',
    name: 'Canyon Vista',
    path: '@assets/IMG_9246_1749918203092.png',
    category: 'nature',
    description: 'Desert canyon landscape'
  },
  {
    id: 'img-9247',
    name: 'Mountain Range',
    path: '@assets/IMG_9247_1749920069951.png',
    category: 'nature',
    description: 'Majestic mountain peaks'
  },
  {
    id: 'img-9248',
    name: 'Coastal Cliffs',
    path: '@assets/IMG_9248_1749920940698.png',
    category: 'nature',
    description: 'Dramatic ocean cliffs'
  },
  {
    id: 'img-9249',
    name: 'Forest Path',
    path: '@assets/IMG_9249_1749923572023.png',
    category: 'nature',
    description: 'Serene forest pathway'
  },
  {
    id: 'img-9250',
    name: 'Aurora Sky',
    path: '@assets/IMG_9250_1749936642340.png',
    category: 'space',
    description: 'Northern lights display'
  },
  {
    id: 'img-9254',
    name: 'City Lights',
    path: '@assets/IMG_9254_1750004329663.png',
    category: 'abstract',
    description: 'Urban nighttime glow'
  },
  {
    id: 'img-9255',
    name: 'Golden Hour',
    path: '@assets/IMG_9255_1750005438271.png',
    category: 'nature',
    description: 'Warm sunset ambiance'
  },
  {
    id: 'img-9280',
    name: 'Tech Grid',
    path: '@assets/IMG_9280_1750180496772.png',
    category: 'cyberpunk',
    description: 'Digital grid pattern'
  }
];

interface BackgroundContextType {
  currentBackground: BackgroundAsset;
  setBackground: (background: BackgroundAsset) => void;
  backgroundAssets: BackgroundAsset[];
  categories: string[];
  getBackgroundsByCategory: (category: string) => BackgroundAsset[];
  preloadBackground: (background: BackgroundAsset) => Promise<void>;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: React.ReactNode;
  defaultBackground?: string; // background id
}

export function BackgroundProvider({ children, defaultBackground = 'cyberpunk-dream' }: BackgroundProviderProps) {
  const [currentBackground, setCurrentBackground] = useState<BackgroundAsset>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('selectedBackground');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = BACKGROUND_ASSETS.find(bg => bg.id === parsed.id);
        if (found) return found;
      } catch {
        // Fall through to default
      }
    }
    // Default background
    return BACKGROUND_ASSETS.find(bg => bg.id === defaultBackground) || BACKGROUND_ASSETS[0];
  });

  const categories = ['cyberpunk', 'nature', 'abstract', 'space', 'minimal'];

  const setBackground = (background: BackgroundAsset) => {
    setCurrentBackground(background);
    localStorage.setItem('selectedBackground', JSON.stringify(background));
  };

  const getBackgroundsByCategory = (category: string) => {
    return BACKGROUND_ASSETS.filter(bg => bg.category === category);
  };

  const preloadBackground = async (background: BackgroundAsset): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load background: ${background.name}`));
      
      // Handle @assets imports by converting to actual path
      let imagePath = background.path;
      if (imagePath.startsWith('@assets/')) {
        imagePath = `/attached_assets/${imagePath.replace('@assets/', '')}`;
      }
      
      img.src = imagePath;
    });
  };

  // Apply background to document root
  useEffect(() => {
    const applyBackground = () => {
      const root = document.documentElement;
      let imagePath = currentBackground.path;
      
      // Convert @assets paths to actual paths
      if (imagePath.startsWith('@assets/')) {
        imagePath = `/attached_assets/${imagePath.replace('@assets/', '')}`;
      }
      
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
    backgroundAssets: BACKGROUND_ASSETS,
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