import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

const stepLabels = [
  "Location", "About You", "Work", "Health", "Income", "Priorities"
];

export default function ProgressBar({ currentStep, totalSteps, completedSteps }: ProgressBarProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between mb-6">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
              completedSteps.includes(index + 1) 
                ? 'bg-green-500 text-white' 
                : currentStep === index + 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500'
            )}>
              {completedSteps.includes(index + 1) ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            {index < stepLabels.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-2 transition-all duration-500",
                completedSteps.includes(index + 1) 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Progress details */}
      <div className="flex justify-between items-center text-sm mt-4">
        <span className="text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-muted-foreground">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
    </div>
  );
}