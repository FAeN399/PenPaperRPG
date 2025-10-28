# Equipment Integration Patch

Due to dev server file locking, apply these changes manually:

## File 1: apps/web/src/hooks/useCharacterBuilder.ts

### Change 1: Update BuilderHookResult interface (line ~62)
Find:
```typescript
  selectFeats: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
  resetCharacter: () => void;
}
```

Replace with:
```typescript
  selectFeats: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
  updateEquipment: (equipment: any[], wealthRemaining: number) => void;
  resetCharacter: () => void;
}
```

### Change 2: Add updateEquipment implementation (before line 572, after selectFeats callback)
Find the selectFeats callback ending (around line 570):
```typescript
    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  }, []);

  return {
```

Insert BEFORE `return {`:
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

### Change 3: Export updateEquipment (line ~598, in return statement)
Find:
```typescript
    selectFeats,
    resetCharacter,
  };
```

Replace with:
```typescript
    selectFeats,
    updateEquipment,
    resetCharacter,
  };
```

---

## File 2: apps/web/src/components/creation/WizardViewport.tsx

### Change 1: Add import
At top with other imports:
```typescript
import { EquipmentSelector } from "./EquipmentSelector";
```

### Change 2: Update WizardViewportProps interface
Add to interface:
```typescript
  onEquipmentChange: (equipment: any[], wealthRemaining: number) => void;
```

And destructure in function:
```typescript
export function WizardViewport({
  // ... existing props
  onEquipmentChange,
}: WizardViewportProps) {
```

### Change 3: Add equipment step rendering
Find the spell selector section and add equipment case after it:
```typescript
      {step.id === "equipment" ? (
        <EquipmentSelector
          catalog={builderState.catalog}
          strengthModifier={Math.floor((builderState.character.abilityScores.final.STR - 10) / 2)}
          onEquipmentChange={onEquipmentChange}
        />
      ) :
```

---

## File 3: apps/web/src/components/creation/CreationWizard.tsx

### Change 1: Destructure updateEquipment
Find:
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
    resetCharacter,
  } = useCharacterBuilder();
```

Add updateEquipment:
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
    updateEquipment,
    resetCharacter,
  } = useCharacterBuilder();
```

### Change 2: Pass to WizardViewport
Find WizardViewport component usage and add:
```typescript
        <WizardViewport
          // ... existing props
          onEquipmentChange={updateEquipment}
        />
```

---

## Verification

After applying all changes:
1. Run `pnpm run dev --filter web`
2. Check for TypeScript errors
3. Navigate to `/character/create`
4. Complete steps 1-6
5. On step 7, verify equipment selector displays
6. Test purchasing and removing items
7. Verify encumbrance warnings work
8. Check that equipment persists

---

## If Successful

Commit with:
```bash
git add apps/web/src/hooks/useCharacterBuilder.ts apps/web/src/components/creation/WizardViewport.tsx apps/web/src/components/creation/CreationWizard.tsx
git commit -m "feat(web): complete Sprint 3 Phase 2 - Equipment integration

Integrates EquipmentSelector into character creation wizard.

- Added updateEquipment to useCharacterBuilder hook
- Integrated EquipmentSelector into WizardViewport step 7
- Passed equipment handler from CreationWizard
- Equipment persists to character state via localStorage

Sprint 3 Equipment & Inventory system is now fully functional.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```
