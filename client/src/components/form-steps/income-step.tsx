The code is updated to include a slider input for income selection, improving the user experience.
```

```replit_final_file
import { useState } from "react";
import { FormData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { TooltipHelp } from "@/components/ui/tooltip-help";
import { TrendingUp, DollarSign } from "lucide-react";

const incomeRanges = [
  { value: "under-25k", label: "Under $25,000", median: 20000, min: 0, max: 25000 },
  { value: "25k-50k", label: "$25,000 - $50,000", median: 37500, min: 25000, max: 50000 },
  { value: "50k-75k", label: "$50,000 - $75,000", median: 62500, min: 50000, max: 75000 },
  { value: "75k-100k", label: "$75,000 - $100,000", median: 87500, min: 75000, max: 100000 },
  { value: "100k-150k", label: "$100,000 - $150,000", median: 125000, min: 100000, max: 150000 },
  { value: "150k-250k", label: "$150,000 - $250,000", median: 200000, min: 150000, max: 250000 },
  { value: "over-250k", label: "Over $250,000", median: 300000, min: 250000, max: 500000 },
];

interface IncomeStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function IncomeStep({ formData, onComplete }: IncomeStepProps) {
  const [incomeRange, setIncomeRange] = useState<string>(formData.incomeRange || "");
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState([75000]);

  const handleNext = () => {
    if (incomeRange) {
      onComplete({ incomeRange });
    }
  };

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value);
    // Auto-select appropriate range based on slider value
    const selectedRange = incomeRanges.find(range => 
      value[0] >= range.min && value[0] <= range.max
    );
    if (selectedRange) {
      setIncomeRange(selectedRange.value);
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
            This helps us calculate tax impacts and benefit eligibility accurately.
          </p>
          <TooltipHelp content="We use household income ranges to estimate federal and state tax impacts, healthcare subsidies, and other income-based policy effects. This information is kept completely anonymous." />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-slate-600">US Median: $70,784</span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm text-slate-600">Your selection affects tax brackets</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toggle between selection methods */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSlider(!showSlider)}
            className="text-xs"
          >
            {showSlider ? "Use Range Selection" : "Use Precise Slider"}
          </Button>
        </div>

        {showSlider ? (
          /* Slider Method */
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Your Approximate Income</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${sliderValue[0].toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">Annual Household Income</div>
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  max={300000}
                  min={10000}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500">
                  <span>$10k</span>
                  <span>$150k</span>
                  <span>$300k+</span>
                </div>
              </div>
              {selectedRange && (
                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="text-sm font-medium text-blue-900">
                    Selected Range: {selectedRange.label}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    This places you in the {selectedRange.value.replace('-', ' to ')} bracket for policy calculations
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Traditional Range Selection */
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Annual Household Income Range</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={incomeRange} onValueChange={setIncomeRange} className="grid gap-3">
                {incomeRanges.map((range) => (
                  <div key={range.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value={range.value} id={range.value} />
                    <Label htmlFor={range.value} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <span>{range.label}</span>
                        <span className="text-xs text-slate-500">
                          ~{((range.median / 70784) * 100).toFixed(0)}% of median
                        </span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Privacy reminder */}
      <div className="text-xs text-slate-500 text-center p-3 bg-slate-50 rounded">
        🔒 Your income information is used only for calculations and never stored or shared
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