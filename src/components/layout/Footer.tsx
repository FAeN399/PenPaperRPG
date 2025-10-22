import Button from '@/components/shared/Button'

interface FooterProps {
  onBack?: () => void
  onNext?: () => void
  onSave?: () => void
  backLabel?: string
  nextLabel?: string
  canGoBack?: boolean
  canGoNext?: boolean
  isFirstStep?: boolean
  isLastStep?: boolean
}

export default function Footer({
  onBack,
  onNext,
  onSave,
  backLabel = 'Back',
  nextLabel = 'Next',
  canGoBack = true,
  canGoNext = true,
  isFirstStep = false,
  isLastStep = false,
}: FooterProps) {
  return (
    <footer className="bg-pf-bg-card border-t border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Back button */}
        <div>
          {!isFirstStep && onBack && (
            <Button
              onClick={onBack}
              variant="secondary"
              disabled={!canGoBack}
            >
              ← {backLabel}
            </Button>
          )}
        </div>

        {/* Center: Save draft */}
        <div>
          {onSave && (
            <Button onClick={onSave} variant="ghost" size="sm">
              💾 Save Draft
            </Button>
          )}
        </div>

        {/* Right: Next/Finish button */}
        <div>
          {onNext && (
            <Button
              onClick={onNext}
              variant="primary"
              disabled={!canGoNext}
            >
              {isLastStep ? '✓ Finish' : `${nextLabel} →`}
            </Button>
          )}
        </div>
      </div>
    </footer>
  )
}
