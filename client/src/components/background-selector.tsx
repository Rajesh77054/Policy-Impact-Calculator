import React, { useState } from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageIcon, Palette, Eye, Download } from 'lucide-react';
import type { BackgroundAsset } from '../config/backgrounds';

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

  // Debug logging
  console.log('Background assets:', backgroundAssets.length);
  console.log('Categories:', categories);
  console.log('Current background:', currentBackground);

  const handleBackgroundSelect = async (background: BackgroundAsset) => {
    if (background.id === currentBackground.id) return;
    
    setLoadingBackground(background.id);
    
    try {
      // Preload the image to ensure smooth transition
      await preloadBackground(background);
      setBackground(background);
      setPreviewBackground(background);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to load background:', error);
      // Could show toast notification here if needed
    } finally {
      setLoadingBackground(null);
    }
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
          className="glass-button text-white border-white/20 hover:bg-white/10"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Change Background
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/80 backdrop-blur-xl border border-white/20 text-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-lg font-semibold">
            <Palette className="w-5 h-5" />
            Choose Background
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Current Preview */}
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-24 h-16 rounded-lg border border-white/20 bg-cover bg-center bg-no-repeat flex-shrink-0"
                style={{ backgroundImage: `url('${previewBackground.path}')` }}
              />
              <div>
                <div className="text-white font-medium">{previewBackground.name}</div>
                <div className="text-white/60 text-sm">{previewBackground.description}</div>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                  {previewBackground.category}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Selection Section */}
          <div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/20 border border-white/30">
                <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-white capitalize data-[state=active]:bg-white/30 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="h-[400px] overflow-y-auto pr-4">
                  <div className="grid grid-cols-3 gap-3">
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
                  <div className="h-[400px] overflow-y-auto pr-4">
                    <div className="grid grid-cols-3 gap-3">
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
  const imagePath = background.path;

  return (
    <div 
      className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 bg-gray-800 ${
        isSelected ? 'border-blue-400 shadow-lg shadow-blue-400/50' : 'border-white/30 hover:border-white/60'
      }`}
      onClick={onSelect}
      onMouseEnter={onPreview}
    >
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${imagePath}')` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-white text-sm font-medium truncate">
          {background.name}
        </div>
        <Badge variant="secondary" className="text-xs mt-1 bg-white/20 text-white border-white/30">
          {background.category}
        </Badge>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <Download className="w-6 h-6 text-white animate-pulse" />
        </div>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      )}
      
      {/* Preview on hover */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Badge variant="outline" className="text-white border-white/60 bg-black/60">
          Preview
        </Badge>
      </div>
    </div>
  );
}