import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormData } from "@shared/schema";

interface HealthcareStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

export default function HealthcareStep({ formData, onComplete }: HealthcareStepProps) {
  const [insuranceType, setInsuranceType] = useState(formData.insuranceType || "");
  const [hasHSA, setHasHSA] = useState(formData.hasHSA || false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!insuranceType) newErrors.push("Please select your insurance type");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onComplete({ 
      insuranceType: insuranceType as FormData["insuranceType"],
      hasHSA: insuranceType === "employer" ? hasHSA : undefined
    });
  };

  const isComplete = insuranceType;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Healthcare coverage</h2>
        <p className="text-slate-600">Healthcare policies affect people differently based on their current coverage.</p>
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
            Current Insurance Type <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={insuranceType} onValueChange={setInsuranceType}>
            <div className="space-y-3">
              {[
                {
                  value: "employer",
                  title: "Employer-provided insurance",
                  description: "Insurance through your job or spouse's job",
                },
                {
                  value: "marketplace",
                  title: "Marketplace/ACA plan",
                  description: "Insurance purchased through healthcare.gov or state exchanges",
                },
                {
                  value: "medicare",
                  title: "Medicare",
                  description: "Federal health insurance for 65+ or disabled",
                },
                {
                  value: "medicaid",
                  title: "Medicaid",
                  description: "State health insurance for low-income individuals/families",
                },
                {
                  value: "military",
                  title: "Military/VA insurance",
                  description: "TRICARE, VA healthcare, or other military benefits",
                },
                {
                  value: "uninsured",
                  title: "Currently uninsured",
                  description: "No health insurance coverage",
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

        {/* HSA Eligibility Question - Only show for employer insurance */}
        {insuranceType === "employer" && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              HSA Eligibility
            </Label>
            <p className="text-xs text-slate-600 mb-3">
              HSA-eligible plans have different tax advantages and cost structures that affect policy impact calculations.
            </p>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHSA}
                  onChange={(e) => setHasHSA(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">
                  My employer plan is HSA-eligible (High Deductible Health Plan)
                </span>
              </label>
            </div>
          </div>
        )}

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
