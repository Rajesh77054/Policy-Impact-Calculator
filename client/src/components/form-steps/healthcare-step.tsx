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

  const handleSubmit = () => {
    onComplete({ insuranceType: insuranceType as FormData["insuranceType"] });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Healthcare coverage</h2>
        <p className="text-slate-600">Healthcare policies affect people differently based on their current coverage.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Current Insurance Type</Label>
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
      </div>
    </div>
  );
}
