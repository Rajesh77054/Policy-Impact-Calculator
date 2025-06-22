import { useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { PolicyResults } from "@shared/types";

interface NetFinancialImpactChartProps {
  results: PolicyResults;
  showBigBillComparison: boolean;
}

export default function NetFinancialImpactChart({ results, showBigBillComparison }: NetFinancialImpactChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const loadChartAndRender = async () => {
      const { default: Chart } = await import('chart.js/auto');
      
      // Destroy existing chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }

      const ctx = chartRef.current?.getContext('2d');
      if (!ctx) return;

      // Use appropriate scenario data based on toggle
      const currentData = showBigBillComparison ? results.bigBillScenario : results;
      const purchasingPowerData = currentData?.purchasingPower || results.purchasingPower;

      if (!purchasingPowerData) return;

      const years = purchasingPowerData.currentScenario.map(d => d.year);

      // Calculate net financial impact (proposed - current) for each year
      const netImpactData = years.map((year, index) => {
        const currentIncome = purchasingPowerData.currentScenario[index]?.projectedDisposableIncome || 0;
        const proposedIncome = purchasingPowerData.proposedScenario[index]?.projectedDisposableIncome || 0;
        return proposedIncome - currentIncome;
      });

      // Separate positive and negative values for different styling
      const positiveData = netImpactData.map(value => value > 0 ? value : null);
      const negativeData = netImpactData.map(value => value < 0 ? value : null);

      // Check if datasets have any actual data (not all null)
      const hasPositiveData = positiveData.some(value => value !== null);
      const hasNegativeData = negativeData.some(value => value !== null);

      // Calculate cumulative impact over time
      const cumulativeImpact = netImpactData.reduce((acc, impact, index) => {
        const total = netImpactData.slice(0, index + 1).reduce((sum, val) => sum + val, 0);
        acc.push(total);
        return acc;
      }, [] as number[]);

      // Build datasets conditionally based on data availability
      const datasets: any[] = [
        {
          label: 'Cumulative Impact Trend',
          type: 'line',
          data: cumulativeImpact,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 4,
          fill: false,
          tension: 0.2,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          yAxisID: 'y1',
          order: 0, // Ensures this line is drawn on top
        }
      ];

      // Only add positive data dataset if it has values
      if (hasPositiveData) {
        datasets.push({
          label: 'Savings (Positive Impact)',
          data: positiveData as any,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 1, // Drawn after the line
        } as any);
      }

      // Only add negative data dataset if it has values
      if (hasNegativeData) {
        datasets.push({
          label: 'Costs (Negative Impact)',
          data: negativeData as any,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 2, // Drawn last
        } as any);
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: datasets as any
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Your Additional Savings Over Time',
              font: {
                size: 16,
                weight: 'bold'
              },
              color: '#1e293b'
            },
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: false,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                title: (context) => `Year ${context[0].label}`,
                label: (context) => {
                  const value = context.parsed.y;
                  if (value === null) return '';
                  
                  const datasetLabel = context.dataset.label;
                  
                  // Handle cumulative trend line
                  if (datasetLabel === 'Cumulative Impact Trend') {
                    const prefix = value >= 0 ? '+' : '';
                    return `Cumulative Savings: ${prefix}$${Math.abs(value).toLocaleString()}`;
                  }
                  
                  // Handle annual impact bars
                  const isPositive = value > 0;
                  const prefix = isPositive ? '+' : '';
                  const label = isPositive ? 'Additional Savings' : 'Additional Cost';
                  
                  return `${label}: ${prefix}$${Math.abs(value).toLocaleString()}`;
                },
                afterBody: (context) => {
                  const dataIndex = context[0].dataIndex;
                  const annualImpact = netImpactData[dataIndex];
                  const cumulativeValue = cumulativeImpact[dataIndex];
                  
                  // Only show additional context if we're not already showing cumulative data
                  const showingCumulative = context.some(item => item.dataset.label === 'Cumulative Impact Trend');
                  if (showingCumulative) return [];
                  
                  const cumulativePrefix = cumulativeValue >= 0 ? '+' : '';
                  const annualPrefix = annualImpact >= 0 ? '+' : '';
                  
                  return [
                    '',
                    `Annual Impact: ${annualPrefix}$${Math.abs(annualImpact).toLocaleString()}`,
                    `Cumulative Total: ${cumulativePrefix}$${Math.abs(cumulativeValue).toLocaleString()}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Annual Net Impact ($)',
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  const numValue = Number(value);
                  const prefix = numValue >= 0 ? '+' : '';
                  return prefix + '$' + Math.abs(numValue).toLocaleString();
                }
              },
              beginAtZero: true
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: 'Cumulative Impact ($)',
                font: {
                  weight: 'bold'
                },
                color: '#6366f1'
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function(value) {
                  const numValue = Number(value);
                  const prefix = numValue >= 0 ? '+' : '';
                  return prefix + '$' + Math.abs(numValue).toLocaleString();
                },
                color: '#6366f1'
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    };

    loadChartAndRender();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [results, showBigBillComparison]);

  // Use appropriate scenario data for calculations
  const currentData = showBigBillComparison ? results.bigBillScenario : results;
  const purchasingPowerData = currentData?.purchasingPower || results.purchasingPower;

  if (!purchasingPowerData) {
    return null;
  }

  // Calculate net financial impact data for summary cards
  const years = purchasingPowerData.currentScenario.map((d: any) => d.year);
  const netImpacts = years.map((year: any, index: number) => {
    const currentIncome = purchasingPowerData.currentScenario[index]?.projectedDisposableIncome || 0;
    const proposedIncome = purchasingPowerData.proposedScenario[index]?.projectedDisposableIncome || 0;
    return proposedIncome - currentIncome;
  });

  // Calculate key metrics
  const totalSavings = netImpacts.reduce((sum: number, impact: number) => sum + Math.max(0, impact), 0);
  const totalCosts = netImpacts.reduce((sum: number, impact: number) => sum + Math.min(0, impact), 0);
  const netBenefit = totalSavings + totalCosts;
  const averageAnnualImpact = netImpacts.reduce((sum: number, impact: number) => sum + impact, 0) / netImpacts.length;

  return (
    <TooltipProvider>
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Your Additional Savings Over Time
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Shows how much more you save with the proposed policy compared to current law. Green bars indicate annual savings, red bars indicate costs. The blue trend line shows your cumulative total savings over time.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription className="text-slate-600">
                How much more you save with the proposed policy, with cumulative impact trend
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {purchasingPowerData.dataSource.includes('BLS') ? 'Live Data' : 'Projected'}
            </Badge>
          </div>
          
          {/* Key Financial Impact Summary */}
          <div className="mt-4 space-y-3">
            <div className="p-3 bg-white rounded-lg border border-green-200">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Higher values = more savings in your pocket</strong><br/>
                <span className="text-xs text-slate-600">The blue trend line shows how your savings accumulate over time</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`rounded-lg p-3 border ${averageAnnualImpact >= 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {averageAnnualImpact >= 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                    <span className={`text-xs font-medium ${averageAnnualImpact >= 0 ? 'text-green-700' : 'text-red-700'}`}>Average Annual Impact</span>
                  </div>
                  <div className={`text-lg font-bold ${averageAnnualImpact >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {averageAnnualImpact >= 0 ? '+' : ''}${averageAnnualImpact.toLocaleString()}
                  </div>
                  <div className={`text-xs ${averageAnnualImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {averageAnnualImpact >= 0 ? 'more savings' : 'additional cost'}
                  </div>
                </div>
                
                <div className={`rounded-lg p-3 border ${totalSavings > 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total Savings</span>
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    +${totalSavings.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">
                    Cumulative benefits
                  </div>
                </div>
                
                <div className={`rounded-lg p-3 border ${netBenefit >= 0 ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {netBenefit >= 0 ? <TrendingUp className="w-4 h-4 text-purple-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                    <span className={`text-xs font-medium ${netBenefit >= 0 ? 'text-purple-700' : 'text-red-700'}`}>Net Benefit</span>
                  </div>
                  <div className={`text-lg font-bold ${netBenefit >= 0 ? 'text-purple-800' : 'text-red-800'}`}>
                    {netBenefit >= 0 ? '+' : ''}${netBenefit.toLocaleString()}
                  </div>
                  <div className={`text-xs ${netBenefit >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                    {netBenefit >= 0 ? 'Overall gain' : 'Overall cost'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-80 mb-4">
            <canvas ref={chartRef} />
          </div>
          
          {/* Savings Growth Over Time */}
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Savings Growth Over Time
              </h4>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs">
                Cumulative Benefits
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {years.map((year: number, index: number) => {
                const impact = netImpacts[index];
                const cumulativeToDate = netImpacts.slice(0, index + 1).reduce((sum: number, val: number) => sum + val, 0);
                
                return (
                  <div key={year} className={`rounded-lg p-2 border ${impact >= 0 ? 'bg-white border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-xs font-medium text-green-700 mb-1">
                      {year}
                    </div>
                    <div className={`text-sm font-bold ${impact >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                      Save {impact >= 0 ? '+' : ''}${impact.toLocaleString()} more
                    </div>
                    <div className="text-xs text-green-600">
                      more savings
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {cumulativeToDate >= 0 ? '+' : ''}${cumulativeToDate.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-3 text-xs text-green-700 text-center">
              The proposed policy provides consistent additional savings that compound over time
            </div>
          </div>
          
          {/* Data Source Attribution */}
          <div className="text-xs text-slate-500 border-t pt-3">
            <p>
              <strong>Data Source:</strong> {purchasingPowerData.dataSource}
            </p>
            <p>
              <strong>Last Updated:</strong> {purchasingPowerData.lastUpdated}
            </p>
            <p className="mt-1">
              Financial impact calculated using inflation data from the U.S. Bureau of Labor Statistics Consumer Price Index (CPI-U)
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}