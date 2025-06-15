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
}

export default function PolicyCharts({ results }: PolicyChartsProps) {
  const taxChartRef = useRef<HTMLCanvasElement>(null);
  const healthcareChartRef = useRef<HTMLCanvasElement>(null);
  const [openTaxModal, setOpenTaxModal] = useState(false); // State for Tax Impact Modal
  const [openHealthcareModal, setOpenHealthcareModal] = useState(false); // State for Healthcare Modal


  useEffect(() => {
    // Load Chart.js dynamically
    const loadChartJS = async () => {
      const { default: Chart } = await import('chart.js/auto');

      // Tax Impact Chart
      if (taxChartRef.current) {
        const taxCtx = taxChartRef.current.getContext('2d');
        if (taxCtx) {
          new Chart(taxCtx, {
            type: 'line',
            data: {
              labels: ['Current', 'Year 1', 'Year 3', 'Year 5', 'Year 10'],
              datasets: [{
                label: 'Tax Impact',
                data: [
                  0,
                  results.annualTaxImpact,
                  results.annualTaxImpact * 1.05,
                  results.annualTaxImpact * 1.15,
                  results.annualTaxImpact * 1.35
                ],
                borderColor: 'hsl(221, 83%, 53%)',
                backgroundColor: 'hsla(221, 83%, 53%, 0.1)',
                tension: 0.4,
                fill: true
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: function (value) {
                      const sign = value >= 0 ? '+' : '';
                      return sign + '$' + Math.abs(value);
                    }
                  }
                }
              }
            }
          });
        }
      }

      // Healthcare Chart - using real calculated costs
      if (healthcareChartRef.current) {
        const healthCtx = healthcareChartRef.current.getContext('2d');
        if (healthCtx) {
          // Use actual healthcare costs from calculations
          const currentCost = results.healthcareCosts?.current || 0;
          const proposedCost = results.healthcareCosts?.proposed || 0;

          new Chart(healthCtx, {
            type: 'bar',
            data: {
              labels: ['Current Plan', 'Proposed Plan'],
              datasets: [{
                label: 'Annual Cost',
                data: [currentCost, proposedCost],
                backgroundColor: [
                  'hsl(215, 16%, 47%)',
                  proposedCost <= currentCost ? 'hsl(158, 64%, 52%)' : 'hsl(348, 83%, 47%)'
                ],
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom'
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
  }, [results]);

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      {/* Tax Impact Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Tax Impact Over Time</CardTitle>
          <Dialog open={openTaxModal} onOpenChange={setOpenTaxModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Info className="w-4 h-4 mr-1" />
                How we calculate this
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tax Impact Calculation</DialogTitle>
                <DialogDescription>
                  This projection shows the potential tax impact if current policy proposals were to remain 
                  stable over time. It includes adjustments for inflation and income growth.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="font-medium text-amber-800 mb-1">Important Limitations:</p>
                  <ul className="text-amber-700 space-y-1 text-xs">
                    <li>• Tax laws frequently change with new legislation</li>
                    <li>• Different administrations may reverse policies</li>
                    <li>• Economic conditions affect policy implementation</li>
                    <li>• This represents a baseline scenario only</li>
                  </ul>
                </div>
                <p className="text-slate-600">
                  Use this chart to understand the trajectory of specific proposals, not as a guarantee 
                  of future tax obligations. Real outcomes will depend on future political and economic developments.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={taxChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      {/* Healthcare Costs Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-semibold">Healthcare Cost Comparison</CardTitle>
          <Dialog open={openHealthcareModal} onOpenChange={setOpenHealthcareModal}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                <Info className="w-4 h-4 mr-1" />
                Learn more
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Healthcare Cost Comparison</DialogTitle>
                <DialogDescription>
                  This chart compares the total annual healthcare costs between your current plan and the
                  proposed plan. Both bars show the total annual cost you would pay. The "Current Plan" shows
                  your existing healthcare expenses. The "Proposed Plan" shows what you would pay under the new
                  policy. A green bar indicates lower costs (savings), while a red bar indicates higher costs.
                </DialogDescription>
              </DialogHeader>
              {/* Add more detailed explanation here, including how the costs are determined */}
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={healthcareChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}