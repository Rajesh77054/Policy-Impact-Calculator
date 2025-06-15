import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Circle } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}

export default function ProgressBar({ currentStep, totalSteps, completedSteps }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Estimate time remaining (assuming 1-2 minutes per step)
  const remainingSteps = totalSteps - currentStep;
  const estimatedMinutes = Math.max(1, remainingSteps * 1.5);

  const steps = [
    { id: 1, name: "Location", icon: "📍", estimatedTime: "30 sec" },
    { id: 2, name: "Demographics", icon: "👤", estimatedTime: "1 min" },
    { id: 3, name: "Employment", icon: "💼", estimatedTime: "1 min" },
    { id: 4, name: "Healthcare", icon: "🏥", estimatedTime: "1 min" },
    { id: 5, name: "Income", icon: "💰", estimatedTime: "45 sec" },
    { id: 6, name: "Priorities", icon: "⭐", estimatedTime: "2 min" },
  ];

  return (
    <div className="w-full">
      {/* Progress header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Step {currentStep} of {totalSteps}
          </h3>
          <p className="text-sm text-slate-600">
            {Math.round(progressPercentage)}% Complete
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>~{Math.round(estimatedMinutes)} min remaining</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {steps[currentStep - 1]?.estimatedTime} for this step
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-3 mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPast = step.id < currentStep;
          const isFuture = step.id > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1 group">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-200 border-2",
                  {
                    "bg-primary text-white border-primary shadow-md scale-110": isCurrent,
                    "bg-green-500 text-white border-green-500": isCompleted || isPast,
                    "bg-slate-100 text-slate-400 border-slate-200 hover:border-slate-300": isFuture,
                  }
                )}
              >
                {isCompleted || isPast ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isCurrent ? (
                  <Circle className="w-5 h-5 animate-pulse" />
                ) : (
                  <span className="text-lg">{step.icon}</span>
                )}
              </div>
              <div className="text-center">
                <span
                  className={cn("text-xs font-medium block", {
                    "text-primary": isCurrent,
                    "text-green-600": isCompleted || isPast,
                    "text-slate-500": isFuture,
                  })}
                >
                  {step.name}
                </span>
                {isCurrent && (
                  <span className="text-xs text-slate-500 mt-1 block">
                    {step.estimatedTime}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion encouragement */}
      {progressPercentage > 50 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-green-600 font-medium">
            🎉 Great progress! You're more than halfway there.
          </p>
        </div>
      )}
    </div>
  );
}