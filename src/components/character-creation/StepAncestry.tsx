import { useState } from 'react'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Select from '../shared/Select'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import { Ancestry, Heritage } from '@/types/gameData'

export default function StepAncestry() {
  const { character, updateAncestry, updateAbilityScores } = useCharacter()
  const { ancestries, getHeritagesForAncestry } = useGameData()
  const [selectedAncestry, setSelectedAncestry] = useState<Ancestry | null>(null)
  const [selectedHeritage, setSelectedHeritage] = useState<string>('')
  const [availableHeritages, setAvailableHeritages] = useState<Heritage[]>([])

  const handleAncestrySelect = (ancestry: Ancestry) => {
    setSelectedAncestry(ancestry)
    setSelectedHeritage('')
    const heritages = getHeritagesForAncestry(ancestry.id)
    setAvailableHeritages(heritages)

    // Apply ancestry ability boosts (this is simplified - full implementation in Phase 5)
    // For now, just demonstrate it works
    const newScores = { ...character.abilityScores }

    // Simple demo: apply fixed boosts for now
    if (ancestry.id === 'human') {
      newScores.strength += 2
      newScores.intelligence += 2
    } else if (ancestry.id === 'elf') {
      newScores.dexterity += 2
      newScores.intelligence += 2
    } else if (ancestry.id === 'dwarf') {
      newScores.constitution += 2
      newScores.wisdom += 2
    }

    updateAbilityScores(newScores)
  }

  const handleConfirm = () => {
    if (selectedAncestry && selectedHeritage) {
      updateAncestry({
        ancestry: selectedAncestry.name,
        heritage: selectedHeritage,
        ancestryFeat: null,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Ancestry Selection */}
      <div>
        <h3 className="text-lg font-semibold text-pf-accent mb-4">Choose Your Ancestry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ancestries.map((ancestry) => (
            <Card
              key={ancestry.id}
              hoverable
              selected={selectedAncestry?.id === ancestry.id}
              onClick={() => handleAncestrySelect(ancestry)}
              className="cursor-pointer"
            >
              <h4 className="text-pf-accent font-semibold mb-2">{ancestry.name}</h4>
              <p className="text-sm text-pf-text-muted mb-3">{ancestry.description}</p>
              <div className="text-xs text-pf-text space-y-1">
                <div><strong>HP:</strong> {ancestry.hitPoints}</div>
                <div><strong>Size:</strong> {ancestry.size}</div>
                <div><strong>Speed:</strong> {ancestry.speed} ft</div>
                <div><strong>Languages:</strong> {ancestry.languages.join(', ')}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Heritage Selection */}
      {selectedAncestry && availableHeritages.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-pf-accent mb-4">Choose Your Heritage</h3>
          <div className="max-w-md">
            <Select
              label="Heritage"
              value={selectedHeritage}
              onChange={setSelectedHeritage}
              options={availableHeritages.map((h) => ({
                value: h.name,
                label: h.name,
              }))}
              placeholder="Select a heritage..."
              required
            />
            {selectedHeritage && (
              <div className="mt-4 p-4 bg-pf-bg-dark rounded">
                {availableHeritages.find((h) => h.name === selectedHeritage)?.description}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Button */}
      {selectedAncestry && selectedHeritage && (
        <div className="pt-4">
          <Button onClick={handleConfirm} variant="primary">
            Confirm Selection
          </Button>
          {character.ancestry && (
            <p className="text-sm text-green-500 mt-2">
              ✓ {character.ancestry.ancestry} ({character.ancestry.heritage}) selected
            </p>
          )}
        </div>
      )}
    </div>
  )
}
