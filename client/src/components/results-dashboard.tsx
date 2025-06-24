import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MobileTooltip } from "@/components/ui/mobile-tooltip";
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
          {currentData && (
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
          )}
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
                  if (navigator.share) {
                    navigator.share({
                      title: 'Policy Impact Calculator Results',
                      text: `My policy impact analysis shows ${results.netAnnualImpact < 0 ? 'potential savings' : 'estimated costs'} of $${Math.abs(results.netAnnualImpact).toLocaleString()} annually.`,
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
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
          <Card className="bg-card border-2 border-blue-200 shadow-lg">
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
                      <span className="text-slate-600">Deficit Impact</span>
                      <span className="font-medium text-slate-600">Baseline</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Recession Risk</span>
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
                      <span className={`font-medium ${(results.bigBillScenario?.annualTaxImpact || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatTaxImpact(results.bigBillScenario?.annualTaxImpact || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Healthcare Costs</span>
                      <span className={`font-medium ${(results.bigBillScenario?.healthcareCostImpact || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.bigBillScenario?.healthcareCostImpact || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Energy Costs</span>
                      <span className={`font-medium ${(results.bigBillScenario?.energyCostImpact || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCostImpact(results.bigBillScenario?.energyCostImpact || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Deficit Impact</span>
                      <span className="font-medium text-red-600">+$2,400/year</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Recession Risk</span>
                      <span className="font-medium text-green-600">22%</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Net Annual Impact</span>
                        <span className={(results.bigBillScenario?.netAnnualImpact || 0) < 0 ? "text-green-600" : "text-red-600"}>
                          {formatNetImpact(results.bigBillScenario?.netAnnualImpact || 0)}
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
                      <p className={`text-lg font-bold ${((results.bigBillScenario?.netAnnualImpact || 0) - results.netAnnualImpact) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {Math.abs((results.bigBillScenario?.netAnnualImpact || 0) - results.netAnnualImpact) < 100 ? 
                          "Nearly identical impact" : 
                          formatCurrency((results.bigBillScenario?.netAnnualImpact || 0) - results.netAnnualImpact)
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

        {/* Charts Section */}
        {results && <PolicyCharts results={results} showBigBillComparison={showBigBillComparison && !!results.bigBillScenario} />}

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
              Calculate New Scenario
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