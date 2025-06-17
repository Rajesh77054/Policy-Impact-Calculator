import React, { useState } from 'react';
import { useBackground } from '../contexts/BackgroundContext';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageIcon, Palette, Eye, Download } from 'lucide-react';

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

  const handleBackgroundSelect = async (background: typeof currentBackground) => {
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

  const handlePreview = (background: typeof currentBackground) => {
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
      
      <DialogContent className="max-w-4xl max-h-[80vh] glass-droplet border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Choose Background
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div className="text-sm text-white/80">Current Preview</div>
              <div 
                className="aspect-video rounded-lg border-2 border-white/20 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${previewBackground.path.startsWith('@assets/') 
                    ? `/attached_assets/${previewBackground.path.replace('@assets/', '')}` 
                    : previewBackground.path}')`
                }}
              />
              <div className="space-y-2">
                <div className="text-white font-medium">{previewBackground.name}</div>
                <div className="text-white/60 text-sm">{previewBackground.description}</div>
                <Badge variant="secondary" className="text-xs">
                  {previewBackground.category}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Selection Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-white/10">
                <TabsTrigger value="all" className="text-white">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-white capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid grid-cols-2 gap-3">
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
                </ScrollArea>
              </TabsContent>
              
              {categories.map(category => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-2 gap-3">
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
                  </ScrollArea>
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
  background: ReturnType<typeof useBackground>['currentBackground'];
  isSelected: boolean;
  isLoading: boolean;
  onSelect: () => void;
  onPreview: () => void;
}

function BackgroundCard({ background, isSelected, isLoading, onSelect, onPreview }: BackgroundCardProps) {
  const imagePath = background.path.startsWith('@assets/') 
    ? `/attached_assets/${background.path.replace('@assets/', '')}` 
    : background.path;

  return (
    <div 
      className={`group relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
        isSelected ? 'border-white shadow-lg' : 'border-white/20 hover:border-white/40'
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
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <div className="text-white text-sm font-medium truncate">
          {background.name}
        </div>
        <Badge variant="secondary" className="text-xs mt-1">
          {background.category}
        </Badge>
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Download className="w-6 h-6 text-white animate-pulse" />
        </div>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="bg-white text-black rounded-full p-1">
            <Eye className="w-4 h-4" />
          </div>
        </div>
      )}
      
      {/* Preview on hover */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Badge variant="outline" className="text-white border-white/40 bg-black/40">
          Preview
        </Badge>
      </div>
    </div>
  );
}