import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ProgressBar from "@/components/progress-bar";
import LocationStep from "@/components/form-steps/location-step";
import DemographicsStep from "@/components/form-steps/demographics-step";
import EmploymentStep from "@/components/form-steps/employment-step";
import HealthcareStep from "@/components/form-steps/healthcare-step";
import IncomeStep from "@/components/form-steps/income-step";
import PrioritiesStep from "@/components/form-steps/priorities-step";
import { Button } from "@/components/ui/button";
import { FormData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, name: "Location", component: LocationStep },
  { id: 2, name: "Demographics", component: DemographicsStep },
  { id: 3, name: "Employment", component: EmploymentStep },
  { id: 4, name: "Healthcare", component: HealthcareStep },
  { id: 5, name: "Income", component: IncomeStep },
  { id: 6, name: "Priorities", component: PrioritiesStep },
];

export default function Calculator() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const { toast } = useToast();

  // Initialize session
  const { mutate: createSession } = useMutation({
    mutationFn: () => apiRequest("POST", "/api/session"),
    onSuccess: () => {
      toast({
        title: "Session started",
        description: "Your anonymous session has been created.",
      });
    },
  });

  // Update form data
  const { mutate: updateFormData } = useMutation({
    mutationFn: (data: FormData) => apiRequest("POST", "/api/session/form-data", data),
  });

  // Calculate results
  const { mutate: calculateResults, isPending: isCalculating } = useMutation({
    mutationFn: () => apiRequest("POST", "/api/calculate"),
    onSuccess: () => {
      setLocation("/results");
    },
    onError: (error) => {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating your results. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    createSession();
  }, []);

  const handleStepComplete = (stepData: Partial<FormData>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);
    updateFormData(updatedFormData);

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - calculate results
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults();
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Policy Impact Calculator</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mt-8">
          <CurrentStepComponent
            formData={formData}
            onComplete={handleStepComplete}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={currentStep === 1 ? "invisible" : ""}
            >
              Previous
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isCalculating}
              >
                Skip
              </Button>
              <Button
                onClick={() => {
                  if (currentStep === steps.length) {
                    calculateResults();
                  } else {
                    handleStepComplete({});
                  }
                }}
                disabled={isCalculating}
              >
                {isCalculating ? "Calculating..." : currentStep === steps.length ? "View Results" : "Next Step"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}