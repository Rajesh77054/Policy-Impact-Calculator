import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Zap, Palette, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

export default function ThemeDemo() {
  const { theme } = useTheme();
  
  const handleRippleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">Theme Showcase</h1>
        <p className="text-muted-foreground text-lg">
          Experience the visual effects of the {theme === 'liquid-glass' ? 'Liquid Glass' : 'Default'} theme
        </p>
      </div>

      {/* Layered Glass Demonstration */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold gradient-text mb-2">Layered Glass Effects</h2>
          <p className="text-muted-foreground">Different layers create depth and floating droplet appearance</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-layer-1 p-6 rounded-2xl floating-content">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center floating">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Layer 1</h3>
              <p className="text-sm text-muted-foreground">Base glass surface with subtle transparency</p>
            </div>
          </div>

          <div className="glass-layer-2 p-6 rounded-2xl floating-content" style={{ animationDelay: '1s' }}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center floating" style={{ animationDelay: '2s' }}>
                <Zap className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Layer 2</h3>
              <p className="text-sm text-muted-foreground">Enhanced blur with inner glow effects</p>
            </div>
          </div>

          <div className="glass-layer-3 p-6 rounded-2xl floating-content" style={{ animationDelay: '2s' }}>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center floating" style={{ animationDelay: '4s' }}>
                <Palette className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2 gradient-text">Layer 3</h3>
              <p className="text-sm text-muted-foreground">Maximum depth with complex shadows</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Droplet Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-droplet glow-on-hover floating-content">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/10 floating">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="gradient-text">Floating Droplet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Like water droplets on glass - hovering above the surface with realistic depth.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <Progress value={85} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Depth Effect</span>
                <span>85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="enhanced-card glow-on-hover floating-content" style={{ animationDelay: '1s' }}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 floating" style={{ animationDelay: '2s' }}>
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <CardTitle>Interactive Surface</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Multi-layered shadows create natural floating appearance with hover enhancement.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="glow-on-hover">Animated</Badge>
              <Badge variant="outline" className="glow-on-hover">Responsive</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-droplet glow-on-hover floating-content md:col-span-2 lg:col-span-1" style={{ animationDelay: '2s' }}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-500/10 floating" style={{ animationDelay: '4s' }}>
                <Heart className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle>Layered Shadows</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Complex shadow system mimics real glass droplets with multiple light sources.
            </CardDescription>
            <div className="mt-4 flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 floating" style={{ animationDelay: '1s' }}></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 floating" style={{ animationDelay: '2s' }}></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 floating" style={{ animationDelay: '3s' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Buttons Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center gradient-text">Interactive Elements</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="glass-button glow-on-hover" 
            onClick={handleRippleClick}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Glass Button
          </Button>
          
          <Button 
            variant="outline" 
            className="glow-on-hover"
            onClick={handleRippleClick}
          >
            <Zap className="w-4 h-4 mr-2" />
            Outline Style
          </Button>
          
          <Button 
            variant="secondary" 
            className="glass-button glow-on-hover"
            onClick={handleRippleClick}
          >
            <Heart className="w-4 h-4 mr-2" />
            Secondary
          </Button>
          
          <Button 
            variant="ghost" 
            className="glow-on-hover"
            onClick={handleRippleClick}
          >
            <Palette className="w-4 h-4 mr-2" />
            Ghost Style
          </Button>
        </div>
      </div>

      {/* Advanced Glass Surface Demo */}
      <div className="relative">
        {/* Background glass layers for depth */}
        <div className="absolute inset-0 glass-layer-1 rounded-3xl transform rotate-1 scale-105 opacity-30"></div>
        <div className="absolute inset-0 glass-layer-2 rounded-3xl transform -rotate-1 scale-102 opacity-50"></div>
        
        {/* Main glass surface */}
        <div className="glass-surface p-8 rounded-3xl relative floating-content">
          <h3 className="text-2xl font-semibold mb-6 gradient-text text-center">Advanced Glass Surface</h3>
          <p className="text-muted-foreground mb-6 text-center max-w-2xl mx-auto">
            Multi-layered glass effect with background depth layers creating a sophisticated floating windshield appearance. 
            Each layer adds visual complexity and realistic light refraction.
          </p>
          
          {/* Floating glass droplets grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-droplet p-6 rounded-2xl text-center floating-content">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center floating">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 gradient-text">Droplet Physics</h4>
              <p className="text-sm text-muted-foreground">Surface tension simulation with realistic floating behavior</p>
            </div>
            
            <div className="glass-droplet p-6 rounded-2xl text-center floating-content" style={{ animationDelay: '1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center floating" style={{ animationDelay: '2s' }}>
                <Zap className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className="font-semibold mb-2 gradient-text">Light Refraction</h4>
              <p className="text-sm text-muted-foreground">Multi-directional shadows mimicking real glass properties</p>
            </div>
            
            <div className="glass-droplet p-6 rounded-2xl text-center floating-content" style={{ animationDelay: '2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center floating" style={{ animationDelay: '3s' }}>
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="font-semibold mb-2 gradient-text">Depth Perception</h4>
              <p className="text-sm text-muted-foreground">Layered shadows create natural 3D floating illusion</p>
            </div>
          </div>
          
          {/* Interactive demonstration */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">Hover over elements to see enhanced floating effects</p>
            <div className="flex justify-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 floating glow-on-hover cursor-pointer"></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 floating glow-on-hover cursor-pointer" style={{ animationDelay: '1s' }}></div>
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 floating glow-on-hover cursor-pointer" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Information */}
      <Card className="enhanced-card">
        <CardHeader>
          <CardTitle className="gradient-text">Theme Features</CardTitle>
          <CardDescription>
            Current theme: <Badge variant="secondary">{theme === 'liquid-glass' ? 'Liquid Glass' : 'Default'}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Visual Effects</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Backdrop blur and transparency</li>
                <li>• Dynamic gradient backgrounds</li>
                <li>• Floating animations</li>
                <li>• Glow effects on hover</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interactions</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ripple click effects</li>
                <li>• Smooth transitions</li>
                <li>• Scale transformations</li>
                <li>• Color animations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}