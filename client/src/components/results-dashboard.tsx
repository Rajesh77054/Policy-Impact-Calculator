import { Shield, Download, Share2, Calculator, Home, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PolicyResults } from "@shared/schema";
import PolicyCharts from "@/components/policy-charts";

interface ResultsDashboardProps {
  results: PolicyResults;
}

export default function ResultsDashboard({ results }: ResultsDashboardProps) {
  const formatCurrency = (amount: number) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}$${Math.abs(amount).toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Personal Policy Impact Report</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Based on your profile, here's how different policy proposals might affect you personally.
          </p>
          <div className="flex justify-center items-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-emerald-600">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Anonymous & Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Report</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards Row */}
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
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Annual Tax Impact</span>
                  <span className={`font-medium ${results.annualTaxImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.annualTaxImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Healthcare Costs</span>
                  <span className={`font-medium ${results.healthcareCostImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.healthcareCostImpact)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Energy Costs</span>
                  <span className={`font-medium ${results.energyCostImpact >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.energyCostImpact)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between font-semibold">
                    <span>Net Annual Impact</span>
                    <span className={results.netAnnualImpact >= 0 ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(results.netAnnualImpact)}
                    </span>
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
              <CardTitle className="text-lg font-semibold">Timeline</CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">5-Year Impact</span>
                  <span className={`font-medium ${results.timeline.fiveYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.timeline.fiveYear)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">10-Year Impact</span>
                  <span className={`font-medium ${results.timeline.tenYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.timeline.tenYear)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">20-Year Impact</span>
                  <span className={`font-medium ${results.timeline.twentyYear >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(results.timeline.twentyYear)}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex justify-between font-semibold">
                    <span>Best Period</span>
                    <span className="text-green-600">Years 5-10</span>
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
                        policy.impact >= 0 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {formatCurrency(policy.impact)} annually
                    </span>
                  </div>
                  <div className="space-y-3">
                    {policy.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex justify-between text-sm">
                        <span className="text-slate-600">{detail.item}</span>
                        <span className={`font-medium ${detail.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(detail.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="mt-4 p-0 h-auto text-sm text-primary">
                    Read detailed explanation →
                  </Button>
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
  );
}
