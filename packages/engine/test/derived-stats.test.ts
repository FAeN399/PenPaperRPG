import { describe, expect, it } from "vitest";
import {
  createCharacter,
  abilityModifier,
  applyAbilityAdjustments,
  computeDerivedStats,
} from "../src/index.js";
import type {
  AbilityAdjustmentLogEntry,
  AbilityScoreBlock,
  ProficiencySummary,
} from "@pen-paper-rpg/schemas";

describe("engine derived calculations", () => {
  const baseAbilities: AbilityScoreBlock = {
    STR: 10,
    DEX: 10,
    CON: 10,
    INT: 10,
    WIS: 10,
    CHA: 10,
  };

  const adjustments: AbilityAdjustmentLogEntry[] = [
    { type: "boost", abilities: ["STR"], value: 2, source: "ancestry" },
    { type: "boost", abilities: ["DEX"], value: 2, source: "background" },
    { type: "boost", abilities: ["CON"], value: 2, source: "class" },
  ];

  const proficiencies: ProficiencySummary = {
    perception: "trained",
    saves: {
      fortitude: "expert",
      reflex: "trained",
      will: "trained",
    },
    skills: {
      Athletics: "trained",
    },
    lores: {},
    weapons: {
      "weapon:martial": "trained",
    },
    armor: {
      unarmored: "trained",
    },
    spellcasting: {},
    classDC: "trained",
    perceptionModifiers: [],
  };

  it("applies ability adjustments and computes derived stats", () => {
    const finalAbilities = applyAbilityAdjustments(baseAbilities, adjustments);
    expect(finalAbilities.STR).toBe(12);
    expect(finalAbilities.CON).toBe(12);

    const character = createCharacter({
      metadata: {
        id: "char-001",
        name: "Derived Tester",
        schemaVersion: "0.1.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sources: [],
      },
      identity: {
        level: 1,
        ancestryId: "pf2e.ancestry.human",
        backgroundId: "pf2e.background.blacksmith",
        classId: "pf2e.class.fighter",
        archetypeIds: [],
      },
      baseAbilities,
      abilityAdjustments: adjustments,
      proficiencies,
      derivedContext: {
        ancestryHitPoints: 8,
        classHitPoints: 10,
        keyAbility: "STR",
        baseSpeed: 25,
      },
    });

    expect(character.derived.hitPoints.max).toBe(19);
    expect(character.derived.armorClass.value).toBe(14);
    expect(character.derived.perception.modifier).toBe(3);
    expect(character.derived.saves.fortitude.value).toBe(6);
    expect(character.derived.skills.Athletics.modifier).toBe(4);
    expect(abilityModifier(character.abilityScores.final.STR)).toBe(1);
  });
});
