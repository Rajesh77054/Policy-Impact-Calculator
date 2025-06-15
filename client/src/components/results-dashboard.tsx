import { Shield, Download, Share2, Calculator, Home, Clock, BookOpen, Info, HelpCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PolicyResults } from "@shared/schema";
import PolicyCharts from "@/components/policy-charts";
import MethodologyModal from "@/components/methodology-modal";
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
            <div className={`p-4 rounded-lg border-2 ${results.netAnnualImpact < 0 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-center space-x-2 text-lg font-semibold">
                <span className={results.netAnnualImpact < 0 ? 'text-green-700' : 'text-blue-700'}>
                  {results.netAnnualImpact < 0 ? '💰' : '📊'} Quick Insight:
                </span>
                <span className={results.netAnnualImpact < 0 ? 'text-green-700' : 'text-blue-700'}>
                  {results.netAnnualImpact < 0 
                    ? `You could save approximately $${Math.abs(results.netAnnualImpact).toLocaleString()} annually`
                    : `Your costs could increase by approximately $${Math.abs(results.netAnnualImpact).toLocaleString()} annually`
                  }
                </span>
              </div>
              <p className="text-sm mt-2 text-slate-600">
                {results.netAnnualImpact < 0 
                  ? "These policies appear favorable for your financial situation, primarily through tax relief and healthcare cost reductions."
                  : "While these policies may increase some costs, they could provide community benefits and long-term economic improvements."
                }
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Anonymous & Secure</span>
            </div>
            <MethodologyModal 
              trigger={
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>View Sources & Methods</span>
                </Button>
              }
            />
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My Policy Impact Report',
                      text: 'Check out my personalized policy impact analysis',
                      url: window.location.href
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Report</span>
              </Button>
            </div>
          </div>
        </div>

        <DataDisclaimer />

        {/* Policy Scenario Toggle */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-blue-900">Policy Scenario Comparison</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">
                    Compare your results under current law vs. proposed "One Big Beautiful Bill Act"
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Label htmlFor="bill-toggle" className="text-sm font-medium text-blue-900">
                    {showBigBillComparison ? "Proposed Bill" : "Current Law"}
                  </Label>
                  <Switch
                    id="bill-toggle"
                    checked={showBigBillComparison}
                    onCheckedChange={setShowBigBillComparison}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-white rounded-md p-3 border border-blue-200">
                <p className="text-xs text-slate-600">
                  <strong>Current Law:</strong> Shows impact based on existing federal and state policies.
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Proposed Bill:</strong> Shows projected impact if H.R. 1 "One Big Beautiful Bill Act" becomes law. 
                  <span className="text-amber-600 font-medium"> This is proposed legislation that has not yet been enacted.</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards Row */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Your Personal Impact {showBigBillComparison && <span className="text-blue-600">- Proposed Legislation Scenario</span>}
          </h3>
          <p className="text-slate-600 text-sm">
            How {showBigBillComparison ? "the proposed One Big Beautiful Bill Act" : "current policies"} would affect your finances and community
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* My Wallet */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">My Wallet</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">{getCalculationExplanation('net', results)}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3 p-3 bg-slate-50 rounded-md">
                <p className="text-xs text-slate-600">
                  <strong>Green</strong> = You save money | <strong>Red</strong> = You pay more
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-600">Tax Changes</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{getCalculationExplanation('tax', results)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={`font-medium ${currentData.annualTaxImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatTaxImpact(currentData.annualTaxImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-600">Healthcare Costs</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Healthcare Cost Calculation:</p>
                          <p className="text-xs">Current costs: ${results.healthcareCosts.current.toLocaleString()} annually</p>
                          <p className="text-xs">Proposed costs: ${results.healthcareCosts.proposed.toLocaleString()} annually</p>
                          <p className="text-xs">Net impact: {formatCostImpact(results.healthcareCostImpact)}</p>
                          <div className="pt-1 border-t border-slate-200">
                            <p className="text-xs text-slate-500">For uninsured individuals, current costs include estimated out-of-pocket expenses for medical services and prescription drugs.</p>
                            <p className="text-xs text-slate-400 italic mt-1">Based on Kaiser Family Foundation employer survey data and CMS expenditure reports.</p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={`font-medium ${currentData.healthcareCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCostImpact(currentData.healthcareCostImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-600">Energy Costs</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{getCalculationExplanation('energy', results)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={`font-medium ${currentData.energyCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCostImpact(currentData.energyCostImpact)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Net Annual Impact</span>
                      <span className={currentData.netAnnualImpact < 0 ? "text-green-600" : "text-red-600"}>
                        {formatNetImpact(currentData.netAnnualImpact)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {results.netAnnualImpact < 0 
                        ? `You would save approximately $${Math.abs(results.netAnnualImpact).toLocaleString()} annually under these policies`
                        : `You would pay approximately $${Math.abs(results.netAnnualImpact).toLocaleString()} more annually under these policies`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Community */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">My Community</CardTitle>
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
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">School Funding</span>
                  <span className="font-medium text-green-600">
                    {formatPercentage(currentData.communityImpact?.schoolFunding || results.communityImpact.schoolFunding)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Infrastructure</span>
                  <span className="font-medium text-green-600">
                    +${((currentData.communityImpact?.infrastructure || results.communityImpact.infrastructure) / 1000000).toFixed(1)}M local
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Job Opportunities</span>
                  <span className="font-medium text-green-600">
                    +{currentData.communityImpact?.jobOpportunities || results.communityImpact.jobOpportunities} jobs
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between font-semibold">
                    <span>Overall Impact</span>
                    <span className="text-green-600">Positive</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Long-term Outlook */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Long-term Outlook</CardTitle>
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
              <div className="space-y-4">
                <div>
                  <div className={`text-2xl font-bold ${currentData.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatNetImpact(currentData.timeline.twentyYear)}
                  </div>
                  <p className="text-sm text-slate-600">20-year cumulative impact</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5 years</span>
                    <span>10 years</span>
                    <span>20 years</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        currentData.timeline.twentyYear < 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, Math.abs(currentData.timeline.twentyYear / currentData.timeline.fiveYear) * 20)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={currentData.timeline.fiveYear < 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(currentData.timeline.fiveYear).toLocaleString()}
                    </span>
                    <span className={currentData.timeline.tenYear < 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(currentData.timeline.tenYear).toLocaleString()}
                    </span>
                    <span className={currentData.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(currentData.timeline.twentyYear).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Trend</span>
                    <span className={`text-sm font-medium ${
                      Math.abs(currentData.timeline.twentyYear) > Math.abs(currentData.netAnnualImpact) && currentData.timeline.twentyYear < 0
                        ? "text-green-600" 
                        : "text-orange-600"
                    }`}>
                      {Math.abs(currentData.timeline.twentyYear) > Math.abs(currentData.netAnnualImpact) && currentData.timeline.twentyYear < 0
                        ? "Savings grow over time" 
                        : "Benefits may emerge later"
                      }
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <PolicyCharts results={results} showBigBillComparison={showBigBillComparison} />

        {/* Policy Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Policy Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(showBigBillComparison ? results.bigBillScenario?.breakdown || results.breakdown : results.breakdown).map((policy, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900">{policy.title}</h4>
                      <p className="text-slate-600 mt-1">{policy.description}</p>
                    </div>
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        policy.impact < 0
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {policy.category === "tax" ? formatTaxImpact(policy.impact) : formatCostImpact(policy.impact)} annually
                    </span>
                  </div>
                  <div className="space-y-3">
                    {policy.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex justify-between text-sm">
                        <span className="text-slate-600">{detail.item}</span>
                        <span className={`font-medium ${detail.amount < 0 ? "text-green-600" : "text-red-600"}`}>
                          {policy.category === "tax" ? formatTaxImpact(detail.amount) : formatCostImpact(detail.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <MethodologyModal 
                    trigger={
                      <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
                        Read detailed explanation →
                      </Button>
                    }
                  />
                </div>
              ))}
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