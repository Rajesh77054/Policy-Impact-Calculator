interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps?: number[];
}

export default function ProgressBar({ currentStep, totalSteps, completedSteps = [] }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, name: "Location" },
    { number: 2, name: "Demographics" },
    { number: 3, name: "Employment" },
    { number: 4, name: "Healthcare" },
    { number: 5, name: "Income" },
    { number: 6, name: "Priorities" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">
          Step {currentStep} of {totalSteps}
        </h3>
        <span className="text-sm font-medium text-slate-600">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = step.number === currentStep;
          const isPast = step.number < currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-colors
                ${isCurrent 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300' 
                  : isCompleted 
                    ? 'bg-green-600 text-white' 
                    : isPast 
                      ? 'bg-slate-400 text-white' 
                      : 'bg-slate-200 text-slate-500'
                }
              `}>
                {isCompleted ? '✓' : step.number}
              </div>
              <span className={`text-xs ${
                isCurrent ? 'text-blue-600 font-medium' : 
                isCompleted ? 'text-green-600 font-medium' : 
                'text-slate-500'
              }`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}