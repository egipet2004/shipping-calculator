interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function FormNavigation({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  isFirstStep, 
  isLastStep 
}: FormNavigationProps) {
  return (
    <div 
      className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6"
      role="region" 
      aria-label="Form Navigation"
    >
      {!isFirstStep ? (
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Go to previous step"
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Previous
        </button>
      ) : (
        <div aria-hidden="true" />
      )}

      <div className="text-sm text-gray-500 font-medium" aria-live="polite">
        Step {currentStep} of {totalSteps}
      </div>

      {!isLastStep && (
        <button
          type="button"
          onClick={onNext}
          aria-label="Go to next step"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      )}
    </div>
  );
}

