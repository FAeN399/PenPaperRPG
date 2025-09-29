import { describe, expect, it } from "vitest";
import { renderCharacterPdf } from "../src/index.js";
import type { Character } from "@pen-paper-rpg/schemas";

describe("PDF Generation", () => {
  const sampleCharacter: Character = {
    metadata: {
      id: "test-char-001",
      name: "Valeros the Bold",
      player: "Test Player",
      campaign: "Test Campaign",
      schemaVersion: "0.1.0",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: [
        {
          id: "pf2e-core",
          hash: "abc123",
        },
      ],
    },
    identity: {
      level: 3,
      ancestryId: "pf2e.ancestry.human",
      heritageId: "pf2e.heritage.versatile-human",
      backgroundId: "pf2e.background.warrior",
      classId: "pf2e.class.fighter",
      archetypeIds: [],
      deityId: "pf2e.deity.iomedae",
      alignment: "Lawful Good",
    },
    abilityScores: {
      base: {
        STR: 14,
        DEX: 12,
        CON: 14,
        INT: 10,
        WIS: 13,
        CHA: 8,
      },
      boosts: [],
      final: {
        STR: 16,
        DEX: 14,
        CON: 16,
        INT: 10,
        WIS: 13,
        CHA: 8,
      },
    },
    proficiencies: {
      perception: "expert",
      saves: {
        fortitude: "expert",
        reflex: "trained",
        will: "trained",
      },
      skills: {
        Acrobatics: "trained",
        Athletics: "expert",
        Intimidation: "trained",
        Medicine: "trained",
      },
      lores: {
        "Warfare Lore": "trained",
      },
      weapons: {
        "weapon:simple": "trained",
        "weapon:martial": "expert",
        "weapon:unarmed": "trained",
      },
      armor: {
        unarmored: "trained",
        light: "trained",
        medium: "trained",
        heavy: "trained",
        shields: "trained",
      },
      spellcasting: {},
      classDC: "expert",
      perceptionModifiers: [],
    },
    languages: ["Common", "Draconic", "Orcish"],
    senses: ["Low-Light Vision"],
    feats: [
      {
        id: "feat-001",
        grantedBy: "class",
        level: 1,
        replaced: false,
        choices: {},
      },
    ],
    spellcasting: [],
    equipment: [
      {
        id: "equipment-001",
        name: "Longsword +1",
        sourceId: "pf2e.equipment.longsword-1",
        quantity: 1,
        invested: true,
        notes: "Primary weapon",
        runes: ["striking"],
        metadata: {},
      },
    ],
    derived: {
      hitPoints: {
        max: 39,
        current: 35,
        temporary: 5,
      },
      armorClass: {
        value: 19,
        breakdown: [
          { type: "untyped", label: "Base", value: 10, source: "system" },
          { type: "item", label: "Chain Mail", value: 6, source: "equipment" },
          { type: "untyped", label: "Dex Modifier", value: 1, source: "ability" },
          { type: "item", label: "Shield", value: 2, source: "equipment" },
        ],
      },
      classDC: {
        value: 20,
        breakdown: [
          { type: "untyped", label: "Base", value: 10, source: "system" },
          { type: "untyped", label: "Proficiency", value: 6, source: "proficiency" },
          { type: "untyped", label: "Key Ability", value: 3, source: "ability" },
          { type: "item", label: "Magic Weapon", value: 1, source: "equipment" },
        ],
      },
      perception: {
        modifier: 8,
        rank: "expert",
        breakdown: [
          { type: "untyped", label: "Proficiency", value: 6, source: "proficiency" },
          { type: "untyped", label: "Wisdom", value: 1, source: "ability" },
          { type: "item", label: "Magic Item", value: 1, source: "equipment" },
        ],
      },
      saves: {
        fortitude: {
          value: 10,
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 6, source: "proficiency" },
            { type: "untyped", label: "Constitution", value: 3, source: "ability" },
            { type: "item", label: "Magic Item", value: 1, source: "equipment" },
          ],
        },
        reflex: {
          value: 6,
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 4, source: "proficiency" },
            { type: "untyped", label: "Dexterity", value: 2, source: "ability" },
          ],
        },
        will: {
          value: 5,
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 4, source: "proficiency" },
            { type: "untyped", label: "Wisdom", value: 1, source: "ability" },
          ],
        },
      },
      skills: {
        Acrobatics: {
          modifier: 6,
          rank: "trained",
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 4, source: "proficiency" },
            { type: "untyped", label: "Dexterity", value: 2, source: "ability" },
          ],
        },
        Athletics: {
          modifier: 9,
          rank: "expert",
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 6, source: "proficiency" },
            { type: "untyped", label: "Strength", value: 3, source: "ability" },
          ],
        },
        Intimidation: {
          modifier: 3,
          rank: "trained",
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 4, source: "proficiency" },
            { type: "untyped", label: "Charisma", value: -1, source: "ability" },
          ],
        },
        Medicine: {
          modifier: 5,
          rank: "trained",
          breakdown: [
            { type: "untyped", label: "Proficiency", value: 4, source: "proficiency" },
            { type: "untyped", label: "Wisdom", value: 1, source: "ability" },
          ],
        },
      },
      speeds: {
        land: 25,
        climb: 15,
      },
      attacks: [
        {
          label: "Longsword +1",
          weaponId: "longsword-1",
          attackBonus: 12,
          damage: "1d8+4 slashing",
          traits: ["versatile P"],
        },
        {
          label: "Composite Longbow",
          weaponId: "composite-longbow",
          attackBonus: 8,
          damage: "1d8+1 piercing",
          traits: ["deadly d10", "propulsive", "range 100", "reload 0", "volley 30"],
        },
      ],
      resistances: [
        {
          type: "Fire",
          value: 5,
          notes: "From ancestral trait",
        },
      ],
      weaknesses: [],
      immunities: ["Sleep"],
    },
    notes: {
      appearance: "A tall, muscular human warrior with graying hair and battle scars.",
      backstory: "Former city guard turned adventurer seeking to protect the innocent.",
      allies: "Members of the Pathfinder Society",
      campaigns: "Age of Ashes Adventure Path",
    },
    history: [
      {
        id: "history-001",
        level: 1,
        timestamp: new Date().toISOString(),
        description: "Character created",
        operations: [],
      },
    ],
  };

  it("should generate PDF without errors", async () => {
    const pdfBuffer = await renderCharacterPdf(sampleCharacter);

    expect(pdfBuffer).toBeInstanceOf(ArrayBuffer);
    expect(pdfBuffer.byteLength).toBeGreaterThan(0);
  });

  it("should handle minimal character data", async () => {
    const minimalCharacter: Character = {
      metadata: {
        id: "minimal-char",
        name: "Minimal Character",
        schemaVersion: "0.1.0",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sources: [],
      },
      identity: {
        level: 1,
        ancestryId: "pf2e.ancestry.human",
        backgroundId: "pf2e.background.acolyte",
        classId: "pf2e.class.cleric",
        archetypeIds: [],
      },
      abilityScores: {
        base: {
          STR: 10,
          DEX: 10,
          CON: 10,
          INT: 10,
          WIS: 10,
          CHA: 10,
        },
        boosts: [],
        final: {
          STR: 10,
          DEX: 10,
          CON: 10,
          INT: 10,
          WIS: 10,
          CHA: 10,
        },
      },
      proficiencies: {
        perception: "trained",
        saves: {
          fortitude: "trained",
          reflex: "trained",
          will: "expert",
        },
        skills: {},
        lores: {},
        weapons: {},
        armor: {},
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
        hitPoints: { max: 8, current: 8, temporary: 0 },
        armorClass: { value: 10, breakdown: [] },
        perception: { modifier: 2, rank: "trained", breakdown: [] },
        saves: {
          fortitude: { value: 2, breakdown: [] },
          reflex: { value: 2, breakdown: [] },
          will: { value: 4, breakdown: [] },
        },
        skills: {},
        speeds: { land: 25 },
        attacks: [],
        resistances: [],
        weaknesses: [],
        immunities: [],
      },
      history: [],
    };

    const pdfBuffer = await renderCharacterPdf(minimalCharacter);

    expect(pdfBuffer).toBeInstanceOf(ArrayBuffer);
    expect(pdfBuffer.byteLength).toBeGreaterThan(0);
  });
});