import { Character } from '@/types/character'

/**
 * Save character to JSON file
 */
export async function saveCharacterToFile(character: Character): Promise<void> {
  const json = JSON.stringify(character, null, 2)
  const blob = new Blob([json], { type: 'application/json' })

  // Create filename from character name or use default
  const filename = character.basics.name
    ? `${character.basics.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`
    : 'character.json'

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Load character from JSON file
 */
export async function loadCharacterFromFile(): Promise<Character | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) {
        resolve(null)
        return
      }

      try {
        const text = await file.text()
        const character = JSON.parse(text) as Character

        // Basic validation
        if (!character.id || !character.basics || !character.abilityScores) {
          throw new Error('Invalid character file format')
        }

        resolve(character)
      } catch (error) {
        console.error('Error loading character:', error)
        alert('Failed to load character file. Please check the file format.')
        resolve(null)
      }
    }

    input.click()
  })
}

/**
 * Export character to formatted text (for printing/copying)
 */
export function exportCharacterToText(character: Character): string {
  const sections: string[] = []

  // Header
  sections.push('═'.repeat(60))
  sections.push(`  ${character.basics.name || 'Unnamed Character'}`.toUpperCase())
  sections.push('═'.repeat(60))
  sections.push('')

  // Basics
  sections.push('BASICS')
  sections.push('─'.repeat(60))
  sections.push(`Player: ${character.basics.playerName || 'Unknown'}`)
  sections.push(`Level: ${character.basics.level}`)
  if (character.ancestry) {
    sections.push(`Ancestry: ${character.ancestry.ancestry}${character.ancestry.heritage ? ` (${character.ancestry.heritage})` : ''}`)
  }
  if (character.background) {
    sections.push(`Background: ${character.background}`)
  }
  if (character.class) {
    sections.push(`Class: ${character.class.class}`)
  }
  sections.push('')

  // Ability Scores
  sections.push('ABILITY SCORES')
  sections.push('─'.repeat(60))
  const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const
  abilities.forEach(ability => {
    const score = character.abilityScores[ability]
    const modifier = Math.floor((score - 10) / 2)
    sections.push(`${ability.charAt(0).toUpperCase() + ability.slice(1).padEnd(12)}: ${score.toString().padStart(2)} (${modifier >= 0 ? '+' : ''}${modifier})`)
  })
  sections.push('')

  // Combat Stats
  sections.push('COMBAT STATS')
  sections.push('─'.repeat(60))
  sections.push(`HP: ${character.derivedStats.maxHp}`)
  sections.push(`AC: ${character.derivedStats.ac}`)
  sections.push(`Perception: ${character.derivedStats.perception >= 0 ? '+' : ''}${character.derivedStats.perception}`)
  sections.push(`Class DC: ${character.derivedStats.classDC}`)
  sections.push(`Speed: ${character.derivedStats.speed} ft`)
  sections.push('')

  // Saves
  sections.push('SAVING THROWS')
  sections.push('─'.repeat(60))
  sections.push(`Fortitude: ${character.derivedStats.saves.fortitude >= 0 ? '+' : ''}${character.derivedStats.saves.fortitude}`)
  sections.push(`Reflex: ${character.derivedStats.saves.reflex >= 0 ? '+' : ''}${character.derivedStats.saves.reflex}`)
  sections.push(`Will: ${character.derivedStats.saves.will >= 0 ? '+' : ''}${character.derivedStats.saves.will}`)
  sections.push('')

  // Skills
  if (Object.keys(character.skills).length > 0) {
    sections.push('SKILLS')
    sections.push('─'.repeat(60))
    Object.entries(character.skills).forEach(([skill, proficiency]) => {
      sections.push(`${skill.charAt(0).toUpperCase() + skill.slice(1)}: Proficiency ${proficiency}`)
    })
    sections.push('')
  }

  // Feats
  const allFeats = [
    ...character.feats.ancestry,
    ...character.feats.class,
    ...character.feats.skill,
    ...character.feats.general
  ]
  if (allFeats.length > 0) {
    sections.push('FEATS')
    sections.push('─'.repeat(60))
    if (character.feats.ancestry.length > 0) {
      sections.push(`Ancestry: ${character.feats.ancestry.join(', ')}`)
    }
    if (character.feats.class.length > 0) {
      sections.push(`Class: ${character.feats.class.join(', ')}`)
    }
    if (character.feats.skill.length > 0) {
      sections.push(`Skill: ${character.feats.skill.join(', ')}`)
    }
    if (character.feats.general.length > 0) {
      sections.push(`General: ${character.feats.general.join(', ')}`)
    }
    sections.push('')
  }

  // Spells
  if (character.spells && (character.spells.spellsKnown.length > 0 || character.spells.spellsPrepared.length > 0)) {
    sections.push('SPELLS')
    sections.push('─'.repeat(60))
    sections.push(`Tradition: ${character.spells.tradition}`)
    if (character.spells.spellsKnown.length > 0) {
      sections.push(`Spells Known: ${character.spells.spellsKnown.join(', ')}`)
    }
    if (character.spells.spellsPrepared.length > 0) {
      sections.push(`Spells Prepared: ${character.spells.spellsPrepared.join(', ')}`)
    }
    sections.push('')
  }

  // Equipment
  if (character.equipment.weapons.length > 0 || character.equipment.armor || character.equipment.items.length > 0) {
    sections.push('EQUIPMENT')
    sections.push('─'.repeat(60))
    if (character.equipment.weapons.length > 0) {
      sections.push(`Weapons: ${character.equipment.weapons.join(', ')}`)
    }
    if (character.equipment.armor) {
      sections.push(`Armor: ${character.equipment.armor}`)
    }
    if (character.equipment.items.length > 0) {
      sections.push(`Items: ${character.equipment.items.join(', ')}`)
    }
    sections.push(`Gold: ${character.equipment.gold} gp`)
    sections.push('')
  }

  sections.push('═'.repeat(60))
  sections.push(`Generated by PenPaperRPG Character Creator`)
  sections.push('═'.repeat(60))

  return sections.join('\n')
}

/**
 * Download text export
 */
export function downloadTextExport(character: Character): void {
  const text = exportCharacterToText(character)
  const blob = new Blob([text], { type: 'text/plain' })

  const filename = character.basics.name
    ? `${character.basics.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.txt`
    : 'character.txt'

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
