import { Shield, Download, Share2, Calculator, Home, Clock, BookOpen, Info, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PolicyResults } from "@shared/schema";
import PolicyCharts from "@/components/policy-charts";
import MethodologyModal from "@/components/methodology-modal";
import DataDisclaimer from "@/components/data-disclaimer";

interface ResultsDashboardProps {
  results: PolicyResults;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
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
        return `Tax changes: ${data.annualTaxImpact < 0 ? 'Savings from' : 'Costs from'} proposed federal tax policy changes including standard deduction increases and bracket adjustments. Based on current IRS tax tables.`;
      case 'healthcare':
        return `Healthcare costs: ${data.healthcareCostImpact < 0 ? 'Savings from' : 'Additional costs from'} proposed healthcare policies. For uninsured individuals, this represents elimination of out-of-pocket costs through expanded Medicaid coverage.`;
      case 'energy':
        return `Energy costs: ${data.energyCostImpact < 0 ? 'Savings from' : 'Additional costs from'} proposed energy policies including carbon pricing and efficiency programs. Based on average household energy consumption.`;
      case 'net':
        return `Net Annual Impact: Total of all policy changes (${formatCurrency(data.annualTaxImpact)} tax + ${formatCurrency(data.healthcareCostImpact)} healthcare + ${formatCurrency(data.energyCostImpact)} energy = ${formatCurrency(data.netAnnualImpact)})`;
      case 'timeline':
        return `Timeline projections include inflation adjustments (2.5% annually) and compound effects. Shows cumulative financial impact over different time periods.`;
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
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Report</span>
              </Button>
            </div>
          </div>
        </div>

        <DataDisclaimer />

        {/* Summary Cards Row */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Your Personal Impact</h3>
          <p className="text-slate-600 text-sm">How the proposed policies would affect your finances and community</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* My Wallet */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold">My Wallet</CardTitle>
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
                  <span className={`font-medium ${results.annualTaxImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatTaxImpact(results.annualTaxImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-600">Healthcare Costs</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{getCalculationExplanation('healthcare', results)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className={`font-medium ${results.healthcareCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCostImpact(results.healthcareCostImpact)}
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
                  <span className={`font-medium ${results.energyCostImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCostImpact(results.energyCostImpact)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <div className="flex items-center space-x-1">
                        <span>Net Annual Impact</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">{getCalculationExplanation('net', results)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className={results.netAnnualImpact < 0 ? "text-green-600" : "text-red-600"}>
                        {formatNetImpact(results.netAnnualImpact)}
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
              <CardTitle className="text-lg font-semibold">My Community</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">School Funding</span>
                  <span className="font-medium text-green-600">
                    {formatPercentage(results.communityImpact.schoolFunding)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Infrastructure</span>
                  <span className="font-medium text-green-600">
                    +${(results.communityImpact.infrastructure / 1000000).toFixed(1)}M local
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Job Opportunities</span>
                  <span className="font-medium text-green-600">
                    +{results.communityImpact.jobOpportunities} jobs
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

          {/* Timeline */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Timeline</CardTitle>
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
            
              <div className="mb-3 p-3 bg-slate-50 rounded-md">
                <p className="text-xs text-slate-600">
                  <strong>Cumulative financial impact</strong> from policy changes over time
                </p>
              </div>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">5-Year Total</span>
                  <span className={`font-medium ${results.timeline.fiveYear > 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatNetImpact(results.timeline.fiveYear)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">10-Year Total</span>
                  <span className={`font-medium ${results.timeline.tenYear > 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatNetImpact(results.timeline.tenYear)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">20-Year Total</span>
                  <span className={`font-medium ${results.timeline.twentyYear > 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatNetImpact(results.timeline.twentyYear)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="space-y-1">
                    {(() => {
                      const periods = [
                        { name: "Year 1", value: results.netAnnualImpact },
                        { name: "Years 1-5", value: results.timeline.fiveYear },
                        { name: "Years 1-10", value: results.timeline.tenYear },
                        { name: "Years 1-20", value: results.timeline.twentyYear }
                      ];

                      // Find the period with the best (highest) net impact
                      const bestPeriod = periods.reduce((best, current) => 
                        current.value > best.value ? current : best
                      );

                      // Check if any period is actually beneficial (positive)
                      const hasBeneficialPeriod = periods.some(p => p.value > 0);

                      if (hasBeneficialPeriod) {
                        return (
                          <div className="flex justify-between font-semibold">
                            <span>Best Period</span>
                            <span className="text-green-600">{bestPeriod.name}</span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex justify-between font-semibold">
                            <span>Impact Trend</span>
                            <span className="text-orange-600">Costs increase over time</span>
                          </div>
                        );
                      }
                    })()}
                    <p className="text-xs text-slate-500">
                      {results.timeline.fiveYear > 0 || results.timeline.tenYear > 0 || results.timeline.twentyYear > 0
                        ? "Timeline shows when policies provide the most benefit"
                        : "All periods show net costs. Consider how policy benefits may emerge over time."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <PolicyCharts results={results} />

        {/* Policy Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Policy Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.breakdown.map((policy, index) => (
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
          <Button size="lg" className="px-8 py-3">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            Start New Analysis
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-3">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
}