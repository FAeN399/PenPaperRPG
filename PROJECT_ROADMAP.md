# Pathfinder 2e Character Creator - Project Roadmap

## Current Status (Phase 1: Complete ✅)

### Completed Features
- ✅ **Character Creation Wizard**: 8-step guided workflow
- ✅ **Ancestry Selection**: 29 playable ancestries with verified ability boosts
- ✅ **Background Selection**: 11 backgrounds
- ✅ **Class Selection**: 11 core classes
- ✅ **Ability Boost System**: Interactive UI with PF2e rules enforcement
- ✅ **Skill Training**: Interactive checkbox selection with class-based limits
- ✅ **Spell Selection**: Full spell selection for 5 spellcasting classes
- ✅ **Character Sheet**: Display with export/print functionality
- ✅ **Content Catalog**: 307 entities (ancestries, backgrounds, classes, feats, spells, items)
- ✅ **Dark Theme UI**: Polished dark theme with golden accents
- ✅ **Data Persistence**: LocalStorage for character state
- ✅ **New Character Reset**: Clear and start fresh

### Current Limitations
- ⚠️ Feat selection is display-only (no selection/persistence)
- ⚠️ Equipment selection is display-only (no inventory management)
- ⚠️ No heritage selection
- ⚠️ Level 1 only (no leveling system)
- ⚠️ Limited content (93 feats, 75 spells, 168 items)

---

## Next Steps: Priority Matrix

### 🔴 **High Priority (Phase 2: Core Functionality)**

#### 1. Interactive Feat Selection ⭐ NEXT
**Goal**: Allow players to select and persist feats during character creation

**Tasks**:
- [ ] Create `FeatSelector` component with filtering by category/type
- [ ] Implement prerequisite checking (level, ancestry, class, abilities, skills)
- [ ] Add feat selection to `useCharacterBuilder` hook
- [ ] Display selected feats on character sheet
- [ ] Store feat choices in `character.feats` array
- [ ] Show feat descriptions and prerequisites
- [ ] Track feat slots (ancestry, class, skill, general)

**Acceptance Criteria**:
- At Step 6, player can select 1 ancestry feat, 1 class feat
- Background-granted feats appear automatically
- Invalid feat choices are disabled with explanation
- Selected feats persist across sessions

---

#### 2. Heritage Selection
**Goal**: Allow players to choose heritages for their ancestries

**Tasks**:
- [ ] Create heritage YAML files for all 29 ancestries (3-6 heritages each)
- [ ] Create `HeritageSelector` component
- [ ] Add heritage selection step (between Ancestry and Background)
- [ ] Update ability boost flow to include heritage boosts
- [ ] Add heritage traits and special abilities to character
- [ ] Display heritage on character sheet

**Acceptance Criteria**:
- After selecting ancestry, heritage selection appears
- Each ancestry shows 3-6 heritage options
- Heritage grants appropriate traits/abilities
- Heritage displays on character sheet

---

#### 3. Equipment & Inventory Management
**Goal**: Interactive equipment selection with carry capacity tracking

**Tasks**:
- [ ] Create `EquipmentSelector` component with filtering
- [ ] Implement inventory management (add/remove/equip items)
- [ ] Calculate bulk and carrying capacity
- [ ] Track starting wealth and purchases
- [ ] Support weapon/armor/gear categories
- [ ] Add equipped/stored/dropped states
- [ ] Display inventory on character sheet with bulk totals

**Acceptance Criteria**:
- At Step 7, player can browse and add items to inventory
- Starting wealth (15 gp) tracked and deducted
- Bulk calculated automatically
- Items can be equipped/unequipped
- Over-encumbered warning appears

---

#### 4. Enhanced Character Management
**Goal**: Save, load, and manage multiple characters

**Tasks**:
- [ ] Create character list/gallery view
- [ ] Implement save/load with multiple slots
- [ ] Add character naming and portrait upload
- [ ] Create character export (JSON, PDF)
- [ ] Add character import from JSON
- [ ] Implement character deletion with confirmation
- [ ] Add character duplication feature

**Acceptance Criteria**:
- Landing page shows all saved characters
- Can create/load/delete multiple characters
- Export creates downloadable JSON file
- Import loads character from JSON
- Each character has name, level, class, portrait

---

### 🟡 **Medium Priority (Phase 3: Expansion)**

#### 5. Leveling System
**Goal**: Support character progression from levels 1-20

**Tasks**:
- [ ] Create level-up wizard UI
- [ ] Implement level-based ability boosts (every 5 levels)
- [ ] Add skill increases and feat gains per level
- [ ] Update HP, proficiencies, and spell slots per level
- [ ] Add class feature progression
- [ ] Support ancestry feats every 4 levels
- [ ] Track and display character history

**Example**: Level 2 → +1 class feat, +1 skill feat, +HP

---

#### 6. Content Expansion
**Goal**: Add more official content from PF2e sourcebooks

**Tasks**:
- [ ] Add 100+ more spells (ranks 4-10)
- [ ] Add 200+ more feats (ancestry, class, skill, general)
- [ ] Add 150+ more items (weapons, armor, magic items)
- [ ] Add more backgrounds (30+ total)
- [ ] Add versatile heritages (Aasimar, Tiefling, Dhampir, etc.)
- [ ] Add uncommon/rare ancestries
- [ ] Add advanced class features (focus spells, animal companions)

---

#### 7. Prerequisite & Validation System
**Goal**: Robust prerequisite checking for feats, archetypes, and multiclassing

**Tasks**:
- [ ] Expand predicate system to support complex prerequisites
- [ ] Add real-time validation feedback
- [ ] Implement dependency tracking (feat chains)
- [ ] Add warning system for suboptimal choices
- [ ] Support archetype dedication prerequisites
- [ ] Add ability score minimum checks
- [ ] Validate spell tradition requirements

---

#### 8. Archetype Support
**Goal**: Add archetype dedications and multiclassing

**Tasks**:
- [ ] Create archetype YAML files (50+ archetypes)
- [ ] Create `ArchetypeSelector` component
- [ ] Implement dedication feats at level 2+
- [ ] Track archetype progression
- [ ] Support multiclass archetypes (spellcasting, martial)
- [ ] Add archetype-specific features
- [ ] Display archetypes on character sheet

---

### 🟢 **Low Priority (Phase 4: Polish & Features)**

#### 9. Character Sheet Enhancements
**Goal**: More detailed and interactive character sheet

**Tasks**:
- [ ] Add editable notes and backstory
- [ ] Support conditions and temporary effects
- [ ] Add initiative tracker
- [ ] Add wealth/treasure tracking
- [ ] Support multiple character sheets styles (compact, full, print)
- [ ] Add character portrait customization
- [ ] Support PDF export with official-looking template

---

#### 10. Dice Roller Integration
**Goal**: In-app dice rolling for checks and damage

**Tasks**:
- [ ] Create dice roller component
- [ ] Support common rolls (d20, skill checks, saves, damage)
- [ ] Add quick-roll buttons on character sheet
- [ ] Display roll history
- [ ] Support advantage/disadvantage (PF2e doesn't have this, but criticals)
- [ ] Add custom roll builder

---

#### 11. Combat Tracker
**Goal**: Track combat rounds, initiative, HP, and conditions

**Tasks**:
- [ ] Create combat tracker UI
- [ ] Track initiative order
- [ ] Support HP tracking and damage
- [ ] Add condition management (dying, unconscious, etc.)
- [ ] Track rounds and turn order
- [ ] Support multiple combatants
- [ ] Add quick actions (attack, cast, move)

---

#### 12. Party Management
**Goal**: Manage multiple characters in a party

**Tasks**:
- [ ] Create party view with all characters
- [ ] Track party resources (consumables, gold)
- [ ] Add party roles (leader, face, healer, etc.)
- [ ] Support shared inventory
- [ ] Add party composition analysis
- [ ] Track party XP and level progression

---

#### 13. Mobile Responsiveness
**Goal**: Optimize for tablet and mobile devices

**Tasks**:
- [ ] Create responsive layouts for all screen sizes
- [ ] Add touch-friendly UI controls
- [ ] Optimize performance for mobile browsers
- [ ] Support offline mode with service workers
- [ ] Add mobile-specific navigation
- [ ] Test on iOS and Android devices

---

#### 14. Accessibility Improvements
**Goal**: Make the app accessible to all players

**Tasks**:
- [ ] Add ARIA labels and semantic HTML
- [ ] Support keyboard navigation
- [ ] Add high contrast mode
- [ ] Support screen readers
- [ ] Add font size controls
- [ ] Test with accessibility tools

---

#### 15. Data Import/Export
**Goal**: Support external character formats

**Tasks**:
- [ ] Add Pathbuilder 2e JSON import
- [ ] Add Foundry VTT export
- [ ] Support Roll20 character sheet export
- [ ] Add PDF character sheet export
- [ ] Support HeroLab import
- [ ] Add backup/restore functionality

---

## Technical Debt & Infrastructure

### Performance Optimization
- [ ] Implement virtualization for long lists (feats, spells, items)
- [ ] Add memoization to expensive computations
- [ ] Optimize catalog loading and indexing
- [ ] Add lazy loading for images and content
- [ ] Profile and optimize React rendering

### Code Quality
- [ ] Add unit tests for engine functions
- [ ] Add integration tests for character creation flow
- [ ] Add E2E tests with Playwright
- [ ] Improve TypeScript type coverage
- [ ] Add ESLint rules and fix linting issues
- [ ] Document complex functions and components

### Developer Experience
- [ ] Add Storybook for component development
- [ ] Create component library documentation
- [ ] Add hot reload for YAML content changes
- [ ] Improve error messages and debugging
- [ ] Add performance monitoring

---

## Content Creation Pipeline

### Automation
- [ ] Create script to bulk import from Archives of Nethys
- [ ] Add YAML validation CLI tool
- [ ] Create content testing framework
- [ ] Add automated spell/feat verification
- [ ] Build content migration tools

### Documentation
- [ ] Create content authoring guide
- [ ] Document YAML schema with examples
- [ ] Add contribution guidelines
- [ ] Create video tutorials for content creation
- [ ] Build searchable content reference

---

## Recommended Implementation Order

### Sprint 1 (2 weeks): Interactive Feat Selection
1. Create FeatSelector component
2. Add prerequisite checking logic
3. Integrate with character builder
4. Test with all feat categories

### Sprint 2 (1 week): Heritage Selection
1. Create heritage YAML files
2. Build HeritageSelector component
3. Update character creation flow
4. Test with all ancestries

### Sprint 3 (2 weeks): Equipment & Inventory
1. Build EquipmentSelector component
2. Implement inventory management
3. Add bulk and wealth tracking
4. Test with all item types

### Sprint 4 (1 week): Character Management
1. Build character list view
2. Add save/load/delete functionality
3. Implement export/import features
4. Polish UI and add portraits

### Sprint 5+ (Ongoing): Content Expansion & Leveling
1. Add more feats, spells, items
2. Build leveling system
3. Add archetypes
4. Continue polishing

---

## Success Metrics

### Phase 2 Goals
- [ ] Players can create fully functional level 1 characters
- [ ] All core PF2e character creation steps implemented
- [ ] 500+ content entities in catalog
- [ ] Zero validation errors
- [ ] Character creation takes < 15 minutes

### Phase 3 Goals
- [ ] Support character progression to level 20
- [ ] 1000+ content entities in catalog
- [ ] Archetype and multiclassing support
- [ ] Import/export to major VTT platforms

### Phase 4 Goals
- [ ] Mobile-responsive on all devices
- [ ] Full accessibility compliance
- [ ] Combat and party management features
- [ ] 2000+ content entities in catalog

---

## Questions & Decisions Needed

1. **Content Source**: Should we focus on Core Rulebook only, or expand to all sourcebooks?
2. **Homebrew Support**: Should we support custom content creation by users?
3. **Cloud Sync**: Should characters sync across devices?
4. **Monetization**: Free/open-source vs. premium features?
5. **VTT Integration**: Priority for Foundry, Roll20, or Fantasy Grounds?
6. **AI Features**: Should we add AI character suggestions or backstory generation?

---

## Community Contributions

### Areas Open for Contribution
- [ ] Content creation (feats, spells, items YAML files)
- [ ] UI/UX improvements and design
- [ ] Bug fixes and testing
- [ ] Documentation and tutorials
- [ ] Translations (i18n support)
- [ ] Mobile app development

---

**Last Updated**: 2025-10-23
**Current Phase**: Phase 1 Complete → Phase 2 Starting
**Next Milestone**: Interactive Feat Selection (Sprint 1)
