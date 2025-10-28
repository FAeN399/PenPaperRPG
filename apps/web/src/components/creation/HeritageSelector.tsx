"use client";

import React from "react";
import type { CatalogIndex, CatalogLookup, CatalogIndexEntry } from "@pen-paper-rpg/catalog";

interface HeritageSelectorProps {
  catalog: CatalogIndex;
  catalogLookup: CatalogLookup;
  ancestryId: string;
  selectedHeritageId: string | null;
  onSelect: (heritageId: string) => void;
}

export function HeritageSelector({
  catalog,
  catalogLookup,
  ancestryId,
  selectedHeritageId,
  onSelect,
}: HeritageSelectorProps): JSX.Element {
  // Filter heritages for the selected ancestry
  const availableHeritages = React.useMemo(() => {
    return catalog.entities.filter((entry) => {
      const entity = entry.entity;
      if (!entity || entity.type !== "heritage") return false;
      const heritage = entity as any;
      return heritage.ancestryId === ancestryId;
    });
  }, [catalog.entities, ancestryId]);

  // Get ancestry name for display
  const ancestryEntity = catalogLookup.byId.get(ancestryId)?.entity;
  const ancestryName = ancestryEntity?.name || "Unknown";

  if (availableHeritages.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          backgroundColor: "#2d2d2d",
          borderRadius: "8px",
          border: "1px solid #444",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#a0a0a0", fontSize: "1rem", margin: 0 }}>
          No heritages available for {ancestryName}.
        </p>
        <p style={{ color: "#888", fontSize: "0.875rem", marginTop: "0.5rem" }}>
          You can proceed to the next step.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#2d2d2d",
          borderRadius: "8px",
          border: "1px solid #daa520",
        }}
      >
        <h3 style={{ color: "#daa520", fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>
          Choose Your {ancestryName} Heritage
        </h3>
        <p style={{ color: "#ccc", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
          Your heritage represents your lineage and grants unique abilities.
          Select one heritage from the {availableHeritages.length} options below.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1rem",
        }}
      >
        {availableHeritages.map((entry) => {
          const heritage = entry.entity as any;
          const isSelected = selectedHeritageId === heritage.id;

          return (
            <button
              key={heritage.id}
              type="button"
              onClick={() => onSelect(heritage.id)}
              style={{
                padding: "1.25rem",
                backgroundColor: isSelected ? "#3a3a0a" : "#2d2d2d",
                border: `2px solid ${isSelected ? "#daa520" : "#444"}`,
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#daa520";
                  e.currentTarget.style.backgroundColor = "#353535";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#444";
                  e.currentTarget.style.backgroundColor = "#2d2d2d";
                }
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <h4
                  style={{
                    color: isSelected ? "#daa520" : "#e0e0e0",
                    fontSize: "1.125rem",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  {heritage.name}
                </h4>
                {isSelected && (
                  <span
                    style={{
                      color: "#daa520",
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* Summary */}
              {heritage.summary && (
                <p
                  style={{
                    color: isSelected ? "#d4d4aa" : "#a0a0a0",
                    fontSize: "0.875rem",
                    margin: 0,
                    lineHeight: 1.4,
                    fontStyle: "italic",
                  }}
                >
                  {heritage.summary}
                </p>
              )}

              {/* Traits */}
              {heritage.traits && heritage.traits.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {heritage.traits.map((trait: string) => (
                    <span
                      key={trait}
                      style={{
                        backgroundColor: isSelected ? "#4a4a1a" : "#1a1a1a",
                        color: isSelected ? "#daa520" : "#888",
                        fontSize: "0.7rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        textTransform: "uppercase",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {heritage.description && (
                <p
                  style={{
                    color: isSelected ? "#ccc" : "#888",
                    fontSize: "0.8rem",
                    margin: 0,
                    lineHeight: 1.5,
                    borderTop: "1px solid #444",
                    paddingTop: "0.75rem",
                  }}
                >
                  {heritage.description}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {selectedHeritageId && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#1a3a1a",
            border: "1px solid #4ade80",
            borderRadius: "8px",
          }}
        >
          <p style={{ color: "#4ade80", fontSize: "0.9rem", margin: 0 }}>
            ✓ Heritage selected: {catalogLookup.byId.get(selectedHeritageId)?.entity?.name}
          </p>
        </div>
      )}
    </div>
  );
}
