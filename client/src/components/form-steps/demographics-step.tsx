import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@shared/schema";
import { TooltipHelp } from "@/components/ui/tooltip-help";

interface DemographicsStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function DemographicsStep({ formData, onComplete }: DemographicsStepProps) {
  const [ageRange, setAgeRange] = useState(formData.ageRange || "");
  const [familyStatus, setFamilyStatus] = useState(formData.familyStatus || "");
  const [hasChildren, setHasChildren] = useState(formData.hasChildren || false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!ageRange) newErrors.push("Please select your age range");
    if (!familyStatus) newErrors.push("Please select your filing status");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onComplete({ 
      ageRange: ageRange as FormData["ageRange"], 
      familyStatus: familyStatus as FormData["familyStatus"],
      hasChildren: hasChildren
    });
  };

  const isComplete = ageRange && familyStatus;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about yourself</h2>
        <p className="text-slate-600">Basic information helps us understand which policies affect you most.</p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-red-500 mt-0.5">⚠</div>
            <div>
              <h4 className="text-sm font-medium text-red-800">Please complete required fields:</h4>
              <ul className="text-sm text-red-700 mt-1 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Age Range <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={ageRange} onValueChange={setAgeRange}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: "18-29", label: "18-29" },
                { value: "30-44", label: "30-44" },
                { value: "45-64", label: "45-64" },
                { value: "65+", label: "65+" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 border border-slate-300 rounded-lg hover:border-primary transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Label className="text-sm font-medium text-slate-700">
              Filing Status <span className="text-red-500">*</span>
            </Label>
            <TooltipHelp content="Your tax filing status affects policy calculations. Choose the status you use on your tax return." />
          </div>
          <RadioGroup value={familyStatus} onValueChange={setFamilyStatus}>
            <div className="space-y-3">
              {[
                {
                  value: "single",
                  title: "Single",
                  description: "Unmarried and not head of household",
                },
                {
                  value: "married-joint",
                  title: "Married Filing Jointly",
                  description: "Married couple filing together",
                },
                {
                  value: "married-separate",
                  title: "Married Filing Separately",
                  description: "Married but filing separate returns",
                },
                {
                  value: "head-of-household",
                  title: "Head of Household",
                  description: "Unmarried with qualifying dependents",
                },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-4 p-4 border border-slate-300 rounded-lg hover:border-primary transition-colors">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div>
                    <Label htmlFor={option.value} className="text-sm font-medium cursor-pointer">
                      {option.title}
                    </Label>
                    <p className="text-xs text-slate-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Do you have children or dependents?</Label>
          <RadioGroup value={hasChildren ? "yes" : "no"} onValueChange={(value) => setHasChildren(value === "yes")}>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-3 border border-slate-300 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="yes" id="has-children-yes" />
                <Label htmlFor="has-children-yes" className="text-sm cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-slate-300 rounded-lg hover:border-primary transition-colors">
                <RadioGroupItem value="no" id="has-children-no" />
                <Label htmlFor="has-children-no" className="text-sm cursor-pointer">
                  No
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isComplete
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
