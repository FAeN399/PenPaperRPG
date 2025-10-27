# Sprint 3 Equipment System - Remaining Integration Steps

## ✅ Completed (Phase 1)
1. **Item Content Creation** - 26 item YAML files created and validated
   - 12 weapons (dagger, longsword, shortsword, rapier, scimitar, battleaxe, warhammer, longbow, shortbow, crossbow, club, staff)
   - 6 armor sets (leather, studded leather, hide, scale mail, chainmail, plate)
   - 8 adventuring gear items (backpack, rope, torch, rations, bedroll, waterskin, thieves' tools, healer's tools)

2. **EquipmentSelector Component** - Fully implemented at `apps/web/src/components/creation/EquipmentSelector.tsx` (194 lines)
   - Price parsing (gp/sp/cp → copper pieces)
   - Bulk calculation with encumbrance tracking
   - Category filtering (weapons/armor/gear)
   - Purchase/remove functionality
   - Wealth tracking with visual feedback
   - Starting wealth: 15 gp (1500 cp)
   - Encumbrance thresholds: 5+STR (encumbered), 10+STR (max)

3. **Catalog Rebuilt** - 341 entities (up from 315), zero validation errors

## 🔄 Remaining Integration (Phase 2)

### Step 1: Update useCharacterBuilder Hook
**File**: `apps/web/src/hooks/useCharacterBuilder.ts`

#### 1a. Update BuilderHookResult Interface (line ~62)
Add this method after `selectFeats`:
```typescript
updateEquipment: (equipment: any[], wealthRemaining: number) => void;
```

#### 1b. Implement updateEquipment Method (before line 572)
Add this implementation after the `selectFeats` callback and before the `return` statement:
```typescript
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
```

#### 1c. Export the Method (line ~600)
Add `updateEquipment` to the return object after `selectFeats`:
```typescript
return {
  status,
  state,
  error,
  refresh: async () => { /*...*/ },
  selectAncestry,
  selectHeritage,
  selectBackground,
  selectClass,
  resolveAbilityBoost,
  trainSkills,
  learnSpells,
  selectFeats,
  updateEquipment,  // ADD THIS LINE
  resetCharacter,
};
```

---

### Step 2: Update WizardViewport
**File**: `apps/web/src/components/creation/WizardViewport.tsx`

#### 2a. Import EquipmentSelector
Add to imports at top:
```typescript
import { EquipmentSelector } from "./EquipmentSelector";
```

#### 2b. Add Props
Update `WizardViewportProps` interface to include:
```typescript
onEquipmentChange: (equipment: any[], wealthRemaining: number) => void;
```

And destructure in component:
```typescript
export function WizardViewport({
  // ... existing props
  onEquipmentChange,
}: WizardViewportProps) {
```

#### 2c. Add Equipment Step Rendering
Find the step rendering logic (around the spell section) and add equipment case:
```typescript
{step.id === "equipment" ? (
  <EquipmentSelector
    catalog={builderState.catalog}
    strengthModifier={Math.floor((builderState.character.abilityScores.final.STR - 10) / 2)}
    onEquipmentChange={onEquipmentChange}
  />
) : // ... other steps
}
```

---

### Step 3: Update CreationWizard
**File**: `apps/web/src/components/creation/CreationWizard.tsx`

#### 3a. Destructure updateEquipment
Add to the destructured hook result:
```typescript
const {
  selectAncestry,
  selectHeritage,
  selectBackground,
  selectClass,
  resolveAbilityBoost,
  trainSkills,
  learnSpells,
  selectFeats,
  updateEquipment,  // ADD THIS LINE
  resetCharacter,
} = useCharacterBuilder();
```

#### 3b. Pass to WizardViewport
Add prop to WizardViewport component:
```typescript
<WizardViewport
  // ... existing props
  onEquipmentChange={updateEquipment}
/>
```

---

### Step 4: Verify Equipment Step Exists
**File**: `apps/web/src/components/creation/CreationWizard.tsx`

Ensure the DEFAULT_STEPS array includes an equipment step (should be step 7):
```typescript
{
  id: "equipment",
  title: "Purchase Equipment",
  description: "Buy weapons, armor, and gear with your starting wealth of 15 gold pieces.",
}
```

---

### Step 5: Test the Integration
1. Start dev server: `pnpm run dev --filter web`
2. Navigate to `/character/create`
3. Complete steps 1-6 (ancestry, heritage, background, class, abilities, skills)
4. On step 7, verify:
   - Equipment selector displays with 15 gp starting wealth
   - Items are categorized (weapons/armor/gear)
   - Purchase/remove buttons work
   - Bulk calculation updates correctly
   - Encumbrance warnings appear at appropriate thresholds
   - Equipment persists when navigating away and back

---

## Implementation Time Estimate
- Step 1 (Hook): 5 minutes
- Step 2 (WizardViewport): 5 minutes
- Step 3 (CreationWizard): 3 minutes
- Step 4 (Verify step): 1 minute
- Step 5 (Testing): 10 minutes
- **Total**: ~25 minutes

---

## Notes
- The character schema already includes `equipment: CharacterItem[]` field, so no schema changes needed
- Wealth tracking is currently local to the component; could be enhanced to persist remaining gold in character state
- AC calculation integration can be deferred to a later sprint
- Class-specific equipment recommendations can be added as an enhancement

---

## After Integration
Once Phase 2 is complete, commit with message:
```
feat(web): complete Sprint 3 equipment & inventory system

Implements full equipment purchase workflow for character creation.

## Phase 1: Content & Component
- Created 26 item YAML files (weapons, armor, gear)
- Built EquipmentSelector component with wealth/bulk tracking
- Rebuilt catalog: 341 entities

## Phase 2: Integration
- Added updateEquipment to useCharacterBuilder hook
- Integrated EquipmentSelector into wizard step 7
- Equipment persists to character state

## Features
- Starting wealth: 15 gp for all level 1 characters
- Bulk tracking with encumbrance warnings (5+STR / 10+STR)
- Category filtering (weapons/armor/gear)
- Price parsing and display
- Purchase/remove functionality
- Real-time wealth and bulk calculations

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
