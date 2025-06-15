import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { PolicyResults } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      const currentData = showBigBillComparison ? results.bigBillScenario : results;

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
            { year: 'Year 1', value: results.bigBillScenario.annualTaxImpact },
            { year: 'Year 3', value: results.bigBillScenario.annualTaxImpact * 3 * 1.025 },
            { year: 'Year 5', value: results.bigBillScenario.timeline.fiveYear },
            { year: 'Year 10', value: results.bigBillScenario.timeline.tenYear }
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
                      return (value >= 0 ? '+' : '') + '$' + Math.abs(value).toLocaleString();
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
          const proposedBillCost = results.bigBillScenario.healthcareCosts?.proposed || results.healthcareCosts.proposed;

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
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Tax Impact Over Time Comparison */}
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
                    <p className="text-xs">Comparison of cumulative tax impact over time between Current Law and Proposed Bill scenarios</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas 
                  ref={taxChartRef} 
                  id="taxChart"
                  className="w-full h-64"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-600">
                  <span className="inline-block w-3 h-3 bg-slate-500 rounded mr-1"></span>
                  Current Law
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded mr-1 ml-4"></span>
                  Proposed Bill
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Healthcare Cost Comparison */}
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
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-between">
                <Heart className="w-5 h-5 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <canvas 
                  ref={healthcareChartRef} 
                  id="healthcareChart"
                  className="w-full h-64"
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-xs text-slate-600">
                  <span className="inline-block w-3 h-3 bg-slate-500 rounded mr-1"></span>
                  Current Law Healthcare Cost
                  <span className="inline-block w-3 h-3 bg-green-500 rounded mr-1 ml-4"></span>
                  Proposed Bill Healthcare Cost
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}