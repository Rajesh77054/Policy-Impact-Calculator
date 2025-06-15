import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@shared/schema";

interface DemographicsStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function DemographicsStep({ formData, onComplete }: DemographicsStepProps) {
  const [ageRange, setAgeRange] = useState(formData.ageRange || "");
  const [familyStatus, setFamilyStatus] = useState(formData.familyStatus || "");
  const [hasChildren, setHasChildren] = useState(formData.hasChildren || false);

  const handleSubmit = () => {
    onComplete({ 
      ageRange: ageRange as FormData["ageRange"], 
      familyStatus: familyStatus as FormData["familyStatus"],
      hasChildren: hasChildren
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about yourself</h2>
        <p className="text-slate-600">Basic information helps us understand which policies affect you most.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Age Range</Label>
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
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Family Status</Label>
          <RadioGroup value={familyStatus} onValueChange={setFamilyStatus}>
            <div className="space-y-3">
              {[
                {
                  value: "single",
                  title: "Single, no dependents",
                  description: "Living independently",
                },
                {
                  value: "married",
                  title: "Married, no children",
                  description: "Two-person household",
                },
                {
                  value: "family",
                  title: "Have children or dependents",
                  description: "Family with dependents",
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

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
}
