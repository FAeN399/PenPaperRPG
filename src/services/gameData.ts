import { Ancestry, Heritage, Background, Class, Skill, Feat } from '@/types/gameData'

// Import JSON data
import ancestriesData from '@/data/ancestries/ancestries.json'
import heritagesData from '@/data/ancestries/heritages.json'
import backgroundsData from '@/data/backgrounds/backgrounds.json'
import classesData from '@/data/classes/classes.json'
import skillsData from '@/data/skills/skills.json'
import ancestryFeatsData from '@/data/feats/ancestry-feats.json'
import classFeatsData from '@/data/feats/class-feats.json'
import generalFeatsData from '@/data/feats/general-feats.json'
import skillFeatsData from '@/data/feats/skill-feats.json'

// Game Data Service
export class GameDataService {
  private static ancestries: Ancestry[] = ancestriesData as Ancestry[]
  private static heritages: Heritage[] = heritagesData as Heritage[]
  private static backgrounds: Background[] = backgroundsData as Background[]
  private static classes: Class[] = classesData as Class[]
  private static skills: Skill[] = skillsData as Skill[]
  private static feats: Feat[] = [
    ...((ancestryFeatsData as any).feats as Feat[]),
    ...((classFeatsData as any).feats as Feat[]),
    ...((generalFeatsData as any).feats as Feat[]),
    ...((skillFeatsData as any).feats as Feat[]),
  ]

  // Ancestry Methods
  static getAllAncestries(): Ancestry[] {
    return this.ancestries
  }

  static getAncestryById(id: string): Ancestry | undefined {
    return this.ancestries.find((a) => a.id === id)
  }

  static getHeritagesForAncestry(ancestryId: string): Heritage[] {
    return this.heritages.filter((h) => h.ancestryId === ancestryId)
  }

  static getHeritageById(id: string): Heritage | undefined {
    return this.heritages.find((h) => h.id === id)
  }

  // Background Methods
  static getAllBackgrounds(): Background[] {
    return this.backgrounds
  }

  static getBackgroundById(id: string): Background | undefined {
    return this.backgrounds.find((b) => b.id === id)
  }

  // Class Methods
  static getAllClasses(): Class[] {
    return this.classes
  }

  static getClassById(id: string): Class | undefined {
    return this.classes.find((c) => c.id === id)
  }

  // Skill Methods
  static getAllSkills(): Skill[] {
    return this.skills
  }

  static getSkillById(id: string): Skill | undefined {
    return this.skills.find((s) => s.id === id)
  }

  static getSkillByName(name: string): Skill | undefined {
    return this.skills.find((s) => s.name.toLowerCase() === name.toLowerCase())
  }

  // Feat Methods
  static getAllFeats(): Feat[] {
    return this.feats
  }

  static getFeatById(id: string): Feat | undefined {
    return this.feats.find((f) => f.id === id)
  }

  static getFeatsByType(type: 'ancestry' | 'class' | 'skill' | 'general'): Feat[] {
    return this.feats.filter((f) => f.type === type)
  }

  static searchFeats(query: string): Feat[] {
    const lowerQuery = query.toLowerCase()
    return this.feats.filter(
      (f) =>
        f.name.toLowerCase().includes(lowerQuery) ||
        f.description.toLowerCase().includes(lowerQuery) ||
        f.benefit.toLowerCase().includes(lowerQuery)
    )
  }

  // Utility Methods
  static searchAncestries(query: string): Ancestry[] {
    const lowerQuery = query.toLowerCase()
    return this.ancestries.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.description.toLowerCase().includes(lowerQuery)
    )
  }

  static searchBackgrounds(query: string): Background[] {
    const lowerQuery = query.toLowerCase()
    return this.backgrounds.filter(
      (b) =>
        b.name.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery)
    )
  }

  static searchClasses(query: string): Class[] {
    const lowerQuery = query.toLowerCase()
    return this.classes.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.description.toLowerCase().includes(lowerQuery)
    )
  }
}
