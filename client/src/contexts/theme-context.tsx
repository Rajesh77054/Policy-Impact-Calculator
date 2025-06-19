import React from 'react';

// Simplified theme context - no theme switching needed
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}