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

      {/* Interactive Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="enhanced-card glow-on-hover">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-primary/10 floating">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="gradient-text">Glass Panel</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Transparent background with backdrop blur effects and dynamic hover states.
            </CardDescription>
            <div className="mt-4 space-y-2">
              <Progress value={75} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Visual Impact</span>
                <span>75%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="enhanced-card glow-on-hover">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 floating" style={{ animationDelay: '2s' }}>
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <CardTitle>Interactive Effects</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Hover and click effects with smooth animations and ripple interactions.
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="glow-on-hover">Animated</Badge>
              <Badge variant="outline" className="glow-on-hover">Responsive</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="enhanced-card glow-on-hover md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-500/10 floating" style={{ animationDelay: '4s' }}>
                <Palette className="w-5 h-5 text-purple-500" />
              </div>
              <CardTitle>Color Harmony</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Dynamic gradients and color transitions that adapt to theme changes.
            </CardDescription>
            <div className="mt-4 flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"></div>
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

      {/* Glass Panel Demo */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4 gradient-text">Glass Panel Effect</h3>
        <p className="text-muted-foreground mb-4">
          This panel demonstrates the core liquid glass effect with semi-transparent backgrounds, 
          backdrop blur, and subtle border highlights.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-panel p-4 rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center floating">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium">Floating Icons</p>
          </div>
          <div className="glass-panel p-4 rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center floating" style={{ animationDelay: '1s' }}>
              <Zap className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium">Smooth Motion</p>
          </div>
          <div className="glass-panel p-4 rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/20 flex items-center justify-center floating" style={{ animationDelay: '2s' }}>
              <Heart className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-sm font-medium">Visual Depth</p>
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