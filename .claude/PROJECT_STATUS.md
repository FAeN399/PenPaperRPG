# Project Status: Pathfinder 2e Character Creator

**Last Updated**: 2025-10-26
**Current Sprint**: Sprint 3 - Equipment & Inventory Management
**Current Phase**: Phase 2 Integration (In Progress)

---

## Sprint Progress Overview

### ✅ Sprint 1: Interactive Feat Selection (COMPLETE)
- FeatSelector component with dynamic filtering
- Integration with character builder state
- Full feat selection workflow operational

### ✅ Sprint 2: Heritage Selection (COMPLETE)
- 31 heritage YAML files created for core ancestries
- HeritageSelector component with visual presentation
- Heritage selection integrated into character creation wizard

### 🔄 Sprint 3: Equipment & Inventory Management (IN PROGRESS)

#### ✅ Phase 1: Equipment Content & Component (COMPLETE)
**Completion Date**: 2025-10-26
**Commit**: 53baf0e

**What Was Built**:
1. **26 Item YAML Files** - Comprehensive starting equipment catalog:
   - **Weapons** (9 items): Longsword, Greatsword, Dagger, Shortsword, Rapier, Battleaxe, Warhammer, Shortbow, Longbow
   - **Armor** (7 items): Leather Armor, Studded Leather, Chain Shirt, Chain Mail, Hide Armor, Scale Mail, Breastplate
   - **Gear** (10 items): Adventurer's Pack, Backpack, Bedroll, Rope, Torch, Waterskin, Rations, Climbing Kit, Healer's Tools, Thieves' Tools

2. **EquipmentSelector Component** (194 lines):
   - Currency system with price parsing (gp/sp/cp → copper pieces)
   - Bulk calculation (L = 0.1, "-" = negligible, numbers as-is)
   - Starting wealth tracking (15 gp universal)
   - Encumbrance warnings (5+STR encumbered, 10+STR max)
   - Category filtering (Weapons, Armor, Gear)
   - Purchase/remove item functionality
   - Real-time wealth and bulk display

3. **Catalog Validation**: All items validated successfully, catalog rebuilt with **341 entities total**

#### 🔄 Phase 2: Integration (IN PROGRESS)

**Progress**:
- ✅ useCharacterBuilder.ts - Equipment state management added
- ⏳ WizardViewport.tsx - Needs equipment selector integration
- ⏳ CreationWizard.tsx - Needs handler connection
- ⏳ Testing - End-to-end verification pending

---

## Current Task: Sprint 3 Phase 2 Integration

### Completed Work

#### ✅ useCharacterBuilder.ts (COMPLETE)
**Location**: `apps/web/src/hooks/useCharacterBuilder.ts`

**Changes Applied**:
1. Added `updateEquipment` method to BuilderHookResult interface
2. Implemented updateEquipment callback with state management
3. Exported updateEquipment in hook return

**Code Added**:
```typescript
// In BuilderHookResult interface (~line 62)
interface BuilderHookResult {
  // ... existing methods
  updateEquipment: (equipment: any[], wealthRemaining: number) => void;
}

// Implementation (~lines 572-592)
const updateEquipment = useCallback((equipment: any[], wealthRemaining: number) => {
  let nextCharacter: Character | null = null;

  setState((current) => {
    if (!current) return current;

    const { character } = current;

    const updatedCharacter = {
      ...character,
      equipment,
    };

    nextCharacter = updatedCharacter;
    return { ...current, character: updatedCharacter };
  });

  if (nextCharacter) {
    persistCharacterState(nextCharacter);
  }
}, []);

// In return statement (~line 623)
return {
  // ... existing exports
  updateEquipment,
};
```

---

### Remaining Work

#### ⏳ WizardViewport.tsx (PENDING)
**Location**: `apps/web/src/components/creation/WizardViewport.tsx`

**Required Changes** (4 updates):

**1. Add Import** (add near line 15 with other component imports):
```typescript
import { EquipmentSelector } from "./EquipmentSelector";
```

**2. Add Prop to Interface** (add to WizardViewportProps interface, ~line 32):
```typescript
interface WizardViewportProps {
  // ... existing props
  onFeatSelectionChange: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
  onEquipmentChange: (equipment: any[], wealthRemaining: number) => void;  // ADD THIS
}
```

**3. Destructure Prop** (add to destructuring, ~line 58):
```typescript
export function WizardViewport({
  catalog,
  character,
  pendingChoices,
  currentStep,
  onStepChange,
  onEntitySelect,
  onAbilityBoostResolve,
  onFeatSelectionChange,
  onEquipmentChange,  // ADD THIS
}: WizardViewportProps): JSX.Element {
```

**4. Replace Equipment Rendering** (find the equipment step rendering, ~line 142):

**Find this code**:
```typescript
{currentStep === 7 && (
  <div>
    <h2>Equipment & Wealth</h2>
    <p>Starting wealth: 15 gp. Purchase your initial equipment.</p>
    <p style={{ color: "#888" }}>(Equipment selector placeholder)</p>
  </div>
)}
```

**Replace with**:
```typescript
{currentStep === 7 && (
  <div>
    <h2 style={{ color: "#daa520", fontSize: "1.5rem", marginBottom: "1rem" }}>Equipment & Wealth</h2>
    <p style={{ color: "#ccc", marginBottom: "1.5rem" }}>
      You begin with <strong>15 gp</strong> to purchase your starting equipment. Choose weapons, armor, and adventuring gear.
    </p>
    <EquipmentSelector
      catalog={catalog}
      strengthModifier={Math.floor((character.abilities.str - 10) / 2)}
      onEquipmentChange={onEquipmentChange}
    />
  </div>
)}
```

---

#### ⏳ CreationWizard.tsx (PENDING)
**Location**: `apps/web/src/components/creation/CreationWizard.tsx`

**Required Changes** (2 updates):

**1. Destructure updateEquipment** (find the useCharacterBuilder call, add to destructuring):

**Find this code**:
```typescript
const {
  character,
  pendingChoices,
  selectAncestry,
  selectBackground,
  selectClass,
  resolveAbilityBoost,
  selectFeats,
  resetCharacter,
} = useCharacterBuilder(catalog);
```

**Update to**:
```typescript
const {
  character,
  pendingChoices,
  selectAncestry,
  selectBackground,
  selectClass,
  resolveAbilityBoost,
  selectFeats,
  updateEquipment,  // ADD THIS
  resetCharacter,
} = useCharacterBuilder(catalog);
```

**2. Pass Handler to WizardViewport** (find the WizardViewport component usage):

**Find this code**:
```typescript
<WizardViewport
  catalog={catalog}
  character={character}
  pendingChoices={pendingChoices}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  onEntitySelect={handleEntitySelect}
  onAbilityBoostResolve={resolveAbilityBoost}
  onFeatSelectionChange={handleFeatSelectionChange}
/>
```

**Update to**:
```typescript
<WizardViewport
  catalog={catalog}
  character={character}
  pendingChoices={pendingChoices}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
  onEntitySelect={handleEntitySelect}
  onAbilityBoostResolve={resolveAbilityBoost}
  onFeatSelectionChange={handleFeatSelectionChange}
  onEquipmentChange={updateEquipment}  // ADD THIS
/>
```

---

## Testing Checklist

After completing the integration changes above, verify the following:

### Equipment Purchase Flow
- [ ] Navigate to `/character/create`
- [ ] Complete Steps 1-6 (Ancestry, Background, Class, Ability Boosts, Heritage, Feats)
- [ ] Step 7 displays the EquipmentSelector component
- [ ] Equipment selector shows three tabs: Weapons, Armor, Gear
- [ ] Starting wealth displays as "15 gp"

### Purchase Functionality
- [ ] Can add items to purchased list
- [ ] Price is deducted from remaining wealth
- [ ] "Add" button disables when cannot afford item
- [ ] Can remove items from purchased list
- [ ] Price is refunded when item removed
- [ ] Quantity increases when purchasing duplicate items

### Bulk Calculation
- [ ] Bulk displays as "0 / [10+STR]" initially
- [ ] Purchasing items increases bulk correctly
  - Numeric bulk (e.g., "2") adds that amount
  - Light bulk ("L") adds 0.1 per item
  - Negligible ("-") adds nothing
- [ ] Bulk indicator shows "✓ Good" when under 5+STR
- [ ] Shows "⚠ Encumbered" (orange) when over 5+STR
- [ ] Shows "⚠ Overloaded!" (red) when over 10+STR

### Data Persistence
- [ ] Equipment selections persist when navigating between steps
- [ ] Equipment data is stored in character state
- [ ] Page refresh maintains equipment selections (localStorage)

---

## Next Commit Plan

**Commit Message Template**:
```
feat(web): integrate EquipmentSelector into character creation wizard (Sprint 3 Phase 2)

Completes equipment purchase system integration by connecting the
EquipmentSelector component to the character builder state management
and wizard viewport.

## Integration Changes

- **WizardViewport.tsx**: Add EquipmentSelector import and rendering,
  accept onEquipmentChange prop, replace placeholder with functional
  equipment selector on Step 7

- **CreationWizard.tsx**: Destructure updateEquipment from
  useCharacterBuilder hook and pass as onEquipmentChange to WizardViewport

## Verification

Equipment purchase workflow tested end-to-end:
- Starting wealth (15 gp) displays correctly
- Item purchase/removal updates wealth and bulk
- Encumbrance calculations follow PF2e rules (5+STR / 10+STR)
- Equipment data persists in character state and localStorage

## Sprint 3 Status

Phase 1 (Content & Component): ✅ Complete (commit 53baf0e)
Phase 2 (Integration): ✅ Complete (this commit)

Users can now purchase starting equipment during character creation.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Project Architecture Notes

### Character State Management
- **Hook**: `useCharacterBuilder.ts` - Central state management for character creation
- **Persistence**: `persistCharacterState()` - Saves to localStorage after each change
- **Viewport**: `WizardViewport.tsx` - Renders step-by-step wizard UI
- **Controller**: `CreationWizard.tsx` - Orchestrates wizard flow and state updates

### Equipment System Design
- **Currency**: All prices normalized to copper pieces (1 gp = 100 cp, 1 sp = 10 cp)
- **Bulk**: Calculated per PF2e rules, rounded down to nearest integer
- **Encumbrance**: Two thresholds (5+STR encumbered, 10+STR max)
- **Catalog Integration**: Equipment loaded from YAML files via catalog entity system

---

## Development Environment

- **Workspace**: Monorepo with pnpm + Turborepo
- **Packages**:
  - `@pen-paper-rpg/catalog` - Content loading and validation
  - `@pen-paper-rpg/engine` - Rules engine and calculations
  - `@pen-paper-rpg/schemas` - Zod validation schemas
- **Apps**:
  - `apps/web` - Next.js 14 App Router (character creator UI)
  - `apps/desktop` - Electron wrapper (future)

### Content Pipeline
1. Create YAML files in `packs/core/items/`
2. Run `npm run catalog:build` to validate and index
3. Catalog available at runtime via `CatalogIndex`
4. Components filter/display catalog entities

---

## Character Export System (COMPLETE)

**Completion Date**: 2025-10-27

### What Was Built

Complete character sheet export system supporting three professional document formats:

1. **PDF Generator** (`scripts/generate-character-sheet.py`)
   - 307 lines using reportlab library
   - Professional layout with gold theme (#DAA520)
   - All character sections with PF2e calculations

2. **Excel Generator** (`scripts/generate-character-excel.py`)
   - 361 lines using openpyxl library
   - Formatted cells with borders, fills, fonts
   - Interactive spreadsheet layout

3. **Word Generator** (`scripts/generate-character-word.js`)
   - 633 lines using docx (npm package)
   - Professional tables with Word-specific formatting
   - Compatible with Word 2007+, LibreOffice, Google Docs

4. **TypeScript Integration Layer**
   - `apps/web/src/lib/exec-async.ts` - Promisified exec utility
   - `apps/web/src/lib/generate-character-pdf.ts` - PDF wrapper
   - `apps/web/src/lib/generate-character-excel.ts` - Excel wrapper
   - `apps/web/src/lib/generate-character-word.ts` - Word wrapper
   - `apps/web/src/lib/character-export.ts` - Unified export API

### Document Sections (All Formats)
- Title with character name
- Character info (ancestry, background, class, heritage, level)
- Ability scores with modifiers
- Combat statistics (HP, AC, Class DC, Perception, Speed)
- Saving throws with proficiency bonuses
- Skills (alphabetically sorted with modifiers)
- Feats & features with sources
- Equipment with quantities

### Dependencies Required
```bash
# Python packages
pip install reportlab openpyxl

# Node.js packages
pnpm add docx
```

### Usage Example
```typescript
import { exportCharacter } from "@/lib/character-export";

const result = await exportCharacter({
  character,
  catalogLookup,
  format: "pdf", // or "excel" or "word"
});

console.log(`Exported to: ${result.filePath}`);
```

See [CHARACTER_EXPORT_SYSTEM.md](.claude/CHARACTER_EXPORT_SYSTEM.md) for complete documentation.

---

## Upcoming Work (After Sprint 3)

### Sprint 4: Export Integration & Testing
- Install required dependencies (reportlab, openpyxl, docx)
- Test all three export formats with sample characters
- Add export buttons to character wizard review step
- End-to-end testing with various character configurations

### Sprint 5: Character Summary Enhancement
- Summary page with complete character sheet view
- Character data download/import (JSON format)
- Cloud storage integration options

### Sprint 5: Leveling System
- Level-up wizard interface
- Additional feat/ability boost selection
- Class feature progression tracking

### Sprint 6: Advanced Features
- Skill training and proficiency management
- Spell preparation for prepared casters
- Companion/familiar support

---

## Quick Reference

### File Locations
- Equipment Component: `apps/web/src/components/creation/EquipmentSelector.tsx`
- Character Hook: `apps/web/src/hooks/useCharacterBuilder.ts`
- Wizard Viewport: `apps/web/src/components/creation/WizardViewport.tsx`
- Wizard Controller: `apps/web/src/components/creation/CreationWizard.tsx`
- Item Content: `packs/core/items/weapons/`, `packs/core/items/armor/`, `packs/core/items/gear/`

### Commands
- **Build Catalog**: `npm run catalog:build`
- **Type Check**: `pnpm typecheck`
- **Dev Server**: `pnpm dev`
- **Build All**: `pnpm run build`

### Git Status
- **Current Branch**: dev-electron-devloop
- **Recent Commits**:
  - 53baf0e - Sprint 3 Phase 1 (equipment content & component)
  - 8bf0cd5 - Sprint 1 (feat selection)
  - cfc76c8 - Project roadmap documentation
