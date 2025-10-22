import { useState } from 'react'
import Card from '../shared/Card'
import Button from '../shared/Button'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import { Background } from '@/types/gameData'

export default function StepBackground() {
  const { character, updateBackground, updateAbilityScores } = useCharacter()
  const { backgrounds } = useGameData()
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null)

  const handleBackgroundSelect = (background: Background) => {
    setSelectedBackground(background)
  }

  const handleConfirm = () => {
    if (selectedBackground) {
      updateBackground(selectedBackground.name)

      // Apply background ability boosts (simplified for demo)
      const newScores = { ...character.abilityScores }

      // For demo: apply +2 to first ability in the choice
      if (selectedBackground.abilityBoosts.length > 0) {
        const firstBoost = selectedBackground.abilityBoosts[0]
        if (firstBoost.type === 'choice' && firstBoost.abilities && firstBoost.abilities.length > 0) {
          const ability = firstBoost.abilities[0]
          newScores[ability] += 2
        }
        // Apply free boost to intelligence as demo
        if (selectedBackground.abilityBoosts.length > 1) {
          newScores.intelligence += 2
        }
      }

      updateAbilityScores(newScores)
    }
  }

  return (
    <div className="space-y-6">
      {/* Background Selection */}
      <div>
        <h3 className="text-lg font-semibold text-pf-accent mb-4">
          Choose Your Background
        </h3>
        <p className="text-sm text-pf-text-muted mb-4">
          Your background represents your life before becoming an adventurer.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {backgrounds.map((background) => (
            <Card
              key={background.id}
              hoverable
              selected={selectedBackground?.id === background.id}
              onClick={() => handleBackgroundSelect(background)}
              className="cursor-pointer"
            >
              <h4 className="text-pf-accent font-semibold mb-2">
                {background.name}
              </h4>
              <p className="text-sm text-pf-text-muted mb-3">
                {background.description}
              </p>
              <div className="text-xs text-pf-text space-y-1 border-t border-gray-700 pt-2">
                <div>
                  <strong>Skill Training:</strong> {background.skillTraining}
                </div>
                <div>
                  <strong>Feat:</strong> {background.featGranted}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Selected Background Details */}
      {selectedBackground && (
        <div className="bg-pf-bg-dark p-4 rounded border border-gray-700">
          <h4 className="text-pf-accent font-semibold mb-2">
            {selectedBackground.name} - Benefits
          </h4>
          <ul className="text-sm text-pf-text space-y-1 list-disc list-inside">
            <li>Trained in {selectedBackground.skillTraining}</li>
            <li>Gain {selectedBackground.featGranted} feat</li>
            <li>
              Ability Boosts:{' '}
              {selectedBackground.abilityBoosts.map((boost, idx) => {
                if (boost.type === 'choice' && boost.abilities) {
                  return (
                    <span key={idx}>
                      {boost.abilities.join(' or ')}
                      {boost.count && boost.count > 1 ? ` (${boost.count})` : ''}
                    </span>
                  )
                }
                return boost.type === 'free' ? 'Free choice' : ''
              }).join(', ')}
            </li>
          </ul>
        </div>
      )}

      {/* Confirm Button */}
      {selectedBackground && (
        <div className="pt-4">
          <Button onClick={handleConfirm} variant="primary">
            Confirm Selection
          </Button>
          {character.background && (
            <p className="text-sm text-green-500 mt-2">
              ✓ {character.background} selected
            </p>
          )}
        </div>
      )}
    </div>
  )
}
