import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Shield, BookOpen, AlertTriangle } from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  organization: string;
  url: string;
  lastUpdated: string;
  credibility: "government" | "nonpartisan" | "academic";
  description: string;
}

interface MethodologyData {
  sources: DataSource[];
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

interface MethodologyModalProps {
  trigger: React.ReactNode;
}

export default function MethodologyModal({ trigger }: MethodologyModalProps) {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Data Sources & Methodology</span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : methodologyData ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full mb-4 sm:mb-6 flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-1 overflow-x-auto sm:overflow-x-visible">
              <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Overview</TabsTrigger>
              <TabsTrigger value="calculations" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Your Results</TabsTrigger>
              <TabsTrigger value="sources" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Data Sources</TabsTrigger>
              <TabsTrigger value="methodology" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Methods</TabsTrigger>
              <TabsTrigger value="limitations" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Limitations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Transparency Commitment</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      {methodologyData.methodology.overview}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tax Calculations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      {methodologyData.methodology.tax_calculations.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Healthcare Costs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      {methodologyData.methodology.healthcare_calculations.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">Important Disclaimer</h4>
                    <p className="text-sm text-amber-800 mt-1">
                      {methodologyData.methodology.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calculations" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">How Your Results Were Calculated</h4>
                    <p className="text-sm text-blue-800 mt-1">
                      These calculations are specific to your profile and show exactly how we arrived at your personalized results.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <span>Tax Impact Calculation</span>
                      <Badge variant="secondary">
                        {/* This would need to be passed as a prop - for now showing placeholder */}
                        Your Result
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <div className="space-y-1">
                        <div>1. <strong>Current tax calculation:</strong> Applied your income to current IRS brackets</div>
                        <div>2. <strong>Proposed tax calculation:</strong> Applied enhanced standard deduction and policy changes</div>
                        <div>3. <strong>Net difference:</strong> Proposed tax minus current tax = your impact</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Based on IRS Publication 15, Tax Foundation data, and Congressional Budget Office scoring methodology.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Healthcare Cost Calculation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <div className="space-y-2">
                        <div><strong>1. Current costs calculation by insurance type:</strong></div>
                        <div className="ml-4 space-y-1 text-xs">
                          <div>• <strong>Uninsured:</strong> Estimated annual out-of-pocket costs including medical services ($1,800 individual, $3,500 family) plus prescription drugs ($1,480 average)</div>
                          <div>• <strong>Employer insurance:</strong> Employee premium share plus deductibles and cost-sharing, adjusted for employer contribution rates</div>
                          <div>• <strong>Marketplace plans:</strong> Premiums after ACA subsidies plus average deductible costs (about 30% of deductible)</div>
                          <div>• <strong>Medicare:</strong> Part B + Part D premiums plus Medigap supplements, with IRMAA surcharges for higher incomes</div>
                          <div>• <strong>Medicaid:</strong> Minimal out-of-pocket costs for non-covered services</div>
                        </div>
                        <div><strong>2. Policy adjustments:</strong> Applied proposed subsidies, prescription drug caps ($2,000 annually), Medicare expansion, and Medicaid expansion</div>
                        <div><strong>3. Net impact:</strong> Proposed costs minus current costs = your annual savings or additional costs</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Based on Kaiser Family Foundation Employer Health Benefits Survey and CMS National Health Expenditure data.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline Projection Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="bg-slate-50 p-3 rounded text-sm">
                      <div className="space-y-1">
                        <div>1. <strong>Base annual impact:</strong> Your net annual result</div>
                        <div>2. <strong>Inflation adjustment:</strong> 2.5% compounding annually (CBO standard)</div>
                        <div>3. <strong>Cumulative totals:</strong> Sum of adjusted annual impacts over time periods</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">
                      Uses Congressional Budget Office inflation methodology and policy implementation timelines.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-4">
              <div className="space-y-4">
                {methodologyData.sources.map((source) => (
                  <Card key={source.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <p className="text-sm text-slate-600 mt-1">{source.organization}</p>
                        </div>
                        {getCredibilityBadge(source.credibility)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 mb-3">{source.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Last updated: {new Date(source.lastUpdated).toLocaleDateString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => window.open(source.url, '_blank')}
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Source
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="methodology" className="space-y-4">
              <div className="space-y-6">
                {Object.entries(methodologyData.methodology).map(([key, section]) => {
                  if (key === "overview" || key === "disclaimer" || typeof section !== "object") return null;
                  
                  const typedSection = section as {
                    description: string;
                    methodology: string[];
                    limitations: string;
                  };
                  
                  return (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="text-lg capitalize">
                          {key.replace(/_/g, " ")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-slate-700">{typedSection.description}</p>
                        
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Methodology Steps:</h4>
                          <ol className="list-decimal list-inside space-y-1">
                            {typedSection.methodology.map((step, index) => (
                              <li key={index} className="text-sm text-slate-600">{step}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="bg-slate-50 border border-slate-200 rounded p-3">
                          <h5 className="font-medium text-slate-800 text-sm mb-1">Limitations:</h5>
                          <p className="text-xs text-slate-600">{typedSection.limitations}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="limitations" className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="font-semibold text-amber-900 mb-4">Understanding the Limitations</h3>
                <div className="space-y-4 text-sm text-amber-800">
                  <div>
                    <h4 className="font-medium mb-2">Income Estimates</h4>
                    <p>Calculations use median values within income ranges. Your actual impact may vary significantly based on your specific income, deductions, and credits.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Policy Implementation</h4>
                    <p>Proposed policy changes are based on current legislative proposals. Actual implementation may differ in scope, timing, and details.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Geographic Variations</h4>
                    <p>State and local calculations use averages. Costs and impacts can vary significantly within states and metropolitan areas.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Timeline Projections</h4>
                    <p>Multi-year estimates include inflation assumptions that may not reflect actual economic conditions.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">For More Accurate Estimates</h4>
                <p className="text-sm text-blue-800">
                  Consult with qualified tax professionals, financial advisors, or use official government calculators for specific financial planning decisions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-slate-500">
            Unable to load methodology information.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}