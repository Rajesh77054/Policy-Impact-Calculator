import { Link } from "wouter";
import ThemeDemo from "@/components/theme-demo";
import ThemeSelector from "@/components/theme-selector";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Theme Demo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Home</span>
                </div>
              </Link>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <ThemeDemo />
      </div>
    </div>
  );
}