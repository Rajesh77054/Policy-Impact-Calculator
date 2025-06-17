
import { useState } from "react";
import { FormData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TooltipHelp } from "@/components/ui/tooltip-help";
import { TrendingUp, DollarSign, Calculator, Info } from "lucide-react";

// IRS-aligned income ranges matching server calculation brackets
const incomeRanges = [
  { 
    value: "under-15k", 
    label: "Under $15,000", 
    median: 12000,
    taxBracket: "10%",
    description: "Lowest tax bracket, maximum benefits eligibility"
  },
  { 
    value: "15k-45k", 
    label: "$15,000 - $45,000", 
    median: 30000,
    taxBracket: "10-12%",
    description: "Low-middle income, some benefit eligibility"
  },
  { 
    value: "45k-95k", 
    label: "$45,000 - $95,000", 
    median: 70000,
    taxBracket: "12-22%",
    description: "Middle income, standard tax treatment"
  },
  { 
    value: "95k-200k", 
    label: "$95,000 - $200,000", 
    median: 147500,
    taxBracket: "22-24%",
    description: "Upper-middle income, reduced benefits"
  },
  { 
    value: "200k-400k", 
    label: "$200,000 - $400,000", 
    median: 300000,
    taxBracket: "24-32%",
    description: "High income, minimal benefits"
  },
  { 
    value: "over-400k", 
    label: "Over $400,000", 
    median: 500000,
    taxBracket: "32-37%",
    description: "Highest tax bracket, no income-based benefits"
  },
];

interface IncomeStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function IncomeStep({ formData, onComplete }: IncomeStepProps) {
  const [incomeRange, setIncomeRange] = useState<"under-15k" | "15k-45k" | "45k-95k" | "95k-200k" | "200k-400k" | "over-400k" | "">(formData.incomeRange || "");

  const handleNext = () => {
    if (incomeRange && incomeRange !== "") {
      onComplete({ incomeRange: incomeRange as "under-15k" | "15k-45k" | "45k-95k" | "95k-200k" | "200k-400k" | "over-400k" });
    }
  };

  const isValid = incomeRange !== "";
  const selectedRange = incomeRanges.find(range => range.value === incomeRange);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What's your household income?</h2>
        <div className="flex items-center space-x-2">
          <p className="text-slate-600">
            These ranges align with IRS tax brackets for accurate policy impact calculations.
          </p>
          <TooltipHelp content="We use IRS-defined income brackets to ensure calculations match federal tax methodology. Each range corresponds to specific tax rates, deduction limits, and benefit eligibility thresholds used by the government." />
        </div>
      </div>

      {/* Context Cards */}
      <div className="grid md:grid-cols-3 gap-4 p-4 glass-droplet rounded-lg">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-slate-600">US Median: $70,784</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calculator className="w-4 h-4 text-green-600" />
          <span className="text-sm text-slate-600">IRS Tax Brackets</span>
        </div>
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-slate-600">Benefits Eligibility</span>
        </div>
      </div>

      {/* Enhanced Range Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Annual Household Income Range</span>
            <span className="text-sm font-normal text-slate-500">(Select your bracket)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={incomeRange} onValueChange={setIncomeRange} className="grid gap-4">
            {incomeRanges.map((range) => (
              <div 
                key={range.value} 
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  incomeRange === range.value 
                    ? "border-primary bg-primary/5 shadow-md" 
                    : "border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                }`}
                onClick={() => setIncomeRange(range.value)}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={range.value} id={range.value} className="mt-1" />
                  <Label htmlFor={range.value} className="flex-1 cursor-pointer">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-900">{range.label}</span>
                        <div className="flex items-center space-x-3 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {range.taxBracket}
                          </span>
                          <span className="text-slate-500">
                            ~{((range.median / 70784) * 100).toFixed(0)}% of median
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {range.description}
                      </p>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Selected Range Summary */}
      {selectedRange && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium text-green-900">
                Selected: {selectedRange.label}
              </div>
              <div className="text-sm text-green-700 mt-1">
                Tax bracket: {selectedRange.taxBracket} • {selectedRange.description}
              </div>
              <div className="text-xs text-green-600 mt-2">
                ✓ Calculations will use IRS methodologies for this income bracket
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Methodology Note */}
      <div className="text-xs text-slate-500 text-center p-3 bg-slate-50 rounded border-l-4 border-blue-400">
        <div className="font-medium mb-1">🔒 Privacy & Accuracy</div>
        <div>Your income range aligns with official IRS brackets to ensure accurate tax calculations. No personal data is stored.</div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isValid} size="lg">
          Next Step
          {isValid && <span className="ml-2">→</span>}
        </Button>
      </div>
    </div>
  );
}
