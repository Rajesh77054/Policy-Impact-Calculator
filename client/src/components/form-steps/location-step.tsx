import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Info, MapPin } from "lucide-react";
import { FormData } from "@shared/schema";

interface LocationStepProps {
  formData: FormData;
  onComplete: (data: Partial<FormData>) => void;
}

// ZIP code to state mapping - comprehensive ranges
const getStateFromZip = (zip: string): string => {
  if (zip.length !== 5) return "";

  const zipNum = parseInt(zip);

  // ZIP code ranges by state
  if (zipNum >= 35000 && zipNum <= 36999) return "AL"; // Alabama
  if (zipNum >= 99500 && zipNum <= 99999) return "AK"; // Alaska
  if (zipNum >= 85000 && zipNum <= 86999) return "AZ"; // Arizona
  if (zipNum >= 71600 && zipNum <= 72999) return "AR"; // Arkansas
  if (zipNum >= 90000 && zipNum <= 96699) return "CA"; // California
  if (zipNum >= 80000 && zipNum <= 81999) return "CO"; // Colorado
  if (zipNum >= 6000 && zipNum <= 6999) return "CT"; // Connecticut
  if (zipNum >= 19700 && zipNum <= 19999) return "DE"; // Delaware
  if (zipNum >= 32000 && zipNum <= 34999) return "FL"; // Florida
  if (zipNum >= 30000 && zipNum <= 31999) return "GA"; // Georgia
  if (zipNum >= 96700 && zipNum <= 96999) return "HI"; // Hawaii
  if (zipNum >= 83200 && zipNum <= 83999) return "ID"; // Idaho
  if (zipNum >= 60000 && zipNum <= 62999) return "IL"; // Illinois
  if (zipNum >= 46000 && zipNum <= 47999) return "IN"; // Indiana
  if (zipNum >= 50000 && zipNum <= 52999) return "IA"; // Iowa
  if (zipNum >= 66000 && zipNum <= 67999) return "KS"; // Kansas
  if (zipNum >= 40000 && zipNum <= 42999) return "KY"; // Kentucky
  if (zipNum >= 70000 && zipNum <= 71599) return "LA"; // Louisiana
  if (zipNum >= 3900 && zipNum <= 4999) return "ME"; // Maine
  if (zipNum >= 20600 && zipNum <= 21999) return "MD"; // Maryland
  if (zipNum >= 1000 && zipNum <= 2799) return "MA"; // Massachusetts
  if (zipNum >= 48000 && zipNum <= 49999) return "MI"; // Michigan
  if (zipNum >= 55000 && zipNum <= 56999) return "MN"; // Minnesota
  if (zipNum >= 38600 && zipNum <= 39999) return "MS"; // Mississippi
  if (zipNum >= 63000 && zipNum <= 65999) return "MO"; // Missouri
  if (zipNum >= 59000 && zipNum <= 59999) return "MT"; // Montana
  if (zipNum >= 68000 && zipNum <= 69999) return "NE"; // Nebraska
  if (zipNum >= 88900 && zipNum <= 89999) return "NV"; // Nevada
  if (zipNum >= 3000 && zipNum <= 3899) return "NH"; // New Hampshire
  if (zipNum >= 7000 && zipNum <= 8999) return "NJ"; // New Jersey
  if (zipNum >= 87000 && zipNum <= 88499) return "NM"; // New Mexico
  if (zipNum >= 10000 && zipNum <= 14999) return "NY"; // New York
  if (zipNum >= 27000 && zipNum <= 28999) return "NC"; // North Carolina
  if (zipNum >= 58000 && zipNum <= 58999) return "ND"; // North Dakota
  if (zipNum >= 43000 && zipNum <= 45999) return "OH"; // Ohio
  if (zipNum >= 73000 && zipNum <= 74999) return "OK"; // Oklahoma
  if (zipNum >= 97000 && zipNum <= 97999) return "OR"; // Oregon
  if (zipNum >= 15000 && zipNum <= 19699) return "PA"; // Pennsylvania
  if (zipNum >= 2800 && zipNum <= 2999) return "RI"; // Rhode Island
  if (zipNum >= 29000 && zipNum <= 29999) return "SC"; // South Carolina
  if (zipNum >= 57000 && zipNum <= 57999) return "SD"; // South Dakota
  if (zipNum >= 37000 && zipNum <= 38599) return "TN"; // Tennessee
  if (zipNum >= 75000 && zipNum <= 79999 || zipNum >= 88500 && zipNum <= 88599) return "TX"; // Texas
  if (zipNum >= 84000 && zipNum <= 84999) return "UT"; // Utah
  if (zipNum >= 5000 && zipNum <= 5999) return "VT"; // Vermont
  if (zipNum >= 20100 && zipNum <= 20599 || zipNum >= 22000 && zipNum <= 24699) return "VA"; // Virginia
  if (zipNum >= 98000 && zipNum <= 99499) return "WA"; // Washington
  if (zipNum >= 24700 && zipNum <= 26999) return "WV"; // West Virginia
  if (zipNum >= 53000 && zipNum <= 54999) return "WI"; // Wisconsin
  if (zipNum >= 82000 && zipNum <= 83199) return "WY"; // Wyoming

  return "";
};

export default function LocationStep({ formData, onComplete }: LocationStepProps) {
  const [zipCode, setZipCode] = useState(formData.zipCode || "");
  const [state, setState] = useState(formData.state || "");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect state from ZIP code
  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
    if (value.length === 5) {
      const detectedState = getStateFromZip(value);
      if (detectedState) {
        setState(detectedState);
      }
    }
  };

  // Try to detect user's location
  const detectLocation = () => {
    setIsDetectingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Using a simple approximation based on coordinates
            // In a real app, you'd use a geocoding service
            const { latitude, longitude } = position.coords;

            // Simple state detection based on general coordinate ranges
            let detectedState = "";
            if (latitude >= 32.5 && latitude <= 42 && longitude >= -124 && longitude <= -114) {
              detectedState = "CA";
            } else if (latitude >= 40.5 && latitude <= 45 && longitude >= -74.5 && longitude <= -71.5) {
              detectedState = "NY";
            } else if (latitude >= 25.5 && latitude <= 31 && longitude >= -87.5 && longitude <= -80) {
              detectedState = "FL";
            } else if (latitude >= 25.5 && latitude <= 36.5 && longitude >= -106.5 && longitude <= -93.5) {
              detectedState = "TX";
            }

            if (detectedState) {
              setState(detectedState);
            }
          } catch (error) {
            console.log("Could not detect location");
          } finally {
            setIsDetectingLocation(false);
          }
        },
        () => {
          setIsDetectingLocation(false);
        },
        { timeout: 5000 }
      );
    } else {
      setIsDetectingLocation(false);
    }
  };

  const handleNext = () => {
    if (zipCode.length === 5 && state) {
      const stepData = { zipCode, state };
      console.log("Location step completing with data:", stepData);
      onComplete(stepData);
    }
  };

  const isValid = zipCode.length === 5 && state;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Where do you live?</h2>
        <p className="text-slate-600">This helps us calculate location-specific impacts like taxes and cost of living.</p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="zipCode" className="text-sm font-medium text-slate-700">ZIP Code</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={detectLocation}
              disabled={isDetectingLocation}
              className="text-primary hover:text-primary/80 text-sm"
            >
              <MapPin className="w-4 h-4 mr-1" />
              {isDetectingLocation ? "Detecting..." : "Use my location"}
            </Button>
          </div>
          <Input
            id="zipCode"
            type="text"
            placeholder="Enter your ZIP code"
            value={zipCode}
            onChange={(e) => handleZipCodeChange(e.target.value)}
            maxLength={5}
            className="text-lg"
          />
          <p className="text-xs text-slate-500 mt-2">
            We'll automatically determine your state from your ZIP code
          </p>
        </div>

        {state && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">{state}</span>
              </div>
              <span className="text-sm font-medium text-green-800">
                State detected: {state}
              </span>
            </div>
          </div>
        )}

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-primary">Why we need this</h4>
              <p className="text-sm text-primary/80 mt-1">
                Your ZIP code helps us provide accurate estimates for local tax rates, 
                cost of living, and regional policy impacts. We automatically determine 
                your state from this information.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            disabled={!isValid}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isValid
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