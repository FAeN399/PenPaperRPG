"use client";

import React, { useMemo, useState } from "react";
import type { CatalogIndex, CatalogIndexEntry } from "@pen-paper-rpg/schemas";
import type { CatalogLookup } from "@pen-paper-rpg/engine";
import type { FeatCategory } from "@pen-paper-rpg/schemas";

interface FeatSlot {
  category: FeatCategory;
  label: string;
  grantedBy: string; // What grants this feat (e.g., "ancestry", "class", "background")
}

interface FeatSelectorProps {
  catalog: CatalogIndex;
  catalogLookup: CatalogLookup;
  ancestryId: string;
  classId: string;
  backgroundId: string;
  slots: FeatSlot[];
  selectedFeats: Array<{ slotIndex: number; featId: string }>;
  onSelectionChange: (selections: Array<{ slotIndex: number; featId: string }>) => void;
  onConfirm: () => void;
}

export function FeatSelector({
  catalog,
  catalogLookup,
  ancestryId,
  classId,
  backgroundId,
  slots,
  selectedFeats,
  onSelectionChange,
  onConfirm,
}: FeatSelectorProps): JSX.Element {
  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(0);

  // Get all level 1 feats from catalog
  const allFeats = useMemo(() => {
    return catalog.entities.filter((entry) => {
      const entity = entry.entity;
      if (!entity || entity.type !== "feat") return false;
      const feat = entity as any;
      return feat.level === 1; // Only level 1 feats at character creation
    });
  }, [catalog.entities]);

  // Filter feats by category and ancestry/class
  const availableFeatsForSlot = useMemo(() => {
    if (!slots[activeSlotIndex]) return [];

    const slot = slots[activeSlotIndex];
    const category = slot.category;

    return allFeats.filter((entry) => {
      const feat = entry.entity as any;

      // Filter by category
      if (feat.category !== category) return false;

      // Filter by ancestry for ancestry feats
      if (category === "ancestry") {
        const ancestryName = ancestryId?.split('.').pop()?.toLowerCase();
        return feat.traits?.some((t: string) => t.toLowerCase() === ancestryName);
      }

      // Filter by class for class feats
      if (category === "class") {
        const className = classId?.split('.').pop()?.toLowerCase();
        return feat.traits?.some((t: string) => t.toLowerCase() === className);
      }

      // Skill and general feats are available to all
      return true;
    });
  }, [activeSlotIndex, slots, allFeats, ancestryId, classId]);

  const handleFeatToggle = (slotIndex: number, featId: string) => {
    const existingSelection = selectedFeats.find((s) => s.slotIndex === slotIndex);

    let newSelections;
    if (existingSelection?.featId === featId) {
      // Deselect if clicking the same feat
      newSelections = selectedFeats.filter((s) => s.slotIndex !== slotIndex);
    } else {
      // Replace selection for this slot
      newSelections = [
        ...selectedFeats.filter((s) => s.slotIndex !== slotIndex),
        { slotIndex, featId },
      ];
    }

    onSelectionChange(newSelections);
  };

  const currentSlotSelection = selectedFeats.find((s) => s.slotIndex === activeSlotIndex);
  const allSlotsSelected = selectedFeats.length === slots.length;

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "#2d2d2d",
        borderRadius: "8px",
        border: "1px solid #444",
      }}
    >
      <h3
        style={{
          color: "#daa520",
          fontSize: "1.25rem",
          marginBottom: "1rem",
        }}
      >
        Select Feats
      </h3>

      {/* Slot Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {slots.map((slot, index) => {
          const isActive = index === activeSlotIndex;
          const hasSelection = selectedFeats.some((s) => s.slotIndex === index);

          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlotIndex(index)}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: isActive ? "#daa520" : hasSelection ? "#2d6b2d" : "#1a1a1a",
                border: `2px solid ${isActive ? "#daa520" : hasSelection ? "#4ade80" : "#444"}`,
                borderRadius: "6px",
                color: isActive ? "#000" : hasSelection ? "#4ade80" : "#ccc",
                fontSize: "0.9rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {hasSelection && "✓ "}
              {slot.label}
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div
        style={{
          marginBottom: "1.5rem",
          padding: "0.75rem",
          backgroundColor: "#1a1a1a",
          borderRadius: "4px",
          border: "1px solid #444",
        }}
      >
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          <strong>Progress:</strong> {selectedFeats.length}/{slots.length} feats selected
        </p>
        {currentSlotSelection && (
          <p style={{ color: "#4ade80", fontSize: "0.85rem", margin: 0 }}>
            ✓ {catalogLookup.byId.get(currentSlotSelection.featId)?.entity?.name || "Selected"}
          </p>
        )}
      </div>

      {/* Available Feats Grid */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            color: "#daa520",
            fontSize: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          {slots[activeSlotIndex]?.label || "Select a Slot"}
        </h4>

        {availableFeatsForSlot.length === 0 ? (
          <p style={{ color: "#888", fontSize: "0.9rem", padding: "1rem" }}>
            No feats available for this slot.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "0.75rem",
              maxHeight: "500px",
              overflowY: "auto",
              padding: "0.5rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "4px",
            }}
          >
            {availableFeatsForSlot.map((entry) => {
              const feat = entry.entity as any;
              const isSelected = currentSlotSelection?.featId === feat.id;

              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => handleFeatToggle(activeSlotIndex, feat.id)}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: isSelected ? "#daa520" : "#2d2d2d",
                    border: `2px solid ${isSelected ? "#daa520" : "#444"}`,
                    borderRadius: "6px",
                    color: isSelected ? "#000" : "#ccc",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#daa520";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#444";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isSelected && "✓ "}
                    {feat.name}
                    {feat.actionCost?.type && (
                      <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                        [{feat.actionCost.type === "one" ? "1 action" :
                          feat.actionCost.type === "two" ? "2 actions" :
                          feat.actionCost.type === "three" ? "3 actions" :
                          feat.actionCost.type}]
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8, marginBottom: "0.25rem" }}>
                    {feat.summary || "No description available"}
                  </div>
                  {feat.traits && feat.traits.length > 0 && (
                    <div style={{ fontSize: "0.75rem", opacity: 0.7, marginTop: "0.25rem" }}>
                      <em>Traits: {feat.traits.join(", ")}</em>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={!allSlotsSelected}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: allSlotsSelected ? "#4ade80" : "#444",
          border: "none",
          borderRadius: "6px",
          color: allSlotsSelected ? "#000" : "#888",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: allSlotsSelected ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          width: "100%",
        }}
      >
        {allSlotsSelected
          ? "Confirm Feat Selection"
          : `Select ${slots.length - selectedFeats.length} more feat(s)`}
      </button>
    </div>
  );
}
