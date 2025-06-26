import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HelpCircle, TrendingUp, TrendingDown, Calculator, DollarSign, Heart, Zap, Building, Users, Shield, Download, Share2, RotateCcw, Loader2 } from "lucide-react";
import { PolicyResults } from "@shared/types";
import PolicyCharts from "./policy-charts";
import NetFinancialImpactChart from "./net-financial-impact-chart";
import EconomicContextCard from "./economic-context-card";
import PolicyComparisonTable from "./policy-comparison-table";
import { useReplitAuth } from "@/hooks/use-replit-auth";
import { Link } from "wouter";
import { DataFreshnessIndicator } from "./data-freshness-indicator";
import { CalculationErrorBoundary } from "./calculation-error-boundary";

interface ResultsDashboardProps {
  results: PolicyResults;
  isLoading?: boolean;
}

const MobileTooltip = ({ 
  content, 
  title, 
  icon = "help",
  iconSize = "md" 
}: { 
  content: string; 
  title: string; 
  icon?: "help" | "trend-up" | "trend-down";
  iconSize?: "sm" | "md";
}) => {
  const IconComponent = icon === "trend-up" ? TrendingUp : 
                       icon === "trend-down" ? TrendingDown : 
                       HelpCircle;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconComponent className={`${iconSize === "sm" ? "w-3 h-3" : "w-4 h-4"} text-slate-400 hover:text-slate-600 cursor-help`} />
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <div className="space-y-1">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-slate-600">{content}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const ActionButtons = () => {
  const { 
    user, 
    downloadPdf, 
    shareResults, 
    isDownloadingPdf, 
    isSharingResults,
    downloadPdfData,
    shareResultsData
  } = useReplitAuth();

  const handleDownloadPdf = () => {
    downloadPdf();
  };

  const handleShareResults = () => {
    shareResults();
  };

  return (
    <div className="border-t pt-8 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Download PDF Button */}
        <Button
          onClick={handleDownloadPdf}
          disabled={isDownloadingPdf || !user}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </Button>

        {/* Start New Analysis Button */}
        <Link href="/calculator">
          <Button variant="outline" className="inline-flex items-center space-x-2 px-6 py-2">
            <RotateCcw className="w-4 h-4" />
            <span>Start New Analysis</span>
          </Button>
        </Link>

        {/* Share Results Button */}
        <Button
          onClick={handleShareResults}
          disabled={isSharingResults || !user}
          variant="outline"
          className="inline-flex items-center space-x-2 px-6 py-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Results</span>
        </Button>
      </div>

      {/* Authentication message for users not logged in */}
      {!user && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          Sign in with Replit to download PDF reports and share results
        </p>
      )}

      {/* Success/Error messages */}
      {downloadPdfData && (
        <p className="text-center text-sm text-green-600 mt-2">
          PDF download initiated successfully
        </p>
      )}
      {shareResultsData && (
        <p className="text-center text-sm text-green-600 mt-2">
          Share link generated successfully
        </p>
      )}
    </div>
  );
};

const IMPACT_COLORS = {
  positive: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
  },
  negative: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-600",
  },
  neutral: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
  },
};

function LoadingDashboard() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto"></div>
        <p className="text-sm text-muted-foreground mt-4">
          Calculating your personalized policy impact using real-time economic data...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ResultsDashboard({ results, isLoading = false }: ResultsDashboardProps) {
  if (isLoading) {
    return <LoadingDashboard />;
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const getImpactColorScheme = (impact: number) => {
    if (impact > 0) return IMPACT_COLORS.negative; // Costs
    if (impact < 0) return IMPACT_COLORS.positive; // Savings  
    return IMPACT_COLORS.neutral; // Neutral
  };

  const getImpactIcon = (impact: number) => {
    if (impact > 0) return <TrendingUp className="h-4 w-4" />;
    if (impact < 0) return <TrendingDown className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Primary Visualization - Net Financial Impact Summary */}
        <Card className={`border-2 ${results.netAnnualImpact < 0 ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
          <CardHeader className="pb-4">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Your Net Annual Impact
              </CardTitle>
              <div className={`text-5xl font-bold mb-3 ${results.netAnnualImpact < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                {results.netAnnualImpact < 0 ? `Save $${Math.abs(results.netAnnualImpact).toLocaleString()}` : `Pay $${results.netAnnualImpact.toLocaleString()} more`}
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                This represents your total annual financial impact from the One Big Beautiful Bill Act (Big Bill), 
                accounting for tax relief, healthcare savings, and any additional costs.
              </p>
            </div>
          </CardHeader>
        </Card>



        {/* Primary Chart - Net Financial Impact Over Time */}
        <NetFinancialImpactChart results={results} />

        {/* Employment Status Alert for Contract Workers */}
        {results.breakdown.some(item => item.category === "employment" && item.impact > 0) && (
          <Card className="bg-amber-50 border-amber-200 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Building className="w-5 h-5 text-amber-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 mb-2">Employment Status Impact</h4>
                  <p className="text-sm text-amber-800 mb-3">
                    As a contract worker, you face additional tax burdens that offset some policy benefits. This includes self-employment taxes, 1099 complications, and lack of employer-provided benefits.
                  </p>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="text-sm text-amber-900">
                      <strong>Employment Impact:</strong> +${Math.abs(results.breakdown.find(item => item.category === "employment")?.impact || 0).toLocaleString()}/year
                    </div>
                    <div className="text-xs text-amber-700 mt-1">
                      This reflects the real additional costs contract workers face compared to traditional employees
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Impact Analysis */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-slate-600" />
              Complete Impact Analysis
            </h4>
            <div className="space-y-3">
              {results.breakdown.map((item, index) => (
                <div key={index} className={`p-4 rounded-lg border ${item.impact < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className={`font-medium ${item.impact < 0 ? 'text-green-900' : 'text-red-900'}`}>
                        {item.title}
                      </h5>
                      <p className={`text-sm ${item.impact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${item.impact < 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {item.impact < 0 ? `Save $${Math.abs(item.impact).toLocaleString()}` : `+$${item.impact.toLocaleString()}`}
                    </div>
                  </div>
                  {item.details && (
                    <div className="mt-3 space-y-1">
                      {item.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex justify-between text-sm">
                          <span className={item.impact < 0 ? 'text-green-600' : 'text-red-600'}>
                            • {detail.item}
                          </span>
                          <span className={`font-medium ${item.impact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {detail.amount < 0 ? `Save $${Math.abs(detail.amount).toLocaleString()}` : `+$${detail.amount.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Energy Cost Impact - Always show if it exists */}
              {Math.abs(results.energyCostImpact) > 0 && (
                <div className={`p-4 rounded-lg border ${results.energyCostImpact < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className={`font-medium ${results.energyCostImpact < 0 ? 'text-green-900' : 'text-red-900'}`}>
                        Energy Cost Changes
                      </h5>
                      <p className={`text-sm ${results.energyCostImpact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Energy cost impact from clean energy investments and policy changes
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${results.energyCostImpact < 0 ? 'text-green-800' : 'text-red-800'}`}>
                      {results.energyCostImpact < 0 ? `Save $${Math.abs(results.energyCostImpact).toLocaleString()}` : `+$${results.energyCostImpact.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={results.energyCostImpact < 0 ? 'text-green-600' : 'text-red-600'}>
                        • Clean energy transition impact
                      </span>
                      <span className={`font-medium ${results.energyCostImpact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {results.energyCostImpact < 0 ? `Save $${Math.abs(results.energyCostImpact).toLocaleString()}` : `+$${results.energyCostImpact.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* State/Location Adjustment - Always show if significant */}
              {(() => {
                const stateAdjustment = results.netAnnualImpact - 
                  results.annualTaxImpact - 
                  results.healthcareCostImpact - 
                  results.energyCostImpact - 
                  (results.breakdown.find(b => b.category === 'employment')?.impact || 0);
                return Math.abs(stateAdjustment) > 100 ? (
                  <div className={`p-4 rounded-lg border ${stateAdjustment < 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className={`font-medium ${stateAdjustment < 0 ? 'text-green-900' : 'text-red-900'}`}>
                          State & Location Adjustments
                        </h5>
                        <p className={`text-sm ${stateAdjustment < 0 ? 'text-green-700' : 'text-red-700'}`}>
                          State-specific tax impacts, cost of living adjustments, and regional policy effects
                        </p>
                      </div>
                      <div className={`text-lg font-bold ${stateAdjustment < 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {stateAdjustment < 0 ? `Save $${Math.abs(stateAdjustment).toLocaleString()}` : `+$${stateAdjustment.toLocaleString()}`}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className={stateAdjustment < 0 ? 'text-green-600' : 'text-red-600'}>
                          • State tax and cost-of-living factors
                        </span>
                        <span className={`font-medium ${stateAdjustment < 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {stateAdjustment < 0 ? `Save $${Math.abs(stateAdjustment).toLocaleString()}` : `+$${stateAdjustment.toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}


            </div>

            {/* Net Impact Summary */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className={`p-4 rounded-lg border-2 ${results.netAnnualImpact < 0 ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h5 className={`text-lg font-bold ${results.netAnnualImpact < 0 ? 'text-green-900' : 'text-red-900'}`}>
                      Net Annual Impact
                    </h5>
                    <p className={`text-sm ${results.netAnnualImpact < 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {results.netAnnualImpact < 0 ? 'Your total annual savings' : 'Your total additional annual cost'}
                    </p>
                  </div>
                  <div className={`text-3xl font-bold ${results.netAnnualImpact < 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {results.netAnnualImpact < 0 ? `Save $${Math.abs(results.netAnnualImpact).toLocaleString()}` : `+$${results.netAnnualImpact.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Policy Comparison Table Section */}
        <PolicyComparisonTable className="mb-8" />

        {/* Secondary Charts Section */}
        <PolicyCharts results={results} />

        {/* Economic Context Section */}
        {results.economicContext && (
          <div className="mb-8">
            <EconomicContextCard results={results} />
          </div>
        )}

        {/* Action Buttons Section */}
        <ActionButtons />
      </div>
    </TooltipProvider>
  );
}