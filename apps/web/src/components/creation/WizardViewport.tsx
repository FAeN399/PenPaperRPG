"use client";

import type {
  AbilityId,
  AbilityBoostMode,
  CatalogIndexEntry,
  ContentEntity,
} from "@pen-paper-rpg/schemas";
import { useMemo } from "react";

import type { CreationStep } from "./CreationWizard";
import { AbilityBoostSelector } from "./AbilityBoostSelector";

import type { CharacterBuilderState } from "@/hooks/useCharacterBuilder";

type SelectableStepId = "ancestry" | "background" | "class";

interface WizardViewportProps {
  step: CreationStep;
  builderState: CharacterBuilderState;
  onSelectAncestry: (id: string) => void;
  onSelectBackground: (id: string) => void;
  onSelectClass: (id: string) => void;
  onResolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;
}

const STEP_PLACEHOLDER: Record<string, string> = {
  abilities:
    "Ability boosts and flaws will be driven by ancestry, background, and class choices in a later milestone.",
  proficiencies:
    "Skill and weapon proficiency training logic is on the roadmap once trait-driven adjustments are wired in.",
  "starting-feats":
    "Starting feats will surface once the feat picker UI and engine hooks are completed.",
  equipment:
    "Equipment management is planned after the core identity flow is locked in.",
  review:
    "Once all steps are implemented this screen will summarise derived stats and export options.",
};

export function WizardViewport({
  step,
  builderState,
  onSelectAncestry,
  onSelectBackground,
  onSelectClass,
  onResolveAbilityBoost,
}: WizardViewportProps): JSX.Element {
  const selectableStepId = isSelectableStep(step.id) ? step.id : null;

  const entries = useMemo<CatalogIndexEntry[]>(() => {
    if (!selectableStepId) {
      return [];
    }

    return builderState.catalog.entities.filter(
      (entry) => entry.entity.type === selectableStepId,
    );
  }, [builderState.catalog.entities, selectableStepId]);

  const selectedId = selectableStepId
    ? getSelectedEntityId(selectableStepId, builderState)
    : undefined;

  function handleSelect(entityId: string): void {
    if (!selectableStepId) {
      return;
    }

    switch (selectableStepId) {
      case "ancestry":
        onSelectAncestry(entityId);
        break;
      case "background":
        onSelectBackground(entityId);
        break;
      case "class":
        onSelectClass(entityId);
        break;
      default:
        break;
    }
  }

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.75rem", color: "#111827" }}>{step.title}</h2>
        <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5 }}>{step.description}</p>
      </header>

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
}

function isSelectableStep(stepId: string): stepId is SelectableStepId {
  return stepId === "ancestry" || stepId === "background" || stepId === "class";
}

function getSelectedEntityId(
  stepId: SelectableStepId,
  builderState: CharacterBuilderState,
): string | undefined {
  if (stepId === "ancestry") {
    return builderState.character.identity.ancestryId;
  }
  if (stepId === "background") {
    return builderState.character.identity.backgroundId;
  }
  return builderState.character.identity.classId;
}

interface EntitySelectionListProps {
  entries: CatalogIndexEntry[];
  selectedId?: string;
  onSelect: (entityId: string) => void;
}

function EntitySelectionList({ entries, selectedId, onSelect }: EntitySelectionListProps): JSX.Element {
  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      }}
    >
      {entries.map((entry) => (
        <EntityCard
          key={entry.entity.id}
          entry={entry}
          isSelected={entry.entity.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface EntityCardProps {
  entry: CatalogIndexEntry;
  isSelected: boolean;
  onSelect: (entityId: string) => void;
}

function EntityCard({ entry, isSelected, onSelect }: EntityCardProps): JSX.Element {
  const { entity, packId } = entry;
  const borderColor = isSelected ? "#2563eb" : "#e5e7eb";
  const background = isSelected ? "#eef2ff" : "#ffffff";
  const rarityLabel = entity.rarity ? capitalize(entity.rarity) : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.entity.id)}
      style={{
        border: `1px solid ${borderColor}`,
        background,
        borderRadius: 12,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: isSelected ? "0 0 0 2px rgba(37, 99, 235, 0.2)" : "0 1px 2px rgba(15, 23, 42, 0.08)",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#9ca3af";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(15, 23, 42, 0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.08)";
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>Pack: {packId}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#111827" }}>{entity.name}</h3>
          {rarityLabel ? (
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#2563eb",
              }}
            >
              {rarityLabel}
            </span>
          ) : null}
        </div>
      </div>

      <p style={{ margin: 0, color: "#4b5563", lineHeight: 1.5 }}>
        {entity.summary ?? "No summary provided for this entity."}
      </p>

      <TraitsList traits={entity.traits} />

      {renderEntityMeta(entity)}
    </button>
  );
}

function TraitsList({ traits }: { traits: string[] }): JSX.Element | null {
  if (traits.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
      {traits.map((trait) => (
        <span
          key={trait}
          style={{
            background: "#f3f4f6",
            color: "#374151",
            fontSize: "0.75rem",
            padding: "0.15rem 0.5rem",
            borderRadius: 9999,
          }}
        >
          {trait}
        </span>
      ))}
    </div>
  );
}

function renderEntityMeta(entity: ContentEntity): JSX.Element | null {
  const containerStyle = {
    display: "grid",
    gap: "0.75rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  } as const;

  const labelStyle = {
    margin: 0,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#6b7280",
  } as const;

  const valueStyle = {
    margin: 0,
    fontSize: "0.95rem",
    color: "#111827",
    fontWeight: 600,
  } as const;

  if (entity.type === "ancestry") {
    return (
      <div style={containerStyle}>
        <div>
          <p style={labelStyle}>Hit Points</p>
          <p style={valueStyle}>{entity.hitPoints}</p>
        </div>
        <div>
          <p style={labelStyle}>Size</p>
          <p style={valueStyle}>{entity.size}</p>
        </div>
        <div>
          <p style={labelStyle}>Speed</p>
          <p style={valueStyle}>{entity.speed} ft.</p>
        </div>
        {entity.boosts.length > 0 ? (
          <div>
            <p style={labelStyle}>Ability Boosts</p>
            <p style={valueStyle}>{formatBoosts(entity.boosts)}</p>
          </div>
        ) : null}
        {entity.flaws.length > 0 ? (
          <div>
            <p style={labelStyle}>Ability Flaws</p>
            <p style={valueStyle}>{entity.flaws.join(", ")}</p>
          </div>
        ) : null}
      </div>
    );
  }

  if (entity.type === "background") {
    return (
      <div style={containerStyle}>
        {entity.boosts.length > 0 ? (
          <div>
            <p style={labelStyle}>Ability Boosts</p>
            <p style={valueStyle}>{formatBoosts(entity.boosts)}</p>
          </div>
        ) : null}
        <div>
          <p style={labelStyle}>Skill Training</p>
          <p style={valueStyle}>
            {entity.skillTraining.length > 0 ? entity.skillTraining.join(", ") : "-"}
          </p>
        </div>
        <div>
          <p style={labelStyle}>Granted Feat</p>
          <p style={valueStyle}>{entity.feat ?? "-"}</p>
        </div>
      </div>
    );
  }

  if (entity.type === "class") {
    const saves = entity.proficiencies.savingThrows;
    const trainedSkills = entity.proficiencies.skills.trained;
    const additionalChoices = entity.proficiencies.skills.additionalChoices;

    return (
      <div style={containerStyle}>
        <div>
          <p style={labelStyle}>Key Ability</p>
          <p style={valueStyle}>{entity.keyAbility.join(", ")}</p>
        </div>
        <div>
          <p style={labelStyle}>HP per Level</p>
          <p style={valueStyle}>{entity.hitPointsPerLevel}</p>
        </div>
        <div>
          <p style={labelStyle}>Perception</p>
          <p style={valueStyle}>{formatRank(entity.proficiencies.perception)}</p>
        </div>
        <div>
          <p style={labelStyle}>Saving Throws</p>
          <p style={valueStyle}>
            Fort {formatRank(saves.fortitude)} | Ref {formatRank(saves.reflex)} | Will {formatRank(saves.will)}
          </p>
        </div>
        <div>
          <p style={labelStyle}>Trained Skills</p>
          <p style={valueStyle}>
            {trainedSkills}
            {additionalChoices.length > 0
              ? ` + choose ${additionalChoices.length} (${additionalChoices.join(", ")})`
              : ""}
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function formatRank(rank?: string): string {
  if (!rank) {
    return "-";
  }
  return capitalize(rank);
}

function formatBoosts(boosts: AbilityBoostMode[]): string {
  return boosts.map(formatBoost).join("; ");
}

function formatBoost(boost: AbilityBoostMode): string {
  const value = boost.value ?? 2;
  if (boost.type === "fixed") {
    return `+${value} ${boost.abilities.join(", ")}`;
  }
  if (boost.type === "choice") {
    return `Choose ${boost.count} (+${value}) from ${boost.options.join(", ")}`;
  }
  return `Choose ${boost.count} ability boost${boost.count > 1 ? "s" : ""} (+${value})`;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function PlaceholderMessage({ stepId }: { stepId: string }): JSX.Element {
  const message = STEP_PLACEHOLDER[stepId] ?? "This step has not been implemented yet.";
  return (
    <div
      style={{
        border: "1px dashed #d1d5db",
        borderRadius: 8,
        padding: "1.25rem",
        background: "#f9fafb",
        color: "#6b7280",
        lineHeight: 1.5,
      }}
    >
      {message}
    </div>
  );
}

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





