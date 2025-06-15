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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">
          Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
        </span>
        <span className="text-sm text-slate-500">
          {Math.round((completedSteps.length / totalSteps) * 100)}% Complete
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex items-center space-x-2 mb-4">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              ${completedSteps.includes(index + 1) ? 'bg-green-500 text-white' :
                currentStep === index + 1 ? 'bg-blue-500 text-white' :
                'bg-slate-200 text-slate-500'}`}>
              {completedSteps.includes(index + 1) ? '✓' : index + 1}
            </div>
            {index < stepLabels.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${
                completedSteps.includes(index + 1) ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      {/* Progress header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Step {currentStep} of {totalSteps}
          </h3>
          <p className="text-sm text-slate-600">
            {Math.round((completedSteps.length / totalSteps) * 100)}% Complete
          </p>
        </div>
        <div className="text-right">
          {/*  Removed Time Remaining section */}
        </div>
      </div>

      {/* Progress bar */}
      {/*  Removed Progress Bar */}

      {/* Completion encouragement */}
      {/*  Removed Completion encouragement */}
    </div>
  );
}