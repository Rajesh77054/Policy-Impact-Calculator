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

      // Tax Impact Chart
      if (taxChartRef.current) {
        const taxCtx = taxChartRef.current.getContext('2d');
        if (taxCtx) {
          taxChartInstance.current = new Chart(taxCtx, {
            type: 'line',
            data: {
              labels: ['Current', 'Year 1', 'Year 3', 'Year 5', 'Year 10'],
              datasets: [{
                label: 'Tax Impact',
                data: [
                  0,
                  currentData.annualTaxImpact,
                  currentData.annualTaxImpact * 3,
                  currentData.timeline.fiveYear / 5,
                  currentData.timeline.tenYear / 10
                ],
                borderColor: 'hsl(217, 91%, 60%)',
                backgroundColor: 'hsl(217, 91%, 60%, 0.1)',
                fill: true,
                tension: 0.4
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
                      return (value >= 0 ? '+$' : '-$') + Math.abs(value).toLocaleString();
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
          // Use healthcare costs - for big bill scenario, calculate proposed cost
          const currentCost = results.healthcareCosts?.current || 0;
          const proposedCost = showBigBillComparison
            ? currentCost + currentData.healthcareCostImpact
            : results.healthcareCosts?.proposed || 0;

          healthcareChartInstance.current = new Chart(healthCtx, {
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
            <canvas 
              ref={taxChartRef} 
              id="taxChart"
              className="w-full h-64"
            />
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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Healthcare Cost Comparison</DialogTitle>
                <DialogDescription>
                  This chart compares the total annual healthcare costs between your current situation and the
                  proposed policy changes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">How Current Plan Costs Are Calculated:</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>• <strong>Uninsured:</strong> Estimated annual out-of-pocket costs for medical services ($1,800) plus prescription drugs ($1,480) = $3,280 total</div>
                    <div>• <strong>Employer Insurance:</strong> Your share of premiums plus deductibles and copays</div>
                    <div>• <strong>Marketplace Plans:</strong> Premiums after subsidies plus cost-sharing expenses</div>
                    <div>• <strong>Medicare/Medicaid:</strong> Premiums, supplements, and out-of-pocket costs</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Proposed Plan Benefits:</h4>
                  <div className="space-y-1 text-sm text-slate-600">
                    <div>• Enhanced premium subsidies for marketplace plans</div>
                    <div>• Prescription drug cost caps ($2,000 annually)</div>
                    <div>• Expanded Medicaid eligibility for low-income individuals</div>
                    <div>• Public option availability with lower premiums</div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic">
                  Based on Kaiser Family Foundation employer survey data and CMS expenditure reports.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas 
              ref={healthcareChartRef} 
              id="healthcareChart"
              className="w-full h-64"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}