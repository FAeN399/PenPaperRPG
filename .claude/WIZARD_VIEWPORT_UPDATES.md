# WizardViewport Updates for Ability Boost Selection

Changes needed for `apps/web/src/components/creation/WizardViewport.tsx` to integrate the AbilityBoostSelector component.

## 1. Add Import

At the top of the file (after line 8):

```typescript
import type { AbilityId } from "@pen-paper-rpg/schemas";
import { AbilityBoostSelector } from "./AbilityBoostSelector";  // ADD THIS
```

## 2. Update WizardViewportProps Interface

Update the interface (line 16) to add the new handler:

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

## 3. Update Function Signature

Update the function signature to destructure the new prop (line 37):

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

## 4. Replace Return Statement Logic

Replace the return statement (lines 80-103) with this updated version:

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

## 5. Add AbilityBoostSection Component

Add this new component after the `PlaceholderMessage` function (around line 406):

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

**Key Changes**:
1. Added import for AbilityId and AbilityBoostSelector
2. Added onResolveAbilityBoost prop to interface
3. Updated return statement to check for "abilities" step
4. Created AbilityBoostSection component to:
   - Display pending ability boost choices
   - Show final ability scores when all choices are resolved
   - Render AbilityBoostSelector for each pending choice

**Next Step**: Update CreationWizard to pass the resolveAbilityBoost handler to WizardViewport.
