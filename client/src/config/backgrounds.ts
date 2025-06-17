// Background Asset Configuration
// This file centralizes all background management for easy maintenance

export interface BackgroundAsset {
  id: string;
  name: string;
  path: string;
  category: 'cyberpunk' | 'nature' | 'abstract' | 'space' | 'minimal';
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

  // Nature Collection
  {
    id: 'canyon-vista',
    name: 'Canyon Vista',
    path: '/attached_assets/IMG_9246_1749918203092.png',
    category: 'nature',
    description: 'Majestic desert canyon with dramatic rock formations',
    tags: ['desert', 'rocks', 'canyon', 'landscape']
  },
  {
    id: 'mountain-range',
    name: 'Mountain Range',
    path: '/attached_assets/IMG_9247_1749920069951.png',
    category: 'nature',
    description: 'Snow-capped mountain peaks against blue sky',
    tags: ['mountains', 'snow', 'peaks', 'scenic']
  },
  {
    id: 'coastal-cliffs',
    name: 'Coastal Cliffs',
    path: '/attached_assets/IMG_9248_1749920940698.png',
    category: 'nature', 
    description: 'Dramatic ocean cliffs with crashing waves',
    tags: ['ocean', 'cliffs', 'waves', 'coastal']
  },
  {
    id: 'forest-path',
    name: 'Forest Path',
    path: '/attached_assets/IMG_9249_1749923572023.png',
    category: 'nature',
    description: 'Serene woodland path through tall trees',
    tags: ['forest', 'trees', 'path', 'woodland']
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    path: '/attached_assets/IMG_9255_1750005438271.png',
    category: 'nature',
    description: 'Warm sunset light over landscape',
    tags: ['sunset', 'golden', 'warm', 'scenic']
  },

  // Space Collection
  {
    id: 'aurora-sky',
    name: 'Aurora Sky',
    path: '/attached_assets/IMG_9250_1749936642340.png',
    category: 'space',
    description: 'Northern lights dancing across night sky',
    tags: ['aurora', 'lights', 'night', 'cosmic']
  },

  // Abstract/Tech Collection
  {
    id: 'city-lights',
    name: 'City Lights',
    path: '/attached_assets/IMG_9254_1750004329663.png',
    category: 'abstract',
    description: 'Urban nighttime glow with abstract patterns',
    tags: ['urban', 'night', 'lights', 'abstract']
  },
  {
    id: 'tech-grid',
    name: 'Tech Grid',
    path: '/attached_assets/IMG_9280_1750180496772.png',
    category: 'cyberpunk',
    description: 'Digital grid pattern with tech aesthetics',
    tags: ['grid', 'digital', 'tech', 'pattern']
  },

  // Additional Scenic Backgrounds
  {
    id: 'scenic-view-1',
    name: 'Mountain Lake',
    path: '/attached_assets/IMG_9258_1750016770262.png',
    category: 'nature',
    description: 'Pristine mountain lake reflection',
    tags: ['lake', 'reflection', 'pristine', 'calm']
  },
  {
    id: 'scenic-view-2',
    name: 'Valley Vista',
    path: '/attached_assets/IMG_9260_1750104534422.png',
    category: 'nature',
    description: 'Wide valley view with rolling hills',
    tags: ['valley', 'hills', 'vista', 'expansive']
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
    category: 'abstract',
    description: 'Dynamic purple-blue organic shapes',
    tags: ['purple', 'blue', 'organic', 'fluid', 'modern']
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
  return ['cyberpunk', 'nature', 'abstract', 'space', 'minimal'];
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