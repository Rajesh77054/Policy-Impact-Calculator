// Background Asset Configuration
// This file centralizes all background management for easy maintenance

export interface BackgroundAsset {
  id: string;
  name: string;
  path: string;
  category: 'cyberpunk' | 'abstract' | 'space' | 'minimal';
  description?: string;
  tags?: string[];
  featured?: boolean;
}

// Centralized background asset registry
// Add new backgrounds here to make them available in the selector
export const BACKGROUND_REGISTRY: BackgroundAsset[] = [
  // Featured/Default Backgrounds
  {
    id: 'cyberpunk-dream',
    name: 'Cyberpunk Dream',
    path: '/cyberpunk-dream.png',
    category: 'cyberpunk',
    description: 'Neon-lit cyberpunk cityscape with vibrant colors',
    tags: ['neon', 'city', 'futuristic'],
    featured: true
  },



  // Abstract/Gradient Collection
  {
    id: 'blue-dream',
    name: 'Blue Dream',
    path: '/attached_assets/Blue Dream_1750197379239.png',
    category: 'abstract',
    description: 'Smooth blue gradient with dreamy flow',
    tags: ['blue', 'gradient', 'smooth', 'peaceful'],
    featured: true
  },
  {
    id: 'blue-lava-lamp',
    name: 'Blue Lava Lamp',
    path: '/attached_assets/Blue Lava Lamp_1750197379239.png',
    category: 'cyberpunk',
    description: 'Dynamic purple-blue organic shapes with futuristic feel',
    tags: ['purple', 'blue', 'organic', 'fluid', 'modern', 'cyberpunk']
  },
  {
    id: 'dream-scape',
    name: 'Dream Scape',
    path: '/attached_assets/Dream Scape_1750197379240.png',
    category: 'abstract',
    description: 'Soft pastel gradient from blue to pink',
    tags: ['pastel', 'gradient', 'soft', 'dreamy', 'pink']
  },
  {
    id: 'blue-aurora',
    name: 'Blue Aurora',
    path: '/attached_assets/Blue Aurora_1750197379240.png',
    category: 'space',
    description: 'Ethereal teal and blue aurora patterns',
    tags: ['aurora', 'teal', 'ethereal', 'cosmic', 'flowing']
  },
  {
    id: 'orange-lava-lamp',
    name: 'Orange Lava Lamp',
    path: '/attached_assets/Orange Lava Lamp_1750197379240.png',
    category: 'abstract',
    description: 'Warm orange and coral flowing shapes',
    tags: ['orange', 'coral', 'warm', 'flowing', 'energetic']
  },

  // Minimal Collection
  {
    id: 'minimal-dark',
    name: 'Dark Minimal',
    path: '/cyberpunk-dream.png',
    category: 'minimal',
    description: 'Clean dark background for minimal aesthetics',
    tags: ['dark', 'clean', 'minimal', 'simple']
  }
];

// Utility functions for background management
export const getBackgroundById = (id: string): BackgroundAsset | undefined => {
  return BACKGROUND_REGISTRY.find(bg => bg.id === id);
};

export const getBackgroundsByCategory = (category: BackgroundAsset['category']): BackgroundAsset[] => {
  return BACKGROUND_REGISTRY.filter(bg => bg.category === category);
};

export const getFeaturedBackgrounds = (): BackgroundAsset[] => {
  return BACKGROUND_REGISTRY.filter(bg => bg.featured);
};

export const getBackgroundsByTag = (tag: string): BackgroundAsset[] => {
  return BACKGROUND_REGISTRY.filter(bg => bg.tags?.includes(tag));
};

export const getAllCategories = (): BackgroundAsset['category'][] => {
  return ['cyberpunk', 'abstract', 'space', 'minimal'];
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  BACKGROUND_REGISTRY.forEach(bg => {
    bg.tags?.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};

// Default background configuration
export const DEFAULT_BACKGROUND_ID = 'cyberpunk-dream';

// Background preloading configuration
export const PRELOAD_FEATURED_BACKGROUNDS = true;
export const MAX_CONCURRENT_PRELOADS = 3;