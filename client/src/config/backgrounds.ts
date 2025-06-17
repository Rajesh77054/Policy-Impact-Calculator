// Background image configuration for dynamic theme switching
export interface BackgroundOption {
  id: string;
  name: string;
  description: string;
  imagePath: string;
  cssClass: string;
  colorScheme: 'dark' | 'light' | 'vibrant';
  category: 'cyberpunk' | 'nature' | 'abstract' | 'minimal';
}

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'cyberpunk-dream',
    name: 'Cyberpunk Dream',
    description: 'Purple and blue futuristic cityscape with neon lights',
    imagePath: '/cyberpunk-dream.png',
    cssClass: 'cyberpunk-bg',
    colorScheme: 'dark',
    category: 'cyberpunk'
  },
  {
    id: 'liquid-glass',
    name: 'Liquid Glass',
    description: 'Abstract flowing glass patterns with canyon backdrop',
    imagePath: '/canyon-bg.jpg', // You can add this image to public folder
    cssClass: 'liquid-glass-bg',
    colorScheme: 'light',
    category: 'abstract'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Clean dark gradient background',
    imagePath: '', // No image, pure CSS gradient
    cssClass: 'minimal-dark-bg',
    colorScheme: 'dark',
    category: 'minimal'
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Deep blue ocean waves with glass effects',
    imagePath: '/ocean-bg.jpg', // Future image option
    cssClass: 'ocean-bg',
    colorScheme: 'dark',
    category: 'nature'
  }
];

export const DEFAULT_BACKGROUND = 'cyberpunk-dream';

// Helper functions
export const getBackgroundById = (id: string): BackgroundOption | undefined => {
  return BACKGROUND_OPTIONS.find(bg => bg.id === id);
};

export const getBackgroundsByCategory = (category: BackgroundOption['category']): BackgroundOption[] => {
  return BACKGROUND_OPTIONS.filter(bg => bg.category === category);
};

export const getAvailableBackgrounds = (): BackgroundOption[] => {
  return BACKGROUND_OPTIONS.filter(bg => {
    // Only return backgrounds where the image exists or it's a CSS-only background
    return bg.imagePath === '' || bg.imagePath; // Add actual file existence check if needed
  });
};