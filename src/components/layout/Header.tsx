interface HeaderProps {
  characterName?: string
  currentStep?: string
  totalSteps?: number
}

export default function Header({
  characterName,
  currentStep,
  totalSteps,
}: HeaderProps) {
  return (
    <header className="bg-pf-bg-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: App branding */}
        <div>
          <h1 className="text-2xl font-bold text-pf-accent">PenPaperRPG</h1>
          <p className="text-xs text-pf-text-muted">Pathfinder 2e Character Creator</p>
        </div>

        {/* Center: Character name */}
        {characterName && (
          <div className="text-center">
            <h2 className="text-lg font-semibold text-pf-text">{characterName}</h2>
            {currentStep && (
              <p className="text-xs text-pf-text-muted">
                Step {currentStep} of {totalSteps}
              </p>
            )}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            className="text-sm text-pf-text-muted hover:text-pf-text transition-colors"
            title="Save character"
          >
            💾 Save
          </button>
          <button
            className="text-sm text-pf-text-muted hover:text-pf-text transition-colors"
            title="Help"
          >
            ❓ Help
          </button>
        </div>
      </div>
    </header>
  )
}
