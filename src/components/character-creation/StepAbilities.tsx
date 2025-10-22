import { useState, useEffect } from 'react'
import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import Card from '../shared/Card'
import {
  ALL_ABILITIES,
  ABILITY_NAMES,
  ABILITY_ABBR,
  calculateAbilityScore,
  getBoostsBySource,
  canAddFreeBoost,
} from '@/utils/abilityBoosts'
import { getAbilityModifier, formatModifier } from '@/utils/modifiers'
import { AbilityType, AbilityBoost } from '@/types/character'

export default function StepAbilities() {
  const { character, addAbilityBoost, removeAbilityBoost, applyAbilityBoosts } = useCharacter()
  const { ancestries, backgrounds, classes } = useGameData()

  const [freeBoostSelections, setFreeBoostSelections] = useState<AbilityType[]>([])

  // Initialize boosts from ancestry, background, and class if not already applied
  useEffect(() => {
    const currentBoosts = character.abilityScores.boosts
    const hasAncestryBoosts = getBoostsBySource('ancestry', currentBoosts).length > 0
    const hasBackgroundBoosts = getBoostsBySource('background', currentBoosts).length > 0
    const hasClassBoosts = getBoostsBySource('class', currentBoosts).length > 0

    const newBoosts: AbilityBoost[] = [...currentBoosts]

    // Apply ancestry boosts (simplified for demo - using first available boosts)
    if (!hasAncestryBoosts && character.ancestry?.ancestry) {
      const ancestry = ancestries.find((a) => a.name === character.ancestry?.ancestry)
      if (ancestry && ancestry.abilityBoosts.length > 0) {
        // For demo: apply specific boosts from ancestry (not free choice ones)
        for (const boost of ancestry.abilityBoosts) {
          if (boost.type === 'specific' && boost.abilities && boost.abilities.length > 0) {
            for (const ability of boost.abilities) {
              newBoosts.push({ ability: ability as AbilityType, source: 'ancestry' })
            }
          }
        }
      }
    }

    // Apply background boosts (simplified for demo - apply specific boosts only)
    if (!hasBackgroundBoosts && character.background) {
      const background = backgrounds.find((b) => b.name === character.background)
      if (background && background.abilityBoosts.length > 0) {
        for (const boost of background.abilityBoosts) {
          if (boost.type === 'specific' && boost.abilities && boost.abilities.length > 0) {
            for (const ability of boost.abilities) {
              newBoosts.push({ ability: ability as AbilityType, source: 'background' })
            }
          }
        }
      }
    }

    // Apply class boost (simplified for demo - using class key ability)
    if (!hasClassBoosts && character.class?.class) {
      const classData = classes.find((c) => c.name === character.class?.class)
      if (classData && classData.keyAbility.length > 0) {
        const keyAbility = classData.keyAbility[0].toLowerCase() as AbilityType
        newBoosts.push({ ability: keyAbility, source: 'class' })
      }
    }

    if (newBoosts.length > currentBoosts.length) {
      applyAbilityBoosts(newBoosts)
    }
  }, [character.ancestry, character.background, character.class, ancestries, backgrounds, classes])

  const handleFreeBoostToggle = (ability: AbilityType) => {
    const isSelected = freeBoostSelections.includes(ability)

    if (isSelected) {
      // Remove the free boost
      setFreeBoostSelections(freeBoostSelections.filter((a) => a !== ability))
      removeAbilityBoost({ ability, source: 'free' })
    } else {
      // Check if we can add this free boost
      const validation = canAddFreeBoost(ability, character.abilityScores.boosts)

      if (validation.valid) {
        setFreeBoostSelections([...freeBoostSelections, ability])
        addAbilityBoost({ ability, source: 'free' })
      } else {
        alert(validation.reason)
      }
    }
  }

  const freeBoostsRemaining = 4 - freeBoostSelections.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-pf-accent mb-2">Ability Scores</h2>
        <p className="text-gray-300">
          Your ability scores start at 10. Apply boosts from your ancestry, background, and class,
          then choose 4 free boosts.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Each boost adds +2 to an ability score (or +1 if the score is already 18 or higher).
          You cannot apply more than one free boost to the same ability.
        </p>
      </div>

      <div className="bg-pf-bg-card p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-pf-accent mb-2">
          Free Boosts Remaining: {freeBoostsRemaining} / 4
        </h3>
        <p className="text-sm text-gray-400">
          Click on an ability below to apply a free boost
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_ABILITIES.map((ability) => {
          const score = calculateAbilityScore(ability, character.abilityScores.boosts)
          const modifier = getAbilityModifier(score)
          const boosts = character.abilityScores.boosts.filter((b) => b.ability === ability)
          const ancestryBoosts = boosts.filter((b) => b.source === 'ancestry').length
          const backgroundBoosts = boosts.filter((b) => b.source === 'background').length
          const classBoosts = boosts.filter((b) => b.source === 'class').length
          const freeBoosts = boosts.filter((b) => b.source === 'free').length
          const isSelected = freeBoostSelections.includes(ability)

          return (
            <Card
              key={ability}
              hoverable
              selected={isSelected}
              onClick={() => handleFreeBoostToggle(ability)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-pf-accent">
                    {ABILITY_NAMES[ability]}
                  </h3>
                  <p className="text-xs text-gray-400">{ABILITY_ABBR[ability]}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{score}</div>
                  <div className="text-sm text-gray-400">
                    {formatModifier(modifier)} mod
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Base:</span>
                  <span>10</span>
                </div>
                {ancestryBoosts > 0 && (
                  <div className="flex justify-between text-blue-400">
                    <span>Ancestry:</span>
                    <span>+{ancestryBoosts * 2}</span>
                  </div>
                )}
                {backgroundBoosts > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Background:</span>
                    <span>+{backgroundBoosts * 2}</span>
                  </div>
                )}
                {classBoosts > 0 && (
                  <div className="flex justify-between text-purple-400">
                    <span>Class:</span>
                    <span>+{classBoosts * 2}</span>
                  </div>
                )}
                {freeBoosts > 0 && (
                  <div className="flex justify-between text-pf-accent">
                    <span>Free:</span>
                    <span>+{freeBoosts * 2}</span>
                  </div>
                )}
              </div>

              {freeBoosts === 0 && freeBoostsRemaining > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-400 text-center">
                    Click to add free boost
                  </p>
                </div>
              )}

              {isSelected && (
                <div className="mt-3 pt-3 border-t border-pf-accent">
                  <p className="text-xs text-pf-accent text-center font-semibold">
                    ✓ Free boost applied
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {freeBoostsRemaining === 0 && (
        <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
          <p className="text-green-400 font-semibold">
            ✓ All ability boosts applied! You can now proceed to the next step.
          </p>
        </div>
      )}

      <div className="bg-pf-bg-card p-4 rounded-lg">
        <h4 className="text-md font-semibold text-gray-300 mb-2">How Boosts Work</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• All abilities start at 10</li>
          <li>• Each boost adds +2 to the ability score</li>
          <li>• If an ability is 18 or higher, boosts only add +1</li>
          <li>• You get 4 free boosts to assign as you choose</li>
          <li>• You cannot assign more than one free boost to the same ability at level 1</li>
        </ul>
      </div>
    </div>
  )
}
