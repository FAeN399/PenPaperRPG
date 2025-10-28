"use client";

import type { AbilityId } from "@pen-paper-rpg/schemas";
import type { CharacterBuilderState } from "@/hooks/useCharacterBuilder";

interface CharacterStatsSidebarProps {
  builderState: CharacterBuilderState;
}

export function CharacterStatsSidebar({ builderState }: CharacterStatsSidebarProps): JSX.Element {
  const { character } = builderState;
  const { identity, abilityScores, derived } = character;

  const getModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const abilities: AbilityId[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

  return (
    <aside
      style={{
        width: "320px",
        backgroundColor: "#2d2d2d",
        borderRight: "1px solid #444",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          color: "#daa520",
          fontSize: "1.125rem",
          marginBottom: "1rem",
        }}
      >
        Character Stats
      </h3>

      <div>
        <StatRow label="Name" value={character.metadata.name || "Unnamed Character"} />
        <StatRow label="Level" value={identity.level.toString()} />
        <StatRow label="Ancestry" value={identity.ancestryId || "-"} />
        <StatRow label="Background" value={identity.backgroundId || "-"} />
        <StatRow label="Class" value={identity.classId || "-"} />
      </div>

      <h4
        style={{
          color: "#daa520",
          fontSize: "0.875rem",
          marginBottom: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Ability Scores
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginTop: "0.5rem",
        }}
      >
        {abilities.map((abilityId) => {
          const score = abilityScores.final[abilityId];
          const modifier = getModifier(score);

          return (
            <div
              key={abilityId}
              style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#a0a0a0",
                  textTransform: "uppercase",
                }}
              >
                {abilityId}
              </div>
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#e0e0e0",
                }}
              >
                {modifier}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#a0a0a0",
                }}
              >
                {score}
              </div>
            </div>
          );
        })}
      </div>

      <h4
        style={{
          color: "#daa520",
          fontSize: "0.875rem",
          marginBottom: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Combat
      </h4>
      <div>
        <StatRow label="HP" value={`${derived.hitPoints.current} / ${derived.hitPoints.max}`} />
        <StatRow label="AC" value={derived.armorClass.value.toString()} />
        {derived.classDC && <StatRow label="Class DC" value={derived.classDC.value.toString()} />}
        <StatRow label="Perception" value={`${derived.perception.modifier >= 0 ? "+" : ""}${derived.perception.modifier}`} />
        <StatRow label="Speed" value={`${derived.speeds.land} ft`} />
      </div>

      <h4
        style={{
          color: "#daa520",
          fontSize: "0.875rem",
          marginBottom: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Saving Throws
      </h4>
      <div>
        <StatRow label="Fortitude" value={`${derived.saves.fortitude.value >= 0 ? "+" : ""}${derived.saves.fortitude.value}`} />
        <StatRow label="Reflex" value={`${derived.saves.reflex.value >= 0 ? "+" : ""}${derived.saves.reflex.value}`} />
        <StatRow label="Will" value={`${derived.saves.will.value >= 0 ? "+" : ""}${derived.saves.will.value}`} />
      </div>
    </aside>
  );
}

function StatRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.875rem",
        marginBottom: "0.5rem",
      }}
    >
      <span style={{ color: "#a0a0a0" }}>{label}:</span>
      <span style={{ color: "#e0e0e0" }}>{value}</span>
    </div>
  );
}
