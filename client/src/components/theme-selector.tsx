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
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className={`cursor-pointer ${
              theme === themeOption.value ? 'bg-accent' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full border ${
                  themeOption.value === 'default'
                    ? 'bg-blue-500 border-blue-600'
                    : 'bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 border-purple-300'
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