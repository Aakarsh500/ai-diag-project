
import { cn } from '../utils/cn';

interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}) => {
  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -translate-y-1/2 z-0" />
        
        {/* Progress Line Fill */}
        <div 
          className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-500"
          style={{ width: `${((Math.max(...completedSteps, currentStep - 1)) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const isClickable = isCompleted || step.id <= currentStep;

          return (
            <button
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "relative z-10 flex flex-col items-center group transition-all duration-300",
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                  isCompleted
                    ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white scale-100"
                    : isCurrent
                    ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white scale-110 ring-4 ring-teal-200"
                    : "bg-white text-slate-400 border-2 border-slate-200",
                  isClickable && !isCurrent && "hover:scale-105"
                )}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium transition-colors duration-300 max-w-[80px] text-center",
                  isCurrent ? "text-teal-600" : isCompleted ? "text-slate-600" : "text-slate-400"
                )}
              >
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
