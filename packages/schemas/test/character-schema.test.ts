import { describe, expect, it } from "vitest";
import { abilityIds, characterSchema, effectSchema } from "../src/index";

describe("schemas", () => {
  it("exposes six ability identifiers", () => {
    expect(abilityIds).toHaveLength(6);
    expect(abilityIds).toContain("STR");
  });

  it("validates a minimal character payload", () => {
    const now = new Date().toISOString();
    const result = characterSchema.safeParse({
      metadata: {
        id: "char-0001",
        name: "Test Hero",
        schemaVersion: "0.1.0",
        createdAt: now,
        updatedAt: now,
        sources: [],
      },
      identity: {
        level: 1,
        ancestryId: "pf2e.ancestry.human",
        backgroundId: "pf2e.background.blacksmith",
        classId: "pf2e.class.fighter",
        archetypeIds: [],
      },
      abilityScores: {
        base: {
          STR: 12,
          DEX: 12,
          CON: 12,
          INT: 10,
          WIS: 10,
          CHA: 10,
        },
        boosts: [],
        final: {
          STR: 12,
          DEX: 12,
          CON: 12,
          INT: 10,
          WIS: 10,
          CHA: 10,
        },
      },
      proficiencies: {
        perception: "trained",
        saves: {
          fortitude: "expert",
          reflex: "trained",
          will: "trained",
        },
        skills: {
          Acrobatics: "trained",
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
      },
      languages: [],
      senses: [],
      feats: [],
      spellcasting: [],
      equipment: [],
      derived: {
        hitPoints: { max: 20, current: 20, temporary: 0 },
        armorClass: { value: 16, breakdown: [] },
        classDC: { value: 16, breakdown: [] },
        perception: { modifier: 5, rank: "trained", breakdown: [] },
        saves: {
          fortitude: { value: 7, breakdown: [] },
          reflex: { value: 5, breakdown: [] },
          will: { value: 5, breakdown: [] },
        },
        skills: {
          Acrobatics: { modifier: 5, rank: "trained", breakdown: [] },
        },
        speeds: { land: 25 },
        attacks: [],
        resistances: [],
        weaknesses: [],
        immunities: [],
      },
      history: [],
    });

    expect(result.success).toBe(true);
  });

  it("validates a proficiency effect", () => {
    const parsed = effectSchema.safeParse({
      kind: "grantProficiency",
      target: "skills:Athletics",
      rank: "trained",
    });
    expect(parsed.success).toBe(true);
  });
});
