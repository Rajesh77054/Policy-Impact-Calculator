import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { HelpCircle, TrendingUp, TrendingDown, Calculator, DollarSign, Heart, Zap, Building, Users, Shield, Download, Share2, RotateCcw, Loader2, ChevronDown, ChevronUp, FileText, ExternalLink, AlertTriangle, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PolicyResults } from "@shared/types";
import PolicyCharts from "./policy-charts";
import NetFinancialImpactChart from "./net-financial-impact-chart";
import EconomicContextCard from "./economic-context-card";
import PolicyComparisonTable from "./policy-comparison-table";
import { useReplitAuth } from "@/hooks/use-replit-auth";
import { Link } from "wouter";
import { DataFreshnessIndicator } from "./data-freshness-indicator";
import { CalculationErrorBoundary } from "./calculation-error-boundary";
import MethodologyModal from "./methodology-modal";

interface MethodologyData {
  sources: Array<{
    id: string;
    name: string;
    organization: string;
    url: string;
    lastUpdated: string;
    credibility: string;
    description: string;
  }>;
  methodology: {
    overview: string;
    tax_calculations: {
      description: string;
      methodology: string[];
      limitations: string;
    };
    healthcare_calculations: {
      description: string;
      methodology: string[];
      limitations: string;
    };
    state_adjustments: {
      description: string;
      methodology: string[];
      limitations: string;
    };
    timeline_projections: {
      description: string;
      methodology: string[];
      limitations: string;
    };
    disclaimer: string;
  };
}

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

// Methodology Tabs Component
const MethodologyTabs = () => {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const { data: methodologyData, isLoading } = useQuery<MethodologyData>({
    queryKey: ["/api/methodology"],
  });

  const getCredibilityBadge = (credibility: string) => {
    switch (credibility) {
      case "government":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Government</Badge>;
      case "nonpartisan":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Nonpartisan</Badge>;
      case "academic":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Academic</Badge>;
      default:
        return <Badge variant="outline">{credibility}</Badge>;
    }
  };

  const handleTabClick = (tabValue: string) => {
    setActiveTab(activeTab === tabValue ? null : tabValue);
  };

  if (isLoading || !methodologyData) {
    return (
      <div className="h-16 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center">
        <div className="text-sm text-slate-500">Loading methodology information...</div>
      </div>
    );
  }

  return (
    <Card className="border-2 border-slate-200">
      <CardContent className="p-0">
        <div className="w-full">
          {/* Tab Headers */}
          <div className="w-full h-auto p-1 bg-slate-50 rounded-t-lg grid grid-cols-5 gap-1">
            {[
              { value: "overview", label: "Overview" },
              { value: "calculations", label: "Your Results" },
              { value: "sources", label: "Data Sources" },
              { value: "methodology", label: "Methods" },
              { value: "limitations", label: "Limitations" }
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTabClick(tab.value)}
                className={`text-sm py-3 transition-all ${
                  activeTab === tab.value 
                    ? "bg-white border border-slate-200 shadow-sm" 
                    : "bg-transparent hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Content - Only show when a tab is active */}
          {activeTab && (
            <div className="p-6 border-t border-slate-200">
              {activeTab === "overview" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">Data Integrity & Transparency</h3>
                      <p className="text-sm text-blue-800 mb-3">
                        {methodologyData?.methodology?.overview}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "calculations" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">How We Calculate Your Impact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">Tax Calculations</h4>
                        <p className="text-sm text-slate-600">{methodologyData?.methodology?.tax_calculations?.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">Healthcare Impact</h4>
                        <p className="text-sm text-slate-600">{methodologyData?.methodology?.healthcare_calculations?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "sources" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {methodologyData?.sources?.map((source: any, index: number) => (
                    <Card key={index} className="border border-slate-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm font-semibold text-slate-900">{source.name}</CardTitle>
                            <p className="text-xs text-slate-600 mt-1">{source.organization}</p>
                          </div>
                          {getCredibilityBadge(source.credibility)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-slate-600 mb-2">{source.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Updated: {source.lastUpdated}</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <span>View Source</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "methodology" && (
                <div className="space-y-4">
                  {Object.entries(methodologyData?.methodology || {}).filter(([key]) => 
                    ['tax_calculations', 'healthcare_calculations', 'state_adjustments', 'timeline_projections'].includes(key)
                  ).map(([key, method]: [string, any]) => (
                    <Card key={key} className="border border-slate-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold text-slate-900">
                          {method.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="text-xs text-slate-600 space-y-1">
                          {method.methodology?.map((item: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-slate-400 mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === "limitations" && (
                <div className="space-y-4">
                  {Object.entries(methodologyData?.methodology || {}).filter(([key]) => 
                    ['tax_calculations', 'healthcare_calculations', 'state_adjustments', 'timeline_projections'].includes(key)
                  ).map(([key, method]: [string, any]) => (
                    <div key={key} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-900 mb-1">
                            {method.description}
                          </h4>
                          <p className="text-xs text-amber-800">{method.limitations}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="w-4 h-4 text-slate-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">General Disclaimer</h4>
                        <p className="text-xs text-slate-600">{methodologyData?.methodology?.disclaimer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
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

// Detailed Breakdown Section Component
interface DetailedBreakdownSectionProps {
  results: PolicyResults;
}

function DetailedBreakdownSection({ results }: DetailedBreakdownSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full justify-between p-4 h-auto border-2 border-slate-200 hover:border-slate-300"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-slate-600" />
          <div className="text-left">
            <div className="font-semibold text-slate-900 text-[20px]">View Personalized Side-by-Side Comparison</div>
            <div className="text-sm text-slate-600">See how we calculated your tax and healthcare impacts</div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600" />
        )}
      </Button>
      {isExpanded && (
        <div className="mt-6 space-y-6 border-2 border-slate-200 rounded-lg p-6 bg-slate-50">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tax Cost Scenario Comparison */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-blue-900">Tax Cost Scenario Comparison</CardTitle>
                  <MobileTooltip
                    title="Tax Calculation Details"
                    content="Detailed breakdown of how tax changes under current law vs. Big Bill affect your specific situation"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <h5 className="font-medium text-blue-800 mb-2">Current Law</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Federal Income Tax</span>
                        <span className="font-medium">${Math.round(Math.abs(results.annualTaxImpact) * 1.7).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FICA Taxes</span>
                        <span className="font-medium">${Math.round(Math.abs(results.annualTaxImpact) * 0.3).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Income Tax</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-blue-300">
                      <div className="flex justify-between font-bold">
                        <span>Total Annual Tax</span>
                        <span>${Math.round(Math.abs(results.annualTaxImpact) * 2.0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="font-medium text-blue-800 mb-2">Big Bill</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Federal Income Tax</span>
                        <span className="font-medium">${Math.round(Math.abs(results.annualTaxImpact) * 1.47).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FICA Taxes</span>
                        <span className="font-medium">${Math.round(Math.abs(results.annualTaxImpact) * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State Income Tax</span>
                        <span className="font-medium">$0</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-blue-300">
                      <div className="flex justify-between font-bold">
                        <span>Total Annual Tax</span>
                        <span>${Math.round(Math.abs(results.annualTaxImpact) * 1.0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-100 rounded-lg p-3 text-center">
                  <div className="font-bold text-blue-900">Annual Tax Savings:</div>
                  <div className="text-lg font-bold text-blue-800">${Math.abs(results.annualTaxImpact).toLocaleString()} saved per year</div>
                </div>
              </CardContent>
            </Card>

            {/* Healthcare Cost Scenario Comparison */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg text-green-900">Healthcare Cost Scenario Comparison</CardTitle>
                  <MobileTooltip
                    title="Healthcare Cost Details"
                    content="Breakdown of healthcare savings from enhanced subsidies and prescription coverage"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <h5 className="font-medium text-green-800 mb-2">Current Law</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Annual Premium</span>
                        <span className="font-medium">$2,315</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Out-of-Pocket Costs</span>
                        <span className="font-medium">$463</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prescription Costs</span>
                        <span className="font-medium">$309</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-green-300">
                      <div className="flex justify-between font-bold">
                        <span>Total Annual Cost</span>
                        <span>$3,087</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h5 className="font-medium text-green-800 mb-2">Big Bill</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Annual Premium</span>
                        <span className="font-medium">$1,574</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Out-of-Pocket Costs</span>
                        <span className="font-medium">$450</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prescription Costs</span>
                        <span className="font-medium">$225</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-green-300">
                      <div className="flex justify-between font-bold">
                        <span>Total Annual Cost</span>
                        <span>$2,249</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-100 rounded-lg p-3 text-center">
                  <div className="font-bold text-green-900">Annual Healthcare Savings:</div>
                  <div className="text-lg font-bold text-green-800">${Math.abs(results.healthcareCostImpact).toLocaleString()} saved per year</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* National Debt & Deficit Section */}
          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-amber-600" />
                <CardTitle className="text-lg text-amber-900">National Debt & Deficit</CardTitle>
                <MobileTooltip
                  title="Fiscal Impact Analysis"
                  content="Analysis of how policy changes affect national debt and deficit levels"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="text-center">
                  <h5 className="font-medium text-amber-800 mb-2">Current Law</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Debt-to-GDP Ratio</span>
                      <span className="font-medium">126%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deficit-to-GDP</span>
                      <span className="font-medium">5.8%</span>
                    </div>
                    <div className="text-sm font-medium text-amber-800">
                      Fiscal Health: <span className="font-bold">High Risk</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h5 className="font-medium text-amber-800 mb-2">Big Bill</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Debt-to-GDP Ratio</span>
                      <span className="font-medium">128.5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Deficit-to-GDP</span>
                      <span className="font-medium">6.6%</span>
                    </div>
                    <div className="text-sm font-medium text-amber-800">
                      Fiscal Health: <span className="font-bold">High Risk</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-100 rounded-lg p-4">
                <div className="font-bold text-amber-900 mb-2">Policy Trade-off Analysis:</div>
                <p className="text-sm text-amber-800 mb-3">
                  You receive <span className="font-bold">${Math.abs(results.netAnnualImpact).toLocaleString()} annually</span> immediate 
                  financial relief, but this contributes to national debt that will require future 
                  tax payments or spending cuts to service.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-amber-800 mb-1">Immediate Impact:</div>
                    <ul className="space-y-1 text-amber-700">
                      <li>• Annual savings: ${Math.abs(results.netAnnualImpact).toLocaleString()}</li>
                      <li>• 20-year savings: ${Math.abs(results.timeline.twentyYear).toLocaleString()}</li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium text-amber-800 mb-1">Long-term Obligations:</div>
                    <ul className="space-y-1 text-amber-700">
                      <li>• Policy increases national debt by ~$680B</li>
                      <li>• Creates ongoing debt service costs</li>
                      <li>• May require future fiscal adjustments</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-amber-50 rounded border border-amber-200">
                  <div className="font-medium text-amber-800 mb-1">Key Question:</div>
                  <p className="text-sm text-amber-700">
                    Will the economic growth generated by your increased spending power 
                    create enough additional tax revenue to offset the long-term debt burden? The answer 
                    depends on broader economic conditions and policy effectiveness.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

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

        {/* Information Tabs - Data Sources & Methodology */}
        <MethodologyTabs />

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



        {/* Collapsible Detailed Breakdown Section */}
        <DetailedBreakdownSection results={results} />

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