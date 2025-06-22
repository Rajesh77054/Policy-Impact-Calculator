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
  const [openTaxModal, setOpenTaxModal] = useState(false); // State for Tax Impact Modal
  const [openHealthcareModal, setOpenHealthcareModal] = useState(false); // State for Healthcare Modal


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
                  <CardTitle className="text-lg text-blue-900">Tax Impact Timeline Comparison</CardTitle>
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
                      <span className="text-blue-700">Year 1</span>
                      <span className="font-medium text-slate-600">
                        $0 (baseline)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">5 Years</span>
                      <span className="font-medium text-slate-600">
                        $0 (baseline)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">10 Years</span>
                      <span className="font-medium text-slate-600">
                        $0 (baseline)
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">20 Years</span>
                      <span className="font-medium text-slate-600">
                        $0 (baseline)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">Year 1</span>
                      <span className={`font-medium ${results.annualTaxImpact < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                        {results.annualTaxImpact < 0 ? `$${Math.abs(results.annualTaxImpact).toLocaleString()} saved` : `$${results.annualTaxImpact.toLocaleString()} cost`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">5 Years</span>
                      <span className={`font-medium ${results.timeline.fiveYear < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                        {results.timeline.fiveYear < 0 ? `$${Math.abs(results.timeline.fiveYear / 1000).toFixed(0)}K saved` : `$${Math.abs(results.timeline.fiveYear / 1000).toFixed(0)}K cost`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">10 Years</span>
                      <span className={`font-medium ${results.timeline.tenYear < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                        {results.timeline.tenYear < 0 ? `$${Math.abs(results.timeline.tenYear / 1000).toFixed(0)}K saved` : `$${Math.abs(results.timeline.tenYear / 1000).toFixed(0)}K cost`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-700">20 Years</span>
                      <span className={`font-medium ${results.timeline.twentyYear < 0 ? 'text-green-700' : 'text-orange-700'}`}>
                        {results.timeline.twentyYear < 0 ? `$${Math.abs(results.timeline.twentyYear / 1000).toFixed(0)}K saved` : `$${Math.abs(results.timeline.twentyYear / 1000).toFixed(0)}K cost`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-center">
                  <p className="text-xs text-blue-700">20-Year Tax Savings Difference:</p>
                  <p className="text-sm font-semibold text-blue-800">
                    Consolidated Big Bill CBO Data
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
                        ${results.healthcareCosts.current.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Deductible</span>
                      <span className="font-medium text-green-900">
                        ${(results.healthcareCosts.current * 0.3).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Out-of-Pocket Max</span>
                      <span className="font-medium text-green-900">
                        ${(results.healthcareCosts.current * 1.8).toLocaleString()}
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
                  <h4 className="text-sm font-medium text-green-800 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Annual Premium</span>
                      <span className="font-medium text-green-900">
                        ${results.healthcareCosts.proposed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Deductible</span>
                      <span className="font-medium text-green-900">
                        ${(results.healthcareCosts.proposed * 0.2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-green-700">Out-of-Pocket Max</span>
                      <span className="font-medium text-green-900">
                        ${(results.healthcareCosts.proposed * 1.5).toLocaleString()}
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
    </div>
  );
}