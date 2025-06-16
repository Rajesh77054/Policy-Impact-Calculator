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
      <div className="flex items-center space-x-2 mb-6">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 glass-icon",
              completedSteps.includes(index + 1) 
                ? 'bg-emerald-500/80 text-white glow-on-hover' 
                : currentStep === index + 1 
                ? 'bg-primary/80 text-primary-foreground glow-on-hover' 
                : 'bg-muted/50 text-muted-foreground'
            )}>
              {completedSteps.includes(index + 1) ? (
                <CheckCircle className="w-4 h-4" />
              ) : currentStep === index + 1 ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            {index < stepLabels.length - 1 && (
              <div className={cn(
                "w-8 h-1 mx-1 rounded-full progress-bar transition-all duration-500",
                completedSteps.includes(index + 1) && "progress-fill"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="progress-bar h-2 rounded-full overflow-hidden mb-4">
        <div 
          className="progress-fill h-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Progress details */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {completedSteps.length} of {totalSteps} steps completed
        </span>
        <span className="text-foreground font-medium">
          {totalSteps - completedSteps.length} remaining
        </span>
      </div>
    </div>
  );
}