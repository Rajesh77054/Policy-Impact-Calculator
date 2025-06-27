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
  const [openTaxModal, setOpenTaxModal] = useState(false);
  const [openHealthcareModal, setOpenHealthcareModal] = useState(false);
  const [openFiscalModal, setOpenFiscalModal] = useState(false);


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
    <div className="mb-8">
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
      {/* Fiscal Impact Modal */}
      <Dialog open={openFiscalModal} onOpenChange={setOpenFiscalModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">National Debt & Deficit Analysis</DialogTitle>
            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
              <div className="space-y-3 mt-3">
                <p>
                  <strong>How we project national debt and deficit:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Baseline projections use Congressional Budget Office (CBO) extended baseline forecasts</li>
                  <li>Policy impacts reflect CBO scoring of proposed legislation</li>
                  <li>Debt-to-GDP ratio is calculated using nominal GDP projections from the Office of Management and Budget (OMB)</li>
                  <li>Deficit figures include both on-budget and off-budget spending</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">
                  Debt and deficit projections are subject to considerable uncertainty and may change based on economic conditions and future policy decisions.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}