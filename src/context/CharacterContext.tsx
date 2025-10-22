import { createContext, ReactNode, useState, useEffect } from 'react'
import { Character, createEmptyCharacter, AbilityBoost } from '@/types/character'
import { calculateDerivedStats } from '@/services/calculations'
import { calculateAllAbilityScores } from '@/utils/abilityBoosts'

interface CharacterContextType {
  character: Character
  updateBasics: (basics: Partial<Character['basics']>) => void
  updateAncestry: (ancestry: Character['ancestry']) => void
  updateBackground: (background: string) => void
  updateClass: (classData: Character['class']) => void
  updateAbilityScore: (ability: keyof Character['abilityScores'], value: number) => void
  updateAbilityScores: (scores: Partial<Character['abilityScores']>) => void
  addAbilityBoost: (boost: AbilityBoost) => void
  removeAbilityBoost: (boost: AbilityBoost) => void
  applyAbilityBoosts: (boosts: AbilityBoost[]) => void
  updateSkill: (skill: string, proficiency: Character['skills'][string]) => void
  addFeat: (type: keyof Character['feats'], feat: string) => void
  removeFeat: (type: keyof Character['feats'], feat: string) => void
  updateSpells: (spells: Character['spells']) => void
  updateEquipment: (equipment: Partial<Character['equipment']>) => void
  loadCharacter: (character: Character) => void
  resetCharacter: () => void
}

export const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
)

interface CharacterProviderProps {
  children: ReactNode
}

export function CharacterProvider({ children }: CharacterProviderProps) {
  const [character, setCharacter] = useState<Character>(createEmptyCharacter())

  // Recalculate derived stats whenever character changes
  useEffect(() => {
    setCharacter((prev) => ({
      ...prev,
      derivedStats: calculateDerivedStats(prev),
    }))
  }, [
    character.abilityScores,
    character.ancestry,
    character.class,
    character.equipment,
    character.skills,
  ])

  const updateBasics = (basics: Partial<Character['basics']>) => {
    setCharacter((prev) => ({
      ...prev,
      basics: { ...prev.basics, ...basics },
    }))
  }

  const updateAncestry = (ancestry: Character['ancestry']) => {
    setCharacter((prev) => ({
      ...prev,
      ancestry,
    }))
  }

  const updateBackground = (background: string) => {
    setCharacter((prev) => ({
      ...prev,
      background,
    }))
  }

  const updateClass = (classData: Character['class']) => {
    setCharacter((prev) => ({
      ...prev,
      class: classData,
    }))
  }

  const updateAbilityScore = (
    ability: keyof Character['abilityScores'],
    value: number
  ) => {
    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: value,
      },
    }))
  }

  const updateAbilityScores = (scores: Partial<Character['abilityScores']>) => {
    setCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        ...scores,
      },
    }))
  }

  const updateSkill = (
    skill: string,
    proficiency: Character['skills'][string]
  ) => {
    setCharacter((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: proficiency,
      },
    }))
  }

  const addFeat = (type: keyof Character['feats'], feat: string) => {
    setCharacter((prev) => ({
      ...prev,
      feats: {
        ...prev.feats,
        [type]: [...prev.feats[type], feat],
      },
    }))
  }

  const removeFeat = (type: keyof Character['feats'], feat: string) => {
    setCharacter((prev) => ({
      ...prev,
      feats: {
        ...prev.feats,
        [type]: prev.feats[type].filter((f) => f !== feat),
      },
    }))
  }

  const updateSpells = (spells: Character['spells']) => {
    setCharacter((prev) => ({
      ...prev,
      spells,
    }))
  }

  const updateEquipment = (equipment: Partial<Character['equipment']>) => {
    setCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        ...equipment,
      },
    }))
  }

  const loadCharacter = (loadedCharacter: Character) => {
    setCharacter(loadedCharacter)
  }

  const resetCharacter = () => {
    setCharacter(createEmptyCharacter())
  }

  const addAbilityBoost = (boost: AbilityBoost) => {
    setCharacter((prev) => {
      const newBoosts = [...prev.abilityScores.boosts, boost]
      const newScores = calculateAllAbilityScores(newBoosts)
      return {
        ...prev,
        abilityScores: newScores,
      }
    })
  }

  const removeAbilityBoost = (boost: AbilityBoost) => {
    setCharacter((prev) => {
      const newBoosts = prev.abilityScores.boosts.filter(
        (b) => !(b.ability === boost.ability && b.source === boost.source)
      )
      const newScores = calculateAllAbilityScores(newBoosts)
      return {
        ...prev,
        abilityScores: newScores,
      }
    })
  }

  const applyAbilityBoosts = (boosts: AbilityBoost[]) => {
    const newScores = calculateAllAbilityScores(boosts)
    setCharacter((prev) => ({
      ...prev,
      abilityScores: newScores,
    }))
  }

  const value: CharacterContextType = {
    character,
    updateBasics,
    updateAncestry,
    updateBackground,
    updateClass,
    updateAbilityScore,
    updateAbilityScores,
    addAbilityBoost,
    removeAbilityBoost,
    applyAbilityBoosts,
    updateSkill,
    addFeat,
    removeFeat,
    updateSpells,
    updateEquipment,
    loadCharacter,
    resetCharacter,
  }

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  )
}
