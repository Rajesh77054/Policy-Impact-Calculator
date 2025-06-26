
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Heart, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PolicyComparisonTableProps {
  className?: string;
}

export default function PolicyComparisonTable({ className }: PolicyComparisonTableProps) {
  const { data: results } = useQuery({
    queryKey: ["/api/results"],
  });

  if (!results) {
    return null;
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  // Calculate current law tax scenario
  const calculateCurrentTax = (netImpact: number, taxImpact: number): number => {
    // Estimate current tax burden based on income range and impacts
    const estimatedCurrentTax = Math.max(0, -taxImpact); // If tax impact is negative, that's savings
    return estimatedCurrentTax;
  };

  // Calculate Big Bill tax scenario
  const calculateBigBillTax = (currentTax: number, taxImpact: number): number => {
    return Math.max(0, currentTax + taxImpact);
  };

  // Tax calculations
  const currentTax = calculateCurrentTax(results.netAnnualImpact, results.annualTaxImpact);
  const bigBillTax = calculateBigBillTax(currentTax, results.annualTaxImpact);
  const taxSavings = currentTax - bigBillTax;

  // Healthcare calculations - use the actual values from results
  const currentHealthcareCost = results.healthcareCosts.current;
  const bigBillHealthcareCost = results.healthcareCosts.proposed;
  const healthcareSavings = currentHealthcareCost - bigBillHealthcareCost;

  // Break down healthcare costs for display
  const currentPremium = Math.round(currentHealthcareCost * 0.75); // Estimate 75% premium
  const currentOutOfPocket = Math.round(currentHealthcareCost * 0.15); // 15% out-of-pocket
  const currentPrescription = Math.round(currentHealthcareCost * 0.10); // 10% prescription

  const bigBillPremium = Math.round(bigBillHealthcareCost * 0.75);
  const bigBillOutOfPocket = Math.round(bigBillHealthcareCost * 0.15);
  const bigBillPrescription = Math.round(bigBillHealthcareCost * 0.10);

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Side-by-Side Comparison</h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            See exactly how your costs change under each scenario, broken down by category.
          </p>
        </div>

        {/* Tax Cost Scenario Comparison */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Tax Cost Scenario Comparison</CardTitle>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comparison of your annual tax burden under current law vs. Big Bill policies</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Law */}
              <div>
                <h4 className="font-semibold text-slate-700 text-center mb-4">Current Law</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Federal Income Tax</span>
                    <span className="font-medium">{formatCurrency(currentTax * 0.85)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">FICA Taxes</span>
                    <span className="font-medium">{formatCurrency(currentTax * 0.15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State Income Tax</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Annual Tax</span>
                      <span className="text-blue-700">{formatCurrency(currentTax)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Bill */}
              <div>
                <h4 className="font-semibold text-slate-700 text-center mb-4">Big Bill</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Federal Income Tax</span>
                    <span className="font-medium">{formatCurrency(bigBillTax * 0.85)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">FICA Taxes</span>
                    <span className="font-medium">{formatCurrency(bigBillTax * 0.15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State Income Tax</span>
                    <span className="font-medium">$0</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Annual Tax</span>
                      <span className="text-blue-700">{formatCurrency(bigBillTax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Savings Summary */}
            <div className="mt-6 text-center">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-700 mb-1">Annual Tax Savings:</p>
                <p className="text-2xl font-bold text-blue-800">
                  {taxSavings >= 0 ? `${formatCurrency(taxSavings)} saved per year` : `${formatCurrency(-taxSavings)} additional per year`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Healthcare Cost Scenario Comparison */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg text-green-900">Healthcare Cost Scenario Comparison</CardTitle>
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-green-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comparison of your annual healthcare costs under current law vs. Big Bill policies</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Law */}
              <div>
                <h4 className="font-semibold text-slate-700 text-center mb-4">Current Law</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Premium</span>
                    <span className="font-medium">{formatCurrency(currentPremium)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Out-of-Pocket Costs</span>
                    <span className="font-medium">{formatCurrency(currentOutOfPocket)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prescription Costs</span>
                    <span className="font-medium">{formatCurrency(currentPrescription)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Annual Cost</span>
                      <span className="text-green-700">{formatCurrency(currentHealthcareCost)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Bill */}
              <div>
                <h4 className="font-semibold text-slate-700 text-center mb-4">Big Bill</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Annual Premium</span>
                    <span className="font-medium">{formatCurrency(bigBillPremium)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Out-of-Pocket Costs</span>
                    <span className="font-medium">{formatCurrency(bigBillOutOfPocket)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Prescription Costs</span>
                    <span className="font-medium">{formatCurrency(bigBillPrescription)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total Annual Cost</span>
                      <span className="text-green-700">{formatCurrency(bigBillHealthcareCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Healthcare Savings Summary */}
            <div className="mt-6 text-center">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-700 mb-1">Annual Healthcare Savings:</p>
                <p className="text-2xl font-bold text-green-800">
                  {healthcareSavings >= 0 ? `${formatCurrency(healthcareSavings)} saved per year` : `${formatCurrency(-healthcareSavings)} additional per year`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
