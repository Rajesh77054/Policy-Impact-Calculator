import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ProgressBar from "@/components/progress-bar";
import ThemeSelector from "@/components/theme-selector";
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const [sessionReady, setSessionReady] = useState(false);

  // Initialize session
  const { mutate: createSession } = useMutation({
    mutationFn: () => apiRequest("POST", "/api/session"),
    onSuccess: () => {
      setSessionReady(true);
      console.log("Session created successfully");
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
      // Retry session creation after a short delay
      setTimeout(() => {
        console.log("Retrying session creation...");
        createSession();
      }, 2000);
    },
  });

  // Update form data
  const { mutate: updateFormData } = useMutation({
    mutationFn: (data: FormData) => {
      console.log("Sending form data to server:", data);
      return apiRequest("POST", "/api/session/form-data", data);
    },
    onSuccess: (response) => {
      console.log("Form data update response:", response);
    },
    onError: (error) => {
      console.error("Form data update error:", error);
    },
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

  const handleStepComplete = async (stepData: Partial<FormData>) => {
    console.log("Step completed with data:", stepData);
    console.log("Current form data before update:", formData);
    console.log("Session ready status:", sessionReady);

    if (!sessionReady) {
      console.error("Session not ready, cannot save form data");
      toast({
        title: "Session Error",
        description: "Session is not ready. Please wait a moment and try again.",
        variant: "destructive",
      });
      return;
    }

    // Ensure we're properly merging the data
    const updatedData = { ...formData, ...stepData };
    console.log("Updated form data to be sent:", updatedData);

    // Update local state first
    setFormData(updatedData);

    try {
      console.log("Sending form data to server:", JSON.stringify(updatedData, null, 2));
      const response = await fetch("/api/session/form-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'same-origin', // Ensure cookies are sent
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        
        // If it's a session error, try to reinitialize session
        if (response.status === 404) {
          console.log("Session not found, reinitializing...");
          setSessionReady(false);
          createSession();
          toast({
            title: "Session Reinitialized",
            description: "Please try your action again.",
            variant: "default",
          });
          return;
        }
        
        throw new Error(`Failed to save form data: ${response.status}`);
      }

      const session = await response.json();
      console.log("Server response:", session);

      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }

      // Move to next step or calculate results
      if (currentStep === steps.length) {
        calculateResults();
      } else {
        // Small delay for visual feedback before auto-advancing
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 300);
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Save Error",
        description: "Failed to save form data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    console.log("Skipping step, preserving current form data:", formData);
    console.log("Session ready status on skip:", sessionReady);

    if (!sessionReady) {
      console.log("Session not ready, skipping without saving");
      return;
    }

    try {
      console.log("Skip - Sending form data to server:", JSON.stringify(formData, null, 2));
      const response = await fetch("/api/session/form-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Skip - Server error response:", errorText);
        throw new Error(`Failed to save form data on skip: ${response.status}`);
      }

      const session = await response.json();
      console.log("Skip - Server response:", session);
    } catch (error) {
      console.error("Error saving form data on skip:", error);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50 glass-morphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PC</span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">Policy Impact Calculator</h1>
            </div>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <ProgressBar currentStep={currentStep} totalSteps={steps.length} completedSteps={completedSteps} />

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border enhanced-card p-4 sm:p-8 mt-6 sm:mt-8">
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

            <div className="flex items-center space-x-3">
            {/* Form completeness indicator */}
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <span>Optional step - you can skip or continue</span>
            </div>

            <Button
              variant="ghost"
              onClick={async () => {
                await handleSkip();
                if (currentStep < steps.length) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={isCalculating}
              className="text-slate-600 hover:text-slate-800"
            >
              Skip this step
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}