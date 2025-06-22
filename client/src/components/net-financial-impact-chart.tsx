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

      // Use actual policy impact data instead of purchasing power projections
      const actualData = showBigBillComparison ? (results.bigBillScenario || results) : results;
      const netImpactData = [
        actualData.netAnnualImpact,
        actualData.timeline.fiveYear / 5,  // Average annual impact over 5 years
        actualData.timeline.tenYear / 10,  // Average annual impact over 10 years
        actualData.timeline.twentyYear / 20  // Average annual impact over 20 years
      ];

      // Reverse the values for intuitive display: savings (negative values) become positive for upward trending
      const displayData = netImpactData.map(value => -value); // Flip sign so savings trend upward
      const savingsData = displayData.map((value, index) => netImpactData[index] < 0 ? value : null);
      const costsData = displayData.map((value, index) => netImpactData[index] > 0 ? value : null);

      // Check if datasets have any actual data (not all null)
      const hasSavingsData = savingsData.some(value => value !== null);
      const hasCostsData = costsData.some(value => value !== null);

      // Use cumulative impact data from outer scope

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

      // Only add savings data dataset if it has values (negative values = savings)
      if (hasSavingsData) {
        datasets.push({
          label: 'Savings',
          data: savingsData as any,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 1, // Drawn after the line
        } as any);
      }

      // Only add costs data dataset if it has values (positive values = costs)
      if (hasCostsData) {
        datasets.push({
          label: 'Costs',
          data: costsData as any,
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
              text: isOverallBenefit ? 'Your Additional Savings Over Time' : 'Your Financial Impact Over Time',
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
                  
                  const dataIndex = context.dataIndex;
                  const originalValue = netImpactData[dataIndex];
                  const originalCumulative = -cumulativeImpact[dataIndex]; // Convert back to original
                  
                  // Handle cumulative trend line
                  if (datasetLabel === 'Cumulative Impact Trend') {
                    if (originalCumulative < 0) {
                      return `Cumulative Savings: $${Math.abs(originalCumulative).toLocaleString()}`;
                    } else {
                      return `Cumulative Cost: $${originalCumulative.toLocaleString()}`;
                    }
                  }
                  
                  // Handle annual impact bars - use original values for correct labels
                  if (originalValue < 0) {
                    return `Annual Savings: $${Math.abs(originalValue).toLocaleString()}`;
                  } else {
                    return `Annual Cost: $${originalValue.toLocaleString()}`;
                  }
                },
                afterBody: (context) => {
                  const dataIndex = context[0].dataIndex;
                  const originalAnnual = netImpactData[dataIndex];
                  const originalCumulative = -cumulativeImpact[dataIndex]; // Convert back to original
                  
                  // Only show additional context if we're not already showing cumulative data
                  const showingCumulative = context.some(item => item.dataset.label === 'Cumulative Impact Trend');
                  if (showingCumulative) return [];
                  
                  const annualLabel = originalAnnual < 0 ? 'Annual Savings' : 'Annual Cost';
                  const cumulativeLabel = originalCumulative < 0 ? 'Cumulative Savings' : 'Cumulative Cost';
                  
                  return [
                    '',
                    `${annualLabel}: $${Math.abs(originalAnnual).toLocaleString()}`,
                    `${cumulativeLabel}: $${Math.abs(originalCumulative).toLocaleString()}`
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
                text: isOverallBenefit ? 'Annual Savings ($)' : 'Annual Impact ($)',
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
                  if (numValue <= 0) return '$0';
                  return '$' + numValue.toLocaleString();
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
                text: isOverallBenefit ? 'Cumulative Savings ($)' : 'Cumulative Impact ($)',
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
                  if (numValue <= 0) return '$0';
                  return '$' + numValue.toLocaleString();
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

  // Use actual policy impact calculations instead of purchasing power projections
  const actualData = showBigBillComparison ? (results.bigBillScenario || results) : results;
  
  // Calculate net impacts based on actual policy calculations
  const years = [2025, 2030, 2035, 2045]; // Standard timeline years
  const netImpacts = [
    actualData.netAnnualImpact,
    actualData.timeline.fiveYear / 5,  // Average annual impact over 5 years
    actualData.timeline.tenYear / 10,  // Average annual impact over 10 years
    actualData.timeline.twentyYear / 20  // Average annual impact over 20 years
  ];

  // Use actual cumulative timeline data, reversed for upward trending display
  const cumulativeImpact = [
    -actualData.netAnnualImpact,
    -actualData.timeline.fiveYear,
    -actualData.timeline.tenYear,
    -actualData.timeline.twentyYear
  ];

  // Calculate key metrics based on actual policy impact
  const totalSavings = netImpacts.reduce((sum: number, impact: number) => sum + Math.max(0, impact), 0);
  const totalCosts = netImpacts.reduce((sum: number, impact: number) => sum + Math.min(0, impact), 0);
  const netBenefit = actualData.timeline.twentyYear; // Use the actual 20-year cumulative impact
  const averageAnnualImpact = actualData.netAnnualImpact; // Use the actual annual impact

  // Determine overall impact for card styling
  const isOverallBenefit = netBenefit < 0; // Negative values are benefits (savings)

  return (
    <TooltipProvider>
      <Card className={`border-2 ${isOverallBenefit ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50'}`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {isOverallBenefit ? 'Your Additional Savings Over Time' : 'Your Financial Impact Over Time'}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-slate-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Shows your financial impact with the proposed policy compared to current law. {isOverallBenefit ? 'Green bars indicate annual savings, red bars indicate costs.' : 'Orange bars indicate costs, green bars indicate savings.'} The trend line shows your cumulative total impact over time.</p>
                  </TooltipContent>
                </Tooltip>
              </CardTitle>
              <CardDescription className="text-slate-600">
                {isOverallBenefit ? 'How much more you save with the proposed policy, with cumulative impact trend' : 'Your financial impact from the proposed policy, with cumulative trend'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {purchasingPowerData.dataSource.includes('BLS') ? 'Live Data' : 'Projected'}
            </Badge>
          </div>
          
          {/* Key Financial Impact Summary */}
          <div className="mt-4 space-y-3">
            <div className={`p-3 bg-white rounded-lg border ${isOverallBenefit ? 'border-green-200' : 'border-orange-200'}`}>
              <p className="text-sm text-slate-700 mb-3">
                <strong>{isOverallBenefit ? 'Higher values = more savings in your pocket' : 'Policy financial impact analysis'}</strong><br/>
                <span className="text-xs text-slate-600">The trend line shows how your {isOverallBenefit ? 'savings' : 'costs'} accumulate over time</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`rounded-lg p-3 border ${averageAnnualImpact < 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {averageAnnualImpact < 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-orange-600" />}
                    <span className={`text-xs font-medium ${averageAnnualImpact < 0 ? 'text-green-700' : 'text-orange-700'}`}>Average Annual Impact</span>
                  </div>
                  <div className={`text-lg font-bold ${averageAnnualImpact < 0 ? 'text-green-800' : 'text-orange-800'}`}>
                    {averageAnnualImpact < 0 ? `Save $${Math.abs(averageAnnualImpact).toLocaleString()}` : `Pay $${averageAnnualImpact.toLocaleString()} more`}
                  </div>
                  <div className={`text-xs ${averageAnnualImpact < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {averageAnnualImpact < 0 ? 'more savings' : 'additional cost'}
                  </div>
                </div>
                
                <div className={`rounded-lg p-3 border ${Math.abs(totalSavings) > Math.abs(totalCosts) ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Total Impact</span>
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {Math.abs(totalSavings) > Math.abs(totalCosts) ? `+$${totalSavings.toLocaleString()}` : `$${Math.abs(totalCosts).toLocaleString()}`}
                  </div>
                  <div className="text-xs text-blue-600">
                    {Math.abs(totalSavings) > Math.abs(totalCosts) ? 'Benefits' : 'Costs'}
                  </div>
                </div>
                
                <div className={`rounded-lg p-3 border ${netBenefit < 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {netBenefit < 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-orange-600" />}
                    <span className={`text-xs font-medium ${netBenefit < 0 ? 'text-green-700' : 'text-orange-700'}`}>Net {netBenefit < 0 ? 'Benefit' : 'Cost'}</span>
                  </div>
                  <div className={`text-lg font-bold ${netBenefit < 0 ? 'text-green-800' : 'text-orange-800'}`}>
                    {netBenefit < 0 ? `+$${Math.abs(netBenefit).toLocaleString()}` : `$${netBenefit.toLocaleString()}`}
                  </div>
                  <div className={`text-xs ${netBenefit < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {netBenefit < 0 ? 'Overall gain' : 'Overall cost'}
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
          
          {/* Financial Impact Growth Over Time */}
          <div className={`mb-4 p-4 ${isOverallBenefit ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'} rounded-lg border`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-sm font-semibold ${isOverallBenefit ? 'text-green-800' : 'text-orange-800'} flex items-center gap-2`}>
                {isOverallBenefit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {isOverallBenefit ? 'Savings Growth Over Time' : 'Financial Impact Over Time'}
              </h4>
              <Badge variant="outline" className={`${isOverallBenefit ? 'bg-green-100 text-green-700 border-green-300' : 'bg-orange-100 text-orange-700 border-orange-300'} text-xs`}>
                {isOverallBenefit ? 'Cumulative Benefits' : 'Cumulative Costs'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              {years.map((year: number, index: number) => {
                const impact = netImpacts[index];
                const cumulative = cumulativeImpact[index];
                
                return (
                  <div key={year} className={`rounded-lg p-2 border ${impact < 0 ? 'bg-white border-green-200' : 'bg-red-50 border-orange-200'}`}>
                    <div className={`text-xs font-medium ${impact < 0 ? 'text-green-700' : 'text-orange-700'} mb-1`}>
                      {year}
                    </div>
                    <div className={`text-sm font-bold ${impact < 0 ? 'text-green-800' : 'text-orange-800'}`}>
                      {cumulative < 0 ? `Save $${Math.abs(cumulative).toLocaleString()}` : `Pay $${Math.abs(cumulative).toLocaleString()} more`}
                    </div>
                    <div className={`text-xs ${impact < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      by {year}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {impact < 0 ? `$${Math.abs(impact).toLocaleString()}/year` : `$${Math.abs(impact).toLocaleString()}/year`}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className={`mt-3 text-xs text-center ${isOverallBenefit ? 'text-green-700' : 'text-orange-700'}`}>
              The proposed policy provides {isOverallBenefit ? 'consistent additional savings that compound over time' : 'financial impacts that accumulate over time'}
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