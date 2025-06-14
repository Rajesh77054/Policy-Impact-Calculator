interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const stepNames = ["Location", "Demographics", "Employment", "Healthcare", "Income", "Priorities"];

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-slate-500">{Math.round(progress)}% Complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-between mt-4">
        {stepNames.map((name, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center space-y-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isCompleted || isCurrent
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {stepNumber}
              </div>
              <span className={`text-xs ${isCurrent ? "text-slate-600" : "text-slate-500"}`}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
