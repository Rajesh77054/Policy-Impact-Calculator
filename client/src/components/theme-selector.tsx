import React from 'react';
import { Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';

export default function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 glass-button glow-on-hover">
          <div className="glass-icon p-1 rounded">
            <Palette className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 dropdown-content">
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
                    : 'bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 glass-icon'
                }`}
              />
              {themeOption.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}