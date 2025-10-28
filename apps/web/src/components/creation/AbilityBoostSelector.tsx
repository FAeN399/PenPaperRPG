"use client";

import type { AbilityId, AbilityScoreBlock, ChoiceDefinition } from "@pen-paper-rpg/schemas";
import { abilityIds } from "@pen-paper-rpg/schemas";
import { useState, useMemo } from "react";

interface AbilityBoostSelectorProps {
  choice: ChoiceDefinition;
  currentAbilities: AbilityScoreBlock;
  onResolve: (choiceId: string, selectedAbilities: AbilityId[]) => void;
  onCancel?: () => void;
}

/**
 * Interactive UI for selecting ability score boosts.
 * Displays all six abilities with current scores, modifiers, and selection state.
 */
export function AbilityBoostSelector({
  choice,
  currentAbilities,
  onResolve,
  onCancel,
}: AbilityBoostSelectorProps) {
  const [selectedAbilities, setSelectedAbilities] = useState<AbilityId[]>([]);

  // Calculate ability modifier: (score - 10) / 2, rounded down
  const getModifier = (score: number): number => {
    return Math.floor((score - 10) / 2);
  };

  // Format modifier with + or - sign
  const formatModifier = (modifier: number): string => {
    if (modifier >= 0) {
      return `+${modifier}`;
    }
    return `${modifier}`;
  };

  // Check if an ability can be selected
  const canSelectAbility = (abilityId: AbilityId): boolean => {
    // Already selected
    if (selectedAbilities.includes(abilityId)) {
      return true;
    }

    // Max selections reached
    if (selectedAbilities.length >= choice.count) {
      return false;
    }

    // Check if ability would exceed cap (18 at level 1)
    const currentScore = currentAbilities[abilityId];
    if (currentScore >= 18) {
      return false;
    }

    // If not allowing duplicates and already selected
    if (!choice.allowDuplicates && selectedAbilities.includes(abilityId)) {
      return false;
    }

    return true;
  };

  // Toggle ability selection
  const toggleAbility = (abilityId: AbilityId) => {
    if (selectedAbilities.includes(abilityId)) {
      // Deselect
      setSelectedAbilities(selectedAbilities.filter(id => id !== abilityId));
    } else if (canSelectAbility(abilityId)) {
      // Select
      setSelectedAbilities([...selectedAbilities, abilityId]);
    }
  };

  // Check if selection is complete
  const isComplete = selectedAbilities.length === choice.count;

  // Predict new scores after boost
  const predictedScores = useMemo(() => {
    const predicted: Record<AbilityId, number> = { ...currentAbilities };
    for (const abilityId of selectedAbilities) {
      predicted[abilityId] += 2; // Standard boost value
    }
    return predicted;
  }, [currentAbilities, selectedAbilities]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "1.5rem",
        border: "1px solid #444",
        borderRadius: "0.5rem",
        backgroundColor: "#2d2d2d",
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: "600", color: "#e0e0e0" }}>
          {choice.label}
        </h3>
        <p style={{ margin: 0, color: "#a0a0a0", fontSize: "0.875rem" }}>
          Select {choice.count} {choice.count === 1 ? "ability" : "abilities"} to boost by +2
        </p>
        <p style={{ margin: "0.25rem 0 0 0", color: "#daa520", fontSize: "0.875rem", fontWeight: "500" }}>
          {selectedAbilities.length} / {choice.count} selected
        </p>
      </div>

      {/* Ability Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {abilityIds.map((abilityId) => {
          const currentScore = currentAbilities[abilityId];
          const currentModifier = getModifier(currentScore);
          const predictedScore = predictedScores[abilityId];
          const predictedModifier = getModifier(predictedScore);
          const isSelected = selectedAbilities.includes(abilityId);
          const isSelectable = canSelectAbility(abilityId);
          const wouldExceedCap = currentScore >= 18;

          return (
            <button
              key={abilityId}
              type="button"
              onClick={() => toggleAbility(abilityId)}
              disabled={!isSelectable && !isSelected}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "1rem",
                border: isSelected ? "2px solid #daa520" : "1px solid #444",
                borderRadius: "0.375rem",
                backgroundColor: isSelected ? "#3a3a2d" : "#1a1a1a",
                cursor: isSelectable || isSelected ? "pointer" : "not-allowed",
                opacity: isSelectable || isSelected ? 1 : 0.5,
                transition: "all 0.2s",
                color: "#e0e0e0",
              }}
              onMouseEnter={(e) => {
                if (isSelectable || isSelected) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Ability Name */}
              <div style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.5rem", color: "#e0e0e0" }}>
                {abilityId}
              </div>

              {/* Current Score and Modifier */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: "600", color: "#e0e0e0" }}>{currentScore}</span>
                <span style={{ fontSize: "1rem", color: "#a0a0a0" }}>
                  ({formatModifier(currentModifier)})
                </span>
              </div>

              {/* Prediction */}
              {isSelected && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid #444",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "#a0a0a0", marginBottom: "0.25rem" }}>
                    After boost
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", justifyContent: "center" }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "600", color: "#daa520" }}>
                      {predictedScore}
                    </span>
                    <span style={{ fontSize: "0.875rem", color: "#daa520" }}>
                      ({formatModifier(predictedModifier)})
                    </span>
                  </div>
                </div>
              )}

              {/* Warning if at cap */}
              {wouldExceedCap && !isSelected && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#8b0000" }}>
                  At maximum
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #444",
              borderRadius: "0.375rem",
              backgroundColor: "#1a1a1a",
              color: "#e0e0e0",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={() => onResolve(choice.id, selectedAbilities)}
          disabled={!isComplete}
          style={{
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "0.375rem",
            backgroundColor: isComplete ? "#daa520" : "#444",
            color: isComplete ? "#1a1a1a" : "#666",
            cursor: isComplete ? "pointer" : "not-allowed",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
