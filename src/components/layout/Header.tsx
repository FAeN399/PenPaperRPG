import { useState, useRef, useEffect } from 'react'

interface HeaderProps {
  characterName?: string
  currentStep?: string
  totalSteps?: number
  onNewCharacter?: () => void
  onSaveCharacter?: () => void
  onLoadCharacter?: () => void
  onExportText?: () => void
}

export default function Header({
  characterName,
  currentStep,
  totalSteps,
  onNewCharacter,
  onSaveCharacter,
  onLoadCharacter,
  onExportText,
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMenuAction = (action: () => void) => {
    action()
    setShowMenu(false)
  }

  return (
    <header className="bg-pf-bg-card border-b border-pf-border px-6 py-4">
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
          {/* File Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-sm text-pf-text-muted hover:text-pf-accent transition-colors flex items-center gap-1"
              title="File operations"
            >
              📁 File
              <span className="text-xs">{showMenu ? '▲' : '▼'}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-pf-bg-card border border-pf-border rounded-lg shadow-glow overflow-hidden z-50">
                {onNewCharacter && (
                  <button
                    onClick={() => handleMenuAction(onNewCharacter)}
                    className="w-full text-left px-4 py-2.5 text-sm text-pf-text hover:bg-pf-hover transition-colors flex items-center gap-2"
                  >
                    <span>🆕</span>
                    <span>New Character</span>
                  </button>
                )}
                {onSaveCharacter && (
                  <button
                    onClick={() => handleMenuAction(onSaveCharacter)}
                    className="w-full text-left px-4 py-2.5 text-sm text-pf-text hover:bg-pf-hover transition-colors flex items-center gap-2"
                  >
                    <span>💾</span>
                    <span>Save Character</span>
                  </button>
                )}
                {onLoadCharacter && (
                  <button
                    onClick={() => handleMenuAction(onLoadCharacter)}
                    className="w-full text-left px-4 py-2.5 text-sm text-pf-text hover:bg-pf-hover transition-colors flex items-center gap-2"
                  >
                    <span>📂</span>
                    <span>Load Character</span>
                  </button>
                )}
                {onExportText && (
                  <>
                    <div className="border-t border-pf-border my-1"></div>
                    <button
                      onClick={() => handleMenuAction(onExportText)}
                      className="w-full text-left px-4 py-2.5 text-sm text-pf-text hover:bg-pf-hover transition-colors flex items-center gap-2"
                    >
                      <span>📄</span>
                      <span>Export as Text</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            className="text-sm text-pf-text-muted hover:text-pf-accent transition-colors"
            title="Help"
          >
            ❓ Help
          </button>
        </div>
      </div>
    </header>
  )
}
