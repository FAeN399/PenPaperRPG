# Pathfinder 2e Character Creator - Development Prompt

## Project Overview
Build a comprehensive, cross-platform desktop application for creating Pathfinder 2nd Edition characters with deep mechanical accuracy and a modern, intuitive user interface.

## Core Requirements

### Platform & Technology
- **Target Platforms**: Windows and Linux desktop
- **Framework**: Electron (cross-platform desktop apps)
- **Frontend**: React 18+ with TypeScript for type safety
- **Styling**: Tailwind CSS for modern, responsive design
- **State Management**: React Context API or Zustand for character state
- **Data Storage**: JSON files for PF2e game content, LocalStorage/File system for saved characters
- **Build Tool**: Vite for fast development and optimized builds

### UI/UX Design Principles

#### Progressive Disclosure
- Multi-step wizard approach (6-8 main steps)
- Each step focuses on one aspect of character creation
- Advanced options hidden until relevant
- Clear progress indicators

#### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│ Header: App Title | Character Name | Progress (3/7) │
├──────────┬──────────────────────────┬────────────────┤
│          │                          │                │
│ Left     │   Main Content Area      │ Right Panel    │
│ Sidebar  │                          │ (Optional)     │
│          │   Current Step UI        │                │
│ Live     │   - Cards for options    │ Contextual     │
│ Character│   - Forms for input      │ Help/Rules     │
│ Stats    │   - Tables for choices   │                │
│          │                          │                │
│          │                          │                │
├──────────┴──────────────────────────┴────────────────┤
│ Footer: Back Button | Next/Finish | Save Draft      │
└─────────────────────────────────────────────────────┘
```

#### Visual Design
- Dark theme primary (with light mode option)
- Accent colors for different character elements (class, ancestry, etc.)
- Card-based selection UI for major choices
- Clean typography with good hierarchy
- Icons to represent game concepts
- Hover states and smooth transitions
- Accessibility: keyboard navigation, screen reader support

### Character Creation Flow

**Step 1: Character Basics**
- Character name, player name
- Choose ancestry (with heritage)
- Display: Card grid with ancestry descriptions
- Live update: Show ancestry abilities, HP, size, speed in sidebar

**Step 2: Background**
- Choose background
- Display: Card grid with background descriptions
- Show: Ability boosts, skill training, background feat

**Step 3: Class**
- Choose class
- Display: Detailed class cards with key features
- Show: Class DC, HP per level, proficiencies, key ability
- Select class-specific options (deity for clerics, muse for bards, etc.)

**Step 4: Ability Scores**
- Apply ancestry boosts/flaws
- Apply background boosts
- Apply class boost
- Apply 4 free boosts
- Display: Interactive ability score builder
- Show: Live calculations, modifiers, and current totals
- Validation: Ensure rules compliance (no more than one free boost per ability at level 1)

**Step 5: Skills**
- Assign skill proficiencies from background, class, and intelligence
- Display: Skill list with proficiency selectors
- Show: Live skill modifiers

**Step 6: Feats**
- Select ancestry feat (1st level)
- Select class feat (if applicable at 1st level)
- Select skill feats (if applicable)
- Display: Searchable, filterable feat browser
- Show: Prerequisites, feat effects

**Step 7: Spells (if applicable)**
- For spellcasting classes: choose spells known/prepared
- Display: Spell browser with filters (level, tradition, school)
- Show: Spell slots, DC, attack bonus

**Step 8: Equipment & Final Details**
- Starting gold or equipment package
- Deity, alignment (if using alignment), age, appearance
- Review full character sheet

**Step 9: Review & Export**
- Complete character sheet view
- Export options: PDF, JSON, print
- Save to file

### Data Architecture

#### Character Object Structure
```typescript
interface Character {
  id: string;
  basics: {
    name: string;
    playerName: string;
    level: number;
    experience: number;
  };
  ancestry: {
    ancestry: Ancestry;
    heritage: Heritage;
    ancestryFeat: Feat;
  };
  background: Background;
  class: {
    class: Class;
    subclass?: Subclass;
    classFeat?: Feat;
  };
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    boosts: AbilityBoost[];
  };
  skills: {
    [skillName: string]: ProficiencyLevel;
  };
  feats: {
    ancestry: Feat[];
    class: Feat[];
    skill: Feat[];
    general: Feat[];
  };
  spells?: {
    tradition: MagicTradition;
    spellsKnown?: Spell[];
    spellsPrepared?: PreparedSpell[];
  };
  equipment: {
    weapons: Weapon[];
    armor?: Armor;
    items: Item[];
    gold: number;
  };
  derivedStats: {
    hp: number;
    ac: number;
    perception: number;
    saves: { fortitude: number; reflex: number; will: number };
    speed: number;
  };
}
```

#### Game Data Structure
```
/src/data/
  /ancestries/
    ancestries.json
    heritages.json
  /backgrounds/
    backgrounds.json
  /classes/
    classes.json
    class-features.json
  /feats/
    ancestry-feats.json
    class-feats.json
    general-feats.json
    skill-feats.json
  /spells/
    spells.json
  /equipment/
    weapons.json
    armor.json
    items.json
  /rules/
    proficiency-bonus.json
    level-progression.json
```

### Core Features & Mechanics

#### Must Implement Accurately
1. **Ability Score System**
   - Ancestry boosts/flaws
   - Background boosts
   - Class boost
   - Free boosts (4 at level 1)
   - Rule: Can't apply more than one free boost to same ability at level 1
   - Calculate modifiers correctly: (score - 10) / 2, rounded down

2. **Proficiency System**
   - Track: Untrained, Trained, Expert, Master, Legendary
   - Calculate bonuses: Level + Proficiency bonus (0/2/4/6/8)
   - Apply to: Skills, saves, attacks, AC, class DC, spell DC

3. **Hit Points**
   - Ancestry base HP
   - Class HP per level
   - Constitution modifier per level

4. **Armor Class**
   - 10 + Dex modifier + proficiency + item bonus + other bonuses
   - Respect armor Dex cap

5. **Saving Throws**
   - Ability modifier + proficiency

6. **Feat Prerequisites**
   - Validate level requirements
   - Validate ability score requirements
   - Validate proficiency requirements
   - Validate ancestry/class/skill requirements

7. **Spell System**
   - Spell slots by class and level
   - Spell DC: 10 + key ability modifier + proficiency
   - Spell attack: key ability modifier + proficiency
   - Heightening mechanics

### Testing Strategy

#### Unit Tests
- Test ability score calculations
- Test proficiency bonus calculations
- Test HP calculations
- Test prerequisite validation
- Test character state updates
- Framework: Jest + React Testing Library

#### Integration Tests
- Test complete character creation flow
- Test data persistence (save/load)
- Test character export
- Test feat filtering and prerequisites

#### Manual Testing Checklist
- [ ] Create a Fighter (martial class)
- [ ] Create a Wizard (prepared caster)
- [ ] Create a Sorcerer (spontaneous caster)
- [ ] Create a Cleric (divine caster with deity)
- [ ] Test all ancestries
- [ ] Test all backgrounds
- [ ] Verify ability score rules enforcement
- [ ] Verify feat prerequisites work correctly
- [ ] Test save/load character
- [ ] Test export to PDF/JSON
- [ ] Test on Windows
- [ ] Test on Linux

#### Edge Cases to Test
- Characters with ability score 8 or lower (from flaws)
- Characters with ability score 18 at level 1 (max with boosts)
- Free boost limit validation
- Feat prerequisites with multiple requirements
- Spellcasters with limited spell selection
- Equipment weight and bulk

### Project Structure

```
PenPaperRPG/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron/
│   ├── main.ts (Electron main process)
│   └── preload.ts (Preload script)
├── src/
│   ├── main.tsx (React entry point)
│   ├── App.tsx (Main app component)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── character-creation/
│   │   │   ├── StepBasics.tsx
│   │   │   ├── StepAncestry.tsx
│   │   │   ├── StepBackground.tsx
│   │   │   ├── StepClass.tsx
│   │   │   ├── StepAbilities.tsx
│   │   │   ├── StepSkills.tsx
│   │   │   ├── StepFeats.tsx
│   │   │   ├── StepSpells.tsx
│   │   │   └── StepReview.tsx
│   │   ├── shared/
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Modal.tsx
│   │   └── character-sheet/
│   │       └── CharacterSheet.tsx
│   ├── hooks/
│   │   ├── useCharacter.ts
│   │   └── useGameData.ts
│   ├── context/
│   │   └── CharacterContext.tsx
│   ├── services/
│   │   ├── calculations.ts (ability, HP, AC, etc.)
│   │   ├── validation.ts (prerequisites, rules)
│   │   ├── storage.ts (save/load characters)
│   │   └── export.ts (PDF, JSON export)
│   ├── data/
│   │   └── (JSON files as described above)
│   ├── types/
│   │   ├── character.ts
│   │   ├── ancestry.ts
│   │   ├── background.ts
│   │   ├── class.ts
│   │   ├── feat.ts
│   │   ├── spell.ts
│   │   └── equipment.ts
│   ├── utils/
│   │   ├── proficiency.ts
│   │   └── modifiers.ts
│   └── styles/
│       └── globals.css
├── tests/
│   ├── unit/
│   └── integration/
└── dist/ (build output)
```

### Development Phases

#### Phase 1: Project Setup & Foundation (Complete First)
1. Initialize Electron + React + TypeScript + Vite project
2. Set up Tailwind CSS
3. Create basic app structure (main process, renderer)
4. Set up folder structure
5. Create TypeScript interfaces/types for all game data
6. Test: App launches on Windows and Linux

#### Phase 2: Core UI Framework (Complete Second)
1. Build layout components (Header, Sidebar, Footer)
2. Create step navigation system
3. Build shared components (Card, Button, Input, etc.)
4. Implement dark theme
5. Test: Navigation works, components render correctly

#### Phase 3: Character State Management (Complete Third)
1. Create CharacterContext
2. Implement character state with all fields
3. Create useCharacter hook
4. Build calculation service (abilities, HP, AC, saves, etc.)
5. Test: Character state updates correctly

#### Phase 4: Game Data Loading (Complete Fourth)
1. Create data structure for ancestries
2. Add 5-10 ancestries with heritages (start with Core Rulebook/Remastered)
3. Create data structure for backgrounds
4. Add 10-15 backgrounds
5. Create data structure for classes
6. Add all 12 core classes with features
7. Test: Data loads correctly into app

#### Phase 5: Character Creation Steps (Complete Fifth)
Build each step in order:
1. Step 1: Basics & Ancestry selection
2. Step 2: Background selection
3. Step 3: Class selection
4. Step 4: Ability scores (with boost system)
5. Step 5: Skills
6. Step 6: Feats (basic system first)
7. Step 7: Spells (for casters)
8. Step 8: Equipment
9. Step 9: Review
Test each step thoroughly before moving to next

#### Phase 6: Feats System (Complete Sixth)
1. Create feat data structures
2. Add ancestry feats (50+ feats)
3. Add class feats (100+ feats)
4. Add general feats (30+ feats)
5. Add skill feats (40+ feats)
6. Implement prerequisite validation
7. Build feat browser with search/filter
8. Test: All prerequisites work correctly

#### Phase 7: Spells System (Complete Seventh)
1. Create spell data structures
2. Add cantrips and spells (levels 1-10) for all traditions
3. Implement spell selection for prepared casters
4. Implement spell selection for spontaneous casters
5. Calculate spell DC and attack
6. Test: Spell selection works for all caster types

#### Phase 8: Equipment System (Complete Eighth)
1. Add weapons with stats
2. Add armor with stats
3. Add general items
4. Implement equipment packages
5. Calculate bulk and encumbrance
6. Test: Equipment adds correct bonuses

#### Phase 9: Character Sheet & Export (Complete Ninth)
1. Build full character sheet view
2. Display all calculated stats
3. Implement save to file (.json)
4. Implement load from file
5. Implement export to PDF
6. Test: Save/load/export all work correctly

#### Phase 10: Polish & Testing (Complete Last)
1. Add help text and tooltips
2. Improve error handling
3. Add loading states
4. Run full test suite
5. Create test characters for all classes
6. Fix bugs
7. Optimize performance
8. Add keyboard shortcuts
9. Create user documentation
10. Build for Windows and Linux

### Content Sources (Free/Legal)

#### Primary Sources
1. **Pathfinder 2e Remastered** (ORC License)
   - Player Core (ancestries, classes, spells, equipment)
   - GM Core (additional content)
   - Archives of Nethys (official free reference)

2. **Paizo Community Use Policy**
   - Can use game mechanics
   - Can reference rule names
   - Cannot copy flavor text verbatim

#### Data Collection Strategy
1. Use Archives of Nethys (pf2easy.com or 2e.aonprd.com) as primary reference
2. Input game mechanics (stats, numbers, prerequisites)
3. Write original descriptions or use very brief mechanical summaries
4. For each piece of content, note the source book

### Quality Standards

#### Code Quality
- TypeScript strict mode enabled
- No `any` types (use proper typing)
- ESLint + Prettier configured
- Comments for complex logic
- Modular, reusable components
- DRY principle (Don't Repeat Yourself)

#### User Experience
- No step takes more than 30 seconds to complete
- Clear error messages
- Confirmation before destructive actions
- Auto-save draft every 60 seconds
- Responsive UI (no lag on selections)
- Helpful tooltips for complex rules

#### Accuracy
- All calculations match official PF2e rules
- Prerequisite validation is correct
- Character sheet matches official format
- Proficiency bonuses correct at all levels

### Success Criteria

The project is complete when:
1. [ ] App runs on Windows and Linux
2. [ ] User can create a complete level 1 character for any of the 12 core classes
3. [ ] All ability scores, HP, AC, saves, and skills calculate correctly
4. [ ] Feat prerequisites are validated properly
5. [ ] Spellcasters can select appropriate spells
6. [ ] Character can be saved and loaded
7. [ ] Character can be exported to PDF
8. [ ] All manual test cases pass
9. [ ] No critical bugs
10. [ ] User documentation exists

### Build & Distribution

#### Development
```bash
npm install
npm run dev
```

#### Build for Production
```bash
npm run build:win    # Windows build
npm run build:linux  # Linux build
```

#### Package Distribution
- Windows: Create installer (.exe) using electron-builder
- Linux: Create AppImage or .deb package

### License & Attribution

#### Code License
- MIT License for application code

#### Content Attribution
- "This application uses the Pathfinder Second Edition system under the ORC License."
- "Pathfinder and associated marks are trademarks of Paizo Inc."
- Link to Archives of Nethys
- Include LICENSES.md with full ORC license text

### Future Enhancements (Not in Initial Version)
- Level up existing characters
- Multi-classing (not in this version)
- Character portraits/tokens
- Dice roller integration
- Party management
- Cloud sync
- Mobile companion app
- Homebrew content support
- Character optimization suggestions
- Print-optimized character sheets

---

## Immediate Next Steps

1. Initialize the project with Electron + React + TypeScript + Vite
2. Set up the development environment
3. Create the basic folder structure
4. Install all necessary dependencies
5. Create initial TypeScript types
6. Build the basic Electron app that launches
7. Test that it builds for Windows and Linux

Begin with Phase 1 and work systematically through each phase.
