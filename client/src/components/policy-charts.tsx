import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { PolicyResults } from "@shared/schema";

interface PolicyChartsProps {
  results: PolicyResults;
}

export default function PolicyCharts({ results }: PolicyChartsProps) {
  const taxChartRef = useRef<HTMLCanvasElement>(null);
  const healthcareChartRef = useRef<HTMLCanvasElement>(null);

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
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
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
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
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
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <Info className="w-4 h-4 mr-1" />
            How we calculate this
          </Button>
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
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <ExternalLink className="w-4 h-4 mr-1" />
            Learn more
          </Button>
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
