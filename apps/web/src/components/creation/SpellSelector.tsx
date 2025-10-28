"use client";

import React from "react";
import type { CatalogIndex, CatalogLookup } from "@pen-paper-rpg/catalog";

interface SpellSelectorProps {
  catalog: CatalogIndex;
  catalogLookup: CatalogLookup;
  tradition: "arcane" | "divine" | "occult" | "primal";
  castingType: "prepared" | "spontaneous";
  cantripsNeeded: number;
  rank1SpellsNeeded: number;
  selectedCantrips: string[];
  selectedRank1Spells: string[];
  onSelectionChange: (cantrips: string[], rank1Spells: string[]) => void;
  onConfirm: () => void;
}

export function SpellSelector({
  catalog,
  catalogLookup,
  tradition,
  castingType,
  cantripsNeeded,
  rank1SpellsNeeded,
  selectedCantrips,
  selectedRank1Spells,
  onSelectionChange,
  onConfirm,
}: SpellSelectorProps): JSX.Element {
  // Filter spells by tradition and rank
  const allSpells = catalog.entities.filter((entry) => {
    const entity = entry.entity;
    if (!entity || entity.type !== "spell") return false;

    const spell = entity as any;
    // Check if spell belongs to this tradition
    if (!spell.traditions || !spell.traditions.includes(tradition)) return false;

    return true;
  });

  const cantrips = allSpells.filter((entry) => {
    const spell = entry.entity as any;
    return spell.rank === 0;
  });

  const rank1Spells = allSpells.filter((entry) => {
    const spell = entry.entity as any;
    return spell.rank === 1;
  });

  const handleCantripToggle = (spellId: string) => {
    const newSelection = selectedCantrips.includes(spellId)
      ? selectedCantrips.filter((id) => id !== spellId)
      : [...selectedCantrips, spellId];

    onSelectionChange(newSelection, selectedRank1Spells);
  };

  const handleRank1Toggle = (spellId: string) => {
    const newSelection = selectedRank1Spells.includes(spellId)
      ? selectedRank1Spells.filter((id) => id !== spellId)
      : [...selectedRank1Spells, spellId];

    onSelectionChange(selectedCantrips, newSelection);
  };

  const cantripsSelected = selectedCantrips.length;
  const rank1Selected = selectedRank1Spells.length;
  const isComplete = cantripsSelected === cantripsNeeded && rank1Selected === rank1SpellsNeeded;

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
        Select Spells
      </h3>

      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#1a1a1a",
          borderRadius: "4px",
          border: "1px solid #444",
        }}
      >
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          <strong>Tradition:</strong> {tradition.charAt(0).toUpperCase() + tradition.slice(1)}
        </p>
        <p style={{ color: "#ccc", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          <strong>Casting Type:</strong> {castingType.charAt(0).toUpperCase() + castingType.slice(1)}
        </p>
        <p style={{ color: "#ccc", fontSize: "0.9rem" }}>
          {castingType === "prepared" ? (
            <>
              <strong>Note:</strong> Prepared casters can change their prepared spells daily. At level 1, you choose which spells go in your spellbook/prayer list, then prepare a subset each day.
            </>
          ) : (
            <>
              <strong>Note:</strong> Spontaneous casters have a fixed spell repertoire but can cast any known spell using available slots.
            </>
          )}
        </p>
      </div>

      {/* Cantrips Section */}
      <div style={{ marginBottom: "2rem" }}>
        <h4
          style={{
            color: "#daa520",
            fontSize: "1rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Cantrips (Rank 0)
          <span
            style={{
              fontSize: "0.85rem",
              color: cantripsSelected === cantripsNeeded ? "#4ade80" : "#888",
              fontWeight: "normal",
            }}
          >
            {cantripsSelected}/{cantripsNeeded} selected
          </span>
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "0.75rem",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "0.5rem",
            backgroundColor: "#1a1a1a",
            borderRadius: "4px",
          }}
        >
          {cantrips.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem", padding: "1rem" }}>
              No cantrips available for this tradition.
            </p>
          ) : (
            cantrips.map((entry) => {
              const spell = entry.entity as any;
              const isSelected = selectedCantrips.includes(spell.id);
              const isDisabled = !isSelected && cantripsSelected >= cantripsNeeded;

              return (
                <button
                  key={spell.id}
                  type="button"
                  onClick={() => handleCantripToggle(spell.id)}
                  disabled={isDisabled}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: isSelected ? "#daa520" : "#2d2d2d",
                    border: `2px solid ${isSelected ? "#daa520" : "#444"}`,
                    borderRadius: "6px",
                    color: isSelected ? "#000" : "#ccc",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    opacity: isDisabled ? 0.4 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.borderColor = "#daa520";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#444";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {isSelected && "✓ "}
                    {spell.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    {spell.summary || "No description available"}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Rank 1 Spells Section */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            color: "#daa520",
            fontSize: "1rem",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          1st-Level Spells
          <span
            style={{
              fontSize: "0.85rem",
              color: rank1Selected === rank1SpellsNeeded ? "#4ade80" : "#888",
              fontWeight: "normal",
            }}
          >
            {rank1Selected}/{rank1SpellsNeeded} selected
          </span>
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "0.75rem",
            maxHeight: "300px",
            overflowY: "auto",
            padding: "0.5rem",
            backgroundColor: "#1a1a1a",
            borderRadius: "4px",
          }}
        >
          {rank1Spells.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem", padding: "1rem" }}>
              No 1st-level spells available for this tradition.
            </p>
          ) : (
            rank1Spells.map((entry) => {
              const spell = entry.entity as any;
              const isSelected = selectedRank1Spells.includes(spell.id);
              const isDisabled = !isSelected && rank1Selected >= rank1SpellsNeeded;

              return (
                <button
                  key={spell.id}
                  type="button"
                  onClick={() => handleRank1Toggle(spell.id)}
                  disabled={isDisabled}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: isSelected ? "#daa520" : "#2d2d2d",
                    border: `2px solid ${isSelected ? "#daa520" : "#444"}`,
                    borderRadius: "6px",
                    color: isSelected ? "#000" : "#ccc",
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    textAlign: "left",
                    fontSize: "0.9rem",
                    opacity: isDisabled ? 0.4 : 1,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isDisabled) {
                      e.currentTarget.style.borderColor = "#daa520";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#444";
                    }
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {isSelected && "✓ "}
                    {spell.name}
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                    {spell.summary || "No description available"}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={!isComplete}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: isComplete ? "#4ade80" : "#444",
          border: "none",
          borderRadius: "6px",
          color: isComplete ? "#000" : "#888",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: isComplete ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          width: "100%",
        }}
      >
        {isComplete ? "Confirm Spell Selection" : `Select ${cantripsNeeded - cantripsSelected} more cantrip(s) and ${rank1SpellsNeeded - rank1Selected} more 1st-level spell(s)`}
      </button>
    </div>
  );
}
