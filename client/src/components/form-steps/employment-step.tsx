import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormData } from "@shared/schema";

interface EmploymentStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

const INDUSTRIES = [
  { value: "healthcare", label: "Healthcare & Social Services" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail & Customer Service" },
  { value: "finance", label: "Finance & Banking" },
  { value: "government", label: "Government" },
  { value: "agriculture", label: "Agriculture" },
  { value: "energy", label: "Energy & Utilities" },
  { value: "other", label: "Other" },
];

export default function EmploymentStep({ formData, onComplete }: EmploymentStepProps) {
  const [employmentStatus, setEmploymentStatus] = useState<string>(formData.employmentStatus || "");
  const [industry, setIndustry] = useState<string>(formData.industry || "");
  const [errors, setErrors] = useState<string[]>([]);

  // Ensure proper initialization
  useEffect(() => {
    if (formData.employmentStatus && !employmentStatus) {
      setEmploymentStatus(formData.employmentStatus);
    }
    if (formData.industry && !industry) {
      setIndustry(formData.industry);
    }
  }, [formData.employmentStatus, formData.industry, employmentStatus, industry]);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!employmentStatus) newErrors.push("Please select your employment status");
    if (!industry) newErrors.push("Please select your industry");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onComplete({ 
      employmentStatus: employmentStatus as FormData["employmentStatus"], 
      industry 
    });
  };

  const isComplete = employmentStatus && industry;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your work situation</h2>
        <p className="text-slate-600">Employment policies can vary significantly by industry and job type.</p>
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
            Employment Status <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={employmentStatus} onValueChange={setEmploymentStatus}>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { value: "full-time", label: "Full-time employee" },
                { value: "part-time", label: "Part-time employee" },
                { value: "self-employed", label: "Self-employed/Business owner" },
                { value: "contract", label: "Contract/Gig worker" },
                { value: "unemployed", label: "Currently unemployed" },
                { value: "retired", label: "Retired" },
                { value: "student", label: "Student" },
                { value: "unable", label: "Unable to work" },
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

        <div>
          <Label htmlFor="industry" className="text-sm font-medium text-slate-700">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={industry || ""} 
            onValueChange={(value) => {
              try {
                setIndustry(value);
                setErrors(prev => prev.filter(err => !err.includes("industry")));
              } catch (error) {
                console.error("Error setting industry:", error);
              }
            }}
          >
            <SelectTrigger className="w-full mt-2" id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industryOption) => (
                <SelectItem 
                  key={industryOption.value} 
                  value={industryOption.value}
                >
                  {industryOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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