# PenPaperRPG - Project Directive for Completion

## Mission Statement
Build a production-ready, local-first Pathfinder 2e Remaster character creation and leveling toolkit that works seamlessly in both web (PWA) and desktop (Electron) modes, with full rules implementation, PDF export, and comprehensive content coverage.

---

## Current State Assessment (2025-10-22)

### ✅ What's Working
1. **Core Architecture**
   - Monorepo with Turborepo + pnpm workspaces
   - Type-safe schemas using Zod (10+ entity types)
   - Rules engine with effect application system (14+ effect types)
   - Predicate system for conditional logic
   - Derived stats computation (HP, AC, saves, skills)
   - Character builder hook with localStorage persistence

2. **Desktop Integration**
   - Electron IPC bridge with context isolation
   - Pack directory selection with native dialogs
   - Catalog building from local YAML files
   - Dev loop with hot reload (tsc watch + nodemon)

3. **Web Application**
   - Next.js 14 with App Router
   - Character creation wizard (8 steps defined)
   - Entity selection for ancestry/background/class
   - Catalog loading from static JSON with 5-min cache

4. **Content System**
   - YAML pack structure with manifest support
   - Catalog builder with validation, hashing, deduplication
   - Browser-safe catalog loading (browser.ts)
   - Sample core pack with Human, Blacksmith, Fighter, Power Attack

5. **Testing**
   - 892 lines of effects tests
   - Derived stats integration tests
   - Character schema validation tests

### ⚠️ What's In Progress (Uncommitted)
- [apps/desktop/src/main.ts](apps/desktop/src/main.ts) - Import path refactoring
- [apps/web/src/lib/catalog-client.ts](apps/web/src/lib/catalog-client.ts) - Static JSON loading
- [apps/web/src/app/character/](apps/web/src/app/character/) - Creation page
- [packages/catalog/src/browser.ts](packages/catalog/src/browser.ts) - Browser entry point

### ❌ What's Missing (Critical Path to v1.0)

#### **Phase 1: Complete Character Builder (Steps 4-7)**
- [ ] Step 4: Ability Boost Resolution UI
  - Display pending choices from ancestry/background/level
  - Interactive ability score selector
  - Real-time ability modifier preview
  - Validation: max 18 at level 1, no boost same ability twice per source

- [ ] Step 5: Skill Training & Proficiencies
  - Display class skill choices (e.g., Fighter: choose 3+INT from list)
  - Skill selector with proficiency rank display
  - Show granted proficiencies from background/class
  - Validate skill training choices against class limits

- [ ] Step 6: Starting Feats
  - Feat browser filtered by level, category, prerequisites
  - Ancestry feat selection (level 1)
  - Class feat selection (level 1)
  - Background feat display (granted)
  - Predicate evaluation for feat prerequisites

- [ ] Step 7: Starting Equipment
  - Class equipment packages
  - Item browser with price/bulk tracking
  - Equipment list with worn/carried state
  - Bulk calculation and encumbrance

- [ ] Step 8: Review & Summary
  - Complete character sheet preview
  - All derived stats displayed
  - Export to JSON
  - Export to PDF (via packages/pdf)
  - "Start Playing" action

#### **Phase 2: Rules Engine Completion**
- [ ] Implement missing effect types:
  - `grantFeat` - Add feat to character
  - `grantSpell` - Add spell to spellcasting
  - `grantSpellSlot` - Modify spell slots
  - `modifyResource` - Track focus points, hero points, etc.
  - `addModifier` - Situational bonuses (item, status, circumstance)

- [ ] Predicate evaluation integration
  - Apply prerequisites before showing feat options
  - Filter choices based on character state
  - Conditional effects (e.g., "if you have Darkvision, gain X")

- [ ] Choice system expansion
  - Skill training choices
  - Feat selection choices
  - Spell selection choices
  - Language/lore choices

- [ ] Heritage selection
  - Add heritage step after ancestry
  - Apply heritage effects
  - Merge heritage with ancestry identity

#### **Phase 3: Content Expansion**
- [ ] Expand core pack to full Remaster SRD
  - All ancestries (Human, Elf, Dwarf, Gnome, Goblin, Halfling, Orc, Leshy)
  - All heritages for each ancestry
  - All backgrounds (~50)
  - All classes (12 core classes)
  - All class features (per level progression)
  - All ancestry feats (levels 1, 5, 9, 13, 17)
  - All class feats (levels 1-20)
  - General feats (levels 1-20)
  - Skill feats (levels 1-20)

- [ ] Equipment content
  - Weapons (simple, martial, advanced, unarmed)
  - Armor (unarmored, light, medium, heavy)
  - Shields
  - Adventuring gear
  - Consumables (potions, scrolls, etc.)

- [ ] Spell content
  - All cantrips (rank 0)
  - All spells (ranks 1-10)
  - All traditions (arcane, divine, primal, occult)

- [ ] Additional content
  - Conditions (flat-footed, frightened, etc.)
  - Rules entries (actions, exploration, downtime)

#### **Phase 4: Leveling System**
- [ ] Character leveling workflow
  - Level up wizard (separate from creation)
  - Automatic proficiency bumps per class progression
  - New feat selections per level
  - Additional skill training
  - Ability boosts at levels 5, 10, 15, 20

- [ ] Character history tracking
  - Log all changes with timestamps
  - Undo/redo system
  - Version comparison view
  - Export character history

#### **Phase 5: PDF Export**
- [ ] Complete packages/pdf implementation
  - Character sheet template (react-pdf)
  - Multi-page layout (identity, stats, feats, equipment, spells)
  - Print-friendly styling
  - Include character portrait placeholder

- [ ] Export options
  - Full character sheet
  - Combat reference card
  - Spell book
  - Customizable sheet sections

#### **Phase 6: Advanced Features**
- [ ] Character variants
  - Free Archetype variant rule
  - Dual-class variant
  - Automatic Bonus Progression

- [ ] Campaign management
  - Multiple characters per campaign
  - Shared pack sets per campaign
  - Campaign notes and session log

- [ ] Homebrew support
  - Homebrew pack creation UI
  - Custom entity editor
  - Predicate/effect builder
  - Pack validation and publishing

#### **Phase 7: Polish & Production**
- [ ] Error handling improvements
  - Graceful degradation for missing content
  - Detailed validation error messages
  - User-friendly error displays

- [ ] Performance optimization
  - Lazy load entity details
  - Virtual scrolling for large lists
  - Debounce search inputs
  - Optimize catalog lookup

- [ ] Accessibility
  - ARIA labels for interactive elements
  - Keyboard navigation for wizard
  - Screen reader support
  - High contrast mode

- [ ] UI/UX enhancements
  - Loading skeletons
  - Smooth transitions
  - Tooltips for game terms
  - Inline help text
  - Mobile responsive design (PWA)

- [ ] Desktop packaging
  - Build scripts for Windows/Mac/Linux
  - Code signing
  - Auto-updater
  - Installer creation

- [ ] Web deployment
  - PWA manifest and service worker
  - Offline mode with cached catalog
  - Static hosting (Vercel/Netlify)
  - CDN for assets

---

## Implementation Strategy

### Guiding Principles
1. **Incremental Delivery** - Each phase produces usable features
2. **Test-Driven** - Write tests before implementing complex logic
3. **Type Safety First** - Leverage Zod and TypeScript strictly
4. **Performance Conscious** - Profile before optimizing, but design for scale
5. **User Experience Focus** - Clear feedback, helpful errors, intuitive flow
6. **Content Quality** - Accurate PF2e rules implementation, no shortcuts

### Development Workflow
1. **For each feature:**
   - Create TodoWrite task breakdown
   - Write failing tests (TDD)
   - Implement minimal solution
   - Refactor for clarity
   - Update documentation
   - Commit with conventional commit message

2. **For each phase:**
   - Review phase goals
   - Break into 1-3 day tasks
   - Implement in priority order
   - Test integration with existing features
   - Create PR for review
   - Merge and deploy

### Priority Order (Next 30 Days)
1. **Week 1-2: Character Builder Completion (Steps 4-7)**
   - Focus: Get end-to-end character creation working
   - Target: Create a level 1 Fighter with all choices resolved

2. **Week 3: Rules Engine Completion**
   - Focus: Implement missing effects, integrate predicates
   - Target: Full feat prerequisite validation working

3. **Week 4: Content Expansion**
   - Focus: Add 3-5 ancestries, 10+ backgrounds, 3-5 classes
   - Target: Enough variety to create diverse characters

---

## Success Criteria for v1.0 Release

### Functional Requirements
✅ User can create a level 1 character from start to finish
✅ All 8 wizard steps are fully functional
✅ Character can be saved/loaded from localStorage (web) or file (desktop)
✅ PDF export generates complete character sheet
✅ Desktop app can load custom pack directories
✅ Web app works offline (PWA)
✅ At least 8 ancestries, 30 backgrounds, 12 classes available
✅ All level 1 feats implemented with prerequisites

### Technical Requirements
✅ <100ms for ability score calculations
✅ <500ms for catalog loading (web, cached)
✅ <2s for catalog building (desktop, cold start)
✅ 90%+ test coverage on engine and effects
✅ Zero TypeScript errors
✅ Zero critical accessibility issues
✅ Works in Chrome, Firefox, Safari, Edge

### Quality Requirements
✅ All PF2e rules accurately implemented (no known bugs)
✅ Clear error messages for invalid choices
✅ Intuitive UI with helpful tooltips
✅ Professional visual design
✅ Comprehensive user documentation
✅ Developer documentation for contributors

---

## Technical Debt to Address

1. **Legacy boost system** - Remove old `boosts` field, use effects only
2. **Effect TODO markers** - Implement all 14 effect types fully
3. **Missing error boundaries** - Add to all major components
4. **No loading states** - Add skeletons for async operations
5. **Incomplete tests** - Add tests for UI components
6. **Missing CI/CD** - Set up GitHub Actions for tests/build
7. **No changelog** - Start maintaining CHANGELOG.md
8. **Package versioning** - Sync all packages to consistent version

---

## Resources & References

### Official PF2e Resources
- [Pathfinder 2e Remaster SRD](https://2e.aonprd.com/)
- [Archives of Nethys](https://2e.aonprd.com/) - Complete rules reference
- [ORC License](https://paizo.com/community/blog/v5748dyo6sico) - Content licensing

### Technical Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Electron Docs](https://www.electronjs.org/docs)
- [Zod Docs](https://zod.dev/)
- [React PDF Docs](https://react-pdf.org/)
- [Turborepo Docs](https://turbo.build/repo/docs)

### Project Files
- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines (TODO)
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture (TODO)

---

## Call to Action

**Claude, when you next work on this project:**

1. **Read this directive** to understand the full context
2. **Check the phase priorities** to know what's most important
3. **Use TodoWrite** to track your progress through tasks
4. **Write tests first** for any new engine/effects logic
5. **Commit incrementally** with clear messages
6. **Ask the user** if priorities have changed before diving deep
7. **Focus on ONE phase at a time** - don't jump around
8. **Celebrate small wins** - each completed step is progress!

**Current Recommendation: Start with Phase 1, Step 4 (Ability Boost Resolution UI)**
- This unblocks the character builder flow
- It's user-facing so you'll see immediate progress
- It exercises the choice resolution system
- It's well-scoped (~1-2 days)

---

*Last Updated: 2025-10-22*
*Project Status: Pre-Alpha (Core functionality in progress)*
*Next Milestone: v0.1.0 - Complete Character Builder*
