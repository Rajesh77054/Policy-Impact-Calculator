import React, { useState, useEffect, useRef } from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageIcon, Palette, Eye, Download, Image as ImageOff } from 'lucide-react';
import type { BackgroundAsset } from '../config/backgrounds';
import { getImagePath } from '../utils/image-loader';

export default function BackgroundSelector() {
  const { 
    currentBackground, 
    setBackground, 
    backgroundAssets, 
    categories, 
    getBackgroundsByCategory,
    preloadBackground 
  } = useBackground();
  
  const [isOpen, setIsOpen] = useState(false);
  const [previewBackground, setPreviewBackground] = useState(currentBackground);
  const [loadingBackground, setLoadingBackground] = useState<string | null>(null);



  const handleBackgroundSelect = (background: BackgroundAsset) => {
    if (background.id === currentBackground.id) return;
    
    setBackground(background);
    setPreviewBackground(background);
    setIsOpen(false);
  };

  const handlePreview = (background: BackgroundAsset) => {
    setPreviewBackground(background);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-slate-800/90 border-slate-600 hover:bg-slate-700 text-white hover:text-white"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Change Background
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 text-white">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-white flex items-center gap-2 text-xl font-semibold">
            <Palette className="w-6 h-6" />
            Choose Background
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select a background image from the collection below to customize your experience.
          </DialogDescription>
        </DialogHeader>
        
        {/* Current Preview */}
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div 
              className="w-32 h-20 rounded-lg border border-slate-600 bg-cover bg-center bg-no-repeat flex-shrink-0 bg-slate-700"
              style={{ 
                backgroundImage: `url('${getImagePath(previewBackground.path)}')` 
              }}
            />
            <div>
              <div className="text-white font-semibold text-lg">{previewBackground.name}</div>
              <div className="text-slate-300 text-sm">{previewBackground.description}</div>
              <Badge className="text-xs mt-1 bg-slate-700 text-white border-slate-600">
                {previewBackground.category}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Background Grid */}
        <div className="space-y-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
              <TabsTrigger value="all" className="text-white data-[state=active]:bg-slate-700">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="text-white capitalize data-[state=active]:bg-slate-700"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-4 gap-3">
                  {backgroundAssets.map(background => (
                    <BackgroundCard
                      key={background.id}
                      background={background}
                      isSelected={background.id === currentBackground.id}
                      isLoading={loadingBackground === background.id}
                      onSelect={() => handleBackgroundSelect(background)}
                      onPreview={() => handlePreview(background)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            {categories.map(category => (
              <TabsContent key={category} value={category} className="mt-4">
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-4 gap-3">
                    {getBackgroundsByCategory(category).map(background => (
                      <BackgroundCard
                        key={background.id}
                        background={background}
                        isSelected={background.id === currentBackground.id}
                        isLoading={loadingBackground === background.id}
                        onSelect={() => handleBackgroundSelect(background)}
                        onPreview={() => handlePreview(background)}
                      />
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BackgroundCardProps {
  background: BackgroundAsset;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function BackgroundCard({ background, isSelected, isLoading, onSelect, onPreview }: BackgroundCardProps) {
  const imagePath = getImagePath(background.path);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      const element = cardRef.current;
      // Force style overrides directly on DOM element
      element.style.setProperty('background-image', `url('${imagePath}')`, 'important');
      element.style.setProperty('background-size', 'cover', 'important');
      element.style.setProperty('background-position', 'center', 'important');
      element.style.setProperty('background-repeat', 'no-repeat', 'important');
      element.style.setProperty('background-color', '#475569', 'important');
      element.style.setProperty('backdrop-filter', 'none', 'important');
      element.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
    }
  }, [imagePath]);

  return (
    <div 
      ref={cardRef}
      className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] ${
        isSelected ? 'border-blue-400 shadow-lg shadow-blue-400/30' : 'border-slate-600 hover:border-slate-500'
      }`}
      onClick={onSelect}
      onMouseEnter={onPreview}
    >
      
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
        <div className="text-white text-xs font-medium truncate">
          {background.name}
        </div>
        <div className="text-slate-300 text-xs capitalize">
          {background.category}
        </div>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Selected state */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <Eye className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
}