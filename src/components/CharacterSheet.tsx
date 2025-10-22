import { useCharacter } from '@/hooks/useCharacter'
import { useGameData } from '@/hooks/useGameData'
import { getAbilityModifier, formatModifier } from '@/utils/modifiers'
import { getProficiencyBonus } from '@/utils/proficiency'
import { ProficiencyLevel, AbilityType } from '@/types/character'
import { Feat, Spell, Weapon, Item } from '@/types/gameData'
import { useMemo } from 'react'

export default function CharacterSheet() {
  const { character } = useCharacter()
  const {
    getAncestryById,
    getHeritageById,
    getBackgroundById,
    getClassById,
    getFeatById,
    getSpellById,
    getWeaponById,
    getArmorById,
    getItemById,
  } = useGameData()

  // Get full game data objects
  const ancestry = character.ancestry
    ? getAncestryById(character.ancestry.ancestry)
    : null
  const heritage = character.ancestry?.heritage
    ? getHeritageById(character.ancestry.heritage)
    : null
  const background = character.background
    ? getBackgroundById(character.background)
    : null
  const classData = character.class ? getClassById(character.class.class) : null

  // Get feats with full details
  const ancestryFeats = character.feats.ancestry
    .map((id) => getFeatById(id))
    .filter((feat): feat is Feat => feat !== undefined)
  const classFeats = character.feats.class
    .map((id) => getFeatById(id))
    .filter((feat): feat is Feat => feat !== undefined)
  const skillFeats = character.feats.skill
    .map((id) => getFeatById(id))
    .filter((feat): feat is Feat => feat !== undefined)
  const generalFeats = character.feats.general
    .map((id) => getFeatById(id))
    .filter((feat): feat is Feat => feat !== undefined)

  // Get spells with full details
  const spellsKnown = character.spells?.spellsKnown
    .map((id) => getSpellById(id))
    .filter((spell): spell is Spell => spell !== undefined)
  const spellsPrepared = character.spells?.spellsPrepared
    .map((id) => getSpellById(id))
    .filter((spell): spell is Spell => spell !== undefined)

  // Get equipment with full details
  const equippedWeapons = character.equipment.weapons
    .map((id) => getWeaponById(id))
    .filter((weapon): weapon is Weapon => weapon !== undefined)
  const equippedArmor = character.equipment.armor
    ? getArmorById(character.equipment.armor)
    : null
  const equippedItems = character.equipment.items
    .map((id) => getItemById(id))
    .filter((item): item is Item => item !== undefined)

  // Calculate skill modifiers
  const skillModifiers = useMemo(() => {
    const mods: { [key: string]: number } = {}
    const skillAbilities: { [key: string]: AbilityType } = {
      acrobatics: 'dexterity',
      arcana: 'intelligence',
      athletics: 'strength',
      crafting: 'intelligence',
      deception: 'charisma',
      diplomacy: 'charisma',
      intimidation: 'charisma',
      medicine: 'wisdom',
      nature: 'wisdom',
      occultism: 'intelligence',
      performance: 'charisma',
      religion: 'wisdom',
      society: 'intelligence',
      stealth: 'dexterity',
      survival: 'wisdom',
      thievery: 'dexterity',
    }

    Object.entries(character.skills).forEach(([skill, proficiency]) => {
      const ability = skillAbilities[skill]
      const abilityMod = getAbilityModifier(character.abilityScores[ability])
      const profBonus = getProficiencyBonus(character.basics.level, proficiency)
      mods[skill] = abilityMod + profBonus
    })

    return mods
  }, [character])

  // Spell DC for spellcasters
  const spellDC = useMemo(() => {
    if (!classData?.spellcasting) return null
    const keyAbility = classData.spellcasting.keyAbility
    const abilityMod = getAbilityModifier(character.abilityScores[keyAbility])
    const profBonus = getProficiencyBonus(
      character.basics.level,
      ProficiencyLevel.Trained
    )
    return 10 + abilityMod + profBonus
  }, [classData, character])

  const spellAttack = useMemo(() => {
    if (!classData?.spellcasting) return null
    const keyAbility = classData.spellcasting.keyAbility
    const abilityMod = getAbilityModifier(character.abilityScores[keyAbility])
    const profBonus = getProficiencyBonus(
      character.basics.level,
      ProficiencyLevel.Trained
    )
    return abilityMod + profBonus
  }, [classData, character])

  const abilityModifier = (score: number): string => {
    return formatModifier(getAbilityModifier(score))
  }

  return (
    <div className="min-h-screen bg-pf-bg p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6 mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h1 className="text-3xl font-bold text-pf-accent mb-2">
                {character.basics.name || 'Unnamed Character'}
              </h1>
              <p className="text-pf-text-muted text-lg">
                Level {character.basics.level}{' '}
                {ancestry?.name && `${ancestry.name} `}
                {classData?.name}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-sm">
                <span className="text-pf-text-muted">Player: </span>
                <span className="text-pf-text">
                  {character.basics.playerName || 'Unknown'}
                </span>
              </div>
              {heritage && (
                <div className="text-sm">
                  <span className="text-pf-text-muted">Heritage: </span>
                  <span className="text-pf-text">{heritage.name}</span>
                </div>
              )}
              {background && (
                <div className="text-sm">
                  <span className="text-pf-text-muted">Background: </span>
                  <span className="text-pf-text">{background.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Ability Scores */}
          <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-pf-accent mb-4">Ability Scores</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(character.abilityScores) as AbilityType[])
                .filter((key) => key !== 'boosts' as any)
                .map((ability) => (
                  <div
                    key={ability}
                    className="bg-pf-bg-dark rounded-lg p-3 text-center border border-gray-700"
                  >
                    <div className="text-xs text-pf-text-muted uppercase mb-1">
                      {ability.slice(0, 3)}
                    </div>
                    <div className="text-2xl font-bold text-pf-accent">
                      {abilityModifier(character.abilityScores[ability])}
                    </div>
                    <div className="text-sm text-pf-text-muted">
                      {character.abilityScores[ability]}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Combat Stats */}
          <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-pf-accent mb-4">Combat Stats</h2>
            <div className="space-y-3">
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Hit Points</div>
                <div className="text-2xl font-bold text-pf-accent">
                  {character.derivedStats.maxHp}
                </div>
              </div>
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Armor Class</div>
                <div className="text-2xl font-bold text-pf-accent">
                  {character.derivedStats.ac}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700 flex-1">
                  <div className="text-xs text-pf-text-muted mb-1">Speed</div>
                  <div className="text-lg font-bold text-pf-text">
                    {character.derivedStats.speed} ft
                  </div>
                </div>
                <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700 flex-1">
                  <div className="text-xs text-pf-text-muted mb-1">Perception</div>
                  <div className="text-lg font-bold text-pf-text">
                    {formatModifier(character.derivedStats.perception)}
                  </div>
                </div>
              </div>
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Class DC</div>
                <div className="text-lg font-bold text-pf-text">
                  {character.derivedStats.classDC}
                </div>
              </div>
            </div>
          </div>

          {/* Saving Throws */}
          <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-pf-accent mb-4">Saving Throws</h2>
            <div className="space-y-3">
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Fortitude</div>
                <div className="text-2xl font-bold text-pf-accent">
                  {formatModifier(character.derivedStats.saves.fortitude)}
                </div>
              </div>
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Reflex</div>
                <div className="text-2xl font-bold text-pf-accent">
                  {formatModifier(character.derivedStats.saves.reflex)}
                </div>
              </div>
              <div className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700">
                <div className="text-xs text-pf-text-muted mb-1">Will</div>
                <div className="text-2xl font-bold text-pf-accent">
                  {formatModifier(character.derivedStats.saves.will)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-pf-accent mb-4">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(skillModifiers).map(([skill, modifier]) => (
              <div
                key={skill}
                className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700 flex justify-between items-center"
              >
                <span className="text-sm text-pf-text capitalize">{skill}</span>
                <span className="text-lg font-bold text-pf-accent">
                  {formatModifier(modifier)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feats */}
        <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-pf-accent mb-4">Feats & Features</h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Ancestry Features & Feat */}
            <div>
              <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                Ancestry
              </h3>
              {heritage && (
                <div className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3">
                  <div className="font-semibold text-pf-text mb-1">
                    {heritage.name}
                  </div>
                  <div className="text-sm text-pf-text-muted">
                    {heritage.description}
                  </div>
                </div>
              )}
              {ancestryFeats.map((feat) => (
                <div
                  key={feat.id}
                  className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3"
                >
                  <div className="font-semibold text-pf-text mb-1">{feat.name}</div>
                  <div className="text-xs text-pf-accent-light mb-2">
                    {feat.traits?.join(', ')}
                  </div>
                  <div className="text-sm text-pf-text-muted">{feat.description}</div>
                  {feat.benefit && (
                    <div className="text-sm text-pf-text mt-2">
                      <span className="font-semibold">Benefit: </span>
                      {feat.benefit}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Class Feats */}
            <div>
              <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                Class
              </h3>
              {classFeats.map((feat) => (
                <div
                  key={feat.id}
                  className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3"
                >
                  <div className="font-semibold text-pf-text mb-1">{feat.name}</div>
                  <div className="text-xs text-pf-accent-light mb-2">
                    {feat.traits?.join(', ')}
                  </div>
                  <div className="text-sm text-pf-text-muted">{feat.description}</div>
                  {feat.benefit && (
                    <div className="text-sm text-pf-text mt-2">
                      <span className="font-semibold">Benefit: </span>
                      {feat.benefit}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Skill Feats */}
            {skillFeats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                  Skill Feats
                </h3>
                {skillFeats.map((feat) => (
                  <div
                    key={feat.id}
                    className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3"
                  >
                    <div className="font-semibold text-pf-text mb-1">{feat.name}</div>
                    <div className="text-xs text-pf-accent-light mb-2">
                      {feat.traits?.join(', ')}
                    </div>
                    <div className="text-sm text-pf-text-muted">
                      {feat.description}
                    </div>
                    {feat.benefit && (
                      <div className="text-sm text-pf-text mt-2">
                        <span className="font-semibold">Benefit: </span>
                        {feat.benefit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* General Feats */}
            {generalFeats.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                  General Feats
                </h3>
                {generalFeats.map((feat) => (
                  <div
                    key={feat.id}
                    className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3"
                  >
                    <div className="font-semibold text-pf-text mb-1">{feat.name}</div>
                    <div className="text-xs text-pf-accent-light mb-2">
                      {feat.traits?.join(', ')}
                    </div>
                    <div className="text-sm text-pf-text-muted">
                      {feat.description}
                    </div>
                    {feat.benefit && (
                      <div className="text-sm text-pf-text mt-2">
                        <span className="font-semibold">Benefit: </span>
                        {feat.benefit}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Equipment */}
        {(equippedWeapons.length > 0 || equippedArmor || equippedItems.length > 0) && (
          <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pf-accent">Equipment</h2>
              <div className="text-sm text-pf-text-muted">
                Gold: {character.equipment.gold.toFixed(2)} gp
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weapons */}
              {equippedWeapons.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                    Weapons
                  </h3>
                  {equippedWeapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3"
                    >
                      <div className="font-semibold text-pf-text mb-1">
                        {weapon.name}
                      </div>
                      <div className="text-xs text-pf-accent-light mb-2">
                        {weapon.category} • {weapon.group}
                      </div>
                      <div className="text-sm text-pf-text-muted mb-2">
                        Damage: {weapon.damage} {weapon.damageType}
                      </div>
                      <div className="text-xs text-pf-text-muted">
                        Hands: {weapon.hands} • Bulk: {weapon.bulk}
                        {weapon.range && ` • Range: ${weapon.range} ft`}
                      </div>
                      {weapon.traits.length > 0 && (
                        <div className="text-xs text-pf-accent-light mt-2">
                          {weapon.traits.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Armor */}
              {equippedArmor && (
                <div>
                  <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                    Armor
                  </h3>
                  <div className="bg-pf-bg-dark rounded-lg p-4 border border-gray-700 mb-3">
                    <div className="font-semibold text-pf-text mb-1">
                      {equippedArmor.name}
                    </div>
                    <div className="text-xs text-pf-accent-light mb-2">
                      {equippedArmor.category}
                    </div>
                    <div className="text-sm text-pf-text-muted mb-2">
                      AC Bonus: +{equippedArmor.acBonus}
                      {equippedArmor.dexCap !== null &&
                        ` • Dex Cap: +${equippedArmor.dexCap}`}
                    </div>
                    <div className="text-xs text-pf-text-muted">
                      Bulk: {equippedArmor.bulk}
                      {equippedArmor.checkPenalty !== 0 &&
                        ` • Check Penalty: ${equippedArmor.checkPenalty}`}
                    </div>
                    {equippedArmor.traits.length > 0 && (
                      <div className="text-xs text-pf-accent-light mt-2">
                        {equippedArmor.traits.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              {equippedItems.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                    Items
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {equippedItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700"
                      >
                        <div className="font-semibold text-pf-text text-sm mb-1">
                          {item.name}
                        </div>
                        <div className="text-xs text-pf-text-muted mb-1">
                          {item.description}
                        </div>
                        <div className="text-xs text-pf-text-muted">
                          Bulk: {item.bulk}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spells (if spellcaster) */}
        {character.spells && (spellsKnown || spellsPrepared) && (
          <div className="bg-pf-bg-card rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-pf-accent">Spells</h2>
              <div className="text-right">
                {spellDC && (
                  <div className="text-sm">
                    <span className="text-pf-text-muted">Spell DC: </span>
                    <span className="text-lg font-bold text-pf-accent">{spellDC}</span>
                  </div>
                )}
                {spellAttack !== null && (
                  <div className="text-sm">
                    <span className="text-pf-text-muted">Spell Attack: </span>
                    <span className="text-lg font-bold text-pf-accent">
                      {formatModifier(spellAttack)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {spellsKnown && spellsKnown.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                  Spells Known
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Cantrips */}
                  <div>
                    <h4 className="text-sm font-semibold text-pf-text mb-2">
                      Cantrips (Level 0)
                    </h4>
                    {spellsKnown
                      .filter((spell) => spell.level === 0)
                      .map((spell) => (
                        <div
                          key={spell.id}
                          className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700 mb-2"
                        >
                          <div className="font-semibold text-pf-text">
                            {spell.name}
                          </div>
                          <div className="text-xs text-pf-accent-light mb-1">
                            {spell.traits?.join(', ')}
                          </div>
                          <div className="text-xs text-pf-text-muted">
                            {spell.castTime} • {spell.range}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Level 1 */}
                  <div>
                    <h4 className="text-sm font-semibold text-pf-text mb-2">
                      Level 1 Spells
                    </h4>
                    {spellsKnown
                      .filter((spell) => spell.level === 1)
                      .map((spell) => (
                        <div
                          key={spell.id}
                          className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700 mb-2"
                        >
                          <div className="font-semibold text-pf-text">
                            {spell.name}
                          </div>
                          <div className="text-xs text-pf-accent-light mb-1">
                            {spell.traits?.join(', ')}
                          </div>
                          <div className="text-xs text-pf-text-muted">
                            {spell.castTime} • {spell.range}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {spellsPrepared && spellsPrepared.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-pf-accent-light mb-3">
                  Prepared Spells
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {spellsPrepared
                    .filter((spell) => spell.level === 1)
                    .map((spell) => (
                      <div
                        key={spell.id}
                        className="bg-pf-bg-dark rounded-lg p-3 border border-gray-700"
                      >
                        <div className="font-semibold text-pf-text">{spell.name}</div>
                        <div className="text-xs text-pf-accent-light mb-1">
                          {spell.traits?.join(', ')}
                        </div>
                        <div className="text-xs text-pf-text-muted">
                          {spell.castTime} • {spell.range}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
