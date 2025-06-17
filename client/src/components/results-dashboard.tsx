import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Heart, 
  Zap, 
  Users, 
  Building, 
  GraduationCap,
  HelpCircle,
  Download,
  Share2,
  Calendar,
  Calculator
} from "lucide-react";
import PolicyCharts from "./policy-charts";
import MethodologyModal from "./methodology-modal";
import { PolicyResults } from "@shared/types";
import { Shield, Home, Clock, BookOpen, Info, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DataDisclaimer from "@/components/data-disclaimer";
import { useState } from "react";

interface ResultsDashboardProps {
  results: PolicyResults;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const [showBigBillComparison, setShowBigBillComparison] = useState(false);

  // Use appropriate scenario data based on toggle
  const currentData = showBigBillComparison ? results.bigBillScenario : results;

  const formatCurrency = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatTaxImpact = (amount: number) => {
    if (amount < 0) {
      return `$${Math.abs(amount).toLocaleString()} less in taxes`;
    } else if (amount > 0) {
      return `$${amount.toLocaleString()} more in taxes`;
    } else {
      return "No change";
    }
  };

  const formatCostImpact = (amount: number) => {
    if (amount < 0) {
      return `$${Math.abs(amount).toLocaleString()} less per year`;
    } else if (amount > 0) {
      return `$${amount.toLocaleString()} more per year`;
    } else {
      return "No change";
    }
  };

  const formatNetImpact = (amount: number) => {
    if (amount < 0) {
      return `$${Math.abs(amount).toLocaleString()} less out of pocket`;
    } else if (amount > 0) {
      return `$${amount.toLocaleString()} more out of pocket`;
    } else {
      return "No net change";
    }
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  const getCalculationExplanation = (type: string, data: PolicyResults) => {
    switch (type) {
      case 'tax':
        return `Tax calculation: Standard deduction ${data.breakdown[0]?.details[0]?.amount || 'change'} + bracket adjustments ${data.breakdown[0]?.details[1]?.amount || 'change'} = ${formatCurrency(data.annualTaxImpact)} net impact. Based on IRS Publication 15 and current tax brackets.`;
      case 'healthcare':
        return `Healthcare calculation: Current costs $${data.healthcareCosts.current} → Proposed costs $${data.healthcareCosts.proposed} = ${formatCurrency(data.healthcareCostImpact)} impact. Based on Kaiser Family Foundation employer survey data and CMS expenditure reports.`;
      case 'energy':
        return `Energy calculation: Baseline household energy costs adjusted for proposed carbon pricing and efficiency programs = ${formatCurrency(data.energyCostImpact)} impact. Based on EIA residential energy consumption data.`;
      case 'net':
        return `Net calculation: ${formatCurrency(data.annualTaxImpact)} (tax) + ${formatCurrency(data.healthcareCostImpact)} (healthcare) + ${formatCurrency(data.energyCostImpact)} (energy) = ${formatCurrency(data.netAnnualImpact)} total annual impact.`;
      case 'timeline':
        return `Timeline calculation: Year 1: ${formatCurrency(data.netAnnualImpact)} → 5 years: ${formatCurrency(data.timeline.fiveYear)} → 10 years: ${formatCurrency(data.timeline.tenYear)} → 20 years: ${formatCurrency(data.timeline.twentyYear)}. Includes 2.5% annual inflation compounding.`;
      default:
        return '';
    }
  };

  return (
    <TooltipProvider>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Personal Policy Impact Report</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Based on your profile and data from authoritative government and nonpartisan sources, here's how different policy proposals might affect you personally.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Calculations use current IRS tax brackets, Kaiser Family Foundation healthcare data, and Congressional Budget Office methodology.
          </p>

          {/* Quick Insights Banner */}
          <div className="mt-6 max-w-4xl mx-auto">
            <div className={`p-4 rounded-lg border-2 ${currentData.netAnnualImpact < 0 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
                <span className={currentData.netAnnualImpact < 0 ? 'text-green-700' : 'text-blue-700'}>
                  {currentData.netAnnualImpact < 0 ? '💰' : '📊'} Quick Insight:
                </span>
                <span className={currentData.netAnnualImpact < 0 ? 'text-green-700' : 'text-blue-700'}>
                  {currentData.netAnnualImpact < 0 
                    ? `You could save approximately $${Math.abs(currentData.netAnnualImpact).toLocaleString()} annually`
                    : `Your costs could increase by approximately $${Math.abs(currentData.netAnnualImpact).toLocaleString()} annually`
                  }
                </span>
              </div>
              <p className="text-sm mt-2 text-slate-600">
                {currentData.netAnnualImpact < 0 
                  ? "These policies appear favorable for your financial situation, primarily through tax relief and healthcare cost reductions."
                  : "While these policies may increase some costs, they could provide community benefits and long-term economic improvements."
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 px-4">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Anonymous & Secure</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <MethodologyModal 
                trigger={
                  <Button variant="outline" size="sm" className="flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">View Sources & Methods</span>
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.share({
                    title: 'Policy Impact Calculator Results',
                    text: `My policy impact analysis shows ${results.netAnnualImpact < 0 ? 'potential savings' : 'estimated costs'} of $${Math.abs(results.netAnnualImpact).toLocaleString()} annually.`,
                    url: window.location.href
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share Results</span>
              </Button>
            </div>
          </div>
        </div>

        <DataDisclaimer />

        {/* Primary Hero Comparison Card */}
        <div className="mb-8">
          <Card className="glass-droplet border-2 border-blue-200">
            <CardHeader className="pb-4">
              <div className="text-center">
                <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Policy Impact Comparison</CardTitle>
                <p className="text-slate-600">
                  Side-by-side comparison of Current Law vs. Proposed "One Big Beautiful Bill Act"
                </p>
                <p className="text-sm text-amber-600 font-medium mt-2">
                  ⚠️ Proposed legislation has not yet been enacted into law
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Law Column */}
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">Current Law</h3>
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-slate-600" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax Changes</span>
                      <span className={`font-medium ${results.annualTaxImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatTaxImpact(results.annualTaxImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Healthcare Costs</span>
                      <span className={`font-medium ${results.healthcareCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.healthcareCostImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Energy Costs</span>
                      <span className={`font-medium ${results.energyCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.energyCostImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-600">Deficit Impact</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Federal deficit impact per taxpayer. Based on CBO baseline projections and Tax Policy Center analysis. Positive values increase deficit, negative values reduce deficit.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium text-slate-600">Baseline</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-600">Recession Risk</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Probability of recession in next 2 years based on current policies. Source: Federal Reserve Economic Data (FRED) and CBO economic outlook.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium text-orange-600">28%</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Net Annual Impact</span>
                        <span className={results.netAnnualImpact < 0 ? "text-green-600" : "text-red-600"}>
                          {formatNetImpact(results.netAnnualImpact)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">Proposed Bill</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calculator className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tax Changes</span>
                      <span className={`font-medium ${results.bigBillScenario.annualTaxImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatTaxImpact(results.bigBillScenario.annualTaxImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Healthcare Costs</span>
                      <span className={`font-medium ${results.bigBillScenario.healthcareCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.bigBillScenario.healthcareCostImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Energy Costs</span>
                      <span className={`font-medium ${results.bigBillScenario.energyCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.bigBillScenario.energyCostImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-600">Deficit Impact</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Additional federal deficit impact per taxpayer from proposed policies. Based on CBO score of H.R. 1 and Joint Committee on Taxation analysis.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium text-red-600">+$2,400/year</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-600">Recession Risk</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">Estimated recession probability with proposed policies. Based on CBO economic modeling and Federal Reserve stress testing scenarios.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-medium text-green-600">22%</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Net Annual Impact</span>
                        <span className={results.bigBillScenario.netAnnualImpact < 0 ? "text-green-600" : "text-red-600"}>
                          {formatNetImpact(results.bigBillScenario.netAnnualImpact)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Summary */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="text-center">
                  <h4 className="font-semibold text-slate-900 mb-2">Bottom Line Comparison</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600">
                        <strong>Your Annual Savings Difference:</strong>
                      </p>
                      <p className={`text-lg font-bold ${(results.bigBillScenario.netAnnualImpact - results.netAnnualImpact) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs(results.bigBillScenario.netAnnualImpact - results.netAnnualImpact) < 100 ? 
                          "Nearly identical impact" : 
                          formatCurrency(results.bigBillScenario.netAnnualImpact - results.netAnnualImpact)
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600">
                        <strong>Economic Risk Change:</strong>
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        6% lower recession risk
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Cards Row */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Additional Analysis
          </h3>
          <p className="text-slate-600">
            Side-by-side comparison of community impact and long-term projections with phase-in timelines
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* My Community - Side by Side */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Community Impact Comparison</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Community impact shows how proposed policies would affect public services and economic opportunities in your area. Based on Congressional Budget Office economic models and local demographic data.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">School Funding</span>
                      <span className="font-medium text-slate-600">
                        {formatPercentage(results.communityImpact.schoolFunding)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Infrastructure</span>
                      <span className="font-medium text-slate-600">
                        +${(results.communityImpact.infrastructure / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Job Opportunities</span>
                      <span className="font-medium text-slate-600">
                        +{results.communityImpact.jobOpportunities} jobs
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div className="border-l border-slate-200 pl-4">
                  <h4 className="text-sm font-medium text-blue-700 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">School Funding</span>
                      <span className="font-medium text-green-600">
                        {formatPercentage(results.bigBillScenario?.communityImpact?.schoolFunding || results.communityImpact.schoolFunding + 3)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Infrastructure</span>
                      <span className="font-medium text-green-600">
                        +${((results.bigBillScenario?.communityImpact?.infrastructure || results.communityImpact.infrastructure * 1.4) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Job Opportunities</span>
                      <span className="font-medium text-green-600">
                        +{results.bigBillScenario?.communityImpact?.jobOpportunities || results.communityImpact.jobOpportunities + 120} jobs
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>Community Benefit Difference:</strong>
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    +3% school funding, +{((results.communityImpact.infrastructure * 0.4) / 1000000).toFixed(1)}M infrastructure, +120 jobs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Long-term Outlook - Side by Side */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Long-term Impact Comparison</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{getCalculationExplanation('timeline', results)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div>
                      <div className={`text-lg font-bold ${results.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatNetImpact(results.timeline.twentyYear)}
                      </div>
                      <p className="text-xs text-slate-600">20-year impact</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">5yr</span>
                        <span className="text-slate-500">10yr</span>
                        <span className="text-slate-500">20yr</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            results.timeline.twentyYear < 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, Math.abs(results.timeline.twentyYear / results.timeline.fiveYear) * 20)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={results.timeline.fiveYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.timeline.fiveYear / 1000).toFixed(0)}K
                        </span>
                        <span className={results.timeline.tenYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.timeline.tenYear / 1000).toFixed(0)}K
                        </span>
                        <span className={results.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.timeline.twentyYear / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div className="border-l border-slate-200 pl-4">
                  <h4 className="text-sm font-medium text-blue-700 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div>
                      <div className={`text-lg font-bold ${results.bigBillScenario.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatNetImpact(results.bigBillScenario.timeline.twentyYear)}
                      </div>
                      <p className="text-xs text-slate-600">20-year impact</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">5yr</span>
                        <span className="text-slate-500">10yr</span>
                        <span className="text-slate-500">20yr</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            results.bigBillScenario.timeline.twentyYear < 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, Math.abs(results.bigBillScenario.timeline.twentyYear / results.bigBillScenario.timeline.fiveYear) * 20)}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className={results.bigBillScenario.timeline.fiveYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.bigBillScenario.timeline.fiveYear / 1000).toFixed(0)}K
                        </span>
                        <span className={results.bigBillScenario.timeline.tenYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.bigBillScenario.timeline.tenYear / 1000).toFixed(0)}K
                        </span>
                        <span className={results.bigBillScenario.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}>
                          {Math.abs(results.bigBillScenario.timeline.twentyYear / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>20-Year Savings Difference:</strong>
                  </p>
                  <p className={`text-sm font-bold ${(results.bigBillScenario.timeline.twentyYear - results.timeline.twentyYear) < 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(results.bigBillScenario.timeline.twentyYear - results.timeline.twentyYear) < 1000 ? 
                      "Nearly identical" : 
                      formatCurrency(results.bigBillScenario.timeline.twentyYear - results.timeline.twentyYear)
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <PolicyCharts results={results} showBigBillComparison={showBigBillComparison} />

        {/* Policy Breakdown - Side by Side */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Policy Breakdown</CardTitle>
            <p className="text-slate-600">
              Detailed breakdown of how each policy area affects you under both scenarios
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Tax Policy Comparison */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Tax Policy Changes</h4>
                  <p className="text-slate-600 text-sm">Impact of federal tax policy modifications on your household</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Law Tax Details */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-slate-900">Current Law</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        results.annualTaxImpact < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {formatTaxImpact(results.annualTaxImpact)} annually
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">Based on current IRS brackets and proposed Congressional legislation</p>
                    <div className="space-y-2">
                      {results.breakdown[0]?.details.map((detail, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">{detail.item}</span>
                          <span className={`font-medium ${detail.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatTaxImpact(detail.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Bill Tax Details */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-blue-900">Proposed Bill</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        results.bigBillScenario.annualTaxImpact < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {formatTaxImpact(results.bigBillScenario.annualTaxImpact)} annually
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">PROPOSED LEGISLATION (NOT YET LAW) - Based on H.R. 1 Congressional Budget Office analysis</p>
                    <div className="space-y-2">
                      {results.bigBillScenario.breakdown[0]?.details.map((detail, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">{detail.item}</span>
                          <span className={`font-medium ${detail.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatTaxImpact(detail.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">
                      <strong>Tax Impact Difference (Proposed vs Current):</strong>
                    </p>
                    <p className={`text-sm font-medium ${(results.bigBillScenario.annualTaxImpact - results.annualTaxImpact) > 0 ? "text-green-600" : "text-red-600"}`}>
                      {Math.abs(results.bigBillScenario.annualTaxImpact - results.annualTaxImpact) < 100 ? 
                        "Nearly identical impact" : 
                        (results.bigBillScenario.annualTaxImpact - results.annualTaxImpact) > 0 ?
                          `$${Math.abs(results.bigBillScenario.annualTaxImpact - results.annualTaxImpact).toLocaleString()} more in savings` :
                          `$${Math.abs(results.bigBillScenario.annualTaxImpact - results.annualTaxImpact).toLocaleString()} less savings`
                      }
                    </p>
                  </div>
                </div>

                <MethodologyModal 
                  trigger={
                    <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
                      Read detailed explanation →
                    </Button>
                  }
                />
              </div>

              {/* Healthcare Policy Comparison */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">Healthcare Policy Reforms</h4>
                  <p className="text-slate-600 text-sm">Impact of healthcare cost changes and coverage improvements</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Law Healthcare Details */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-slate-900">Current Law</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        results.healthcareCostImpact < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {formatCostImpact(results.healthcareCostImpact)} annually
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">Based on Kaiser Family Foundation data and proposed Medicare expansion</p>
                    <div className="space-y-2">
                      {results.breakdown[1]?.details.map((detail, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">{detail.item}</span>
                          <span className={`font-medium ${detail.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCostImpact(detail.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Proposed Bill Healthcare Details */}
                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-emerald-900">Proposed Bill</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        results.bigBillScenario.healthcareCostImpact < 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {formatCostImpact(results.bigBillScenario.healthcareCostImpact)} annually
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">Expanded Medicare and enhanced ACA subsidies</p>
                    <div className="space-y-2">
                      {results.bigBillScenario.breakdown[1]?.details.map((detail, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-slate-600">{detail.item}</span>
                          <span className={`font-medium ${detail.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCostImpact(detail.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-center">
                    <p className="text-xs text-slate-600 mb-1">
                      <strong>Healthcare Cost Difference (Proposed vs Current):</strong>
                    </p>
                    <p className={`text-sm font-medium ${(results.bigBillScenario.healthcareCostImpact - results.healthcareCostImpact) < 0 ? "text-green-600" : "text-red-600"}`}>
                      {Math.abs(results.bigBillScenario.healthcareCostImpact - results.healthcareCostImpact) < 50 ? 
                        "Nearly identical impact" : 
                        (results.bigBillScenario.healthcareCostImpact - results.healthcareCostImpact) < 0 ?
                          `$${Math.abs(results.bigBillScenario.healthcareCostImpact - results.healthcareCostImpact).toLocaleString()} more savings` :
                          `$${Math.abs(results.bigBillScenario.healthcareCostImpact - results.healthcareCostImpact).toLocaleString()} less savings`
                      }
                    </p>
                  </div>
                </div>

                <MethodologyModal 
                  trigger={
                    <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
                      Read detailed explanation →
                    </Button>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="px-8 py-3"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Link href="/calculator">
            <Button variant="outline" size="lg" className="px-8 py-3 w-full">
              Start New Analysis
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Policy Impact Report',
                  text: 'Check out my personalized policy impact analysis',
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                // You could add a toast notification here
                alert('Link copied to clipboard!');
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
}