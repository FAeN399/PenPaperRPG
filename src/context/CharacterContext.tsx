import { createContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react'
import { Character, createEmptyCharacter, AbilityBoost } from '@/types/character'
import { calculateDerivedStats } from '@/services/calculations'
import { calculateAllAbilityScores } from '@/utils/abilityBoosts'

const AUTO_SAVE_KEY = 'penpaperrpg-character-autosave'
const AUTO_SAVE_DELAY = 1000 // Save 1 second after last change

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
  // Load character from localStorage on mount
  const [character, setCharacter] = useState<Character>(() => {
    try {
      const saved = localStorage.getItem(AUTO_SAVE_KEY)
      if (saved) {
        const loaded = JSON.parse(saved) as Character
        // Recalculate derived stats in case formulas changed
        return {
          ...loaded,
          derivedStats: calculateDerivedStats(loaded),
        }
      }
    } catch (error) {
      console.error('Failed to load autosaved character:', error)
    }
    return createEmptyCharacter()
  })

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save to localStorage with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(character))
      } catch (error) {
        console.error('Failed to autosave character:', error)
      }
    }, AUTO_SAVE_DELAY)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [character])

  // Helper to update character and recalculate derived stats
  const updateCharacter = useCallback((updater: (prev: Character) => Character) => {
    setCharacter((prev) => {
      const updated = updater(prev)
      return {
        ...updated,
        derivedStats: calculateDerivedStats(updated),
      }
    })
  }, [])

  const updateBasics = (basics: Partial<Character['basics']>) => {
    updateCharacter((prev) => ({
      ...prev,
      basics: { ...prev.basics, ...basics },
    }))
  }

  const updateAncestry = (ancestry: Character['ancestry']) => {
    updateCharacter((prev) => ({
      ...prev,
      ancestry,
    }))
  }

  const updateBackground = (background: string) => {
    updateCharacter((prev) => ({
      ...prev,
      background,
    }))
  }

  const updateClass = (classData: Character['class']) => {
    updateCharacter((prev) => ({
      ...prev,
      class: classData,
    }))
  }

  const updateAbilityScore = (
    ability: keyof Character['abilityScores'],
    value: number
  ) => {
    updateCharacter((prev) => ({
      ...prev,
      abilityScores: {
        ...prev.abilityScores,
        [ability]: value,
      },
    }))
  }

  const updateAbilityScores = (scores: Partial<Character['abilityScores']>) => {
    updateCharacter((prev) => ({
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
    updateCharacter((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skill]: proficiency,
      },
    }))
  }

  const addFeat = (type: keyof Character['feats'], feat: string) => {
    updateCharacter((prev) => ({
      ...prev,
      feats: {
        ...prev.feats,
        [type]: [...prev.feats[type], feat],
      },
    }))
  }

  const removeFeat = (type: keyof Character['feats'], feat: string) => {
    updateCharacter((prev) => ({
      ...prev,
      feats: {
        ...prev.feats,
        [type]: prev.feats[type].filter((f) => f !== feat),
      },
    }))
  }

  const updateSpells = (spells: Character['spells']) => {
    updateCharacter((prev) => ({
      ...prev,
      spells,
    }))
  }

  const updateEquipment = (equipment: Partial<Character['equipment']>) => {
    updateCharacter((prev) => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        ...equipment,
      },
    }))
  }

  const loadCharacter = (loadedCharacter: Character) => {
    updateCharacter(() => loadedCharacter)
  }

  const resetCharacter = () => {
    const empty = createEmptyCharacter()
    setCharacter(empty)
    // Clear autosave
    try {
      localStorage.removeItem(AUTO_SAVE_KEY)
    } catch (error) {
      console.error('Failed to clear autosave:', error)
    }
  }

  const addAbilityBoost = (boost: AbilityBoost) => {
    updateCharacter((prev) => {
      const newBoosts = [...prev.abilityScores.boosts, boost]
      const newScores = calculateAllAbilityScores(newBoosts)
      return {
        ...prev,
        abilityScores: newScores,
      }
    })
  }

  const removeAbilityBoost = (boost: AbilityBoost) => {
    updateCharacter((prev) => {
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
    updateCharacter((prev) => ({
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
