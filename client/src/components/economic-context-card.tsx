import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, Building2, Users } from "lucide-react";
import { PolicyResults } from "@shared/schema";

interface EconomicContextCardProps {
  results: PolicyResults;
  className?: string;
}

export default function EconomicContextCard({ results, className }: EconomicContextCardProps) {
  const economicContext = results.economicContext;

  if (!economicContext) {
    return null;
  }

  const { unemploymentRate, recessionIndicators, wageValidation, macroeconomicData } = economicContext;

  // Helper function to get trend indicator
  const getTrendIcon = (value: number, threshold: number, invert = false) => {
    const isHigh = invert ? value < threshold : value > threshold;
    return isHigh ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-green-500" />
    );
  };

  // Helper function to get risk level color
  const getRiskColor = (probability: number) => {
    if (probability >= 50) return "destructive";
    if (probability >= 30) return "secondary";
    return "default";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Economic Context
        </CardTitle>
        <CardDescription>
          Real-time economic indicators from Federal Reserve Economic Data (FRED)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Unemployment Rates */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employment Situation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">National Unemployment</span>
                {getTrendIcon(unemploymentRate.national, 4.0, true)}
              </div>
              <div className="text-2xl font-bold">
                {formatPercentage(unemploymentRate.national)}
              </div>
            </div>
            {unemploymentRate.state && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">State Unemployment</span>
                  {getTrendIcon(unemploymentRate.state, unemploymentRate.national)}
                </div>
                <div className="text-2xl font-bold">
                  {formatPercentage(unemploymentRate.state)}
                  <Badge 
                    variant={unemploymentRate.state > unemploymentRate.national ? "destructive" : "default"}
                    className="ml-2"
                  >
                    {unemploymentRate.state > unemploymentRate.national ? "Above" : "Below"} National
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(unemploymentRate.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <Separator />

        {/* Recession Probability */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Recession Risk Assessment
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Yield Curve Signal</div>
              <Badge variant={getRiskColor(recessionIndicators.yieldCurveInversion)}>
                {formatPercentage(recessionIndicators.yieldCurveInversion)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Employment Trend</div>
              <Badge variant={getRiskColor(recessionIndicators.unemploymentTrend)}>
                {formatPercentage(recessionIndicators.unemploymentTrend)}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">Combined Risk</div>
              <Badge variant={getRiskColor(recessionIndicators.combined)} className="text-lg px-3 py-1">
                {formatPercentage(recessionIndicators.combined)}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Based on Federal Reserve economic models • Last updated: {new Date(recessionIndicators.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <Separator />

        {/* Wage Context */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Income Context
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Median Weekly Earnings</span>
              <div className="text-xl font-semibold">
                {formatCurrency(wageValidation.medianWeeklyEarnings)}
              </div>
              <div className="text-sm text-muted-foreground">
                ≈ {formatCurrency(wageValidation.medianWeeklyEarnings * 52)}/year
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Average Hourly Earnings</span>
              <div className="text-xl font-semibold">
                {formatCurrency(wageValidation.hourlyEarnings)}/hour
              </div>
              <div className="text-sm text-muted-foreground">
                ≈ {formatCurrency(wageValidation.hourlyEarnings * 40 * 52)}/year (full-time)
              </div>
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm">
              <strong>Your Income Range:</strong> {wageValidation.incomeContext}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Bureau of Labor Statistics data • Last updated: {new Date(wageValidation.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        <Separator />

        {/* Macroeconomic Indicators */}
        <div className="space-y-3">
          <h4 className="font-semibold">Key Economic Indicators</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">GDP Growth</div>
              <div className="text-lg font-semibold flex items-center justify-center gap-1">
                {formatPercentage(macroeconomicData.gdpGrowth)}
                {getTrendIcon(macroeconomicData.gdpGrowth, 2.0)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Inflation Rate</div>
              <div className="text-lg font-semibold flex items-center justify-center gap-1">
                {formatPercentage(macroeconomicData.inflationRate)}
                {getTrendIcon(macroeconomicData.inflationRate, 3.0, true)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-sm text-muted-foreground">Fed Funds Rate</div>
              <div className="text-lg font-semibold">
                {formatPercentage(macroeconomicData.federalFundsRate)}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Federal Reserve Economic Data • Last updated: {new Date(macroeconomicData.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        {/* National Debt and Deficit */}
        {economicContext.fiscalData && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                National Debt & Deficit
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center space-y-1">
                  <div className="text-sm text-muted-foreground">Total Public Debt</div>
                  <div className="text-lg font-semibold">
                    ${economicContext.fiscalData.totalPublicDebt.toFixed(1)}T
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-sm text-muted-foreground">Debt-to-GDP Ratio</div>
                  <div className="text-lg font-semibold flex items-center justify-center gap-1">
                    {formatPercentage(economicContext.fiscalData.debtToGdpRatio)}
                    {getTrendIcon(economicContext.fiscalData.debtToGdpRatio, 100, true)}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-sm text-muted-foreground">Deficit-to-GDP Ratio</div>
                  <div className="text-lg font-semibold flex items-center justify-center gap-1">
                    {formatPercentage(Math.abs(economicContext.fiscalData.deficitToGdpRatio))}
                    {economicContext.fiscalData.deficitToGdpRatio < 0 ? 
                      <TrendingDown className="h-4 w-4 text-red-500" /> : 
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    }
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Federal Reserve Economic Data • Last updated: {new Date(economicContext.fiscalData.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}