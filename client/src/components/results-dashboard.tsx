import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown, Calculator, DollarSign, Heart, Zap, Building, Users, Shield } from "lucide-react";
import { PolicyResults } from "@shared/types";
import PolicyCharts from "./policy-charts";
import NetFinancialImpactChart from "./net-financial-impact-chart";

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

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const showBigBillComparison = Boolean(results.bigBillScenario);

  const formatCurrency = (amount: number): string => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(0)}k`;
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
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-4">
            <div className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                Your Net Annual Benefit
              </CardTitle>
              <div className="text-5xl font-bold text-green-600 mb-3">
                {formatTaxImpact(results.netAnnualImpact)}
              </div>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                This represents your total annual financial benefit from the 
                proposed policy, accounting for tax relief, healthcare savings, and 
                any additional costs.
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Primary Chart - Net Financial Impact Over Time */}
        <NetFinancialImpactChart results={results} showBigBillComparison={showBigBillComparison} />

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
                  {formatTaxImpact(results.annualTaxImpact)}
                </div>
                <p className="text-sm text-green-600 mb-3">
                  Annual tax savings from policy changes
                </p>
                <div className="text-xs text-green-700">
                  20-year total: {formatTaxImpact(results.annualTaxImpact * 20)}
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
                  {formatCostImpact(results.healthcareCostImpact)}
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
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Long-term Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700 mb-2">
                  {formatTaxImpact(results.timeline.twentyYear)}
                </div>
                <p className="text-sm text-blue-600 mb-3">
                  Cumulative 20-year benefit
                </p>
                <div className="text-xs text-blue-700">
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
          <PolicyCharts results={results} showBigBillComparison={showBigBillComparison} />
        </div>
      </div>
    </TooltipProvider>
  );
}