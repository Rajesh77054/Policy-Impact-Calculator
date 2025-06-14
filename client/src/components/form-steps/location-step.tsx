import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { FormData } from "@shared/schema";

interface LocationStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export default function LocationStep({ formData, onComplete }: LocationStepProps) {
  const [state, setState] = useState(formData.state || "");
  const [zipCode, setZipCode] = useState(formData.zipCode || "");

  const handleSubmit = () => {
    onComplete({ state, zipCode });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Where do you live?</h2>
        <p className="text-slate-600">This helps us calculate location-specific impacts like taxes and cost of living.</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="state" className="text-sm font-medium text-slate-700">State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {US_STATES.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">ZIP Code</Label>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter your ZIP code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            maxLength={5}
            className="mt-2"
          />
          <p className="text-xs text-slate-500 mt-2">Used for local cost calculations only</p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary">Why we need this</h4>
              <p className="text-sm text-primary/80 mt-1">
                Different states have different tax rates, cost of living, and policy impacts. 
                Your ZIP code helps us provide more accurate estimates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
