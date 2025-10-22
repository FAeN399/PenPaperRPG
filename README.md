# PenPaperRPG

A comprehensive desktop character creator for Pathfinder 2nd Edition (Remastered), built with Electron, React, and TypeScript.

![Phase 9: Equipment System - Complete](https://img.shields.io/badge/Phase%209-Complete-brightgreen)

## Features

### ✨ Current Features (Phase 9 Complete)

- **Complete Character Creation Workflow**
  - 10-step wizard with progress tracking
  - Step 1: Character basics (name, player name, level)
  - Step 2: Ancestry selection (6 ancestries, 12 heritages)
  - Step 3: Background selection (12 backgrounds)
  - Step 4: Class selection (all 12 core classes)
  - Step 5: Ability score builder with proper PF2e boost system
    - All abilities start at 10
    - Automatic application of ancestry, background, and class boosts
    - Interactive 4 free boost selection
    - Proper PF2e rules: Boosts add +2 (or +1 if ability is 18+)
    - Validation: Can't use 2 free boosts on same ability at level 1
    - Live calculation showing boost breakdown by source
  - Step 6: Skill training selection
    - 16 core PF2e skills with proper ability scores
    - Automatic background skill application
    - Class skills + Intelligence bonus
    - Interactive card-based selection
    - Live skill modifier calculations
  - Step 7: Feat selection
    - 108 level 1 feats (18 ancestry, 53 class, 15 general, 22 skill)
    - Filter by type (ancestry/class/skill/general)
    - Search functionality
    - Prerequisite checking
    - Detailed feat descriptions with benefits, traits, frequency
  - Step 8: Spell selection (for spellcasting classes)
    - 155 spells across all 4 magical traditions
    - Arcane (37), Divine (37), Occult (41), Primal (40)
    - Cantrips and level 1 spells
    - Automatic tradition detection based on class
    - Prepared vs spontaneous casting support
    - Spell DC and attack bonus calculations
    - Filter by spell level, search by name/description/traits
    - Visual spell cards with full details (range, duration, saving throw, etc.)
  - Step 9: Equipment selection
    - 49 weapons (16 simple, 33 martial)
    - 20+ armor types (unarmored, light, medium, heavy, shields)
    - 40+ adventuring items (tools, gear, consumables)
    - Starting gold management (15 gp for level 1)
    - Automatic filtering by class proficiencies
    - Real-time gold and bulk tracking
    - Search and filter by category (weapons/armor/items)
    - Visual equipment cards with stats and properties

- **Live Character Stats**
  - Real-time calculation of all derived stats
  - HP based on ancestry, class, and Constitution
  - AC calculation with Dexterity and proficiency
  - Saving throws (Fortitude, Reflex, Will)
  - Perception and Class DC
  - Speed based on ancestry

- **Rich Game Content (Pathfinder 2e Remastered)**
  - **Ancestries:** Human, Elf, Dwarf, Gnome, Halfling, Goblin
  - **Heritages:** 2 unique heritages per ancestry
  - **Backgrounds:** 12 diverse backgrounds with skill training and feats
  - **Classes:** All 12 core classes with full proficiency data
    - Martial: Barbarian, Champion, Fighter, Monk, Ranger
    - Skill: Rogue, Alchemist
    - Casters: Bard, Cleric, Druid, Sorcerer, Wizard

- **Modern UI/UX**
  - Dark theme with Pathfinder-inspired colors (burgundy/gold)
  - Card-based selection interface
  - Progressive disclosure (show only what's needed)
  - Live sidebar showing character stats
  - Step indicator with progress visualization
  - Keyboard navigation support

- **Character Sheet View**
  - Comprehensive character sheet displaying all character information
  - Professional PF2e-style layout
  - Sections: Ability Scores, Combat Stats, Saving Throws, Skills, Feats, Equipment, Spells
  - Real-time stat calculations
  - Equipment display with weapon/armor/item details
  - View anytime during character creation
  - Printable-ready format (future enhancement)

### 🎯 Accurate PF2e Mechanics

All calculations follow official Pathfinder 2e rules:
- **Ability Boost System:**
  - All abilities start at 10
  - Each boost adds +2 (or +1 if ability is already 18+)
  - Ancestry boosts + Background boosts + Class boost + 4 Free boosts
  - Cannot apply more than one free boost to same ability at level 1
- Ability modifiers: `(score - 10) / 2` rounded down
- HP: Ancestry HP + (Class HP + Con mod) × level
- AC: 10 + Dex mod + proficiency
- Proficiency system: Untrained, Trained (+2), Expert (+4), Master (+6), Legendary (+8)
- Saves: Ability mod + proficiency
- Speed: Ancestry-based (Dwarves 20ft, Humans 25ft, Elves 30ft)

## Technology Stack

- **Framework:** Electron 28 (cross-platform desktop)
- **UI:** React 18 + TypeScript
- **Styling:** Tailwind CSS with custom PF2e theme
- **Build Tool:** Vite 5
- **State Management:** React Context API
- **Data Format:** JSON for game content

## Project Structure

```
PenPaperRPG/
├── electron/                    # Electron main process
│   ├── main.ts                 # Main process entry
│   └── preload.ts              # Preload script for IPC
├── src/
│   ├── components/
│   │   ├── character-creation/ # Step components
│   │   │   ├── StepAncestry.tsx
│   │   │   ├── StepBackground.tsx
│   │   │   ├── StepClass.tsx
│   │   │   ├── StepAbilities.tsx
│   │   │   ├── StepSkills.tsx
│   │   │   ├── StepFeats.tsx
│   │   │   └── StepSpells.tsx
│   │   ├── layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── shared/            # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Modal.tsx
│   │   └── CharacterCreator.tsx
│   ├── context/
│   │   └── CharacterContext.tsx # Global character state
│   ├── data/                   # PF2e game content
│   │   ├── ancestries/
│   │   ├── backgrounds/
│   │   ├── classes/
│   │   ├── skills/
│   │   ├── feats/
│   │   └── spells/
│   ├── hooks/
│   │   ├── useCharacter.ts    # Character state hook
│   │   └── useGameData.ts     # Game data hook
│   ├── services/
│   │   ├── calculations.ts    # PF2e calculations
│   │   └── gameData.ts        # Data loading service
│   ├── types/                 # TypeScript definitions
│   │   ├── character.ts
│   │   ├── gameData.ts
│   │   └── steps.ts
│   ├── utils/
│   │   ├── abilityBoosts.ts   # Ability boost system
│   │   ├── modifiers.ts       # Ability modifier calculations
│   │   └── proficiency.ts     # Proficiency system
│   └── styles/
│       └── globals.css        # Global styles + Tailwind
├── PROJECT_PROMPT.md          # Full development specification
└── UI_VISUAL_MOCKUP.md        # UI design documentation
```

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build:win    # Windows
npm run build:linux  # Linux
```

## Development Phases

### ✅ Phase 1: Project Setup & Foundation
- Electron + React + TypeScript + Vite setup
- Tailwind CSS configuration
- Project structure and build system

### ✅ Phase 2: Core UI Framework
- Layout components (Header, Sidebar, Footer)
- Step navigation system
- Reusable UI components
- Dark theme with PF2e colors

### ✅ Phase 3: Character State Management
- CharacterContext for global state
- useCharacter hook
- Calculation engine for derived stats
- Live stat updates

### ✅ Phase 4: Game Data Loading
- Complete game content database
- 6 ancestries with 12 heritages
- 12 backgrounds
- 12 classes with full proficiencies
- GameDataService and useGameData hook

### ✅ Phase 5: Character Creation Steps
- StepAncestry with interactive selection
- StepBackground with ability boosts
- StepClass with full proficiency display
- Updated calculations using actual game data
- Complete character creation flow (Steps 1-4)

### ✅ Phase 6: Ability Score Builder
- **Proper PF2e Ability Boost System**
  - All abilities start at 10
  - Automatic application of ancestry/background/class boosts
  - Interactive free boost selection (4 boosts)
  - Visual tracking showing boost sources
  - Validation rules (no duplicate free boosts)
  - 18+ rule (boosts add +1 instead of +2)
- **New Components:**
  - StepAbilities with card-based boost interface
- **New Utilities:**
  - abilityBoosts.ts (boost calculation and validation)
- **Enhanced State Management:**
  - addAbilityBoost/removeAbilityBoost methods
  - Automatic score calculation from boost array

### ✅ Phase 7: Skills & Feats
- **Complete Skills System**
  - 16 core PF2e skills (Acrobatics, Arcana, Athletics, etc.)
  - Automatic background skill training
  - Class skill selection (3-8 skills depending on class)
  - Intelligence bonus skills (minimum 1)
  - Live skill modifier calculations
  - StepSkills component with card interface
- **Comprehensive Feat System**
  - **108 level 1 feats total:**
    - 18 ancestry feats (3 per ancestry)
    - 53 class feats (4-5 per class)
    - 15 general feats (Toughness, Fleet, Shield Block, etc.)
    - 22 skill feats (Assurance, Cat Fall, Battle Medicine, etc.)
  - StepFeats browser component
  - Filter by type (ancestry/class/skill/general)
  - Search functionality
  - Prerequisite display and checking
  - Detailed feat cards with benefits, traits, frequency
- **New Data Files:**
  - skills.json, ancestry-feats.json, class-feats.json, general-feats.json, skill-feats.json
- **Created using 4 parallel subagents** for feat data generation

### ✅ Phase 8: Spells System
- **Complete Spell Database**
  - **155 spells total across 4 magical traditions:**
    - 37 Arcane spells (14 cantrips, 23 level 1)
    - 37 Divine spells (13 cantrips, 24 level 1)
    - 41 Occult spells (15 cantrips, 26 level 1)
    - 40 Primal spells (14 cantrips, 26 level 1)
  - Full spell details: range, duration, targets, saving throws, traits
  - Heightened spell information for scaling
- **StepSpells Component**
  - Automatic spellcasting detection (skips non-casters)
  - Spell DC and attack bonus calculations
  - Filter by spell level (cantrips/level 1)
  - Search by name, description, or traits
  - Visual spell cards with complete details
  - Cantrip selection (5 cantrips)
  - Level 1 spell selection (2 for prepared, 4 for spontaneous)
  - Support for both prepared and spontaneous casters
- **New Data Files:**
  - arcane-spells.json, divine-spells.json, occult-spells.json, primal-spells.json
- **Created using 4 parallel subagents** for spell data generation

### ✅ Phase 9: Equipment System
- **Complete Equipment Database**
  - **49 weapons total:**
    - 16 Simple weapons (club, dagger, staff, crossbow, etc.)
    - 33 Martial weapons (longsword, greatsword, battle axe, longbow, etc.)
  - **20+ armor types:**
    - All categories: unarmored, light, medium, heavy, shields
    - Full AC, Dex cap, bulk, and penalty details
  - **40+ adventuring items:**
    - Tools, gear, consumables, containers, light sources
- **StepEquipment Component**
  - Starting gold management (15 gp for level 1)
  - Automatic proficiency filtering for weapons and armor
  - Real-time gold spent and remaining tracking
  - Real-time bulk calculation
  - Category tabs (weapons, armor, items)
  - Search functionality
  - Visual equipment cards with complete stats
  - Multiple weapon selection support
  - Single armor/shield selection
  - Multiple item selection
- **CharacterSheet Equipment Display**
  - Weapons section with damage, hands, bulk, traits
  - Armor section with AC bonus, Dex cap, penalties
  - Items section with descriptions and bulk
  - Gold remaining display
- **New Data Files:**
  - weapons.json, armor.json, items.json
- **Created using 3 parallel subagents** for equipment data generation

### 🚧 Future Phases (Planned)

- **Phase 10:** Polish & Distribution
  - Character save/load
  - PDF export
  - User documentation
  - Installer creation

## Content Sources

All game mechanics are from **Pathfinder 2nd Edition (Remastered)** under the **ORC License**.

Primary sources:
- Player Core (Remastered)
- Archives of Nethys ([https://2e.aonprd.com](https://2e.aonprd.com))

Descriptions are original content to avoid copyright issues.

## License

- **Application Code:** MIT License
- **Pathfinder 2e Content:** ORC License
- **Trademarks:** "Pathfinder" and associated marks are trademarks of Paizo Inc.

## Demo Files

- **DEMO.html** - Standalone HTML demo (no server required)
- **CHARACTER_SHEET_DEMO.html** - Visual character sheet demonstration
- **UI_VISUAL_MOCKUP.md** - Visual design documentation
- **PROJECT_PROMPT.md** - Complete development specification

## Stats

- **75 modules** bundled
- **381.70KB** JavaScript bundle (equipment system +29KB!)
- **17.21KB** CSS bundle
- **Zero** TypeScript errors
- **100%** type-safe code

## Attributions

This application uses the Pathfinder Second Edition system under the ORC License.
Pathfinder and associated marks are trademarks of Paizo Inc.

---

**Status:** Phase 9 Complete - Equipment System fully implemented! Character creation now includes comprehensive equipment selection with 49 weapons, 20+ armor types, and 40+ adventuring items. Automatic proficiency filtering, starting gold management (15 gp), and real-time bulk tracking are all functional. The complete character creation workflow from basics through equipment is now fully operational! 🎉
