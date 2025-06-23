import { useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { PolicyResults } from "@shared/types";

interface NetFinancialImpactChartProps {
  results: PolicyResults;
}

export default function NetFinancialImpactChart({ results }: NetFinancialImpactChartProps) {
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

      // Use Big Bill CBO data as the single authoritative source
      const currentData = results;
      const purchasingPowerData = results.purchasingPower;

      if (!purchasingPowerData) return;

      const years = purchasingPowerData.currentScenario.map(d => d.year);

      // Server values are Big Bill vs Current Law differences
      // Negative server values = user saves money (display as positive savings)
      // Positive server values = user pays more (display as positive costs)
      
      // Convert server differences to cash flow convention for display
      const displayValues = [
        annualDifference < 0 ? Math.abs(annualDifference) : 0, // Annual savings
        fiveYearDifference < 0 ? Math.abs(fiveYearDifference) : 0, // 5-year cumulative savings
        tenYearDifference < 0 ? Math.abs(tenYearDifference) : 0, // 10-year cumulative savings
        twentyYearDifference < 0 ? Math.abs(twentyYearDifference) : 0 // 20-year cumulative savings
      ];
      
      const costValues = [
        annualDifference >= 0 ? annualDifference : 0, // Annual costs
        fiveYearDifference >= 0 ? fiveYearDifference : 0, // 5-year cumulative costs
        tenYearDifference >= 0 ? tenYearDifference : 0, // 10-year cumulative costs
        twentyYearDifference >= 0 ? twentyYearDifference : 0 // 20-year cumulative costs
      ];

      // For bar chart data - show annual averages
      const annualSavingsData = [
        displayValues[0], // Year 1
        displayValues[1] / 5, // 5-year average
        displayValues[2] / 10, // 10-year average  
        displayValues[3] / 20 // 20-year average
      ];
      
      const annualCostData = [
        costValues[0], // Year 1
        costValues[1] / 5, // 5-year average
        costValues[2] / 10, // 10-year average  
        costValues[3] / 20 // 20-year average
      ];

      // Cumulative trend line - use actual cumulative values
      const cumulativeData = [
        displayValues[0] || costValues[0], // Year 1
        displayValues[1] || costValues[1], // 5-year cumulative
        displayValues[2] || costValues[2], // 10-year cumulative
        displayValues[3] || costValues[3] // 20-year cumulative
      ];

      // Determine which datasets to show
      const hasSavings = displayValues.some(val => val > 0);
      const hasCosts = costValues.some(val => val > 0);

      // Build datasets based on actual data
      const datasets: any[] = [
        {
          label: 'Cumulative Impact Trend',
          type: 'line',
          data: cumulativeData,
          borderColor: hasSavings ? '#10b981' : '#ef4444',
          backgroundColor: hasSavings ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 4,
          fill: false,
          tension: 0.2,
          pointRadius: 8,
          pointHoverRadius: 10,
          pointBackgroundColor: hasSavings ? '#10b981' : '#ef4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 3,
          yAxisID: 'y1',
          order: 0,
        }
      ];

      // Add savings bars if user saves money
      if (hasSavings) {
        datasets.push({
          label: 'Annual Savings',
          data: annualSavingsData,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 1,
        });
      }

      // Add cost bars if user pays more
      if (hasCosts) {
        datasets.push({
          label: 'Annual Costs',
          data: annualCostData,
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
          yAxisID: 'y',
          order: 1,
        });
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
                  
                  // Server values are Big Bill vs Current Law differences
                  const timelineValues = [
                    annualDifference,
                    fiveYearDifference,
                    tenYearDifference,
                    twentyYearDifference
                  ];
                  const originalCumulative = timelineValues[dataIndex];

                  // Handle cumulative trend line
                  if (datasetLabel === 'Cumulative Impact Trend') {
                    if (originalCumulative < 0) {
                      return `Cumulative Savings with Big Bill: $${Math.abs(originalCumulative).toLocaleString()}`;
                    } else {
                      return `Cumulative Additional Cost with Big Bill: $${originalCumulative.toLocaleString()}`;
                    }
                  }

                  // Handle annual impact bars
                  if (annualDifference < 0) {
                    return `Annual Savings with Big Bill: $${Math.abs(annualDifference).toLocaleString()}`;
                  } else {
                    return `Annual Additional Cost with Big Bill: $${annualDifference.toLocaleString()}`;
                  }
                },
                afterBody: (context) => {
                  const dataIndex = context[0].dataIndex;
                  const serverData = results;
                  const timelineValues = [
                    serverData.netAnnualImpact,
                    serverData.timeline.fiveYear,
                    serverData.timeline.tenYear,
                    serverData.timeline.twentyYear
                  ];
                  const originalAnnual = serverData.netAnnualImpact;
                  const originalCumulative = timelineValues[dataIndex];

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
  }, [results]);

  const purchasingPowerData = results.purchasingPower;

  if (!purchasingPowerData) {
    return null;
  }

  // Server values represent Big Bill vs Current Law differences
  // Negative server values = user saves money (benefits) - display as positive in cash flow
  // Positive server values = user pays more (costs) - display as positive costs
  
  const years = [2025, 2030, 2035, 2045];
  
  // Use exact server values (differences between Big Bill and Current Law)
  const annualDifference = results.netAnnualImpact;
  const fiveYearDifference = results.timeline.fiveYear;
  const tenYearDifference = results.timeline.tenYear;
  const twentyYearDifference = results.timeline.twentyYear;
  
  // Calculate average annual differences for display
  const netImpacts = [
    annualDifference,  // Year 1 difference
    fiveYearDifference / 5,  // Average annual difference over 5 years
    tenYearDifference / 10,  // Average annual difference over 10 years  
    twentyYearDifference / 20  // Average annual difference over 20 years
  ];

  // Cumulative differences over time
  const cumulativeTimeline = [
    annualDifference,  // Year 1 difference
    fiveYearDifference,  // 5-year cumulative difference
    tenYearDifference,  // 10-year cumulative difference
    twentyYearDifference  // 20-year cumulative difference
  ];

  // For display and card styling
  const averageAnnualImpact = annualDifference;
  const fiveYearTotal = fiveYearDifference;
  const twentyYearTotal = twentyYearDifference;
  
  // Determine if Big Bill is beneficial (negative difference = saves money)
  const isOverallBenefit = twentyYearTotal < 0;

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

              {/* Contract Worker Explanation */}
              {!isOverallBenefit && results.breakdown?.some(item => item.category === "employment" && item.impact > 0) && (
                <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                  <p className="text-amber-800">
                    <strong>Why you see costs despite policy benefits:</strong> While the policy provides tax and healthcare savings, 
                    your employment status as a contract worker creates additional tax burdens that offset these benefits.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`rounded-lg p-3 border ${averageAnnualImpact < 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {averageAnnualImpact < 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-orange-600" />}
                    <span className={`text-xs font-medium ${averageAnnualImpact < 0 ? 'text-green-700' : 'text-orange-700'}`}>Big Bill vs Current Law</span>
                  </div>
                  <div className={`text-lg font-bold ${averageAnnualImpact < 0 ? 'text-green-800' : 'text-orange-800'}`}>
                    {averageAnnualImpact < 0 ? `Save $${Math.abs(averageAnnualImpact).toLocaleString()}` : `Pay $${averageAnnualImpact.toLocaleString()} more`}
                  </div>
                  <div className={`text-xs ${averageAnnualImpact < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {averageAnnualImpact < 0 ? 'with Big Bill' : 'with Big Bill'}
                  </div>
                </div>

                <div className={`rounded-lg p-3 border ${fiveYearTotal < 0 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">5-Year Impact</span>
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    {fiveYearTotal < 0 ? `Save $${Math.abs(fiveYearTotal).toLocaleString()}` : `Pay $${fiveYearTotal.toLocaleString()} more`}
                  </div>
                  <div className="text-xs text-blue-600">
                    {fiveYearTotal < 0 ? '5-year savings' : '5-year costs'}
                  </div>
                </div>

                <div className={`rounded-lg p-3 border ${twentyYearTotal < 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {twentyYearTotal < 0 ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-orange-600" />}
                    <span className={`text-xs font-medium ${twentyYearTotal < 0 ? 'text-green-700' : 'text-orange-700'}`}>Net {twentyYearTotal < 0 ? 'Benefit' : 'Cost'}</span>
                  </div>
                  <div className={`text-lg font-bold ${twentyYearTotal < 0 ? 'text-green-800' : 'text-orange-800'}`}>
                    {twentyYearTotal < 0 ? `+$${Math.abs(twentyYearTotal).toLocaleString()}` : `$${twentyYearTotal.toLocaleString()}`}
                  </div>
                  <div className={`text-xs ${twentyYearTotal < 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {twentyYearTotal < 0 ? 'Overall gain' : 'Overall cost'}
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
                const cumulative = cumulativeTimeline[index];

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