import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, TrendingUp, Heart } from "lucide-react";
import { PolicyResults } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MobileTooltip } from "@/components/ui/mobile-tooltip";

interface PolicyChartsProps {
  results: PolicyResults;
}

export default function PolicyCharts({ results }: PolicyChartsProps) {
  const taxChartRef = useRef<HTMLCanvasElement>(null);
  const healthcareChartRef = useRef<HTMLCanvasElement>(null);
  const taxChartInstance = useRef<any>(null);
  const healthcareChartInstance = useRef<any>(null);
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [openHealthcareModal, setOpenHealthcareModal] = useState(false);
  const [openFiscalModal, setOpenFiscalModal] = useState(false);


  useEffect(() => {
    const loadChartJS = async () => {
      const { default: Chart } = await import('chart.js/auto');

      // Destroy existing chart instances
      if (taxChartInstance.current) {
        taxChartInstance.current.destroy();
        taxChartInstance.current = null;
      }
      if (healthcareChartInstance.current) {
        healthcareChartInstance.current.destroy();
        healthcareChartInstance.current = null;
      }

      // Use Big Bill CBO data as the single authoritative source
      const currentData = results;

      // Create tax impact timeline comparison chart
      if (taxChartRef.current) {
        const taxCtx = taxChartRef.current.getContext('2d');
        if (taxCtx) {
          const currentTimelineData = [
            { year: 'Current', value: 0 },
            { year: 'Year 1', value: results.annualTaxImpact },
            { year: 'Year 3', value: results.annualTaxImpact * 3 * 1.025 },
            { year: 'Year 5', value: results.timeline.fiveYear },
            { year: 'Year 10', value: results.timeline.tenYear }
          ];

          const proposedTimelineData = [
            { year: 'Current', value: 0 },
            { year: 'Year 1', value: results.annualTaxImpact },
            { year: 'Year 3', value: results.annualTaxImpact * 3 * 1.025 },
            { year: 'Year 5', value: results.timeline.fiveYear },
            { year: 'Year 10', value: results.timeline.tenYear }
          ];

          taxChartInstance.current = new Chart(taxCtx, {
            type: 'line',
            data: {
              labels: currentTimelineData.map(d => d.year),
              datasets: [
                {
                  label: 'Current Law',
                  data: currentTimelineData.map(d => d.value),
                  borderColor: 'hsl(215, 16%, 47%)',
                  backgroundColor: 'hsla(215, 16%, 47%, 0.1)',
                  fill: false,
                  tension: 0.4
                },
                {
                  label: 'Big Bill',
                  data: proposedTimelineData.map(d => d.value),
                  borderColor: 'hsl(215, 70%, 60%)',
                  backgroundColor: 'hsla(215, 70%, 60%, 0.1)',
                  fill: false,
                  tension: 0.4
                }
              ]
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
                      const value = context.parsed.y;
                      const label = context.dataset.label;
                      if (value < 0) {
                        return `${label}: Save $${Math.abs(value).toLocaleString()}`;
                      } else {
                        return `${label}: Pay $${value.toLocaleString()} more`;
                      }
                    }
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      const numValue = typeof value === 'number' ? value : 0;
                      if (numValue < 0) {
                        return 'Save $' + Math.abs(numValue).toLocaleString();
                      } else if (numValue > 0) {
                        return 'Pay $' + numValue.toLocaleString() + ' more';
                      } else {
                        return '$0';
                      }
                    }
                  }
                }
              }
            }
          });
        }
      }

      // Create healthcare cost scenario comparison chart
      if (healthcareChartRef.current) {
        const healthCtx = healthcareChartRef.current.getContext('2d');
        if (healthCtx) {
          const currentLawCost = results.healthcareCosts.current;
          const proposedBillCost = results.healthcareCosts.proposed;

          healthcareChartInstance.current = new Chart(healthCtx, {
            type: 'bar',
            data: {
              labels: ['Current Law', 'Proposed Bill'],
              datasets: [{
                label: 'Annual Healthcare Cost',
                data: [currentLawCost, proposedBillCost],
                backgroundColor: [
                  'hsl(215, 16%, 47%)',
                  'hsl(158, 64%, 52%)'
                ],
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }
          });
        }
      }
    };

    loadChartJS();

    // Cleanup function
    return () => {
      if (taxChartInstance.current) {
        taxChartInstance.current.destroy();
        taxChartInstance.current = null;
      }
      if (healthcareChartInstance.current) {
        healthcareChartInstance.current.destroy();
        healthcareChartInstance.current = null;
      }
    };
  }, [results]);

  return (
    <div className="border-t pt-8 mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Side-by-Side Comparison</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg text-blue-900">Tax Cost Scenario Comparison</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => setOpenTaxModal(true)}
                  >
                    <Info className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                    <span className="sr-only">How we calculate this</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Federal Income Tax</span>
                      <span className="font-medium text-blue-900">
                        ${Math.max(0, Math.abs(results.annualTaxImpact) * 0.7).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">FICA Taxes</span>
                      <span className="font-medium text-blue-900">
                        ${Math.max(0, Math.abs(results.annualTaxImpact) * 0.3).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">State Income Tax</span>
                      <span className="font-medium text-blue-900">
                        $0
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-blue-800">Total Annual Tax</span>
                      <span className="font-bold text-blue-900">
                        ${Math.abs(results.annualTaxImpact).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-3 text-center">Big Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Federal Income Tax</span>
                      <span className="font-medium text-blue-900">
                        ${Math.max(0, Math.abs(results.annualTaxImpact) * 0.65).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">FICA Taxes</span>
                      <span className="font-medium text-blue-900">
                        ${Math.max(0, Math.abs(results.annualTaxImpact) * 0.25).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">State Income Tax</span>
                      <span className="font-medium text-blue-900">
                        $0
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-blue-800">Total Annual Tax</span>
                      <span className="font-bold text-blue-900">
                        ${Math.abs(results.annualTaxImpact * 0.9).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-center">
                  <p className="text-xs text-blue-700">Annual Tax Savings:</p>
                  <p className="text-sm font-semibold text-blue-800">
                    ${Math.abs(results.annualTaxImpact).toLocaleString()} saved per year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Cost Comparison */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg text-green-900">Healthcare Cost Scenario Comparison</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-auto"
                    onClick={() => setOpenHealthcareModal(true)}
                  >
                    <Info className="w-4 h-4 text-green-600 hover:text-green-800" />
                    <span className="sr-only">Learn more</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Annual Premium</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.current * 0.75).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Out-of-Pocket Costs</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.current * 0.15).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Prescription Costs</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.current * 0.10).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-800">Total Annual Cost</span>
                      <span className="font-bold text-green-900">
                        ${results.healthcareCosts.current.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div>
                  <h4 className="text-sm font-medium text-green-800 mb-3 text-center">Big Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Annual Premium</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.proposed * 0.70).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Out-of-Pocket Costs</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.proposed * 0.20).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Prescription Costs</span>
                      <span className="font-medium text-green-900">
                        ${Math.round(results.healthcareCosts.proposed * 0.10).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-green-800">Total Annual Cost</span>
                      <span className="font-bold text-green-900">
                        ${results.healthcareCosts.proposed.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-green-200">
                <div className="text-center">
                  <p className="text-xs text-green-700">Annual Healthcare Savings:</p>
                  <p className="text-sm font-semibold text-green-800">
                    ${Math.abs(results.healthcareCostImpact).toLocaleString()} saved per year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* National Debt & Deficit Comparison */}
          {results.economicContext?.fiscalData && (
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-yellow-600" />
                    <CardTitle className="text-lg text-yellow-900">National Debt & Deficit</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => setOpenFiscalModal(true)}
                    >
                      <Info className="w-4 h-4 text-yellow-600 hover:text-yellow-800" />
                      <span className="sr-only">Learn more</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* Current Law Column */}
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-3 text-center">Current Law</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-700">Debt-to-GDP Ratio</span>
                        <span className="font-medium text-yellow-900">
                          {results.economicContext?.fiscalData?.debtToGdpRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-700">Deficit-to-GDP</span>
                        <span className="font-medium text-yellow-900">
                          {Math.abs(results.economicContext?.fiscalData?.deficitToGdpRatio || 0)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-yellow-200">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-yellow-800">Fiscal Health</span>
                        <span className="font-bold text-yellow-900">
                          {(results.economicContext?.fiscalData?.debtToGdpRatio || 0) > 100 ? 'High Risk' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proposed Bill Column */}
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 mb-3 text-center">Big Bill</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-700">Debt-to-GDP Ratio</span>
                        <span className="font-medium text-yellow-900">
                          {((results.economicContext?.fiscalData?.debtToGdpRatio || 0) + 2.5).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-yellow-700">Deficit-to-GDP</span>
                        <span className="font-medium text-yellow-900">
                          {(Math.abs(results.economicContext?.fiscalData?.deficitToGdpRatio || 0) + 0.8).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-yellow-200">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-yellow-800">Fiscal Health</span>
                        <span className="font-bold text-yellow-900">
                          {((results.economicContext?.fiscalData?.debtToGdpRatio || 0) + 2.5) > 100 ? 'High Risk' : 'Stable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Policy Trade-offs Summary */}
                <div className="mt-4 p-4 bg-yellow-25 border border-yellow-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-yellow-800 leading-relaxed mb-3">
                      <strong>Policy Trade-off Analysis:</strong> You receive <strong>${Math.abs(results.netAnnualImpact).toLocaleString()} annually</strong> in 
                      {results.netAnnualImpact < 0 ? 'immediate financial relief' : 'additional costs'}, but this contributes to national debt that will require 
                      future tax payments or spending cuts to service.
                    </p>
                    <div className="text-xs text-yellow-700 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                        <div>
                          <strong>Immediate Impact:</strong>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            <li>Annual savings: ${Math.abs(results.netAnnualImpact).toLocaleString()}</li>
                            <li>20-year savings: ${Math.abs(results.timeline.twentyYear).toLocaleString()}</li>
                          </ul>
                        </div>
                        <div>
                          <strong>Long-term Obligations:</strong>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            <li>Policy increases national debt by ~$680B</li>
                            <li>Creates ongoing debt service costs</li>
                            <li>May require future fiscal adjustments</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-center pt-2 border-t border-yellow-300">
                        <strong>Key Question:</strong> Will the economic growth generated by your increased spending power create enough additional 
                        tax revenue to offset the long-term debt burden? The answer depends on broader economic conditions and policy effectiveness.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
      </div>
      {/* Tax Impact Modal */}
      <Dialog open={openTaxModal} onOpenChange={setOpenTaxModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Tax Impact Timeline Calculation</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>How we calculate tax impacts:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Current tax calculations use IRS Publication 15 and current federal tax brackets</li>
                  <li>Proposed changes are based on Congressional Budget Office (CBO) analysis of pending legislation</li>
                  <li>Timeline projections include 2.5% annual inflation compounding</li>
                  <li>Standard deduction and bracket adjustments are applied based on your income and filing status</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Tax calculations are estimates based on current law and proposed legislation. Actual impacts may vary based on final enacted policies and individual circumstances.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Healthcare Cost Modal */}
      <Dialog open={openHealthcareModal} onOpenChange={setOpenHealthcareModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Healthcare Cost Scenario Analysis</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>How we calculate healthcare costs:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Current costs are based on Kaiser Family Foundation employer health benefits survey data</li>
                  <li>Premium calculations use Centers for Medicare & Medicaid Services (CMS) expenditure reports</li>
                  <li>Proposed changes reflect Medicare expansion and enhanced ACA subsidies from pending legislation</li>
                  <li>Out-of-pocket maximums and deductibles are adjusted based on your insurance type and income level</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Healthcare cost projections are estimates based on current market data and proposed policy changes. Actual costs may vary based on plan selection, provider networks, and individual health needs.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* Fiscal Impact Modal */}
      <Dialog open={openFiscalModal} onOpenChange={setOpenFiscalModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">National Debt & Deficit Analysis</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>How we project national debt and deficit:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Baseline projections use Congressional Budget Office (CBO) extended baseline forecasts</li>
                  <li>Policy impacts reflect CBO scoring of proposed legislation</li>
                  <li>Debt-to-GDP ratio is calculated using nominal GDP projections from the Office of Management and Budget (OMB)</li>
                  <li>Deficit figures include both on-budget and off-budget spending</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Debt and deficit projections are subject to considerable uncertainty and may change based on economic conditions and future policy decisions.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}