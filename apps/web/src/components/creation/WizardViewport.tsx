"use client";

import type {
  AbilityId,
  AbilityBoostMode,
  CatalogIndexEntry,
  ContentEntity,
} from "@pen-paper-rpg/schemas";
import React, { useMemo } from "react";

import type { CreationStep } from "./CreationWizard";
import { AbilityBoostSelector } from "./AbilityBoostSelector";
import { SpellSelector } from "./SpellSelector";
import { FeatSelector } from "./FeatSelector";
import { HeritageSelector } from "./HeritageSelector";
import { EquipmentSelector } from "./EquipmentSelector";
import { CharacterSheet } from "../character/CharacterSheet";

import type { CharacterBuilderState } from "@/hooks/useCharacterBuilder";

type SelectableStepId = "ancestry" | "heritage" | "background" | "class";

interface WizardViewportProps {
  step: CreationStep;
  builderState: CharacterBuilderState;
  onSelectAncestry: (id: string) => void;
  onSelectHeritage: (id: string) => void;
  onSelectBackground: (id: string) => void;
  onSelectClass: (id: string) => void;
  onResolveAbilityBoost: (choiceId: string, selectedAbilities: AbilityId[]) => void;
  onTrainSkills: (skillIds: string[]) => void;
  onLearnSpells: (cantrips: string[], rank1Spells: string[]) => void;
  onSelectFeats: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
  onEquipmentChange: (equipment: any[], wealthRemaining: number) => void;
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
  onSelectHeritage,
  onSelectBackground,
  onSelectClass,
  onResolveAbilityBoost,
  onTrainSkills,
  onLearnSpells,
  onSelectFeats,
  onEquipmentChange,
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
      case "heritage":
        onSelectHeritage(entityId);
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

  // Filter pending choices for the current step
  const stepPendingChoices = useMemo(() => {
    if (!selectableStepId || !selectedId) {
      return [];
    }
    return builderState.pendingChoices.filter((choice) => {
      if (selectableStepId === "ancestry") {
        return choice.id.includes("ancestry:");
      }
      if (selectableStepId === "background") {
        return choice.id.includes("background:");
      }
      if (selectableStepId === "class") {
        return choice.id.includes("class:");
      }
      return false;
    });
  }, [builderState.pendingChoices, selectableStepId, selectedId]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#daa520" }}>{step.title}</h2>
        <p style={{ margin: 0, color: "#a0a0a0", lineHeight: 1.5 }}>{step.description}</p>
      </header>

      {step.id === "heritage" ? (
        <HeritageSelector
          catalog={builderState.catalog}
          catalogLookup={builderState.catalogLookup}
          ancestryId={builderState.character.identity.ancestryId}
          selectedHeritageId={builderState.character.identity.heritageId || null}
          onSelect={onSelectHeritage}
        />
      ) : step.id === "abilities" ? (
        <AbilityBoostSection
          builderState={builderState}
          onResolveAbilityBoost={onResolveAbilityBoost}
        />
      ) : step.id === "starting-feats" ? (
        <FeatSelectionSection builderState={builderState} onLearnSpells={onLearnSpells} onSelectFeats={onSelectFeats} />
      ) : step.id === "proficiencies" ? (
        <ProficienciesSection builderState={builderState} onTrainSkills={onTrainSkills} />
      ) : step.id === "equipment" ? (
        <div>
          <h2 style={{ color: "#daa520", fontSize: "1.5rem", marginBottom: "1rem" }}>Equipment & Wealth</h2>
          <p style={{ color: "#ccc", marginBottom: "1.5rem" }}>
            You begin with <strong>15 gp</strong> to purchase your starting equipment. Choose weapons, armor, and adventuring gear.
          </p>
          <EquipmentSelector
            catalog={builderState.catalog}
            strengthModifier={Math.floor((builderState.character.abilityScores.final.STR - 10) / 2)}
            onEquipmentChange={onEquipmentChange}
          />
        </div>
      ) : step.id === "review" ? (
        <ReviewSection builderState={builderState} />
      ) : selectableStepId ? (
        <>
          {entries.length > 0 ? (
            <EntitySelectionList
              entries={entries}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ) : (
            <p style={{ color: "#9ca3af" }}>
              No entities available in the catalog for this step. Load YAML packs to populate the catalog.
            </p>
          )}

          {/* Show ability boost selectors for pending choices */}
          {stepPendingChoices.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#daa520" }}>
                Resolve Ability Boosts
              </h3>
              {stepPendingChoices.map((choice) => (
                <AbilityBoostSelector
                  key={choice.id}
                  choice={choice}
                  currentAbilities={builderState.character.abilityScores.final}
                  onResolve={onResolveAbilityBoost}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <PlaceholderMessage stepId={step.id} />
      )}
    </section>
  );
}

function isSelectableStep(stepId: string): stepId is SelectableStepId {
  return stepId === "ancestry" || stepId === "heritage" || stepId === "background" || stepId === "class";
}

function getSelectedEntityId(
  stepId: SelectableStepId,
  builderState: CharacterBuilderState,
): string | undefined {
  if (stepId === "ancestry") {
    return builderState.character.identity.ancestryId;
  }
  if (stepId === "heritage") {
    return builderState.character.identity.heritageId || undefined;
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
  const { entity, packId} = entry;
  const borderColor = isSelected ? "#daa520" : "#444";
  const background = "#2d2d2d";
  const rarityLabel = entity.rarity ? capitalize(entity.rarity) : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(entry.entity.id)}
      style={{
        border: isSelected ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
        background,
        borderRadius: 8,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        textAlign: "left",
        cursor: "pointer",
        boxShadow: isSelected ? "0 6px 12px rgba(0, 0, 0, 0.4)" : "0 4px 6px rgba(0, 0, 0, 0.3)",
        transition: "all 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#daa520";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = "#444";
          e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
        }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <span style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>Pack: {packId}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#e0e0e0" }}>{entity.name}</h3>
          {rarityLabel ? (
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#daa520",
              }}
            >
              {rarityLabel}
            </span>
          ) : null}
        </div>
      </div>

      <p style={{ margin: 0, color: "#a0a0a0", lineHeight: 1.5 }}>
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
            background: "#1a1a1a",
            color: "#a0a0a0",
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
    color: "#a0a0a0",
  } as const;

  const valueStyle = {
    margin: 0,
    fontSize: "0.95rem",
    color: "#e0e0e0",
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
        border: "1px dashed #666",
        borderRadius: 8,
        padding: "1.25rem",
        background: "#2d2d2d",
        color: "#a0a0a0",
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

interface FeatSelectionSectionProps {
  builderState: CharacterBuilderState;
  onLearnSpells: (cantrips: string[], rank1Spells: string[]) => void;
  onSelectFeats: (selections: Array<{ slotIndex: number; featId: string; grantedBy: string }>) => void;
}

function FeatSelectionSection({ builderState, onLearnSpells, onSelectFeats }: FeatSelectionSectionProps): JSX.Element {
  const { catalog, catalogLookup, character } = builderState;
  const [selectedCantrips, setSelectedCantrips] = React.useState<string[]>([]);
  const [selectedRank1Spells, setSelectedRank1Spells] = React.useState<string[]>([]);
  const [selectedFeats, setSelectedFeats] = React.useState<Array<{ slotIndex: number; featId: string }>>([]);

  // Check if character is a spellcaster
  const spellcasterInfo = useMemo(() => {
    const classId = character.identity.classId;
    if (!classId) return null;

    const spellcastingClasses: Record<string, { tradition: "arcane" | "divine" | "occult" | "primal"; castingType: "prepared" | "spontaneous"; cantrips: number; rank1: number }> = {
      "pf2e.class.wizard": { tradition: "arcane", castingType: "prepared", cantrips: 5, rank1: 5 },
      "pf2e.class.cleric": { tradition: "divine", castingType: "prepared", cantrips: 5, rank1: 3 },
      "pf2e.class.druid": { tradition: "primal", castingType: "prepared", cantrips: 5, rank1: 3 },
      "pf2e.class.sorcerer": { tradition: "arcane", castingType: "spontaneous", cantrips: 5, rank1: 3 },
      "pf2e.class.bard": { tradition: "occult", castingType: "spontaneous", cantrips: 5, rank1: 2 },
    };

    return spellcastingClasses[classId] || null;
  }, [character.identity.classId]);

  const hasLearnedSpells = character.spellcasting && character.spellcasting.length > 0;
  const hasSelectedFeats = character.feats && character.feats.length > 0;

  // Determine feat slots at level 1
  const featSlots = useMemo(() => {
    const slots = [];

    // All characters get 1 ancestry feat at level 1
    if (character.identity.ancestryId) {
      slots.push({
        category: "ancestry" as const,
        label: "Ancestry Feat",
        grantedBy: "ancestry",
      });
    }

    // All characters get 1 class feat at level 1
    if (character.identity.classId) {
      slots.push({
        category: "class" as const,
        label: "Class Feat",
        grantedBy: "class",
      });
    }

    // Check if background grants a skill feat
    if (character.identity.backgroundId) {
      const backgroundEntity = catalogLookup.byId.get(character.identity.backgroundId)?.entity;
      if (backgroundEntity && backgroundEntity.type === "background") {
        const background = backgroundEntity as any;
        if (background.feat) {
          // Background grants a specific skill feat (auto-granted, not a choice)
          // We don't add it to slots since it's automatic
        }
      }
    }

    return slots;
  }, [character.identity.ancestryId, character.identity.classId, character.identity.backgroundId, catalogLookup]);

  const handleSpellSelectionChange = (cantrips: string[], rank1: string[]) => {
    setSelectedCantrips(cantrips);
    setSelectedRank1Spells(rank1);
  };

  const handleConfirmSpells = () => {
    onLearnSpells(selectedCantrips, selectedRank1Spells);
  };

  const handleFeatSelectionChange = (selections: Array<{ slotIndex: number; featId: string }>) => {
    setSelectedFeats(selections);
  };

  const handleConfirmFeats = () => {
    // Add grantedBy field to selections
    const selectionsWithGrantedBy = selectedFeats.map((selection) => ({
      ...selection,
      grantedBy: featSlots[selection.slotIndex]?.grantedBy || "unknown",
    }));
    onSelectFeats(selectionsWithGrantedBy);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Spell Selection for Spellcasters */}
      {spellcasterInfo && !hasLearnedSpells && (
        <div>
          <h3 style={{ color: "#daa520", fontSize: "1.5rem", marginBottom: "1rem" }}>
            Starting Spells
          </h3>
          <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginBottom: "1rem" }}>
            As a {character.identity.classId?.split('.').pop() || 'spellcaster'}, you must select your starting spells before choosing feats.
          </p>
          <SpellSelector
            catalog={catalog}
            catalogLookup={catalogLookup}
            tradition={spellcasterInfo.tradition}
            castingType={spellcasterInfo.castingType}
            cantripsNeeded={spellcasterInfo.cantrips}
            rank1SpellsNeeded={spellcasterInfo.rank1}
            selectedCantrips={selectedCantrips}
            selectedRank1Spells={selectedRank1Spells}
            onSelectionChange={handleSpellSelectionChange}
            onConfirm={handleConfirmSpells}
          />
        </div>
      )}

      {spellcasterInfo && hasLearnedSpells && (
        <div style={{ padding: "1rem", backgroundColor: "#2d2d2d", border: "1px solid #4ade80", borderRadius: "8px" }}>
          <p style={{ color: "#4ade80", margin: 0 }}>
            ✓ Starting spells selected ({character.spellcasting[0].spells.length} total)
          </p>
        </div>
      )}

      {/* Feat Selection */}
      {!hasSelectedFeats && featSlots.length > 0 && ((!spellcasterInfo || hasLearnedSpells)) && (
        <div>
          <h3 style={{ color: "#daa520", fontSize: "1.5rem", marginBottom: "1rem" }}>
            Starting Feats
          </h3>
          <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Select your starting feats. At level 1, you gain an ancestry feat and a class feat.
          </p>
          <FeatSelector
            catalog={catalog}
            catalogLookup={catalogLookup}
            ancestryId={character.identity.ancestryId}
            classId={character.identity.classId}
            backgroundId={character.identity.backgroundId}
            slots={featSlots}
            selectedFeats={selectedFeats}
            onSelectionChange={handleFeatSelectionChange}
            onConfirm={handleConfirmFeats}
          />
        </div>
      )}

      {hasSelectedFeats && (
        <div style={{ padding: "1rem", backgroundColor: "#2d2d2d", border: "1px solid #4ade80", borderRadius: "8px" }}>
          <p style={{ color: "#4ade80", margin: 0 }}>
            ✓ Starting feats selected ({character.feats.length} total)
          </p>
          <ul style={{ color: "#ccc", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
            {character.feats.map((feat) => {
              const featEntity = catalogLookup.byId.get(feat.id)?.entity;
              return (
                <li key={feat.id}>
                  {featEntity?.name || feat.id} <em style={{ opacity: 0.7 }}>({feat.grantedBy})</em>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

interface ProficienciesSectionProps {
  builderState: CharacterBuilderState;
  onTrainSkills: (skillIds: string[]) => void;
}

const AVAILABLE_SKILLS = [
  "Acrobatics",
  "Arcana",
  "Athletics",
  "Crafting",
  "Deception",
  "Diplomacy",
  "Intimidation",
  "Medicine",
  "Nature",
  "Occultism",
  "Performance",
  "Religion",
  "Society",
  "Stealth",
  "Survival",
  "Thievery",
] as const;

function ProficienciesSection({ builderState, onTrainSkills }: ProficienciesSectionProps): JSX.Element {
  const { character, catalog, catalogLookup } = builderState;
  const { proficiencies } = character;
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>([]);

  // Get the class entity to find skill training slots
  const classEntity = character.identity.classId
    ? catalogLookup.byId.get(character.identity.classId)?.entity
    : null;

  const skillSlotsAvailable = (classEntity && classEntity.type === "class")
    ? classEntity.proficiencies.skills.trained
    : 0;

  const currentlyTrainedSkills = Object.keys(proficiencies.skills);
  const needsSkillSelection = currentlyTrainedSkills.length < skillSlotsAvailable;

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) {
        return prev.filter((s) => s !== skillId);
      } else if (prev.length < skillSlotsAvailable) {
        return [...prev, skillId];
      }
      return prev;
    });
  };

  const handleConfirm = () => {
    if (selectedSkills.length === skillSlotsAvailable) {
      onTrainSkills(selectedSkills);
      setSelectedSkills([]);
    }
  };

  const isConfirmEnabled = selectedSkills.length === skillSlotsAvailable;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {needsSkillSelection ? (
        <>
          {/* Skill Selection UI */}
          <div style={{ background: "#2d2d2d", border: "1px solid #daa520", borderRadius: "0.5rem", padding: "1.5rem" }}>
            <h3 style={{ color: "#daa520", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              Select Your Trained Skills
            </h3>
            <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Choose {skillSlotsAvailable} skills to train. Selected: {selectedSkills.length}/{skillSlotsAvailable}
            </p>

            <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {AVAILABLE_SKILLS.map((skillId) => {
                const isSelected = selectedSkills.includes(skillId);
                const isDisabled = !isSelected && selectedSkills.length >= skillSlotsAvailable;

                return (
                  <label
                    key={skillId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem",
                      background: isSelected ? "#3a3a2d" : "#1a1a1a",
                      border: isSelected ? "2px solid #daa520" : "1px solid #444",
                      borderRadius: "0.375rem",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      opacity: isDisabled ? 0.5 : 1,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) {
                        e.currentTarget.style.borderColor = "#daa520";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isDisabled) {
                        e.currentTarget.style.borderColor = "#444";
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skillId)}
                      disabled={isDisabled}
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                      }}
                    />
                    <span style={{ color: "#e0e0e0", fontSize: "0.875rem", fontWeight: isSelected ? "600" : "400" }}>
                      {skillId}
                    </span>
                  </label>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isConfirmEnabled}
              style={{
                marginTop: "1.5rem",
                padding: "0.75rem 1.5rem",
                background: isConfirmEnabled ? "#daa520" : "#444",
                color: isConfirmEnabled ? "#1a1a1a" : "#666",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isConfirmEnabled ? "pointer" : "not-allowed",
                transition: "all 0.2s",
              }}
            >
              Confirm Skills
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Show Current Proficiencies */}
          <div style={{ background: "#2d2d2d", border: "1px solid #daa520", borderRadius: "0.5rem", padding: "1.5rem" }}>
            <h3 style={{ color: "#daa520", fontSize: "1.25rem", marginBottom: "1rem" }}>
              ✓ Skills Trained
            </h3>
            <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginBottom: "1rem" }}>
              You have successfully trained {currentlyTrainedSkills.length} skills.
            </p>

            <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
              {currentlyTrainedSkills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "0.5rem 0.75rem",
                    background: "#3a3a2d",
                    border: "1px solid #daa520",
                    borderRadius: "0.25rem",
                    color: "#e0e0e0",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Show Other Proficiencies */}
          <div style={{ background: "#2d2d2d", border: "1px solid #444", borderRadius: "0.5rem", padding: "1.5rem" }}>
            <h3 style={{ color: "#daa520", fontSize: "1.25rem", marginBottom: "1rem" }}>
              Other Proficiencies
            </h3>

            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              <div>
                <h4 style={{ color: "#e0e0e0", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Perception</h4>
                <p style={{ color: "#a0a0a0" }}>{capitalize(proficiencies.perception)}</p>
              </div>

              <div>
                <h4 style={{ color: "#e0e0e0", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Saving Throws</h4>
                <p style={{ color: "#a0a0a0" }}>
                  Fort: {capitalize(proficiencies.saves.fortitude)}<br />
                  Ref: {capitalize(proficiencies.saves.reflex)}<br />
                  Will: {capitalize(proficiencies.saves.will)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface EquipmentSelectionSectionProps {
  builderState: CharacterBuilderState;
}

function EquipmentSelectionSection({ builderState }: EquipmentSelectionSectionProps): JSX.Element {
  const { character } = builderState;
  const classId = character.identity.classId;
  const className = classId?.split('.').pop() || 'character';

  // Starting wealth for level 1 characters
  const startingWealth = 15;

  // Get class-specific equipment recommendations
  const getEquipmentRecommendations = () => {
    const lower = className.toLowerCase();

    if (lower === 'fighter' || lower === 'champion' || lower === 'barbarian') {
      return {
        armor: 'Chain mail or scale mail',
        weapons: 'Longsword and shield, or greatsword',
        gear: 'Adventurer\'s pack, rope, healing potions',
      };
    }

    if (lower === 'rogue' || lower === 'ranger') {
      return {
        armor: 'Leather armor',
        weapons: 'Rapier and shortbow, or two shortswords',
        gear: 'Adventurer\'s pack, thieves\' tools, rope',
      };
    }

    if (lower === 'wizard' || lower === 'sorcerer') {
      return {
        armor: 'None (unarmored)',
        weapons: 'Staff or dagger',
        gear: 'Spellbook (wizard), component pouch, scholar\'s pack',
      };
    }

    if (lower === 'cleric' || lower === 'druid') {
      return {
        armor: 'Hide armor or scale mail',
        weapons: 'Mace or scimitar',
        gear: 'Religious symbol (cleric), druidic focus (druid), healer\'s kit',
      };
    }

    // Default recommendations
    return {
      armor: 'Leather armor or chain shirt',
      weapons: 'Longsword or rapier',
      gear: 'Adventurer\'s pack, rope, healing potions',
    };
  };

  const recommendations = getEquipmentRecommendations();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Starting Wealth */}
      <div style={{ background: "#2d2d2d", border: "1px solid #daa520", borderRadius: "0.5rem", padding: "1.5rem" }}>
        <h3 style={{ color: "#daa520", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          Starting Wealth
        </h3>
        <p style={{ color: "#e0e0e0", fontSize: "1.5rem", fontWeight: "700", margin: 0 }}>
          {startingWealth} Gold Pieces
        </p>
        <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          All level 1 characters start with {startingWealth} gold pieces to purchase equipment.
        </p>
      </div>

      {/* Recommended Equipment */}
      <div style={{ background: "#2d2d2d", border: "1px solid #444", borderRadius: "0.5rem", padding: "1.5rem" }}>
        <h3 style={{ color: "#daa520", fontSize: "1.25rem", marginBottom: "1rem" }}>
          Recommended Equipment for {capitalize(className)}
        </h3>

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          <div>
            <h4 style={{ color: "#e0e0e0", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "600" }}>
              Armor
            </h4>
            <p style={{ color: "#a0a0a0", margin: 0 }}>{recommendations.armor}</p>
          </div>

          <div>
            <h4 style={{ color: "#e0e0e0", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "600" }}>
              Weapons
            </h4>
            <p style={{ color: "#a0a0a0", margin: 0 }}>{recommendations.weapons}</p>
          </div>

          <div>
            <h4 style={{ color: "#e0e0e0", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: "600" }}>
              Adventuring Gear
            </h4>
            <p style={{ color: "#a0a0a0", margin: 0 }}>{recommendations.gear}</p>
          </div>
        </div>
      </div>

      {/* Placeholder Notice */}
      <div style={{ background: "#1a1a1a", border: "1px dashed #666", borderRadius: "0.5rem", padding: "1.5rem" }}>
        <h4 style={{ color: "#daa520", fontSize: "1rem", marginBottom: "0.5rem" }}>
          Coming Soon: Interactive Equipment Selection
        </h4>
        <p style={{ color: "#a0a0a0", fontSize: "0.875rem", lineHeight: 1.6, margin: 0 }}>
          The full equipment catalog with interactive selection, pricing, and inventory management will be added in a future update.
          For now, use the recommendations above to manually track your starting equipment.
        </p>
      </div>
    </div>
  );
}

interface ReviewSectionProps {
  builderState: CharacterBuilderState;
}

function ReviewSection({ builderState }: ReviewSectionProps): JSX.Element {
  const { character, catalogLookup } = builderState;
  const [exportingFormat, setExportingFormat] = React.useState<string | null>(null);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${character.metadata.name.replace(/\s+/g, "_")}_character.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProfessionalExport = async (format: "pdf" | "excel" | "word") => {
    setExportingFormat(format);
    setExportError(null);

    try {
      // Convert CatalogLookup Maps to serializable format
      const catalogLookupData = catalogLookup ? {
        byId: Array.from(catalogLookup.byId.entries()),
      } : null;

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character,
          catalogLookup: catalogLookupData,
          format,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Export failed");
      }

      // Download the file
      const link = document.createElement("a");
      link.href = result.downloadUrl;
      link.download = result.filename;
      link.click();
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Export failed");
      console.error("Export error:", error);
    } finally {
      setExportingFormat(null);
    }
  };

  const handlePrintSheet = async () => {
    setExportingFormat("pdf");
    setExportError(null);

    try {
      // Convert CatalogLookup Maps to serializable format
      const catalogLookupData = catalogLookup ? {
        byId: Array.from(catalogLookup.byId.entries()),
      } : null;

      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character,
          catalogLookup: catalogLookupData,
          format: "pdf",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "PDF generation failed");
      }

      // Open the PDF in a new tab so user can print it
      window.open(result.downloadUrl, "_blank");
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "PDF generation failed");
      console.error("Print sheet error:", error);
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Action Buttons */}
      <div style={{
        background: "#2d2d2d",
        border: "1px solid #daa520",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <h3 style={{ color: "#daa520", fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
            ✓ Character Complete!
          </h3>
          <p style={{ color: "#a0a0a0", fontSize: "0.875rem", margin: 0 }}>
            Review your character sheet below and export when ready.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={handleExport}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#daa520",
              color: "#1a1a1a",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#c49520";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#daa520";
            }}
          >
            📥 Export Character
          </button>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#444",
              color: "#e0e0e0",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#555";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#444";
            }}
          >
            🖨️ Print Sheet
          </button>
        </div>
      </div>

      {/* Professional Export Section */}
      <div style={{
        background: "#2d2d2d",
        border: "1px solid #444",
        borderRadius: "0.5rem",
        padding: "1.5rem",
      }}>
        <h3 style={{ color: "#daa520", fontSize: "1.25rem", margin: "0 0 0.5rem 0" }}>
          Export Professional Character Sheet
        </h3>
        <p style={{ color: "#a0a0a0", fontSize: "0.875rem", marginBottom: "1rem" }}>
          Download your character sheet in professional format with all features, formulas, and formatting.
        </p>

        {exportError && (
          <div style={{
            padding: "0.75rem",
            background: "#3d1f1f",
            border: "1px solid #ff4444",
            borderRadius: "0.375rem",
            color: "#ff4444",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}>
            Error: {exportError}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleProfessionalExport("pdf")}
            disabled={exportingFormat !== null}
            style={{
              padding: "0.75rem 1.5rem",
              background: exportingFormat === "pdf" ? "#555" : "#daa520",
              color: exportingFormat === "pdf" ? "#ccc" : "#1a1a1a",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: exportingFormat !== null ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#c49520";
              }
            }}
            onMouseLeave={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#daa520";
              }
            }}
          >
            <span>📄</span>
            <span>{exportingFormat === "pdf" ? "Generating PDF..." : "Download PDF"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleProfessionalExport("excel")}
            disabled={exportingFormat !== null}
            style={{
              padding: "0.75rem 1.5rem",
              background: exportingFormat === "excel" ? "#555" : "#daa520",
              color: exportingFormat === "excel" ? "#ccc" : "#1a1a1a",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: exportingFormat !== null ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#c49520";
              }
            }}
            onMouseLeave={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#daa520";
              }
            }}
          >
            <span>📊</span>
            <span>{exportingFormat === "excel" ? "Generating Excel..." : "Download Excel"}</span>
          </button>

          <button
            type="button"
            onClick={() => handleProfessionalExport("word")}
            disabled={exportingFormat !== null}
            style={{
              padding: "0.75rem 1.5rem",
              background: exportingFormat === "word" ? "#555" : "#daa520",
              color: exportingFormat === "word" ? "#ccc" : "#1a1a1a",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: exportingFormat !== null ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#c49520";
              }
            }}
            onMouseLeave={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#daa520";
              }
            }}
          >
            <span>📝</span>
            <span>{exportingFormat === "word" ? "Generating Word..." : "Download Word"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintSheet}
            disabled={exportingFormat !== null}
            style={{
              padding: "0.75rem 1.5rem",
              background: exportingFormat !== null ? "#555" : "#2a7a2a",
              color: exportingFormat !== null ? "#ccc" : "white",
              border: "none",
              borderRadius: "0.375rem",
              fontWeight: "600",
              cursor: exportingFormat !== null ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#236a23";
              }
            }}
            onMouseLeave={(e) => {
              if (exportingFormat === null) {
                e.currentTarget.style.background = "#2a7a2a";
              }
            }}
          >
            <span>🖨️</span>
            <span>Print Sheet</span>
          </button>
        </div>

        <p style={{ color: "#666", fontSize: "0.75rem", marginTop: "1rem", fontStyle: "italic" }}>
          PDF: Multi-page professional layout • Excel: Dynamic spreadsheet with formulas • Word: Formatted document • Print: Browser print dialog
        </p>
      </div>

      {/* Character Sheet */}
      <CharacterSheet character={character} catalogLookup={builderState.catalogLookup} />
    </div>
  );
}

function AbilityBoostSection({ builderState, onResolveAbilityBoost }: AbilityBoostSectionProps): JSX.Element {
  const { pendingChoices, character } = builderState;

  // Filter for ability boost choices only
  const abilityBoostChoices = pendingChoices.filter(choice => choice.scope === "abilityBoost");

  // Separate entity boosts from final boosts
  const entityBoosts = abilityBoostChoices.filter(choice =>
    choice.id.includes("ancestry:") || choice.id.includes("background:") || choice.id.includes("class:")
  );
  const finalBoosts = abilityBoostChoices.filter(choice => choice.id.startsWith("level1:final-boost-"));

  if (abilityBoostChoices.length === 0) {
    return (
      <div
        style={{
          border: "1px solid #daa520",
          borderRadius: 8,
          padding: "1.25rem",
          background: "#2d2d2d",
          color: "#e0e0e0",
          lineHeight: 1.5,
        }}
      >
        <p style={{ margin: 0, fontWeight: "600", fontSize: "1.125rem", color: "#daa520" }}>✓ All ability boosts have been assigned!</p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", color: "#a0a0a0" }}>
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
                  background: "#1a1a1a",
                  borderRadius: "0.375rem",
                  border: "1px solid #444",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "#daa520" }}>
                  {abilityId}
                </div>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#e0e0e0" }}>
                  {score}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#a0a0a0" }}>
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
      {/* Entity boosts from ancestry, background, class */}
      {entityBoosts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "0.75rem", background: "#2d2d2d", borderRadius: "0.375rem", border: "1px solid #444" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#a0a0a0" }}>
              <strong style={{ color: "#daa520" }}>Step 1:</strong> Resolve ability boost choices from your ancestry, background, and class selections.
            </p>
          </div>
          {entityBoosts.map((choice, index) => (
            <div key={choice.id}>
              {index > 0 && (
                <div
                  style={{
                    height: "1px",
                    background: "#444",
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
      )}

      {/* Final 4 free boosts */}
      {finalBoosts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ padding: "0.75rem", background: "#2d2d2d", borderRadius: "0.375rem", border: "1px solid #daa520" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#e0e0e0" }}>
              <strong style={{ color: "#daa520" }}>Step 2: Final Free Boosts</strong>
            </p>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#a0a0a0" }}>
              All level 1 characters receive 4 additional free ability boosts. Each boost must go to a different ability.
            </p>
          </div>
          {finalBoosts.map((choice, index) => (
            <div key={choice.id}>
              {index > 0 && (
                <div
                  style={{
                    height: "1px",
                    background: "#444",
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
      )}
    </div>
  );
}





