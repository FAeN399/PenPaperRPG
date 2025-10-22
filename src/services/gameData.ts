import { Ancestry, Heritage, Background, Class } from '@/types/gameData'

// Import JSON data
import ancestriesData from '@/data/ancestries/ancestries.json'
import heritagesData from '@/data/ancestries/heritages.json'
import backgroundsData from '@/data/backgrounds/backgrounds.json'
import classesData from '@/data/classes/classes.json'

// Game Data Service
export class GameDataService {
  private static ancestries: Ancestry[] = ancestriesData as Ancestry[]
  private static heritages: Heritage[] = heritagesData as Heritage[]
  private static backgrounds: Background[] = backgroundsData as Background[]
  private static classes: Class[] = classesData as Class[]

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
