import { useState } from "react";
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
  const [employmentStatus, setEmploymentStatus] = useState(formData.employmentStatus || "");
  const [industry, setIndustry] = useState(formData.industry || "");

  const handleSubmit = () => {
    onComplete({ 
      employmentStatus: employmentStatus as FormData["employmentStatus"], 
      industry 
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your work situation</h2>
        <p className="text-slate-600">Employment policies can vary significantly by industry and job type.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">Employment Status</Label>
          <RadioGroup value={employmentStatus} onValueChange={setEmploymentStatus}>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { value: "fulltime", label: "Full-time employee" },
                { value: "parttime", label: "Part-time employee" },
                { value: "selfemployed", label: "Self-employed/Business owner" },
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
          <Label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry.value} value={industry.value}>
                  {industry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
