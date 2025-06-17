import React, { useState } from 'react';
import { Palette, Image, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';
import BackgroundSelector from './background-selector';

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [showBackgrounds, setShowBackgrounds] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* Background Selector */}
      <BackgroundSelector />
      
      {/* Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 glass-button glow-on-hover">
            <div className="glass-icon p-1 rounded">
              <Settings className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline">Theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 dropdown-content">
          {themes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`cursor-pointer transition-all duration-200 hover:glass-morphism ${
                theme === themeOption.value ? 'glass-morphism' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    themeOption.value === 'default'
                      ? 'bg-blue-500 glass-icon'
                      : 'glass-droplet glass-icon'
                  }`}
                />
                {themeOption.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}