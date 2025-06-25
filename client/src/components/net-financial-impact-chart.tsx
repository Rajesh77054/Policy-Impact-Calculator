import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PolicyResults } from "@shared/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface NetFinancialImpactChartProps {
  results: PolicyResults;
}

export default function NetFinancialImpactChart({ results }: NetFinancialImpactChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const loadChart = async () => {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart if it exists
      Chart.getChart(ctx)?.destroy();

      const currentYear = new Date().getFullYear();
      const timelineData = [
        {
          year: currentYear,
          current: 0,
          proposed: 0,
          label: 'Today'
        },
        {
          year: currentYear + 1,
          current: 0,
          proposed: results.netAnnualImpact,
          label: 'Year 1'
        },
        {
          year: currentYear + 5,
          current: 0,
          proposed: results.timeline.fiveYear,
          label: '5 Years'
        },
        {
          year: currentYear + 10,
          current: 0,
          proposed: results.timeline.tenYear,
          label: '10 Years'
        },
        {
          year: currentYear + 20,
          current: 0,
          proposed: results.timeline.twentyYear,
          label: '20 Years'
        }
      ];

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: timelineData.map(d => d.label),
          datasets: [
            {
              label: 'Current Law',
              data: timelineData.map(d => d.current),
              borderColor: '#64748b',
              backgroundColor: 'rgba(100, 116, 139, 0.1)',
              borderWidth: 3,
              pointBackgroundColor: '#64748b',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              tension: 0.3,
              fill: false
            },
            {
              label: 'With Policy Changes',
              data: timelineData.map(d => d.proposed),
              borderColor: results.netAnnualImpact < 0 ? '#059669' : '#dc2626',
              backgroundColor: results.netAnnualImpact < 0 ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.1)',
              borderWidth: 3,
              pointBackgroundColor: results.netAnnualImpact < 0 ? '#059669' : '#dc2626',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              tension: 0.3,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 14,
                  weight: 'normal'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#374151',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const value = context.parsed.y;
                  const label = context.dataset.label;
                  if (value === 0) {
                    return `${label}: No change (baseline)`;
                  }
                  if (value < 0) {
                    return `${label}: Save $${Math.abs(value).toLocaleString()}`;
                  }
                  return `${label}: Pay $${value.toLocaleString()} more`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'rgba(203, 213, 225, 0.5)'
              },
              ticks: {
                font: {
                  size: 12
                },
                color: '#64748b'
              }
            },
            y: {
              grid: {
                display: true,
                color: 'rgba(203, 213, 225, 0.5)'
              },
              ticks: {
                font: {
                  size: 12
                },
                color: '#64748b',
                callback: function(value) {
                  const numValue = Number(value);
                  if (numValue === 0) return '$0';
                  if (numValue < 0) {
                    return `Save $${Math.abs(numValue).toLocaleString()}`;
                  }
                  return `+$${numValue.toLocaleString()}`;
                }
              }
            }
          }
        }
      });
    };

    loadChart();
  }, [results]);

  return (
    <Card className="border-2 border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-slate-900 flex items-center">
            {results.netAnnualImpact < 0 ? (
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 mr-2 text-orange-600" />
            )}
            Financial Impact Timeline
          </CardTitle>
        </div>
        <p className="text-sm text-slate-600 mt-2">Cumulative financial impact over time, showing how the Big Bill policy changes affect your finances in the long term</p>
      </CardHeader>
      <CardContent>
        <div className="h-80 relative">
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
        
        {/* Key Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Year 1 Impact</div>
            <div className={`text-lg font-bold ${results.netAnnualImpact < 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {results.netAnnualImpact < 0 ? 
                `Save $${Math.abs(results.netAnnualImpact).toLocaleString()}` : 
                `Pay $${results.netAnnualImpact.toLocaleString()} more`}
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">10-Year Impact</div>
            <div className={`text-lg font-bold ${results.timeline.tenYear < 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {results.timeline.tenYear < 0 ? 
                `Save $${Math.abs(results.timeline.tenYear).toLocaleString()}` : 
                `Pay $${results.timeline.tenYear.toLocaleString()} more`}
            </div>
          </div>
          
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">20-Year Impact</div>
            <div className={`text-lg font-bold ${results.timeline.twentyYear < 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {results.timeline.twentyYear < 0 ? 
                `Save $${Math.abs(results.timeline.twentyYear).toLocaleString()}` : 
                `Pay $${results.timeline.twentyYear.toLocaleString()} more`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}