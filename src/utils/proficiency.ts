import { ProficiencyLevel } from '@/types/character'

/**
 * Get the proficiency bonus based on level and proficiency rank
 * PF2e proficiency system:
 * - Untrained: +0
 * - Trained: Level + 2
 * - Expert: Level + 4
 * - Master: Level + 6
 * - Legendary: Level + 8
 */
export function getProficiencyBonus(
  level: number,
  proficiency: ProficiencyLevel
): number {
  if (proficiency === ProficiencyLevel.Untrained) {
    return 0
  }

  return level + proficiency
}

/**
 * Get proficiency level name as string
 */
export function getProficiencyName(proficiency: ProficiencyLevel): string {
  switch (proficiency) {
    case ProficiencyLevel.Untrained:
      return 'Untrained'
    case ProficiencyLevel.Trained:
      return 'Trained'
    case ProficiencyLevel.Expert:
      return 'Expert'
    case ProficiencyLevel.Master:
      return 'Master'
    case ProficiencyLevel.Legendary:
      return 'Legendary'
    default:
      return 'Untrained'
  }
}

/**
 * Calculate total modifier including ability modifier and proficiency
 */
export function getTotalModifier(
  abilityModifier: number,
  level: number,
  proficiency: ProficiencyLevel
): number {
  return abilityModifier + getProficiencyBonus(level, proficiency)
}
