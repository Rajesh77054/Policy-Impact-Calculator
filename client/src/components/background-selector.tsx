import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBackground } from '@/contexts/BackgroundContext';
import { BackgroundOption } from '@/config/backgrounds';
import { Palette, Image, Monitor } from 'lucide-react';

export default function BackgroundSelector() {
  const { currentBackground, setBackground, availableBackgrounds } = useBackground();
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryIcon = (category: BackgroundOption['category']) => {
    switch (category) {
      case 'cyberpunk': return <Monitor className="w-3 h-3" />;
      case 'nature': return <Image className="w-3 h-3" />;
      case 'abstract': return <Palette className="w-3 h-3" />;
      case 'minimal': return <Monitor className="w-3 h-3" />;
      default: return <Image className="w-3 h-3" />;
    }
  };

  const getColorSchemeColor = (scheme: BackgroundOption['colorScheme']) => {
    switch (scheme) {
      case 'dark': return 'bg-slate-800 text-white';
      case 'light': return 'bg-slate-100 text-slate-800';
      case 'vibrant': return 'bg-purple-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="glass-surface border-white/20 hover:border-white/40 transition-all"
      >
        <Palette className="w-4 h-4 mr-2" />
        Background
      </Button>

      {isExpanded && (
        <Card className="absolute top-12 right-0 w-80 z-50 glass-surface border-white/20 shadow-xl">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Background Theme</h3>
                <Badge variant="outline" className="text-xs">
                  {currentBackground.name}
                </Badge>
              </div>

              {/* Quick Select Dropdown */}
              <Select value={currentBackground.id} onValueChange={setBackground}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select background" />
                </SelectTrigger>
                <SelectContent>
                  {availableBackgrounds.map((bg) => (
                    <SelectItem key={bg.id} value={bg.id}>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(bg.category)}
                        <span>{bg.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Visual Preview Grid */}
              <div className="grid grid-cols-2 gap-2">
                {availableBackgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.id)}
                    className={`relative group p-2 rounded-lg border transition-all ${
                      currentBackground.id === bg.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="space-y-2">
                      {/* Preview thumbnail */}
                      <div
                        className={`w-full h-12 rounded ${bg.cssClass} bg-cover bg-center border border-white/10`}
                        style={bg.imagePath ? { 
                          backgroundImage: `url(${bg.imagePath})`,
                          backgroundSize: 'cover'
                        } : undefined}
                      />
                      
                      {/* Info */}
                      <div className="text-left">
                        <div className="text-xs font-medium text-foreground truncate">
                          {bg.name}
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1 py-0 ${getColorSchemeColor(bg.colorScheme)}`}
                          >
                            {bg.colorScheme}
                          </Badge>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {getCategoryIcon(bg.category)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Current Background Info */}
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-muted-foreground">
                  <strong>Current:</strong> {currentBackground.description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Click outside to close */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}