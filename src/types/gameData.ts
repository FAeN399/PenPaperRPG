import { ProficiencyLevel } from './character'

// Ancestry Types
export interface Ancestry {
  id: string
  name: string
  description: string
  hitPoints: number
  size: 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge'
  speed: number
  abilityBoosts: AbilityBoost[]
  abilityFlaws: AbilityFlaw[]
  languages: string[]
  additionalLanguages: number
  traits: string[]
  specialAbilities: string[]
  heritages: string[] // IDs of available heritages
}

export interface Heritage {
  id: string
  ancestryId: string
  name: string
  description: string
  benefits: string[]
}

export interface AbilityBoost {
  type: 'free' | 'specific' | 'choice'
  abilities?: ('strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma')[]
  count?: number
}

export interface AbilityFlaw {
  ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
}

// Background Types
export interface Background {
  id: string
  name: string
  description: string
  abilityBoosts: AbilityBoost[]
  skillTraining: string
  featGranted: string
  traits?: string[]
}

// Class Types
export interface Class {
  id: string
  name: string
  description: string
  keyAbility: ('strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma')[]
  hitPoints: number
  initialProficiencies: ClassProficiencies
  traits: string[]
  classDC: ProficiencyLevel
  spellcasting?: SpellcastingInfo
}

export interface ClassProficiencies {
  perception: ProficiencyLevel
  fortitude: ProficiencyLevel
  reflex: ProficiencyLevel
  will: ProficiencyLevel
  skills: {
    trained: number
    list?: string[]
  }
  attacks: {
    simple: ProficiencyLevel
    martial: ProficiencyLevel
    unarmed: ProficiencyLevel
  }
  defenses: {
    unarmored: ProficiencyLevel
    light: ProficiencyLevel
    medium: ProficiencyLevel
    heavy: ProficiencyLevel
  }
}

export interface SpellcastingInfo {
  tradition: 'arcane' | 'divine' | 'occult' | 'primal'
  type: 'prepared' | 'spontaneous'
  spellsPerDay: number[]
  keyAbility: 'intelligence' | 'wisdom' | 'charisma'
}

// Skill Types
export interface Skill {
  id: string
  name: string
  ability: 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma'
  description: string
}

// Feat Types
export interface Feat {
  id: string
  name: string
  type: 'ancestry' | 'class' | 'skill' | 'general'
  level: number
  description: string
  prerequisites: string[]
  traits: string[]
  special?: string
  frequency?: string
  trigger?: string
  benefit: string
}

// Spell Types
export interface Spell {
  id: string
  name: string
  level: number
  tradition: ('arcane' | 'divine' | 'occult' | 'primal')[]
  traits: string[]
  castTime: string
  range: string
  area?: string
  duration: string
  targets?: string
  savingThrow?: string
  description: string
  heightened?: HeightenedEffect[]
}

export interface HeightenedEffect {
  level: number
  effect: string
}

// Equipment Types
export interface Weapon {
  id: string
  name: string
  category: 'simple' | 'martial' | 'advanced' | 'unarmed'
  group: string
  damage: string
  damageType: 'bludgeoning' | 'piercing' | 'slashing'
  traits: string[]
  range?: number
  reload?: string
  hands: '1' | '2' | '1+'
  bulk: string
  price: string
}

export interface Armor {
  id: string
  name: string
  category: 'unarmored' | 'light' | 'medium' | 'heavy'
  acBonus: number
  dexCap: number
  checkPenalty: number
  speedPenalty: number
  strength: number
  bulk: string
  group: string
  traits: string[]
  price: string
}

export interface Item {
  id: string
  name: string
  description: string
  bulk: string
  price: string
  traits: string[]
  usage?: string
}
