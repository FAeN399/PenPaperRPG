// Basic character types for the application

export interface Character {
  id: string
  basics: CharacterBasics
  ancestry: CharacterAncestry | null
  background: string | null
  class: CharacterClass | null
  abilityScores: AbilityScores
  skills: Record<string, ProficiencyLevel>
  feats: CharacterFeats
  spells: CharacterSpells | null
  equipment: CharacterEquipment
  derivedStats: DerivedStats
}

export interface CharacterBasics {
  name: string
  playerName: string
  level: number
  experience: number
}

export interface CharacterAncestry {
  ancestry: string
  heritage: string | null
  ancestryFeat: string | null
}

export interface CharacterClass {
  class: string
  subclass: string | null
  classFeat: string | null
}

export interface AbilityScores {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export enum ProficiencyLevel {
  Untrained = 0,
  Trained = 2,
  Expert = 4,
  Master = 6,
  Legendary = 8,
}

export interface CharacterFeats {
  ancestry: string[]
  class: string[]
  skill: string[]
  general: string[]
}

export interface CharacterSpells {
  tradition: MagicTradition
  spellsKnown: string[]
  spellsPrepared: string[]
}

export enum MagicTradition {
  Arcane = 'arcane',
  Divine = 'divine',
  Occult = 'occult',
  Primal = 'primal',
}

export interface CharacterEquipment {
  weapons: string[]
  armor: string | null
  items: string[]
  gold: number
}

export interface DerivedStats {
  hp: number
  maxHp: number
  ac: number
  perception: number
  classDC: number
  saves: {
    fortitude: number
    reflex: number
    will: number
  }
  speed: number
}

// Helper to create empty character
export function createEmptyCharacter(): Character {
  return {
    id: crypto.randomUUID(),
    basics: {
      name: '',
      playerName: '',
      level: 1,
      experience: 0,
    },
    ancestry: null,
    background: null,
    class: null,
    abilityScores: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: {},
    feats: {
      ancestry: [],
      class: [],
      skill: [],
      general: [],
    },
    spells: null,
    equipment: {
      weapons: [],
      armor: null,
      items: [],
      gold: 0,
    },
    derivedStats: {
      hp: 0,
      maxHp: 0,
      ac: 10,
      perception: 0,
      classDC: 10,
      saves: {
        fortitude: 0,
        reflex: 0,
        will: 0,
      },
      speed: 25,
    },
  }
}
