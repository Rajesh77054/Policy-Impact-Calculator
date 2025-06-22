import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown, Calculator, DollarSign, Heart, Zap, Building, Users, Shield, Download, Share2, RotateCcw } from "lucide-react";
import { PolicyResults } from "@shared/types";
import PolicyCharts from "./policy-charts";
import NetFinancialImpactChart from "./net-financial-impact-chart";
import EconomicContextCard from "./economic-context-card";
import { useReplitAuth } from "@/hooks/use-replit-auth";
import { Link } from "wouter";

interface ResultsDashboardProps {
  results: PolicyResults;
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
  const { user, downloadPdfMutation, shareResultsMutation } = useReplitAuth();

  const handleDownloadPdf = () => {
    downloadPdfMutation.mutate();
  };

  const handleShareResults = () => {
    shareResultsMutation.mutate();
  };

  return (
    <div className="border-t pt-8 mt-8">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {/* Download PDF Button */}
        <Button
          onClick={handleDownloadPdf}
          disabled={downloadPdfMutation.isPending || !user}
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
          disabled={shareResultsMutation.isPending || !user}
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
      {downloadPdfMutation.isSuccess && (
        <p className="text-center text-sm text-green-600 mt-2">
          PDF download initiated successfully
        </p>
      )}
      {shareResultsMutation.isSuccess && (
        <p className="text-center text-sm text-green-600 mt-2">
          Share link generated successfully
        </p>
      )}
      {(downloadPdfMutation.isError || shareResultsMutation.isError) && (
        <p className="text-center text-sm text-red-600 mt-2">
          Please sign in to use this feature
        </p>
      )}
    </div>
  );
};

export default function ResultsDashboard({ results }: ResultsDashboardProps) {

  const formatCurrency = (amount: number): string => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(Math.abs(amount) / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `$${(Math.abs(amount) / 1000).toFixed(0)}k`;
    }
    return `$${Math.abs(amount).toLocaleString()}`;
  };

  const formatTaxImpact = (amount: number): string => {
    if (amount === 0) return "No change";
    if (amount < 0) return `Save ${formatCurrency(Math.abs(amount))}`;
    return `Pay ${formatCurrency(amount)} more`;
  };

  const formatCostImpact = (amount: number): string => {
    if (amount === 0) return "No change";
    if (amount < 0) return `Save ${formatCurrency(Math.abs(amount))}`;
    return `Cost ${formatCurrency(amount)} more`;
  };

  const formatPercentage = (value: number): string => {
    return `${value}%`;
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
                This represents your total annual financial impact from the proposed policy, 
                accounting for tax relief, healthcare savings, and any additional costs.
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Primary Chart - Net Financial Impact Over Time */}
        <NetFinancialImpactChart results={results} />

        {/* Secondary Supporting Information */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">How Your Savings Break Down</h3>
          
          {/* Unified Impact Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Tax Impact */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-900 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Tax Relief
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {results.annualTaxImpact < 0 ? `Save $${Math.abs(results.annualTaxImpact).toLocaleString()}` : `Pay $${results.annualTaxImpact.toLocaleString()} more`}
                </div>
                <p className="text-sm text-green-600 mb-3">
                  Annual tax savings from policy changes
                </p>
                <div className="text-xs text-green-700">
                  20-year total: {results.annualTaxImpact < 0 ? `Save $${Math.abs(results.annualTaxImpact * 20).toLocaleString()}` : `Pay $${(results.annualTaxImpact * 20).toLocaleString()} more`}
                </div>
              </CardContent>
            </Card>

            {/* Healthcare Impact */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-green-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Healthcare Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700 mb-2">
                  {results.healthcareCostImpact < 0 ? `Save $${Math.abs(results.healthcareCostImpact).toLocaleString()}` : `Cost $${results.healthcareCostImpact.toLocaleString()} more`}
                </div>
                <p className="text-sm text-green-600 mb-3">
                  Annual healthcare cost reduction
                </p>
                <div className="text-xs text-green-700">
                  Current: ${results.healthcareCosts.current.toLocaleString()}/year → Proposed: ${results.healthcareCosts.proposed.toLocaleString()}/year
                </div>
              </CardContent>
            </Card>

            {/* Net Total Impact */}
            <Card className={`border-2 ${results.timeline.twentyYear < 0 ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg flex items-center ${results.timeline.twentyYear < 0 ? 'text-green-900' : 'text-orange-900'}`}>
                  {results.timeline.twentyYear < 0 ? <TrendingUp className="w-5 h-5 mr-2" /> : <TrendingDown className="w-5 h-5 mr-2" />}
                  Long-term Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold mb-2 ${results.timeline.twentyYear < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                  {results.timeline.twentyYear < 0 ? `Save $${Math.abs(results.timeline.twentyYear).toLocaleString()}` : `Pay $${results.timeline.twentyYear.toLocaleString()} more`}
                </div>
                <p className={`text-sm mb-3 ${results.timeline.twentyYear < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {results.timeline.twentyYear < 0 ? "Cumulative 20-year benefit" : "Cumulative 20-year cost"}
                </p>
                <div className={`text-xs ${results.timeline.twentyYear < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                  Includes inflation adjustments and compound effects
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Energy Impact Note (if applicable) */}
          {results.energyCostImpact !== 0 && (
            <Card className="bg-yellow-50 border-yellow-200 mb-8">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Energy Cost Impact</h4>
                    <p className="text-sm text-yellow-700">
                      Annual energy cost change: {formatCostImpact(results.energyCostImpact)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Secondary Charts Section */}
          <PolicyCharts results={results} />

          {/* Economic Context Section */}
          {results.economicContext && (
            <EconomicContextCard results={results} className="mb-8" />
          )}

          {/* Action Buttons Section */}
          <ActionButtons />
        </div>
      </div>
    </TooltipProvider>
  );
}