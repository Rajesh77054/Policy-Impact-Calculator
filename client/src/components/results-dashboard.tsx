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

        {/* Hero Section - Annual Savings */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-4xl font-bold text-emerald-900 mb-2">
                Save ${Math.abs(currentData?.netAnnualImpact || 0).toLocaleString()}
              </CardTitle>
              <p className="text-emerald-700 text-lg">
                Your estimated annual savings from proposed policy changes
              </p>
              <p className="text-sm text-emerald-600 mt-1">
                Based on your personal profile and current tax/healthcare situation
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Savings Over Time Chart */}
        <div className="mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Your Savings Over Time</CardTitle>
              <p className="text-center text-slate-600">How much you could save each year with proposed changes</p>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <canvas ref={(canvas) => {
                  if (canvas && currentData) {
                    import('chart.js/auto').then(({ default: Chart }) => {
                      // Destroy existing chart
                      const existingChart = Chart.getChart(canvas);
                      if (existingChart) {
                        existingChart.destroy();
                      }

                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        new Chart(ctx, {
                          type: 'bar',
                          data: {
                            labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 10', 'Year 15', 'Year 20'],
                            datasets: [{
                              label: 'Annual Savings',
                              data: [
                                Math.abs(currentData.netAnnualImpact),
                                Math.abs(currentData.netAnnualImpact) * 1.02,
                                Math.abs(currentData.netAnnualImpact) * 1.05,
                                Math.abs(currentData.netAnnualImpact) * 1.08,
                                Math.abs(currentData.timeline.fiveYear / 5),
                                Math.abs(currentData.timeline.tenYear / 10),
                                Math.abs(currentData.timeline.tenYear / 10) * 1.1,
                                Math.abs(currentData.timeline.twentyYear / 20)
                              ],
                              backgroundColor: 'rgba(16, 185, 129, 0.8)',
                              borderColor: 'rgba(16, 185, 129, 1)',
                              borderWidth: 2,
                              borderRadius: 8,
                              borderSkipped: false,
                            }]
                          },
                          options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    return `$${context.parsed.y.toLocaleString()} saved`;
                                  }
                                }
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function(value) {
                                    return '$' + value.toLocaleString();
                                  }
                                },
                                grid: {
                                  color: 'rgba(0, 0, 0, 0.1)'
                                }
                              },
                              x: {
                                grid: {
                                  display: false
                                }
                              }
                            }
                          }
                        });
                      }
                    });
                  }
                }} className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Tax Savings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Tax Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Annual Tax Impact</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${Math.abs(currentData?.annualTaxImpact || 0).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>5 Year Total</span>
                    <span className="font-medium">${Math.abs(currentData?.timeline.fiveYear || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>10 Year Total</span>
                    <span className="font-medium">${Math.abs(currentData?.timeline.tenYear || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>20 Year Total</span>
                    <span className="font-medium">${Math.abs(currentData?.timeline.twentyYear || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Savings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Healthcare Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Annual Healthcare Impact</span>
                  <span className="text-2xl font-bold text-green-600">
                    ${Math.abs(currentData?.healthcareCostImpact || 0).toLocaleString()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Annual Cost</span>
                    <span className="font-medium">${(currentData?.healthcareCosts.current || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Proposed Annual Cost</span>
                    <span className="font-medium">${(currentData?.healthcareCosts.proposed || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Annual Savings</span>
                    <span className="font-medium">${Math.abs((currentData?.healthcareCosts.current || 0) - (currentData?.healthcareCosts.proposed || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Impact Section */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Community Impact</CardTitle>
              <p className="text-center text-slate-600">How these policies could benefit your local area</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">School Funding</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPercentage(currentData?.communityImpact.schoolFunding || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Increase in local education funding</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Infrastructure</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatPercentage(currentData?.communityImpact.infrastructure || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Improvement in local infrastructure</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Job Opportunities</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPercentage(currentData?.communityImpact.jobOpportunities || 0)}
                  </p>
                  <p className="text-sm text-slate-600">Growth in local employment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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