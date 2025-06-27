import { useQuery } from "@tanstack/react-query";
import { ResultsDashboard } from "@/components/results-dashboard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Share2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalculationErrorBoundary } from "@/components/calculation-error-boundary";

import { Shield, CheckCircle } from "lucide-react";

export default function Results() {
  const { data: results, isLoading, error, refetch } = useQuery({
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading results. Please try again.
            </AlertDescription>
          </Alert>
          <Link href="/calculator">
            <Button>Return to Calculator</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
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
            </div>
          </div>
        </div>
      </header>

      {results && (
        <div className="space-y-8">
          <CalculationErrorBoundary 
            component="Results Dashboard"
            onRetry={() => refetch()}
          >
            <ResultsDashboard 
              results={results} 
              isLoading={isLoading} 
            />
          </CalculationErrorBoundary>
        </div>
      )}

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="text-center">
          <Link href="/">
            <Button variant="outline" className="inline-flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}