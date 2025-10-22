import { useState, useMemo } from 'react'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import Card from '../shared/Card'
import Button from '../shared/Button'
import Select from '../shared/Select'

export default function StepFeats() {
  const { character, addFeat } = useCharacter()
  const { getFeatsByType } = useGameData()

  const [filterType, setFilterType] = useState<'ancestry' | 'class' | 'skill' | 'general'>('ancestry')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFeat, setSelectedFeat] = useState<string | null>(null)

  // Get feats by type and filter
  const filteredFeats = useMemo(() => {
    let result = getFeatsByType(filterType)

    // Filter by ancestry/class if applicable
    if (filterType === 'ancestry' && character.ancestry?.ancestry) {
      result = result.filter((f) =>
        f.prerequisites.some(
          (p) => p.toLowerCase() === character.ancestry?.ancestry.toLowerCase()
        ) || f.prerequisites.length === 0
      )
    }

    if (filterType === 'class' && character.class?.class) {
      result = result.filter((f) =>
        f.prerequisites.some(
          (p) => p.toLowerCase() === character.class?.class.toLowerCase()
        ) || f.prerequisites.length === 0
      )
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query) ||
          f.benefit.toLowerCase().includes(query)
      )
    }

    return result
  }, [filterType, character.ancestry, character.class, searchQuery, getFeatsByType])

  const handleSelectFeat = (featId: string) => {
    if (selectedFeat === featId) {
      setSelectedFeat(null)
    } else {
      setSelectedFeat(featId)
    }
  }

  const handleConfirmFeat = () => {
    if (selectedFeat) {
      addFeat(filterType, selectedFeat)
      setSelectedFeat(null)
      alert(`Feat added to your character!`)
    }
  }

  // Check what feats the character already has
  const hasAncestryFeat = character.feats.ancestry.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pf-accent mb-2">Select Feats</h2>
        <p className="text-gray-300">
          Choose feats to customize your character. At level 1, you gain an ancestry feat.
        </p>
      </div>

      <div className="bg-pf-bg-card p-4 rounded-lg space-y-3">
        <h3 className="text-lg font-semibold text-gray-200">Feats Available</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Ancestry Feats:</p>
            <p className={`font-semibold ${hasAncestryFeat ? 'text-green-400' : 'text-pf-accent'}`}>
              {hasAncestryFeat ? '✓ Selected' : '1 available'}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Filter by Type
            </label>
            <Select
              value={filterType}
              onChange={(value) => setFilterType(value as typeof filterType)}
              options={[
                { value: 'ancestry', label: 'Ancestry Feats' },
                { value: 'class', label: 'Class Feats' },
                { value: 'skill', label: 'Skill Feats' },
                { value: 'general', label: 'General Feats' },
              ]}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Feats
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or description..."
              className="w-full px-3 py-2 bg-pf-bg-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pf-accent"
            />
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Showing {filteredFeats.length} {filterType} feats
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredFeats.map((feat) => {
          const isSelected = selectedFeat === feat.id
          const isAlreadyTaken = character.feats[filterType].includes(feat.id)

          return (
            <Card
              key={feat.id}
              hoverable={!isAlreadyTaken}
              selected={isSelected}
              onClick={() => !isAlreadyTaken && handleSelectFeat(feat.id)}
              className={`${isAlreadyTaken ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-pf-accent">{feat.name}</h3>
                    <p className="text-xs text-gray-400">
                      {feat.type.charAt(0).toUpperCase() + feat.type.slice(1)} • Level {feat.level}
                    </p>
                  </div>
                  {isAlreadyTaken && (
                    <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                      Taken
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-300">{feat.description}</p>

                {feat.prerequisites.length > 0 && (
                  <div className="text-xs text-gray-400">
                    <span className="font-semibold">Prerequisites:</span> {feat.prerequisites.join(', ')}
                  </div>
                )}

                {feat.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {feat.traits.map((trait) => (
                      <span
                        key={trait}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-gray-600">
                  <p className="text-sm text-gray-200">
                    <span className="font-semibold">Benefit:</span> {feat.benefit}
                  </p>
                </div>

                {feat.frequency && (
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold">Frequency:</span> {feat.frequency}
                  </p>
                )}

                {feat.trigger && (
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold">Trigger:</span> {feat.trigger}
                  </p>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {selectedFeat && (
        <div className="flex justify-center">
          <Button onClick={handleConfirmFeat} variant="primary">
            Confirm Feat Selection
          </Button>
        </div>
      )}

      {filteredFeats.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No feats found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
