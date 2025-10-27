# useCharacterBuilder Hook Updates Needed

Due to file locking issues, here are the manual changes needed for `apps/web/src/hooks/useCharacterBuilder.ts`:

## 1. Add Imports

```typescript
// Add to the engine imports (line 8):
import {
  // ... existing imports
  applyEntityEffects,  // ADD THIS
  type ChoiceResolution,  // ADD THIS
} from "@pen-paper-rpg/engine";

// Add to schema imports (line 13):
import type {
  AbilityId,  // ADD THIS
  // ... existing imports
} from "@pen-paper-rpg/schemas";
```

## 2. Update BuilderHookResult Interface

```typescript
interface BuilderHookResult {
  status: CharacterBuilderStatus;
  state: CharacterBuilderState | null;
  error: Error | null;
  refresh: () => Promise<void>;
  selectAncestry: (id: string) => void;
  selectBackground: (id: string) => void;
  selectClass: (id: string) => void;
  resolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;  // ADD THIS LINE
}
```

## 3. Update selectEntity to Extract Pending Choices

Replace the `selectEntity` function (starting at line 174) with:

```typescript
const selectEntity = useCallback(
  (entityType: SelectableEntityType, entityId: string) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) {
        return current;
      }

      const entityExists = current.catalog.entities.some(
        (entry) => entry.entity.id === entityId && entry.entity.type === entityType,
      );

      if (!entityExists) {
        return current;
      }

      const identityKey = `${entityType}Id` as keyof CharacterIdentity;
      if (current.character.identity[identityKey] === entityId) {
        return current;
      }

      const { character, catalogLookup, derivedContext } = current;

      // NEW: Get the entity to check for pending choices
      const entityEntry = catalogLookup.byId.get(entityId);
      if (!entityEntry) {
        return current;
      }

      // NEW: Apply entity effects to get pending choices
      const effectResult = applyEntityEffects(entityEntry.entity, character, catalogLookup);

      // Apply the selection (without resolving choices yet)
      let updatedCharacter: Character = character;

      if (entityType === "ancestry") {
        updatedCharacter = engineSelectAncestry(character, entityId, catalogLookup, derivedContext);
      } else if (entityType === "background") {
        updatedCharacter = engineSelectBackground(character, entityId, catalogLookup, derivedContext);
      } else {
        updatedCharacter = engineSelectClass(character, entityId, catalogLookup, derivedContext);
      }

      nextCharacter = updatedCharacter;

      return {
        ...current,
        character: updatedCharacter,
        pendingChoices: effectResult.choices.filter(choice => choice.scope === "abilityBoost"),  // MODIFIED
        derivedContext: {
          ...current.derivedContext,
          speeds: { ...updatedCharacter.derived.speeds },
        },
      };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  },
  [],
);
```

## 4. Add resolveAbilityBoost Function

Add this new function BEFORE the return statement of useCharacterBuilder (before line 230):

```typescript
const resolveAbilityBoost = useCallback(
  (choiceId: string, selectedAbilities: AbilityId[]) => {
    let nextCharacter: Character | null = null;

    setState((current) => {
      if (!current) {
        return current;
      }

      // Find the choice being resolved
      const choice = current.pendingChoices.find(c => c.id === choiceId);
      if (!choice) {
        console.warn(`Choice ${choiceId} not found in pending choices`);
        return current;
      }

      // Validate selection count
      if (selectedAbilities.length !== choice.count) {
        console.error(`Invalid selection: expected ${choice.count}, got ${selectedAbilities.length}`);
        return current;
      }

      const { character, catalogLookup, derivedContext } = current;
      const { identity } = character;

      // Determine which entity this choice came from
      let updatedCharacter: Character = character;
      const resolution: ChoiceResolution = {
        choiceId,
        selectedIds: selectedAbilities,
      };

      // Re-apply the entity selection with the choice resolution
      if (choice.id.includes("ancestry:") && identity.ancestryId) {
        updatedCharacter = engineSelectAncestry(character, identity.ancestryId, catalogLookup, derivedContext, [resolution]);
      } else if (choice.id.includes("background:") && identity.backgroundId) {
        updatedCharacter = engineSelectBackground(character, identity.backgroundId, catalogLookup, derivedContext, [resolution]);
      } else if (choice.id.includes("class:") && identity.classId) {
        updatedCharacter = engineSelectClass(character, identity.classId, catalogLookup, derivedContext, [resolution]);
      }

      nextCharacter = updatedCharacter;

      // Remove the resolved choice from pending
      const remainingChoices = current.pendingChoices.filter(c => c.id !== choiceId);

      return {
        ...current,
        character: updatedCharacter,
        pendingChoices: remainingChoices,
      };
    });

    if (nextCharacter) {
      persistCharacterState(nextCharacter);
    }
  },
  [],
);
```

## 5. Update Return Statement

Update the return statement to include the new function (around line 230):

```typescript
return {
  status,
  state,
  error,
  refresh: async () => { /* ... existing code ... */ },
  selectAncestry,
  selectBackground,
  selectClass,
  resolveAbilityBoost,  // ADD THIS LINE
};
```

## 6. Update createInitialCharacter Function

Update the function signature and implementation to extract initial pending choices (line 255):

```typescript
function createInitialCharacter(
  catalog: CatalogIndex,
  catalogLookup: CatalogLookup,  // ADD THIS PARAMETER
): {
  character: Character;
  pendingChoices: ChoiceDefinition[];
  derivedContext: DerivedContext;
} {
  // ... existing code for abilityScores, proficiencies, ids ...

  const character = createCharacter({
    // ... existing character creation ...
  });

  // NEW: Collect pending choices from initial selections
  const ancestryChoices = ancestryId ? extractChoicesFromEntity(ancestryId, catalogLookup) : [];
  const backgroundChoices = backgroundId ? extractChoicesFromEntity(backgroundId, catalogLookup) : [];
  const classChoices = classId ? extractChoicesFromEntity(classId, catalogLookup) : [];

  const allChoices = [...ancestryChoices, ...backgroundChoices, ...classChoices].filter(
    choice => choice.scope === "abilityBoost"
  );

  return {
    character,
    pendingChoices: allChoices,  // MODIFIED
    derivedContext,
  };
}
```

## 7. Add Helper Function

Add this new helper function at the end of the file (after findFirstEntityId):

```typescript
function extractChoicesFromEntity(entityId: string, catalogLookup: CatalogLookup): ChoiceDefinition[] {
  const entry = catalogLookup.byId.get(entityId);
  if (!entry) {
    return [];
  }

  const effectResult = applyEntityEffects(entry.entity);
  return effectResult.choices;
}
```

## 8. Update applyCatalog Call

Update the call to createInitialCharacter in applyCatalog (line 121):

```typescript
const initial = createInitialCharacter(catalog, catalogLookup);  // ADD catalogLookup parameter
```

---

**Status**: These changes enable the hook to extract pending ability boost choices and provide a resolution handler for the UI.

**Next Step**: Integrate AbilityBoostSelector component into WizardViewport for step 4.
