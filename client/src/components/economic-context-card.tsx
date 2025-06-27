import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { PolicyResults } from "@shared/types";

interface EconomicContextCardProps {
  results: PolicyResults;
}

export default function EconomicContextCard({ results }: EconomicContextCardProps) {
  const economicContext = results.economicContext;
  
  if (!economicContext) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Economic Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Economic data is being loaded...</p>
        </CardContent>
      </Card>
    );
  }

  const getRecessionRiskLevel = (probability: number) => {
    if (probability <= 15) return { level: "Low", color: "green", icon: CheckCircle };
    if (probability <= 35) return { level: "Moderate", color: "yellow", icon: AlertTriangle };
    return { level: "High", color: "red", icon: AlertTriangle };
  };

  const getUnemploymentTrend = (rate: number) => {
    if (rate <= 4.0) return { trend: "Stable", color: "green", icon: CheckCircle };
    if (rate <= 6.0) return { trend: "Elevated", color: "yellow", icon: AlertTriangle };
    return { trend: "High", color: "red", icon: AlertTriangle };
  };

  const recessionRisk = getRecessionRiskLevel(results.recessionProbability);
  const unemploymentTrend = getUnemploymentTrend(economicContext.unemploymentRate.national);
  
  return (
    <TooltipProvider>
      <Card className="border-2 border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-slate-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-slate-600" />
            Current Economic Context
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 ml-2 text-slate-400 hover:text-slate-600 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Real-time economic indicators that provide context for policy impact calculations</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Economic Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Unemployment Rate */}
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <unemploymentTrend.icon className={`w-4 h-4 mr-1 text-${unemploymentTrend.color}-600`} />
                <Badge variant={unemploymentTrend.color === 'green' ? 'default' : 'destructive'} className="text-xs">
                  {unemploymentTrend.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {economicContext.unemploymentRate.national}%
              </div>
              <div className="text-xs text-slate-600">Unemployment</div>
            </div>

            {/* Inflation Rate */}
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {economicContext.macroeconomicData.inflationRate > 3.0 ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-orange-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                )}
                <Badge variant={economicContext.macroeconomicData.inflationRate > 3.0 ? 'destructive' : 'default'} className="text-xs">
                  {economicContext.macroeconomicData.inflationRate > 3.0 ? 'Elevated' : 'Stable'}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {economicContext.macroeconomicData.inflationRate}%
              </div>
              <div className="text-xs text-slate-600">Inflation</div>
            </div>

            {/* GDP Growth */}
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {economicContext.macroeconomicData.gdpGrowth > 2.0 ? (
                  <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1 text-orange-600" />
                )}
                <Badge variant={economicContext.macroeconomicData.gdpGrowth > 2.0 ? 'default' : 'secondary'} className="text-xs">
                  {economicContext.macroeconomicData.gdpGrowth > 2.0 ? 'Growing' : 'Slow'}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {economicContext.macroeconomicData.gdpGrowth}%
              </div>
              <div className="text-xs text-slate-600">GDP Growth</div>
            </div>

            {/* Recession Risk */}
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <recessionRisk.icon className={`w-4 h-4 mr-1 text-${recessionRisk.color}-600`} />
                <Badge variant={recessionRisk.color === 'green' ? 'default' : 'destructive'} className="text-xs">
                  {recessionRisk.level}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {Math.round(results.recessionProbability)}%
              </div>
              <div className="text-xs text-slate-600">Recession Risk</div>
            </div>
          </div>



          <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-200">
            Data updated: {economicContext.macroeconomicData.lastUpdated}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}