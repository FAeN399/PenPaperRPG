import { useState, useMemo, useEffect } from 'react'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import Card from '../shared/Card'
import Select from '../shared/Select'
import { MagicTradition } from '@/types/character'
import { getAbilityModifier, formatModifier } from '@/utils/modifiers'
import { getProficiencyBonus } from '@/utils/proficiency'
import { ProficiencyLevel } from '@/types/character'

export default function StepSpells() {
  const { character, updateSpells } = useCharacter()
  const { classes, getSpellsByTraditionAndLevel } = useGameData()

  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState<number>(0) // 0 for cantrips, 1 for level 1
  const [selectedCantrips, setSelectedCantrips] = useState<string[]>([])
  const [selectedSpells, setSelectedSpells] = useState<string[]>([])

  // Get class spellcasting info
  const classData = classes.find((c) => c.name === character.class?.class)
  const isSpellcaster = classData?.spellcasting !== undefined

  if (!isSpellcaster) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-pf-accent mb-2">Spell Selection</h2>
          <p className="text-gray-300">
            Your class ({character.class?.class || 'None'}) does not have spellcasting abilities.
          </p>
        </div>
        <Card className="p-8">
          <div className="text-center">
            <p className="text-lg text-gray-400">
              This step is for spellcasting classes only. You may proceed to the next step.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  const spellcasting = classData.spellcasting!
  const tradition = spellcasting.tradition as 'arcane' | 'divine' | 'occult' | 'primal'
  const isPrepared = spellcasting.type === 'prepared'

  // Calculate spell DC and attack
  const keyAbility = spellcasting.keyAbility
  const abilityMod = getAbilityModifier(character.abilityScores[keyAbility])
  const proficiencyBonus = getProficiencyBonus(character.basics.level, ProficiencyLevel.Trained)
  const spellDC = 10 + abilityMod + proficiencyBonus
  const spellAttack = abilityMod + proficiencyBonus

  // Get available spells for this tradition
  const cantrips = useMemo(
    () => getSpellsByTraditionAndLevel(tradition, 0),
    [tradition, getSpellsByTraditionAndLevel]
  )

  const level1Spells = useMemo(
    () => getSpellsByTraditionAndLevel(tradition, 1),
    [tradition, getSpellsByTraditionAndLevel]
  )

  // Filter spells based on search
  const filteredSpells = useMemo(() => {
    const spellList = levelFilter === 0 ? cantrips : level1Spells
    if (!searchQuery) return spellList

    const query = searchQuery.toLowerCase()
    return spellList.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.traits.some((t) => t.toLowerCase().includes(query))
    )
  }, [cantrips, level1Spells, levelFilter, searchQuery])

  // Spell slots for level 1
  const cantripsKnown = 5 // Standard for level 1
  const level1SpellSlots = isPrepared ? 2 : 4 // Prepared gets fewer, spontaneous gets more

  const handleSpellToggle = (spellId: string, isCantrip: boolean) => {
    if (isCantrip) {
      if (selectedCantrips.includes(spellId)) {
        setSelectedCantrips(selectedCantrips.filter((id) => id !== spellId))
      } else if (selectedCantrips.length < cantripsKnown) {
        setSelectedCantrips([...selectedCantrips, spellId])
      }
    } else {
      if (selectedSpells.includes(spellId)) {
        setSelectedSpells(selectedSpells.filter((id) => id !== spellId))
      } else if (selectedSpells.length < level1SpellSlots) {
        setSelectedSpells([...selectedSpells, spellId])
      }
    }
  }

  // Update character when selections change
  useEffect(() => {
    if (selectedCantrips.length > 0 || selectedSpells.length > 0) {
      updateSpells({
        tradition: MagicTradition[tradition.charAt(0).toUpperCase() + tradition.slice(1) as keyof typeof MagicTradition],
        spellsKnown: [...selectedCantrips, ...selectedSpells],
        spellsPrepared: isPrepared ? selectedSpells : [],
      })
    }
  }, [selectedCantrips, selectedSpells, tradition, isPrepared, updateSpells])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pf-accent mb-2">Spell Selection</h2>
        <p className="text-gray-300">
          Select your {isPrepared ? 'prepared' : 'known'} spells for your {classData.name}.
        </p>
      </div>

      <div className="bg-pf-bg-card p-4 rounded-lg space-y-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Tradition:</p>
            <p className="text-lg font-semibold text-pf-accent capitalize">{tradition}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Spell DC:</p>
            <p className="text-lg font-semibold text-white">{spellDC}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Spell Attack:</p>
            <p className="text-lg font-semibold text-white">{formatModifier(spellAttack)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Type:</p>
            <p className="text-lg font-semibold text-purple-400 capitalize">{spellcasting.type}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-600">
          <div>
            <p className="text-sm text-gray-400">Cantrips Selected:</p>
            <p className={`text-lg font-bold ${selectedCantrips.length === cantripsKnown ? 'text-green-400' : 'text-pf-accent'}`}>
              {selectedCantrips.length} / {cantripsKnown}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Level 1 Spells Selected:</p>
            <p className={`text-lg font-bold ${selectedSpells.length === level1SpellSlots ? 'text-green-400' : 'text-pf-accent'}`}>
              {selectedSpells.length} / {level1SpellSlots}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Spell Level
            </label>
            <Select
              value={levelFilter.toString()}
              onChange={(value) => setLevelFilter(parseInt(value))}
              options={[
                { value: '0', label: 'Cantrips (Level 0)' },
                { value: '1', label: 'Level 1 Spells' },
              ]}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search Spells
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, description, or trait..."
              className="w-full px-3 py-2 bg-pf-bg-dark border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-pf-accent"
            />
          </div>
        </div>

        <p className="text-sm text-gray-400">
          Showing {filteredSpells.length} {levelFilter === 0 ? 'cantrips' : 'level 1 spells'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredSpells.map((spell) => {
          const isCantrip = spell.level === 0
          const selectedList = isCantrip ? selectedCantrips : selectedSpells
          const isSelected = selectedList.includes(spell.id)
          const maxReached = isCantrip
            ? selectedCantrips.length >= cantripsKnown
            : selectedSpells.length >= level1SpellSlots

          return (
            <Card
              key={spell.id}
              hoverable={!maxReached || isSelected}
              selected={isSelected}
              onClick={() => handleSpellToggle(spell.id, isCantrip)}
              className={`cursor-pointer ${maxReached && !isSelected ? 'opacity-50' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-pf-accent">{spell.name}</h3>
                    <p className="text-xs text-gray-400">
                      {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.castTime}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-xs bg-pf-accent text-white px-2 py-1 rounded">
                      ✓ Selected
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-300">{spell.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Range:</span> <span className="text-white">{spell.range}</span>
                  </div>
                  {spell.targets && (
                    <div>
                      <span className="text-gray-400">Targets:</span> <span className="text-white">{spell.targets}</span>
                    </div>
                  )}
                  {spell.area && (
                    <div>
                      <span className="text-gray-400">Area:</span> <span className="text-white">{spell.area}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Duration:</span> <span className="text-white">{spell.duration}</span>
                  </div>
                  {spell.savingThrow && (
                    <div>
                      <span className="text-gray-400">Save:</span> <span className="text-white">{spell.savingThrow}</span>
                    </div>
                  )}
                </div>

                {spell.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {spell.traits.map((trait) => (
                      <span
                        key={trait}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {filteredSpells.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No spells found matching your criteria.</p>
        </div>
      )}

      {selectedCantrips.length === cantripsKnown && selectedSpells.length === level1SpellSlots && (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
          <p className="text-green-400 font-semibold">
            ✓ All spells selected! You can now proceed to the next step.
          </p>
        </div>
      )}
    </div>
  )
}
