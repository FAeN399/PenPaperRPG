import { useState, useEffect } from 'react'
import { Ancestry, Heritage, Background, Class, Skill } from '@/types/gameData'
import { GameDataService } from '@/services/gameData'

export function useGameData() {
  const [ancestries, setAncestries] = useState<Ancestry[]>([])
  const [backgrounds, setBackgrounds] = useState<Background[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [skills, setSkills] = useState<Skill[]>([])

  useEffect(() => {
    // Load all game data
    setAncestries(GameDataService.getAllAncestries())
    setBackgrounds(GameDataService.getAllBackgrounds())
    setClasses(GameDataService.getAllClasses())
    setSkills(GameDataService.getAllSkills())
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

  return {
    ancestries,
    backgrounds,
    classes,
    skills,
    getHeritagesForAncestry,
    getAncestryById,
    getBackgroundById,
    getClassById,
    getSkillById,
    getSkillByName,
  }
}
