"use client";

import React from "react";
import type { Character, AbilityId } from "@pen-paper-rpg/schemas";
import type { CatalogLookup } from "@pen-paper-rpg/engine";

interface CharacterSheetProps {
  character: Character;
  catalogLookup?: CatalogLookup;
}

export function CharacterSheet({ character, catalogLookup }: CharacterSheetProps): JSX.Element {
  const { metadata, identity, abilityScores, proficiencies, derived } = character;

  // Calculate ability modifiers
  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const abilities: AbilityId[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  // Get proficiency bonus
  const getProficiencyBonus = (rank: string): number => {
    const level = identity.level;
    switch (rank) {
      case "trained":
        return level + 2;
      case "expert":
        return level + 4;
      case "master":
        return level + 6;
      case "legendary":
        return level + 8;
      default:
        return 0;
    }
  };

  // Calculate perception modifier
  const perceptionMod = getProficiencyBonus(proficiencies.perception) +
    Math.floor((abilityScores.final.WIS - 10) / 2);

  // Calculate save modifiers
  const fortMod = getProficiencyBonus(proficiencies.saves.fortitude) +
    Math.floor((abilityScores.final.CON - 10) / 2);
  const refMod = getProficiencyBonus(proficiencies.saves.reflex) +
    Math.floor((abilityScores.final.DEX - 10) / 2);
  const willMod = getProficiencyBonus(proficiencies.saves.will) +
    Math.floor((abilityScores.final.WIS - 10) / 2);

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      background: "#1a1a1a",
      color: "#e0e0e0",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#2d2d2d",
        border: "2px solid #daa520",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        marginBottom: "1.5rem",
      }}>
        <h1 style={{
          fontSize: "2rem",
          fontWeight: "700",
          color: "#daa520",
          margin: "0 0 1rem 0",
        }}>
          {metadata.name}
        </h1>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          fontSize: "0.875rem",
        }}>
          <div>
            <span style={{ color: "#a0a0a0" }}>Ancestry: </span>
            <span style={{ fontWeight: "600" }}>{identity.ancestryId?.split('.').pop() || "—"}</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0" }}>Background: </span>
            <span style={{ fontWeight: "600" }}>{identity.backgroundId?.split('.').pop() || "—"}</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0" }}>Class: </span>
            <span style={{ fontWeight: "600" }}>{identity.classId?.split('.').pop() || "—"}</span>
          </div>
          <div>
            <span style={{ color: "#a0a0a0" }}>Level: </span>
            <span style={{ fontWeight: "600" }}>{identity.level}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>
        {/* Left Column - Ability Scores & Combat Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Ability Scores */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Ability Scores
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {abilities.map((abilityId) => {
                const score = abilityScores.final[abilityId];
                const modifier = getModifier(score);
                return (
                  <div
                    key={abilityId}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr 60px",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem",
                      background: "#1a1a1a",
                      borderRadius: "0.25rem",
                      border: "1px solid #333",
                    }}
                  >
                    <span style={{ fontWeight: "600", color: "#daa520" }}>
                      {abilityId}
                    </span>
                    <div style={{
                      height: "4px",
                      background: "#333",
                      borderRadius: "2px",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "1.25rem", fontWeight: "700" }}>
                        {modifier}
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#a0a0a0" }}>
                        ({score})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Combat Stats */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Combat
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <StatBox label="Hit Points" value={`${derived.hitPoints.current} / ${derived.hitPoints.max}`} />
              <StatBox label="Armor Class" value={derived.armorClass.value.toString()} />
              {derived.classDC && <StatBox label="Class DC" value={derived.classDC.value.toString()} />}
              <StatBox label="Perception" value={perceptionMod >= 0 ? `+${perceptionMod}` : `${perceptionMod}`} />
              <StatBox label="Speed" value={`${derived.speeds.land || 0} ft`} />
            </div>
          </div>

          {/* Saving Throws */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Saving Throws
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <SaveBox
                label="Fortitude"
                modifier={fortMod >= 0 ? `+${fortMod}` : `${fortMod}`}
                proficiency={capitalize(proficiencies.saves.fortitude)}
              />
              <SaveBox
                label="Reflex"
                modifier={refMod >= 0 ? `+${refMod}` : `${refMod}`}
                proficiency={capitalize(proficiencies.saves.reflex)}
              />
              <SaveBox
                label="Will"
                modifier={willMod >= 0 ? `+${willMod}` : `${willMod}`}
                proficiency={capitalize(proficiencies.saves.will)}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Skills, Feats, Equipment */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Skills */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Skills
            </h2>
            {Object.keys(proficiencies.skills).length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "0.5rem",
              }}>
                {Object.entries(proficiencies.skills).map(([skill, rank]) => {
                  const abilityMod = getSkillAbilityModifier(skill, abilityScores.final);
                  const profBonus = getProficiencyBonus(rank);
                  const totalMod = profBonus + abilityMod;
                  return (
                    <div
                      key={skill}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        background: "#1a1a1a",
                        borderRadius: "0.25rem",
                        border: "1px solid #333",
                      }}
                    >
                      <span style={{ fontWeight: "500" }}>{skill}</span>
                      <span style={{ color: "#daa520", fontWeight: "600" }}>
                        {totalMod >= 0 ? `+${totalMod}` : totalMod}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#a0a0a0", margin: 0 }}>No trained skills</p>
            )}
          </div>

          {/* Feats & Features */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Feats & Features
            </h2>
            {character.feats && character.feats.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {character.feats.map((feat) => {
                  const featEntity = catalogLookup?.byId.get(feat.id)?.entity as any;
                  return (
                    <div
                      key={feat.id}
                      style={{
                        background: "#1a1a1a",
                        border: "1px solid #444",
                        borderRadius: "0.375rem",
                        padding: "0.75rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.25rem" }}>
                        <h3 style={{
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "#e0e0e0",
                          margin: 0,
                        }}>
                          {featEntity?.name || feat.id}
                        </h3>
                        <span style={{
                          fontSize: "0.75rem",
                          color: "#a0a0a0",
                          textTransform: "capitalize",
                        }}>
                          {feat.grantedBy}
                        </span>
                      </div>
                      {featEntity?.summary && (
                        <p style={{ color: "#a0a0a0", fontSize: "0.875rem", margin: "0.25rem 0 0 0", lineHeight: 1.4 }}>
                          {featEntity.summary}
                        </p>
                      )}
                      {featEntity?.traits && featEntity.traits.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.5rem" }}>
                          {featEntity.traits.map((trait: string) => (
                            <span
                              key={trait}
                              style={{
                                background: "#2d2d2d",
                                color: "#888",
                                fontSize: "0.65rem",
                                padding: "0.125rem 0.375rem",
                                borderRadius: "9999px",
                                textTransform: "capitalize",
                              }}
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "#a0a0a0", fontSize: "0.875rem", margin: 0 }}>
                No feats selected yet.
              </p>
            )}
          </div>

          {/* Equipment */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Equipment
            </h2>
            <p style={{ color: "#a0a0a0", fontSize: "0.875rem", margin: 0 }}>
              Equipment inventory will be displayed here.
            </p>
          </div>

          {/* Notes */}
          <div style={{
            background: "#2d2d2d",
            border: "1px solid #444",
            borderRadius: "0.5rem",
            padding: "1rem",
          }}>
            <h2 style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#daa520",
              margin: "0 0 1rem 0",
            }}>
              Notes
            </h2>
            <textarea
              placeholder="Add character notes, backstory, or other details..."
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "0.75rem",
                background: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "0.25rem",
                color: "#e0e0e0",
                fontSize: "0.875rem",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 0.75rem",
      background: "#1a1a1a",
      borderRadius: "0.25rem",
      border: "1px solid #333",
    }}>
      <span style={{ color: "#a0a0a0", fontSize: "0.875rem" }}>{label}</span>
      <span style={{ fontWeight: "700", fontSize: "1.125rem", color: "#daa520" }}>{value}</span>
    </div>
  );
}

function SaveBox({ label, modifier, proficiency }: { label: string; modifier: string; proficiency: string }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.5rem 0.75rem",
      background: "#1a1a1a",
      borderRadius: "0.25rem",
      border: "1px solid #333",
    }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: "600" }}>{label}</span>
        <span style={{ fontSize: "0.75rem", color: "#a0a0a0" }}>{proficiency}</span>
      </div>
      <span style={{ fontWeight: "700", fontSize: "1.25rem", color: "#daa520" }}>{modifier}</span>
    </div>
  );
}

// Helper Functions
function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getSkillAbilityModifier(skill: string, abilities: Record<AbilityId, number>): number {
  const skillAbilityMap: Record<string, AbilityId> = {
    "Acrobatics": "DEX",
    "Arcana": "INT",
    "Athletics": "STR",
    "Crafting": "INT",
    "Deception": "CHA",
    "Diplomacy": "CHA",
    "Intimidation": "CHA",
    "Medicine": "WIS",
    "Nature": "WIS",
    "Occultism": "INT",
    "Performance": "CHA",
    "Religion": "WIS",
    "Society": "INT",
    "Stealth": "DEX",
    "Survival": "WIS",
    "Thievery": "DEX",
  };

  const ability = skillAbilityMap[skill] || "INT";
  return Math.floor((abilities[ability] - 10) / 2);
}
