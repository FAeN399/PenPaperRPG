# PDF Character Sheet Generator

A React PDF-based character sheet generator for PenPaperRPG that creates print-friendly PDF character sheets with complete character information.

## Features

### Complete Character Display
- **Character Identity**: Name, level, ancestry, background, class, heritage, deity, alignment, and player information
- **Ability Scores**: All six abilities (STR, DEX, CON, INT, WIS, CHA) with modifiers
- **Derived Statistics**: HP, AC, saves, perception, class DC, and movement speeds
- **Proficiency Summary**: Combat proficiencies, saving throws, skills, languages, and senses
- **Skills Table**: Complete skill list with modifiers and proficiency ranks

### Layout & Design
- Clean, print-friendly layout optimized for A4 paper
- Professional styling with proper typography and spacing
- Structured sections for easy reading
- Consistent formatting throughout

## Component Structure

### Main Components

#### `CharacterSheetDocument`
Root PDF document component that wraps the entire character sheet.

#### `CharacterSheetPage`
Main page component that orchestrates all sections:
- CharacterIdentityHeader
- AbilityScoresSection
- ProficiencyAndDerivedStats
- ProficiencySummarySection
- SkillsTable

#### `CharacterIdentityHeader`
Displays character's core identity information:
- Character name (prominent display)
- Level, ancestry, background, class
- Optional: heritage, deity, alignment, player name
- Smart ID parsing (removes prefixes like "pf2e.ancestry.")

#### `AbilityScoresSection`
Grid layout of all six ability scores showing:
- Ability abbreviation (STR, DEX, etc.)
- Final ability score
- Calculated modifier with proper +/- formatting

#### `ProficiencyAndDerivedStats`
Multi-row display of critical combat statistics:
- **Row 1**: Proficiency bonus, AC, Perception, Class DC
- **Row 2**: Hit Points (current/max + temp), Saving throws
- **Row 3**: Movement speeds (if any)

#### `ProficiencySummarySection`
Comprehensive proficiency overview:
- Core proficiencies (Perception, Class DC, Saves)
- Combat proficiencies (weapons, armor)
- Languages and senses
- Rank abbreviations (U/T/E/M/L)

#### `SkillsTable`
Sortable table of all character skills:
- Skill name
- Total modifier
- Proficiency rank

## API

### `renderCharacterPdf(character: Character): Promise<ArrayBuffer>`

Generates a PDF buffer from a Character object.

**Parameters:**
- `character`: Complete Character object from @pen-paper-rpg/schemas

**Returns:**
- Promise that resolves to ArrayBuffer containing PDF data

**Example:**
```typescript
import { renderCharacterPdf } from '@pen-paper-rpg/pdf';
import type { Character } from '@pen-paper-rpg/schemas';

const character: Character = {
  // ... character data
};

const pdfBuffer = await renderCharacterPdf(character);
// Use pdfBuffer for download, display, etc.
```

## Testing

The package includes comprehensive tests for:
- PDF generation with complete character data
- PDF generation with minimal character data
- Error handling and edge cases

Run tests with:
```bash
npm test
```

## Dependencies

- `@react-pdf/renderer`: ^3.4.5 - Core PDF generation
- `@pen-paper-rpg/schemas`: Character type definitions

## Implementation Notes

### Ability Modifier Calculation
Uses standard D&D/PF2e formula: `Math.floor((score - 10) / 2)`

### Proficiency Bonus Calculation
Uses PF2e formula: `Math.floor((level - 1) / 4) + 2`

### ID Display Names
Automatically converts schema IDs like "pf2e.ancestry.human" to readable "Human"

### Print Optimization
- Optimized for A4 paper size
- 10pt base font with appropriate scaling
- High contrast colors for clear printing
- Structured layout prevents awkward page breaks

## Future Enhancements

Potential improvements for future iterations:
- Multi-page support for complex characters
- Equipment and inventory sections
- Feat and spell listings
- Combat actions and special abilities
- Custom styling themes
- Page break optimization