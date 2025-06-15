import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormData } from "@shared/schema";

interface PrioritiesStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

const PRIORITY_OPTIONS = [
  { id: "healthcare", label: "Healthcare costs and access" },
  { id: "education", label: "Education funding and student loans" },
  { id: "taxes", label: "Tax rates and deductions" },
  { id: "jobs", label: "Job opportunities and wages" },
  { id: "environment", label: "Environmental protection and climate" },
  { id: "infrastructure", label: "Roads, bridges, and public transit" },
  { id: "housing", label: "Housing costs and availability" },
  { id: "retirement", label: "Social Security and retirement planning" },
  { id: "childcare", label: "Childcare costs and family support" },
];

export default function PrioritiesStep({ formData, onComplete }: PrioritiesStepProps) {
  const [priorities, setPriorities] = useState<string[]>(formData.priorities || []);
  const [includeBigBill, setIncludeBigBill] = useState<boolean>(formData.includeBigBill || false);

  const handlePriorityChange = (priorityId: string, checked: boolean) => {
    if (checked) {
      if (priorities.length < 3) {
        setPriorities([...priorities, priorityId]);
      }
    } else {
      setPriorities(priorities.filter(p => p !== priorityId));
    }
  };

  const handleSubmit = () => {
    onComplete({ priorities, includeBigBill });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">What matters most to you?</h2>
        <p className="text-slate-600">Choose up to 3 areas that are most important to you and your family.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Top Priorities ({priorities.length}/3 selected)
          </Label>
          <div className="grid md:grid-cols-2 gap-3">
            {PRIORITY_OPTIONS.map((option) => {
              const isChecked = priorities.includes(option.id);
              const isDisabled = !isChecked && priorities.length >= 3;

              return (
                <div 
                  key={option.id} 
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors ${
                    isChecked 
                      ? "border-primary bg-primary/5" 
                      : isDisabled 
                        ? "border-slate-200 bg-slate-50 opacity-50" 
                        : "border-slate-300 hover:border-primary"
                  }`}
                >
                  <Checkbox
                    id={option.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => handlePriorityChange(option.id, checked as boolean)}
                    disabled={isDisabled}
                  />
                  <Label 
                    htmlFor={option.id} 
                    className={`text-sm cursor-pointer ${isDisabled ? "text-slate-400" : ""}`}
                  >
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        {/* One Big Beautiful Bill Act Option */}
        <div className="border-t border-slate-200 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="big-bill"
                checked={includeBigBill}
                onCheckedChange={(checked) => setIncludeBigBill(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="big-bill" className="text-sm font-medium text-blue-900 cursor-pointer">
                  Include "One Big Beautiful Bill Act" projections
                </Label>
                <p className="text-xs text-blue-700 mt-1">
                  <strong>Note:</strong> This is proposed legislation that has not yet become law. 
                  Results show projected personal impact if this bill were to pass.
                </p>
              </div>
            </div>
          </div>
        </div>

        {priorities.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Your Selected Priorities:</h4>
            <ul className="text-sm text-slate-600 space-y-1">
              {priorities.map((priorityId) => {
                const option = PRIORITY_OPTIONS.find(p => p.id === priorityId);
                return <li key={priorityId}>• {option?.label}</li>;
              })}
            </ul>
            {includeBigBill && (
              <li className="text-sm text-blue-600 mt-2">• One Big Beautiful Bill Act impact analysis (proposed legislation)</li>
            )}
          </div>
        )}

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
}