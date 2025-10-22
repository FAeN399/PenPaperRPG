import { Character, DerivedStats, ProficiencyLevel } from '@/types/character'
import { getAbilityModifier } from '@/utils/modifiers'
import { getProficiencyBonus } from '@/utils/proficiency'
import { GameDataService } from './gameData'

/**
 * Calculate all derived stats for a character
 */
export function calculateDerivedStats(character: Character): DerivedStats {
  // Calculate HP
  const maxHp = calculateHP(character)

  // Calculate AC
  const ac = calculateAC(character)

  // Calculate Class DC
  const classDC = calculateClassDC(character)

  // Calculate Perception
  const perception = calculatePerception(character)

  // Calculate Saves
  const saves = calculateSaves(character)

  // Calculate Speed (base 25, can be modified by ancestry)
  const speed = calculateSpeed(character)

  return {
    hp: maxHp,
    maxHp,
    ac,
    perception,
    classDC,
    saves,
    speed,
  }
}

/**
 * Calculate Hit Points
 * HP = Ancestry HP + (Class HP + Con modifier) per level
 */
function calculateHP(character: Character): number {
  const level = character.basics.level
  const conMod = getAbilityModifier(character.abilityScores.constitution)

  // Get actual ancestry HP
  let ancestryHP = 8 // Default
  if (character.ancestry?.ancestry) {
    const ancestries = GameDataService.getAllAncestries()
    const ancestry = ancestries.find((a) => a.name === character.ancestry?.ancestry)
    if (ancestry) {
      ancestryHP = ancestry.hitPoints
    }
  }

  // Get actual class HP
  let classHP = 10 // Default
  if (character.class?.class) {
    const classes = GameDataService.getAllClasses()
    const classData = classes.find((c) => c.name === character.class?.class)
    if (classData) {
      classHP = classData.hitPoints
    }
  }

  // Level 1: Ancestry HP + Class HP + Con modifier
  // Each additional level: Class HP + Con modifier
  return ancestryHP + (classHP + conMod) * level
}

/**
 * Calculate Armor Class
 * AC = 10 + Dex modifier (max based on armor) + proficiency + armor bonus + other bonuses
 */
function calculateAC(character: Character): number {
  const dexMod = getAbilityModifier(character.abilityScores.dexterity)
  const level = character.basics.level

  // For now, assume untrained in armor (will be updated with class data)
  const armorProficiency = ProficiencyLevel.Trained // Default for most classes
  const proficiencyBonus = getProficiencyBonus(level, armorProficiency)

  // Base AC: 10 + Dex mod + proficiency
  // (armor bonuses and Dex caps will be added when equipment is implemented)
  return 10 + dexMod + proficiencyBonus
}

/**
 * Calculate Class DC
 * Class DC = 10 + key ability modifier + proficiency
 */
function calculateClassDC(character: Character): number {
  const level = character.basics.level

  // Default to highest ability modifier until we know the class's key ability
  const abilityMods = [
    getAbilityModifier(character.abilityScores.strength),
    getAbilityModifier(character.abilityScores.dexterity),
    getAbilityModifier(character.abilityScores.constitution),
    getAbilityModifier(character.abilityScores.intelligence),
    getAbilityModifier(character.abilityScores.wisdom),
    getAbilityModifier(character.abilityScores.charisma),
  ]
  const keyAbilityMod = Math.max(...abilityMods)

  // Assume trained proficiency
  const proficiencyBonus = getProficiencyBonus(level, ProficiencyLevel.Trained)

  return 10 + keyAbilityMod + proficiencyBonus
}

/**
 * Calculate Perception
 * Perception = Wis modifier + proficiency
 */
function calculatePerception(character: Character): number {
  const wisMod = getAbilityModifier(character.abilityScores.wisdom)
  const level = character.basics.level

  // Most classes start trained in Perception
  const proficiencyBonus = getProficiencyBonus(level, ProficiencyLevel.Trained)

  return wisMod + proficiencyBonus
}

/**
 * Calculate Saving Throws
 * Save = Ability modifier + proficiency
 */
function calculateSaves(character: Character): {
  fortitude: number
  reflex: number
  will: number
} {
  const level = character.basics.level

  const conMod = getAbilityModifier(character.abilityScores.constitution)
  const dexMod = getAbilityModifier(character.abilityScores.dexterity)
  const wisMod = getAbilityModifier(character.abilityScores.wisdom)

  // Default to trained proficiency (will be updated based on class)
  const proficiencyBonus = getProficiencyBonus(level, ProficiencyLevel.Trained)

  return {
    fortitude: conMod + proficiencyBonus,
    reflex: dexMod + proficiencyBonus,
    will: wisMod + proficiencyBonus,
  }
}

/**
 * Calculate Speed
 * Default 25 feet, modified by ancestry
 */
function calculateSpeed(character: Character): number {
  // Default speed
  let speed = 25

  // Get actual ancestry speed
  if (character.ancestry?.ancestry) {
    const ancestries = GameDataService.getAllAncestries()
    const ancestry = ancestries.find((a) => a.name === character.ancestry?.ancestry)
    if (ancestry) {
      speed = ancestry.speed
    }
  }

  return speed
}

/**
 * Calculate skill modifier
 */
export function calculateSkillModifier(
  character: Character,
  skill: string,
  keyAbility: keyof Character['abilityScores']
): number {
  const abilityMod = getAbilityModifier(character.abilityScores[keyAbility])
  const level = character.basics.level
  const proficiency = character.skills[skill] || ProficiencyLevel.Untrained

  const proficiencyBonus = getProficiencyBonus(level, proficiency)

  return abilityMod + proficiencyBonus
}
