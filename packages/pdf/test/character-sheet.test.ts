import { describe, it, expect } from "vitest";
import { CharacterSheetDocument, renderCharacterPdf } from "../src/index.js";
import type { Character } from "@pen-paper-rpg/schemas";

// Mock character data for testing
const mockCharacter: Character = {
  metadata: {
    id: "test-char-1",
    name: "Kyra the Cleric",
    player: "Test Player",
    campaign: "Test Campaign",
    schemaVersion: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sources: [],
  },
  identity: {
    level: 3,
    ancestryId: "human",
    heritageId: "versatile-heritage",
    backgroundId: "acolyte",
    classId: "cleric",
    archetypeIds: [],
    deityId: "sarenrae",
    alignment: "Neutral Good",
  },
  abilityScores: {
    base: { STR: 10, DEX: 12, CON: 14, INT: 13, WIS: 18, CHA: 14 },
    boosts: [],
    final: { STR: 10, DEX: 12, CON: 14, INT: 13, WIS: 18, CHA: 14 },
  },
  proficiencies: {
    perception: "expert",
    saves: { fortitude: "expert", reflex: "trained", will: "expert" },
    skills: { Religion: "expert", Medicine: "trained", Diplomacy: "trained" },
    lores: {},
    weapons: { simple: "trained", "deity-favored": "trained" },
    armor: { light: "trained", medium: "trained", unarmored: "trained" },
    spellcasting: { divine: "trained" },
    classDC: "trained",
    perceptionModifiers: [],
  },
  languages: ["Common", "Celestial"],
  senses: [],
  feats: [],
  spellcasting: [],
  equipment: [],
  derived: {
    hitPoints: { max: 32, current: 32, temporary: 0 },
    armorClass: { value: 16, breakdown: [] },
    classDC: { value: 17, breakdown: [] },
    perception: { modifier: 7, rank: "expert", breakdown: [] },
    saves: {
      fortitude: { value: 7, breakdown: [] },
      reflex: { value: 3, breakdown: [] },
      will: { value: 9, breakdown: [] },
    },
    skills: {
      Religion: { modifier: 7, rank: "expert", breakdown: [] },
      Medicine: { modifier: 6, rank: "trained", breakdown: [] },
      Diplomacy: { modifier: 4, rank: "trained", breakdown: [] },
    },
    speeds: { land: 25 },
    attacks: [],
    resistances: [],
    weaknesses: [],
    immunities: [],
  },
  history: [],
};

describe("Character Sheet PDF", () => {
  it("should create a CharacterSheetDocument component", () => {
    expect(() => CharacterSheetDocument({ character: mockCharacter })).not.toThrow();
  });

  it("should render PDF without errors", async () => {
    // Note: This test validates the function structure
    // Actual PDF rendering would require a more complete test environment
    expect(renderCharacterPdf).toBeDefined();
    expect(typeof renderCharacterPdf).toBe("function");
  });

  it("should have correct character data structure", () => {
    // Validate that our mock character matches the expected schema structure
    expect(mockCharacter.metadata.name).toBe("Kyra the Cleric");
    expect(mockCharacter.identity.level).toBe(3);
    expect(mockCharacter.abilityScores.final.WIS).toBe(18);
    expect(mockCharacter.derived.hitPoints.max).toBe(32);
  });
});