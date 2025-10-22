import { useState, useEffect } from 'react'
import { Ancestry, Heritage, Background, Class, Skill, Feat, Spell } from '@/types/gameData'
import { GameDataService } from '@/services/gameData'

export function useGameData() {
  const [ancestries, setAncestries] = useState<Ancestry[]>([])
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [feats, setFeats] = useState<Feat[]>([])
  const [spells, setSpells] = useState<Spell[]>([])

  useEffect(() => {
    // Load all game data
    setAncestries(GameDataService.getAllAncestries())
    setBackgrounds(GameDataService.getAllBackgrounds())
    setClasses(GameDataService.getAllClasses())
    setSkills(GameDataService.getAllSkills())
    setFeats(GameDataService.getAllFeats())
    setSpells(GameDataService.getAllSpells())
  }, [])

  const getHeritagesForAncestry = (ancestryId: string): Heritage[] => {
    return GameDataService.getHeritagesForAncestry(ancestryId)
  }

  const getAncestryById = (id: string): Ancestry | undefined => {
    return GameDataService.getAncestryById(id)
  }

  const getBackgroundById = (id: string): Background | undefined => {
    return GameDataService.getBackgroundById(id)
  }

  const getClassById = (id: string): Class | undefined => {
    return GameDataService.getClassById(id)
  }

  const getSkillById = (id: string): Skill | undefined => {
    return GameDataService.getSkillById(id)
  }

  const getSkillByName = (name: string): Skill | undefined => {
    return GameDataService.getSkillByName(name)
  }

  const getFeatById = (id: string): Feat | undefined => {
    return GameDataService.getFeatById(id)
  }

  const getFeatsByType = (type: 'ancestry' | 'class' | 'skill' | 'general'): Feat[] => {
    return GameDataService.getFeatsByType(type)
  }

  const searchFeats = (query: string): Feat[] => {
    return GameDataService.searchFeats(query)
  }

  const getSpellById = (id: string): Spell | undefined => {
    return GameDataService.getSpellById(id)
  }

  const getSpellsByTradition = (tradition: 'arcane' | 'divine' | 'occult' | 'primal'): Spell[] => {
    return GameDataService.getSpellsByTradition(tradition)
  }

  const getSpellsByLevel = (level: number): Spell[] => {
    return GameDataService.getSpellsByLevel(level)
  }

  const getSpellsByTraditionAndLevel = (
    tradition: 'arcane' | 'divine' | 'occult' | 'primal',
    level: number
  ): Spell[] => {
    return GameDataService.getSpellsByTraditionAndLevel(tradition, level)
  }

  const searchSpells = (query: string): Spell[] => {
    return GameDataService.searchSpells(query)
  }

  return {
    ancestries,
    backgrounds,
    classes,
    skills,
    feats,
    spells,
    getHeritagesForAncestry,
    getAncestryById,
    getBackgroundById,
    getClassById,
    getSkillById,
    getSkillByName,
    getFeatById,
    getFeatsByType,
    searchFeats,
    getSpellById,
    getSpellsByTradition,
    getSpellsByLevel,
    getSpellsByTraditionAndLevel,
    searchSpells,
  }
}
