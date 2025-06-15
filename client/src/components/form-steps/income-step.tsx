import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Info } from "lucide-react";
import { FormData } from "@shared/schema";

interface IncomeStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function IncomeStep({ formData, onComplete }: IncomeStepProps) {
  const [incomeRange, setIncomeRange] = useState(formData.incomeRange || "");

  const handleNext = () => {
    const stepData = { incomeRange };
    console.log("Income step completing with data:", stepData);
    onComplete(stepData);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Income information</h2>
        <p className="text-slate-600">This helps us calculate tax impacts and benefit eligibility. This step is optional.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Annual Household Income</Label>
          <RadioGroup value={incomeRange} onValueChange={setIncomeRange}>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { value: "under-15k", label: "Under $15,000" },
                { value: "15k-45k", label: "$15,000 - $45,000" },
                { value: "45k-95k", label: "$45,000 - $95,000" },
                { value: "95k-200k", label: "$95,000 - $200,000" },
                { value: "200k-400k", label: "$200,000 - $400,000" },
                { value: "over-400k", label: "Over $400,000" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-4 p-4 border border-slate-300 rounded-lg hover:border-primary transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary">Privacy Notice</h4>
              <p className="text-sm text-primary/80 mt-1">
                Your income information is used only for calculations and is never stored or shared. 
                You can skip this step for general estimates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}