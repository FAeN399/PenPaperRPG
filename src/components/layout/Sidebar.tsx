import { Character } from '@/types/character'
import { getAbilityModifier, formatModifier } from '@/utils/modifiers'

interface SidebarProps {
  character: Character
}

export default function Sidebar({ character }: SidebarProps) {
  const abilityModifier = (score: number): string => {
    return formatModifier(getAbilityModifier(score))
  }

  return (
    <aside className="w-80 bg-pf-bg-card border-r border-gray-700 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-pf-accent mb-4">Character Stats</h3>

      {/* Basic Info */}
      <div className="mb-6">
        <div className="text-sm mb-2">
          <span className="text-pf-text-muted">Name:</span>{' '}
          <span className="text-pf-text">
            {character.basics.name || 'Unnamed Character'}
          </span>
        </div>
        <div className="text-sm mb-2">
          <span className="text-pf-text-muted">Level:</span>{' '}
          <span className="text-pf-text">{character.basics.level}</span>
        </div>
        {character.ancestry && (
          <div className="text-sm mb-2">
            <span className="text-pf-text-muted">Ancestry:</span>{' '}
            <span className="text-pf-text">{character.ancestry.ancestry}</span>
          </div>
        )}
        {character.background && (
          <div className="text-sm mb-2">
            <span className="text-pf-text-muted">Background:</span>{' '}
            <span className="text-pf-text">{character.background}</span>
          </div>
        )}
        {character.class && (
          <div className="text-sm mb-2">
            <span className="text-pf-text-muted">Class:</span>{' '}
            <span className="text-pf-text">{character.class.class}</span>
          </div>
        )}
      </div>

      {/* Ability Scores */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-pf-accent mb-2">Ability Scores</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(character.abilityScores).map(([ability, score]) => (
            <div
              key={ability}
              className="bg-pf-bg-dark rounded px-2 py-1 text-center"
            >
              <div className="text-xs text-pf-text-muted capitalize">
                {ability.slice(0, 3)}
              </div>
              <div className="text-lg font-bold text-pf-text">
                {abilityModifier(score)}
              </div>
              <div className="text-xs text-pf-text-muted">{score}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-pf-accent mb-2">Combat</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">HP:</span>
            <span className="text-pf-text">
              {character.derivedStats.hp} / {character.derivedStats.maxHp}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">AC:</span>
            <span className="text-pf-text">{character.derivedStats.ac}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Class DC:</span>
            <span className="text-pf-text">{character.derivedStats.classDC}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Perception:</span>
            <span className="text-pf-text">
              {character.derivedStats.perception >= 0 ? '+' : ''}
              {character.derivedStats.perception}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Speed:</span>
            <span className="text-pf-text">{character.derivedStats.speed} ft</span>
          </div>
        </div>
      </div>

      {/* Saves */}
      <div>
        <h4 className="text-sm font-semibold text-pf-accent mb-2">Saving Throws</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Fortitude:</span>
            <span className="text-pf-text">
              {character.derivedStats.saves.fortitude >= 0 ? '+' : ''}
              {character.derivedStats.saves.fortitude}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Reflex:</span>
            <span className="text-pf-text">
              {character.derivedStats.saves.reflex >= 0 ? '+' : ''}
              {character.derivedStats.saves.reflex}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-pf-text-muted">Will:</span>
            <span className="text-pf-text">
              {character.derivedStats.saves.will >= 0 ? '+' : ''}
              {character.derivedStats.saves.will}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
