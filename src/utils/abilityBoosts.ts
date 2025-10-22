import { AbilityScores, AbilityBoost, AbilityType, BoostSource } from '../types/character'

/**
 * Calculate the final ability score from base 10 and all boosts
 * PF2e Rule: Boosts add +2, or +1 if the ability is already 18+
 */
export function calculateAbilityScore(ability: AbilityType, boosts: AbilityBoost[]): number {
  let score = 10 // All abilities start at 10

  // Get all boosts for this ability
  const abilityBoosts = boosts.filter((b) => b.ability === ability)

  // Apply each boost
  for (const _boost of abilityBoosts) {
    if (score >= 18) {
      score += 1 // Only +1 if already 18 or higher
    } else {
      score += 2 // Normal boost adds +2
    }
  }

  return score
}

/**
 * Calculate all ability scores from the boosts array
 */
export function calculateAllAbilityScores(boosts: AbilityBoost[]): AbilityScores {
  return {
    strength: calculateAbilityScore('strength', boosts),
    dexterity: calculateAbilityScore('dexterity', boosts),
    constitution: calculateAbilityScore('constitution', boosts),
    intelligence: calculateAbilityScore('intelligence', boosts),
    wisdom: calculateAbilityScore('wisdom', boosts),
    charisma: calculateAbilityScore('charisma', boosts),
    boosts,
  }
}

/**
 * Get the number of boosts from a specific source applied to an ability
 */
export function getBoostCount(
  ability: AbilityType,
  source: BoostSource,
  boosts: AbilityBoost[]
): number {
  return boosts.filter((b) => b.ability === ability && b.source === source).length
}

/**
 * Get all boosts from a specific source
 */
export function getBoostsBySource(source: BoostSource, boosts: AbilityBoost[]): AbilityBoost[] {
  return boosts.filter((b) => b.source === source)
}

/**
 * Validate free boost selection
 * PF2e Rule: Can't apply more than one free boost to the same ability at level 1
 */
export function canAddFreeBoost(
  ability: AbilityType,
  boosts: AbilityBoost[]
): { valid: boolean; reason?: string } {
  const freeBoosts = getBoostsBySource('free', boosts)
  const freeBoostsToThisAbility = freeBoosts.filter((b) => b.ability === ability)

  if (freeBoostsToThisAbility.length >= 1) {
    return {
      valid: false,
      reason: 'Cannot apply more than one free boost to the same ability at level 1',
    }
  }

  if (freeBoosts.length >= 4) {
    return {
      valid: false,
      reason: 'Already used all 4 free boosts',
    }
  }

  return { valid: true }
}

/**
 * Get ability names for display
 */
export const ABILITY_NAMES: Record<AbilityType, string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
}

/**
 * Get ability abbreviations
 */
export const ABILITY_ABBR: Record<AbilityType, string> = {
  strength: 'STR',
  dexterity: 'DEX',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'WIS',
  charisma: 'CHA',
}

/**
 * All ability types in order
 */
export const ALL_ABILITIES: AbilityType[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
]
