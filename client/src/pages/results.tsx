import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ResultsDashboard from "@/components/results-dashboard";
import ThemeSelector from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, ArrowLeft } from "lucide-react";

export default function Results() {
  const { data: results, isLoading, error } = useQuery({
    queryKey: ["/api/results"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculating your personalized policy impact...</p>
        </div>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading results. Please try again.</p>
          <Link href="/calculator">
            <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
              Return to Calculator
            </div>
          </Link>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold text-foreground">Policy Impact Calculator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">100% Anonymous</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">No Registration Required</span>
                </div>
              </div>
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      <ResultsDashboard results={results as any} />

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center">
          <Link href="/">
            <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              <span>Start New Analysis</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
