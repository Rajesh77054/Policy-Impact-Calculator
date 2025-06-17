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

interface PolicyChartsProps {
  results: PolicyResults;
  showBigBillComparison: boolean;
}

export default function PolicyCharts({ results, showBigBillComparison }: PolicyChartsProps) {
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

      // Use appropriate scenario data based on toggle
      const currentData = showBigBillComparison && results.bigBillScenario ? results.bigBillScenario : results;

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
            { year: 'Year 1', value: results.bigBillScenario?.annualTaxImpact || 0 },
            { year: 'Year 3', value: (results.bigBillScenario?.annualTaxImpact || 0) * 3 * 1.025 },
            { year: 'Year 5', value: results.bigBillScenario?.timeline.fiveYear || 0 },
            { year: 'Year 10', value: results.bigBillScenario?.timeline.tenYear || 0 }
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
                  label: 'Proposed Bill',
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
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      const numValue = typeof value === 'number' ? value : 0;
                      return (numValue >= 0 ? '+' : '') + '$' + Math.abs(numValue).toLocaleString();
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
          const proposedBillCost = results.bigBillScenario?.healthcareCosts?.proposed || results.healthcareCosts.proposed;

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
  }, [results, showBigBillComparison]);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">
        Visual Analysis
      </h3>
      <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Tax Impact Timeline Comparison</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => setOpenTaxModal(true)}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      How we calculate this
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Tax impact over time under Current Law vs. Proposed Bill scenarios</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Year 1</span>
                      <span className={`font-medium ${results.annualTaxImpact < 0 ? "text-green-600" : "text-red-600"}`}>
                        {results.annualTaxImpact < 0 ? `$${Math.abs(results.annualTaxImpact).toLocaleString()} saved` : `$${results.annualTaxImpact.toLocaleString()} cost`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">5 Years</span>
                      <span className={`font-medium ${results.timeline.fiveYear < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(results.timeline.fiveYear / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">10 Years</span>
                      <span className={`font-medium ${results.timeline.tenYear < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(results.timeline.tenYear / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">20 Years</span>
                      <span className={`font-medium ${results.timeline.twentyYear < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs(results.timeline.twentyYear / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div className="border-l border-slate-200 pl-4">
                  <h4 className="text-sm font-medium text-blue-700 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Year 1</span>
                      <span className={`font-medium ${(results.bigBillScenario?.annualTaxImpact || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        {(results.bigBillScenario?.annualTaxImpact || 0) < 0 ? `$${Math.abs(results.bigBillScenario?.annualTaxImpact || 0).toLocaleString()} saved` : `$${(results.bigBillScenario?.annualTaxImpact || 0).toLocaleString()} cost`}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">5 Years</span>
                      <span className={`font-medium ${(results.bigBillScenario?.timeline.fiveYear || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs((results.bigBillScenario?.timeline.fiveYear || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">10 Years</span>
                      <span className={`font-medium ${(results.bigBillScenario?.timeline.tenYear || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs((results.bigBillScenario?.timeline.tenYear || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">20 Years</span>
                      <span className={`font-medium ${(results.bigBillScenario?.timeline.twentyYear || 0) < 0 ? "text-green-600" : "text-red-600"}`}>
                        ${Math.abs((results.bigBillScenario?.timeline.twentyYear || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>20-Year Tax Savings Difference:</strong>
                  </p>
                  <p className={`text-sm font-medium ${((results.bigBillScenario?.timeline.twentyYear || 0) - results.timeline.twentyYear) < 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs((results.bigBillScenario?.timeline.twentyYear || 0) - results.timeline.twentyYear) < 1000 ? 
                      "Nearly identical" : 
                      `$${Math.abs(((results.bigBillScenario?.timeline.twentyYear || 0) - results.timeline.twentyYear) / 1000).toFixed(0)}K additional savings`
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Cost Comparison - Side by Side */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-1">
                <CardTitle className="text-lg font-semibold">Healthcare Cost Scenario Comparison</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-auto"
                      onClick={() => setOpenHealthcareModal(true)}
                    >
                      <Info className="w-4 h-4 mr-1" />
                      Learn more
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">Annual healthcare costs under Current Law vs. Proposed Bill scenarios</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {/* Current Law Column */}
                <div>
                  <h4 className="text-sm font-medium text-slate-700 mb-3 text-center">Current Law</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Annual Premium</span>
                      <span className="font-medium text-slate-600">
                        ${results.healthcareCosts.current.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Deductible</span>
                      <span className="font-medium text-slate-600">
                        ${(results.healthcareCosts.current * 0.3).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Out-of-Pocket Max</span>
                      <span className="font-medium text-slate-600">
                        ${(results.healthcareCosts.current * 1.8).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Annual Cost</span>
                      <span className="text-slate-600">
                        ${results.healthcareCosts.current.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Proposed Bill Column */}
                <div className="border-l border-slate-200 pl-4">
                  <h4 className="text-sm font-medium text-blue-700 mb-3 text-center">Proposed Bill</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Annual Premium</span>
                      <span className="font-medium text-green-600">
                        ${results.bigBillScenario?.healthcareCosts?.proposed?.toLocaleString() || results.healthcareCosts.proposed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Deductible</span>
                      <span className="font-medium text-green-600">
                        ${((results.bigBillScenario?.healthcareCosts?.proposed || results.healthcareCosts.proposed) * 0.2).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Out-of-Pocket Max</span>
                      <span className="font-medium text-green-600">
                        ${((results.bigBillScenario?.healthcareCosts?.proposed || results.healthcareCosts.proposed) * 1.5).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Annual Cost</span>
                      <span className="text-green-600">
                        ${((results.bigBillScenario?.healthcareCosts?.proposed || results.healthcareCosts.proposed)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-600 mb-1">
                    <strong>Annual Healthcare Savings:</strong>
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    ${Math.abs(results.bigBillScenario.healthcareCostImpact || results.healthcareCostImpact).toLocaleString()} saved per year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}