# Character Sheet Templates

This directory contains blank character sheet templates for Pathfinder 2e Remaster.

## Files

### Blank_Character_Sheet.pdf (12 KB)
**Professional 5-page PDF template** with fillable fields.

**Features:**
- Gold-themed sections for visual appeal
- Multi-page layout for complete character data
- Print-ready format with proper spacing
- Fillable field boxes with underscores

**Use Case:** Print and fill by hand, or fill digitally with PDF editor

---

### Blank_Character_Sheet.xlsx (12 KB)
**Dynamic Excel workbook** with auto-calculating formulas.

**Features:**
- **7 sheets:** Character, Skills, Feats & Features, Equipment, Spellcasting, Combat, Notes
- **Dynamic formulas:** Change ability scores and modifiers auto-update!
- **Color coding:**
  - Blue text = User inputs (change these values)
  - Black text = Formulas (auto-calculate, don't edit)
- **Cross-sheet references:** Skills reference Character sheet for modifiers
- **Proficiency calculations:** Formulas include level + rank bonuses

**Use Case:** Digital character management with automatic calculations

---

### Blank_Character_Sheet.docx (11 KB)
**Professional Word document** with formatted tables.

**Features:**
- Clean, organized layout with tables
- Gold-themed headers matching PDF style
- Professional OOXML structure
- Compatible with Word 2007+, LibreOffice, Google Docs

**Use Case:** Digital editing with maximum compatibility

## Character Data Included

All templates include sections for:

### Identity
- Character Name, Player Name
- Ancestry, Heritage, Background, Class
- Level, XP, Deity, Alignment, Size

### Ability Scores
- STR, DEX, CON, INT, WIS, CHA
- Scores and modifiers

### Core Statistics
- Hit Points (Max/Current)
- Armor Class, Class DC
- Perception, Speed

### Saving Throws
- Fortitude, Reflex, Will
- Modifiers and proficiency ranks

### Skills
- All 16 core skills (Acrobatics → Thievery)
- Lore skills section
- Ability, modifier, and rank for each

### Feats & Features
- Name, level, source
- 15-20 slots for entries

### Spellcasting
- Tradition, casting type
- Spell DC, attack bonus
- Spell slots by level
- Spell list with prepared checkboxes

### Equipment
- Wealth (PP, GP, SP, CP)
- Item list with quantity, bulk, invested

### Combat
- Attack profiles (weapon, bonus, damage, traits)
- Resistances, Weaknesses, Immunities

### Character Notes
- Appearance, Personality, Backstory
- Allies & Organizations
- Campaign Notes

## Usage

### For Players
1. Choose your preferred format (PDF, Excel, or Word)
2. Make a copy of the blank template
3. Fill in your character information
4. Save with a meaningful name (e.g., "Thorin_Ironforge_Character_Sheet.pdf")

### For Game Masters
- Distribute templates to players at session zero
- Use Excel version for NPCs with quick stat changes
- Print PDF versions for table play

### For Developers
Templates are regenerated using scripts in `scripts/`:
- `create-blank-character-sheet-pdf.py` - PDF generator (462 lines)
- `create-blank-character-sheet-excel.py` - Excel generator (405 lines)
- `create-blank-character-sheet-word.js` - Word generator (Node.js)

## Git Tracking

These blank templates are tracked in git (see `.gitignore`).

**Tracked:**
- `Blank_Character_Sheet.*` - Clean templates

**Ignored:**
- `*_Character_Sheet.*` - Filled character sheets
- Any temporary files

## Notes

**Excel Formula Recalculation:**
- Formulas calculate automatically when you change values
- No LibreOffice recalc needed for blank template
- When exporting filled characters, `recalc.py` ensures all formulas are evaluated

**Compatibility:**
- PDF: All modern PDF readers
- Excel: Excel 2007+, LibreOffice Calc, Google Sheets
- Word: Word 2007+, LibreOffice Writer, Google Docs
