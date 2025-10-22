import { StepInfo, CharacterCreationStep } from '@/types/steps'

interface StepIndicatorProps {
  steps: StepInfo[]
  currentStep: CharacterCreationStep
  onStepClick?: (step: CharacterCreationStep) => void
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  const currentStepOrder =
    steps.find((s) => s.id === currentStep)?.order || 1

  return (
    <div className="bg-pf-bg-card border-b border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.order < currentStepOrder
          const isClickable = onStepClick && (isCompleted || isActive)

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isActive
                    ? 'border-pf-accent bg-pf-accent text-white font-bold'
                    : isCompleted
                      ? 'border-pf-accent bg-pf-bg-dark text-pf-accent'
                      : 'border-gray-600 bg-pf-bg-dark text-pf-text-muted'
                } ${isClickable ? 'cursor-pointer hover:scale-110' : ''}`}
                onClick={isClickable ? () => onStepClick(step.id) : undefined}
                title={step.label}
              >
                {isCompleted ? '✓' : step.order}
              </div>

              {/* Step label (show on hover or active) */}
              <div className="ml-2 hidden lg:block">
                <div
                  className={`text-xs font-medium ${
                    isActive ? 'text-pf-accent' : 'text-pf-text-muted'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-pf-accent' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
