# Remaining Manual Updates Required

**Status**: useCharacterBuilder.ts is ✅ COMPLETE, but WizardViewport.tsx and CreationWizard.tsx still need updates due to file locking issues.

---

## ✅ Completed Updates

1. **useCharacterBuilder.ts** - FULLY UPDATED ✅
   - ✅ Imports: Added `applyEntityEffects`, `ChoiceResolution`, `AbilityId`
   - ✅ Interface: Added `resolveAbilityBoost` to `BuilderHookResult`
   - ✅ selectEntity: Extracts pending choices from entity effects
   - ✅ resolveAbilityBoost: New function to resolve user selections
   - ✅ Return: Added `resolveAbilityBoost` to exports
   - ✅ createInitialCharacter: Updated to accept `catalogLookup` and extract initial choices
   - ✅ extractChoicesFromEntity: New helper function added

2. **ErrorBoundary.tsx** - CREATED ✅
3. **ErrorFallback.tsx** - CREATED ✅

---

## ⚠️ Still Need Manual Updates

### 1. WizardViewport.tsx

**File**: `apps/web/src/components/creation/WizardViewport.tsx`
**Documentation**: `.claude/WIZARD_VIEWPORT_UPDATES.md`

**Required Changes**:

**A. Update imports (lines 3-12):**
```typescript
import type {
  AbilityId,  // ADD THIS
  AbilityBoostMode,
  CatalogIndexEntry,
  ContentEntity,
} from "@pen-paper-rpg/schemas";
import { useMemo } from "react";

import type { CreationStep } from "./CreationWizard";
import { AbilityBoostSelector } from "./AbilityBoostSelector";  // ADD THIS

import type { CharacterBuilderState } from "@/hooks/useCharacterBuilder";
```

**B. Update props interface (lines 16-22):**
```typescript
interface WizardViewportProps {
  step: CreationStep;
  builderState: CharacterBuilderState;
  onSelectAncestry: (id: string) => void;
  onSelectBackground: (id: string) => void;
  onSelectClass: (id: string) => void;
  onResolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;  // ADD THIS
}
```

**C. Update function signature (lines 37-43):**
```typescript
export function WizardViewport({
  step,
  builderState,
  onSelectAncestry,
  onSelectBackground,
  onSelectClass,
  onResolveAbilityBoost,  // ADD THIS
}: WizardViewportProps): JSX.Element {
```

**D. Update return statement (lines 80-103) - Replace with:**
```typescript
return (
  <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
    <header style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <h2 style={{ margin: 0, fontSize: "1.75rem", color: "#111827" }}>{step.title}</h2>
      <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5 }}>{step.description}</p>
    </header>

    {/* NEW: Check for abilities step */}
    {step.id === "abilities" ? (
      <AbilityBoostSection
        builderState={builderState}
        onResolveAbilityBoost={onResolveAbilityBoost}
      />
    ) : selectableStepId ? (
      entries.length > 0 ? (
        <EntitySelectionList
          entries={entries}
          selectedId={selectedId}
          onSelect={handleSelect}
        />
      ) : (
        <p style={{ color: "#9ca3af" }}>
          No entities available in the catalog for this step. Load YAML packs to populate the catalog.
        </p>
      )
    ) : (
      <PlaceholderMessage stepId={step.id} />
    )}
  </section>
);
```

**E. Add AbilityBoostSection component (after PlaceholderMessage function, around line 406):**
```typescript
interface AbilityBoostSectionProps {
  builderState: CharacterBuilderState;
  onResolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;
}

function AbilityBoostSection({ builderState, onResolveAbilityBoost }: AbilityBoostSectionProps): JSX.Element {
  const { pendingChoices, character } = builderState;

  // Filter for ability boost choices only
  const abilityBoostChoices = pendingChoices.filter(choice => choice.scope === "abilityBoost");

  if (abilityBoostChoices.length === 0) {
    return (
      <div
        style={{
          border: "1px solid #10b981",
          borderRadius: 8,
          padding: "1.25rem",
          background: "#ecfdf5",
          color: "#047857",
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0, fontWeight: "600" }}>All ability boosts have been assigned!</p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
          Your final ability scores:
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          {(["STR", "DEX", "CON", "INT", "WIS", "CHA"] as AbilityId[]).map((abilityId) => {
            const score = character.abilityScores.final[abilityId];
            const modifier = Math.floor((score - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;

            return (
              <div
                key={abilityId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0.5rem",
                  background: "#ffffff",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1fae5",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#047857" }}>
                  {abilityId}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#111827" }}>
                  {score}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  ({modifierText})
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {abilityBoostChoices.map((choice, index) => (
        <div key={choice.id}>
          {index > 0 && (
            <div
              style={{
                height: "1px",
                background: "#e5e7eb",
                margin: "0.5rem 0",
              }}
            />
          )}
          <AbilityBoostSelector
            choice={choice}
            currentAbilities={character.abilityScores.final}
            onResolve={onResolveAbilityBoost}
          />
        </div>
      ))}
    </div>
  );
}
```

---

### 2. CreationWizard.tsx

**File**: `apps/web/src/components/creation/CreationWizard.tsx`
**Documentation**: `.claude/CREATION_WIZARD_UPDATES.md`

**Required Changes**:

**A. Update useCharacterBuilder destructuring (lines 64-72):**
```typescript
const {
  state: builderState,
  status,
  error,
  refresh,
  selectAncestry,
  selectBackground,
  selectClass,
  resolveAbilityBoost,  // ADD THIS LINE
} = useCharacterBuilder();
```

**B. Update WizardViewport props (lines 157-162):**
```typescript
<WizardViewport
  step={activeStep}
  builderState={builderState}
  onSelectAncestry={selectAncestry}
  onSelectBackground={selectBackground}
  onSelectClass={selectClass}
  onResolveAbilityBoost={resolveAbilityBoost}  // ADD THIS LINE
/>
```

---

## How to Apply

1. Open each file in your IDE
2. Make the changes documented above
3. Save files (prettier/eslint will auto-format)
4. Run `pnpm typecheck` to verify no errors
5. Run `pnpm dev` and test at http://localhost:3000/character/create

---

## Verification Checklist

After applying updates:
- [ ] `pnpm typecheck` passes with no errors
- [ ] Dev server starts successfully
- [ ] Navigate to `/character/create`
- [ ] Select ancestry/background/class
- [ ] Navigate to step 4 (Assign Ability Boosts)
- [ ] See pending ability boost choices
- [ ] Select abilities and confirm
- [ ] See completion message when all choices resolved

---

**Total Time Estimate**: 10-15 minutes to apply + 5-10 minutes to test = ~20-25 minutes

---

*Last Updated: 2025-10-22*
*Status: 1/3 files complete, 2/3 need manual updates*
